/**
 * Hero — oneAZ "Home Hero Branded" (Figma 12950:24813).
 * Accepts the picture and the text in any rows/cells; splits them into
 * a content column and a media column.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-content';
  const media = document.createElement('div');
  media.className = 'hero-media';

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    cell.querySelectorAll('picture').forEach((picture) => {
      const parent = picture.parentElement;
      media.append(picture);
      if (parent !== cell && !parent.textContent.trim() && !parent.children.length) parent.remove();
    });
    content.append(...cell.childNodes);
  });

  if (!media.children.length) block.classList.add('no-media');
  block.replaceChildren(content);
  if (media.children.length) block.append(media);
}
