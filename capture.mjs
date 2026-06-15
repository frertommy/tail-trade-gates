#!/usr/bin/env node
/* ───────────────────────────────────────────────────────────────────────────
   TAIL.TRADE — deterministic HTML→MP4 capture
   Renders each launch-videos/videos/*.html to launch-videos/mp4/*.mp4 (+ poster).

   How it stays clean & deterministic:
   • A virtual-clock harness is injected BEFORE any scene script runs. It stubs
     rAF / setTimeout / setInterval / performance.now / Date.now so we drive time.
   • Phase A: auto-pump in real time (via the page's *real* timers, captured before
     stubbing) until the template sets window.__READY__ (fonts loaded + first paint).
   • Phase B: stop auto-pump, advance the virtual clock frame-by-frame, sync every
     CSS animation's currentTime to match, screenshot each frame.
   • ffmpeg (h264_videotoolbox, macOS hardware) encodes frames → mp4, yuv420p.

   Usage:
     node capture.mjs                 # all videos, 1080p30, 12s (or each file's data-loop-ms)
     node capture.mjs 03 07           # only those numbers
     FPS=60 DUR=10 node capture.mjs   # overrides
   ─────────────────────────────────────────────────────────────────────────── */
import { spawn } from 'node:child_process';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VID_DIR = path.join(HERE, 'videos');
const OUT_DIR = path.join(HERE, 'mp4');
const POSTER_DIR = path.join(HERE, 'assets', 'posters');
const TMP_DIR = path.join(HERE, '.frames');

const FPS = parseInt(process.env.FPS || '30', 10);
const W = 1920, H = 1080;
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const onlyArgs = process.argv.slice(2).filter(a => /^\d+$/.test(a));

// Harness injected on every new document, before the scene's own scripts.
const HARNESS = () => {
  const realRAF = window.requestAnimationFrame.bind(window);
  const realSetInterval = window.setInterval.bind(window);
  const realClearInterval = window.clearInterval.bind(window);
  const C = { vt: 0, rafs: [], timers: [], id: 1, ready: false };
  window.__cap = C;

  // virtual time sources
  const now = () => C.vt;
  try { performance.now = now; } catch (e) {}
  const RealDate = Date;
  const EPOCH = 1700000000000;
  window.Date = class extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(EPOCH + C.vt); }
    static now() { return EPOCH + C.vt; }
  };

  // virtual rAF
  window.requestAnimationFrame = (cb) => { C.rafs.push(cb); return C.rafs.length; };
  window.cancelAnimationFrame = () => {};

  // virtual timers
  window.setTimeout = (fn, d = 0, ...a) => { const id = C.id++; C.timers.push({ id, due: C.vt + Math.max(0, d), fn, a, every: 0 }); return id; };
  window.setInterval = (fn, d = 0, ...a) => { const id = C.id++; C.timers.push({ id, due: C.vt + Math.max(1, d), fn, a, every: Math.max(1, d) }); return id; };
  window.clearTimeout = (id) => { C.timers = C.timers.filter(t => t.id !== id); };
  window.clearInterval = window.clearTimeout;

  // advance virtual time by dt ms, firing due callbacks
  window.__pump = (dt) => {
    const target = C.vt + dt;
    // timers (cap fires to avoid runaway)
    let guard = 0;
    while (guard++ < 5000) {
      const t = C.timers.filter(x => x.due <= target).sort((a, b) => a.due - b.due)[0];
      if (!t) break;
      C.vt = t.due;
      try { t.fn(...t.a); } catch (e) {}
      if (t.every) t.due += t.every; else C.timers = C.timers.filter(x => x !== t);
    }
    C.vt = target;
    // rAF: fire everything queued, they re-register for next pump
    const q = C.rafs; C.rafs = [];
    for (const cb of q) { try { cb(C.vt); } catch (e) {} }
  };

  // sync all CSS/WAAPI animations to the virtual clock (called each captured frame)
  window.__syncCSS = (t) => {
    for (const a of document.getAnimations()) {
      try { a.pause(); a.currentTime = t; } catch (e) {}
    }
  };

  // Phase A: pump in real time until the template flags ready
  const auto = realSetInterval(() => {
    window.__pump(1000 / 60);
    if (window.__READY__ && !C.ready) { C.ready = true; realClearInterval(auto); }
  }, 1000 / 60);
};

