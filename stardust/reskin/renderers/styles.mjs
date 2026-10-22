// stardust:reskin Phase 4 — page CSS, every value from donor-tokens.json (oneAZ v3.2). No text-transform anywhere (casing policy).
import { tokens as T } from './lib.mjs';

const P = T.palette; const Y = T.type; const L = T.layout; const B = T.buttons; const RD = T.radii;
const h = (k) => `font-family:${Y[k].fontFamily || Y.headingFamily};font-size:${Y[k].fontSize};line-height:${Y[k].lineHeight};font-weight:${Y[k].fontWeight};`;

export const css = `
:root{--page-bg:${P.pageBg};--heading-fg:${P.headingFg};--body-fg:${P.bodyFg};--muted-fg:${P.mutedFg};--accent:${P.accent};--accent-hover:${P.accentHover};--band-bg:${P.lightBandBg};--card-title-fg:${P.cardTitleFg};--border:${P.borderSubtle};--font-body:${Y.family};--font-heading:${Y.headingFamily};--container:${L.containerMaxWidth};--section-y:${L.sectionPaddingY};--radius-card:${RD.card};--radius-btn:${RD.button};--radius-media:${RD.media};--nav-h:${L.navHeight}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--page-bg);color:var(--body-fg);font-family:var(--font-body);font-size:${Y.body.fontSize};line-height:${Y.body.lineHeight};font-weight:${Y.body.fontWeight}}
img{display:block;max-width:100%;height:auto;border-radius:var(--radius-media)}
a{color:var(--accent)}
a:hover{color:var(--accent-hover)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.container{max-width:var(--container);box-sizing:content-box;margin:0 auto;padding:${L.containerPadding}}
main h1,main h2,main h3,main h4,main h5,main h6{color:var(--heading-fg);margin:0 0 16px}
main h1{${h('display')}}
main h2{${h('h2')}}
main h3{${h('h3')}}
main h4{${h('h4')}}
main h5,main h6{${h('h5')}}
main p{margin:0 0 16px}
main ul{margin:0 0 16px;padding-left:24px}
main li{margin:0 0 8px}
main section{padding:var(--section-y) 0}
main section.band{background:var(--band-bg)}
main .btn{display:inline-block;background:${B.primary.background};color:${B.primary.color};border:${B.primary.border};border-radius:${B.primary.borderRadius};padding:${B.primary.padding};font-family:var(--font-body);font-size:${B.primary.fontSize};line-height:${B.primary.lineHeight};font-weight:${B.primary.fontWeight};text-decoration:none}
main .btn:hover{background:var(--accent-hover);border-color:var(--accent-hover);color:${B.primary.color}}
main .cta-row{margin:24px 0 0}
main p.media{margin:0 0 24px}

/* M6 Title + Text */
.title-text .measure{max-width:880px}
.title-text h1{margin-bottom:24px}

/* M3 Home Hero Branded + M4 Teaser Text+Image */
.ti-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.ti-media img{width:100%;aspect-ratio:4/3;object-fit:cover}
main section.teaser-ti:nth-of-type(even) .ti-media{order:-1}

.hero .ti-grid{gap:0;align-items:stretch}
.hero .ti-body{background:var(--band-bg);padding:48px;display:flex;flex-direction:column;justify-content:center}
.hero .ti-body h1,.hero .ti-body h2,.hero .ti-body h3,.hero .ti-body h4{${h('display')}}
.hero .ti-body p{font-size:${Y.bodyLarge.fontSize};line-height:${Y.bodyLarge.lineHeight}}
.hero .ti-media img{height:100%;aspect-ratio:auto;min-height:420px}
main section.hero.band .ti-body{background:var(--page-bg)}

/* M5 Teaser Card (2-up) */
.teaser-cards .lead{max-width:880px;margin-bottom:24px}
.cards{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,1fr);gap:40px}
.cards .card{margin:0;background:var(--band-bg);border-radius:var(--radius-card);overflow:hidden;padding-bottom:24px}
.band .cards .card{background:var(--page-bg)}
.cards .card>img{width:100%;aspect-ratio:16/9;object-fit:cover;margin-bottom:24px}
.cards .card>:not(img){margin-left:24px;margin-right:24px}
.cards .card>a:not(.btn){display:block;font-family:var(--font-heading);font-size:${Y.h5.fontSize};line-height:${Y.h5.lineHeight};color:var(--card-title-fg);text-decoration:none;margin-bottom:12px}
.cards.cards-text .card{padding-top:24px}
.cards .card p a{color:var(--body-fg);text-decoration:none}
.pager{list-style:none;padding:0;margin:24px 0 0;display:flex;gap:8px;flex-wrap:wrap}
.pager li{margin:0;min-width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:${B.tertiary.border};border-radius:var(--radius-btn);font-weight:700}

/* M7 Listing Card */
.listing-cards{list-style:none;padding:0;margin:0;display:grid;gap:24px}
.listing-card{margin:0;display:grid;grid-template-columns:280px 1fr;gap:32px;background:var(--page-bg);border-radius:var(--radius-card);overflow:hidden}
.listing-card .lc-media img{width:100%;height:100%;aspect-ratio:4/3;object-fit:cover}
.listing-card .lc-body{padding:24px 24px 8px 0}
.listing-card h3{${h('h5')}color:var(--card-title-fg)}

/* M8 CTA Banner */
.cta-banner .cta-panel{max-width:780px;margin:0 auto;text-align:center}

/* M9 Accordion */
.accordion{border-top:1px solid var(--body-fg);margin:24px 0}
.acc-item{border-bottom:1px solid var(--body-fg)}
.acc-btn{all:unset;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;width:100%;padding:20px 0;cursor:pointer;${h('h4')}color:var(--heading-fg)}
.acc-btn::after{content:"";width:12px;height:12px;border-right:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(-135deg);flex:none;margin-left:16px}
.acc-btn[aria-expanded="false"]::after{transform:rotate(45deg)}
.acc-btn[aria-expanded="false"]+.acc-panel{display:none}
.acc-panel{padding:0 0 24px}

/* NM1 Data table — donor tokens only */
.nm1{overflow-x:auto;margin:0 0 32px}
.nm1 table{width:100%;border-collapse:collapse}
.nm1 td{padding:12px 16px 12px 0;border-bottom:1px solid var(--border);vertical-align:top}
.band .nm1 td{border-color:var(--page-bg)}
.nm1 td p{margin:0 0 4px}
.nm1-bordered td{border:1px solid var(--border);padding:12px 16px}

/* D1 header (M1) */
.site-header .utility{background:var(--band-bg);font-size:14px;line-height:16px}
.site-header .utility .container{display:flex;justify-content:space-between;gap:16px;padding-top:10px;padding-bottom:10px}
.site-header .utility a{color:var(--body-fg);text-decoration:none}
.mainnav{border-bottom:1px solid var(--border)}
.mainnav .container{min-height:var(--nav-h);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;color:var(--heading-fg);text-decoration:none;font-family:var(--font-heading);font-size:22px;line-height:28px}
.brand-mark{width:40px;height:40px;background:var(--heading-fg);border-radius:4px}
.nav-list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px 28px}
.nav-item{position:relative}
.nav-item>a{${h('nav')}color:var(--body-fg);text-decoration:none;display:block;padding:8px 0}
.nav-item>a:hover{color:var(--accent)}
.nav-drop{display:none;position:absolute;top:100%;left:0;z-index:10;min-width:260px;list-style:none;margin:0;padding:12px 0;background:var(--page-bg);border:1px solid var(--border);border-radius:var(--radius-card)}
.nav-item:hover .nav-drop,.nav-item:focus-within .nav-drop{display:block}
.nav-drop a{display:block;padding:6px 16px;font-size:14px;color:var(--body-fg);text-decoration:none}

/* D2 breadcrumb (M2) */
.breadcrumb{background:var(--band-bg);font-size:${Y.breadcrumb.fontSize};line-height:${Y.breadcrumb.lineHeight}}
.breadcrumb ol{list-style:none;margin:0;padding:14px 0;display:flex;flex-wrap:wrap;gap:8px}
.breadcrumb li+li::before{content:"›";margin-right:8px;color:var(--muted-fg)}
.breadcrumb a{color:${Y.breadcrumb.color};text-decoration:none}
.breadcrumb [aria-current]{color:${Y.breadcrumb.currentColor}}

/* D4 footer (M11) */
.site-footer{background:var(--band-bg);padding:48px 0;font-size:14px;line-height:20px}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
.site-footer h2{font-family:var(--font-heading);font-weight:400;font-size:18px;line-height:24px;color:var(--heading-fg);margin:0 0 12px}
.site-footer ul{list-style:none;margin:0;padding:0}
.site-footer li{margin:0 0 8px;overflow-wrap:anywhere}
.site-footer a{color:var(--body-fg)}

@media (max-width:900px){
  .ti-grid,.cards,.f-grid{grid-template-columns:1fr}
  main section.teaser-ti:nth-of-type(even) .ti-media{order:0}
  .listing-card{grid-template-columns:1fr;gap:0}
  .listing-card .lc-body{padding:24px}
  .hero .ti-body{padding:32px 24px}
  .hero .ti-media img{min-height:0;aspect-ratio:4/3}
  main h1,.hero .ti-body h1,.hero .ti-body h2,.hero .ti-body h3,.hero .ti-body h4{font-size:40px;line-height:44px}
  main h2{font-size:34px;line-height:40px}
  main h3{font-size:28px;line-height:34px}
  .container{padding:0 20px}
  main{overflow-wrap:anywhere}
}
`;
