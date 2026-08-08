# Trivia Show Maker — Session Handoff (2026-08-08)

Redesigned the trivia builder into **Trivia Show Maker**, integrated it into
**fatcityentertainment.com**, and launched a paid AI add-on that runs on
**one-time credit packs**. This is the developer hub; the public home is on the
Fat City site.

## Where things live

| Piece | Location |
|---|---|
| **The app** | `tooniebuckerooni/trivia-generator-pro` — `index.html`, `css/style.css`, `js/{app,ai,pdfgen,samples}.js`. Demo build at `tooniebuckerooni.github.io/trivia-generator-pro/` (canonical points to Fat City). |
| **AI gateway source** | `worker.js` at this repo's root — the Cloudflare Worker code. |
| **Live public tool** | `tooniebuckerooni/fat-city-entertainment` → `/trivia-show-maker/` (a copy of the app), served at `https://www.fatcityentertainment.com/trivia-show-maker/`. See `TRIVIA-SHOW-MAKER-HANDOFF.md` there for the site-side details. |
| **Deployed Worker** | Cloudflare `tgp-ai-gateway` (Dustin's account) → `https://tgp-ai-gateway.dustinramsbottom.workers.dev`. Secrets: `ANTHROPIC_API_KEY`, `LS_API_KEY`. KV binding: `USAGE_KV` (namespace `TGP_USAGE`). |
| **Store product** | LemonSqueezy "Trivia Show Maker — 50 Gen Credits", $7.99, one-time, License Keys on. Checkout: `bingocardgenerator.lemonsqueezy.com/checkout/buy/f5fe010c-…` |

> ⚠️ The app exists in **two copies** (this repo + `fat-city/trivia-show-maker/`).
> Changes to `js/*.js` / `css` / `index.html` must be made in **both**, or copied
> across. `WORKER_URL` / `CHECKOUT_URL` are hard-coded in both `js/ai.js`.

## What shipped

**App redesign** — header **credits chip**; highlighted **AI Studio** hook;
**⛏ Dig for Categories** (replaced the slot-machine "Spin"); guided/numbered
steps; friendlier empty state; playful polish on the dark theme.

**Audience controls** — per-round **Age Range** (Family / Kids / Teens / Adults)
as the primary knob + optional **Difficulty** (Balanced/Easy/Med/Hard). Both
steer sample-fill *and* the AI prompt (`worker.js` `AGE_INSTRUCTIONS` /
`DIFFICULTY_INSTRUCTIONS`). State migrates cleanly (`app.js` `adoptState`).

**Sample data** — `js/samples.js` expanded to 10 packs × ~20, age-tagged (3rd
array element: `all`/`teen`/`adult`), added *Word Play & Language* and *Logos,
Brands & Slogans*, longer tiebreaker list.

**Paid AI add-on (one-time credit packs)** — `worker.js`:
- Persistent per-license balance (`balanceKey`, no monthly reset, no KV TTL) —
  credits deplete until spent and never reset. Buying again = new license key =
  fresh balance.
- **Pack size is read from the LemonSqueezy product name** (`creditsForLicense`):
  "… 50 Gen Credits" → 50. Checks `product_name` first, then `variant_name`
  (single-variant products report `variant_name` as "Default"). `TIER_CAPS` is
  an optional numeric-`variant_id` override; normally left empty.
- Costs: **Dig = 1 credit, Generate 10 = 2 credits**. Fails **closed** on any
  doubt; validate/activate fail **open**. `ALLOWED_ORIGINS` includes the Fat
  City domain + the github.io demo.
- Frontend (`js/ai.js`): `WORKER_URL`/`CHECKOUT_URL` wired; chip shows the live
  balance, animates on spend, and when active is a **"buy more"** button
  (nudges to top up at ≤3 credits).

## Pricing / economics

Haiku 4.5 COGS ≈ **$0.006/Generate, $0.002/Dig** → a fully-used 50-pack costs
~$0.09–0.16; ~97% margin after LemonSqueezy fees.

| Pack | Credits | Price | Status |
|---|---|---|---|
| Starter | 50 | $7.99 | **Live** |
| Host | 200 | $24.99 | Recommended next |
| Pro | 500 | $49.99 | Recommended next |

**Adding a pack needs no code** — create a LemonSqueezy product with the number
in its name ("… 200 Gen Credits"); the Worker reads it.

## Owner to-dos (not code)

1. **Rotate the Anthropic + LemonSqueezy keys** — they were pasted in chat
   during setup. Regenerate both and update them in the Cloudflare Worker.
2. **Store page** — not built yet. The checkout URL exists; a product page +
   tile can be added via the site's `_tools/new-product` pipeline (decide live
   vs. staged).
3. Add Host/Pro packs when ready (LemonSqueezy products only).

## Known issues / next-agent to-dos

**AI generation quality is the top item.** The `generate` action uses
`claude-haiku-4-5`; Dustin's Halloween test game surfaced factual errors and
artifacts. Options: tighten the `worker.js` prompt (demand verifiable facts,
plausible MC distractors, no cross-round repeats), use a stronger model for
generation, and/or add a post-generation verify pass. Concrete examples:
- **Factual:** candy corn "fairy bread" (was "Chicken Feed"); *Casper* dated
  1989 (is 1995); "Lump" dated 1993 (is 1995); "1837 first US jack-o'-lantern"
  (dubious).
- **Garbled:** the "Smarties/M&Ms → orange and brown" question; the "how many
  sides does a jack-o'-lantern face have" question.
- **Category drift:** Rihanna's "Umbrella" under *One-Hit Wonders*; TV shows
  under a "Halloween Movies" round.
- **Repetition:** *Hocus Pocus* appeared 3× in one game — no de-duping across
  rounds.
- **Weak MC distractors** ("Left Said Fred") — prompt for plausible wrong
  answers.

**App/config**
- A game can have the **tiebreaker enabled but its Q/A blank** (as in the test
  game) → prints an empty tiebreaker. Consider an audit warning, auto-fill from
  `TGP_TIEBREAKERS`, or suppressing it when empty.
- Two app copies (see the warning above) — a build step or symlink would remove
  the drift risk.
- (Dustin has additional polish items he'll add.)

## Verify / run

- **Static:** open `index.html` (no build). Load a sample game → preview +
  download all four PDFs.
- **AI path:** activate a license in AI Studio → chip shows the balance → Dig
  (−1) / Generate 10 (−2), chip animates.
- **Worker change:** editing `worker.js` requires re-pasting it into the
  Cloudflare `tgp-ai-gateway` Worker and clicking Deploy (Cloudflare does not
  pull from GitHub).
- **Site:** in `fat-city-entertainment`, `node _tools/check-links.js` (expect 0
  broken).
