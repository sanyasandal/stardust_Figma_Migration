// stardust:reskin scale — sibling-tier module plan. Encodes the mapping.md decision rules as written for the
// 8 gated archetypes (validated: reproduces all 52 archetype rows) so same-type siblings map identically.
import { shape } from './slot-shape.mjs';

export function moduleFor(slot, index) {
  const c = shape(slot);
  const rc = slot.rootClass || '';
  const band = /brand-dark|invert/.test(rc);
  if (c.acc) return 'M9'; // accordion items → Accordion
  if (/full-image-banner/.test(rc) && index === 0) return 'M3'; // page-opening branded banner → Home Hero
  if (/\b(card|cards|gallery|facebook-feed)\b/.test(rc)) return 'M5'; // card / gallery / feed → Teaser Card grid
  if (c.image >= 2 && c.heading >= c.image && !c.listItem) return 'M7'; // dated/titled items with media → Listing Card
  if (c.image >= 2 && !c.liFull) return 'M5'; // repeated media posts → Teaser Card grid
  if (c.image === 1 && !/table/.test(rc)) return 'M4'; // one image + text → Teaser Text+Image
  if (band && c.btn === 1 && c.heading <= 1 && c.paragraph <= 3) return 'M8'; // band heading + text + one action → CTA Banner
  return 'M6'; // prose (incl. tables → NM1 inside, planning lists, embeds as links) → Title + Text
}

export const inferPlan = (model) => Object.fromEntries(model.sections.map((s, i) => [s.slot, moduleFor(s, i)]));
