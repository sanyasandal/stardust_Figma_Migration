// Token-level conformance: computed styles on the EDS preview vs Figma donor tokens.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
const T = JSON.parse(readFileSync('../../reskin/donor-tokens.json', 'utf8'));
const URL = 'https://fs-oneaz--stardust-figma-migration--sanyasandal.aem.page/fortstreet/';
const checks = [
  ['h1 colour', 'main h1', 'color', T.palette.headingFg],
  ['h2 colour', 'main h2', 'color', T.palette.headingFg],
  ['h2 size', 'main .default-content-wrapper h2', 'fontSize', T.type.h2.fontSize],
  ['h2 line-height', 'main .default-content-wrapper h2', 'lineHeight', T.type.h2.lineHeight],
  ['h1 size (display)', 'main h1', 'fontSize', T.type.display.fontSize],
  ['heading family (first)', 'main h2', 'fontFamily', T.type.headingFamily],
  ['body colour', 'main p', 'color', T.palette.bodyFg],
  ['body family (first)', 'main p', 'fontFamily', T.type.family],
  ['band background', 'main .section.band', 'backgroundColor', T.palette.lightBandBg],
  ['card title colour', 'main .cards h3, main .cards .cards-card-body p:first-child a, main .cards .cards-card-body strong', 'color', T.palette.cardTitleFg],
  ['card radius', 'main .cards li', 'borderTopLeftRadius', T.radii.card],
  ['button bg', 'main a.button.primary, main a.button', 'backgroundColor', T.buttons.primary.background],
  ['button text colour', 'main a.button.primary, main a.button', 'color', T.buttons.primary.color],
  ['button radius', 'main a.button.primary, main a.button', 'borderTopLeftRadius', T.buttons.primary.borderRadius],
  ['button weight', 'main a.button.primary, main a.button', 'fontWeight', T.buttons.primary.fontWeight],
  ['button height', 'main a.button.primary, main a.button', 'height', T.buttons.primary.height],
  ['container max-width', 'main .section > div', 'maxWidth', T.layout.containerMaxWidth],
];
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
const rows = [];
for (const [name, sel, prop, want] of checks) {
  const got = await page.evaluate(([s, p]) => {
    const el = document.querySelector(s); if (!el) return null;
    const cs = getComputedStyle(el); return p === 'height' ? `${Math.round(el.getBoundingClientRect().height)}px` : cs[p];
  }, [sel, prop]);
  const norm = (v) => String(v ?? '').toLowerCase().replace(/\s+/g, '').replace(/"/g, '');
  const pass = prop === 'fontFamily' ? norm(got).split(',')[0] === norm(want).split(',')[0] : norm(got) === norm(want);
  rows.push({ name, selector: sel, figma: want, eds: got, pass });
  console.log(pass ? 'PASS' : 'DIFF', name, '| figma', want, '| eds', got);
}
const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
await b.close();
writeFileSync('tokens.json', JSON.stringify({ url: URL, rows, loadedFonts: [...new Set(fonts)] }, null, 1));
console.log('pass', rows.filter((r) => r.pass).length, '/', rows.length, 'fonts', [...new Set(fonts)]);
