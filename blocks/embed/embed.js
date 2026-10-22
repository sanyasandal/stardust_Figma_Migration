/**
 * embed — lazy iframe for an authored Google Maps or Brightcove link.
 * Built by buildAutoBlocks() from a lone link; never authored as a block table.
 * @param {Element} block
 */
const PROVIDERS = [
  { test: /google\.[a-z.]+\/maps\/embed/, title: 'Location map', ratio: 'map' },
  { test: /bcove\.video|players\.brightcove\.net/, title: 'Video', ratio: 'video' },
];

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const { href } = link;
  const provider = PROVIDERS.find((p) => p.test.test(href));
  const load = () => {
    const iframe = document.createElement('iframe');
    iframe.src = href;
    iframe.title = provider ? provider.title : 'Embedded content';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    block.replaceChildren(iframe);
  };
  block.classList.add(provider ? provider.ratio : 'video');
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '200px' });
  observer.observe(block);
}
