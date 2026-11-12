// Requests for new institution designs (/requests), stored in the shared Neon
// database (tables from scripts/migrate-requests.mjs). Reads are public; the
// route only allows admins to write.

import { getSql } from "./db.server";
import { COLS, ROWS, VISIONS } from "./constants";
import {
  REQUEST_STATUSES,
  type InstitutionRequest,
  type RequestSite,
  type RequestStatus,
} from "./requests";

export async function getRequests(): Promise<InstitutionRequest[]> {
  const sql = getSql();
  const [requests, sites] = (await Promise.all([
    sql`SELECT id, name, vision, row_id, col_id, site_hints FROM institutions_requests ORDER BY position, id`,
    sql`SELECT id, request_id, name, instead, pain, success, status
        FROM institutions_request_sites ORDER BY position, id`,
  ])) as [any[], any[]];
  const byRequest = new Map<number, RequestSite[]>();
  for (const s of sites) {
    const list = byRequest.get(s.request_id) ?? [];
    list.push({
      id: s.id,
      name: s.name,
      instead: s.instead,
      pain: s.pain,
      success: s.success,
      status: s.status,
    });
    byRequest.set(s.request_id, list);
  }
  return requests.map((r) => ({
    id: r.id,
    name: r.name,
    vision: r.vision,
    row: r.row_id,
    column: r.col_id,
    siteHints: r.site_hints,
    sites: byRequest.get(r.id) ?? [],
  }));
}

function check(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
}
const validRow = (v: string) => check(ROWS.some((r) => r.id === v), "Choose a row.");
const validCol = (v: string) => check(COLS.some((c) => c.id === v), "Choose a column.");
const validVision = (v: string | null) =>
  check(v === null || VISIONS.some((x) => x.id === v), "Unknown vision.");

export async function createRequest(row: string, column: string): Promise<number> {
  validRow(row);
  validCol(column);
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO institutions_requests (name, row_id, col_id, position)
    VALUES ('New request', ${row}, ${column},
      (SELECT coalesce(max(position), 0) + 1 FROM institutions_requests))
    RETURNING id
  `) as any[];
  return rows[0].id;
}

export async function updateRequestField(id: number, field: string, value: string) {
  const sql = getSql();
  if (field === "name") {
    check(!!value.trim(), "A request needs a name.");
    await sql`UPDATE institutions_requests SET name = ${value.trim()}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "vision") {
    const vision = value || null;
    validVision(vision);
    await sql`UPDATE institutions_requests SET vision = ${vision}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "row") {
    validRow(value);
    await sql`UPDATE institutions_requests SET row_id = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "column") {
    validCol(value);
    await sql`UPDATE institutions_requests SET col_id = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "siteHints") {
    await sql`UPDATE institutions_requests SET site_hints = ${value}, updated_at = now() WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

export async function deleteRequest(id: number) {
  await getSql()`DELETE FROM institutions_requests WHERE id = ${id}`;
}

export async function createSite(requestId: number, name: string): Promise<number> {
  check(!!name.trim(), "Name the site.");
  const rows = (await getSql()`
    INSERT INTO institutions_request_sites (request_id, name, position)
    VALUES (${requestId}, ${name.trim()},
      (SELECT coalesce(max(position), 0) + 1 FROM institutions_request_sites WHERE request_id = ${requestId}))
    RETURNING id
  `) as any[];
  return rows[0].id;
}

export async function updateSiteField(id: number, field: string, value: string) {
  const sql = getSql();
  if (field === "name") {
    check(!!value.trim(), "A site needs a name.");
    await sql`UPDATE institutions_request_sites SET name = ${value.trim()}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "instead") {
    await sql`UPDATE institutions_request_sites SET instead = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "pain") {
    await sql`UPDATE institutions_request_sites SET pain = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "success") {
    await sql`UPDATE institutions_request_sites SET success = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "status") {
    check(REQUEST_STATUSES.includes(value as RequestStatus), "Unknown status.");
    await sql`UPDATE institutions_request_sites SET status = ${value}, updated_at = now() WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

export async function deleteSite(id: number) {
  await getSql()`DELETE FROM institutions_request_sites WHERE id = ${id}`;
}
