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
// Token economy: every AI action spends "tokens" (the product's usage
// unit, unrelated to LLM/API tokens) from the license's monthly pool.
//   - suggest_categories: 1 token for a batch of 5 category ideas.
//   - generate: 2 tokens for a batch of up to 10 Q&A pairs.
// Both draw from the same TIER_CAPS pool, so a host can spend it however
// they like — browse ideas cheaply, spend more to commit to a round.
//
// Design notes (mirrors the licensing pattern proven in the bingo card
// generator's worker.js, adapted for metered usage instead of export
// gating):
//   - activate / validate fail OPEN on transport errors, so a Cloudflare
//     or LemonSqueezy outage doesn't lock a paying host out of the app.
//   - generate / suggest_categories fail CLOSED, always. They're the only
//     actions with real variable API cost, so any doubt (bad license,
//     unreachable LS API, unreadable KV) refuses the call rather than
//     defaulting to "allow."
//   - Never hardcode a bypass/dev license code here. The bingo project
//     shipped one and had to find and remove it later — don't repeat it.
// ================================================================

const ALLOWED_ORIGINS = [
  'https://tooniebuckerooni.github.io', // GitHub Pages
  // add a custom domain here once one exists, e.g. 'https://triviageneratorpro.com'
];

// LemonSqueezy variant_id -> monthly token pool.
// Fill in after creating the product/variants in the LemonSqueezy dashboard.
const TIER_CAPS = {
  'REPLACE_WITH_TIER1_VARIANT_ID': 100,
  'REPLACE_WITH_TIER2_VARIANT_ID': 300,
};

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_QUESTIONS_PER_CALL = 10;
const USAGE_KEY_TTL_SECONDS = 60 * 60 * 24 * 40; // 40 days - outlives the billing month, next month just uses a new key
const GENERATE_COST = 2;
const SUGGEST_COST = 1;

function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.find(o => origin.startsWith(o)) || ALLOWED_ORIGINS[0];
}

function periodKey(licenseKey) {
  const now = new Date();
  const ym = now.getUTCFullYear() + '-' + String(now.getUTCMonth() + 1).padStart(2, '0');
  return 'usage:' + licenseKey + ':' + ym;
}

// Shared fail-closed gate for both metered actions: confirms the license
// is active with LemonSqueezy, resolves its token pool from TIER_CAPS, and
// checks there's enough left this period. Does NOT spend the tokens - call
// commitUsage() only after the AI call actually succeeds, so a failed
// generation never costs the host anything.
async function checkLicenseAndReserve(env, license_key, instance_id, cost) {
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
  if (!isActive) return { ok: false, error: 'License not active.' };

  const variantId = String(lsData.meta?.variant_id ?? '');
  const cap = TIER_CAPS[variantId];
  if (!cap) return { ok: false, error: "This license's plan does not include AI generation." };

  if (!env.USAGE_KV) return { ok: false, error: 'Usage tracking is not configured on the server.' };

  const key = periodKey(license_key);
  const used = parseInt((await env.USAGE_KV.get(key)) || '0', 10);
  if (used + cost > cap) {
    return {
      ok: false,
      error: 'Not enough tokens left this month (' + Math.max(cap - used, 0) + ' of ' + cap + ' remaining). Resets next month.',
      used, cap,
    };
  }
  return { ok: true, key, used, cap };
}

async function commitUsage(env, key, used, cost) {
  const newUsed = used + cost;
  await env.USAGE_KV.put(key, String(newUsed), { expirationTtl: USAGE_KEY_TTL_SECONDS });
  return newUsed;
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

    // --- GENERATE (fail CLOSED: real API cost) ---
    // Handled before the shared try/catch below so a license-check error
    // can never fall into the fail-open path further down. Any doubt here
    // means no generation, full stop.
    if (action === 'generate') {
      try {
        const gate = await checkLicenseAndReserve(env, license_key, instance_id, GENERATE_COST);
        if (!gate.ok) {
          return new Response(JSON.stringify({ ok: false, error: gate.error, used: gate.used, cap: gate.cap }), { headers });
        }
        if (!env.ANTHROPIC_API_KEY) {
          return new Response(JSON.stringify({ ok: false, error: 'AI generation is not configured on the server.' }), { headers });
        }

        const mode = ['topic', 'mixed', 'lightning', 'list', 'connections'].includes(body.mode) ? body.mode : 'topic';
        const format = ['open', 'tf', 'mc'].includes(body.format) ? body.format : 'open';
        const needsTopic = mode === 'topic' || mode === 'lightning' || mode === 'list';
        const topic = String(body.topic || '').slice(0, 200);
        if (needsTopic && !topic) {
          return new Response(JSON.stringify({ ok: false, error: 'This mode needs a topic.' }), { headers });
        }
        const count = Math.min(Math.max(parseInt(body.count, 10) || 10, 1), MAX_QUESTIONS_PER_CALL);

        const questions = await generateQuestions(env.ANTHROPIC_API_KEY, { topic, mode, format, count });

        const newUsed = await commitUsage(env, gate.key, gate.used, GENERATE_COST);
        return new Response(JSON.stringify({ ok: true, questions, used: newUsed, cap: gate.cap }), { headers });
      } catch (e) {
        console.error('generate error:', e.message);
        return new Response(JSON.stringify({ ok: false, error: 'Generation failed - please try again.' }), { headers });
      }
    }

    // --- SUGGEST_CATEGORIES (fail CLOSED: real API cost) ---
    if (action === 'suggest_categories') {
      try {
        const gate = await checkLicenseAndReserve(env, license_key, instance_id, SUGGEST_COST);
        if (!gate.ok) {
          return new Response(JSON.stringify({ ok: false, error: gate.error, used: gate.used, cap: gate.cap }), { headers });
        }
        if (!env.ANTHROPIC_API_KEY) {
          return new Response(JSON.stringify({ ok: false, error: 'AI generation is not configured on the server.' }), { headers });
        }

        const seed = String(body.seed || '').slice(0, 200);
        const avoid = Array.isArray(body.avoid) ? body.avoid.slice(0, 20).map(x => String(x).slice(0, 80)).filter(Boolean) : [];

        const categories = await suggestCategoryNames(env.ANTHROPIC_API_KEY, { seed, avoid });

        const newUsed = await commitUsage(env, gate.key, gate.used, SUGGEST_COST);
        return new Response(JSON.stringify({ ok: true, categories, used: newUsed, cap: gate.cap }), { headers });
      } catch (e) {
        console.error('suggest_categories error:', e.message);
        return new Response(JSON.stringify({ ok: false, error: 'Suggestion failed - please try again.' }), { headers });
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
      // only. Both metered actions are gated separately above and always
      // fail closed.
      console.error('LS API error:', e.message);
      return new Response(JSON.stringify({
        valid: true,
        status: 'unverified',
        warning: 'Could not reach the verification server - access temporarily granted.',
      }), { headers });
    }
  }
};

