"""Render report/benchmark-report.html from the recorded report artifacts.

Inputs (all in report/): benchmark-report.md, prompts.md, migration-steps.md,
fidelity.json, usage.json, tokens.json, screenshots/*.png.
Usage: python3 stardust/.work/fidelity/report_html.py
"""
import html
import json
import re
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[3]
R = ROOT / 'report'
OUT = R / 'benchmark-report.html'


def md(path):
    text = (R / path).read_text()
    text = re.sub(r'^# .*\n', '', text, count=1)
    out = markdown.markdown(text, extensions=['tables', 'fenced_code', 'sane_lists'])
    out = out.replace('href="prompts.md"', 'href="#prompts"')
    out = out.replace('href="migration-steps.md"', 'href="#steps"')
    out = out.replace('href="benchmark-report.md"', 'href="#top"')
    return out


def pct(v):
    return f'{v:.1f}'


def bar(v, cls):
    return f'<div class="bar"><span class="{cls}" style="width:{v:.1f}%"></span><b>{v:.1f}</b></div>'


fid = json.loads((R / 'fidelity.json').read_text())
usage = json.loads((R / 'usage.json').read_text())
tokens = json.loads((R / 'tokens.json').read_text())


def mean(key, sub=None, w=None):
    rows = [r for r in fid if w is None or r['w'] == w]
    vals = [(r[key][sub] if sub else r[key]) for r in rows]
    return sum(vals) / len(vals)


design = mean('design', 'fidelity')
design_strict = mean('design', 'fidelity_strict')
d1440 = mean('design', 'fidelity', 1440)
d390 = mean('design', 'fidelity', 390)
source = mean('source', 'fidelity')
source_strict = mean('source', 'fidelity_strict')
text = mean('text') * 100
lo = min(r['design']['fidelity'] for r in fid)
hi = max(r['design']['fidelity'] for r in fid)

tok_list = tokens['rows']
tok_pass = sum(1 for t in tok_list if t['pass'])
tok_total = len(tok_list)

PAGE = {'index': '/'}


def page_path(slug):
    return PAGE.get(slug, '/' + slug.replace('_', '/'))


rows = sorted(fid, key=lambda r: (page_path(r['slug']), -r['w']))
fid_rows = ''.join(
    f"<tr><td><code>{page_path(r['slug'])}</code></td><td>{r['w']}</td>"
    f"<td>{bar(r['design']['fidelity'], 'd')}</td>"
    f"<td>{pct(r['design']['fidelity_strict'])}</td>"
    f"<td>{bar(r['source']['fidelity'], 's')}</td>"
    f"<td>{bar(r['text'] * 100, 't')}</td>"
    f"<td>{r['design']['h_a']} / {r['design']['h_b']}</td></tr>"
    for r in rows)

tok_rows = ''.join(
    f"<tr><td>{html.escape(t['name'])}</td><td><code>{html.escape(t['figma'])}</code></td>"
    f"<td><code>{html.escape(t['eds'])}</code></td><td class=\"{'ok' if t['pass'] else 'bad'}\">"
    f"{'✓' if t['pass'] else '✗'}</td></tr>" for t in tok_list)

gallery = ''
for r in rows:
    slug, w = r['slug'], r['w']
    gallery += (
        f'<figure class="pair"><figcaption><b>{page_path(slug)}</b> @ {w}px — design '
        f"{pct(r['design']['fidelity'])} %, original→EDS {pct(r['source']['fidelity'])} %</figcaption>"
        f'<div class="shots">'
        f'<a href="screenshots/{slug}-{w}-target-vs-eds.png" target="_blank"><span>stardust target ↔ EDS</span>'
        f'<img loading="lazy" src="screenshots/{slug}-{w}-target-vs-eds.png" alt="{page_path(slug)} {w}px target vs EDS"></a>'
        f'<a href="screenshots/{slug}-{w}-source-vs-eds.png" target="_blank"><span>original ↔ EDS</span>'
        f'<img loading="lazy" src="screenshots/{slug}-{w}-source-vs-eds.png" alt="{page_path(slug)} {w}px original vs EDS"></a>'
        f'</div></figure>')

u = usage
elapsed_min = round((int(u['last_request'][11:13]) * 60 + int(u['last_request'][14:16]))
                    - (int(u['first_request'][11:13]) * 60 + int(u['first_request'][14:16])))
