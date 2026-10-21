// stardust:reskin Phase 4 — slot flow (accordion M9 grouping, NM1 data tables) + module layouts.
import { readFileSync } from 'node:fs';
import { R, esc, norm, emitNode, emitRun, isMediaOnly } from './lib.mjs';

// ---------- NM1 data table: structure (rows × cells) from the source `table` block; strings from the stream ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1));
  return ENT[e.toLowerCase()] ?? m;
});
const cellText = (h) => norm(decode(h.replace(/<[^>]+>/g, ' ')));

export function sourceTables(slug) {
  const file = slug === 'index' ? 'stardust/reskin/source/index.html' : `stardust/reskin/source/pages/${slug}.plain.html`;
  const html = readFileSync(R(file), 'utf8');
  const tables = [];
  const re = /<div class="table([^"]*)">/g;
  let m;
  while ((m = re.exec(html))) {
    const tagRe = /<(\/?)div\b[^>]*>/g;
    tagRe.lastIndex = m.index;
    let depth = 0; let row = null; let cellStart = 0; const rows = []; let t;
    while ((t = tagRe.exec(html))) {
      if (!t[1]) {
        depth += 1;
        if (depth === 2) row = [];
        if (depth === 3) cellStart = tagRe.lastIndex;
      } else {
        if (depth === 3) row.push(cellText(html.slice(cellStart, t.index)));
        if (depth === 2) rows.push(row);
        depth -= 1;
        if (depth === 0) break;
      }
    }
    tables.push({ variant: m[1].trim(), rows });
    re.lastIndex = tagRe.lastIndex;
  }
  return tables;
}

const clean = (s) => norm(s.replace(/\s*\(opens in new window\)/g, ''));

// Consume stream nodes (paragraph / inline text / heading) cell by cell. null = the table does not start here
// (any mismatch inside the first row); throws on a later mismatch. Two tolerated live-vs-source drifts:
// an empty source cell the live page fills with a dash placeholder, and a cell whose tail text the stream
// did not carry as its own node (emitted from the source cell string).
const TCELL = new Set(['paragraph', 'text', 'heading']);
function tryTable(nodes, start, table) {
  let i = start;
  const rowsHtml = [];
  let rowIdx = 0;
  for (const row of table.rows) {
    const cells = [];
    for (const cell of row) {
      if (!cell) {
        const d = nodes[i];
        if (d && d.kind === 'paragraph' && /^[-–—]$/.test(clean(d.text))) { cells.push(`<td>${emitRun([d])}</td>`); i += 1; } else cells.push('<td></td>');
        continue;
      }
      const taken = [];
      let joined = '';
      let tail = '';
      while (clean(joined) !== cell) {
        const n = nodes[i];
        const next = n ? clean(`${joined} ${n.text}`) : null;
        if (!n || !TCELL.has(n.kind) || !clean(n.text) || !cell.startsWith(next)) {
          if (taken.length && rowIdx > 0 || taken.length && clean(joined).length >= 4) {
            // a "(85%)" column-width hint is consumed by the source table block and never visible
            tail = cell.slice(clean(joined).length).trim().replace(/^\(\d+%\)$/, '');
            break;
          }
          if (rowIdx === 0) return null;
          throw new Error(`NM1 parse failed at cell "${cell}" — stream node "${n && n.text}"`);
        }
        taken.push(n); joined = `${joined} ${n.text}`; i += 1;
      }
      cells.push(`<td>${emitRun(taken)}${tail ? ` ${esc(tail)}` : ''}</td>`);
    }
    rowsHtml.push(`<tr>${cells.join('')}</tr>`);
    rowIdx += 1;
  }
  const cls = `nm1${/bordered/.test(table.variant) ? ' nm1-bordered' : ''}`;
  return { html: `<div class="${cls}" data-module="NM1"><table><tbody>${rowsHtml.join('')}</tbody></table></div>`, next: i };
}

// ---------- slot flow: stream order, accordion items (M9), NM1 tables ----------
const isAccButton = (n) => n.kind === 'text' && /nsw-accordion__button/.test(n.parentClass || '');

export function flow(nodes, ctx = {}) {
  const out = [];
  let acc = null; // { items: [{label, body: []}] }
  const sink = () => (acc ? acc.items[acc.items.length - 1].body : out);
  const flushAcc = () => {
    if (!acc) return;
    out.push(`<div class="accordion" data-module="M9">${acc.items.map((it) => `<div class="acc-item"><button class="acc-btn" type="button" aria-expanded="true">${esc(it.label)}</button><div class="acc-panel">${it.body.join(' ')}</div></div>`).join('')}</div>`);
    acc = null;
  };
  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i];
    if (isAccButton(n)) {
      if (!acc) acc = { items: [] };
      acc.items.push({ label: n.text, body: [] });
      i += 1;
    } else if (ctx.tables && ctx.tables.length && TCELL.has(n.kind) && (() => { const t = tryTable(nodes, i, ctx.tables[0]); if (t) { ctx.tables.shift(); sink().push(t.html); i = t.next; return true; } return false; })()) {
      // table consumed
    } else if (n.kind === 'listItem') {
      let j = i;
      while (j < nodes.length && nodes[j].kind === 'listItem') j += 1;
      sink().push(emitRun(nodes.slice(i, j), ctx));
      i = j;
    } else {
      sink().push(emitNode(n, ctx));
      i += 1;
    }
  }
  flushAcc();
  return out.join(' ');
}

// split a slot's top-level stream into media (images / image-only wrappers) and body, each in stream order
export function splitMedia(nodes) {
  const media = []; const body = [];
  for (const n of nodes) (isMediaOnly(n) ? media : body).push(n);
  return { media, body };
}

// group a flat run into cards: each top-level image starts a card (feed posts, listing rows)
export function groupByImage(nodes) {
  const lead = []; const groups = [];
  for (const n of nodes) {
    if (isMediaOnly(n)) groups.push([n]);
    else if (groups.length) groups[groups.length - 1].push(n);
    else lead.push(n);
  }
  return { lead, groups };
}
