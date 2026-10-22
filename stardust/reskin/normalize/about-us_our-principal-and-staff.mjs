import { DEFAULT_NORMALIZE, DEFAULT_LEDGER } from '../../scripts/reskin/source-normalize.mjs';

export const LEDGER = [
  ...DEFAULT_LEDGER,
  { id: 'N1', what: 'expand NSW accordions: remove hidden="until-found" from .nsw-accordion__content, set aria-expanded=true', why: 'collapsed panels are absent from innerText — same class as N-D2 hidden slides; the reskin renders every panel body (Figma Accordion expanded variant 12362:10348)' },
  { id: 'N2', what: 'remove Material Icons ligature spans (.material-icons: keyboard_arrow_down, east, north)', why: 'aria-hidden decorative glyphs whose ligature names leak into innerText; donor supplies its own chevron/arrow glyphs via CSS (mapping-brief § Icon-ligature text, "normalize it away")' },
];

export const NORMALIZE = `${DEFAULT_NORMALIZE};(() => {
  // N1 — expand accordions
  document.querySelectorAll('.nsw-accordion__content[hidden]').forEach((el) => el.removeAttribute('hidden'));
  document.querySelectorAll('.nsw-accordion__button[aria-expanded]').forEach((el) => el.setAttribute('aria-expanded', 'true'));
  // N2 — icon ligatures
  document.querySelectorAll('.material-icons').forEach((el) => el.remove());
})()`;
