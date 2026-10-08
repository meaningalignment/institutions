import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { redirect } from "react-router";
import { getSql } from "./db.server";
import { assertMailgunConfigured, sendLoginCodeEmail } from "./mailgun.server";
import { safeAdminRedirect } from "./auth";

const SESSION_COOKIE = "institutions_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_CODE_TTL_MINUTES = 10;
const MAX_CODE_ATTEMPTS = 5;

/** Signed cookie payload. `admin` is only a hint for nav links; gates re-check the DB. */
export interface SessionCookie {
  researcherId: number;
  name: string;
  email: string;
  admin?: boolean;
  expiresAt: number;
}

/** A signed-in researcher, re-validated against the DB on each request. */
export interface SignedInResearcher {
  researcherId: number;
  name: string;
  email: string;
  handle: string;
  /** False when they signed in with a tentative (not yet confirmed) email. */
  emailConfirmed: boolean;
  isAdmin: boolean;
}

interface LoginResearcher {
  id: number;
  name: string;
  email: string | null;
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }
  return secret;
}

function signature(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function isSecureRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}

function sessionCookie(token: string, request: Request) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    isSecureRequest(request) ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie(request: Request) {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    isSecureRequest(request) ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function createSessionCookie(
  researcher: { id: number; name: string; email: string; admin: boolean },
  request: Request
) {
  const payload: SessionCookie = {
    researcherId: researcher.id,
    name: researcher.name,
    email: researcher.email,
    admin: researcher.admin,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return sessionCookie(`${encoded}.${signature(encoded)}`, request);
}

/** Cookie-only read (no DB). Use for cheap UI hints, never for authorization. */
export function getSessionCookie(request: Request): SessionCookie | null {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const [encoded, suppliedSignature, ...extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra.length) return null;

  try {
    if (!signaturesMatch(suppliedSignature, signature(encoded))) return null;
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as Partial<SessionCookie>;
    if (
      !Number.isInteger(payload.researcherId) ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload as SessionCookie;
  } catch {
    return null;
  }
}

/**
 * The signed-in researcher, or null. The cookie's email must still be the record's
 * email or one of its tentative emails; admin status is read fresh from the DB.
 */
export async function getSignedInResearcher(
  request: Request
): Promise<SignedInResearcher | null> {
  const session = getSessionCookie(request);
  if (!session) return null;
  const email = session.email.toLowerCase();
  const sql = getSql();
  const rows = (await sql`
    SELECT r.id, r.name, r.handle,
      (r.email IS NOT NULL AND lower(r.email) = ${email}) AS confirmed,
      EXISTS (
        SELECT 1 FROM institutions_tentative_emails t
        WHERE t.researcher_id = r.id AND t.email = ${email}
      ) AS tentative,
      EXISTS (
        SELECT 1 FROM institutions_admins a WHERE a.researcher_id = r.id
      ) AS admin
    FROM researchers r
    WHERE r.id = ${session.researcherId}
    LIMIT 1
  `) as any[];
  const row = rows[0];
  if (!row || (!row.confirmed && !row.tentative)) return null;
  return {
    researcherId: row.id,
    name: row.name ?? "",
    email: session.email,
    handle: row.handle ?? "",
    emailConfirmed: row.confirmed,
    // Admin rights need the record's own email, never a self-supplied tentative one.
    isAdmin: row.admin && row.confirmed,
  };
}

function loginRedirect(request: Request): never {
  const url = new URL(request.url);
  const redirectTo = safeAdminRedirect(`${url.pathname}${url.search}`);
  throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
}

/** Requires any signed-in researcher (confirmed or tentative email); otherwise sends them to /login and back. */
export async function requireSignedIn(request: Request) {
  const session = await getSignedInResearcher(request);
  if (!session) loginRedirect(request);
  return session;
}

/** Requires an admin (institutions_admins row + confirmed email); otherwise login or 403. */
export async function requireAdminSession(request: Request) {
  const session = await getSignedInResearcher(request);
  if (!session) loginRedirect(request);
  if (!session.isAdmin) {
    throw new Response("Admin access is limited to the research team.", { status: 403 });
  }
  return session;
}

/** The MAI team (who pick the monthly appreciation): confirmed @meaningalignment.org emails. */
export function isMaiTeam(session: SignedInResearcher | null | undefined) {
  return (
    !!session && session.emailConfirmed && /@meaningalignment\.org$/i.test(session.email.trim())
  );
}

export async function requireMaiTeam(request: Request) {
  const session = await requireAdminSession(request);
  if (!isMaiTeam(session)) throw new Response("Not found", { status: 404 });
  return session;
}

const COMMON_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "fastmail.com",
]);

/**
 * Obscure an address enough that the login page can't be used to harvest emails,
 * while its owner can still recognize it: "joe@example.org" → "j••@e••••••.org".
 * Common webmail domains are shown in full.
 */
export function maskEmail(email: string) {
  const [local, domain = ""] = email.split("@");
  const dots = (n: number) => "•".repeat(Math.max(2, Math.min(n, 8)));
  const maskedLocal = local.slice(0, 1) + dots(local.length - 1);
  if (COMMON_EMAIL_DOMAINS.has(domain.toLowerCase())) return `${maskedLocal}@${domain}`;
  const lastDot = domain.lastIndexOf(".");
  const name = lastDot > 0 ? domain.slice(0, lastDot) : domain;
  const tld = lastDot > 0 ? domain.slice(lastDot) : "";
  return `${maskedLocal}@${name.slice(0, 1)}${dots(name.length - 1)}${tld}`;
}

export interface LoginOption {
  id: number;
  name: string;
  handle: string;
  /** Masked record email; null when the record has none and the user must type one. */
  maskedEmail: string | null;
}

export async function getLoginOptions(): Promise<LoginOption[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, handle, email FROM researchers
    ORDER BY lower(COALESCE(name, '')), name
  `) as any[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    handle: row.handle ?? "",
    maskedEmail: row.email ? maskEmail(row.email) : null,
  }));
}

function loginCodeHash(researcherId: number, code: string) {
  return createHmac("sha256", sessionSecret())
    .update(`login-code:${researcherId}:${code}`)
    .digest("hex");
}

export class LoginError extends Error {}

/**
 * Send a sign-in code for a researcher: to the record's email when it has one, otherwise
 * to `typedEmail`, which becomes a tentative email once the code is verified.
 * Returns the masked address the code went to.
 */
export async function requestLoginCode(researcherId: number, typedEmail?: string) {
  sessionSecret();
  if (!import.meta.env.DEV) assertMailgunConfigured();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email FROM researchers WHERE id = ${researcherId} LIMIT 1
  `) as LoginResearcher[];
  const researcher = rows[0];
  if (!researcher) throw new LoginError("Choose who you are.");

  let target = researcher.email?.trim().toLowerCase() || "";
  if (!target) {
    target = (typedEmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      throw new LoginError("Enter a valid email address.");
    }
    const taken = (await sql`
      SELECT 1 FROM researchers
      WHERE id <> ${researcherId} AND email IS NOT NULL AND lower(email) = ${target}
      LIMIT 1
    `) as unknown[];
    if (taken.length) {
      throw new LoginError("That email belongs to another researcher. Choose that name instead.");
    }
  }

  const recent = (await sql`
    SELECT sent_at > now() - interval '60 seconds' AS throttled
    FROM institutions_admin_login_codes
    WHERE researcher_id = ${researcher.id}
  `) as { throttled: boolean }[];
  if (recent[0]?.throttled) {
    throw new LoginError("A code was just sent. Wait a minute before requesting another.");
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const codeHash = loginCodeHash(researcher.id, code);
  await sql`
    INSERT INTO institutions_admin_login_codes
      (researcher_id, code_hash, expires_at, sent_at, attempts, email)
    VALUES
      (
        ${researcher.id},
        ${codeHash},
        now() + make_interval(mins => ${LOGIN_CODE_TTL_MINUTES}),
        now(),
        0,
        ${target}
      )
    ON CONFLICT (researcher_id) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      sent_at = EXCLUDED.sent_at,
      attempts = 0,
      email = EXCLUDED.email
  `;

  if (import.meta.env.DEV) {
    // Local dev: print the code instead of emailing it, so any roster member can be tested.
    console.log(`\n  Sign-in code for ${researcher.name} <${target}>: ${code}\n`);
    return maskEmail(target);
  }

  try {
    await sendLoginCodeEmail({ code, name: researcher.name, to: target });
  } catch (error) {
    await sql`
      DELETE FROM institutions_admin_login_codes
      WHERE researcher_id = ${researcher.id} AND code_hash = ${codeHash}
    `;
    throw error;
  }
  return maskEmail(target);
}

/** Check a code; on success returns what the session cookie needs. */
export async function verifyLoginCode(researcherId: number, code: string) {
  const sql = getSql();
  const researchers = (await sql`
    SELECT r.id, r.name, r.email,
      EXISTS (SELECT 1 FROM institutions_admins a WHERE a.researcher_id = r.id) AS admin
    FROM researchers r
    WHERE r.id = ${researcherId}
    LIMIT 1
  `) as (LoginResearcher & { admin: boolean })[];
  const researcher = researchers[0];
  if (!researcher) return null;

  const attempts = (await sql`
    UPDATE institutions_admin_login_codes
    SET attempts = attempts + 1
    WHERE researcher_id = ${researcher.id}
      AND expires_at > now()
      AND attempts < ${MAX_CODE_ATTEMPTS}
    RETURNING code_hash, email
  `) as { code_hash: string; email: string | null }[];
  const stored = attempts[0];
  if (!stored) return null;

  const suppliedHash = loginCodeHash(researcher.id, code);
  if (!signaturesMatch(suppliedHash, stored.code_hash)) return null;

  await sql`
    DELETE FROM institutions_admin_login_codes
    WHERE researcher_id = ${researcher.id}
  `;

  const recordEmail = researcher.email?.trim().toLowerCase() || null;
  const email = stored.email || recordEmail;
  if (!email) return null;
  const confirmed = email === recordEmail;
  if (!confirmed) {
    await sql`
      INSERT INTO institutions_tentative_emails (researcher_id, email)
      VALUES (${researcher.id}, ${email})
      ON CONFLICT DO NOTHING
    `;
  }
  return {
    id: researcher.id,
    name: researcher.name,
    email,
    admin: researcher.admin && confirmed,
  };
}

export const loginCodePolicy = {
  attempts: MAX_CODE_ATTEMPTS,
  ttlMinutes: LOGIN_CODE_TTL_MINUTES,
};
