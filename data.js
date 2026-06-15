/* ─────────────────────────────────────────────────────────────────────────
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
window.MATCHES = {
  "everton": {
    "league": "Premier League · May 4",
    "subject": "EVERTON",
    "opponent": "MAN CITY",
    "ticker": "EVE-PERP",
    "subjectSide": "home",
    "gates": {
      "win": {
        "price": 122.86,
        "prob": 14
      },
      "draw": {
        "price": 117.74,
        "prob": 20
      },
      "loss": {
        "price": 112.69,
        "prob": 66
      }
    },
    "koPrice": 115.21,
    "settle": 117.3,
    "realized": "draw",
    "priceMin": 111,
    "priceMax": 124,
    "xMin": -55,
    "xMax": 130,
    "ftMin": 118,
    "goals": [
      {
        "min": 38,
        "by": "opponent",
        "score": "0-1",
        "label": "38' DOKU"
      },
      {
        "min": 85,
        "by": "subject",
        "score": "1-1",
        "label": "70' EVERTON"
      },
      {
        "min": 93,
        "by": "subject",
        "score": "2-1",
        "label": "78' EVERTON"
      },
      {
        "min": 99,
        "by": "subject",
        "score": "3-1",
        "label": "84' EVERTON"
      },
      {
        "min": 108,
        "by": "opponent",
        "score": "3-2",
        "label": "90+3' HAALAND"
      },
      {
        "min": 112,
        "by": "opponent",
        "score": "3-3",
        "label": "90+7' DOKU"
      }
    ],
    "price": [
      [
        -55,
        115.37
      ],
      [
        -50,
        115.36
      ],
      [
        -45,
        115.33
      ],
      [
        -40,
        115.33
      ],
      [
        -35,
        115.32
      ],
      [
        -30,
        115.3
      ],
      [
        -25,
        115.31
      ],
      [
        -15,
        115.25
      ],
      [
        -10,
        115.3
      ],
      [
        -5,
        115.3
      ],
      [
        0,
        115.21
      ],
      [
        5,
        115.15
      ],
      [
        10,
        115
      ],
      [
        15,
        115.03
      ],
      [
        20,
        114.98
      ],
      [
        25,
        115.06
      ],
      [
        30,
        115.31
      ],
      [
        35,
        115.3
      ],
      [
        40,
        114.65
      ],
      [
        45,
        113.89
      ],
      [
        50,
        113.99
      ],
      [
        55,
        114.04
      ],
      [
        60,
        113.91
      ],
      [
        65,
        113.88
      ],
      [
        70,
        113.86
      ],
      [
        75,
        113.76
      ],
      [
        80,
        113.86
      ],
      [
        85,
        115.19
      ],
      [
        90,
        117.95
      ],
      [
        95,
        119.31
      ],
      [
        100,
        120.12
      ],
      [
        105,
        119.96
      ],
      [
        110,
        121.19
      ],
      [
        115,
        118.99
      ],
      [
        120,
        119.2
      ],
      [
        125,
        119.21
      ],
      [
        130,
        119.2
      ],
      [
        135,
        119.2
      ],
      [
        140,
        119.21
      ],
      [
        145,
        119.21
      ]
    ],
    "odds": [
      {
        "min": -28,
        "win": 13.7,
        "draw": 19.5,
        "loss": 66.6
      },
      {
        "min": -24,
        "win": 13.7,
        "draw": 19.3,
        "loss": 66.9
      },
      {
        "min": -18,
        "win": 13.8,
        "draw": 19.5,
        "loss": 66.9
      },
      {
        "min": -12,
        "win": 14,
        "draw": 20,
        "loss": 67
      },
      {
        "min": -6,
        "win": 13.5,
        "draw": 20,
        "loss": 67
      },
      {
        "min": 0,
        "win": 13.5,
        "draw": 19.8,
        "loss": 66.8
      },
      {
        "min": 4,
        "win": 13.4,
        "draw": 19.6,
        "loss": 67
      },
      {
        "min": 10,
        "win": 10,
        "draw": 20.8,
        "loss": 70
      },
      {
        "min": 16,
        "win": 9.9,
        "draw": 20.5,
        "loss": 69.5
      },
      {
        "min": 22,
        "win": 9.3,
        "draw": 21,
        "loss": 70.9
      },
      {
        "min": 28,
        "win": 13.7,
        "draw": 24.2,
        "loss": 69.8
      },
      {
        "min": 32,
        "win": 11.7,
        "draw": 23.8,
        "loss": 64.6
      },
      {
        "min": 36,
        "win": 10.3,
        "draw": 24.9,
        "loss": 65.6
      },
      {
        "min": 38,
        "win": 13.2,
        "draw": 27,
        "loss": 67.6
      },
      {
        "min": 42,
        "win": 4.3,
        "draw": 15.2,
        "loss": 80.7
      },
      {
        "min": 44,
        "win": 3.4,
        "draw": 14.3,
        "loss": 82.8
      },
      {
        "min": 46,
        "win": 3.3,
        "draw": 13.5,
        "loss": 84.8
      },
      {
        "min": 52,
        "win": 3.4,
        "draw": 14.2,
        "loss": 82.6
      },
      {
        "min": 58,
        "win": 4.5,
        "draw": 14.7,
        "loss": 87.5
      },
      {
        "min": 64,
        "win": 2.7,
        "draw": 13.4,
        "loss": 84.2
      },
      {
        "min": 66,
        "win": 2.8,
        "draw": 13.6,
        "loss": 83.8
      },
      {
        "min": 70,
        "win": 2.7,
        "draw": 13.9,
        "loss": 83.8
      },
      {
        "min": 72,
        "win": 4,
        "draw": 15.4,
        "loss": 87.2
      },
      {
        "min": 78,
        "win": 3.6,
        "draw": 15.3,
        "loss": 87.6
      },
      {
        "min": 80,
        "win": 2.1,
        "draw": 14,
        "loss": 83.7
      },
      {
        "min": 82,
        "win": 2,
        "draw": 13.9,
        "loss": 84.2
      },
      {
        "min": 84,
        "win": 2.2,
        "draw": 14,
        "loss": 83.7
      },
      {
        "min": 86,
        "win": 11,
        "draw": 29.9,
        "loss": 59.9
      },
      {
        "min": 88,
        "win": 11.9,
        "draw": 44.2,
        "loss": 43.8
      },
      {
        "min": 90,
        "win": 39.4,
        "draw": 36.3,
        "loss": 27.1
      },
      {
        "min": 92,
        "win": 53.7,
        "draw": 33.8,
        "loss": 13.1
      },
      {
        "min": 94,
        "win": 56.9,
        "draw": 31,
        "loss": 13.5
      },
      {
        "min": 96,
        "win": 59.6,
        "draw": 29.2,
        "loss": 12.1
      },
      {
        "min": 98,
        "win": 72,
        "draw": 21.7,
        "loss": 7.3
      },
      {
        "min": 100,
        "win": 82.9,
        "draw": 15.1,
        "loss": 3.5
      },
      {
        "min": 102,
        "win": 66.8,
        "draw": 27.3,
        "loss": 7.2
      },
      {
        "min": 104,
        "win": 65.7,
        "draw": 30.3,
        "loss": 7
      },
      {
        "min": 106,
        "win": 70.9,
        "draw": 25.1,
        "loss": 5.1
      },
      {
        "min": 108,
        "win": 75.2,
        "draw": 23.2,
        "loss": 2.7
      },
      {
        "min": 110,
        "win": 82.1,
        "draw": 17.2,
        "loss": 1.5
      },
      {
        "min": 112,
        "win": 88.5,
        "draw": 11.7,
        "loss": 1.6
      },
      {
        "min": 114,
        "win": 79.7,
        "draw": 22.1,
        "loss": 0.7
      },
      {
        "min": 116,
        "win": 3.1,
        "draw": 98.1,
        "loss": 1.1
      },
      {
        "min": 118,
        "win": 1,
        "draw": 99,
        "loss": 0
      },
      {
        "min": 120,
        "win": 0.5,
        "draw": 99.5,
        "loss": 0
      },
      {
        "min": 125,
        "win": 0,
        "draw": 100,
        "loss": 0
      }
    ],
    "story": "Everton, 14% underdog, go 0-1 down (Doku 38') and sag toward the LOSS gate. Then THREE Everton goals (70-84') rocket the price up through the DRAW gate toward the WIN gate at 3-1 (~$121). City equalize twice in stoppage (Haaland 90+3', Doku 90+7') and the price snaps back DOWN to settle on the DRAW gate ($117.30, projection $117.74). Outcome flipped from WIN-bound to DRAW in the final seconds."
  },
  "forest": {
    "league": "Europa League · Apr 30",
    "subject": "FOREST",
    "opponent": "ASTON VILLA",
    "ticker": "FRST-PERP",
    "subjectSide": "home",
    "gates": {
      "win": {
        "price": 123.47,
        "prob": 32
      },
      "draw": {
        "price": 118.31,
        "prob": 30
      },
      "loss": {
        "price": 113.3,
        "prob": 38
      }
    },
    "koPrice": 118.03,
    "settle": 123.46,
    "realized": "win",
    "priceMin": 111,
    "priceMax": 126,
    "xMin": -10,
    "xMax": 145,
    "ftMin": 120,
    "goals": [
      {
        "min": 89,
        "by": "subject",
        "score": "1-0",
        "label": "89' FOREST"
      }
    ],
    "price": [
      [
        -10,
        118.09
      ],
      [
        -5,
        118.08
      ],
      [
        0,
        118.03
      ],
      [
        5,
        117.92
      ],
      [
        10,
        117.97
      ],
      [
        15,
        117.88
      ],
      [
        20,
        117.99
      ],
      [
        25,
        118.06
      ],
      [
        30,
        118.11
      ],
      [
        35,
        118.11
      ],
      [
        40,
        118.15
      ],
      [
        45,
        118.19
      ],
      [
        50,
        118.19
      ],
      [
        55,
        118.2
      ],
      [
        60,
        118.18
      ],
      [
        65,
        118.36
      ],
      [
        70,
        118.18
      ],
      [
        75,
        118.12
      ],
      [
        80,
        119.22
      ],
      [
        85,
        120.07
      ],
      [
        90,
        121.27
      ],
      [
        95,
        121.69
      ],
      [
        100,
        122.22
      ],
      [
        105,
        122.31
      ],
      [
        110,
        123.3
      ],
      [
        115,
        123.14
      ],
      [
        120,
        123.46
      ],
      [
        125,
        123.46
      ],
      [
        130,
        123.46
      ],
      [
        140,
        123.46
      ],
      [
        145,
        123.46
      ]
    ],
    "odds": [
      {
        "min": -5,
        "win": 32.6,
        "draw": 29.6,
        "loss": 37.8
      },
      {
        "min": 0,
        "win": 32.3,
        "draw": 29.6,
        "loss": 38
      },
      {
        "min": 5,
        "win": 32.1,
        "draw": 29.9,
        "loss": 38
      },
      {
        "min": 10,
        "win": 31.2,
        "draw": 30.6,
        "loss": 38.1
      },
      {
        "min": 20,
        "win": 30.3,
        "draw": 31.6,
        "loss": 38.1
      },
      {
        "min": 25,
        "win": 30.5,
        "draw": 32.5,
        "loss": 37
      },
      {
        "min": 30,
        "win": 31.2,
        "draw": 33.6,
        "loss": 35
      },
      {
        "min": 35,
        "win": 30.9,
        "draw": 35.1,
        "loss": 33.9
      },
      {
        "min": 40,
        "win": 29.8,
        "draw": 37.4,
        "loss": 33.1
      },
      {
        "min": 50,
        "win": 28.9,
        "draw": 39.3,
        "loss": 32.3
      },
      {
        "min": 55,
        "win": 28.8,
        "draw": 39.3,
        "loss": 32.2
      },
      {
        "min": 60,
        "win": 28.8,
        "draw": 39.3,
        "loss": 31.9
      },
      {
        "min": 65,
        "win": 27.9,
        "draw": 41.8,
        "loss": 30.3
      },
      {
        "min": 75,
        "win": 25.5,
        "draw": 45.2,
        "loss": 28.6
      },
      {
        "min": 80,
        "win": 23.6,
        "draw": 49.7,
        "loss": 26.7
      },
      {
        "min": 85,
        "win": 22.8,
        "draw": 52.5,
        "loss": 24.6
      },
      {
        "min": 90,
        "win": 73.8,
        "draw": 22.1,
        "loss": 4.4
      },
      {
        "min": 100,
        "win": 78,
        "draw": 19.1,
        "loss": 2.8
      },
      {
        "min": 105,
        "win": 84.8,
        "draw": 13.5,
        "loss": 1.4
      },
      {
        "min": 110,
        "win": 92.3,
        "draw": 7.1,
        "loss": 0.5
      },
      {
        "min": 115,
        "win": 92.3,
        "draw": 7.1,
        "loss": 0.5
      },
      {
        "min": 125,
        "win": 93.5,
        "draw": 6.2,
        "loss": 0.4
      }
    ],
    "story": "Flat all match, pinned near the DRAW/LOSS gates with win prob drifting down to 23%. An 89th-minute Forest goal snaps win prob 23%→74%; the price detaches the draw line and climbs straight into the WIN gate, settling $123.46 — a $0.01 miss on the $123.47 projection."
  },
  "liverpool": {
    "league": "Premier League · May 3",
    "subject": "LIVERPOOL",
    "opponent": "MAN UTD",
    "ticker": "LIV-PERP",
    "subjectSide": "away",
    "gates": {
      "win": {
        "price": 194,
        "prob": 34
      },
      "draw": {
        "price": 185.94,
        "prob": 26
      },
      "loss": {
        "price": 178.05,
        "prob": 41
      }
    },
    "koPrice": 185.12,
    "settle": 179.09,
    "realized": "loss",
    "priceMin": 176,
    "priceMax": 198,
    "xMin": -60,
    "xMax": 175,
    "ftMin": 120,
    "goals": [
      {
        "min": 6,
        "by": "opponent",
        "score": "0-1",
        "label": "6' CUNHA"
      },
      {
        "min": 14,
        "by": "opponent",
        "score": "0-2",
        "label": "14' SESKO"
      },
      {
        "min": 62,
        "by": "subject",
        "score": "1-2",
        "label": "47' SZOBOSZLAI"
      },
      {
        "min": 71,
        "by": "subject",
        "score": "2-2",
        "label": "56' GAKPO"
      },
      {
        "min": 92,
        "by": "opponent",
        "score": "2-3",
        "label": "77' MAINOO"
      }
    ],
    "price": [
      [
        -60,
        185.47
      ],
      [
        -55,
        185.46
      ],
      [
        -50,
        185.48
      ],
      [
        -45,
        185.5
      ],
      [
        -40,
        185.55
      ],
      [
        -35,
        185.53
      ],
      [
        -30,
        185.5
      ],
      [
        -25,
        185.51
      ],
      [
        -20,
        185.57
      ],
      [
        -15,
        185.55
      ],
      [
        -10,
        185.55
      ],
      [
        -5,
        185.53
      ],
      [
        0,
        185.12
      ],
      [
        5,
        183.12
      ],
      [
        10,
        180.79
      ],
      [
        15,
        180.96
      ],
      [
        20,
        180.74
      ],
      [
        25,
        180.68
      ],
      [
        30,
        180.43
      ],
      [
        35,
        180.33
      ],
      [
        40,
        180.1
      ],
      [
        45,
        179.89
      ],
      [
        50,
        179.91
      ],
      [
        55,
        180.08
      ],
      [
        60,
        179.95
      ],
      [
        65,
        182.49
      ],
      [
        70,
        182.47
      ],
      [
        75,
        185.39
      ],
      [
        80,
        185.52
      ],
      [
        85,
        185.93
      ],
      [
        90,
        185.63
      ],
      [
        95,
        181.09
      ],
      [
        100,
        180.75
      ],
      [
        105,
        180
      ],
      [
        110,
        179.09
      ],
      [
        115,
        179.09
      ],
      [
        120,
        179.09
      ],
      [
        125,
        179.09
      ],
      [
        130,
        179.09
      ],
      [
        135,
        179.09
      ],
      [
        140,
        179.1
      ],
      [
        145,
        179.1
      ],
      [
        150,
        179.1
      ],
      [
        155,
        179.09
      ],
      [
        160,
        179.09
      ],
      [
        165,
        179.09
      ],
      [
        170,
        179.09
      ],
      [
        175,
        179.09
      ]
    ],
    "odds": [
      {
        "min": -60,
        "win": 33.9,
        "draw": 25.5,
        "loss": 40.7
      },
      {
        "min": -55,
        "win": 33.9,
        "draw": 25.4,
        "loss": 40.5
      },
      {
        "min": -50,
        "win": 34,
        "draw": 25.4,
        "loss": 40.4
      },
      {
        "min": -45,
        "win": 34.3,
        "draw": 25.5,
        "loss": 40.3
      },
      {
        "min": -40,
        "win": 34.3,
        "draw": 25.5,
        "loss": 40.2
      },
      {
        "min": -35,
        "win": 34.2,
        "draw": 25.5,
        "loss": 40.1
      },
      {
        "min": -30,
        "win": 34,
        "draw": 25.4,
        "loss": 40.4
      },
      {
        "min": -25,
        "win": 34,
        "draw": 25.8,
        "loss": 40.3
      },
      {
        "min": -20,
        "win": 34.2,
        "draw": 25.8,
        "loss": 40.1
      },
      {
        "min": -15,
        "win": 34.2,
        "draw": 25.7,
        "loss": 40.1
      },
      {
        "min": -10,
        "win": 34.2,
        "draw": 25.8,
        "loss": 40.1
      },
      {
        "min": -5,
        "win": 34.1,
        "draw": 25.9,
        "loss": 40.2
      },
      {
        "min": 0,
        "win": 34,
        "draw": 25.7,
        "loss": 40.2
      },
      {
        "min": 5,
        "win": 25.9,
        "draw": 24,
        "loss": 50.8
      },
      {
        "min": 10,
        "win": 19,
        "draw": 22.1,
        "loss": 59.2
      },
      {
        "min": 15,
        "win": 8.1,
        "draw": 13.9,
        "loss": 78
      },
      {
        "min": 20,
        "win": 7.4,
        "draw": 13.5,
        "loss": 79.2
      },
      {
        "min": 25,
        "win": 7.2,
        "draw": 13.7,
        "loss": 79.2
      },
      {
        "min": 30,
        "win": 6.9,
        "draw": 13.5,
        "loss": 79.5
      },
      {
        "min": 35,
        "win": 6.4,
        "draw": 13.4,
        "loss": 80.3
      },
      {
        "min": 40,
        "win": 5.9,
        "draw": 13.1,
        "loss": 80.8
      },
      {
        "min": 45,
        "win": 5.2,
        "draw": 12,
        "loss": 82.3
      },
      {
        "min": 50,
        "win": 4.6,
        "draw": 11.3,
        "loss": 84
      },
      {
        "min": 55,
        "win": 4.6,
        "draw": 11.3,
        "loss": 84
      },
      {
        "min": 60,
        "win": 4.6,
        "draw": 11.3,
        "loss": 84
      },
      {
        "min": 65,
        "win": 4.5,
        "draw": 11.1,
        "loss": 84.5
      },
      {
        "min": 70,
        "win": 12.2,
        "draw": 23.5,
        "loss": 63.9
      },
      {
        "min": 75,
        "win": 11.6,
        "draw": 24.3,
        "loss": 64.1
      },
      {
        "min": 80,
        "win": 27.3,
        "draw": 40.4,
        "loss": 32.5
      },
      {
        "min": 85,
        "win": 25.6,
        "draw": 45.6,
        "loss": 29.2
      },
      {
        "min": 90,
        "win": 24.6,
        "draw": 49.9,
        "loss": 26
      },
      {
        "min": 95,
        "win": 4.5,
        "draw": 21.5,
        "loss": 73.7
      },
      {
        "min": 100,
        "win": 3.6,
        "draw": 20,
        "loss": 76.3
      },
      {
        "min": 105,
        "win": 2,
        "draw": 16.8,
        "loss": 81.1
      },
      {
        "min": 110,
        "win": 0.4,
        "draw": 9.7,
        "loss": 89.6
      },
      {
        "min": 115,
        "win": 0.1,
        "draw": 6.4,
        "loss": 93.5
      },
      {
        "min": 120,
        "win": 0.1,
        "draw": 6.4,
        "loss": 93.5
      },
      {
        "min": 125,
        "win": 0.1,
        "draw": 6.4,
        "loss": 93.5
      }
    ],
    "story": "KO $185.12. Man Utd go 2-0 up (6', 14') and the price craters toward the LOSS gate ~$180. Liverpool storm back to 2-2 (47', 56') and the price rips back above pre-KO to $185.93, flirting with the WIN gate — then Mainoo makes it 2-3 (77') and it settles right on the LOSS gate, $179.09. Score labels are LIVERPOOL:MAN UTD."
  }
};

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
