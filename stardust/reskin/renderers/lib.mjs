// stardust:reskin Phase 4 — shared renderer library (Fort Street HS → oneAZ v3.2 donor)
// Every visible string, href and image URL is interpolated from content-model.json `ordered`.
// Surface comes only from stardust/reskin/donor-tokens.json + the modules granted in mapping.md.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const R = (p) => resolve(ROOT, p);

export const loadModel = (slug) => JSON.parse(readFileSync(R(`stardust/reskin/content-model/${slug}/content-model.json`), 'utf8'));
export const tokens = JSON.parse(readFileSync(R('stardust/reskin/donor-tokens.json'), 'utf8'));

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

const INLINE_TAGS = { strong: 'strong', b: 'strong', em: 'em', i: 'em', u: 'u', small: 'small', sup: 'sup', sub: 'sub', code: 'code' };

export const isMediaOnly = (n) => n.kind === 'image'
  || (!norm(n.text) && (n.children || []).length > 0 && n.children.every(isMediaOnly));

const isBlockNode = (n) => {
  if (n.kind === 'text' || n.kind === 'image') return false;
  if (n.kind === 'cta') return !!n.display && !n.display.startsWith('inline');
  return !(n.display || 'block').startsWith('inline');
};

export const isButtonCta = (n) => n.kind === 'cta' && /(^|\s)(nsw-)?button(\s|$)/.test(n.classes || '');

const img = (n) => `<img src="${esc(n.currentSrc)}" alt="${esc(n.alt)}">`;

function textNode(n) {
  const t = esc(n.text);
  if (/\bsr-only\b/.test(n.parentClass || '')) return `<span class="sr-only">${t}</span>`;
  const tag = INLINE_TAGS[n.parentTag];
  return tag ? `<${tag}>${t}</${tag}>` : t;
}

// Emit a sibling run in stream order. sep '' → tight join (no whitespace); sep ' ' → one space.
// Consecutive listItem nodes are grouped into one <ul>.
export function emitRun(nodes, ctx = {}) {
  let out = '';
  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i];
    const sep = i === 0 || n.sep === '' ? '' : ' ';
    if (n.kind === 'listItem') {
      let j = i;
      const items = [];
      while (j < nodes.length && nodes[j].kind === 'listItem') { items.push(nodes[j]); j += 1; }
      out += `${sep}<ul${ctx.listClass ? ` class="${ctx.listClass}"` : ''}>${items.map((li) => emitNode(li, ctx)).join(' ')}</ul>`;
      i = j;
    } else {
      out += sep + emitNode(n, ctx);
      i += 1;
    }
  }
  return out;
}

const inner = (n, ctx) => (n.children && n.children.length ? emitRun(n.children, ctx) : esc(n.text));

export function emitNode(n, ctx = {}) {
  switch (n.kind) {
    case 'heading': {
      const lvl = /^h[1-6]$/.test(n.level || '') ? n.level : 'h2';
      return `<${lvl}>${inner(n, ctx)}</${lvl}>`;
    }
    case 'paragraph':
      return `<p${isMediaOnly(n) ? ' class="media"' : ''}>${inner(n, ctx)}</p>`;
    case 'listItem':
      return `<li${ctx.itemClass ? ` class="${ctx.itemClass}"` : ''}>${inner(n, ctx)}</li>`;
    case 'cta': {
      const cls = isButtonCta(n) ? ' class="btn"' : '';
      const a = `<a href="${esc(n.absHref)}"${cls}>${inner(n, ctx)}</a>`;
      return isBlockNode(n) ? `<div class="cta-row">${a}</div>` : a;
    }
    case 'image':
      return img(n);
    case 'text':
      return textNode(n);
    case 'formControl':
      throw new Error(`formControl node in stream — not granted by mapping.md: ${n.text}`);
    default:
      throw new Error(`unknown node kind ${n.kind}`);
  }
}
