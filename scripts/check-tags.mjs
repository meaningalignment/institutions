// Verifies every researcher tag in the DB is either assigned to a research
// field or explicitly listed in UNASSIGNED_TAGS. Exact matching means a new
// tag no longer half-matches an unrelated field -- it matches nothing -- so
// this check is what surfaces tags that need classifying.
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import { RESEARCH_FIELDS, UNASSIGNED_TAGS, researchFieldsFor } from '../app/lib/research-fields.ts';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/^POSTGRES_URL=(.*)$/m)[1].trim().replace(/^["']|["']$/g, '');
const sql = neon(url);
const rows = await sql`select name, tags from researchers where tags is not null order by name`;

const norm = (t) => t.trim().toLowerCase();
const assigned = new Set(RESEARCH_FIELDS.flatMap((f) => f.tags.map(norm)));
const skipped = new Set(UNASSIGNED_TAGS.map(norm));

const counts = new Map();
for (const r of rows) for (const t of r.tags ?? []) counts.set(norm(t), (counts.get(norm(t)) ?? 0) + 1);

const unclassified = [...counts.entries()].filter(([t]) => !assigned.has(t) && !skipped.has(t)).sort((a, b) => b[1] - a[1]);
const dead = [...assigned].filter((t) => !counts.has(t)).sort();
const orphans = rows.filter((r) => researchFieldsFor({ name: r.name, tags: r.tags ?? [] }).length === 0);

console.log(`${counts.size} distinct tags across ${rows.length} people`);
for (const f of RESEARCH_FIELDS) {
  const n = rows.filter((r) => researchFieldsFor({ name: r.name, tags: r.tags ?? [] }).some((x) => x.id === f.id)).length;
  console.log(`  ${String(n).padStart(3)}  ${f.label}`);
}
if (dead.length) console.log(`\nField tags matching nobody (${dead.length}): ${dead.join(', ')}`);
if (orphans.length) console.log(`\nPeople in no field (${orphans.length}):\n${orphans.map((o) => `  ${o.name}`).join('\n')}`);
if (unclassified.length) {
  console.error(`\nUNCLASSIFIED TAGS (${unclassified.length}) -- add to a field or to UNASSIGNED_TAGS:`);
  for (const [t, c] of unclassified) console.error(`  ${c}  ${t}`);
  process.exit(1);
}
console.log('\nAll tags classified.');
