#!/usr/bin/env python3
"""Mechanical JSX -> static HTML converter for excatfigma get_design_context exports.

Reads the raw exports in this folder (*.jsx), converts them to HTML fragments,
applies the logged mechanical fixes, assembles the donor pages one level up and
writes _export-log.json.
"""
import json
import re
from datetime import datetime, timezone
from pathlib import Path

SRC = Path(__file__).resolve().parent
OUT = SRC.parent
FILE_KEY = 'rsZQmpVzuyn0KhCDA3WN60'

# slug -> (section label, exported node id, parent/frame id)
SECTIONS = {
    'header': ('Header', '12387:11888', '12387:11655'),
    'breadcrumb': ('Breadcrumb', '12410:12885', None),
    'home-hero-branded': ('Home Hero Branded', '12950:24813', '12950:24869'),
    'teaser-text-image': ('Teaser Text+Image', '12431:14270', '12431:14303'),
    'teaser-card': ('Teaser Card', '12436:14706', '12436:14752'),
    'block-content-title-text': ('Block Content / Title + Text', '12534:1405', '12552:3653'),
    'block-content-listing-card': ('Block Content / Listing Card', '12534:1414', '12552:3653'),
    'cta-banner': ('CTA Banner', '13370:1909', '13370:1922'),
    'accordion': ('Accordion (expanded)', '12362:10348', None),
    'footer': ('Footer', '12406:12186', '12406:12220'),
    'buttons': ('Button variants', '12084:109282', '12077:109023'),
}

# Targeted stroke-side fixes (Figma single-side strokes exported as full borders).
STROKE_FIXES = {
    # .Header / Language Selector: EN has a right stroke, FR a left stroke,
    # overlapping via the -1px gap -> renders as a single "EN | FR" divider.
    'I12387:11888;12385:11045;12379:11036': ('border-[1px]', 'border-0 border-r-[1px]'),
    'I12387:11888;12385:11045;12379:11039': ('border-[1px]', 'border-0 border-l-[1px]'),
}

# Rasterised frames exported as <img> with w-fit/h-fit render at the @2x asset's
# natural size. Pin them to the Figma node size (get_metadata); padding classes on
# such <img> are dropped because the raster already includes the frame padding.
IMG_SIZES = {
    '12950:24819': (219, 116),               # hero logo frame (raster 438x232 incl. py-32)
    'I13370:1868;12128:3190': (111, 24),     # CTA input "Label + Icon" (raster 222x48)
    'I13370:1868;12128:3256': (None, 24),    # CTA input "Icon + Text" (raster 2320x48)
    'I13370:1868;12160:3278': (20, 20),      # CTA input chevron (raster 40x40)
    '12406:12170': (164, 20),                # footer social icons (raster 328x40)
}

TAG_RE = re.compile(r'<(/?)([a-zA-Z][\w]*)((?:[^>"]|"[^"]*")*?)(/?)>', re.S)
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link'}


def camel_to_kebab(name):
    return re.sub(r'([A-Z])', lambda m: '-' + m.group(1).lower(), name)


def parse_assets(text):
    block = re.search(r'const ASSETS = \{(.*?)\};', text, re.S)
    if not block:
        return {}
    return dict(re.findall(r'(\w+):\s*"([^"]+)"', block.group(1)))


def extract_jsx(text):
    start = text.index('return (') + len('return (')
    end = text.rindex(');')
    return text[start:end].strip('\n')


def convert_attrs(attrs, assets):
    attrs = re.sub(r'src=\{ASSETS\.(\w+)\}', lambda m: f'src="{assets[m.group(1)]}"', attrs)
    attrs = re.sub(r'\bclassName=', 'class=', attrs)

    def style_sub(m):
        pairs = re.findall(r'(\w+):\s*"([^"]*)"', m.group(1))
        return 'style="' + '; '.join(f'{camel_to_kebab(k)}: {v}' for k, v in pairs) + '"'

    attrs = re.sub(r'style=\{\{(.*?)\}\}', style_sub, attrs, flags=re.S)
    attrs = re.sub(r'\s+', ' ', attrs).strip()
    return attrs


