// provenance: stardust deploy/rollout ENCODE (named deviation — scripted form of deploy Step 9 conversion
// for 52 pages; mapping is stardust/reskin/mapping.md modules → EDS blocks). Input stardust/migrated/**,
// output content/fortstreet/<path>.html DA body fragments.
import { parseHTML } from 'linkedom';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, posix } from 'path';

const ROOT = '../../..';
const MIG = `${ROOT}/stardust/migrated`;
const OUT = `${ROOT}/content/fortstreet`;
const PREFIX = '/fortstreet';
const MAPS = 'https://www.google.com/maps/embed/v1/place?q=Fort%20Street%20High%20School&key=AIzaSyCocj95prZ_spfzmsGRLP1FGlnIIOTpUXM';
const TOUR = 'https://bcove.video/48Vdzel';
const EMBEDS = {
  'contact-us': [['Access via Palace Street', MAPS]],
  'school-life/travel-to-school': [['location map', MAPS]],
  'about-us/enrol': [['watch the virtual tour below', TOUR]],
  'about-us/why-choose-us': [['Take a virtual tour with our Student Leaders', TOUR]],
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// relative migrated href → root-relative DA path
function localize(href, pagePath) {
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const [p, hash] = href.split('#');
  const abs = posix.normalize(posix.join(posix.dirname(`/${pagePath}`), p));
  let web = abs.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  web = `${PREFIX}${web}` || PREFIX;
  if (web === PREFIX) web = `${PREFIX}/`;
  return hash ? `${web}#${hash}` : web;
}

// clean a subtree for authoring: btn → strong, drop classes/data attrs/sr-only, localize links, drop broken imgs
function clean(el, pagePath) {
  el.querySelectorAll('.sr-only').forEach((n) => n.remove());
  el.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!/^https?:/.test(src)) { const p = img.parentElement; img.remove(); if (p && p.tagName === 'P' && !p.textContent.trim() && !p.children.length) p.remove(); return; }
    [...img.attributes].forEach((a) => { if (!['src', 'alt'].includes(a.name)) img.removeAttribute(a.name); });
    if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
  });
  el.querySelectorAll('a').forEach((a) => {
    a.setAttribute('href', localize(a.getAttribute('href'), pagePath));
    if (a.classList.contains('btn') && a.parentElement.tagName !== 'STRONG') {
      const s = a.ownerDocument.createElement('strong'); a.replaceWith(s); s.append(a);
    }
    a.textContent = a.textContent.replace(/\s+$/, '');
  });
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name === 'class' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'type' || a.name === 'target' || a.name === 'rel' || a.name === 'id' || a.name === 'style') n.removeAttribute(a.name); });
  });
  return el;
}

// node list → html where bare inline nodes are wrapped in <p>
function asBlocks(nodes) {
  let out = ''; let inline = '';
  const flush = () => { if (inline.trim()) out += `<p>${inline.trim()}</p>`; inline = ''; };
  for (const n of nodes) {
    if (n.nodeType === 3) { inline += esc(n.textContent); continue; }
    if (n.nodeType !== 1) continue;
    if (['A', 'STRONG', 'EM', 'SPAN', 'IMG', 'BR', 'PICTURE'].includes(n.tagName)) { inline += n.outerHTML; continue; }
    flush(); out += n.outerHTML;
  }
  flush();
  return out;
}
const cell = (html) => `<div>${html}</div>`;
const row = (...cells) => `<div>${cells.map(cell).join('')}</div>`;
const block = (name, rows) => `<div class="${name}">${rows.join('')}</div>`;

