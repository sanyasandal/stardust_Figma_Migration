/**
 * Banner — oneAZ Teaser / Text + Image (default) or CTA Banner (`cta` variant).
 * Authored as one row with a text cell and an image cell, in either order.
 * @param {Element} block The banner block element
 */
export default function decorate(block) {
  const row = document.createElement('div');
  row.className = 'banner-inner';
  const content = document.createElement('div');
  content.className = 'banner-content';
  const media = document.createElement('div');
  media.className = 'banner-media';

  let imageFirst = null;
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const pictures = [...cell.querySelectorAll('picture')];
    if (imageFirst === null && (pictures.length || cell.textContent.trim())) {
      imageFirst = !cell.textContent.trim();
    }
    pictures.forEach((picture) => {
      const parent = picture.parentElement;
      media.append(picture);
      if (parent !== cell && !parent.textContent.trim() && !parent.children.length) parent.remove();
    });
    if (cell.textContent.trim()) content.append(...cell.childNodes);
  });

  if (media.children.length) {
    if (imageFirst) row.append(media, content);
    else row.append(content, media);
    block.classList.add(imageFirst ? 'image-left' : 'image-right');
  } else {
    row.append(content);
    block.classList.add('no-media');
  }
  block.replaceChildren(row);
}
