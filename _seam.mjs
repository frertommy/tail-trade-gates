import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE='/Users/future/Desktop/TAIL.TRADE Gitbook/matchday-gates';
const url=pathToFileURL(path.join(HERE,'videos','12-treble-montage.html')).href;
const HARNESS=()=>{const rSI=window.setInterval.bind(window),rCI=window.clearInterval.bind(window);const C={vt:0,rafs:[],timers:[],id:1,ready:false};window.__cap=C;const now=()=>C.vt;try{performance.now=now;}catch(e){}const RD=Date,EP=17e11;window.Date=class extends RD{constructor(...a){if(a.length)super(...a);else super(EP+C.vt);}static now(){return EP+C.vt;}};window.requestAnimationFrame=cb=>{C.rafs.push(cb);return C.rafs.length;};window.cancelAnimationFrame=()=>{};window.setTimeout=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(0,d),fn,a,every:0});return id;};window.setInterval=(fn,d=0,...a)=>{const id=C.id++;C.timers.push({id,due:C.vt+Math.max(1,d),fn,a,every:Math.max(1,d)});return id;};window.clearTimeout=id=>{C.timers=C.timers.filter(t=>t.id!==id);};window.clearInterval=window.clearTimeout;window.__pump=dt=>{const tg=C.vt+dt;let g=0;while(g++<5000){const t=C.timers.filter(x=>x.due<=tg).sort((a,b)=>a.due-b.due)[0];if(!t)break;C.vt=t.due;try{t.fn(...t.a);}catch(e){}if(t.every)t.due+=t.every;else C.timers=C.timers.filter(x=>x!==t);}C.vt=tg;const q=C.rafs;C.rafs=[];for(const cb of q){try{cb(C.vt);}catch(e){}}};window.__syncCSS=t=>{for(const a of document.getAnimations()){try{a.pause();a.currentTime=t;}catch(e){}}};const auto=rSI(()=>{window.__pump(1000/60);if(window.__READY__&&!C.ready){C.ready=true;rCI(auto);}},1000/60);};
const browser=await puppeteer.launch({executablePath:CHROME,headless:true,args:['--enable-unsafe-swiftshader'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const page=await browser.newPage();
const errs=[]; page.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join(' | ')));
await page.evaluateOnNewDocument(HARNESS);
await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForFunction('window.__READY__===true',{timeout:8000});
const loopMs=17000, FPS=30, step=1000/FPS, N=Math.round(loopMs/1000*FPS);
await page.evaluate((warm,st)=>{for(let t=0;t<warm;t+=st)window.__pump(st);},loopMs,step);
const vt0=await page.evaluate(()=>window.__cap.vt);
console.log('vt0='+vt0+'  vt0%loop='+(vt0%loopMs).toFixed(1));
const blackRanges=[]; let curStart=null;
for(let i=0;i<N;i++){
  const vt=vt0+i*step;
  await page.evaluate((dt,v)=>{if(dt)window.__pump(dt);window.__syncCSS(v);}, i===0?0:step, vt);
  const s=await page.evaluate(()=>{const c=document.getElementById('cv').getContext('2d');const d=c.getImageData(0,0,1920,1080).data;let mx=0;for(let i=0;i<d.length;i+=4*397){const y=.299*d[i]+.587*d[i+1]+.114*d[i+2];if(y>mx)mx=y;}return mx|0;});
  const realTl = vt % loopMs;
  if(s<10){ if(curStart===null) curStart={i,tl:realTl}; }
  else { if(curStart!==null){ blackRanges.push({from:curStart, to:{i:i-1, tl:(vt-step)%loopMs}}); curStart=null; } }
}
if(curStart!==null) blackRanges.push({from:curStart,to:{i:N-1,tl:(vt0+(N-1)*step)%loopMs}});
console.log('errs:', errs.length?errs.slice(0,8):'NONE');
console.log('black ranges (ymax<10):');
for(const r of blackRanges) console.log('  frames '+r.from.i+'..'+r.to.i+'  realTl '+r.from.tl.toFixed(0)+'..'+r.to.tl.toFixed(0));
if(!blackRanges.length) console.log('  NONE — no blank frames');
await browser.close();
