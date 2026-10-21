// stardust:reskin Phase 4 — donor module layouts (M3–M9, NM1) + page shell with donor chrome (D1–D4).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { R, esc, norm, emitNode, emitRun, loadModel } from './lib.mjs';
import { flow, splitMedia, groupByImage, sourceTables } from './flow.mjs';
import { css } from './styles.mjs';

const BAND = /nsw-section--(brand-dark|invert|off-white)/;

const section = (slot, mod, cls, body) => `<section class="${cls}${BAND.test(slot.rootClass) ? ' band' : ''}" data-slot="${slot.slot}" data-module="${mod}"><div class="container">${body}</div></section>`;
const media = (nodes) => nodes.map((n) => emitNode(n)).join(' ');

// M5 Teaser Card grid. listItems with children → cards; childless listItems (gallery pager) → pager row;
// no listItems → feed posts grouped by image.
function cards(slot, ctx) {
  const nodes = slot.ordered;
  const firstLi = nodes.findIndex((n) => n.kind === 'listItem');
  if (firstLi === -1) {
    const { lead, groups } = groupByImage(nodes);
    return section(slot, 'M5', 'teaser-cards', `<div class="lead">${flow(lead, ctx)}</div> <ul class="cards">${groups.map((g) => `<li class="card">${emitRun(g)}</li>`).join(' ')}</ul>`);
  }
  let end = firstLi;
  while (end < nodes.length && nodes[end].kind === 'listItem') end += 1;
  const items = nodes.slice(firstLi, end);
  const full = items.filter((n) => n.children && n.children.length);
  const pager = items.filter((n) => !(n.children && n.children.length));
  if (full.length && pager.length && items.indexOf(pager[0]) < items.indexOf(full[full.length - 1])) throw new Error(`${slot.slot}: pager items interleave cards — order would change`);
  const lead = nodes.slice(0, firstLi);
  const rest = nodes.slice(end);
  const cardsHtml = full.length ? `<ul class="cards${full.some((n) => n.children.some((c) => c.kind === 'image')) ? '' : ' cards-text'}">${full.map((li) => `<li class="card">${emitRun(li.children)}</li>`).join(' ')}</ul>` : '';
  const pagerHtml = pager.length ? `<ul class="pager">${pager.map((li) => `<li>${esc(li.text)}</li>`).join(' ')}</ul>` : '';
  return section(slot, 'M5', 'teaser-cards', [lead.length ? `<div class="lead">${flow(lead, ctx)}</div>` : '', cardsHtml, pagerHtml, rest.length ? `<div class="lead">${flow(rest, ctx)}</div>` : ''].filter(Boolean).join(' '));
}

function textImage(slot, ctx, mod, cls) {
  const { media: m, body } = splitMedia(slot.ordered);
  if (!m.length) return section(slot, mod, `${cls} no-media`, `<div class="ti-body">${flow(body, ctx)}</div>`);
  return section(slot, mod, cls, `<div class="ti-grid"><div class="ti-body">${flow(body, ctx)}</div> <div class="ti-media">${media(m)}</div></div>`);
}

function listing(slot, ctx) {
  const { lead, groups } = groupByImage(slot.ordered);
  return section(slot, 'M7', 'listing', `${lead.length ? `<div class="lead">${flow(lead, ctx)}</div> ` : ''}<ul class="listing-cards">${groups.map((g) => `<li class="listing-card"><div class="lc-media">${emitNode(g[0])}</div> <div class="lc-body">${emitRun(g.slice(1))}</div></li>`).join(' ')}</ul>`);
}

export const MODULES = {
  M3: (s, c) => textImage(s, c, 'M3', 'hero'),
  M4: (s, c) => textImage(s, c, 'M4', 'teaser-ti'),
  M5: cards,
  M6: (s, c) => section(s, 'M6', 'title-text', `<div class="measure">${flow(s.ordered, c)}</div>`),
  M7: listing,
  M8: (s, c) => section(s, 'M8', 'cta-banner', `<div class="cta-panel">${flow(s.ordered, c)}</div>`),
  M9: (s, c) => section(s, 'M9', 'title-text acc-section', `<div class="measure">${flow(s.ordered, c)}</div>`),
};

// ---------- chrome (outside the gate scope; labels + destinations carried from source nav/footer) ----------
const SRC = 'https://fortstreet-h.schools.nsw.gov.au';
const abs = (h) => (h.startsWith('/') ? SRC + h : h);
const navSrc = readFileSync(R('stardust/reskin/source/nav.plain.html'), 'utf8');
const footSrc = readFileSync(R('stardust/reskin/source/footer.plain.html'), 'utf8');
const strip = (h) => norm(h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&'));
const links = (h) => [...h.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ href: abs(m[1]), label: strip(m[2]) }));

