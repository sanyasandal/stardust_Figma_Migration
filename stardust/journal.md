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
