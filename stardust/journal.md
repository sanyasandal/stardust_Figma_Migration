# Journal

- 10:39Z start. Branch renamed. Skills: stardust → reskin, figma-to-eds (web-kit donor).
- Figma: variables + design context for hero, teaser card, text+image, CTA banner, header, footer.
- Source: live EDS site captured via curl (`index`, `nav.plain.html`, `footer.plain.html`).
- DA: list empty; 5/8 media uploads succeeded to `.index/`; 3 blocked — stopped all DA writes, did not retry.
- Build: tokens in `styles/styles.css`; restyled header/footer/hero/cards/columns; new `banner`, `facebook-feed`.
- Content: `stardust/content/*` (DA-ready) + `drafts/fortstreet.html` (code-bus renderable).
- Lint: `npm ci --no-audit` denied; `npm ci` + `npm run lint` → 10 stylelint errors fixed → pass.
- Local server: `npx aem up` and `python -m http.server` denied → preview via pushed branch on aem.page.

---

## 2026-10-21T12:45:00Z — Re-run on stardust main only (reskin --donor-dir from Figma export)

**Prompt:** User asked to redo the migration with pure stardust main (no figma-to-eds), Figma as the design, and block-library-creator for the block library.

**Decisions:**
- Verified installed stardust == adobe/skills main cf07727; figma-to-eds came from PR-315 → dropped.
- Main reskin has no Figma adapter → Figma frames exported to static HTML (`stardust/reskin/donor-dir/`) → `--donor-dir`.
- Stopped the custom-converter DA upload (35/54 docs written); converter retired (direction.md R2).
- Setup per reskin § Setup: scripts copied byte-identical to `stardust/scripts/reskin/` + `stardust/scripts/diff/live-session.mjs`; Playwright resolvable; `stardust/.gitignore` installed.
- Phase 2: archetypes = index, about-us, about-us/hsc-results, about-us/enrol, learning-and-support/wellbeing, about-us/stories-and-highlights, about-us/policies-and-reports, school-life/events (cover all 9 source block types). Scope `main`, default ledger.

**Artifacts touched:**
- stardust/reskin/content-model/<8 slugs>/ — created
- stardust/reskin/normalize/<8 slugs>.mjs — created
- stardust/direction.md — updated (re-run section)

**Findings worth flagging:**
- about-us coverage ratio 0.455 is chrome (header nav, breadcrumb, left side-nav, footer) — page is one section; homepage has no `<h1>` at source.

**Open questions:**
- none

## reskin Phases 3–5 + scale-out — mapping, render, gates, 44 siblings (2026-10-21)

**Prompt:** (hands-off continuation) "please use stardust and do the migration with figma using main stardust skills branch"

**Decisions:**
- Phase 3 `mapping.md`: 52 archetype slots → oneAZ modules M3–M9, 94.2% mapped; NM1 (data table) is the one unmapped shape, rendered as a token-styled table.
- Phase 4: per-archetype renderers read only the content model + mapping; CSS only from donor-tokens.json (`renderers/styles.mjs`).
- Phase 5: dom-equality / slot-coverage / donor-probe per page; one fix iteration = re-measure pages whose LIVE source had not settled (EDS decoration / Facebook feed). Stories residual: live Facebook feed text differs per load (dynamic).
- donor-probe spec overrides (`probe-specs/`) drop only assertions whose selector matches nothing on that page (homepage has no h1, about-us no h2, hsc-results no `.btn`); every value assertion kept.
- Scale-out: the mapping rules as code (`renderers/infer-plan.mjs`, reproduces all 48 archetype choices) render the 44 siblings; NM1 parser generalised for 3 sibling table shapes.

**Artifacts touched:**
- stardust/reskin/{mapping.md, renderers/, pages/, plans/, reports/, probe-specs/, canon.css} — created
- stardust/reskin/content-model/<44 siblings>/, normalize/<44>.mjs — created

**Open questions:**
- none

## render — migrate.mjs placed 52 pages (2026-10-21)

**Decisions:**
- state.json pages[] written (52; home ×1, content ×51). 8 archetypes advanced prototyped → approved (approvedBy hands-off); 44 siblings directed.
- `migrate.mjs render --all --canon-css stardust/reskin/canon.css --source <sib>=pages/<sib>.html --archetype <sib>=<nearest archetype by module-set Jaccard>` → 8 A + 44 A′, 0 refused. All 52 advanced to migrated.
- 6 broken internal links are broken on the live source too (e.g. /enrol, /contact-us.html) — kept verbatim (content fidelity), not "fixed".
- R3 applied: blocks/ + styles/ reset to boilerplate f787450; drafts/ removed.

