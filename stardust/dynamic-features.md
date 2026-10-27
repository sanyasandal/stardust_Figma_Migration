<!-- provenance: stardust:rollout Phase B2 (dynamics Phases 1–3 inline, hands-off) · read: stardust/reskin/source/**/*.html (EDS block classes), stardust/reskin/pages/*.html · 2026-10-21 -->
# Dynamic features — Fort Street High School (fortstreet-h.schools.nsw.gov.au)

Detection: the source is an existing EDS site, so every dynamic surface is a named block class in the
authored `.plain.html` (`facebook-feed`, `embed`). No forms, search, listings/query-index, modals or
tag managers are authored on the 52 pages. Accordions (`nsw-accordion`) are rebuilt natively (M9 block).

## Listings contract
none — no listing blocks (events are authored prose/cards, not index-fed).

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | fb-feed | Facebook page feed ("Stay connected on our socials" / "Follow us on Facebook") | client-rendered, third-party API | index, about-us/stories-and-highlights, school-life/events, school-life/newsletters | static-snapshot | content (M5 cards) | needs-owner (Facebook page token / feed proxy) | interim | snapshot of posts settled at capture time; images re-hosted in DA media so fbcdn signed URLs cannot expire | **Assumption A1 (hands-off):** ship the snapshot; unfreeze when the owner supplies the feed endpoint → `facebook-feed` widget | `div.facebook-feed` in source; gate log "Loading Facebook posts..." |
| 2 | map | Google Maps place embed | embed (iframe) | contact-us, school-life/travel-to-school | embed-passthrough | embed block | self | delivered at Phase C | `embed` block turns the authored maps URL into a lazy iframe | — | `div.embed` → `google.com/maps/embed/v1/place?...` |
| 3 | video | Brightcove virtual-tour video | embed (player) | about-us/enrol, about-us/why-choose-us | embed-passthrough | embed block | self | delivered at Phase C | `embed` block turns the authored `bcove.video` URL into a lazy iframe | — | `div.embed` → `https://bcove.video/48Vdzel` |
| 4 | accordion | NSW accordion expand/collapse | client-only | 13 pages | rebuild-native | block (M9) | self | delivered at Phase C | `<details>`-free button toggle, authored rows kept editable | — | `nsw-accordion__button` |

## Decision batch
- Facebook feed (row 1): provide a Facebook Graph page token or a same-origin feed proxy to make the feed live
  again. Until then the captured snapshot ships (assumption A1).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | — | — |
