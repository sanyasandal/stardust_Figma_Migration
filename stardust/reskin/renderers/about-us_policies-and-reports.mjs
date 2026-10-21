// stardust:reskin Phase 4 renderer — about-us_policies-and-reports. Plan = mapping.md rows for this archetype (slot → module).
import { renderPage } from './page.mjs';

export const plan = {"s01":"M4","s02":"M6","s03":"M6","s04":"M6","s05":"M9","s06":"M8","s07":"M5"};
export const render = () => renderPage('about-us_policies-and-reports', plan);
if (import.meta.url === `file://${process.argv[1]}`) console.log(render());
