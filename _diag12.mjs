import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = '/Users/future/Desktop/TAIL.TRADE Gitbook/matchday-gates';
const url = pathToFileURL(path.join(HERE,'videos','12-treble-montage.html')).href;
const HARNESS = () => {
  const realSetInterval = window.setInterval.bind(window);
  const realClearInterval = window.clearInterval.bind(window);
  const C = { vt:0, rafs:[], timers:[], id:1, ready:false }; window.__cap=C;
  const now=()=>C.vt; try{performance.now=now;}catch(e){}
  const RealDate=Date; const EPOCH=1700000000000;
  window.Date=class extends RealDate{constructor(...a){if(a.length)super(...a);else super(EPOCH+C.vt);}static now(){return EPOCH+C.vt;}};
  window.requestAnimationFrame=(cb)=>{C.rafs.push(cb);return C.rafs.length;};
  window.cancelAnimationFrame=()=>{};
  window.setTimeout=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(0,d),fn,a,every:0});return id;};
  window.setInterval=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(1,d),fn,a,every:Math.max(1,d)});return id;};
  window.clearTimeout=(id)=>{C.timers=C.timers.filter(t=>t.id!==id);}; window.clearInterval=window.clearTimeout;
  window.__pump=(dt)=>{const target=C.vt+dt;let g=0;while(g++<5000){const t=C.timers.filter(x=>x.due<=target).sort((a,b)=>a.due-b.due)[0];if(!t)break;C.vt=t.due;try{t.fn(...t.a);}catch(e){}if(t.every)t.due+=t.every;else C.timers=C.timers.filter(x=>x!==t);}C.vt=target;const q=C.rafs;C.rafs=[];for(const cb of q){try{cb(C.vt);}catch(e){}}};
  window.__syncCSS=(t)=>{for(const a of document.getAnimations()){try{a.pause();a.currentTime=t;}catch(e){}}};
  const auto=realSetInterval(()=>{window.__pump(1000/60);if(window.__READY__&&!C.ready){C.ready=true;realClearInterval(auto);}},1000/60);
};
const errs=[];
const browser=await puppeteer.launch({executablePath:CHROME,headless:true,args:['--hide-scrollbars','--force-color-profile=srgb','--enable-unsafe-swiftshader','--disable-web-security','--mute-audio'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const page=await browser.newPage();
page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
page.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE: '+m.text()); });
await page.evaluateOnNewDocument(HARNESS);
await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
try{ await page.waitForFunction('window.__READY__===true',{timeout:8000}); }
catch{ errs.push('NEVER READY'); await page.evaluate(()=>{document.body.classList.add('ready');window.__cap&&(window.__cap.ready=true);}); }
const loopMs=await page.evaluate(()=>parseInt(document.body.dataset.loopMs||'12000',10));
const step=1000/30;
// warm a full loop
await page.evaluate((warm,st)=>{for(let t=0;t<warm;t+=st)window.__pump(st);},loopMs,step);
const vt0=await page.evaluate(()=>window.__cap.vt);
// sample several loop-local times
const samples=[0,1500,3000,4400,5900,7500,8800,10300,12000,13200,14500,16000,16800,loopMs-1];
const out=[];
for(const target of samples){
  // advance to vt0 + target by pumping from current; but we need deterministic per-tl: pump fresh
  const cur=await page.evaluate(()=>window.__cap.vt);
  const dt = (vt0+target) - cur;
  await page.evaluate((dt,v)=>{ if(dt>0) window.__pump(dt); window.__syncCSS(v); }, dt>0?dt:0.0001, vt0+target);
  const buf=await page.screenshot({clip:{x:0,y:0,width:1920,height:1080}});
  // compute YAVG quickly via sharp-free: sample pixels through canvas readback in page
  const stats=await page.evaluate(()=>{
    const cv=document.getElementById('cv'); const c=cv.getContext('2d');
    const d=c.getImageData(0,0,1920,1080).data; let sum=0,n=0,mx=0;
    for(let i=0;i<d.length;i+=4*97){ const y=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; sum+=y; n++; if(y>mx)mx=y; }
    return {yavg:sum/n, ymax:mx};
  });
  out.push({tl: (target%loopMs), yavg:+stats.yavg.toFixed(1), ymax:+stats.ymax.toFixed(0)});
}
console.log('loopMs',loopMs);
console.log('errors:', errs.length? errs.slice(0,20): 'NONE');
console.log('samples (tl, yavg, ymax):');
for(const s of out) console.log('  tl='+String(s.tl).padStart(6)+'  yavg='+String(s.yavg).padStart(6)+'  ymax='+s.ymax);
await browser.close();
