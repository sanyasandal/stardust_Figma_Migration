// block-library-creator (excat) DA path — Steps 1b, 2, 3, executed for this project.
import { parseHTML } from 'linkedom';
import { readFileSync, writeFileSync, existsSync, rmSync, copyFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
const R = '../../..';
const ORG = 'sanyasandal'; const SITE = 'stardust-figma-migration';
const SKILL = '/Users/ssandal/repos/EMA/aem-experience-catalyst/resources/plugins/aem-excat-plugin/excat-extended/excat-block-library/skills/block-library-creator/references';
const now = new Date().toISOString();
const META = {
  hero: { purpose: 'page-intro', structure: 'body-image-split', variants: [], wide: true, colorScheme: 'light', imagePattern: 'img-right' },
  teaser: { purpose: 'feature-teaser', structure: 'body-image-split', variants: ['reverse'], colorScheme: 'light', imagePattern: 'img-side' },
  cards: { purpose: 'card-grid', structure: 'image-title-body repeating', variants: ['listing'], colorScheme: 'light', imagePattern: 'img-top' },
  accordion: { purpose: 'faq', structure: 'title-body-expandable', variants: [], colorScheme: 'light', imagePattern: 'noimg' },
  table: { purpose: 'data-table', structure: 'rows-of-cells', variants: ['bordered'], colorScheme: 'light', imagePattern: 'noimg' },
  embed: { purpose: 'map-or-video-embed', structure: 'single-link', variants: [], imagePattern: 'noimg' },
  columns: { purpose: 'multi-column-layout', structure: 'cells-per-row', variants: [] },
  fragment: { purpose: 'reusable-fragment-include', structure: 'single-link', variants: [] },
};
const pages = execSync(`find ${R}/content/fortstreet -name "*.html"`).toString().trim().split('\n').filter((p) => !/\/(nav|footer)\.html$/.test(p)).sort();
const docs = pages.map((p) => ({ name: p.slice(`${R}/content/`.length).replace(/\.html$/, ''), doc: parseHTML(readFileSync(p, 'utf8')).document }));
const titleCase = (s) => s.replace(/(^|-)(\w)/g, (m, d, c) => (d ? ' ' : '') + c.toUpperCase());
const IMG16 = '<picture><img src="./images/placeholder-16x9.png" alt="Hero image"></picture>';
const IMG43 = '<picture><img src="./images/placeholder-4x3.png" alt="Sample image"></picture>';
const libmeta = (name, desc) => `<div class="library-metadata"><div><div>name</div><div>${name}</div></div><div><div>description</div><div>${desc}</div></div></div>`;
// Step 1b — metadata.json (only inferable fields)
for (const [b, m] of Object.entries(META)) {
  const f = `${R}/blocks/${b}/metadata.json`;
  const using = docs.filter((d) => d.doc.querySelector(`div.${b}`)).map((d) => d.name);
  if (existsSync(f)) continue;
  const js = readFileSync(`${R}/blocks/${b}/${b}.js`, 'utf8');
  const meta = { variantName: b, baseBlock: b, version: '1.0.0', created: now,
    visualCharacteristics: Object.fromEntries(Object.entries({ colorScheme: m.colorScheme, purpose: m.purpose, imagePattern: m.imagePattern }).filter(([, v]) => v)),
    contentPattern: { structure: m.structure, imageCount: /picture|img/.test(js) || m.imagePattern?.startsWith('img') ? 1 : 0 } };
  if (m.variants.length) meta.variants = m.variants;
  if (using.length) meta.usage = { pagesUsing: using, reuseCount: using.length, lastUsed: now };
  writeFileSync(f, `${JSON.stringify(meta, null, 2)}\n`);
  console.log(`✓ Created metadata.json for ${b} (inferred from js/css/${using.length} pages)`);
}
// Step 2 — samples
const LIB = `${R}/content/library/blocks`;
mkdirSync(`${LIB}/images`, { recursive: true });
for (const p of ['placeholder-16x9.png', 'placeholder-4x3.png']) copyFileSync(`${SKILL}/${p}`, `${LIB}/images/${p}`);
for (const stale of ['banner', 'facebook-feed']) rmSync(`${LIB}/${stale}.plain.html`, { force: true });
const generated = [];
for (const b of Object.keys(META)) {
  const meta = JSON.parse(readFileSync(`${R}/blocks/${b}/metadata.json`, 'utf8'));
  const disp = meta.name || titleCase(meta.variantName || b);
  const desc = meta.description || `${META[b].purpose.replace(/-/g, ' ')} — ${META[b].structure}.`;
  const img = META[b].wide ? IMG16 : IMG43;
  const sample = (variant) => {
    // b1 — reference page: first page whose block has exactly this class set
    for (const pg of meta.usage?.pagesUsing || []) {
      const d = docs.find((x) => x.name === pg).doc;
      const el = [...d.querySelectorAll(`div.${b}`)].find((x) => (variant ? x.classList.contains(variant) : x.classList.length === 1));
      if (!el) continue;
      const c = el.cloneNode(true);
      [...c.children].slice(3).forEach((r) => r.remove());
      c.querySelectorAll('img').forEach((i) => { const pic = parseHTML(`<div>${img}</div>`).document.querySelector('picture'); (i.closest('picture') || i).replaceWith(pic); });
      return { html: c.outerHTML, src: `b1:${pg}` };
    }
    return null;
  };
  // b2 — synthesized from decorate() contract
  const SYN = {
    columns: `<div class="columns"><div><div><h3>Column one</h3><p>Supporting text for the first column.</p></div><div>${IMG43}</div></div></div>`,
    fragment: '<div class="fragment"><div><div><p><a href="/fortstreet/footer">/fortstreet/footer</a></p></div></div></div>',
    embed: '<div class="embed"><div><div><p><a href="https://bcove.video/48Vdzel">https://bcove.video/48Vdzel</a></p></div></div></div>',
  };
  const sections = [];
  for (const v of [null, ...(meta.variants || [])]) {
    const s = sample(v) || (SYN[b] && !v ? { html: SYN[b], src: 'b2:js' } : null);
    if (!s) { console.warn(`⚠️ ${b}${v ? ` (${v})` : ''}: no reference instance`); continue; }
    const name = v ? `${disp} (${titleCase(v)})` : disp;
    sections.push(`<div>${s.html}${libmeta(name, v ? `${desc} Variant: ${v}.` : desc)}</div>`);
    console.log(`  ${b}${v ? `.${v}` : ''} ← ${s.src}`);
  }
  if (!sections.length) { console.warn(`⚠️ Skipped ${b}`); continue; }
  writeFileSync(`${LIB}/${b}.plain.html`, `${sections.join('\n')}\n`);
  rmSync(`${LIB}/${b}.html`, { force: true });
  generated.push({ name: disp, path: `https://content.da.live/${ORG}/${SITE}/library/blocks/${b}` });
  console.log(`Generated content/library/blocks/${b}.plain.html (${sections.length} variants)`);
}
// Step 3 — blocks.json once
generated.sort((a, b) => a.name.localeCompare(b.name));
const G = generated.length;
writeFileSync(`${R}/content/library/blocks.json`, `${JSON.stringify({ total: G, offset: 0, limit: G, data: generated, ':type': 'sheet' }, null, 2)}\n`);
console.log(`blocks.json G=${G}`);
