# Journal

- 10:39Z start. Branch renamed. Skills: stardust → reskin, figma-to-eds (web-kit donor).
- Figma: variables + design context for hero, teaser card, text+image, CTA banner, header, footer.
- Source: live EDS site captured via curl (`index`, `nav.plain.html`, `footer.plain.html`).
- DA: list empty; 5/8 media uploads succeeded to `.index/`; 3 blocked — stopped all DA writes, did not retry.
- Build: tokens in `styles/styles.css`; restyled header/footer/hero/cards/columns; new `banner`, `facebook-feed`.
- Content: `stardust/content/*` (DA-ready) + `drafts/fortstreet.html` (code-bus renderable).
- Lint: `npm ci --no-audit` denied; `npm ci` + `npm run lint` → 10 stylelint errors fixed → pass.
- Local server: `npx aem up` and `python -m http.server` denied → preview via pushed branch on aem.page.
