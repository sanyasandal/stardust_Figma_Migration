/**
 * hero — oneAZ "Home Hero Branded" (M3).
 * Authored: one row, [body cell | image cell] in any order. Queried, not indexed (#42).
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((c) => c.querySelector('picture') && !c.querySelector('h1,h2,h3,h4,h5,h6'));
  cells.forEach((cell) => {
    cell.classList.add(cell === media ? 'hero-media' : 'hero-body');
  });
  const img = media && media.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  }
}
