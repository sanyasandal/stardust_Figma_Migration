// stardust:reskin scale — sibling tier: each sibling's byte-exact content model rendered with the gated archetype
// module layouts; plan from infer-plan.mjs (the mapping.md rules). Writes pages/<slug>.html + plans/<slug>.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { R, loadModel } from './lib.mjs';
import { inferPlan } from './infer-plan.mjs';
import { renderPage } from './page.mjs';

const slugs = process.argv.slice(2).length ? process.argv.slice(2)
  : readFileSync(R('stardust/.work/reskin/siblings.txt'), 'utf8').split('\n').filter(Boolean);
mkdirSync(R('stardust/reskin/plans'), { recursive: true });
let bad = 0;
for (const s of slugs) {
  try {
    const plan = inferPlan(loadModel(s));
    writeFileSync(R(`stardust/reskin/plans/${s}.json`), `${JSON.stringify(plan)}\n`);
    renderPage(s, plan);
    console.log('OK  ', s, Object.values(plan).join(' '));
  } catch (e) { bad += 1; console.log('FAIL', s, e.message.slice(0, 200)); }
}
process.exit(bad ? 1 : 0);
