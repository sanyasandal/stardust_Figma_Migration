// stardust:reskin Phase 4 renderer — about-us_enrol. Plan = mapping.md rows for this archetype (slot → module).
import { renderPage } from './page.mjs';

export const plan = {"s01":"M6","s02":"M9","s03":"M4","s04":"M6","s05":"M6","s06":"M6","s07":"M8","s08":"M5"};
export const render = () => renderPage('about-us_enrol', plan);
if (import.meta.url === `file://${process.argv[1]}`) console.log(render());
