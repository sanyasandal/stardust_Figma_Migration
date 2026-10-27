// stardust:reskin scale helper — shape summary of a content-model slot (used by infer-plan.mjs).
export function shape(slot) {
  const c = { heading: 0, paragraph: 0, listItem: 0, cta: 0, image: 0, text: 0, acc: 0, btn: 0, liFull: 0, liImg: 0 };
  const walk = (ns, top) => ns.forEach((n) => {
    c[n.kind] = (c[n.kind] || 0) + 1;
    if (n.kind === 'text' && /nsw-accordion__button/.test(n.parentClass || '')) c.acc += 1;
    if (n.kind === 'cta' && /button|btn/.test(n.classes || '')) c.btn += 1;
    if (top && n.kind === 'listItem' && n.children && n.children.length) { c.liFull += 1; if (JSON.stringify(n.children).includes('"image"')) c.liImg += 1; }
    if (n.children) walk(n.children, false);
  });
  walk(slot.ordered, true);
  return c;
}
