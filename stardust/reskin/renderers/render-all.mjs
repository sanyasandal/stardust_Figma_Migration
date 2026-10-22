// stardust:reskin Phase 4 — render every archetype; one failure does not hide the others.
const slugs = ["index","about-us","about-us_hsc-results","about-us_enrol","learning-and-support_wellbeing","about-us_stories-and-highlights","about-us_policies-and-reports","school-life_events"];
let bad = 0;
for (const s of slugs) {
  try { const m = await import(`./${s}.mjs`); console.log('OK  ', m.render()); }
  catch (e) { bad++; console.log('FAIL', s, e.message); }
}
process.exit(bad ? 1 : 0);
