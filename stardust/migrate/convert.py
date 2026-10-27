"""Bulk-convert Fort Street EDS source pages (.plain.html) to oneAZ DA documents.

Block mapping (see stardust/figma-to-eds/mapping.md):
  card-container*      -> cards (cards supplementary when no images)
  gallery              -> cards (image + caption)
  content-container    -> columns
  columns              -> columns
  accordions           -> accordion   (Figma 12360:10285)
  table*               -> table (keeps no-header / bordered)
  embed                -> embed (bcove.video resolved to player URL)
  facebook-feed        -> facebook-feed
  planningreporting    -> default-content link (NSW data widget not portable)
  section-metadata background -> style (dark -> dark, light -> off-white, white -> white)
"""
import html, json, os, re, subprocess, sys
from html.parser import HTMLParser

ORIGIN = 'https://fortstreet-h.schools.nsw.gov.au'
BASE = '/fortstreet'
VOID = {'img', 'source', 'br', 'hr', 'meta', 'link', 'input'}
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, '..', 'reskin', 'source', 'pages')
OUT = os.path.join(ROOT, '..', 'content', 'pages')
LOG = {'pages': {}, 'unmapped': {}}


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs or {}), parent, []

    def cls(self):
        return self.attrs.get('class', '')

    def divs(self):
        return [c for c in self.children if isinstance(c, Node) and c.tag == 'div']

    def find(self, tag):
        for c in self.children:
            if isinstance(c, Node):
                if c.tag == tag:
                    return c
                f = c.find(tag)
                if f:
                    return f
        return None

    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(s):
    b = Builder()
    b.feed(s)
    return b.root


def fix_href(h):
    if h.startswith(ORIGIN):
        h = h[len(ORIGIN):] or '/'
    if h.startswith('/') and not h.startswith('//') and not h.startswith('/media_') and not h.startswith(BASE + '/'):
        return BASE + (h if h != '/' else '/')
    return h


def fix_src(s):
    s = s.split('?')[0]
    if s.startswith('./'):
        s = ORIGIN + s[1:]
    elif s.startswith('/'):
        s = ORIGIN + s
    return s


def ser(n):
    if isinstance(n, str):
        return html.escape(n, quote=False)
    if n.tag == 'picture':
        img = n.find('img')
        return ser(img) if img else ''
    if n.tag == 'img':
        alt = html.escape(n.attrs.get('alt') or '', quote=True)
        return f'<picture><img src="{fix_src(n.attrs.get("src", ""))}" alt="{alt}"></picture>'
    if n.tag == 'source':
        return ''
    attrs = ''
    for k, v in n.attrs.items():
        if k in ('id', 'loading', 'width', 'height'):
            continue
        if k == 'href':
            v = fix_href(v or '')
        attrs += f' {k}="{html.escape(v or "", quote=True)}"'
    inner = ''.join(ser(c) for c in n.children)
    if n.tag in VOID:
        return f'<{n.tag}{attrs}>'
    return f'<{n.tag}{attrs}>{inner}</{n.tag}>'


def inner(n):
    return ''.join(ser(c) for c in n.children).strip()


def is_empty(cell):
    return not cell.text().strip() and not cell.find('img')


def block(cls, rows):
    out = ''.join('<div>' + ''.join(f'<div>{c}</div>' for c in r) + '</div>' for r in rows)
    return f'<div class="{cls}">{out}</div>'


def cell_html(cell):
    h = inner(cell)
    if h and not re.match(r'\s*<(p|h\d|ul|ol|picture|div|table)\b', h):
        h = f'<p>{h}</p>'
    return h


_bc = {}


def resolve_embed(href):
    if 'bcove.video' in href:
        if href not in _bc:
            r = subprocess.run(['curl', '-sIL', '-o', '/dev/null', '-w', '%{url_effective}', href],
                               capture_output=True, text=True, timeout=30)
            _bc[href] = r.stdout.strip() or href
        return _bc[href]
    return href


