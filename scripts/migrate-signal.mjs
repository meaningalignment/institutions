// Adds the Signal columns: the name someone goes by in the Signal group, shown
// on /researchers cards, and their Signal service id (ACI, not a phone number)
// so later syncs match exactly. Additive only. Filled from
// `node scripts/signal-members.mjs "<group>" --json`.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);
await sql`ALTER TABLE researchers ADD COLUMN IF NOT EXISTS signal_name text`;
await sql`ALTER TABLE researchers ADD COLUMN IF NOT EXISTS signal_aci text`;
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS researchers_signal_aci_key
  ON researchers (signal_aci) WHERE signal_aci IS NOT NULL
`;

const rows = await sql`
  SELECT
    count(*)::integer AS researchers,
    count(*) FILTER (WHERE signal_name IS NOT NULL)::integer AS with_signal_name
  FROM researchers
`;
console.log(JSON.stringify(rows[0], null, 2));
