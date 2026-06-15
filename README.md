# TAIL.TRADE — Matchday Gates

Five full-screen, no-audio, seamless-loop launch videos illustrating the core TAIL.TRADE mechanic
on **real Notch oracle data**:

> A team's perp **price moves live with the match**, and the **W/D/L "gates"** (projected price
> targets per outcome) show where the price will land — it **resolves into the gate of the result
> that actually happens.**

Open **`index.html`** for the full-screen viewer (←/→ to move between variants, `F` for true
fullscreen, per-variant `OPEN ↗` / `MP4 ↓`).

## The 5 variants (each on a real match)

| # | Variant | Match | Story |
|---|---------|-------|-------|
| 01 | Outcome Fan | Everton 3–3 Man City | Projection fan locks on WIN at 3-1, then the 90+7′ equalizer snaps the price to the DRAW gate ($117.30). The gate-flip. |
| 02 | Gate Ladder | Forest 1–0 Aston Villa | Flat on the draw/loss gates, then the 89′ goal snaps win-prob 23%→74% and the price climbs through the WIN gate ($123.46). |
| 03 | Rollercoaster | Liverpool 2–3 Man Utd | 0-2 down craters toward LOSS, 2-2 comeback flirts with WIN, a 77′ winner settles on the LOSS gate ($179.09). |
| 04 | Probability Cone | Everton 3–3 Man City | Bookmaker W/D/L bands as a shifting cone; each goal re-weights it (14%→2%→77%→98% draw); resolves through the DRAW gate. |
| 05 | Matchday HUD | Liverpool 2–3 Man Utd | Scoreboard + live chart + outcome-gates panel; every goal ticks the score, jumps the price, re-prices the gates. |

## Data

All prices, odds, goals, gate projections and settle values are **real**, extracted from
[frertommy.github.io/notch/charts](https://frertommy.github.io/notch/charts) (oracle price history +
odds snapshots) into [`data.js`](./data.js) (`window.MATCHES`, with `MATCHES_priceAt` /
`MATCHES_oddsAt` interpolation helpers). Regenerate with `node build-data.mjs`. No invented numbers.

## Re-render to MP4

Headless-Chrome → ffmpeg, deterministic (virtual clock). Needs Node 18+, ffmpeg, Google Chrome.

```bash
npm install            # puppeteer-core (uses system Chrome)
node capture.mjs       # all 5 → mp4/  (+ posters → assets/posters/)
node capture.mjs 01    # just one
FPS=60 node capture.mjs
```

Output: 1920×1080 · H.264 · 30 fps · no audio · seamless loops.

## Structure

```
index.html        full-screen viewer
videos/           5 self-contained source animations (NN-slug.html → ../data.js)
mp4/              rendered videos · assets/posters/  stills
data.js           real Notch oracle data + helpers   (build-data.mjs regenerates it)
_TEMPLATE.html    shared 1920×1080 scaffold (TAIL runtime, brand tokens, logo)
capture.mjs       HTML → MP4 renderer · CONCEPT.md  the build brief
```

Brand: lime `#B2ED68` = win/up · crimson `#B30F43` = loss/down · amber/cyan = draw/neutral · dark
`#0C0E12`. Space Mono numbers, Space Grotesk labels.
