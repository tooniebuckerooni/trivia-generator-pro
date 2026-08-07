// ================================================================
// Trivia Generator Pro — AI Question Generator: License + Usage Gateway
// Deploy to Cloudflare Workers (free tier)
//
// SETUP:
// 1. Worker named "tgp-ai-gateway" in Cloudflare dashboard (same account
//    used for bcg-license-verify, if reusing the bingo card generator's).
// 2. Create a Workers KV namespace (e.g. "TGP_USAGE") and bind it to this
//    Worker as USAGE_KV (Settings -> Bindings -> KV Namespace).
// 3. Settings -> Variables and Secrets -> add:
//      Name: LS_API_KEY          Value: your LemonSqueezy API key
//      Name: ANTHROPIC_API_KEY   Value: your Anthropic API key
// 4. In LemonSqueezy: create ONE product ("AI Question Generator") with
//    two subscription variants (e.g. Host / Pro Host). Copy each
//    variant's ID into TIER_CAPS below.
// 5. Add your production origin(s) to ALLOWED_ORIGINS below.
// 6. Deploy.
//
// Design notes (mirrors the licensing pattern proven in the bingo card
// generator's worker.js, adapted for metered usage instead of export
// gating):
//   - activate / validate fail OPEN on transport errors, so a Cloudflare
//     or LemonSqueezy outage doesn't lock a paying host out of the app.
//   - generate fails CLOSED, always. It's the only action with real
//     variable API cost, so any doubt (bad license, unreachable LS API,
//     unreadable KV) refuses the call rather than defaulting to "allow."
//   - Never hardcode a bypass/dev license code here. The bingo project
//     shipped one and had to find and remove it later — don't repeat it.
// ================================================================

const ALLOWED_ORIGINS = [
  'https://tooniebuckerooni.github.io', // GitHub Pages
  // add a custom domain here once one exists, e.g. 'https://triviageneratorpro.com'
];

// LemonSqueezy variant_id -> monthly generation cap.
// Fill in after creating the product/variants in the LemonSqueezy dashboard.
const TIER_CAPS = {
  'REPLACE_WITH_TIER1_VARIANT_ID': 100,
  'REPLACE_WITH_TIER2_VARIANT_ID': 300,
};

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_QUESTIONS_PER_CALL = 10;
const USAGE_KEY_TTL_SECONDS = 60 * 60 * 24 * 40; // 40 days - outlives the billing month, next month just uses a new key

function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.find(o => origin.startsWith(o)) || ALLOWED_ORIGINS[0];
}

function periodKey(licenseKey) {
  const now = new Date();
  const ym = now.getUTCFullYear() + '-' + String(now.getUTCMonth() + 1).padStart(2, '0');
  return 'usage:' + licenseKey + ':' + ym;
}

