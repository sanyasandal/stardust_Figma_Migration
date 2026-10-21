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
