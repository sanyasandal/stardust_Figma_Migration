/**
 * Facebook feed — carries the source site's dynamic Facebook timeline.
 * Authored as a single cell holding the Facebook page URL. The Page Plugin
 * iframe is injected only when the block nears the viewport; the authored
 * link stays as the no-JS / blocked-embed fallback.
 * @param {Element} block The facebook-feed block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href*="facebook.com"]');
  if (!link) {
    block.closest('.section')?.classList.add('facebook-feed-empty');
    return;
  }
  const pageUrl = link.href;
  const fallback = document.createElement('p');
  fallback.className = 'facebook-feed-fallback';
  const a = document.createElement('a');
  a.href = pageUrl;
  a.textContent = link.textContent.trim().startsWith('http') ? 'Follow us on Facebook' : link.textContent;
  fallback.append(a);
  block.replaceChildren(fallback);

  const embed = () => {
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      href: pageUrl,
      tabs: 'timeline',
      width: '500',
      height: '600',
      small_header: 'false',
      adapt_container_width: 'true',
      hide_cover: 'false',
      show_facepile: 'false',
    });
    iframe.src = `https://www.facebook.com/plugins/page.php?${params}`;
    iframe.title = 'Fort Street High School on Facebook';
    iframe.width = '500';
    iframe.height = '600';
    iframe.loading = 'lazy';
    iframe.setAttribute('allow', 'encrypted-media');
    block.prepend(iframe);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      embed();
    }
  }, { rootMargin: '200px' });
  observer.observe(block);
}
