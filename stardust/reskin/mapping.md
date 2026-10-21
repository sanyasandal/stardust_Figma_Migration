# mapping.md — Fort Street HS content → oneAZ v3.2 donor modules

<!-- provenance: stardust:reskin Phase 3 · skills adobe/skills main cf07727 · read stardust/reskin/content-model/<8 slugs>/content-model.json (ordered-node counts per slot) + stardust/reskin/donor-modules.md (M1–M11) + stardust/reskin/donor-tokens.json + stardust/reskin/normalize/<slug>.mjs + source/pages/*.plain.html (block classes) · authored: every row, decided from slot anatomy vs module anatomy · synthesized: none -->

Module ids → `donor-modules.md`. "Band" = the source's `nsw-section--brand-dark/--invert/--off-white` background, rendered on the donor's grey `Supporting-1` panel (#ebefee) — the donor kit has no dark band. Chrome (header, breadcrumb, side-nav, footer) is outside the gate scope (`main`) → § Deltas.

## index (`/`) — 9 slots

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | full-image banner: h4 "Welcome to Fort Street High School", p (strong/em), CTA "Why Choose Us?", image | M3 | headline + lede + CTA + media = Home Hero Branded; heading level kept h4 (J1) | mapped |
| s02 | h2 + 3 list cards (image, linked title, p) | M5 | media + title + body = Teaser Card; 3 cards on the 2-up grid wrap (layout only) | mapped |
| s03 | off-white banner: h2 "Principal's message", 2 p, CTA, image | M4 | text + media + CTA = Teaser Text+Image, on band | mapped |
| s04 | columns: image, h2 "Fort Fest…", p, CTA | M4 | media + heading + body + CTA | mapped |
| s05 | invert columns: empty heading + h2 "School tours…", p, CTA, image | M4 | text + media + CTA, on band; empty heading carried (J2) | mapped |
| s06 | h2 "Quick links" + 6 list cards (image icon, linked title, p) | M5 | Teaser Card grid | mapped |
| s07 | invert banner: h2 "Ready to apply?", p, CTA, image | M4 | text + media + CTA, on band | mapped |
| s08 | columns: image, h2 "Key dates", p, CTA | M4 | media + heading + body + CTA | mapped |
| s09 | facebook feed: h2 + 3 × (image, p, link) | M5 | live feed → static media cards (transformation: every post's text, image, link carried) | mapped |

## about-us — 1 slot, split

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01-title | h1 "About us" | M6 | page title = Title+Text heading | mapped |
| s01-cards | 7 list cards (image, linked title, p) | M5 | Teaser Card grid | mapped |

## about-us/hsc-results — 3 slots, s01 split

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01-title | h1 "HSC results" | M6 | page title | mapped |
| s01-tables | 4 h2 + 5 h3 subsections, 7 `table no-header` blocks (75 cell paragraphs), 1 image | — (NM1) | tabular rows; donor kit has no table | new-module |
| s02 | band: h2 "HSC Distinguished Achievers", h3, 137 p (names) | M6 | heading + long prose, on band | mapped |
| s03 | 2 list cards (linked title, p) | M5 | related-links cards, no media | mapped |

## about-us/enrol — 8 slots

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | h1 + 4 p | M6 | title + prose | mapped |
| s02 | h3 "Need an interpreter?" lead-in + 2 accordion items (h2 labels, panels: p, lists, 6 links) | M9 | accordion; lead-in rendered M6-style above it | mapped |
| s03 | columns: h2 "Visit us before you enrol", p, image | M4 | text + media | mapped |
| s04 | band: h2 "Open Days", 3 h4 dates, 9 p, link | M6 | sub-headed prose, on band | mapped |
| s05 | h2 "Orientation Days" + 2 p | M6 | prose | mapped |
| s06 | embed: p + link | M6 | static capture is p + link; link as M10 text link | mapped |
| s07 | band: h2 "Ready to apply?", p, CTA | M8 | heading + text + action = CTA Banner | mapped |
| s08 | 2 list cards | M5 | related-links cards | mapped |

## learning-and-support/wellbeing — 7 slots, s02 split

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | h1 "Wellbeing", 2 p, image | M4 | text + media | mapped |
| s02-prose | h2/h3 headings, prose, lists of links | M6 | sub-headed prose | mapped |
| s02-tables | 2 `table no-header` blocks (staff rows) | — (NM1) | tabular rows | new-module |
| s02-acc | accordion items in the same container | M9 | accordion | mapped |
| s03 | h2 "Wellbeing Framework", 4 p, 5 li, image | M4 | text + list + media | mapped |
| s04 | 2 h3 accordion groups (panels: p, lists, 17 links) | M9 | accordion | mapped |
| s05 | h1 "Student Health" + accordion (9 p) | M9 | accordion; second h1 carried (J3) | mapped |
| s06 | band: h2, p, CTA | M8 | CTA Banner | mapped |
| s07 | 2 list cards | M5 | related-links cards | mapped |

## about-us/stories-and-highlights — 5 slots

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | h1, h2 "A year at our school", 14 gallery items (3 images, captions) incl. pager labels | M5 | gallery slides → static Teaser Card grid (transformation); pager labels carried as text (J4) | mapped |
| s02 | off-white band: 4 p | M6 | prose, on band | mapped |
| s03 | facebook feed: h2 + 3 × (image, p, link) + p | M5 | feed → static media cards | mapped |
| s04 | band: h2, p, CTA | M8 | CTA Banner | mapped |
| s05 | 2 list cards | M5 | related-links cards | mapped |

## about-us/policies-and-reports — 7 slots

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | h1, 2 p, image | M4 | text + media | mapped |
| s02 | planningreporting: h2, 2 p, 6 li, 2 document links | M6 | prose + list; links as M10 text links | mapped |
| s03 | planningreporting: h2, 5 p, 2 li, 3 links | M6 | same | mapped |
| s04 | h2, 2 p, link | M6 | prose | mapped |
| s05 | h2 "School policies" + accordion (13 li, 6 links) | M9 | accordion | mapped |
| s06 | band: h2, p, CTA | M8 | CTA Banner | mapped |
| s07 | 2 list cards | M5 | related-links cards | mapped |

## school-life/events — 8 slots

| # | Content | Donor module | Rationale | Status |
|---|---|---|---|---|
| s01 | h1 "Events", 3 p, 9 li, link | M6 | title + prose + list | mapped |
| s02 | h2 "Important Calendar Dates…" + `table bordered` (22 cell paragraphs) | — (NM1) | tabular rows | new-module |
| s03 | h2 "Featured events", p, link | M6 | prose | mapped |
| s04 | off-white: 14 × (image, h3, date/time p) | M7 | media + title + meta rows = Listing Card | mapped |
| s05 | band: h2, p, CTA | M8 | CTA Banner | mapped |
| s06 | off-white columns: image, h2 "Key dates", p, CTA | M4 | text + media + CTA, on band | mapped |
| s07 | facebook feed: h2 + 3 × (image, p, link) + p | M5 | feed → static media cards | mapped |
| s08 | 2 list cards | M5 | related-links cards | mapped |

## Stats

- Content slots (incl. brief-level splits): **52** across 8 archetypes. `chrome`: 0 inside `main` (all chrome is outside the gate scope). `carried-invisible`: 0.
- `mapped`: **49** · `new-module`: **3** (all NM1) → **mapped ratio 94.2 %** (gate ≥ 80 % — PASS).
- Module use: M3 ×1, M4 ×10, M5 ×13, M6 ×14, M7 ×1, M8 ×5, M9 ×5 (= 49). M1/M2/M11 are chrome; M10 is the button/link spec used inside every module.
- New-modules list: **NM1 Data table**.

## New modules

**NM1 — Data table** (hsc-results s01-tables, wellbeing s02-tables, events s02). Composes donor tokens only:
- cells: Inter body 16/24, `bodyFg` #3c4242; header-less (`no-header`) rows; `bordered` variant → 1px `#ebefee` (Supporting-1) rules;
- row padding `--space-sm` 16px / cell gap 24px; container `maxWidth` 1180px; no radius (media radius 0), no shadow;
- sub-headings h2/h3 use the M6 heading scale (Lexia 36/40 / 26/34, `headingFg` #830051).
Cell text is emitted from the `ordered` paragraph nodes in source order; the renderer lays rows out as a 2-column CSS grid, never re-typing a cell.

## Casing / text-transform policy

Captured text is rendered-case; the renderer never edits case. The source applies no `text-transform` to body copy; donor eyebrows (18/28/700) are sentence-case — no collision. Casing, if any, via CSS only.

## Icon-ligature text

Material Icons ligatures (`east`, `chevron_right`, `expand_more` …) → **normalized away** by ledger entry **N2** (strip `.material-icons` on the source side); the renderer emits no ligature text. Arrows on cards/links are drawn by CSS (donor link-arrow), carrying no text.

## Deltas

| id | kind | what | carried | why out of gate scope |
|---|---|---|---|---|
| D1 | chrome | NSW header + mega-nav → M1 oneAZ Header (94px, logo left, nav right) | every top-nav label + href from `source/nav.plain.html` | outside `main` |
| D2 | chrome | NSW breadcrumb → M2 Breadcrumb | crumb labels + hrefs | outside `main` |
| D3 | chrome | left in-section side-nav → **dropped** | every side-nav href already present in header nav (verified live on enrol/wellbeing/events: `missingFromNav = []`) | outside `main`; donor has no side-nav module |
| D4 | chrome | NSW footer → M11 oneAZ Footer | footer link columns + acknowledgement text from `source/footer.plain.html` | outside `main` |
| N1 | normalize | accordion panels: remove `hidden="until-found"`, set `aria-expanded=true` | panel text enters the byte gate | live panels are collapsed; text exists in DOM |
| N2 | normalize | strip `.material-icons` spans | — (icon ligature names removed) | aria-hidden glyph names, not content |

## Judgment calls

- **J1** index has no h1 (first heading is an h4 in the hero). Carried as h4 — fidelity over repair. **Flag:** source SEO/a11y defect.
- **J2** index s05 has an empty heading element. Carried empty. **Flag.**
- **J3** wellbeing s05 "Student Health" is a second h1. Carried. **Flag.**
- **J4** stories s01 gallery pager labels ("1", "2") are captured list items; carried as text in a small pager row under the card grid.
- **J5** Bands: source dark/plum (`brand-dark`, `invert`) and `off-white` bands all render on donor Supporting-1 grey #ebefee with dark text — the oneAZ kit defines no dark section; inverted white text would be a third design system.
- **J6** 3-up and 6/7-card grids: the donor Teaser Card is 2-up in Figma; renderer keeps 2-up at ≤1180px and allows 3-up ≥1200px only when the source grid was 3-up (layout, not content).
- **J7** Facebook feed → static cards: the live widget's three posts are captured as static text/image/link; the embed itself is not reproduced (dynamics: `static-snapshot`).
- **J8** Fonts: Lexia and Inter are not licensed/loaded in this repo; both fall back to the local sans stack. Sizes/weights/line-heights still follow donor tokens. Donor-probe compares `fontFamily` as the declared stack.
