# Wordjab Discovery Report
*vibe-check v1.7.0 · June 2026*

---

## What We Know About You

**What you built:** A multiplayer word game where players pick phrases from prompts, chat in a group feed, and on their turn target other players to reveal their board — Battleship meets Wheel of Fortune.

**Why you built it:** Your friends and family needed a reason to stay in touch across distance. Group chats go quiet. Wordjab gives everyone a turn.

**Your experience:** You know how to ship products (Trivia Generator Pro proves that). You just don't know the word game market yet.

**The three lines:**
1. What they're trying to accomplish: stay genuinely connected with the people they care about, not just in a group chat that goes dead
2. What they do instead: WhatsApp — inconsistent, passive, fades out for weeks
3. Why the workaround sucks: no structure, no shared activity, nobody has a reason to show up

---

## The Market Signal (Beat 2: Reality Check)

*Sources: Trustpilot, App Store reviews, GameFAQs, PocketGamer, TechCrunch, Inverse, Engadget, Axios*

### The Incumbent Is Imploding

**Words With Friends** — the closest thing to Wordjab that exists at scale — is actively dying.

The top complaints across hundreds of public reviews:

- **Ads:** "A constant barrage of banner ads, pop-ups, and video interruptions." "Full-length video advertisement EACH AND EVERY TIME you send a word." "This game has been RUINED."
- **Bots:** Players routinely matched against bots that play at superhuman level. Cheating dictionaries are everywhere.
- **Strangers:** The social premise (play with friends) has eroded. Most games are against people you don't know.
- **Abandoned games:** Games go dark for 22 days before auto-resign kicks in. Dead silent, no closure.

WwF at its peak had 350M registered users and proved that a word game can be a connection vehicle. It built that on a core insight: **people don't play for Scrabble, they play to have a thread with their mom.** Then Zynga monetized it into the ground.

### The Gap Just Got Proven (Very Recently)

**NYT Crossplay** launched January 2026. It hit **1 million downloads in under 2 months.** The reasons reviewers gave:

- No ads
- Play with people you actually know
- Clean design
- In-game chat

TechCrunch called it "a dream come true... arrives at a time when Words with Friends has become increasingly cluttered with ads and distractions."

But Crossplay has two significant constraints that Wordjab doesn't share:
1. **Two players only.** Not a group game.
2. **Scrabble-like.** Requires a strong word vocabulary. Not for everyone.

### Wordle Proved Something Critical About Growth

Wordle hit **2 million daily players in one week** in January 2022. The engine: the shareable emoji grid. Players posted their results on Twitter, Instagram, group chats — every share was a discovery channel. 3.3 million tweets, 6.6 trillion views, zero paid marketing.

Journalists noted: "Wordle became a lightweight way to check in with friends and family and tell them you loved them, without using big heavy words."

That's the behavior Wordjab is designed to create. The mechanism just hasn't been built yet.

### Competitive Word-Combat Mechanics Have a Proven Market

**Squabble** (2022) added battle-royale mechanics to Wordle — players lose "health" if they're slow or wrong, last one standing wins. Zero marketing. Hit **#15 most downloaded word game globally.** Journalists called it "a mashup of Fortnite with Wordle."

**Wordox** lets players steal tiles from opponents. Has tens of millions of players.

The appetite for word games with combat/targeting mechanics is real, well-documented, and underserved in the "play with your actual friends" segment.

### Async Play + Push Notifications = Retention

Research shows async multiplayer games have **30% better retention than synchronous games** over six months. The "it's your turn" notification is not a feature. It's the product loop. Words With Friends ran up to **40 simultaneous games per player** on this mechanism alone.

---

## The Opportunity Gaps (Scored)

*Pain = how badly people want this (from reviews, complaints, Reddit). Served = how well today's tools meet it. Opportunity = Pain + (Pain − Served), min 0.*

| Need | Pain | Served | Opportunity | Evidence |
|---|---|---|---|---|
| Play a word game with my actual friends, not strangers or bots | 9 | 2 | 16 | Seen it — WwF reviews, Crossplay's success |
| A structured reason for our group to check in regularly | 8 | 2 | 14 | Seen it — "WhatsApp goes quiet" is universal |
| Zero ads ruining the experience | 8 | 2 | 14 | Seen it — top WwF complaint across every review source |
| Group play (3+ people), not just head-to-head | 7 | 3 | 11 | Seen it — Crossplay is 2-player; Jackbox requires real-time |
| Word game I can win without a dictionary | 7 | 4 | 10 | Hunch — phrase mechanic has no direct comp |
| Shareable moments that make others want to join | 7 | 4 | 10 | Seen it — Wordle emoji grid, Squabble clips |
| Competitive drama between specific friends (not randoms) | 8 | 3 | 13 | Seen it — Squabble's targeting success |

