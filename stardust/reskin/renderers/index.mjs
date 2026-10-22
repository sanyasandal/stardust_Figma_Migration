// stardust:reskin Phase 4 renderer — index. Plan = mapping.md rows for this archetype (slot → module).
import { renderPage } from './page.mjs';

export const plan = {"s01":"M3","s02":"M5","s03":"M4","s04":"M4","s05":"M4","s06":"M5","s07":"M4","s08":"M4","s09":"M5"};
export const render = () => renderPage('index', plan);
if (import.meta.url === `file://${process.argv[1]}`) console.log(render());
