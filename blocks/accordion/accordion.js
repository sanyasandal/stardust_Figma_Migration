/* Accordion — oneAZ Accordion (Figma 12360:10285) */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, body] = row.children;
    if (!label) {
      row.remove();
      return;
    }
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    const heading = label.querySelector('h1, h2, h3, h4, h5, h6');
    summary.append(...(heading ? heading.childNodes : label.childNodes));
    const content = document.createElement('div');
    content.className = 'accordion-item-body';
    if (body) content.append(...body.childNodes);
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, content);
    row.replaceWith(details);
  });
}
