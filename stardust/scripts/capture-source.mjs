// provenance: stardust reskin Phase 2 — named deviation (replaces skills/reskin/scripts/capture-content.mjs,
// which could not be imported into the project). Captures screenshots + a byte-oriented content model.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const out = process.argv[3];
const prefix = process.argv[4] || 'source';
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const browser = await chromium.launch();
const viewports = { desktop: [1440, 900], tablet: [768, 1024], mobile: [390, 844] };
let model;
for (const [name, [w, h]] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, userAgent: UA });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => { setTimeout(r, 120); });
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, `${prefix}-${name}.png`), fullPage: true });
  if (name === 'desktop') {
    model = await page.evaluate(() => {
      const abs = (u) => { try { return new URL(u, window.location.href).href; } catch { return u; } };
      const vis = (el) => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const meta = {};
      document.querySelectorAll('meta[name],meta[property]').forEach((m) => { meta[m.getAttribute('name') || m.getAttribute('property')] = m.content; });
      const sections = [];
      const roots = [...document.querySelectorAll('header, main > *, main section, section, footer')];
      const seen = [];
      roots.forEach((el) => {
        if (seen.some((s) => s.contains(el)) || !vis(el)) return;
        seen.push(el);
        const r = el.getBoundingClientRect();
        sections.push({
          tag: el.tagName.toLowerCase(),
          id: el.id,
          className: (el.className || '').toString().slice(0, 200),
          rect: { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) },
          headings: [...el.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).map((x) => ({ level: +x.tagName[1], text: x.innerText.trim() })),
          paragraphs: [...el.querySelectorAll('p')].filter(vis).map((p) => p.innerText.trim()).filter(Boolean),
          ctas: [...el.querySelectorAll('a')].filter(vis).map((a) => ({ text: a.innerText.trim(), href: abs(a.getAttribute('href') || '') })).filter((a) => a.text),
          images: [...el.querySelectorAll('img')].filter(vis).map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })),
          bgImages: [...new Set([el, ...el.querySelectorAll('*')].map((n) => getComputedStyle(n).backgroundImage).filter((b) => b && b.startsWith('url(')))].slice(0, 10),
          visibleText: el.innerText.replace(/\s+/g, ' ').trim(),
        });
      });
      return {
        url: window.location.href,
        capturedAt: new Date().toISOString(),
        metadata: {
          title: document.title,
          lang: document.documentElement.lang,
          canonical: document.querySelector('link[rel=canonical]')?.href,
          favicon: document.querySelector('link[rel~=icon]')?.href,
          meta,
        },
        bodyText: document.body.innerText.replace(/\s+/g, ' ').trim(),
        pageHeight: document.body.scrollHeight,
        sections,
      };
    });
  }
  await ctx.close();
}
fs.writeFileSync(path.join(out, `${prefix}-content-model.json`), JSON.stringify(model, null, 2));
console.log(`sections=${model.sections.length} bodyTextLen=${model.bodyText.length} height=${model.pageHeight}`);
await browser.close();