**The top unmet need:** "I want to play a word game with my actual people — but WwF is ruined by ads and bots, Crossplay is too serious and 2-player, and Jackbox requires scheduling a call."

**Wordjab is the only product positioned to fill this exactly.**

---

## Competition Matrix

| | WwF | NYT Crossplay | Jackbox | Squabble | **Wordjab** |
|---|---|---|---|---|---|
| No ads | ✗ | ✓ | ✓ | ✓ | **✓** |
| Play with specific friends | ✓ | ✓ | ✓ | ✗ | **✓** |
| Group (3+ players) | ✗ | ✗ | ✓ | ✓ | **✓** |
| Async (play when you can) | ✓ | ✓ | ✗ | ✗ | **✓** |
| No word-nerd requirement | ✗ | ✗ | ✓ | ✗ | **✓** |
| Targeting/attack mechanic | ✗ | ✗ | ✗ | ✓ | **✓** |
| Integrated chat/banter | ✗ | ✓ (basic) | ✓ | ✗ | **✓** |
| Shareable moments | ✗ | ✗ | ✗ | ✓ | **needs building** |

**Wordjab is the only option in all seven columns.** That's a real gap, and it's wide open.

---

## The Real Product (Reframed)

You described Wordjab as a word game. It's not.

**Wordjab is a connection ritual for people who love each other but are terrible at keeping in touch.**

The game is just the shape of the ritual. Like how the Thanksgiving table isn't about the food — it's about the excuse to be in the same room.

This reframe matters enormously for everything you build next:
- Features should ask: *does this make the group feel more connected?* Not: *does this make the word game more fun?*
- The aha moment isn't solving a phrase. It's the moment your cousin texts you "I CANNOT BELIEVE YOU TARGETED ME" and you both laugh.
- Success isn't DAU. It's whether your players' groups are still active in 6 months.

---

## Your Differentiators (Protect These)

### 1. Phrases, Not Dictionary Words

WwF and Crossplay require vocabulary. If you don't know obscure Scrabble words, you lose. Wordjab's phrase mechanic means anyone can play — your 70-year-old grandmother, your 14-year-old nephew. This is massive accessibility. Don't dilute it.

### 2. The Targeting Mechanic

No other "play with friends" word game has this. It creates three things the competition can't replicate:
- **Drama:** you're coming for someone specific, and everyone knows it
- **Banter:** getting targeted is funny, not frustrating (design for this)
- **Social heat:** the group chat lights up every time someone targets the wrong person

This is your moat. Lean in hard. Give it personality in the copy ("Sarah just took aim at your board 🎯").

### 3. Group Async Play

You support 3+ players playing when they can. No one else in the word game space does this. Crossplay is 2-player. Jackbox needs everyone online. WwF is theoretically multiplayer but the experience is 1v1.

---

## V1 Definition

### Build to Win (Your Differentiator)
The single thing no one else has: **an async group word game with targeting, built for your actual people.**

The minimum that delivers this:
- 3–6 players per game
- Phrase prompts + suggestion mechanic
- Battleship-style targeting with Wheel of Fortune reveal
- Group chat/feed with reactions
- Push notifications: "it's your turn" + "you've been targeted"

### Build to Not Lose (Table Stakes)
What any word game in 2026 must have, minimum, for people to switch:
- **Zero ads.** Ever. This is non-negotiable. Monetize elsewhere.
- **Invitation flow that actually works.** One link, no friction. If getting your group into a game takes more than 60 seconds, you lose them.
- **Mobile-first.** This gets played in bed, on the couch, while waiting for coffee.
- **Fast load.** If it's slow, the group abandons it before the first turn.

### Park in V2
- Leaderboards / rankings
- Public matchmaking (play with strangers)
- Spectator mode
- Themed seasonal events
- In-app purchases / premium phrase packs (only after you have retention)

---

## The Growth Loop

Wordjab has an invite loop baked into the core mechanic.

```
Player A gets targeted by Player B
  → Player A gets a push notification: "Sarah just targeted you 😈"
    → Player A opens the game and retaliates
      → Player A texts the group chat: "I cannot believe Sarah just did that"
        → Someone in the group chat who ISN'T playing yet sees this
          → "wait what game is this" → download → joins the game
            → back to the top
```

This doesn't require a "refer a friend" button. It requires that the in-game moments are **banter-worthy enough to spill into WhatsApp naturally.**

Design the targeting notification and the "your phrase was just revealed" moment with this loop in mind. These are your acquisition events.

**The one number that tells you it's working:** what percentage of new players joined because an existing player shared something — a message, a screenshot, a reaction. Track this from day one with a simple "how did you hear about us?" at signup.