def get_attr(attrs, name):
    m = re.search(rf'\b{name}="([^"]*)"', attrs)
    return m.group(1) if m else None


def set_class(attrs, classes):
    return re.sub(r'\bclass="[^"]*"', f'class="{" ".join(classes)}"', attrs)


def convert(slug, fixes):
    text = (SRC / f'{slug}.jsx').read_text()
    assets = parse_assets(text)
    jsx = extract_jsx(text)
    out = []
    pos = 0
    stack = []  # list of (tag, classes)
    for m in TAG_RE.finditer(jsx):
        out.append(jsx[pos:m.start()])
        pos = m.end()
        closing, tag, attrs, selfclose = m.group(1), m.group(2), m.group(3), m.group(4)
        if closing:
            stack.pop()
            out.append(f'</{tag}>')
            continue
        attrs = convert_attrs(attrs, assets)
        cls_val = get_attr(attrs, 'class')
        node = get_attr(attrs, 'data-node-id')
        if cls_val is not None:
            classes = cls_val.split()
            parent_classes = stack[-1][1] if stack else []
            # Rule 3: auto-layout child exported as absolute -> relative
            if 'absolute' in classes and 'flex' in parent_classes:
                classes = ['relative' if c == 'absolute' else c for c in classes]
                fixes.append({'rule': 3, 'section': slug, 'nodeId': node,
                              'fix': 'absolute -> relative (parent is flex auto-layout)',
                              'parentNodeId': stack[-1][2]})
            # Rule 4: bogus bg on text node (bg colour == text colour)
            bgs = [c for c in classes if c.startswith('bg-[')]
            txt = [c for c in classes if c.startswith('text-[color:')]
            if bgs and txt:
                bg_val = bgs[0][len('bg-['):-1]
                txt_val = txt[0][len('text-[color:'):-1]
                if bg_val == txt_val:
                    classes = [c for c in classes if c != bgs[0]]
                    fixes.append({'rule': 4, 'section': slug, 'nodeId': node,
                                  'fix': f'removed {bgs[0]} from text node (same as text colour)'})
            # Fill-container: Figma "fill" in a horizontal auto layout is exported as
            # w-full, which overflows next to siblings in CSS flex-row.
            if 'w-full' in classes and 'flex-row' in parent_classes:
                i = classes.index('w-full')
                classes[i:i + 1] = ['flex-1', 'min-w-0']
                fixes.append({'rule': '3-style', 'section': slug, 'nodeId': node,
                              'fix': 'w-full -> flex-1 min-w-0 (fill container in flex-row parent)',
                              'parentNodeId': stack[-1][2]})
            if tag == 'img' and node in IMG_SIZES:
                w, h = IMG_SIZES[node]
                before = ' '.join(classes)
                if w is not None:
                    classes = [f'w-[{w}px]' if c == 'w-fit' else c for c in classes]
                classes = [f'h-[{h}px]' if c == 'h-fit' else c for c in classes]
                classes = [c for c in classes if not re.match(r'^p[xytrbl]?-\[', c)]
                fixes.append({'rule': '3-style', 'section': slug, 'nodeId': node,
                              'fix': f'raster <img> pinned to Figma node size {w}x{h} '
                                     f'(was "{before}"; padding baked into raster removed)'})
            if node in STROKE_FIXES:
                old, new = STROKE_FIXES[node]
                if old in classes:
                    i = classes.index(old)
                    classes[i:i + 1] = new.split()
                    fixes.append({'rule': '3/4-style', 'section': slug, 'nodeId': node,
                                  'fix': f'single-side stroke: {old} -> {new}'})
            attrs = set_class(attrs, classes)
            # rotate(-π deg): a radians value emitted with a deg unit; the exported
            # raster already has the 180° rotation baked in, so drop the stray tilt.
            if 'rotate(-3.141592653589793deg)' in attrs:
                attrs = re.sub(r'\s*style="transform: rotate\(-3\.141592653589793deg\)"', '', attrs)
                fixes.append({'rule': '3-style', 'section': slug, 'nodeId': node,
                              'fix': 'removed style transform rotate(-3.141592653589793deg) '
                                     '(radians-as-deg; rotation already baked into raster)'})
        else:
            classes = []
        if tag in VOID:
            out.append(f'<{tag} {attrs}>')
        elif selfclose:
            out.append(f'<{tag} {attrs}></{tag}>')
        else:
            out.append(f'<{tag} {attrs}>')
            stack.append((tag, classes, node))
    out.append(jsx[pos:])
    html = ''.join(out)
    html = re.sub(r'\n\s*\n', '\n', html)
    # dedent by the JSX indentation (4 spaces)
    html = '\n'.join(line[4:] if line.startswith('    ') else line for line in html.split('\n'))
    return html, assets