def convert_block(b, page):
    c = b.cls().split()
    name, variants = c[0], c[1:]
    rows = b.divs()
    if name == 'section-metadata':
        out = []
        for r in rows:
            cells = r.divs()
            if len(cells) >= 2 and cells[0].text().strip().lower() == 'background':
                v = cells[1].text().strip().lower()
                out.append(['style', {'dark': 'dark', 'light': 'off-white', 'white': 'white'}.get(v, v)])
        return block('section-metadata', out) if out else ''
    if name == 'card-container' or name == 'gallery':
        out = []
        for r in rows:
            cells = [cell_html(x) for x in r.divs() if not is_empty(x)]
            if cells:
                out.append(cells)
        has_img = any('<picture>' in x for r in out for x in r)
        return block('cards' if has_img else 'cards supplementary', out)
    if name in ('content-container', 'columns'):
        return block('columns', [[cell_html(x) for x in r.divs()] for r in rows])
    if name == 'accordions':
        out = []
        for r in rows:
            cells = r.divs()
            if not cells:
                continue
            label = cells[0].text().strip()
            out.append([f'<h3>{html.escape(label)}</h3>', cell_html(cells[1]) if len(cells) > 1 else ''])
        return block('accordion', out)
    if name == 'table':
        keep = [v for v in variants if v in ('no-header', 'bordered')]
        return block(' '.join(['table'] + keep), [[cell_html(x) for x in r.divs()] for r in rows])
    if name == 'embed':
        a = b.find('a')
        if not a:
            return ''
        href = resolve_embed(a.attrs.get('href', ''))
        return block('embed', [[f'<p><a href="{html.escape(href, quote=True)}">{html.escape(href)}</a></p>']])
    if name == 'facebook-feed':
        return block('facebook-feed', [[cell_html(x) for x in r.divs()] for r in rows])
    if name == 'planningreporting':
        LOG['pages'][page].setdefault('deviations', []).append('planningreporting widget -> link')
        return ('<p><a href="https://education.nsw.gov.au/about-us/strategies-and-reports/'
                'school-excellence-and-accountability">School plans and annual reports '
                '(NSW Department of Education, school code 8504)</a></p>')
    LOG['unmapped'].setdefault(name, []).append(page)
    return ser(b)


def head_meta(path):
    r = subprocess.run(['curl', '-s', ORIGIN + path], capture_output=True, text=True, timeout=60)
    s = r.stdout
    def m(p):
        x = re.search(p, s, re.I | re.S)
        return html.unescape(x.group(1)).strip() if x else ''
    return {
        'Title': m(r'<title>(.*?)</title>'),
        'Description': m(r'<meta name="description" content="([^"]*)"'),
        'Image': fix_src(m(r'<meta property="og:image" content="([^"]*)"')),
    }


def convert(fname):
    path = '/' + fname[:-len('.plain.html')].replace('_', '/')
    page = path.lstrip('/')
    LOG['pages'][page] = {'source': ORIGIN + path, 'target': BASE + path, 'blocks': {}}
    root = parse(open(os.path.join(SRC, fname), encoding='utf-8').read())
    sections = []
    for sec in root.children:
        if not isinstance(sec, Node) or sec.tag != 'div':
            continue
        parts = []
        for ch in sec.children:
            if isinstance(ch, Node) and ch.tag == 'div' and ch.cls():
                out = convert_block(ch, page)
                m = re.match(r'<div class="([^"]+)"', out)
                if m:
                    k = m.group(1)
                    LOG['pages'][page]['blocks'][k] = LOG['pages'][page]['blocks'].get(k, 0) + 1
                parts.append(out)
            elif isinstance(ch, Node):
                parts.append(ser(ch))
            elif ch.strip():
                parts.append(html.escape(ch.strip(), quote=False))
        body = ''.join(parts)
        if re.sub(r'<div class="section-metadata">.*', '', body).strip():
            sections.append(f'<div>{body}</div>')
    meta = head_meta(path)
    rows = [[k, html.escape(v)] for k, v in meta.items() if v and not v.endswith('/')]
    rows += [['Nav', f'{BASE}/nav'], ['Footer', f'{BASE}/footer']]
    if sections:
        sections[-1] = sections[-1][:-6] + block('metadata', rows) + '</div>'
    doc = '<body><header></header><main>' + ''.join(sections) + '</main><footer></footer></body>\n'
    out = os.path.join(OUT, path.lstrip('/') + '.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(doc)
    LOG['pages'][page]['title'] = meta['Title']


def rewrite_links(fname):
    p = os.path.join(ROOT, '..', 'content', fname)
    s = open(p, encoding='utf-8').read()
    s = re.sub(r'href="(%s[^"]*|/[^"/][^"]*|/)"' % re.escape(ORIGIN),
               lambda m: f'href="{fix_href(html.unescape(m.group(1)))}"', s)
    open(p, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    for f in sorted(os.listdir(SRC)):
        if f.endswith('.plain.html'):
            convert(f)
            print('converted', f)
    for f in ('index.html', 'nav.html', 'footer.html'):
        rewrite_links(f)
    LOG['embeds_resolved'] = _bc
    json.dump(LOG, open(os.path.join(ROOT, 'migration-log.json'), 'w'), indent=1)
    print('unmapped:', LOG['unmapped'])