function sh(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    p.stderr.on('data', d => err += d);
    p.on('close', code => code === 0 ? res() : rej(new Error(`${cmd} exited ${code}\n${err.slice(-1500)}`)));
  });
}

async function encode(framesGlob, outFile, count) {
  // Try macOS hardware encoder first, fall back to libx264.
  const base = ['-y', '-framerate', String(FPS), '-i', framesGlob, '-frames:v', String(count),
    '-an', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
  try {
    await sh('ffmpeg', [...base, '-c:v', 'h264_videotoolbox', '-b:v', '12M', outFile]);
  } catch (e) {
    await sh('ffmpeg', [...base, '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', outFile]);
  }
}

async function main() {
  if (!existsSync(CHROME)) { console.error('Chrome not found at', CHROME, '— set CHROME=…'); process.exit(1); }
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(POSTER_DIR, { recursive: true });

  let files = (await readdir(VID_DIR)).filter(f => f.endsWith('.html')).sort();
  if (onlyArgs.length) files = files.filter(f => onlyArgs.some(n => f.startsWith(n)));
  if (!files.length) { console.error('No videos found in', VID_DIR); process.exit(1); }
  console.log(`Capturing ${files.length} video(s) @ ${W}x${H} ${FPS}fps\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--enable-unsafe-swiftshader',
      '--disable-web-security', '--mute-audio'],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });

  const done = [];
  for (const file of files) {
    const name = file.replace(/\.html$/, '');
    const url = pathToFileURL(path.join(VID_DIR, file)).href;
    const framesDir = path.join(TMP_DIR, name);
    await rm(framesDir, { recursive: true, force: true });
    await mkdir(framesDir, { recursive: true });

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(HARNESS);
    process.stdout.write(`● ${name} … `);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Phase A — wait for readiness (fonts + first paint), else force after 8s
      try { await page.waitForFunction('window.__READY__===true', { timeout: 8000 }); }
      catch { await page.evaluate(() => { document.body.classList.add('ready'); window.__cap && (window.__cap.ready = true); }); }

      const loopMs = await page.evaluate(() => parseInt(document.body.dataset.loopMs || '12000', 10));
      const durMs = parseInt(process.env.DUR ? String(+process.env.DUR * 1000) : String(loopMs), 10);
      const N = Math.round(durMs / 1000 * FPS);
      const step = 1000 / FPS;

      // warm up one full loop inside the page (no round-trips) so intros settle
      await page.evaluate((warm, st) => { for (let t = 0; t < warm; t += st) window.__pump(st); }, loopMs, step);
      const vt0 = await page.evaluate(() => window.__cap.vt);

      // Phase B — deterministic frames
      const posterIdx = Math.floor(N * 0.62);
      for (let i = 0; i < N; i++) {
        const vt = vt0 + i * step;
        await page.evaluate((dt, v) => { if (dt) window.__pump(dt); window.__syncCSS(v); }, i === 0 ? 0 : step, vt);
        const fp = path.join(framesDir, String(i).padStart(4, '0') + '.png');
        await page.screenshot({ path: fp, clip: { x: 0, y: 0, width: W, height: H } });
        if (i === posterIdx) await page.screenshot({ path: path.join(POSTER_DIR, name + '.png'), clip: { x: 0, y: 0, width: W, height: H } });
      }
      await page.close();

      const out = path.join(OUT_DIR, name + '.mp4');
      await encode(path.join(framesDir, '%04d.png'), out, N);
      await rm(framesDir, { recursive: true, force: true });
      console.log(`✓ ${N} frames → mp4/${name}.mp4`);
      done.push(name);
    } catch (e) {
      console.log(`✗ ${e.message.split('\n')[0]}`);
      try { await page.close(); } catch {}
    }
  }

  await browser.close();
  await rm(TMP_DIR, { recursive: true, force: true });
  console.log(`\nDone. ${done.length}/${files.length} encoded into ${path.relative(HERE, OUT_DIR)}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