model_min = round(u['model_time_ms'] / 60000)
usage_rows = [
    ('Model', u['model'], 'recorded'),
    ('Model requests', f"{u['requests']:,} ({u['subagent_requests']} by sub-agents)", 'recorded'),
    ('Input tokens (total)', f"{u['input_tokens_total']:,}", 'recorded'),
    ('&nbsp;&nbsp;cache read', f"{u['cache_read_tokens']:,}", 'recorded'),
    ('&nbsp;&nbsp;cache write', f"{u['cache_write_tokens']:,}", 'recorded'),
    ('&nbsp;&nbsp;uncached', f"{u['uncached_input_tokens']:,}", 'recorded'),
    ('Output tokens', f"{u['output_tokens']:,} (incl. {u['reasoning_tokens']:,} reasoning)", 'recorded'),
    ('Cost — Copilot AI credits', f"{u['ai_credits']:,.1f}", 'recorded'),
    ('Cost — USD', f"≈ ${u['usd_estimate']['value']:.2f}", 'ESTIMATE — ' + u['usd_estimate']['basis']),
    ('Time — elapsed', f"{elapsed_min // 60} h {elapsed_min % 60} min ({u['first_request'][11:16]} → {u['last_request'][11:16]} UTC)", 'recorded'),
    ('Time — model', f"{model_min // 60} h {model_min % 60} min", 'recorded (sum of request durations)'),
    ('System prompt', 'not available', 'UNAVAILABLE — not exposed to the agent'),
]
usage_html = ''.join(
    f"<tr><td>{a}</td><td><b>{b}</b></td><td class=\"{'warn' if c.startswith(('ESTIMATE', 'UNAVAILABLE')) else ''}\">{html.escape(c)}</td></tr>"
    for a, b, c in usage_rows)

kpis = [
    ('Design fidelity', f'{design:.1f} %', f'stardust target ↔ EDS, shift-tolerant · range {lo:.1f}–{hi:.1f} · strict {design_strict:.1f} %'),
    ('Desktop / mobile', f'{d1440:.1f} / {d390:.1f} %', '1440 px / 390 px'),
    ('Original → EDS (visual)', f'{source:.1f} %', f'reskin changes the design on purpose · strict {source_strict:.1f} %'),
    ('Content (text) match', f'{text:.1f} %', 'original vs EDS &lt;main&gt; words'),
    ('Figma tokens', f'{tok_pass} / {tok_total}', 'computed EDS styles vs Figma'),
    ('Input tokens', f"{u['input_tokens_total'] / 1e6:.1f} M", f"cache read {u['cache_read_tokens'] / 1e6:.1f} M"),
    ('Output tokens', f"{u['output_tokens'] / 1e3:.0f} k", f"{u['reasoning_tokens'] / 1e3:.0f} k reasoning"),
    ('Cost', f"{u['ai_credits']:,.0f} credits", f"≈ ${u['usd_estimate']['value']:.0f} USD (estimate)"),
    ('Time', f"{elapsed_min // 60} h {elapsed_min % 60} min", f'elapsed · model {model_min // 60} h {model_min % 60} min'),
    ('Pages', '52 / 52', 'migrated · 54/54 DA docs delivered'),
]
kpi_html = ''.join(f'<div class="kpi"><small>{a}</small><strong>{b}</strong><em>{c}</em></div>' for a, b, c in kpis)

CSS = """
:root{--plum:#3c1053;--mag:#830051;--ink:#3c4242;--grey:#ebefee;--ok:#1a7f37;--warn:#9a6700}
*{box-sizing:border-box}body{margin:0;font:15px/1.55 Inter,system-ui,sans-serif;color:var(--ink);background:#fafafa}
header.top{background:var(--plum);color:#fff;padding:32px 40px}header.top h1{margin:0 0 6px;font:700 30px/1.2 Georgia,serif}
header.top p{margin:0;opacity:.85}header.top a{color:#fff}
nav.toc{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #ddd;padding:10px 40px;display:flex;gap:18px;flex-wrap:wrap}
nav.toc a{color:var(--mag);text-decoration:none;font-weight:600}
main{max-width:1240px;margin:0 auto;padding:24px 40px 80px}
h2{font:700 26px/1.2 Georgia,serif;color:var(--mag);margin:48px 0 14px;border-bottom:2px solid var(--grey);padding-bottom:6px}
h3{color:var(--plum);margin:28px 0 10px}
.kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin:20px 0}
.kpi{background:#fff;border:1px solid #e3e3e3;border-left:4px solid var(--mag);border-radius:6px;padding:14px 16px}
.kpi small{display:block;text-transform:uppercase;letter-spacing:.05em;font-size:11px;color:#777}
.kpi strong{display:block;font-size:26px;color:var(--plum);margin:4px 0}.kpi em{font-style:normal;font-size:12px;color:#666}
table{border-collapse:collapse;width:100%;background:#fff;margin:10px 0 20px;font-size:13.5px}
th,td{border:1px solid #e1e1e1;padding:6px 9px;text-align:left;vertical-align:top}th{background:var(--grey)}
td code,p code,li code{background:#f1f1f1;padding:1px 4px;border-radius:3px;font-size:12.5px}
.bar{position:relative;background:#eee;height:18px;border-radius:3px;min-width:120px}
.bar span{position:absolute;inset:0 auto 0 0;border-radius:3px}.bar b{position:relative;padding-left:6px;font-size:12px;line-height:18px}
.bar .d{background:#d9a3c4}.bar .s{background:#c7c7d9}.bar .t{background:#b6dcc0}
.ok{color:var(--ok);font-weight:700}.bad{color:#c00;font-weight:700}.warn{color:var(--warn);font-weight:600}
.pair{background:#fff;border:1px solid #e3e3e3;border-radius:6px;margin:0 0 18px;padding:12px}
.pair figcaption{margin-bottom:8px}.shots{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.shots a{display:block;max-height:520px;overflow:auto;border:1px solid #ddd;text-decoration:none;color:var(--ink)}
.shots span{position:sticky;top:0;display:block;background:var(--grey);padding:3px 8px;font-size:12px;font-weight:600}
.shots img{width:100%;display:block}
.md pre{background:#f4f4f4;padding:12px;overflow:auto;white-space:pre-wrap;font-size:12.5px;border-radius:4px}
.md blockquote{border-left:3px solid var(--mag);margin:0;padding:4px 14px;background:#fff}
.note{background:#fff8e6;border:1px solid #f0d58c;padding:10px 14px;border-radius:6px;font-size:13.5px}
@media (max-width:800px){main,header.top,nav.toc{padding-left:16px;padding-right:16px}.shots{grid-template-columns:1fr}}
"""

