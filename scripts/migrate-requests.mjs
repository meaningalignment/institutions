// Creates the tables behind /requests (requests for new institution designs)
// and, if the requests table is empty, seeds it from scripts/requests-seed.yaml.
// Idempotent: safe to run again.
import "dotenv/config";
import fs from "node:fs";
import yaml from "js-yaml";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");
const sql = neon(connectionString);

await sql`
  CREATE TABLE IF NOT EXISTS institutions_requests (
    id serial PRIMARY KEY,
    name text NOT NULL,
    vision text,
    row_id text NOT NULL,
    col_id text NOT NULL,
    site_hints text NOT NULL DEFAULT '',
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS institutions_request_sites (
    id serial PRIMARY KEY,
    request_id integer NOT NULL REFERENCES institutions_requests(id) ON DELETE CASCADE,
    name text NOT NULL DEFAULT '',
    instead text NOT NULL DEFAULT '',
    pain text NOT NULL DEFAULT '',
    success text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'wanted' CHECK (status IN ('wanted', 'building', 'trialing')),
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS institutions_request_sites_request_idx
  ON institutions_request_sites (request_id)
`;

// A short description of what needs to be built, and an optional link to read more.
await sql`ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT ''`;
await sql`ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS read_more_url text NOT NULL DEFAULT ''`;


// Links per request: a "case" for wanting the institution, a "project" designing
// it now, a "design", or a "test" report. The request's stage (design wanted /
// in design / designed / tested)
// follows from them. read_more_url is superseded: existing links become case
// links once, then the column is no longer read.
// The table was first created as institutions_request_papers; rename it once.
await sql`
  DO $$ BEGIN
    IF to_regclass('institutions_request_papers') IS NOT NULL
       AND to_regclass('institutions_request_links') IS NULL THEN
      ALTER TABLE institutions_request_papers RENAME TO institutions_request_links;
      ALTER INDEX IF EXISTS institutions_request_papers_request_idx RENAME TO institutions_request_links_request_idx;
    END IF;
  END $$
`;
await sql`
  CREATE TABLE IF NOT EXISTS institutions_request_links (
    id serial PRIMARY KEY,
    request_id integer NOT NULL REFERENCES institutions_requests(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('case', 'project', 'design', 'test')),
    title text NOT NULL,
    url text NOT NULL,
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS institutions_request_links_request_idx
  ON institutions_request_links (request_id)
`;
const [{ links }] = await sql`SELECT count(*)::int AS links FROM institutions_request_links`;
if (links === 0) {
  const titleFor = (url) => {
    if (url.includes("paxmachina.ai/telocracy/appendices")) return "Telocracy (appendices)";
    if (url.includes("paxmachina.ai/telocracy")) return "Telocracy";
    if (url.includes("2512.16856")) return "Distributional AGI Safety";
    if (url.includes("2509.10147")) return "Virtual Agent Economies";
    if (url.includes("model-integrity")) return "Model Integrity";
    if (url.includes("market-intermediaries")) return "Market Intermediaries";
    return url;
  };
  const rows = await sql`SELECT id, read_more_url FROM institutions_requests WHERE read_more_url <> ''`;
  for (const r of rows) {
    await sql`
      INSERT INTO institutions_request_links (request_id, kind, title, url, position)
      VALUES (${r.id}, 'case', ${titleFor(r.read_more_url)}, ${r.read_more_url}, 0)
    `;
  }
  console.log(`Moved ${rows.length} read-more links into case links.`);
}

// Several rows (scales), columns and lenses per request, and three 1–5 ranking
// scores. row_id / col_id / vision stay as the first row, first column and (no
// longer read) old single vision; the arrays are backfilled from them once.
await sql`ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS rows text[] NOT NULL DEFAULT '{}'`;
await sql`ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS cols text[] NOT NULL DEFAULT '{}'`;
await sql`ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS lenses text[] NOT NULL DEFAULT '{}'`;
for (const col of ["likely", "soon", "impact"]) {
  await sql.query(
    `ALTER TABLE institutions_requests ADD COLUMN IF NOT EXISTS ${col} smallint CHECK (${col} BETWEEN 1 AND 5)`
  );
}
await sql`UPDATE institutions_requests SET rows = ARRAY[row_id] WHERE rows = '{}'`;
await sql`UPDATE institutions_requests SET cols = ARRAY[col_id] WHERE cols = '{}'`;
await sql`
  UPDATE institutions_requests SET lenses = ARRAY[vision]
  WHERE lenses = '{}' AND vision IS NOT NULL AND vision <> ''
`;
await sql`UPDATE institutions_requests SET vision = NULL WHERE vision IS NOT NULL`;

// Lens tags for requests (first called visions), each with a link to where the
// lens is written up. Separate from the grid's VISIONS constant so admins can
// add them on /requests. Rename the old table once.
await sql`
  DO $$ BEGIN
    IF to_regclass('institutions_request_visions') IS NOT NULL
       AND to_regclass('institutions_request_lenses') IS NULL THEN
      ALTER TABLE institutions_request_visions RENAME TO institutions_request_lenses;
    END IF;
  END $$
`;
await sql`
  CREATE TABLE IF NOT EXISTS institutions_request_lenses (
    id text PRIMARY KEY,
    label text NOT NULL,
    url text NOT NULL DEFAULT '',
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  INSERT INTO institutions_request_lenses (id, label, url, position)
  VALUES ('fidelity', 'Telocracy', 'https://paxmachina.ai/telocracy', 0)
  ON CONFLICT (id) DO NOTHING
`;

const [{ count }] = await sql`SELECT count(*)::int AS count FROM institutions_requests`;
if (count === 0) {
  const seed = yaml.load(fs.readFileSync(new URL("./requests-seed.yaml", import.meta.url), "utf8"));
  const requests = seed?.requests ?? [];
  for (const [i, r] of requests.entries()) {
    await sql`
      INSERT INTO institutions_requests (name, vision, row_id, col_id, site_hints, position)
      VALUES (${r.name}, ${r.vision ?? null}, ${r.row}, ${r.column}, ${r.site_hints ?? ""}, ${i})
    `;
  }
  console.log(`Seeded ${requests.length} requests.`);
} else {
  console.log(`institutions_requests already has ${count} rows; not seeding.`);
}
console.log("Requests tables are ready.");
