// Postgres access to the `ecosystem` researcher database via Neon's serverless
// HTTP driver (a good fit for Vercel serverless — no persistent connections).
// Server-only. The connection string comes from POSTGRES_URL (loaded from .env
// locally via dotenv; injected by Vercel in production).

import "dotenv/config";
import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

export function getSql(): ReturnType<typeof neon> {
  if (_sql) return _sql;
  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "POSTGRES_URL is not set. Add it to .env (local) or the Vercel project env (production)."
    );
  }
  _sql = neon(url);
  return _sql;
}