doc = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Benchmark report — Fort Street HS → AEM EDS (oneAZ v3.2)</title><style>{CSS}</style></head>
<body id="top">
<header class="top"><h1>Benchmark report — Fort Street High School → AEM EDS</h1>
<p>Reskinned to Figma oneAZ v3.2 with stardust (adobe/skills <code>main</code>) · branch <code>fs-oneaz</code> ·
<a href="https://fs-oneaz--stardust-figma-migration--sanyasandal.aem.page/fortstreet/">EDS preview</a> ·
<a href="https://fortstreet-h.schools.nsw.gov.au/">original site</a></p></header>
<nav class="toc"><a href="#summary">Summary</a><a href="#fidelity">Fidelity</a><a href="#screens">Screenshots</a>
<a href="#usage">Tokens · cost · time</a><a href="#full">Blocks &amp; full report</a><a href="#prompts">Prompts</a><a href="#steps">Steps</a></nav>
<main>
<h2 id="summary">Results at a glance</h2>
<div class="kpis">{kpi_html}</div>
<p class="note">All values are recorded measurements except where marked <b>ESTIMATE</b> or <b>UNAVAILABLE</b>.
Usage was queried from the Copilot CLI session store at {u['queried_at']}; it covers the whole session (including the superseded first run) and excludes turns after that time.</p>

<h2 id="fidelity">1. Fidelity</h2>
<p>Composite per page and viewport: 40 % structure (SSIM) + 20 % pixel + 20 % colour-histogram + 20 % page-length ratio, same viewport for every pair (1440×900, 390×844).
<b>Design</b> = stardust reskin target ↔ EDS page (headline, shift-tolerant SSIM). <b>Original→EDS</b> is low by design: a reskin replaces the original look.</p>
<table><thead><tr><th>Page</th><th>Viewport</th><th>Design %</th><th>Design strict %</th><th>Original→EDS %</th><th>Text match %</th><th>Height target / EDS (px)</th></tr></thead>
<tbody>{fid_rows}<tr><th>Mean</th><th></th><th>{design:.1f}</th><th>{design_strict:.1f}</th><th>{source:.1f}</th><th>{text:.1f}</th><th></th></tr></tbody></table>
<h3>Figma token conformance (EDS home, 1440) — {tok_pass}/{tok_total}</h3>
<table><thead><tr><th>Token</th><th>Figma</th><th>EDS computed</th><th></th></tr></thead><tbody>{tok_rows}</tbody></table>

<h2 id="screens">2. Screenshot comparisons</h2>
<p>Each image is a side-by-side (left ↔ right) at the same viewport. Scroll inside a panel or click to open full size.</p>
{gallery}

<h2 id="usage">3. Token usage, cost and time</h2>
<table><thead><tr><th>Metric</th><th>Value</th><th>Status / source</th></tr></thead><tbody>{usage_html}</tbody></table>

<h2 id="full">4. Blocks and full report</h2>
<p>The full benchmark report follows: how the blocks are formed (§ 3), key differences, delivery/QA, deviations and artefacts.</p>
<div class="md">{md('benchmark-report.md')}</div>

<h2 id="prompts">5. Prompts (verbatim)</h2>
<div class="md">{md('prompts.md')}</div>

<h2 id="steps">6. Migration steps</h2>
<div class="md">{md('migration-steps.md')}</div>
</main></body></html>
"""
OUT.write_text(doc)
print(f'wrote {OUT.relative_to(ROOT)} ({len(doc) // 1024} KB); design {design:.1f} %, source {source:.1f} %, text {text:.1f} %, tokens {tok_pass}/{tok_total}')
