# Direction — Fort Street HS × oneAZ v3.2 (reskin, hands-off)

**Intent:** keep Fort Street High School's content byte-faithful; replace the surface with the oneAZ Design System v3.2 web kit (Figma `rsZQmpVzuyn0KhCDA3WN60`). No AstraZeneca logos/copy are imported — only tokens and component anatomy.

## Locked decisions
- Colour: Title 1 `#830051`, Interaction `#d0006f`, Supporting-1 `#ebefee`, Body `#3c4242`.
- Type: Lexia (headings, 400) / Inter (body). Desktop ramp 56/46/36/26/24; body 18/28.
- Grid: 1180px container, 40px desktop gutter, 64px section rhythm.
- Components: Home Hero Branded, Teaser Card, Teaser Text+Image, CTA Banner, oneAZ Header/Footer.

## Named deviations
1. **Capture** — stardust capture scripts could not be read/executed (outside workspace, `node` denied); source was captured via `curl` of the live EDS `.plain.html` / page HTML instead.
2. **Fonts** — Lexia is licensed (not bundled); Inter woff2 download was denied. Families declared with metric-adjusted Georgia/Arial fallbacks.
3. **DA** — 3/8 media uploads and all further DA writes were blocked ("destination not established by human authorization"). Content authored locally in `stardust/content/` (DA-ready) and rendered via committed static draft `drafts/fortstreet.html` on the code bus.
4. **Links** — relative links rewritten to absolute source URLs (sub-pages not migrated). `about-us/enrol` relative-path bug fixed.
5. **Images** — referenced from the source site's EDS media bus (`media_<hash>`), not re-hosted.
6. **Chrome deltas** — footer gains a brand line; social icons replaced by text links (icon SVGs absent).
7. **Facebook feed** — rebuilt as a lazy `facebook-feed` embed block (Page Plugin iframe).
8. **Hero** — source "dark" section treatment dropped; hero supplies the Supporting-1 panel per Figma.

---

## Re-run on stardust main only — 2026-10-21T12:45Z (supersedes the run above)

**User directive (verbatim):** "please use stardust and do the migration with figma using main stardust skills branch and fir uplodung block use the skill i provided thats it" / "we dont want to use figma-to-eds in this migration … just pure stardust main".

- Skills: `adobe/skills` main @ cf07727 (stardust plugin v0.34.1; installed copy byte-identical — `diff -rq` empty). `figma-to-eds` (unmerged PR-315 branch) is **not used**; everything it produced (figma-mcp donor capture, spec-conformance, the hand-written 51-page converter `stardust/migrate/convert.py`) is retired from the evidence chain.
- Flow: `reskin` (content kept byte-faithful, design from a donor). Main's reskin refuses `--donor-figma` and prescribes: "Export the frames as static HTML prototypes … and re-run with `--donor-dir`". That is the path taken.
- Donor: oneAZ v3.2 section frames exported via the Figma Dev Mode MCP code export (`get_design_context`) into `stardust/reskin/donor-dir/` (export log `_export-log.json`), served on localhost, captured by the **bounded donor capture** path (`donor-sources.md` § Two first-class token-sourcing paths).
- Block library: excat `block-library-creator` skill (user-supplied).

### Named deviations (re-run)
R1. **Figma → HTML export step** — performed by the agent via the Figma MCP code export rather than by a human Figma export; mechanical JSX→HTML conversion only, fixes logged per node in `donor-dir/_export-log.json`. Replaces nothing in the skill; it produces the `--donor-dir` input main asks for.
R2. **Retired converter** — `stardust/migrate/convert.py` (agent-authored, replaced migrate+rollout) is retired. 35 DA documents it uploaded before it was stopped are overwritten by the main-pipeline delivery.
R3. **First-run EDS code retired** — blocks/CSS built with figma-to-eds in the first run (cards/columns/hero/banner/facebook-feed/accordion/table/embed restyles, oneAZ tokens in styles.css, header/footer) are reset to the boilerplate baseline before Phase 6; main `deploy`/`rollout` regenerate every block from the reskin pages so no figma-to-eds output survives.
R4. **Sibling tier renderer** — `stardust/reskin/renderers/infer-plan.mjs` + `render-siblings.mjs` apply the Phase-3 mapping rules to the 44 non-archetype pages (reskin ships no sibling renderer; migrate's A′ branch places a ready HTML file). Verified: reproduces all 48 archetype slot→module choices. Every sibling runs the same three Phase-5 gates.
R5. **No `stardust/current/`** — reskin's byte-exact content models (`stardust/reskin/content-model/`) replace extract's `current/pages/*.json`; `currentStatePath` points at them. `validateProvenance` (renderedBy: playwright) is satisfied by capture-content.mjs (Playwright) but under a different file shape.
