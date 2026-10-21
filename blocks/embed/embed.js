/* Embed — responsive 16:9 video/iframe embed */
function toEmbedUrl(href) {
  const url = new URL(href);
  if (url.hostname.includes('youtu')) {
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (url.hostname.includes('vimeo.com')) {
    return `https://player.vimeo.com/video/${url.pathname.split('/').pop()}`;
  }
  return url.href;
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const { href } = link;
  const title = link.title || 'Embedded video';
  block.textContent = '';
  const frame = document.createElement('div');
  frame.className = 'embed-frame';
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    observer.disconnect();
    const iframe = document.createElement('iframe');
    iframe.src = toEmbedUrl(href);
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.append(iframe);
  });
  observer.observe(block);
  const fallback = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = 'Watch the video';
  fallback.append(a);
  block.append(frame, fallback);
}
