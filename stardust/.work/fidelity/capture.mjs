// Captures source / reskin-target / EDS for each page at 1440x900 and 390x844.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
const ALL = ['/', '/about-us', '/about-us/enrol', '/about-us/hsc-results', '/learning-and-support/wellbeing', '/school-life/events', '/contact-us'];
const PAGES = process.argv[2] ? ALL.filter((p) => p === process.argv[2]) : ALL;
const KINDS = process.argv[3] ? process.argv[3].split(',') : ['source', 'target', 'eds'];
const SRC = 'https://fortstreet-h.schools.nsw.gov.au';
const TGT = 'http://localhost:8111';
const EDS = 'https://fs-oneaz--stardust-figma-migration--sanyasandal.aem.page/fortstreet';
const VPS = [[1440, 900], [390, 844]];
mkdirSync('shots', { recursive: true });
const b = await chromium.launch();
const meta = [];
for (const p of PAGES) {
  const slug = p === '/' ? 'index' : p.slice(1).replace(/\//g, '_');
  for (const [w, h] of VPS) {
    for (const [kind, base] of [['source', SRC], ['target', TGT], ['eds', EDS]].filter(([k]) => KINDS.includes(k))) {
      const url = base + (kind === 'target' ? (p === '/' ? '/' : `${p}/`) : p);
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(1500);
        const text = await page.evaluate(() => (document.querySelector('main') || document.body).innerText);
        writeFileSync(`shots/${slug}-${w}-${kind}.txt`, text);
        await page.screenshot({ path: `shots/${slug}-${w}-${kind}.png`, fullPage: true });
        await page.screenshot({ path: `shots/${slug}-${w}-${kind}-fold.png` });
        meta.push({ slug, w, kind, url, ok: true });
        console.log('ok', slug, w, kind);
      } catch (e) { meta.push({ slug, w, kind, url, ok: false, err: e.message }); console.log('FAIL', slug, w, kind, e.message.slice(0, 80)); }
      await ctx.close();
    }
  }
}
await b.close();
if (!process.argv[2]) writeFileSync('capture-meta.json', JSON.stringify(meta, null, 1));
console.log('done');
