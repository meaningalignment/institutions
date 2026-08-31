import { getSql } from "./db.server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToProjectUpdates(email: string, source: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalizedEmail) || normalizedEmail.length > 320) {
    throw new Error("Enter a valid email address.");
  }

  const cleanSource = source === "researchers" ? "researchers" : "curriculum";
  const sql = getSql();
  await sql`
    INSERT INTO institutions_project_updates (email, source)
    VALUES (${normalizedEmail}, ${cleanSource})
    ON CONFLICT (email) DO UPDATE SET
      source = EXCLUDED.source,
      updated_at = now()
  `;
}
