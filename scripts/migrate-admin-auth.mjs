import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS institutions_admin_login_codes (
    researcher_id integer PRIMARY KEY
      REFERENCES researchers(id) ON DELETE CASCADE,
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    sent_at timestamptz NOT NULL DEFAULT now(),
    attempts smallint NOT NULL DEFAULT 0
      CHECK (attempts >= 0)
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS institutions_admin_login_codes_expires_at_idx
  ON institutions_admin_login_codes (expires_at)
`;

const rows = await sql`
  SELECT count(*)::integer AS login_code_rows
  FROM institutions_admin_login_codes
`;
console.log(JSON.stringify(rows[0], null, 2));
