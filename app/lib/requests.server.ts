// Requests for new institution designs (/requests), stored in the shared Neon
// database (tables from scripts/migrate-requests.mjs). Reads are public; the
// route only allows admins to write.

import { getSql } from "./db.server";
import { COLS, ROWS } from "./constants";
import {
  PAPER_KINDS,
  REQUEST_STATUSES,
  type PaperKind,
  type RequestPaper,
  type InstitutionRequest,
  type RequestSite,
  type RequestVision,
  type RequestStatus,
} from "./requests";

export async function getRequests(): Promise<InstitutionRequest[]> {
  const sql = getSql();
  const [requests, sites, papers] = (await Promise.all([
    sql`SELECT id, name, vision, row_id, col_id, description, site_hints
        FROM institutions_requests ORDER BY position, id`,
    sql`SELECT id, request_id, name, instead, pain, success, status
        FROM institutions_request_sites ORDER BY position, id`,
    sql`SELECT request_id, kind, title, url FROM institutions_request_papers ORDER BY position, id`,
  ])) as [any[], any[], any[]];
  const papersByRequest = new Map<number, RequestPaper[]>();
  for (const p of papers) {
    const list = papersByRequest.get(p.request_id) ?? [];
    list.push({ kind: p.kind, title: p.title, url: p.url });
    papersByRequest.set(p.request_id, list);
  }
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
    description: r.description,
    siteHints: r.site_hints,
    papers: papersByRequest.get(r.id) ?? [],
    sites: byRequest.get(r.id) ?? [],
  }));
}

function check(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
}
const validRow = (v: string) => check(ROWS.some((r) => r.id === v), "Choose a row.");
const validCol = (v: string) => check(COLS.some((c) => c.id === v), "Choose a column.");
async function validVision(v: string | null) {
  if (v === null) return;
  const rows = (await getSql()`SELECT 1 FROM institutions_request_visions WHERE id = ${v}`) as unknown[];
  check(rows.length > 0, "Unknown vision.");
}

export async function getVisions(): Promise<RequestVision[]> {
  const rows = (await getSql()`
    SELECT id, label, url FROM institutions_request_visions ORDER BY position, label
  `) as any[];
  return rows.map((r) => ({ id: r.id, label: r.label, url: r.url }));
}

function cleanUrl(url: string) {
  const u = url.trim();
  if (!u) return "";
  check(/^https?:\/\/\S+$/.test(u), "Links must start with http:// or https://.");
  return u;
}

export async function createVision(label: string, url: string): Promise<string> {
  const name = label.trim();
  check(!!name, "Name the vision.");
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  check(!!id, "Name the vision with letters or digits.");
  const rows = (await getSql()`
    INSERT INTO institutions_request_visions (id, label, url, position)
    VALUES (${id}, ${name}, ${cleanUrl(url)},
      (SELECT coalesce(max(position), 0) + 1 FROM institutions_request_visions))
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `) as unknown[];
  check(rows.length > 0, "A vision with that name already exists.");
  return id;
}

export async function updateVisionField(id: string, field: string, value: string) {
  const sql = getSql();
  if (field === "label") {
    check(!!value.trim(), "A vision needs a name.");
    await sql`UPDATE institutions_request_visions SET label = ${value.trim()} WHERE id = ${id}`;
  } else if (field === "url") {
    await sql`UPDATE institutions_request_visions SET url = ${cleanUrl(value)} WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

// Untags the vision's requests, then removes the vision.
export async function deleteVision(id: string) {
  const sql = getSql();
  await sql.transaction([
    sql`UPDATE institutions_requests SET vision = NULL WHERE vision = ${id}`,
    sql`DELETE FROM institutions_request_visions WHERE id = ${id}`,
  ]);
}

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
    await validVision(vision);
    await sql`UPDATE institutions_requests SET vision = ${vision}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "row") {
    validRow(value);
    await sql`UPDATE institutions_requests SET row_id = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "column") {
    validCol(value);
    await sql`UPDATE institutions_requests SET col_id = ${value}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "description") {
    await sql`UPDATE institutions_requests SET description = ${value.trim()}, updated_at = now() WHERE id = ${id}`;
  } else if (field === "siteHints") {
    await sql`UPDATE institutions_requests SET site_hints = ${value}, updated_at = now() WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

// Save a row's draft: validate every field first, then write them together.
export async function updateRequestFields(id: number, fields: Record<string, unknown>) {
  const allowed = ["name", "vision", "row", "column", "description", "papers"];
  const { papers: rawPapers, ...rest } = fields;
  const entries = Object.entries(rest).map(([k, v]) => [k, String(v ?? "")] as const);
  for (const [k, v] of entries) {
    check(allowed.includes(k), "Unknown field.");
    if (k === "name") check(!!v.trim(), "A request needs a name.");
    if (k === "row") validRow(v);
    if (k === "column") validCol(v);
    if (k === "vision") await validVision(v || null);
  }
  const papers = rawPapers === undefined ? undefined : cleanPapers(rawPapers);
  for (const [k, v] of entries) await updateRequestField(id, k, v);
  if (papers) await replacePapers(id, papers);
}

function cleanPapers(raw: unknown): RequestPaper[] {
  check(Array.isArray(raw), "Papers must be a list.");
  return (raw as any[])
    .map((p) => ({
      kind: String(p?.kind ?? "") as PaperKind,
      title: String(p?.title ?? "").trim(),
      url: String(p?.url ?? "").trim(),
    }))
    .filter((p) => p.title || p.url)
    .map((p) => {
      check(PAPER_KINDS.includes(p.kind), "Choose a kind for each paper.");
      check(!!p.url, `Add a link for "${p.title || "the paper"}".`);
      return { ...p, url: cleanUrl(p.url), title: p.title || p.url };
    });
}

async function replacePapers(requestId: number, papers: RequestPaper[]) {
  const sql = getSql();
  await sql.transaction([
    sql`DELETE FROM institutions_request_papers WHERE request_id = ${requestId}`,
    ...papers.map(
      (p, i) => sql`
        INSERT INTO institutions_request_papers (request_id, kind, title, url, position)
        VALUES (${requestId}, ${p.kind}, ${p.title}, ${p.url}, ${i})
      `
    ),
    sql`UPDATE institutions_requests SET updated_at = now() WHERE id = ${requestId}`,
  ]);
}

export async function deleteRequest(id: number) {
  await getSql()`DELETE FROM institutions_requests WHERE id = ${id}`;
}

export async function createSite(requestId: number, name: string): Promise<number> {
  check(!!name.trim(), "Name the site.");
  const existing = (await getSql()`
    SELECT 1 FROM institutions_request_sites
    WHERE request_id = ${requestId} AND lower(name) = lower(${name.trim()})
  `) as unknown[];
  check(existing.length === 0, "That site is already on this request.");
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