const NAV = navSrc.split(/<h2 /).slice(1).map((chunk) => { const ls = links(chunk); return { top: ls[0], subs: ls.slice(1) }; });
const MOTTO = strip((navSrc.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '');

function header() {
  return `<header class="site-header"><div class="utility"><div class="container"><span>${esc(MOTTO)}</span><a href="${esc(abs('/contact-us'))}">Contact us</a></div></div><nav class="mainnav" aria-label="Main"><div class="container"><a class="brand" href="${SRC}/"><span class="brand-mark" aria-hidden="true"></span><span>Fort Street High School</span></a><ul class="nav-list">${NAV.map((n) => `<li class="nav-item"><a href="${esc(n.top.href)}">${esc(n.top.label)}</a>${n.subs.length ? `<ul class="nav-drop">${n.subs.map((s) => `<li><a href="${esc(s.href)}">${esc(s.label)}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}</ul></div></nav></header>`;
}

function breadcrumb(url) {
  const path = new URL(url).pathname.replace(/\/$/, '');
  if (!path) return '';
  const parts = path.split('/').filter(Boolean);
  const all = NAV.flatMap((n) => [n.top, ...n.subs]);
  const crumbs = parts.map((_, i) => {
    const href = `${SRC}/${parts.slice(0, i + 1).join('/')}`;
    const hit = all.find((l) => l.href === href);
    return { href, label: hit ? hit.label : parts[i].replace(/-/g, ' ') };
  });
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><div class="container"><ol><li><a href="${SRC}/">Home</a></li>${crumbs.map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${esc(c.href)}">${esc(c.label)}</a></li>`)).join('')}</ol></div></nav>`;
}

function footer() {
  const cols = footSrc.split(/<div>/).slice(1);
  const enquiries = cols[0] || '';
  const heads = [...enquiries.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>\s*<ul>([\s\S]*?)<\/ul>/g)];
  const colHtml = heads.map((h) => `<div class="f-col"><h2>${esc(strip(h[1]))}</h2><ul>${[...h[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) => { const a = links(li[1])[0]; const t = strip(li[1]); return `<li>${a ? `<a href="${esc(a.href)}">${esc(a.label || (li[1].match(/title="([^"]+)"/) || [])[1] || '')}</a>` : esc(t)}</li>`; }).join('')}</ul></div>`).join('');
  const ack = strip((cols[1] || '').replace(/<\/div>[\s\S]*$/, ''));
  return `<footer class="site-footer"><div class="container"><div class="f-grid"><div class="f-brand"><a class="brand" href="${SRC}/"><span class="brand-mark" aria-hidden="true"></span><span>Fort Street High School</span></a><p>${esc(ack)}</p></div>${colHtml}</div></div></footer>`;
}

function head(meta) {
  const m = [];
  m.push(`<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`);
  m.push(`<title>${esc(meta.title)}</title>`);
  if (meta.description != null) m.push(`<meta name="description" content="${esc(meta.description)}">`);
  if (meta.canonical) m.push(`<link rel="canonical" href="${esc(meta.canonical)}">`);
  for (const [k, v] of Object.entries(meta.ogTags || {})) m.push(`<meta property="${esc(k)}" content="${esc(v)}">`);
  for (const [k, v] of Object.entries(meta.twitterTags || {})) m.push(`<meta name="${esc(k)}" content="${esc(v)}">`);
  for (const j of meta.jsonLd || []) m.push(`<script type="application/ld+json">${typeof j === 'string' ? j : JSON.stringify(j)}</script>`);
  if (meta.favicon) m.push(`<link rel="icon" href="${esc(meta.favicon)}">`);
  return m.join('\n');
}

// plan: { s01: 'M3', ... } — straight from mapping.md (split rows share one slot id → one module call)
export function renderPage(slug, plan) {
  const model = loadModel(slug);
  const tables = sourceTables(slug);
  const ctx = { tables };
  const missing = model.sections.filter((s) => !plan[s.slot]).map((s) => s.slot);
  if (missing.length) throw new Error(`${slug}: slots without a mapping row: ${missing.join(', ')}`);
  const body = model.sections.map((s) => {
    const fn = MODULES[plan[s.slot]];
    if (!fn) throw new Error(`${slug} ${s.slot}: module ${plan[s.slot]} not granted`);
    return fn(s, ctx);
  }).join('\n');
  if (tables.length) throw new Error(`${slug}: ${tables.length} source table(s) not consumed by an NM1 slot`);
  const url = model._provenance.url;
  const html = `<!DOCTYPE html>
<html lang="${esc(model.metadata.lang || 'en')}">
<head>
<!-- provenance: stardust:reskin Phase 4 renderer (stardust/reskin/renderers/${slug}.mjs) · content: content-model/${slug}/content-model.json · surface: donor-tokens.json + mapping.md -->
${head(model.metadata)}
<style>${css}</style>
</head>
<body>
${header()}
${breadcrumb(url)}
<main>
${body}
</main>
${footer()}
</body>
</html>
`;
  const out = R(`stardust/reskin/pages/${slug}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  return out;
}
