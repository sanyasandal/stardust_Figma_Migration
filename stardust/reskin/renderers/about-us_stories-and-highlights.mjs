// stardust:reskin Phase 4 renderer — about-us_stories-and-highlights. Plan = mapping.md rows for this archetype (slot → module).
import { renderPage } from './page.mjs';

export const plan = {"s01":"M5","s02":"M6","s03":"M5","s04":"M8","s05":"M5"};
export const render = () => renderPage('about-us_stories-and-highlights', plan);
if (import.meta.url === `file://${process.argv[1]}`) console.log(render());
