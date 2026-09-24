// (Re)creates resources_listing: one row per (field, work) in /resources page
// order, hidden works (no section) last. It's for browsing what the page shows
// in the Neon console; the app reads canonical_works directly. Prisma ignores
// views, so `bun run db:push` leaves it alone.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL);
await sql`
  CREATE OR REPLACE VIEW resources_listing AS
  SELECT f.field, w.section, w.year, w.title,
    array_to_string(w.authors, ', ') AS authors, w.venue, w.kind, w.url, w.id
  FROM canonical_works w
  CROSS JOIN LATERAL unnest(
    CASE WHEN cardinality(w.fields) = 0 THEN ARRAY[NULL::text] ELSE w.fields END
  ) AS f(field)
  ORDER BY f.field NULLS LAST,
    array_position(ARRAY['selected', 'field', 'background']::"ResourceSection"[], w.section) NULLS LAST,
    w.year DESC NULLS LAST, w.title`;
const [{ rows }] = await sql`SELECT count(*)::int AS rows FROM resources_listing`;
console.log(`resources_listing: ${rows} rows`);
