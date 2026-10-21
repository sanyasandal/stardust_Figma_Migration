// stardust:reskin Phase 4 renderer — about-us. Plan = mapping.md rows for this archetype (slot → module).
import { renderPage } from './page.mjs';

export const plan = {"s01":"M5"};
export const render = () => renderPage('about-us', plan);
if (import.meta.url === `file://${process.argv[1]}`) console.log(render());
