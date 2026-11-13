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

// Vision tags for requests, each with a link to where the vision is written up.
// Separate from the grid's VISIONS constant so admins can add tags on /requests.
await sql`
  CREATE TABLE IF NOT EXISTS institutions_request_visions (
    id text PRIMARY KEY,
    label text NOT NULL,
    url text NOT NULL DEFAULT '',
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  INSERT INTO institutions_request_visions (id, label, url, position)
  VALUES ('fidelity', 'Telocracy', 'https://paxmachina.ai/telocracy', 0)
  ON CONFLICT (id) DO NOTHING
`;

// Links per request: a "case" for wanting the institution, a "project" designing
// it now, a "design", or a "test" report. The request's stage (design wanted /
// in design / designed / tested)
// follows from them. read_more_url is superseded: existing links become case
// papers once, then the column is no longer read.
await sql`
  CREATE TABLE IF NOT EXISTS institutions_request_papers (
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
  CREATE INDEX IF NOT EXISTS institutions_request_papers_request_idx
  ON institutions_request_papers (request_id)
`;
const [{ papers }] = await sql`SELECT count(*)::int AS papers FROM institutions_request_papers`;
if (papers === 0) {
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
      INSERT INTO institutions_request_papers (request_id, kind, title, url, position)
      VALUES (${r.id}, 'case', ${titleFor(r.read_more_url)}, ${r.read_more_url}, 0)
    `;
  }
  console.log(`Moved ${rows.length} read-more links into case papers.`);
}

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
