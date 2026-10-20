// Record the REAL animation of a page, then resample to a constant frame rate.
//
//   node capture.mjs <plan.json> <outDir>
//
// plan.json
//   {
//     "url": "http://localhost:5180/index.html",
//     "w": 1440, "h": 900, "dpr": 1,
//     "fps": 30, "duration": 8,
//     "reload": true,                 // reload while recording so load-time intros are caught
//     "settle": 1.0,                  // seconds to wait after load before the scroll plan starts
//     "hide": [".ha-logos"],          // hidden with visibility, so the layout is untouched
//     "keyframes": [[0, 0], [2, {"sel": ".ha-proof", "dy": -100}], [6, 4200]]
//   }
//
// Every keyframe is [seconds, target]; target is an absolute scrollY or {sel, dy, f}.
// The scroll path is a monotone cubic through the keyframes (no overshoot, holds stay flat) and is
// pushed through Lenis with immediate:true, so the page's own scrubbing and smoothing run for real.
//
// Why a screencast and not a screenshot per frame: scroll-scrubbed GSAP, Lenis, canvas trails and
// timed intros all run on wall-clock time. Stepping them frame by frame would change the motion.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire((process.env.PUPPETEER_FROM || process.cwd()) + '/');
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const [planPath, outDir] = process.argv.slice(2);
if (!planPath || !outDir) { console.error('usage: node capture.mjs <plan.json> <outDir>'); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const W = plan.w || 1440, H = plan.h || 900, DPR = plan.dpr || 1, FPS = plan.fps || 30;
const rawDir = path.join(outDir, '_raw');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars', '--enable-gpu-rasterization',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR, isMobile: !!plan.mobile, hasTouch: !!plan.mobile });
if (plan.reduceMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const errs = [];
page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) errs.push(m.text()); });

const hideCss = (plan.hide || []).map(s => `${s}{visibility:hidden !important}`).join('') + (plan.css || '');
await page.evaluateOnNewDocument(css => {
  const add = () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
}, hideCss);

await page.goto(plan.url, { waitUntil: 'networkidle0', timeout: 90000 });
await sleep(3500);
const toTop = () => page.evaluate(() => { const L = window.HA_L; if (L && L.scrollTo) L.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); });
await toTop(); await sleep(600);

const cdp = await page.createCDPSession();
const shots = []; let n = 0;
cdp.on('Page.screencastFrame', async ev => {
  const i = n++;
  fs.writeFileSync(path.join(rawDir, `r_${String(i).padStart(6, '0')}.jpg`), Buffer.from(ev.data, 'base64'));
  shots.push([ev.metadata.timestamp, i]);
  try { await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }); } catch (e) {}
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: plan.quality || 92, maxWidth: Math.round(W * DPR), maxHeight: Math.round(H * DPR), everyNthFrame: 1 });
await sleep(400);

// t0 in epoch seconds, taken inside the page so the screencast timestamps share its clock
let t0;
if (plan.reload) {
  t0 = Date.now() / 1000;
  await page.reload({ waitUntil: 'load' });
  await sleep((plan.settle || 1) * 1000);
} else {
  t0 = Date.now() / 1000;
}
const scrollStart = await page.evaluate(({ kfw }) => {
  const L = window.HA_L;
  const kids = kfw.map(([t, tg]) => {
    let y;
    if (typeof tg === 'number') y = tg;
    else { const e = document.querySelector(tg.sel); if (!e) throw new Error('no element ' + tg.sel); y = e.getBoundingClientRect().top + scrollY + (tg.dy || 0) + (tg.f || 0) * innerHeight; }
    return [t, Math.max(0, y)];
  });
  for (let i = kids.length - 1; i > 0; i--) if (!(kids[i][0] > kids[i - 1][0] + 0.001)) kids.splice(i, 1);
  window.__kf = kids;
  const n = kids.length, x = kids.map(k => k[0]), y = kids.map(k => k[1]);
  const d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
  m[0] = d[0] || 0; m[n - 1] = d[n - 2] || 0;
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; } else {
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const tt = 3 / Math.sqrt(s); m[i] = tt * a * d[i]; m[i + 1] = tt * b * d[i]; }
    }
  }
  const f = t => {
    if (t <= x[0]) return y[0]; if (t >= x[n - 1]) return y[n - 1];
    let i = 0; while (t > x[i + 1]) i++;
    const h = x[i + 1] - x[i], s = (t - x[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * y[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * y[i + 1] + (s3 - s2) * h * m[i + 1];
  };
  const T0 = performance.now(); window.__scrollT0 = performance.timeOrigin + T0;
  const loop = () => {
    const t = (performance.now() - T0) / 1000, v = f(t);
    if (L && L.scrollTo) L.scrollTo(v, { immediate: true, force: true }); else scrollTo(0, v);
    if (t < x[n - 1] + 0.5) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return performance.timeOrigin + T0;
}, { kfw: plan.keyframes || [[0, 0]] });
const tScroll = scrollStart / 1000; // epoch seconds when keyframe time 0 happened
await sleep((plan.duration + 0.4) * 1000);
await cdp.send('Page.stopScreencast');
await sleep(300);

// ---- resample to constant fps: output frame k shows the latest screencast frame at or before its time
const origin = plan.reload ? t0 : tScroll;        // output time 0
const nOut = Math.round(plan.duration * FPS);
let j = 0, copied = 0, gaps = [];
for (let k = 0; k < nOut; k++) {
  const tk = origin + k / FPS;
  while (j + 1 < shots.length && shots[j + 1][0] <= tk) j++;
  if (shots[j][0] > tk + 0.0001 && k > 0) { /* first frame later than the grid: reuse j */ }
  fs.copyFileSync(path.join(rawDir, `r_${String(shots[j][1]).padStart(6, '0')}.jpg`), path.join(outDir, `f_${String(k + 1).padStart(5, '0')}.jpg`));
  copied++;
}
const dts = shots.slice(1).map((s, i) => s[0] - shots[i][0]).sort((a, b) => a - b);
const p = q => dts[Math.min(dts.length - 1, Math.floor(dts.length * q))] || 0;
const info = {
  url: plan.url, w: W, h: H, dpr: DPR, fps: FPS, duration: plan.duration, frames: nOut,
  screencastFrames: shots.length, medianGapMs: +(p(0.5) * 1000).toFixed(1), p95GapMs: +(p(0.95) * 1000).toFixed(1), maxGapMs: +(dts[dts.length - 1] * 1000).toFixed(0),
  scrollStartOffset: +(tScroll - origin).toFixed(3), pageErrors: errs,
};
fs.writeFileSync(path.join(outDir, 'info.json'), JSON.stringify(info, null, 1));
fs.rmSync(rawDir, { recursive: true, force: true });
console.log(JSON.stringify(info));
await browser.close();
