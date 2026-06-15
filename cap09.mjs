#!/usr/bin/env node
/* Isolated capture for variant 09 only — sibling-safe.
   Uses a UNIQUE temp dir (.frames09) so concurrent capture.mjs runs for other
   variants cannot delete our frames mid-write (the shared capture.mjs rm's
   .frames at the end, which races sibling processes). Same harness + encode
   path as capture.mjs; writes mp4/09-...mp4 + assets/posters/09-...png. */
import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NAME = '09-books-vs-notch';
const VID = path.join(HERE, 'videos', NAME + '.html');
const OUT = path.join(HERE, 'mp4', NAME + '.mp4');
const POSTER = path.join(HERE, 'assets', 'posters', NAME + '.png');
const TMP = path.join(HERE, '.frames09');         // UNIQUE — not the shared .frames
const FPS = 30, W = 1920, H = 1080;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const HARNESS = () => {
  const realSetInterval = window.setInterval.bind(window);
  const realClearInterval = window.clearInterval.bind(window);
  const C = { vt: 0, rafs: [], timers: [], id: 1, ready: false };
  window.__cap = C;
  const now = () => C.vt;
  try { performance.now = now; } catch (e) {}
  const RealDate = Date; const EPOCH = 1700000000000;
  window.Date = class extends RealDate { constructor(...a){ if(a.length) super(...a); else super(EPOCH+C.vt);} static now(){return EPOCH+C.vt;} };
  window.requestAnimationFrame = (cb)=>{ C.rafs.push(cb); return C.rafs.length; };
  window.cancelAnimationFrame = ()=>{};
  window.setTimeout=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(0,d),fn,a,every:0});return id;};
  window.setInterval=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(1,d),fn,a,every:Math.max(1,d)});return id;};
  window.clearTimeout=(id)=>{C.timers=C.timers.filter(t=>t.id!==id);};
  window.clearInterval=window.clearTimeout;
  window.__pump=(dt)=>{ const target=C.vt+dt; let guard=0;
    while(guard++<5000){ const t=C.timers.filter(x=>x.due<=target).sort((a,b)=>a.due-b.due)[0]; if(!t)break; C.vt=t.due; try{t.fn(...t.a);}catch(e){} if(t.every)t.due+=t.every; else C.timers=C.timers.filter(x=>x!==t);}
    C.vt=target; const q=C.rafs; C.rafs=[]; for(const cb of q){ try{cb(C.vt);}catch(e){} } };
  window.__syncCSS=(t)=>{ for(const a of document.getAnimations()){ try{a.pause();a.currentTime=t;}catch(e){} } };
  const auto=realSetInterval(()=>{ window.__pump(1000/60); if(window.__READY__&&!C.ready){C.ready=true;realClearInterval(auto);} },1000/60);
};

function sh(cmd,args){ return new Promise((res,rej)=>{ const p=spawn(cmd,args,{stdio:['ignore','pipe','pipe']}); let err=''; p.stderr.on('data',d=>err+=d); p.on('close',c=>c===0?res():rej(new Error(`${cmd} exited ${c}\n${err.slice(-1200)}`))); }); }
async function encode(glob,out,count){
  const base=['-y','-framerate',String(FPS),'-i',glob,'-frames:v',String(count),'-an','-pix_fmt','yuv420p','-movflags','+faststart'];
  try{ await sh('ffmpeg',[...base,'-c:v','h264_videotoolbox','-b:v','12M',out]); }
  catch(e){ await sh('ffmpeg',[...base,'-c:v','libx264','-crf','18','-preset','medium',out]); }
}

async function main(){
  if(!existsSync(CHROME)){ console.error('Chrome not found',CHROME); process.exit(1); }
  await rm(TMP,{recursive:true,force:true}); await mkdir(TMP,{recursive:true});
  await mkdir(path.dirname(OUT),{recursive:true}); await mkdir(path.dirname(POSTER),{recursive:true});
  const browser=await puppeteer.launch({ executablePath:CHROME, headless:true,
    args:['--hide-scrollbars','--force-color-profile=srgb','--enable-unsafe-swiftshader','--disable-web-security','--mute-audio'],
    defaultViewport:{width:W,height:H,deviceScaleFactor:1} });
  const page=await browser.newPage();
  await page.evaluateOnNewDocument(HARNESS);
  const url=pathToFileURL(VID).href;
  process.stdout.write(`● ${NAME} … `);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  try{ await page.waitForFunction('window.__READY__===true',{timeout:8000}); }
  catch{ await page.evaluate(()=>{document.body.classList.add('ready');window.__cap&&(window.__cap.ready=true);}); }
  const loopMs=await page.evaluate(()=>parseInt(document.body.dataset.loopMs||'12000',10));
  const N=Math.round(loopMs/1000*FPS); const step=1000/FPS;
  await page.evaluate((warm,st)=>{ for(let t=0;t<warm;t+=st) window.__pump(st); }, loopMs, step);
  const vt0=await page.evaluate(()=>window.__cap.vt);
  const posterIdx=Math.floor(N*0.72);   // post-equalizer money shot (snap + payoff)
  for(let i=0;i<N;i++){
    const vt=vt0+i*step;
    await page.evaluate((dt,v)=>{ if(dt) window.__pump(dt); window.__syncCSS(v); }, i===0?0:step, vt);
    const fp=path.join(TMP,String(i).padStart(4,'0')+'.png');
    await page.screenshot({ path:fp, clip:{x:0,y:0,width:W,height:H} });
    if(i===posterIdx) await page.screenshot({ path:POSTER, clip:{x:0,y:0,width:W,height:H} });
  }
  await page.close(); await browser.close();
  await encode(path.join(TMP,'%04d.png'),OUT,N);
  await rm(TMP,{recursive:true,force:true});   // only OUR unique dir
  console.log(`✓ ${N} frames → mp4/${NAME}.mp4 (poster idx ${posterIdx})`);
}
main().catch(e=>{ console.error('\n'+e.message); process.exit(1); });
