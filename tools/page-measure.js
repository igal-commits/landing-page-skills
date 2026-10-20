// Paste into the page console, or run through page.evaluate. Returns the measured facts a design
// review needs. Every finding is a number or a selector.
(() => {
  const r = {};
  const vw = innerWidth;
  // 1. horizontal overflow at this width
  r.pageOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  r.pageWidth = [document.documentElement.scrollWidth, document.documentElement.clientWidth];
  r.overflowing = [...document.querySelectorAll('body *')].filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX === 'visible' && e.getBoundingClientRect().right > vw + 1).slice(0, 10).map(e => e.className || e.tagName);
  // 2. section rhythm: the gap that matters is the SUM at each junction
  const secs = [...document.querySelectorAll('main > section, body > section, section')].filter((s, i, a) => a.indexOf(s) === i);
  r.sections = secs.map(s => { const c = getComputedStyle(s), b = s.getBoundingClientRect();
    return { cls: String(s.className).split(' ')[0], top: Math.round(b.top + scrollY), h: Math.round(b.height), padT: parseFloat(c.paddingTop), padB: parseFloat(c.paddingBottom) }; });
  r.junctions = r.sections.slice(1).map((s, i) => ({ between: r.sections[i].cls + ' > ' + s.cls, gap: Math.round(r.sections[i].padB + s.padT) }));
  // 3. section system: one title size, one left edge
  const h2 = [...document.querySelectorAll('h2')].map(e => parseFloat(getComputedStyle(e).fontSize));
  r.h2Sizes = [...new Set(h2.map(x => Math.round(x)))];
  // 4. text floor and heading structure
  r.textUnder10px = [...document.querySelectorAll('body *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 10).length;
  r.h1Count = document.querySelectorAll('h1').length;
  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  r.headingSkips = levels.filter((l, i) => i && l - levels[i - 1] > 1).length;
  // 5. images: decoded, alt text, natural versus displayed size
  const imgs = [...document.images];
  r.images = { total: imgs.length, notDecoded: imgs.filter(i => !i.complete || !i.naturalWidth).length,
    missingAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    soft: imgs.filter(i => i.naturalWidth && i.getBoundingClientRect().width * devicePixelRatio > i.naturalWidth * 1.02).length };
  // 6. cards: equal height inside each grid
  r.cardGrids = [...document.querySelectorAll('[class*="grid"],[class*="cards"]')].map(g => {
    const hs = [...g.children].map(c => Math.round(c.getBoundingClientRect().height)); return hs.length > 1 ? { grid: String(g.className).split(' ')[0], heights: hs, even: Math.max(...hs) - Math.min(...hs) < 3 } : null; }).filter(Boolean).slice(0, 12);
  // 7. tap targets on touch widths
  if (vw <= 768) r.smallTapTargets = [...document.querySelectorAll('a,button')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && (b.width < 44 || b.height < 44); }).length;
  // 8. placeholder and banned-copy lint
  const text = document.body.innerText;
  r.emDashes = text.split(String.fromCharCode(8212)).length - 1;
  r.placeholders = ['lorem ipsum', 'sample guide', 'sample episode', 'placeholder'].filter(w => text.toLowerCase().includes(w));
  return r;
})();
