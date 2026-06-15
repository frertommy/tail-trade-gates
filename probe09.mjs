import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url=pathToFileURL(path.resolve('videos/09-books-vs-notch.html')).href;
const HARNESS = () => {
  const rSI=window.setInterval.bind(window), rCI=window.clearInterval.bind(window);
  const C={vt:0,rafs:[],timers:[],id:1,ready:false}; window.__cap=C;
  try{performance.now=()=>C.vt;}catch(e){}
  const RD=Date,EP=1700000000000; window.Date=class extends RD{constructor(...a){if(a.length)super(...a);else super(EP+C.vt);}static now(){return EP+C.vt;}};
  window.requestAnimationFrame=cb=>{C.rafs.push(cb);return C.rafs.length;}; window.cancelAnimationFrame=()=>{};
  window.setTimeout=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(0,d),fn,a,every:0});return id;};
  window.setInterval=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(1,d),fn,a,every:Math.max(1,d)});return id;};
  window.clearTimeout=id=>{C.timers=C.timers.filter(t=>t.id!==id);}; window.clearInterval=window.clearTimeout;
  window.__pump=dt=>{const tg=C.vt+dt;let g=0;while(g++<5000){const t=C.timers.filter(x=>x.due<=tg).sort((a,b)=>a.due-b.due)[0];if(!t)break;C.vt=t.due;try{t.fn(...t.a);}catch(e){}if(t.every)t.due+=t.every;else C.timers=C.timers.filter(x=>x!==t);}C.vt=tg;const q=C.rafs;C.rafs=[];for(const cb of q){try{cb(C.vt);}catch(e){}}};
  window.__syncCSS=t=>{for(const a of document.getAnimations()){try{a.pause();a.currentTime=t;}catch(e){}}};
  const au=rSI(()=>{window.__pump(1000/60);if(window.__READY__&&!C.ready){C.ready=true;rCI(au);}},1000/60);
};
const b=await puppeteer.launch({executablePath:CHROME,headless:true,args:['--enable-unsafe-swiftshader','--disable-web-security'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const p=await b.newPage(); await p.evaluateOnNewDocument(HARNESS);
await p.goto(url,{waitUntil:'domcontentloaded'});
await p.waitForFunction('window.__READY__===true',{timeout:8000}).catch(()=>{});
const loopMs=15000, step=1000/30;
await p.evaluate((w,s)=>{for(let t=0;t<w;t+=s)window.__pump(s);},loopMs,step);
const vt0=await p.evaluate(()=>window.__cap.vt);
// probe a set of loop fractions covering KO, mid, pre-eq, equalizer, post-eq, dwell, rewind
const fracs=[0.0,0.05,0.15,0.35,0.55,0.66,0.70,0.72,0.78,0.85,0.92,0.99];
for(const f of fracs){
  const targetVt=vt0 + f*loopMs;
  // pump from current vt to targetVt in steps (deterministic doesn't care, but keep small)
  await p.evaluate((tv)=>{ const cur=window.__cap.vt; const d=tv-cur; if(d>0) window.__pump(d); else { /* reset by warming again */ } window.__syncCSS(window.__cap.vt%15000); }, targetVt);
  const r=await p.evaluate(()=>({
    clock:document.getElementById('clock').textContent,
    score:document.getElementById('scH').textContent+'-'+document.getElementById('scA').textContent,
    price:document.getElementById('priceBig').textContent,
    bookTag:document.getElementById('bookTag').textContent,
    verdict:document.getElementById('bookVerdict').textContent,
    bookSub:document.getElementById('bookSub').textContent,
  }));
  console.log(`f=${f.toFixed(2)}`, JSON.stringify(r));
}
await b.close();
