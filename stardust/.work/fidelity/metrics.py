"""Fidelity metrics with PIL only (no numpy): blockwise SSIM + MAD similarity + text match."""
import json, sys, re, difflib, os
from PIL import Image, ImageOps, ImageChops, ImageStat

W = 240  # analysis width

def load(path, h=None):
    im = Image.open(path).convert('L')
    r = W / im.width
    im = im.resize((W, max(1, round(im.height * r))), Image.BILINEAR)
    return im

def pad(a, b):
    h = max(a.height, b.height)
    def p(x):
        c = Image.new('L', (W, h), 255); c.paste(x, (0, 0)); return c
    return p(a), p(b)

import numpy as np

def _blocks(arr, win):
    h, w = arr.shape
    h2, w2 = h - h % win, w - w % win
    return arr[:h2, :w2].reshape(h2 // win, win, w2 // win, win).swapaxes(1, 2).reshape(-1, win * win)

def ssim(a, b, win=8):
    """Blockwise SSIM over non-overlapping win x win windows (numpy-vectorised; same maths as the PIL version)."""
    C1, C2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    xa = _blocks(np.asarray(a, dtype=np.float64), win); xb = _blocks(np.asarray(b, dtype=np.float64), win)
    mx, my = xa.mean(1), xb.mean(1)
    vx, vy = xa.var(1), xb.var(1)
    cxy = ((xa - mx[:, None]) * (xb - my[:, None])).mean(1)
    v = ((2 * mx * my + C1) * (2 * cxy + C2)) / ((mx * mx + my * my + C1) * (vx + vy + C2))
    return float(v.mean())

def banded_ssim(a, b, band=8, search=40):
    """Shift-tolerant SSIM: each 8px band of A takes its best vertical match in B within +/-search px
    (analysis scale; 40px = ~240px at 1440). Penalises real differences, not accumulated drift."""
    A = np.asarray(a, dtype=np.float64); B = np.asarray(b, dtype=np.float64)
    vals = []
    for y in range(0, A.shape[0] - band + 1, band):
        ba = Image.fromarray(A[y:y + band].astype(np.uint8))
        best = 0.0
        for dy in range(-search, search + 1, 2):
            yy = y + dy
            if yy < 0 or yy + band > B.shape[0]: continue
            v = ssim(ba, Image.fromarray(B[yy:yy + band].astype(np.uint8)))
            if v > best: best = v
        vals.append(best)
    return sum(vals) / len(vals)

def mad_sim(a, b):
    d = ImageChops.difference(a, b)
    return 1 - ImageStat.Stat(d).mean[0] / 255

def colour_sim(pa, pb):
    """Colour-histogram intersection on RGB (palette fidelity)."""
    A = Image.open(pa).convert('RGB').resize((W, 300)).quantize(64).convert('RGB')
    B = Image.open(pb).convert('RGB').resize((W, 300)).quantize(64).convert('RGB')
    ha, hb = A.histogram(), B.histogram()
    s = 0
    for c in range(3):
        x, y = ha[c*256:(c+1)*256], hb[c*256:(c+1)*256]
        s += sum(min(i, j) for i, j in zip(x, y)) / sum(x)
    return s / 3

def text_sim(ta, tb):
    norm = lambda t: re.findall(r"[a-z0-9']+", t.lower())
    a, b = norm(ta), norm(tb)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    matched = sum(bl.size for bl in sm.get_matching_blocks())
    return matched / max(1, len(a)), len(a), len(b)

def compare(sa, sb, side_out=None, label=('A', 'B')):
    full_a, full_b = pad(load(sa), load(sb))
    fa, fb = load(sa.replace('.png', '-fold.png')), load(sb.replace('.png', '-fold.png'))
    fa, fb = pad(fa, fb)
    res = {
        'ssim_full': ssim(full_a, full_b), 'mad_full': mad_sim(full_a, full_b),
        'ssim_fold': ssim(fa, fb), 'mad_fold': mad_sim(fa, fb),
        'ssim_banded': banded_ssim(load(sa), load(sb)),
        'colour': colour_sim(sa, sb),
        'h_a': Image.open(sa).height, 'h_b': Image.open(sb).height,
    }
    res['height_ratio'] = min(res['h_a'], res['h_b']) / max(res['h_a'], res['h_b'])
    # composite fidelity: structure 40 (banded SSIM; strict variant uses full-page SSIM), pixel 20, colour 20, layout-length 20
    res['fidelity_strict'] = 100 * (0.4 * res['ssim_full'] + 0.2 * res['mad_full'] + 0.2 * res['colour'] + 0.2 * res['height_ratio'])
    res['fidelity'] = 100 * (0.4 * res['ssim_banded'] + 0.2 * res['mad_full'] + 0.2 * res['colour'] + 0.2 * res['height_ratio'])
    if side_out:
        A, B = Image.open(sa).convert('RGB'), Image.open(sb).convert('RGB')
        h = min(max(A.height, B.height), 6000)
        c = Image.new('RGB', (A.width + B.width + 20, h), (255, 255, 255))
        c.paste(A.crop((0, 0, A.width, min(A.height, h))), (0, 0))
        c.paste(B.crop((0, 0, B.width, min(B.height, h))), (A.width + 20, 0))
        if c.width > 1800:
            c = c.resize((1800, round(c.height * 1800 / c.width)), Image.LANCZOS)
        c.save(side_out, optimize=True)
    return res

if __name__ == '__main__':
    meta = json.load(open('capture-meta.json'))
    out = sys.argv[1] if len(sys.argv) > 1 else '../../../report/screenshots'
    os.makedirs(out, exist_ok=True)
    rows = []
    for slug, w in sorted({(m['slug'], m['w']) for m in meta}):
        f = lambda k: f'shots/{slug}-{w}-{k}.png'
        if not all(os.path.exists(f(k)) for k in ('source', 'target', 'eds')):
            continue
        r = {'slug': slug, 'w': w}
        r['design'] = compare(f('target'), f('eds'), f'{out}/{slug}-{w}-target-vs-eds.png')
        r['source'] = compare(f('source'), f('eds'), f'{out}/{slug}-{w}-source-vs-eds.png')
        r['text'], r['words_src'], r['words_eds'] = text_sim(open(f('source').replace('.png', '.txt')).read(), open(f('eds').replace('.png', '.txt')).read())
        rows.append(r)
        print(f"{slug:32} {w:5} design={r['design']['fidelity']:.1f}/{r['design']['fidelity_strict']:.1f} (bssim {r['design']['ssim_banded']:.3f}) source={r['source']['fidelity']:.1f}/{r['source']['fidelity_strict']:.1f} col={r['source']['colour']:.2f} text={100*r['text']:.1f}%")
    json.dump(rows, open('fidelity.json', 'w'), indent=1)
