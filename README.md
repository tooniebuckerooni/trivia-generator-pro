# Trivia Generator Pro 🎲

**Build it. Brand it. Print it. Host it.**

A free, browser-based trivia game builder for pub-trivia hosts, fundraisers, office parties, and event entertainers. Build your rounds, drop in your branding, and download a complete print-ready game kit as PDFs — no accounts, no servers, no setup. Print it and you're done: the whole night runs on paper, with no wifi, laptop, or app required at the table.

**▶ Use it now:** https://tooniebuckerooni.github.io/trivia-generator-pro/

## What you get

Every game exports as a matched, branded set of PDFs:

| Document | What it is |
|---|---|
| **Host Packet** | Cover page + every round's questions *with answers*, plus the tiebreaker |
| **Question Packet** | The same packet with answers stripped — hand it to a co-host or reader |
| **Answer Sheets** | Blank numbered team sheets that match every round exactly (team name line, wager box on wager rounds, tiebreaker line, round-score box) |
| **Score Sheet** | Landscape host scoring grid — one row per team, one column per round |

## Features

- **Rounds & questions** — unlimited rounds, per-round categories and point values, reorder/shuffle/duplicate, collapse rounds while you work
- **Round types** — Standard, Double Points, and Wager rounds (answer sheets get a wager line automatically)
- **Answer formats** — Open-ended, True/False, or Multiple Choice per round
- **Age Range** — set who each round is for (Family / Kids / Teens / Adults); it steers which samples fill and how the AI writes. An optional per-round Difficulty (Balanced / Easy / Medium / Hard) fine-tunes AI generation
- **Tiebreaker** — closest-answer-wins question, printed in the packets and on the final answer sheet
- **Branding** — upload your logo, set your business name, tagline, website, accent color, and PDF font; everything appears on every page
- **Sample question packs** — 10 categories of ready-made questions (age-tagged); fill any round with one click, or load a complete 3-round sample game to see how it all works
- **Paper-saver mode** — print answer sheets two-per-page with a cut line
- **US Letter or A4**, instant PDF preview before downloading
- **Autosave** — your game is saved in your browser as you type; you can also save/load game files (`.tgp.json`) to keep a library of games

## Why print-first

This tool is for the work that happens *before* trivia night: writing questions, branding the packet, hitting print. Once the PDFs are downloaded, running the show is deliberately low-tech — paper, a pen, and a host. That's the point, not a gap: no wifi dependency, nothing for teams to install, nothing to troubleshoot mid-show. Features that would require a screen or connection during the event itself — live scoreboards, a presenter/display mode, QR-code check-ins — are intentionally out of scope.

## AI Studio (optional paid add-on)

Everything above is free, unlimited, and stays in your browser. On top of
it, there's an optional add-on that runs on **credits**:

- **Dig for Categories** (1 credit) — unearth five surprising, ready-to-use
  round categories you'd never think of, then dig deeper into any of them.
- **Generate 10** (2 credits) — fill a whole round from a topic, matching the
  round's answer format, age range, and difficulty.

Your credit balance lives in the top bar and ticks down as you spend it.
Credits are gated by a LemonSqueezy license and metered per month. The add-on
is entirely separate from the core app — the free product doesn't change,
require a license, or need it to function.

Setup for anyone deploying this themselves: the add-on needs a small
Cloudflare Worker (`worker.js` at the repo root — deploy instructions are
in its header comment) plus a LemonSqueezy product with subscription
variants. Without a Worker deployed, the "AI Question Generator" panel in
the app just stays inactive — no errors, no effect on the free features.

## Running it yourself

It's a static site — no build step, no dependencies to install.

```
git clone https://github.com/tooniebuckerooni/trivia-generator-pro.git
```

Open `index.html` in a browser. That's it.

PDF generation is done client-side with [jsPDF](https://github.com/parallax/jsPDF) (MIT, vendored in `vendor/`).

## License

MIT — use it, fork it, host trivia with it.

---

Made by [Fat City Entertainment](https://www.fatcityentertainment.com) — games • trivia • music bingo.
