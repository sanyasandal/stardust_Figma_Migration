/**
 * accordion — oneAZ "Accordion" (M9).
 * Authored: one row per item, [title cell | panel cell].
 * EW7: the authored title cell is moved into .accordion-title; the button is only a chevron.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const [title, panel] = row.children;
    if (!title) return;
    row.className = 'accordion-item';
    const head = document.createElement('div');
    head.className = 'accordion-head';
    title.classList.add('accordion-title');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'accordion-toggle';
    button.setAttribute('aria-label', title.textContent.trim());
    const expanded = i === 0;
    button.setAttribute('aria-expanded', expanded);
    head.append(title, button);
    row.prepend(head);
    if (panel) {
      panel.classList.add('accordion-panel');
      panel.id = panel.id || `${block.dataset.blockName || 'accordion'}-panel-${i}-${Math.random().toString(36).slice(2, 7)}`;
      button.setAttribute('aria-controls', panel.id);
      panel.hidden = !expanded;
    }
    head.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !open);
      if (panel) panel.hidden = open;
    });
  });
}