def collect_vars(texts):
    found = {}
    for t in texts:
        for name, fb in re.findall(r'var\((--[\w-]+),(#[0-9a-fA-F]{3,8})\)', t):
            found.setdefault(name, set()).add(fb.lower())
    return found


def page(title, header, main_sections, footer, root_css):
    sections = '\n'.join(main_sections)
    head = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = {{ corePlugins: {{ container: false }} }};</script>
<style>
{root_css}
.container {{ max-width: 1180px; margin-left: auto; margin-right: auto; }}
</style>
</head>
<body>'''
    parts = [head]
    if header:
        parts.append(f'<header>\n{header}\n</header>')
    parts.append(f'<main>\n{sections}\n</main>')
    if footer:
        parts.append(f'<footer>\n{footer}\n</footer>')
    parts.append('</body>\n</html>\n')
    return '\n'.join(parts)


def section(slug, html, container=False):
    label, node, _ = SECTIONS[slug]
    inner = f'<div class="container">\n{html}\n</div>' if container else html
    return f'<section data-section="{slug}" data-figma-node-id="{node}" aria-label="{label}">\n{inner}\n</section>'


def card_row(card_html, n):
    cards = '\n'.join([card_html] * n)
    # gap 40px = Figma "Element type=2 Teasers, Breakpoint=Desktop" (12542:1504): 1180 - 2*570
    return (f'<div class="container">\n<div class="flex flex-row gap-[40px]" '
            f'data-layout-source="12542:1504">\n{cards}\n</div>\n</div>')


def main():
    fixes = []
    frags = {}
    for slug in SECTIONS:
        frags[slug], _ = convert(slug, fixes)
    variables = collect_vars((SRC / f'{s}.jsx').read_text() for s in SECTIONS)
    conflicts = {k: sorted(v) for k, v in variables.items() if len(v) > 1}
    root_css = ':root {\n' + '\n'.join(
        f'  {k}: {sorted(v)[0]};' for k, v in sorted(variables.items())) + '\n}'

    card_rows = {}
    # 2 cards: 2 x 527 + 40 fits the 1180 container; 3 x 527 would overflow it.
    for slug, n in (('home', 2), ('content', 2)):
        card_rows[slug] = (f'<section data-section="teaser-card-row" data-figma-node-id="12436:14706" '
                           f'aria-label="Teaser Cards">\n{card_row(frags["teaser-card"], n)}\n</section>')

    pages = {
        'home.html': ('oneAZ donor — Home', 'header', [
            section('home-hero-branded', frags['home-hero-branded']),
            section('teaser-text-image', frags['teaser-text-image'], container=True),
            card_rows['home'],
            section('cta-banner', frags['cta-banner']),
        ], 'footer'),
        'content.html': ('oneAZ donor — Content', 'header', [
            section('breadcrumb', frags['breadcrumb']),
            section('block-content-title-text', frags['block-content-title-text'], container=True),
            section('block-content-listing-card', frags['block-content-listing-card'], container=True),
            section('accordion', frags['accordion']),
            card_rows['content'],
        ], 'footer'),
        'components.html': ('oneAZ donor — Components', None, [
            section('buttons', frags['buttons'], container=True),
            section('teaser-card', frags['teaser-card'], container=True),
            section('breadcrumb', frags['breadcrumb']),
            section('accordion', frags['accordion']),
            section('cta-banner', frags['cta-banner']),
        ], None),
    }
    page_sections = {
        'home.html': ['header', 'home-hero-branded', 'teaser-text-image', 'teaser-card', 'cta-banner', 'footer'],
        'content.html': ['header', 'breadcrumb', 'block-content-title-text', 'block-content-listing-card',
                         'accordion', 'teaser-card', 'footer'],
        'components.html': ['buttons', 'teaser-card', 'breadcrumb', 'accordion', 'cta-banner'],
        'index.html': [],
    }
    for name, (title, hdr, mains, ftr) in pages.items():
        (OUT / name).write_text(page(title, frags[hdr] if hdr else None, mains,
                                     frags[ftr] if ftr else None, root_css))

    index_main = '''<section data-section="index" aria-label="Donor pages">
