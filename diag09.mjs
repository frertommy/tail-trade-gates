import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url=pathToFileURL(path.resolve('videos/09-books-vs-notch.html')).href;

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
    while(guard++<5000){ const t=C.timers.filter(x=>x.due<=target).sort((a,b)=>a.due-b.due)[0]; if(!t)break; C.vt=t.due; try{t.fn(...t.a);}catch(e){window.__loopErr=String(e&&e.stack||e);} if(t.every)t.due+=t.every; else C.timers=C.timers.filter(x=>x!==t);}
    C.vt=target; const q=C.rafs; C.rafs=[]; for(const cb of q){ try{cb(C.vt);}catch(e){window.__loopErr=String(e&&e.stack||e);} } };
  window.__syncCSS=(t)=>{ for(const a of document.getAnimations()){ try{a.pause();a.currentTime=t;}catch(e){} } };
  const auto=realSetInterval(()=>{ window.__pump(1000/60); if(window.__READY__&&!C.ready){C.ready=true;realClearInterval(auto);} },1000/60);
};

const b=await puppeteer.launch({executablePath:CHROME,headless:true,args:['--enable-unsafe-swiftshader','--disable-web-security','--force-color-profile=srgb'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const p=await b.newPage();
const errs=[];
p.on('pageerror',e=>errs.push('PAGEERR: '+e.message));
p.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE.ERR: '+m.text()); });
await p.evaluateOnNewDocument(HARNESS);
await p.goto(url,{waitUntil:'domcontentloaded'});
try{ await p.waitForFunction('window.__READY__===true',{timeout:8000}); }catch{ errs.push('NOT READY in 8s'); }
const loopMs = await p.evaluate(()=>parseInt(document.body.dataset.loopMs||'12000',10));
const step=1000/30;
// warm a full loop
await p.evaluate((warm,st)=>{ for(let t=0;t<warm;t+=st) window.__pump(st); }, loopMs, step);
const vt0=await p.evaluate(()=>window.__cap.vt);
// sample N frames, report luminance stats + any loop error
const N=Math.round(loopMs/1000*30);
const samples=[];
for(let i=0;i<N;i++){
  const vt=vt0+i*step;
  const s=await p.evaluate((dt,v)=>{ if(dt) window.__pump(dt); window.__syncCSS(v);
    const cv=document.getElementById('cv'); const ctx=cv.getContext('2d');
    const d=ctx.getImageData(0,0,cv.width,cv.height).data; let sum=0,max=0,n=0;
    for(let k=0;k<d.length;k+=4000){ const lum=0.299*d[k]+0.587*d[k+1]+0.114*d[k+2]; sum+=lum; if(lum>max)max=lum; n++; }
    return {yavg:+(sum/n).toFixed(1), ymax:max, err:window.__loopErr||null, price:document.getElementById('priceBig').textContent, clock:document.getElementById('clock').textContent};
  }, i===0?0:step, vt);
  samples.push(s);
}
const errSet=[...new Set(samples.map(s=>s.err).filter(Boolean))];
const yavgs=samples.map(s=>s.yavg);
const ymaxs=samples.map(s=>s.ymax);
console.log('PAGE ERRORS:', errs.length?errs.join(' | '):'(none)');
console.log('LOOP ERRORS:', errSet.length?errSet.join('\n'):'(none)');
console.log('N frames:', N, 'loopMs:', loopMs);
console.log('YAVG min/max:', Math.min(...yavgs), '/', Math.max(...yavgs));
console.log('YMAX overall:', Math.max(...ymaxs));
console.log('frame0:', JSON.stringify(samples[0]));
console.log('frameMid:', JSON.stringify(samples[Math.floor(N*0.62)]));
console.log('frameLast:', JSON.stringify(samples[N-1]));
await b.close();