**Artifacts touched:**
- stardust/migrated/** — created; stardust/state.json — pages[], migrate

**Open questions:**
- none

## phase-5-gates — all 52 pages gated (fix iteration 1 closed)

- Round 1 (`gate-one.sh`, xargs -P4): 32/52 all-pass. 16 donor-probe FAILs were all "selector matched nothing"
  (pages with no `.btn`/`h1`/`h2`) → per-page `probe-specs/<slug>.json` retargets only those checks; 15 pass.
- instrumental-music-program: capture was empty (source not decorated at capture time) → re-captured, re-rendered, pass.
- the-fort-street-museum: s03 cards captured empty → re-captured, pass.
- uniform-shop: rendered "(85%)" — a source table column-width hint the live block consumes → `flow.mjs` drops `(NN%)` tails; pass.
  Re-render of all 44 siblings changed only these two pages.
- foundation, newsletters, student-opportunities: the LIVE source serves `<img src="about:error">` (verified in `.plain.html`)
  → source-defect residual; the broken img is omitted at deploy (media-reconcile "omit").
- Ledger `stardust/reskin/ledger.json`: 49 pass, 3 pass-with-residual, 0 fail. `migrate.mjs` re-run: 52 placed, 0 refused.

## deploy + library + QA + fidelity — DA preview 54/54, block library, benchmark (2026-10-21)

**Prompt:** (continuing hands-off) deploy, block library via excat `block-library-creator`, fidelity, report.

**Decisions:**
- ENCODE (named deviation, `stardust/.work/deploy/encode.mjs`) → `content/fortstreet/**` 52 pages + nav + footer; sanitise.js on every file; davids-model-lint PASS; delivery-lint 0 P0.
- `deploy-batch.mjs --no-publish` on branch `fs-oneaz`: 54 ok, 0 failed (delivery verified on aem.page).
- Block library (excat skill, DA path): 8 blocks; metadata.json, samples (5 b1, 3 b2), blocks.json; config already pointed at it.
- Browser QA (52 pages @1440): blocks loaded, 0 broken images, 0 overflow; Brightcove iframe console errors are third-party.
- Fixes: hero media fill (CSS); ENCODE unwraps punctuation-only `<em>/<strong>` (DA round-tripped `<em>.</em>` as `*.*`) — 3 pages re-encoded and re-deployed.
- Fidelity measured three ways (target vs EDS, source vs EDS, text) + 17 Figma-token checks (17/17).

**Artifacts touched:**
- content/fortstreet/**, content/library/**, blocks/*/metadata.json, blocks/hero/hero.css
- report/{benchmark-report.md, prompts.md, migration-steps.md, fidelity.json, tokens.json, usage.json, screenshots/}

**Open questions:**
- Lexia licence (headings use Georgia fallback); publish to aem.live is the owner's call.

## fidelity follow-up — mobile overflow fix, final numbers (2026-10-21)

**Prompt:** "how many pages left?" — none; 52/52 migrated and on DA. Finishing the report.

**Decisions:**
- Fidelity pass found `/contact-us` overflowing at 390 px (unbreakable Maps URL inside a teaser): `teaser.css` gets `min-width:0` + `overflow-wrap:anywhere` on links; pushed, re-captured, re-measured (65.2 → 81.8 %).
- QA re-run at 390 and 768 on all 52 pages: 0 overflow, 0 broken images; Brightcove-iframe console noise on 2 pages only.
- `metrics.py` SSIM vectorised with numpy (same maths; 57 s instead of >10 min).
- Final: design fidelity 80.9 % (shift-tolerant), strict 69.9 %, original→EDS 57.8 % (reskin), text 97.0 %, tokens 17/17.

**Artifacts touched:**
- blocks/teaser/teaser.css, report/*, stardust/.work/{deploy/qa*.txt,fidelity/*}

## 2026 — Block library images fix

**Prompt:** "DA blocks does not have images ?"

- Cause: sample `<img>` pointed at `content.da.live/.../library/blocks/images/placeholder-*.png` (401 without auth; DA library panel loads them unauthenticated) and library docs had never been previewed.
- Fix: previewed 8 library docs + `blocks.json`; rewrote hero/cards/teaser/columns img src to public media-bus URLs (`media_1456c6…png` 16x9, `media_199335…png` 4x3); PUT to DA; re-previewed 4/4.

**Artifacts touched:**
- DA library/blocks/{hero,cards,teaser,columns}.html, content/library/blocks/*.plain.html, report/{benchmark-report,migration-steps}.md

## 2026 — Block library: real photos (correction to previous entry)

**Prompt:** "why images are not pushed into the block library ?"

- Correction: the previous entry blamed `content.da.live` 401s. DA sets an auth cookie for signed-in authors (`.gimme_cookie`), so DA-hosted images display; the 401 came from testing with an unauthenticated `curl`.
- Actual gap: the excat skill's samples carry generic placeholders only; no site photos were ever in the library.
- Fix: 9 real photos (from the same rows the samples were taken from) uploaded to DA `library/blocks/images/`, samples point at them via `content.da.live`, placeholders deleted, hero `<em>.</em>` removed, docs re-previewed; verified 9/9 images load on `main` and `fs-oneaz`.

**Artifacts touched:**
- DA library/blocks/{hero,cards,teaser,columns}.html + images/, content/library/blocks/**, report/{benchmark-report,migration-steps}.md, report/benchmark-report.html

## 2026 — Site root 404 fixed

**Prompt:** (screenshot) `main--stardust-figma-migration--sanyasandal.aem.page/` shows 404.

- Cause: the DA root `index.html` was the AEM boilerplate starter and had never been previewed; the migrated home page lives at `/fortstreet/`.
- Fix: saved the old root as a DA version, then replaced the root `index.html` with the Fort Street home page content (nav/footer still `/fortstreet/nav`, `/fortstreet/footer`) and previewed it on `main`.
- Its 3 social-feed images used signed `fbcdn.net` URLs that had expired, so the root preview failed to load them (`about:error`). Re-hosted the copies already ingested on `/fortstreet/` in DA `.index-images/` and pointed the page at them.
- Verified: 200, header/hero/cards/teaser/footer loaded, 18/18 images load.

**Artifacts touched:**
- DA index.html, DA .index-images/social-{1,2,3}.jpg, report/migration-steps.md
