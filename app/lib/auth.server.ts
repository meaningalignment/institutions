import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { redirect } from "react-router";
import { getSql } from "./db.server";
import { assertMailgunConfigured, sendLoginCodeEmail } from "./mailgun.server";
import { safeAdminRedirect } from "./auth";

const SESSION_COOKIE = "institutions_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_CODE_TTL_MINUTES = 10;
const MAX_CODE_ATTEMPTS = 5;

export interface AdminSession {
  researcherId: number;
  name: string;
  email: string;
  expiresAt: number;
}

interface LoginResearcher {
  id: number;
  name: string;
  email: string;
  handle?: string | null;
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

export function createAdminSessionCookie(
  researcher: LoginResearcher,
  request: Request
) {
  const payload: AdminSession = {
    researcherId: researcher.id,
    name: researcher.name,
    email: researcher.email,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return sessionCookie(`${encoded}.${signature(encoded)}`, request);
}

export function getAdminSession(request: Request): AdminSession | null {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const [encoded, suppliedSignature, ...extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra.length) return null;

  try {
    if (!signaturesMatch(suppliedSignature, signature(encoded))) return null;
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as Partial<AdminSession>;
    if (
      !Number.isInteger(payload.researcherId) ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export async function getAuthorizedAdminSession(request: Request) {
  const session = getAdminSession(request);
  if (!session) return null;
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, handle
    FROM researchers
    WHERE id = ${session.researcherId}
      AND email IS NOT NULL
      AND lower(email) = ${session.email.toLowerCase()}
    LIMIT 1
  `) as LoginResearcher[];
  const researcher = rows[0];
  if (!researcher) return null;
  return {
    ...session,
    name: researcher.name,
    email: researcher.email,
    handle: researcher.handle ?? "",
  };
}

export async function requireAdminSession(request: Request) {
  const session = await getAuthorizedAdminSession(request);
  if (session) return session;
  const url = new URL(request.url);
  const redirectTo = safeAdminRedirect(`${url.pathname}${url.search}`);
  throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
}

function loginCodeHash(researcherId: number, code: string) {
  return createHmac("sha256", sessionSecret())
    .update(`login-code:${researcherId}:${code}`)
    .digest("hex");
}

export async function requestLoginCode(email: string) {
  // Validate configuration before looking up the address so a missing production
  // secret behaves the same for known and unknown researchers.
  sessionSecret();
  assertMailgunConfigured();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email
    FROM researchers
    WHERE email IS NOT NULL AND lower(email) = ${email}
    LIMIT 1
  `) as LoginResearcher[];
  const researcher = rows[0];
  if (!researcher) return;

  const recent = (await sql`
    SELECT sent_at > now() - interval '60 seconds' AS throttled
    FROM institutions_admin_login_codes
    WHERE researcher_id = ${researcher.id}
  `) as { throttled: boolean }[];
  if (recent[0]?.throttled) return;

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const codeHash = loginCodeHash(researcher.id, code);
  await sql`
    INSERT INTO institutions_admin_login_codes
      (researcher_id, code_hash, expires_at, sent_at, attempts)
    VALUES
      (
        ${researcher.id},
        ${codeHash},
        now() + interval '10 minutes',
        now(),
        0
      )
    ON CONFLICT (researcher_id) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      sent_at = EXCLUDED.sent_at,
      attempts = 0
  `;

  try {
    await sendLoginCodeEmail({
      code,
      name: researcher.name,
      to: researcher.email,
    });
  } catch (error) {
    await sql`
      DELETE FROM institutions_admin_login_codes
      WHERE researcher_id = ${researcher.id} AND code_hash = ${codeHash}
    `;
    throw error;
  }
}

export async function verifyLoginCode(
  email: string,
  code: string
): Promise<LoginResearcher | null> {
  const sql = getSql();
  const researchers = (await sql`
    SELECT id, name, email
    FROM researchers
    WHERE email IS NOT NULL AND lower(email) = ${email}
    LIMIT 1
  `) as LoginResearcher[];
  const researcher = researchers[0];
  if (!researcher) return null;

  const attempts = (await sql`
    UPDATE institutions_admin_login_codes
    SET attempts = attempts + 1
    WHERE researcher_id = ${researcher.id}
      AND expires_at > now()
      AND attempts < ${MAX_CODE_ATTEMPTS}
    RETURNING code_hash
  `) as { code_hash: string }[];
  const storedHash = attempts[0]?.code_hash;
  if (!storedHash) return null;

  const suppliedHash = loginCodeHash(researcher.id, code);
  if (!signaturesMatch(suppliedHash, storedHash)) return null;

  await sql`
    DELETE FROM institutions_admin_login_codes
    WHERE researcher_id = ${researcher.id}
  `;
  return researcher;
}

export const loginCodePolicy = {
  attempts: MAX_CODE_ATTEMPTS,
  ttlMinutes: LOGIN_CODE_TTL_MINUTES,
};
