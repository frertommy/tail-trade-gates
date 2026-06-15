// One-off: extract the real Notch oracle arrays from the saved charts page and
// emit a clean data.js (window.MATCHES) with subject-perspective meta + helpers.
import { readFile, writeFile } from 'node:fs/promises';

const src = await readFile('/tmp/notch-charts.html', 'utf8');
const grab = (name) => {
  const m = src.match(new RegExp('const ' + name + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'));
  if (!m) throw new Error('missing ' + name);
  return Function('return ' + m[1])(); // array literals may contain // comments — Function handles them
};

const arr = {
  forestOdds: grab('forestOdds'), forestPrice: grab('forestPrice'),
  liverpoolOdds: grab('liverpoolOdds'), liverpoolPrice: grab('liverpoolPrice'),
  evertonOdds: grab('evertonOdds'), evertonPrice: grab('evertonPrice'),
};

// odds rows are [min, pHome, pDraw, pAway]. Normalize to subject perspective {min,win,draw,loss}.
const subj = (odds, subjectIdx) => odds.map(r => ({
  min: r[0], win: r[subjectIdx], draw: r[2], loss: r[subjectIdx === 1 ? 3 : 1],
}));

const MATCHES = {
  everton: {
    league: 'Premier League · May 4', subject: 'EVERTON', opponent: 'MAN CITY',
    ticker: 'EVE-PERP', subjectSide: 'home',
    gates: { win: { price: 122.86, prob: 14 }, draw: { price: 117.74, prob: 20 }, loss: { price: 112.69, prob: 66 } },
    koPrice: 115.21, settle: 117.30, realized: 'draw',
    priceMin: 111, priceMax: 124, xMin: -55, xMax: 130, ftMin: 118,
    goals: [
      { min: 38, by: 'opponent', score: '0-1', label: "38' DOKU" },
      { min: 85, by: 'subject', score: '1-1', label: "70' EVERTON" },
      { min: 93, by: 'subject', score: '2-1', label: "78' EVERTON" },
      { min: 99, by: 'subject', score: '3-1', label: "84' EVERTON" },
      { min: 108, by: 'opponent', score: '3-2', label: "90+3' HAALAND" },
      { min: 112, by: 'opponent', score: '3-3', label: "90+7' DOKU" },
    ],
    price: arr.evertonPrice, odds: subj(arr.evertonOdds, 1),
    story: 'Everton, 14% underdog, go 0-1 down (Doku 38\') and sag toward the LOSS gate. Then THREE Everton goals (70-84\') rocket the price up through the DRAW gate toward the WIN gate at 3-1 (~$121). City equalize twice in stoppage (Haaland 90+3\', Doku 90+7\') and the price snaps back DOWN to settle on the DRAW gate ($117.30, projection $117.74). Outcome flipped from WIN-bound to DRAW in the final seconds.',
  },
  forest: {
    league: 'Europa League · Apr 30', subject: 'FOREST', opponent: 'ASTON VILLA',
    ticker: 'FRST-PERP', subjectSide: 'home',
    gates: { win: { price: 123.47, prob: 32 }, draw: { price: 118.31, prob: 30 }, loss: { price: 113.30, prob: 38 } },
    koPrice: 118.03, settle: 123.46, realized: 'win',
    priceMin: 111, priceMax: 126, xMin: -10, xMax: 145, ftMin: 120,
    goals: [{ min: 89, by: 'subject', score: '1-0', label: "89' FOREST" }],
    price: arr.forestPrice, odds: subj(arr.forestOdds, 1),
    story: 'Flat all match, pinned near the DRAW/LOSS gates with win prob drifting down to 23%. An 89th-minute Forest goal snaps win prob 23%→74%; the price detaches the draw line and climbs straight into the WIN gate, settling $123.46 — a $0.01 miss on the $123.47 projection.',
  },
  liverpool: {
    league: 'Premier League · May 3', subject: 'LIVERPOOL', opponent: 'MAN UTD',
    ticker: 'LIV-PERP', subjectSide: 'away',
    gates: { win: { price: 194.00, prob: 34 }, draw: { price: 185.94, prob: 26 }, loss: { price: 178.05, prob: 41 } },
    koPrice: 185.12, settle: 179.09, realized: 'loss',
    priceMin: 176, priceMax: 198, xMin: -60, xMax: 175, ftMin: 120,
    goals: [
      { min: 6, by: 'opponent', score: '0-1', label: "6' CUNHA" },
      { min: 14, by: 'opponent', score: '0-2', label: "14' SESKO" },
      { min: 62, by: 'subject', score: '1-2', label: "47' SZOBOSZLAI" },
      { min: 71, by: 'subject', score: '2-2', label: "56' GAKPO" },
      { min: 92, by: 'opponent', score: '2-3', label: "77' MAINOO" },
    ],
    price: arr.liverpoolPrice, odds: subj(arr.liverpoolOdds, 3),
    story: 'KO $185.12. Man Utd go 2-0 up (6\', 14\') and the price craters toward the LOSS gate ~$180. Liverpool storm back to 2-2 (47\', 56\') and the price rips back above pre-KO to $185.93, flirting with the WIN gate — then Mainoo makes it 2-3 (77\') and it settles right on the LOSS gate, $179.09. Score labels are LIVERPOOL:MAN UTD.',
  },
};

const header = `/* ─────────────────────────────────────────────────────────────────────────
   REAL TAIL.TRADE / Notch oracle data — 3 matches, used by the matchday-gates videos.
   Generated from frertommy.github.io/notch/charts (oracle_price_history + odds snapshots).

   window.MATCHES[key] = {
     league, subject, opponent, ticker, subjectSide,
     gates:   { win|draw|loss: { price, prob } }   // the W/D/L projection "gates" (target $ + implied %)
     koPrice, settle, realized ('win'|'draw'|'loss'),
     priceMin/priceMax (y range), xMin/xMax (minutes-from-KO range), ftMin (settle x),
     goals:   [{ min, by:'subject'|'opponent', score, label }]
     price:   [[min, $], ...]                       // solid lime Notch price line
     odds:    [{ min, win, draw, loss }]            // subject-perspective implied prob %
     story:   prose narrative of the arc
   }
   Helpers: MATCHES_priceAt(m,min), MATCHES_oddsAt(m,min) — linear interpolation.
   Color = meaning: lime=win/up, crimson=loss/down, amber/cyan=draw/neutral.
   ───────────────────────────────────────────────────────────────────────── */
window.MATCHES = ${JSON.stringify(MATCHES, null, 2)};

window.MATCHES_priceAt = function (m, min) {
  const p = m.price; if (min <= p[0][0]) return p[0][1]; if (min >= p[p.length-1][0]) return p[p.length-1][1];
  for (let i = 1; i < p.length; i++) if (min <= p[i][0]) { const a = p[i-1], b = p[i], t = (min-a[0])/(b[0]-a[0]); return a[1]+(b[1]-a[1])*t; }
  return p[p.length-1][1];
};
window.MATCHES_oddsAt = function (m, min) {
  const o = m.odds; const lerp=(a,b,t)=>a+(b-a)*t;
  if (min <= o[0].min) return { ...o[0] }; if (min >= o[o.length-1].min) return { ...o[o.length-1] };
  for (let i = 1; i < o.length; i++) if (min <= o[i].min) { const a=o[i-1], b=o[i], t=(min-a.min)/(b.min-a.min);
    return { min, win: lerp(a.win,b.win,t), draw: lerp(a.draw,b.draw,t), loss: lerp(a.loss,b.loss,t) }; }
  return { ...o[o.length-1] };
};
`;

await writeFile(new URL('./data.js', import.meta.url), header);
console.log('data.js written. matches:', Object.keys(MATCHES).join(', '));
for (const [k, m] of Object.entries(MATCHES)) console.log(`  ${k}: ${m.price.length} price pts, ${m.odds.length} odds pts, ${m.goals.length} goals, realized=${m.realized}`);
