import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);

// Who may use /researchers/admin. Seeded once with the MAI team; managed from the People tab.
await sql`
  CREATE TABLE IF NOT EXISTS institutions_admins (
    researcher_id integer PRIMARY KEY REFERENCES researchers(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  INSERT INTO institutions_admins (researcher_id)
  SELECT id FROM researchers
  WHERE lower(email) LIKE '%@meaningalignment.org'
    AND NOT EXISTS (SELECT 1 FROM institutions_admins)
`;

// Emails a researcher proved they control at sign-in, for records with no email on file.
// Tentative until an admin confirms one into researchers.email.
await sql`
  CREATE TABLE IF NOT EXISTS institutions_tentative_emails (
    researcher_id integer NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,
    email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (researcher_id, email)
  )
`;

// The address a pending code was sent to (the record's email, or a typed tentative one).
await sql`
  ALTER TABLE institutions_admin_login_codes ADD COLUMN IF NOT EXISTS email text
`;

const rows = await sql`
  SELECT
    (SELECT count(*)::integer FROM institutions_admins) AS admins,
    (SELECT count(*)::integer FROM institutions_tentative_emails) AS tentative_emails
`;
console.log(JSON.stringify(rows[0], null, 2));
