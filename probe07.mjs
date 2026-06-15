import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = pathToFileURL(path.resolve('videos/07-radial-clock.html')).href;

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
  window.setTimeout = (fn,d=0,...a)=>{ const id=C.id++; C.timers.push({id,due:C.vt+Math.max(0,d),fn,a,every:0}); return id; };
  window.setInterval = (fn,d=0,...a)=>{ const id=C.id++; C.timers.push({id,due:C.vt+Math.max(1,d),fn,a,every:Math.max(1,d)}); return id; };
  window.clearTimeout = (id)=>{ C.timers=C.timers.filter(t=>t.id!==id); };
  window.clearInterval = window.clearTimeout;
  window.__pump = (dt)=>{ const target=C.vt+dt; let guard=0;
    while(guard++<5000){ const t=C.timers.filter(x=>x.due<=target).sort((a,b)=>a.due-b.due)[0]; if(!t)break; C.vt=t.due; try{t.fn(...t.a);}catch(e){} if(t.every)t.due+=t.every; else C.timers=C.timers.filter(x=>x!==t);} C.vt=target;
    const q=C.rafs; C.rafs=[]; for(const cb of q){ try{cb(C.vt);}catch(e){ window.__loopErr = (window.__loopErr||'')+' '+e.message; } } };
  window.__syncCSS=(t)=>{ for(const a of document.getAnimations()){ try{a.pause();a.currentTime=t;}catch(e){} } };
  const auto = realSetInterval(()=>{ window.__pump(1000/60); if(window.__READY__&&!C.ready){C.ready=true;realClearInterval(auto);} },1000/60);
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless:true,
  args:['--hide-scrollbars','--force-color-profile=srgb','--enable-unsafe-swiftshader','--disable-web-security','--mute-audio'],
  defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const page = await browser.newPage();
await page.evaluateOnNewDocument(HARNESS);
const errs=[];
page.on('console', m=>{ if(m.type()==='error') errs.push('CONSOLE: '+m.text()); });
page.on('pageerror', e=>errs.push('PAGEERROR: '+e.message));
await page.goto(url,{waitUntil:'domcontentloaded'});
try{ await page.waitForFunction('window.__READY__===true',{timeout:8000}); }catch{ errs.push('NOT_READY'); }

const loopMs = await page.evaluate(()=>parseInt(document.body.dataset.loopMs||'12000',10));
const FPS=30, step=1000/FPS, N=Math.round(loopMs/1000*FPS);
// warm a full loop
await page.evaluate((warm,st)=>{ for(let t=0;t<warm;t+=st) window.__pump(st); }, loopMs, step);
const vt0 = await page.evaluate(()=>window.__cap.vt);

// sample frames, report blank ones + loop errors
const blanks=[];
let firstErr=null;
for(let i=0;i<N;i++){
  const vt = vt0 + i*step;
  await page.evaluate((dt,v)=>{ if(dt) window.__pump(dt); window.__syncCSS(v); }, i===0?0:step, vt);
  const r = await page.evaluate(()=>{
    const cv=document.getElementById('cv'); const ctx=cv.getContext('2d');
    const d=ctx.getImageData(0,0,1920,1080).data; let maxL=0;
    for(let i=0;i<d.length;i+=4*1499){ const l=Math.max(d[i],d[i+1],d[i+2]); if(l>maxL)maxL=l; }
    return { maxL, err: window.__loopErr||null, tl: window.__cap.vt % parseInt(document.body.dataset.loopMs) };
  });
  if(r.err && !firstErr){ firstErr = {i, tl:r.tl, err:r.err}; }
  if(r.maxL < 20) blanks.push({i, tl:Math.round(r.tl), maxL:r.maxL});
}
console.log('N frames:', N, 'loopMs:', loopMs);
console.log('ERRORS(page):', JSON.stringify(errs));
console.log('FIRST loop err:', JSON.stringify(firstErr));
console.log('BLANK frames (<20):', JSON.stringify(blanks.slice(0,40)));
console.log('blank count:', blanks.length);
await browser.close();