function defaultContent(container, pagePath) {
  let html = '';
  for (const c of [...container.children]) {
    if (c.matches('.nm1')) {
      const rows = [...c.querySelectorAll('tr')].map((tr) => row(...[...tr.children].map((td) => asBlocks([...clean(td, pagePath).childNodes]))));
      html += block(c.classList.contains('nm1-bordered') ? 'table bordered' : 'table', rows);
    } else if (c.matches('.accordion')) {
      const rows = [...c.querySelectorAll(':scope > .acc-item')].map((it) => {
        const label = it.querySelector('.acc-btn').textContent.trim();
        return row(`<p>${esc(label)}</p>`, asBlocks([...clean(it.querySelector('.acc-panel'), pagePath).childNodes]));
      });
      html += block('accordion', rows);
    } else if (c.matches('.cta-row')) {
      clean(c, pagePath).querySelectorAll('a').forEach((a) => { html += `<p><strong>${a.outerHTML}</strong></p>`; });
    } else if (c.matches('.pager')) {
      // carousel position dots from the source listing — chrome, not content
    } else {
      const el = clean(c, pagePath);
      if (el.tagName === 'P' && !el.textContent.trim() && !el.querySelector('img')) continue;
      html += el.outerHTML;
    }
  }
  return html;
}

function cardsBlock(ul, pagePath, listing) {
  const rows = [...ul.children].map((li) => {
    clean(li, pagePath);
    if (listing) {
      const media = li.querySelector(':scope > div:first-child');
      const body = li.querySelector(':scope > div:last-child');
      const m = media && media !== body ? asBlocks([...media.childNodes]) : '';
      return m ? row(m, asBlocks([...body.childNodes])) : row(asBlocks([...body.childNodes]));
    }
    const imgs = [...li.querySelectorAll(':scope > img, :scope > p > img')];
    const imgHtml = imgs.map((i) => `<p>${i.outerHTML}</p>`).join('');
    imgs.forEach((i) => { const p = i.parentElement; i.remove(); if (p !== li && !p.textContent.trim()) p.remove(); });
    const nodes = [...li.childNodes];
    // first bare link is the card title → its own <p>
    let body = ''; let rest = nodes;
    const first = nodes.find((n) => n.nodeType === 1);
    if (first && first.tagName === 'A') { body = `<p>${first.outerHTML}</p>`; rest = nodes.filter((n) => n !== first); }
    body += asBlocks(rest);
    return imgHtml ? row(imgHtml, body) : row(body);
  });
  return block(listing ? 'cards listing' : 'cards', rows);
}

function encodeSection(sec, idx, pagePath) {
  const mod = sec.dataset.module;
  const ctr = sec.querySelector(':scope > .container');
  const styles = [];
  let html = '';
  if (mod === 'M3' || mod === 'M4') {
    const body = clean(ctr.querySelector('.ti-body'), pagePath);
    const media = clean(ctr.querySelector('.ti-media'), pagePath);
    const name = mod === 'M3' ? 'hero' : (idx % 2 === 0 ? 'teaser reverse' : 'teaser');
    const m = asBlocks([...media.childNodes]);
    // a teaser whose only image was a source about:error defect degrades to default content
    html = m || mod === 'M3' ? block(name, [m ? row(asBlocks([...body.childNodes]), m) : row(asBlocks([...body.childNodes]))]) : asBlocks([...body.childNodes]);
  } else if (mod === 'M5' || mod === 'M7') {
    for (const c of [...ctr.children]) {
      if (c.matches('.lead')) html += defaultContent(c, pagePath);
      else if (c.matches('ul.cards')) html += cardsBlock(c, pagePath, false);
      else if (c.matches('ul.listing-cards')) html += cardsBlock(c, pagePath, true);
    }
  } else if (mod === 'M8') {
    html = defaultContent(ctr.querySelector('.cta-panel'), pagePath);
    styles.push('cta');
  } else {
    html = defaultContent(ctr.querySelector('.measure') || ctr, pagePath);
  }
  if (sec.classList.contains('band')) styles.push('band');
  if (styles.length) html += block('section-metadata', [row('<p>Style</p>', `<p>${styles.join(', ')}</p>`)]);
  return html;
}

function insertEmbeds(main, key, document) {
  for (const [needle, url] of EMBEDS[key] || []) {
    const p = [...main.querySelectorAll('p, h1, h2, h3, h4')].find((x) => x.textContent.includes(needle));
    if (!p) { console.error(`EMBED ANCHOR MISSING ${key}: ${needle}`); continue; }
    const np = document.createElement('p'); const a = document.createElement('a');
    a.setAttribute('href', url); a.textContent = url; np.append(a); p.after(np);
  }
}