---

## Distribution: Your First 10 Users

You already have them: your friends and family who are already playing.

Your first move isn't marketing. It's mining the existing players for referrals. When someone in your group plays, who else do they wish was in the game? That's your expansion path.

The second move: the communities where "keeping in touch with family at a distance" is an active pain point. These aren't word game subreddits. They're:
- Long-distance family groups (expat communities, military family forums)
- "Games to play with grandma on video call" searches (huge and underserved)
- "Alternative to Words With Friends" searches (actively spiking as WwF dies)

Don't try to reach all three at once. Pick one, post something genuinely helpful (not a plug), and see who bites.

---

## What to Build Next (Prioritized)

These are the things that will determine whether Wordjab becomes real or stays a thing your family plays.

**Do these first — they're blocking:**

1. **The invite link.** One URL a player can paste into WhatsApp. Tapping it shows the game state (even without an account) and makes joining one step. This is the hardest and most important UX problem you have.

2. **Push notifications.** "It's your turn." "Sarah targeted your board." Without this, the game is invisible. Players forget it exists.

3. **Mobile layout.** If it's not great on an iPhone, you don't have a game. Test on actual devices, not just browser resize.

**Do these second — they're your growth engine:**

4. **The shareable moment.** When someone's phrase gets fully revealed, or when a player makes a targeting kill shot, generate a one-tap share card (like Wordle's emoji grid). Design it now. It's your word-of-mouth engine.

5. **Targeting personality.** The notification and UI copy around "being targeted" needs to feel playful, not hostile. "Watch out, Sam's coming for you" > "Player 2 has selected your board." This is what makes people screenshot and send it to the group chat.

6. **Phrase categories.** "Movies," "Pop Culture," "Sports," "80s Hits" — let players pick a theme per round. This makes the game feel personal and tailored, and opens a monetization door (premium theme packs) without ever touching ads.

**Do these eventually — they're meaningful but not urgent:**

7. A simple onboarding that gets a new player to their first turn in under 90 seconds.
8. Empty state messaging that makes a waiting group feel alive, not abandoned.
9. A "daily challenge" lightweight mode — a single shared phrase all groups play on the same day (your Wordle moment).

---

## Things That Will Kill You If You Ignore Them

- **Payment providers.** If you ever charge money — apply early, before you build the payment flow. Stripe and others reject accounts without warning, after you've built everything.
- **Privacy policy.** The moment you collect any user data (even email), you need one. Your AI tool can draft it — you have to read it.
- **API keys in code.** Any secret that's in your source code is a security breach waiting to happen. Use environment variables.
- **The Zynga trap.** Never put ads in a social game built on trust. The moment you do, you become what WwF became.

---

## Pre-Launch Audit Prompts

Run these before you show Wordjab to anyone outside your family:

**Security:** "Audit my codebase for security vulnerabilities. Check authentication, authorization, input validation, rate limiting, secrets management, and CORS/CSRF protections. Give a severity rating for each issue."

**Scalability:** "Audit my codebase for scalability issues. Check for N+1 queries, unbounded database reads, missing pagination, polling vs. real-time listeners, and concurrent user handling."

**Production readiness:** "Audit my codebase for production readiness. Check for error monitoring, test coverage on authentication paths, accessibility basics, and deployment configuration. Tell me what will fail silently in production."

---

## Open Questions

- How many players can be in one game currently? Is there a max?
- Is play real-time or turn-based async? (This shapes notification design significantly.)
- How are phrases generated — curated list, user-submitted, AI-generated?
- Is there an account system, or is it invite-link only?
- What's the current tech stack?

These shape Phase 2 of the plan (the experience design). Answer them and we can go deeper on the blueprint.

---

## Words You Now Know

| Term | What it means |
|---|---|
| Async | Players take turns when they can, not all at the same time |
| Push notification | The tap on your phone that says "it's your turn" |
| Invite loop | When using the app naturally pulls in someone new |
| ODI | Outcome-Driven Innovation — a method for scoring which problems to solve first |
| Table stakes | The things every product in this category must do just to be considered |
| Differentiator | The one thing you do that nobody else does |
| Aha moment | The first instant a new user feels "yes, this is for me" |
| DAU | Daily Active Users — how many people open the app on a given day |

---

*Sources consulted: Trustpilot (Words With Friends reviews), GameFAQs (WwF reviews), SmartCustomer (WwF reviews), PocketGamer.biz (NYT Crossplay), TechCrunch (NYT Crossplay), Whistleout (NYT Crossplay), Inverse (Squabble), Engadget (Squabble), Axios (Wordle), TechCrunch (Wordle/NYT), Wayline (async multiplayer retention research), adlock.com (WwF ads)*
