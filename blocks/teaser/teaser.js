/**
 * teaser — oneAZ "Teaser Text + Image" (M4).
 * Authored: one row, [body cell | image cell]. Variant `reverse` puts the image first.
 * @param {Element} block
 */
export default function decorate(block) {
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const isMedia = cell.querySelector('picture') && !cell.querySelector('h1,h2,h3,h4,h5,h6,p:not(:has(picture))');
    cell.classList.add(isMedia ? 'teaser-media' : 'teaser-body');
  });
}