// ---- Anthropic calls -------------------------------------------------------

async function callAnthropic(apiKey, { prompt, tool, maxTokens }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
    }),
  });
  if (!res.ok) throw new Error('Anthropic API error: ' + res.status);
  const data = await res.json();
  const toolUse = (data.content || []).find(b => b.type === 'tool_use');
  if (!toolUse) throw new Error('No structured output returned.');
  return toolUse.input || {};
}

const MODE_INSTRUCTIONS = {
  topic: (topic, count) => 'All ' + count + ' questions should be about this single topic: ' + topic + '.',
  mixed: (topic, count) => 'Generate a diverse mix of trivia questions spanning many different categories' +
    (topic ? ' (loosely inspired by: ' + topic + ')' : '') +
    ' - no two questions should be on the same narrow subject.',
  lightning: (topic, count) => 'All ' + count + ' questions should be about: ' + topic +
    '. Keep them SHORT and quick to read aloud, with short, unambiguous answers (a word or two) - these are for a fast-paced lightning round.',
  list: (topic, count) => 'All ' + count + ' questions should be about: ' + topic +
    ', phrased as "list" questions (e.g. "Name 3 of the 5 ..."). The answer should state which items count as correct.',
  connections: (topic, count) => 'Generate ' + count + ' "what connects these?" puzzle questions' +
    (topic ? ' (loosely inspired by: ' + topic + ')' : '') +
    ' - each question gives 3-4 short clues/items and asks what links them, and the answer states the connection.',
};

async function generateQuestions(apiKey, { topic, mode, format, count }) {
  const schemaProps = {
    question: { type: 'string' },
    answer: { type: 'string' },
  };
  const required = ['question', 'answer'];
  let formatInstructions = '';
  if (format === 'tf') {
    formatInstructions = ' Each question must be a statement that is answerable as True or False; set "answer" to exactly "True" or "False".';
  } else if (format === 'mc') {
    formatInstructions = ' Each question needs exactly 4 short answer choices (one correct, three plausible-but-wrong) in "choices", and "answer" must exactly match the correct choice\'s text.';
    schemaProps.choices = { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 };
    required.push('choices');
  }

  const tool = {
    name: 'return_trivia_questions',
    description: 'Return a set of original pub-trivia question/answer pairs.',
    input_schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: { type: 'object', properties: schemaProps, required },
        },
      },
      required: ['questions'],
    },
  };

  const prompt = 'Write ' + count + ' original pub-trivia questions with concise, unambiguous answers.\n' +
    (MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.topic)(topic, count) +
    formatInstructions +
    '\nQuestions must be factually correct and suitable for reading aloud at a live trivia night.';

  const out = await callAnthropic(apiKey, { prompt, tool, maxTokens: 1536 });
  let questions = out.questions;
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('Empty result.');

  if (format === 'mc') {
    // Defensive: drop anything the model returned malformed rather than
    // shipping a multiple-choice question with no matching correct choice.
    questions = questions.filter(q =>
      Array.isArray(q.choices) && q.choices.length === 4 && q.choices.includes(q.answer));
    if (!questions.length) throw new Error('AI returned no valid multiple-choice questions - try again.');
  }
  return questions;
}

async function suggestCategoryNames(apiKey, { seed, avoid }) {
  const tool = {
    name: 'return_categories',
    description: 'Return short, punchy trivia round category name ideas.',
    input_schema: {
      type: 'object',
      properties: {
        categories: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 },
      },
      required: ['categories'],
    },
  };

  const prompt = (seed
    ? 'Suggest 5 fresh, more specific/niche pub-trivia round category ideas that drill deeper into or riff on this one: "' + seed + '". Go more specific and surprising, not broader.'
    : 'Suggest 5 fun, surprising pub-trivia round category ideas - a mix of well-known and delightfully unexpected angles.'
  ) + ' Short, punchy names (2-6 words each), no explanations.' +
    (avoid.length ? ('\nAvoid repeating (already used in this game): ' + avoid.join(', ') + '.') : '');

  const out = await callAnthropic(apiKey, { prompt, tool, maxTokens: 300 });
  const categories = out.categories;
  if (!Array.isArray(categories) || categories.length === 0) throw new Error('Empty result.');
  return categories;
}
