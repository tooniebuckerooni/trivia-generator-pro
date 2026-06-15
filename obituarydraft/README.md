# ObituaryDraft

A lightweight SaaS tool for independent funeral home directors. A director fills
in a short intake form and receives a **dignified 200–350 word obituary draft**
plus an **~80 word funeral program version**, generated together from the same
inputs.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and the **Anthropic
Claude API** (`claude-sonnet-4-6`).

---

## Features

- **Two-panel UI** — intake form on the left, generated drafts on the right
  (stacked on mobile).
- **Prominent tone selector** — Traditional / Warm & Personal / Faith-Based.
- **Both versions, clearly labeled**, each with its own copy button and a live
  word count.
- **Sensitive, dignified prompting** — the model is instructed never to invent
  facts (names, dates, cause of death) and to honor the chosen tone.
- **Stripe paywall after 3 free generations**, tracked in `localStorage`
  ("$49/month — Unlimited Cases").
- **No auth, no database** — an MVP that runs from two API routes.

---

## File structure

```
obituarydraft/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # Calls Claude, returns { obituary, program }
│   │   └── checkout/route.ts   # Creates a Stripe Checkout session ($49/mo)
│   ├── globals.css             # Tailwind + base styles
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Two-panel app, paywall + usage wiring
├── components/
│   ├── IntakeForm.tsx          # The intake form (all fields, 3–5 memories)
│   ├── OutputPanel.tsx         # Empty / loading / error / results states
│   ├── ToneSelector.tsx        # Prominent 3-card tone picker
│   ├── CopyButton.tsx          # Per-version copy-to-clipboard
│   └── Paywall.tsx             # Stripe upgrade modal
├── lib/
│   ├── anthropic.ts            # Anthropic client + model id
│   ├── prompt.ts               # System prompt + user prompt builder
│   └── usage.ts                # localStorage free-tier tracking
├── types.ts                    # Shared types (IntakeData, GeneratedOutput, Tone)
├── .env.local.example          # Env var template
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting started

```bash
cd obituarydraft
npm install

# Configure environment
cp .env.local.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY

npm run dev
# open http://localhost:3000
```

### Environment variables

| Variable             | Required | Purpose                                                        |
| -------------------- | -------- | -------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Yes      | Authenticates calls to the Claude API.                         |
| `STRIPE_SECRET_KEY`  | No       | Enables real Stripe Checkout for the paywall.                  |
| `STRIPE_PRICE_ID`    | No       | A pre-made $49/mo recurring Price. If omitted, one is created inline. |
| `NEXT_PUBLIC_SITE_URL` | No     | Fallback origin for Stripe redirect URLs (e.g. in production). |

Without Stripe keys the app is fully usable: the paywall still appears after the
free limit, and the Subscribe button returns a friendly "not configured" notice.

---

## How it works

1. The director fills in the intake form and clicks **Generate**.
2. `page.tsx` checks the free allowance in `localStorage`
   (`lib/usage.ts`). If exhausted and not subscribed, the **Paywall** opens.
3. Otherwise the form data is POSTed to `/api/generate`, which builds a careful
   prompt (`lib/prompt.ts`) and calls `claude-sonnet-4-6`.
4. The route parses the model's JSON reply into `{ obituary, program }` and
   returns it; the right panel renders both, each with a copy button.
5. A successful generation increments the free-tier counter. On the third,
   subsequent attempts open the paywall.
6. **Subscribe** POSTs to `/api/checkout`, which creates a Stripe Checkout
   session and redirects. On success Stripe returns the user to `/?subscribed=true`,
   which sets the unlimited flag in `localStorage`.

### A note on the model choice

This project pins `claude-sonnet-4-6` per the product spec. To change models,
edit `MODEL` in `lib/anthropic.ts`.

> These outputs are **drafts for a director to review** — always verify names,
> dates, and details with the family before publishing.
