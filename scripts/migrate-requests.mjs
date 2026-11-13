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
