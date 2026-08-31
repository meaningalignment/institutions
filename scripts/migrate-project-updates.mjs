import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS institutions_project_updates (
    email text PRIMARY KEY,
    source text NOT NULL CHECK (source IN ('curriculum', 'researchers')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;

const rows = await sql`
  SELECT count(*)::integer AS subscriber_count
  FROM institutions_project_updates
`;
console.log(JSON.stringify(rows[0], null, 2));
