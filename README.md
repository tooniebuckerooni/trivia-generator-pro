# Trivia Generator Pro 🎲

**Build it. Brand it. Print it. Host it.**

A free, browser-based trivia game builder for pub-trivia hosts, fundraisers, office parties, and event entertainers. Build your rounds, drop in your branding, and download a complete print-ready game kit as PDFs — no accounts, no servers, no setup. Everything runs in your browser and your game never leaves your computer.

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
- **Tiebreaker** — closest-answer-wins question, printed in the packets and on the final answer sheet
- **Branding** — upload your logo, set your business name, tagline, website, accent color, and PDF font; everything appears on every page
- **Sample question packs** — 8 categories of ready-made questions; fill any round with one click, or load a complete 3-round sample game to see how it all works
- **Paper-saver mode** — print answer sheets two-per-page with a cut line
- **US Letter or A4**, live PDF preview before downloading
- **Autosave** — your game is saved in your browser as you type; you can also save/load game files (`.tgp.json`) to keep a library of games

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
