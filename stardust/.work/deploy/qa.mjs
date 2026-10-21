import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
const HOST = 'https://fs-oneaz--stardust-figma-migration--sanyasandal.aem.page';
const paths = readFileSync('paths.txt', 'utf8').trim().split('\n').filter((p) => !/\/(nav|footer)$/.test(p));
const only = process.argv[2] ? paths.filter((p) => p.includes(process.argv[2])) : paths;
const VW = Number(process.env.QA_W || 1440);
const b = await chromium.launch();
const out = [];
for (const p of only) {
  const page = await b.newPage({ viewport: { width: VW, height: VW < 600 ? 844 : 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  page.on('pageerror', (e) => errs.push(`EXC ${e.message.slice(0, 120)}`));
  const url = HOST + (p.endsWith('/index') ? p.slice(0, -5) : p);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({
      blocks: [...document.querySelectorAll('main .block')].map((x) => `${x.dataset.blockName}:${x.dataset.blockStatus}`),
      badImg: [...document.querySelectorAll('main img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(-60)),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      h1: document.querySelectorAll('main h1').length,
      header: !!document.querySelector('header .nav-brand, header .brand'),
      footer: document.querySelector('footer .footer')?.textContent.trim().length || 0,
    }));
    const notLoaded = r.blocks.filter((x) => !x.endsWith(':loaded'));
    const ok = !notLoaded.length && !r.badImg.length && !r.overflow && r.header && r.footer > 0 && !errs.length;
    out.push({ p, ok, ...r, notLoaded, errs });
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${p} blocks=${r.blocks.length} badImg=${r.badImg.length} ovf=${r.overflow} h1=${r.h1} hdr=${r.header} ftr=${r.footer} errs=${errs.length} ${notLoaded.join(',')}`);
  } catch (e) { out.push({ p, ok: false, err: e.message }); console.log(`FAIL ${p} ${e.message.slice(0, 80)}`); }
  await page.close();
}
await b.close();
writeFileSync(process.argv[2] ? 'qa-one.json' : (VW === 1440 ? 'qa.json' : `qa-${VW}.json`), JSON.stringify(out, null, 1));
