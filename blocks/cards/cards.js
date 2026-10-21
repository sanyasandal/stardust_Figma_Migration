import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards — oneAZ "Teaser Card" (M5); variant `listing` = oneAZ "Listing Card" (M7).
 * Authored: one row per card, [image cell | body cell]; the image cell may be omitted.
 * Cells are moved, never rebuilt (EW1).
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('picture, img')) {
        div.remove();
      } else if (div.querySelector('picture') && !div.textContent.trim()) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    if (!li.querySelector('.cards-card-image')) li.classList.add('no-image');
    ul.append(li);
  });
  const width = block.classList.contains('listing') ? '600' : '750';
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!img.src.startsWith(window.location.origin)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });
  block.replaceChildren(ul);
}
