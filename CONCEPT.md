# TAIL.TRADE — "Matchday Gates" (5 variants, REAL data)

One concept, five full-screen executions. Each is a **no-audio, seamless-loop** launch video that
shows the core TAIL.TRADE mechanic on **real Notch oracle data**:

> A team's perp **price moves live with what happens in the match**, and the **W/D/L "gates"**
> (projected price targets per outcome) show where the price will land — the price resolves
> **into the gate of the outcome that actually happened.**

## USE THE REAL DATA — `../data.js` (do NOT invent numbers)

Add `<script src="../data.js"></script>` in `<head>` (it has no deps and must load before your
scene). It defines `window.MATCHES` with three real matches: **`everton`**, **`forest`**,
**`liverpool`**. Each match object:

```
{ league, subject, opponent, ticker, subjectSide,
  gates: { win:{price,prob}, draw:{price,prob}, loss:{price,prob} },   // THE GATES (target $ + implied %)
  koPrice, settle, realized: 'win'|'draw'|'loss',
  priceMin, priceMax,            // y range for the price axis
  xMin, xMax, ftMin,             // x = minutes from KO; ftMin = settle marker
  goals: [{ min, by:'subject'|'opponent', score, label }],   // each goal MOVES the price
  price: [[min,$], ...],         // the solid lime Notch price line
  odds:  [{ min, win, draw, loss }],   // subject-perspective implied prob % (drives the gate weighting)
  story }                        // prose arc — read it, it tells you the beats
```

Helpers: `MATCHES_priceAt(m, min)` and `MATCHES_oddsAt(m, min)` (linear interpolation) — use these
to drive a clock sweeping from `xMin`→`xMax` so the price draws and the gate probabilities update
in lockstep. Land/settle the price at `m.gates[m.realized]` (≈ `m.settle`).

**Make game→price causality unmistakable:** as your clock passes each `goal.min`, fire the goal
label and show the price react on the same frame (lime kick up if `by:'subject'`, crimson drop if
`by:'opponent'`). As odds shift, the **gate weighting / projection re-aims** toward the live
most-likely gate, then the price resolves through the realized gate at FT.

## Technical rules

- **Start from `_TEMPLATE.html`** (this folder). Build in the SCENE + SCENE SCRIPT regions, keep the
  `TAIL` runtime, call `TAIL.ready()` once. Single self-contained `.html` — only external refs are
  the Google Fonts link (already present) and `../data.js`. No images, no build, no other deps.
- Design in the fixed **1920×1080** stage; it auto-fits to fill the screen. Use the **full frame,
  edge-to-edge** — this is a full-screen piece. Autoplay, **zero interaction**, **seamless loop**
  (state at t=0 == t=LOOP_MS). `<body data-loop-ms="…">` 14000–16000 suits a full match arc.
- Drive everything from `TAIL.loop(fn)` (deterministic capture); prefer transform/opacity/filter; 60fps.
- **Brand (color = meaning):** lime `#B2ED68` = up/win/long · crimson `#B30F43` = down/loss/short ·
  amber `#fbbf24` or cyan `#00D9F5` = draw/neutral · bg `#0C0E12` · text `#E6E8EB`/`#8C919A`.
  **Space Mono** for all numbers/prices/clock/tickers (tabular-nums); **Space Grotesk** for labels.
  `TAIL.MARK`/`TAIL.LOGO` for a small watermark. Lime means something — keep it earned.

## The 5 variants

| NN | Variant | Match | What it shows |
|----|---------|-------|---------------|
| 01 | **Outcome Fan** | `everton` | Candlestick/area price draws as the clock runs; goals fire and move it; three **gates** (WIN $122.86 / DRAW $117.74 / LOSE $112.69) stand on the right; a **projection fan** from NOW re-aims to the live most-likely gate — at 3-1 it locks on WIN (~77%), then the **90+7′ equalizer snaps it down to the DRAW gate** where it settles ($117.30). The hero gate-flip. |
| 02 | **Gate Ladder** | `forest` | A smooth area/line pinned flat near the DRAW/LOSS gates; a glowing **ladder of W/D/L gate levels** on the right; the **89′ Forest goal** snaps win-prob 23%→74%, the projection beam re-aims to WIN, and the price **climbs through the WIN gate**, settling $123.46 ($0.01 off projection). Clean and legible. |
| 03 | **Rollercoaster** | `liverpool` | The 5-goal swing: 0-2 down → price craters toward the **LOSS gate**; 2-2 comeback → rips back above KO flirting with the **WIN gate** ($185.93); 77′ 2-3 → settles on the **LOSS gate** ($179.09). A live "most-likely gate" indicator swings W↔D↔L with every goal. Price chasing gates. |
| 04 | **Probability Cone** | `everton` | The bookmaker **W/D/L probability bands** (`m.odds`) rendered as a shifting stacked cone/area behind the price; the three gates are targets on the right. Each goal **re-weights the cone** (14%→2%→77%→98% draw) and the implied landing gate shifts; one path resolves through the realized (DRAW) gate. Data-driven, glowy. |
| 05 | **Matchday HUD** | `liverpool` | The integrated product hero: a **scoreboard** (LIVERPOOL 2–3 MAN UTD, running clock), the live reacting price chart, and an **outcome-gates panel** (WIN/DRAW/LOSE · target $ · live %). As each goal fires the score ticks, the price jumps, and the **gates re-price live**; ends settling on the LOSS gate. "This is the product, on real data." |

Each must make a first-time viewer say *"the price moves with the game, and those gates show where it
lands depending on the result."* Cinematic, precise, unmistakably TAIL.TRADE.