export default {
  async fetch(request, env) {

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': getAllowedOrigin(request),
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getAllowedOrigin(request),
    };

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ valid: false, error: 'Method not allowed' }), { status: 405, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid request body' }), { status: 400, headers });
    }

    const { license_key, instance_id, action } = body;

    if (!license_key) {
      return new Response(JSON.stringify({ valid: false, error: 'No license key provided' }), { status: 400, headers });
    }

    // --- GENERATE (fail CLOSED: the only action with real API cost) ---
    // Handled before the shared try/catch below so a license-check error
    // can never fall into the fail-open path further down. Any doubt here
    // means no generation, full stop.
    if (action === 'generate') {
      try {
        const lsRes = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.LS_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ license_key, instance_id: instance_id || undefined }),
        });
        const lsData = await lsRes.json();
        const isActive = lsData.valid === true && lsData.license_key?.status === 'active';
        if (!isActive) {
          return new Response(JSON.stringify({ ok: false, error: 'License not active.' }), { headers });
        }

        const variantId = String(lsData.meta?.variant_id ?? '');
        const cap = TIER_CAPS[variantId];
        if (!cap) {
          return new Response(JSON.stringify({ ok: false, error: 'This license\'s plan does not include AI generation.' }), { headers });
        }

        if (!env.USAGE_KV) {
          return new Response(JSON.stringify({ ok: false, error: 'Usage tracking is not configured on the server.' }), { headers });
        }

        const key = periodKey(license_key);
        const used = parseInt((await env.USAGE_KV.get(key)) || '0', 10);
        if (used >= cap) {
          return new Response(JSON.stringify({
            ok: false,
            error: 'Monthly limit reached (' + cap + ' generations). Resets next month.',
            used, cap,
          }), { headers });
        }

        if (!env.ANTHROPIC_API_KEY) {
          return new Response(JSON.stringify({ ok: false, error: 'AI generation is not configured on the server.' }), { headers });
        }

        const count = Math.min(Math.max(parseInt(body.count, 10) || 10, 1), MAX_QUESTIONS_PER_CALL);
        const questions = await generateQuestions(env.ANTHROPIC_API_KEY, {
          topic: String(body.topic || '').slice(0, 200),
          difficulty: body.difficulty ? String(body.difficulty).slice(0, 40) : '',
          count,
        });

        // Increment only after a successful generation, so failed/errored
        // calls never burn the host's quota.
        await env.USAGE_KV.put(key, String(used + 1), { expirationTtl: USAGE_KEY_TTL_SECONDS });

        return new Response(JSON.stringify({ ok: true, questions, used: used + 1, cap }), { headers });
      } catch (e) {
        console.error('generate error:', e.message);
        return new Response(JSON.stringify({ ok: false, error: 'Generation failed - please try again.' }), { headers });
      }
    }

    try {
      // --- ACTIVATE (first use on a device) ---
      if (action === 'activate') {
        const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.LS_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            license_key,
            instance_name: body.instance_name || 'TGP Device',
          }),
        });

        const data = await res.json();

        if (data.activated) {
          return new Response(JSON.stringify({
            valid: true,
            instance_id: data.instance?.id || null,
            status: data.license_key?.status || 'active',
          }), { headers });
        }

        return new Response(JSON.stringify({
          valid: false,
          error: data.error || 'Activation failed - check your license key and try again.',
        }), { headers });
      }

      // --- VALIDATE (periodic re-check, on load if a license is stored) ---
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.LS_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ license_key, instance_id: instance_id || undefined }),
      });

      const data = await res.json();
      const isActive = data.valid === true && data.license_key?.status === 'active';

      let used = null, cap = null;
      const variantId = String(data.meta?.variant_id ?? '');
      if (isActive && TIER_CAPS[variantId] && env.USAGE_KV) {
        cap = TIER_CAPS[variantId];
        used = parseInt((await env.USAGE_KV.get(periodKey(license_key))) || '0', 10);
      }

      return new Response(JSON.stringify({
        valid: isActive,
        status: data.license_key?.status || 'unknown',
        used, cap,
        error: isActive ? null : (
          data.license_key?.status === 'inactive'
            ? 'Subscription has been cancelled or expired.'
            : data.error || 'License not valid.'
        ),
      }), { headers });

    } catch (e) {
      // If the LemonSqueezy API is down, fail open for general UI unlock
      // only. Generation is gated separately above and always fails closed.
      console.error('LS API error:', e.message);
      return new Response(JSON.stringify({
        valid: true,
        status: 'unverified',
        warning: 'Could not reach the verification server - access temporarily granted.',
      }), { headers });
    }
  }
};

// ---- Anthropic call --------------------------------------------------------
async function generateQuestions(apiKey, { topic, difficulty, count }) {
  const tool = {
    name: 'return_trivia_questions',
    description: 'Return a set of original pub-trivia question/answer pairs.',
    input_schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' },
            },
            required: ['question', 'answer'],
          },
        },
      },
      required: ['questions'],
    },
  };

  const prompt = 'Write ' + count + ' original pub-trivia questions with concise, unambiguous answers.\n' +
    'Topic: ' + (topic || 'general knowledge') +
    (difficulty ? ('\nDifficulty: ' + difficulty) : '') +
    '\nQuestions must be factually correct, varied, and suitable for reading aloud at a live trivia night. Keep answers short (a few words).';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      tools: [tool],
      tool_choice: { type: 'tool', name: 'return_trivia_questions' },
    }),
  });

  if (!res.ok) {
    throw new Error('Anthropic API error: ' + res.status);
  }
  const data = await res.json();
  const toolUse = (data.content || []).find(b => b.type === 'tool_use');
  if (!toolUse) throw new Error('No structured output returned.');
  const questions = toolUse.input && toolUse.input.questions;
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('Empty result.');
  return questions;
}
