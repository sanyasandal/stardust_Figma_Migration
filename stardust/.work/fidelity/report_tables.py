"""Regenerates the fidelity tables in report/benchmark-report.md(.new) from report/fidelity.json + tokens.json."""
import json, statistics as st, sys, re
R = sys.argv[1]
F = json.load(open('report/fidelity.json')); T = json.load(open('report/tokens.json'))
def agg(key, sub, w=None):
    v = [r[key][sub] if sub else r[key] for r in F if w is None or r['w'] == w]
    return st.mean(v), min(v), max(v)
def fmt(t, pct=1): m, a, b = t; return f"**{m*pct:.1f} %** (range {a*pct:.1f}–{b*pct:.1f})"
d = agg('design', 'fidelity'); d14 = agg('design', 'fidelity', 1440); d39 = agg('design', 'fidelity', 390)
ds = agg('design', 'fidelity_strict'); s = agg('source', 'fidelity'); ss = agg('source', 'fidelity_strict'); tx = agg('text', None)
dc = agg('design', 'colour'); sc = agg('source', 'colour')
tp = sum(r['pass'] for r in T['rows']); tn = len(T['rows'])
r = open(R).read()
rows = ["| Page | Viewport | Design % | Design strict % | Original→EDS % | Colour overlap (orig/EDS) | Text match % | Side-by-sides |", "|---|---|---|---|---|---|---|---|"]
for x in sorted(F, key=lambda x: (x['slug'], -x['w'])):
    p = '/' + x['slug'].replace('_', '/') if x['slug'] != 'index' else '/'
    rows.append(f"| `{p}` | {x['w']} | {x['design']['fidelity']:.1f} | {x['design']['fidelity_strict']:.1f} | {x['source']['fidelity']:.1f} | {x['source']['colour']:.2f} | {x['text']*100:.1f} | [target↔EDS](screenshots/{x['slug']}-{x['w']}-target-vs-eds.png) · [orig↔EDS](screenshots/{x['slug']}-{x['w']}-source-vs-eds.png) |")
rows.append(f"| **Mean** | | **{d[0]:.1f}** | {ds[0]:.1f} | {s[0]:.1f} | {sc[0]:.2f} | {tx[0]*100:.1f} | |")
tok = ["| Token | Selector | Figma | EDS | Pass |", "|---|---|---|---|---|"] + [f"| {t['name']} | `{t['selector']}` | {t['figma']} | {t['eds']} | {'✅' if t['pass'] else '❌'} |" for t in T['rows']]
detail = "### 2.2 Per page and viewport\n\n" + "\n".join(rows) + "\n\n### 2.3 Figma token conformance (EDS home, 1440)\n\n" + "\n".join(tok) + "\n\n"
r = re.sub(r"### 2\.2 Per page and viewport.*?(?=### 2\.4)", lambda m: detail, r, flags=re.S)
sub = {
 r"\| \*\*Fidelity — design \(stardust target vs EDS page\)\*\* \| [^|]+\|": f"| **Fidelity — design (stardust target vs EDS page)** | {fmt(d)} |",
 r"\| &nbsp;&nbsp;desktop 1440 / mobile 390 \| [^|]+\|": f"| &nbsp;&nbsp;desktop 1440 / mobile 390 | {d14[0]:.1f} % / {d39[0]:.1f} % |",
 r"\| &nbsp;&nbsp;strict variant \(full-page SSIM\) \| [^|]+\|": f"| &nbsp;&nbsp;strict variant (full-page SSIM) | {ds[0]:.1f} % (range {ds[1]:.1f}–{ds[2]:.1f}) |",
 r"\| \*\*Fidelity — original page vs EDS \(visual\)\*\* \| [^|]+\| [^|]+\|": f"| **Fidelity — original page vs EDS (visual)** | {fmt(s)} | *expected low: reskin replaces the design on purpose*; strict {ss[0]:.1f} % |",
 r"\| \*\*Fidelity — content \(original text vs EDS text\)\*\* \| [^|]+\|": f"| **Fidelity — content (original text vs EDS text)** | {fmt(tx,100)} |",
 r"\| Figma token conformance \(EDS computed styles\) \| [^|]+\|": f"| Figma token conformance (EDS computed styles) | **{tp} / {tn}** |",
}
for k, v in sub.items():
    r, n = re.subn(k, lambda m: v, r); assert n == 1, k
open(R, 'w').write(r)
print(f"design {d[0]:.1f} ({d[1]:.1f}-{d[2]:.1f}) 1440 {d14[0]:.1f} 390 {d39[0]:.1f} strict {ds[0]:.1f} ({ds[1]:.1f}-{ds[2]:.1f}) source {s[0]:.1f} ({s[1]:.1f}-{s[2]:.1f}) strict {ss[0]:.1f} text {tx[0]*100:.1f} colour d/s {dc[0]:.2f}/{sc[0]:.2f}")
