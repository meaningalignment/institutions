import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is missing.");

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS institutions_gems (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'pending'
      CHECK (status IN ('approved', 'pending')),
    created_by integer REFERENCES researchers(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS institutions_appreciations (
    id serial PRIMARY KEY,
    sender_id integer REFERENCES researchers(id) ON DELETE SET NULL,
    recipient_id integer NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,
    note text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    picked_month date UNIQUE,
    flowers_sent_at timestamptz
  )
`;
// How the sender was identified: 'email' (signed in with the record's email),
// 'tentative' (signed in with an unconfirmed email), 'none' (picked their name, signed out).
// Existing rows predate signed-out sending, so they backfill as 'email'.
await sql`
  ALTER TABLE institutions_appreciations
  ADD COLUMN IF NOT EXISTS sender_verification text NOT NULL DEFAULT 'email'
    CHECK (sender_verification IN ('email', 'tentative', 'none'))
`;
await sql`
  ALTER TABLE institutions_appreciations ALTER COLUMN sender_verification SET DEFAULT 'none'
`;
// Appreciations are anonymous to the recipient unless the sender chose to sign.
await sql`
  ALTER TABLE institutions_appreciations
  ADD COLUMN IF NOT EXISTS signed boolean NOT NULL DEFAULT false
`;
await sql`
  CREATE INDEX IF NOT EXISTS institutions_appreciations_recipient_idx
  ON institutions_appreciations (recipient_id)
`;
await sql`
  CREATE INDEX IF NOT EXISTS institutions_appreciations_created_at_idx
  ON institutions_appreciations (created_at)
`;
await sql`
  CREATE TABLE IF NOT EXISTS institutions_appreciation_gems (
    appreciation_id integer NOT NULL
      REFERENCES institutions_appreciations(id) ON DELETE CASCADE,
    gem_id integer NOT NULL REFERENCES institutions_gems(id) ON DELETE CASCADE,
    PRIMARY KEY (appreciation_id, gem_id)
  )
`;

const seeds = [
  {
    slug: "earnest",
    name: "as Earnest",
    wasName: "Earnest",
    description:
      "Sincere about the work itself. Deeply curious about the hard, unglamorous parts of a problem, and would be in the field even if no one was watching or funding them.",
    // The original seed text; a live row still carrying it is updated below.
    was:
      "Sincere about the work itself. Not a careerist, social climber, or someone who says the right things to get grants.",
  },
  {
    slug: "epistemically-spacious",
    name: "as Epistemically Spacious",
    wasName: "Epistemically Spacious",
    description:
      "Gives you room to think. They lend clearness to your perspective even when they don't agree; your own view gets sharper in their company. The opposite of a reality-distortion field.",
    // The original seed text; a live row still carrying it is updated below.
    was:
      "The opposite of a reality-distortion field. They lend clearness to your perspective even when they don't agree; your own view gets sharper in their company.",
  },
  {
    slug: "firsthand-understanding",
    name: "for Firsthand Understanding",
    wasName: "Firsthand Understanding",
    description:
      "They read the primary sources, rederive the result, and build the model themselves to internalize its consequences. They don't settle for high-level overviews.",
    // The original seed text; a live row still carrying it is updated below.
    was:
      "Doing the actual work: reading the papers, following the details, sometimes doing the math yourself to internalize the models and their consequences. Not settling for high-level overviews.",
  },
  {
    slug: "taking-it-all-on",
    name: "for Taking It All On",
    wasName: "Taking It All On",
    description:
      "Refuses to shrink their thinking out of helplessness about the size of the problem. They ask not only what would be ideal but what could be legitimized with the public; not only what the equilibrium is but whether there are paths to it; they consider many kinds of agents, not one ideal model. They take responsibility for all the considerations bearing on whether their direction is any good.",
    // The original seed text; a live row still carrying it is updated below.
    was:
      "Refusing to shrink your thinking out of helplessness about the size of the problem. Asking not only what would be ideal but what could be legitimized with the public; not only what the equilibrium is but whether there are paths to it; considering many kinds of agents, not one ideal model. Taking responsibility for all the considerations bearing on whether your direction is any good.",
  },
];
for (const gem of seeds) {
  await sql`
    INSERT INTO institutions_gems (slug, name, description, status)
    VALUES (${gem.slug}, ${gem.name}, ${gem.description}, 'approved')
    ON CONFLICT (slug) DO NOTHING
  `;
  // Revised copy reaches an existing row only if nobody has edited it in the admin.
  await sql`
    UPDATE institutions_gems SET description = ${gem.description}
    WHERE slug = ${gem.slug} AND description = ${gem.was}
  `;
  // Likewise the name, which gained its leading "as" / "for".
  await sql`
    UPDATE institutions_gems SET name = ${gem.name}
    WHERE slug = ${gem.slug} AND name = ${gem.wasName}
  `;
}

const rows = await sql`
  SELECT
    (SELECT count(*)::integer FROM institutions_gems) AS gems,
    (SELECT count(*)::integer FROM institutions_appreciations) AS appreciations
`;
console.log(JSON.stringify(rows[0], null, 2));
console.table(await sql`SELECT slug, name, left(description, 60) AS description FROM institutions_gems ORDER BY id`);
