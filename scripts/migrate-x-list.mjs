// Adds the columns the X list admin tab needs to keep the People tab in step
// with the X list. Additive only, so the ecosystem app's queries keep working.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);
// X's numeric user id. Handles change; ids don't.
await sql`ALTER TABLE researchers ADD COLUMN IF NOT EXISTS x_user_id text`;
// What the app wants: set by the "On X list" checkbox on the People tab.
await sql`
  ALTER TABLE researchers ADD COLUMN IF NOT EXISTS on_x_list boolean NOT NULL DEFAULT false
`;
// What X said at the end of the last sync. NULL means never synced, which the
// sync treats as "union both sides" rather than guessing who removed whom.
await sql`ALTER TABLE researchers ADD COLUMN IF NOT EXISTS x_list_seen boolean`;
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS researchers_handle_lower_key
  ON researchers (lower(handle)) WHERE handle <> ''
`;
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS researchers_x_user_id_key
  ON researchers (x_user_id) WHERE x_user_id IS NOT NULL
`;

const rows = await sql`
  SELECT
    count(*)::integer AS researchers,
    count(*) FILTER (WHERE on_x_list)::integer AS on_x_list,
    count(*) FILTER (WHERE x_user_id IS NOT NULL)::integer AS with_x_user_id
  FROM researchers
`;
console.log(JSON.stringify(rows[0], null, 2));
