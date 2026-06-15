import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
const HERE = '/Users/future/Desktop/TAIL.TRADE Gitbook/matchday-gates';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W=1920,H=1080;
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
  window.clearTimeout=(id)=>{ C.timers=C.timers.filter(t=>t.id!==id); };
  window.clearInterval=window.clearTimeout;
  window.__pump=(dt)=>{ const target=C.vt+dt; let guard=0;
    while(guard++<5000){ const t=C.timers.filter(x=>x.due<=target).sort((a,b)=>a.due-b.due)[0]; if(!t)break; C.vt=t.due; try{t.fn(...t.a);}catch(e){} if(t.every)t.due+=t.every; else C.timers=C.timers.filter(x=>x!==t);} 
    C.vt=target; const q=C.rafs; C.rafs=[]; for(const cb of q){ try{cb(C.vt);}catch(e){} } };
  window.__syncCSS=(t)=>{ for(const a of document.getAnimations()){ try{a.pause();a.currentTime=t;}catch(e){} } };
  const auto=realSetInterval(()=>{ window.__pump(1000/60); if(window.__READY__&&!C.ready){C.ready=true;realClearInterval(auto);} },1000/60);
};
const browser = await puppeteer.launch({ executablePath:CHROME, headless:true, args:['--hide-scrollbars','--force-color-profile=srgb','--enable-unsafe-swiftshader','--disable-web-security','--mute-audio'], defaultViewport:{width:W,height:H,deviceScaleFactor:1} });
const page = await browser.newPage();
const errs=[];
page.on('pageerror', e=> errs.push('PAGEERROR: '+e.message));
page.on('console', m=>{ if(m.type()==='error') errs.push('CONSOLE: '+m.text()); });
await page.evaluateOnNewDocument(HARNESS);
const url = pathToFileURL(path.join(HERE,'videos','06-gate-run.html')).href;
await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
try{ await page.waitForFunction('window.__READY__===true',{timeout:8000}); }catch{ await page.evaluate(()=>{document.body.classList.add('ready'); window.__cap&&(window.__cap.ready=true);}); }
const loopMs = await page.evaluate(()=>parseInt(document.body.dataset.loopMs||'12000',10));
const step=1000/30;
await page.evaluate((warm,st)=>{ for(let t=0;t<warm;t+=st) window.__pump(st); }, loopMs, step);
const vt0 = await page.evaluate(()=>window.__cap.vt);
// advance to poster-ish frame (62%)
const N=Math.round(loopMs/1000*30); const posterIdx=Math.floor(N*0.62);
const vt = vt0 + posterIdx*step;
await page.evaluate((v)=>{ window.__syncCSS(v); }, vt);
// Probe internal state by re-deriving in page context isn't possible (closure). Instead sample canvas + DOM.
const info = await page.evaluate(()=>{
  const cv=document.getElementById('c3d'); const ctx=cv.getContext('2d');
  const img=ctx.getImageData(0,0,cv.width,cv.height).data;
  let maxL=0,bright=0,nonbg=0;
  for(let i=0;i<img.length;i+=4){ const r=img[i],g=img[i+1],b=img[i+2]; const l=0.299*r+0.587*g+0.114*b; if(l>maxL)maxL=l; if(l>150)bright++; if(r>30||g>30||b>30)nonbg++; }
  return {
    ready: window.__READY__===true,
    bodyReady: document.body.classList.contains('ready'),
    stageOpacity: getComputedStyle(document.getElementById('stage')).opacity,
    vt: window.__cap.vt,
    priceBig: document.getElementById('priceBig').textContent,
    clock: document.getElementById('clock').textContent,
    scH: document.getElementById('scH').textContent,
    canvasMaxLuma: Math.round(maxL), canvasBrightPx: bright, canvasNonBgPx: nonbg,
  };
});
console.log(JSON.stringify({errs, info, vt0, loopMs, N, posterIdx}, null, 2));
await browser.close();
