// Scroll feel, measured with real wheel input.
//
//   node scroll-qa.mjs <url> [--w 1440] [--h 900] [--notch 100] [--every 120] [--wait 4000]
//
// Reports for the page: document height in viewport heights, every pinned ScrollTrigger (length in
// px, viewport heights and wheel notches), the seconds a steady wheel takes to reach the end of each
// pin, how long one notch takes to settle, and frame-time jank.
//
// Needs puppeteer-core and a Chrome. PUPPETEER_FROM points at a folder with puppeteer-core in
// node_modules; CHROME points at the executable.
import { createRequire } from 'module';
const require = createRequire((process.env.PUPPETEER_FROM || process.cwd()) + '/');
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const a = process.argv.slice(2);
const url = a[0];
if (!url) { console.error('usage: node scroll-qa.mjs <url> [--w 1440] [--h 900] [--notch 100] [--every 120]'); process.exit(1); }
const opt = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; };
const W = +opt('w', 1440), H = +opt('h', 900), NOTCH = +opt('notch', 100), EVERY = +opt('every', 120), WAIT = +opt('wait', 4000);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars', '--enable-gpu-rasterization'] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
await sleep(WAIT);

const geo = await page.evaluate(() => {
  const vh = innerHeight;
  const pins = window.ScrollTrigger ? ScrollTrigger.getAll().filter(s => s.pin).map(s => ({
    name: (s.trigger && (s.trigger.id || String(s.trigger.className).split(' ')[0])) || '?', start: Math.round(s.start), end: Math.round(s.end) })) : [];
  return { vh, docH: document.documentElement.scrollHeight, smooth: !!(window.lenis || window.Lenis || window.HA_L), pins };
});
console.log(`viewport ${W}x${H}  smooth-scroll=${geo.smooth}  document ${(geo.docH / geo.vh).toFixed(1)} vh`);
for (const p of geo.pins) console.log(`pin ${p.name.padEnd(18)} ${p.start} -> ${p.end}  = ${((p.end - p.start) / geo.vh).toFixed(2)} vh  (${Math.round((p.end - p.start) / NOTCH)} notches of ${NOTCH}px)`);

await page.mouse.move(W / 2, H / 2);
await page.evaluate(() => { window.__s = []; window.__ft = []; let last = 0; (function f(t) { __s.push([t, scrollY]); if (last) __ft.push(t - last); last = t; requestAnimationFrame(f); })(performance.now()); });
const t0 = await page.evaluate(() => performance.now());
const maxY = geo.docH - geo.vh;
let sent = 0;
while (sent < 600) {
  const y = await page.evaluate(() => scrollY);
  if (y >= maxY - 2) break;
  await page.mouse.wheel({ deltaY: NOTCH }); sent++;
  await sleep(EVERY);
}
await sleep(1200);
const res = await page.evaluate(t0 => ({ s: __s.filter(x => x[0] >= t0), ft: __ft }), t0);
const tAt = y => { const hit = res.s.find(p => p[1] >= y - 1); return hit ? (hit[0] - t0) / 1000 : null; };
console.log(`\nwheel: ${sent} notches of ${NOTCH}px every ${EVERY}ms (${Math.round(NOTCH / EVERY * 1000)} px/s)`);
for (const p of geo.pins) {
  const s0 = tAt(p.start), s1 = tAt(p.end);
  console.log(`pin ${p.name.padEnd(18)} reached at ${s0 == null ? 'n/a' : s0.toFixed(1)} s, finished at ${s1 == null ? 'n/a' : s1.toFixed(1)} s`);
}
const ft = res.ft.filter(x => x < 1000).sort((x, y) => x - y);
const pct = p => ft[Math.min(ft.length - 1, Math.floor(ft.length * p))];
console.log(`frames ${ft.length}  p50 ${pct(0.5).toFixed(1)} ms  p95 ${pct(0.95).toFixed(1)} ms  p99 ${pct(0.99).toFixed(1)} ms  >34 ms: ${ft.filter(x => x > 34).length}  >50 ms: ${ft.filter(x => x > 50).length}`);

// one notch: how long until the page stops moving
await page.evaluate(() => { const L = window.HA_L || window.lenis; if (L && L.scrollTo) L.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); });
await sleep(1500);
await page.evaluate(() => { window.__m = []; (function f(t) { __m.push([t, scrollY]); requestAnimationFrame(f); })(performance.now()); });
const tn = await page.evaluate(() => performance.now());
await page.mouse.wheel({ deltaY: NOTCH });
await sleep(2200);
const m = await page.evaluate(tn => __m.filter(x => x[0] >= tn), tn);
const fin = m[m.length - 1][1];
const settled = m.find(p => Math.abs(p[1] - fin) < 1);
console.log(`one notch: moved ${Math.round(fin)} px, settled in ${settled ? Math.round(settled[0] - tn) : 'n/a'} ms`);
if (errs.length) console.log('page errors:', errs.slice(0, 5));
await browser.close();