<h1>oneAZ Design System v3.2 — donor prototypes</h1>
<ul>
<li><a href="home.html">Home</a> — Header, Home Hero Branded, Teaser Text+Image, Teaser Cards, CTA Banner, Footer</li>
<li><a href="content.html">Content</a> — Header, Breadcrumb, Block Content, Accordion, Teaser Cards, Footer</li>
<li><a href="components.html">Components</a> — Buttons, Teaser Card, Breadcrumb, Accordion, CTA Banner</li>
</ul>
</section>'''
    (OUT / 'index.html').write_text(page('oneAZ donor — Index', None, [index_main], None, root_css))

    figma_dir = OUT / '_figma'
    log = {
        'provenance': {
            'tool': 'excatfigma get_design_context (Figma Dev Mode code export)',
            'fileKey': FILE_KEY,
            'fileName': 'oneAZ Design System v3.2',
            'exportedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'),
            'conversion': '_src/build.py (mechanical JSX -> HTML; Tailwind Play CDN; :root Figma variables)',
            'assetUrlsExpire': 'Figma asset URLs (figma-alpha-api S3) are valid for 14 days from export',
        },
        'screenshots': {
            'saved': any(figma_dir.glob('*.png')),
            'note': ('excatfigma get_screenshot returns the image inline to the agent only; it exposes no '
                     'file path or byte stream, so Figma PNGs could not be saved to _figma/. Screenshots were '
                     'still fetched and used for visual comparison during verification.'),
        },
        'cssVariables': {k: sorted(v)[0] for k, v in sorted(variables.items())},
        'cssVariableConflicts': conflicts,
        'pages': {},
        'assemblyNotes': [
            'Teaser card row gap 40px taken from Figma "Element type=2 Teasers, Breakpoint=Desktop" (12542:1504).',
            'class="container" (max-width 1180px, centred) used only around frames that are themselves 1180px wide '
            '(Block Content elements, Teaser Text+Image 574+32+574, Button variants row, teaser card rows); '
            "Tailwind's own container plugin disabled to avoid conflict.",
            'Fonts Lexia/Inter are not loaded (not part of the Figma export); the exported font stacks are kept verbatim.',
            'Block Content (12552:3653) is a documentation frame; desktop variants of its .Block Element set '
            '(12534:1413) exported: Title + Text (12534:1405) and Listing Card (12534:1414).',
            'Button (12077:109023) is a page; exported the "Button variants" row 12084:109282 '
            '(primary, secondary, tertiary, link + icon-only, default state).',
        ],
    }
    for name, slugs in page_sections.items():
        entry = {'sections': [], 'fixes': []}
        for s in slugs:
            label, node, parent = SECTIONS[s]
            png = figma_dir / f'{s}.png'
            entry['sections'].append({'section': label, 'slug': s, 'nodeId': node, 'parentNodeId': parent,
                                      'screenshotFile': f'_figma/{s}.png' if png.exists() else None})
            entry['fixes'].extend(f for f in fixes if f['section'] == s)
        log['pages'][name] = entry
    (OUT / '_export-log.json').write_text(json.dumps(log, indent=2) + '\n')
    print(f'pages written; {len(fixes)} fixes; vars={len(variables)}; conflicts={conflicts}')


if __name__ == '__main__':
    main()