const files = execSync(`find ${MIG} -name index.html`).toString().trim().split('\n').sort();
const report = [];
for (const f of files) {
  const rel = f.slice(MIG.length + 1); // about-us/enrol/index.html
  const key = rel.replace(/\/?index\.html$/, '') || 'index';
  const { document } = parseHTML(readFileSync(f, 'utf8'));
  const main = document.querySelector('main');
  insertEmbeds(main, key, document);
  // source .plain.html authors the hero heading as <h1>; the live block JS demotes it in the rendered DOM the capture read
  if (!main.querySelector('h1')) { const h = main.querySelector('section.hero .ti-body :is(h2,h3,h4)'); if (h) { const n = document.createElement('h1'); n.innerHTML = h.innerHTML; h.replaceWith(n); } }
  const secs = [...main.querySelectorAll(':scope > section')];
  const parts = secs.map((s, i) => encodeSection(s, i + 1, rel)).filter((h) => h.replace(/<div class="section-metadata">.*$/, '').trim());
  const title = (document.querySelector('title')?.textContent || '').trim();
  const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const meta = block('metadata', [row('<p>Title</p>', `<p>${esc(title)}</p>`), row('<p>Description</p>', `<p>${esc(desc)}</p>`), row('<p>nav</p>', `<p>${PREFIX}/nav</p>`), row('<p>footer</p>', `<p>${PREFIX}/footer</p>`)]);
  parts[parts.length - 1] += meta;
  const out = `<body><header></header><main>${parts.map((p) => `<div>${p}</div>`).join('')}</main><footer></footer></body>\n`;
  const dest = `${OUT}/${key}.html`;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, out);
  const blocks = [...out.matchAll(/<div class="([a-z-]+)[ "]/g)].map((m) => m[1]).filter((b) => !['section-metadata', 'metadata'].includes(b));
  report.push(`${key}\tsections=${parts.length}\tblocks=${[...new Set(blocks)].join(',')}`);
}

// nav + footer fragments from the home page chrome
{
  const { document } = parseHTML(readFileSync(`${MIG}/index.html`, 'utf8'));
  const nav = document.querySelector('nav.mainnav');
  const items = [...nav.querySelectorAll('.nav-list > .nav-item')].map((li) => {
    const a = li.querySelector(':scope > a');
    const sub = [...li.querySelectorAll('.nav-drop > li > a')].map((x) => `<li><a href="${localize(x.getAttribute('href'), 'index.html')}">${esc(x.textContent.trim())}</a></li>`).join('');
    return `<li><a href="${localize(a.getAttribute('href'), 'index.html')}">${esc(a.textContent.trim())}</a>${sub ? `<ul>${sub}</ul>` : ''}</li>`;
  }).join('');
  const util = document.querySelector('.utility .container');
  const contact = util.querySelector('a');
  const noindex = block('metadata', [row('<p>Robots</p>', '<p>noindex</p>')]);
  writeFileSync(`${OUT}/nav.html`, `<body><header></header><main><div><p><a href="${PREFIX}/">Fort Street High School</a></p></div><div><ul>${items}</ul></div><div><p>${esc(util.querySelector('span').textContent.trim())}</p><p><a href="${localize(contact.getAttribute('href'), 'index.html')}">${esc(contact.textContent.trim())}</a></p>${noindex}</div></main><footer></footer></body>\n`);
  const fb = document.querySelector('footer .f-brand');
  const cols = [...document.querySelectorAll('footer .f-col')].map((c) => `<div>${clean(c, 'index.html').innerHTML}</div>`).join('');
  writeFileSync(`${OUT}/footer.html`, `<body><header></header><main><div><p><a href="${PREFIX}/">Fort Street High School</a></p><p>${esc(fb.querySelector('p').textContent.trim())}</p></div>${cols.replace(/<\/div>$/, `${noindex}</div>`)}</main><footer></footer></body>\n`);
}
writeFileSync('encode-report.tsv', `${report.join('\n')}\n`);
console.log(`encoded ${report.length} pages + nav + footer → content/fortstreet/`);
