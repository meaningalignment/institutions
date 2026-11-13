// Requests for new institution designs (/requests), stored in the shared Neon
// database (tables from scripts/migrate-requests.mjs). Reads are public; the
// route only allows admins to write.

import { getSql } from "./db.server";
import { COLS, ROWS } from "./constants";
import {
  LINK_KINDS,
  REQUEST_STATUSES,
  SCORE_KEYS,
  type LinkKind,
  type RequestLink,
  type InstitutionRequest,
  type RequestSite,
  type RequestLens,
  type RequestStatus,
} from "./requests";

export async function getRequests(): Promise<InstitutionRequest[]> {
  const sql = getSql();
  const [requests, sites, links] = (await Promise.all([
    sql`SELECT id, name, rows, cols, lenses, description, site_hints, likely, soon, leverage
        FROM institutions_requests ORDER BY position, id`,
    sql`SELECT id, request_id, name, instead, pain, success, status
        FROM institutions_request_sites ORDER BY position, id`,
    sql`SELECT request_id, kind, title, url FROM institutions_request_links ORDER BY position, id`,
  ])) as [any[], any[], any[]];
  const linksByRequest = new Map<number, RequestLink[]>();
  for (const p of links) {
    const list = linksByRequest.get(p.request_id) ?? [];
    list.push({ kind: p.kind, title: p.title, url: p.url });
    linksByRequest.set(p.request_id, list);
  }
  const byRequest = new Map<number, RequestSite[]>();
  for (const s of sites) {
    const list = byRequest.get(s.request_id) ?? [];
    list.push({ id: s.id, name: s.name, instead: s.instead, pain: s.pain, success: s.success, status: s.status });
    byRequest.set(s.request_id, list);
  }
  return requests.map((r) => ({
    id: r.id,
    name: r.name,
    rows: r.rows,
    cols: r.cols,
    lenses: r.lenses,
    description: r.description,
    siteHints: r.site_hints,
    scores: { likely: r.likely, soon: r.soon, leverage: r.leverage },
    links: linksByRequest.get(r.id) ?? [],
    sites: byRequest.get(r.id) ?? [],
  }));
}

function check(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
}
const rowIds = new Set(ROWS.map((r) => r.id));
const colIds = new Set(COLS.map((c) => c.id));

function cleanList(raw: unknown, allowed: Set<string> | null, what: string, required: boolean): string[] {
  check(Array.isArray(raw), `${what} must be a list.`);
  const list = [...new Set((raw as unknown[]).map((v) => String(v)))];
  if (allowed) for (const v of list) check(allowed.has(v), `Unknown ${what.toLowerCase()}: ${v}.`);
  if (required) check(list.length > 0, `Choose at least one ${what.toLowerCase().replace(/s$/, "")}.`);
  return list;
}

export async function getLenses(): Promise<RequestLens[]> {
  const rows = (await getSql()`
    SELECT id, label, url FROM institutions_request_lenses ORDER BY position, label
  `) as any[];
  return rows.map((r) => ({ id: r.id, label: r.label, url: r.url }));
}

function cleanUrl(url: string) {
  const u = url.trim();
  if (!u) return "";
  check(/^https?:\/\/\S+$/.test(u), "Links must start with http:// or https://.");
  return u;
}

export async function createLens(label: string, url: string): Promise<string> {
  const name = label.trim();
  check(!!name, "Name the lens.");
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  check(!!id, "Name the lens with letters or digits.");
  const rows = (await getSql()`
    INSERT INTO institutions_request_lenses (id, label, url, position)
    VALUES (${id}, ${name}, ${cleanUrl(url)},
      (SELECT coalesce(max(position), 0) + 1 FROM institutions_request_lenses))
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `) as unknown[];
  check(rows.length > 0, "A lens with that name already exists.");
  return id;
}

export async function updateLensField(id: string, field: string, value: string) {
  const sql = getSql();
  if (field === "label") {
    check(!!value.trim(), "A lens needs a name.");
    await sql`UPDATE institutions_request_lenses SET label = ${value.trim()} WHERE id = ${id}`;
  } else if (field === "url") {
    await sql`UPDATE institutions_request_lenses SET url = ${cleanUrl(value)} WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

// Removes the lens from every request, then deletes it.
export async function deleteLens(id: string) {
  const sql = getSql();
  await sql.transaction([
    sql`UPDATE institutions_requests SET lenses = array_remove(lenses, ${id}) WHERE ${id} = ANY(lenses)`,
    sql`DELETE FROM institutions_request_lenses WHERE id = ${id}`,
  ]);
}

export async function createRequest(row: string, column: string): Promise<number> {
  check(rowIds.has(row), "Choose a row.");
  check(colIds.has(column), "Choose a column.");
  const rows = (await getSql()`
    INSERT INTO institutions_requests (name, row_id, col_id, rows, cols, position)
    VALUES ('New request', ${row}, ${column}, ${[row]}, ${[column]},
      (SELECT coalesce(max(position), 0) + 1 FROM institutions_requests))
    RETURNING id
  `) as any[];
  return rows[0].id;
}

export async function updateRequestField(id: number, field: string, value: string) {
  const sql = getSql();
  if (field === "siteHints") {
    await sql`UPDATE institutions_requests SET site_hints = ${value}, updated_at = now() WHERE id = ${id}`;
  } else {
    throw new Error("Unknown field.");
  }
}

function cleanScore(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  check(Number.isInteger(n) && n >= 1 && n <= 5, "Scores run from 1 to 5.");
  return n;
}

// Save a row's draft: validate everything first, then write it together.
export async function updateRequestFields(id: number, fields: Record<string, unknown>) {
  const allowed = new Set(["name", "description", "rows", "cols", "lenses", "scores", "links"]);
  for (const k of Object.keys(fields)) check(allowed.has(k), `Unknown field: ${k}.`);
  const sql = getSql();
  const q: any[] = [];
  if ("name" in fields) {
    const name = String(fields.name ?? "").trim();
    check(!!name, "A request needs a name.");
    q.push(sql`UPDATE institutions_requests SET name = ${name} WHERE id = ${id}`);
  }
  if ("description" in fields) {
    q.push(sql`UPDATE institutions_requests SET description = ${String(fields.description ?? "").trim()} WHERE id = ${id}`);
  }
  if ("rows" in fields) {
    const rows = cleanList(fields.rows, rowIds, "Rows", true);
    q.push(sql`UPDATE institutions_requests SET rows = ${rows}, row_id = ${rows[0]} WHERE id = ${id}`);
  }
  if ("cols" in fields) {
    const cols = cleanList(fields.cols, colIds, "Columns", true);
    q.push(sql`UPDATE institutions_requests SET cols = ${cols}, col_id = ${cols[0]} WHERE id = ${id}`);
  }
  if ("lenses" in fields) {
    const known = new Set((await getLenses()).map((l) => l.id));
    const lenses = cleanList(fields.lenses, known, "Lenses", false);
    q.push(sql`UPDATE institutions_requests SET lenses = ${lenses} WHERE id = ${id}`);
  }
  if ("scores" in fields) {
    const s = (fields.scores ?? {}) as Record<string, unknown>;
    const [likely, soon, leverage] = SCORE_KEYS.map((k) => cleanScore(s[k]));
    q.push(sql`UPDATE institutions_requests SET likely = ${likely}, soon = ${soon}, leverage = ${leverage} WHERE id = ${id}`);
  }
  if ("links" in fields) {
    const links = cleanLinks(fields.links);
    q.push(sql`DELETE FROM institutions_request_links WHERE request_id = ${id}`);
    links.forEach((p, i) =>
      q.push(sql`
        INSERT INTO institutions_request_links (request_id, kind, title, url, position)
        VALUES (${id}, ${p.kind}, ${p.title}, ${p.url}, ${i})
      `)
    );
  }
  q.push(sql`UPDATE institutions_requests SET updated_at = now() WHERE id = ${id}`);
  await sql.transaction(q);
}

function cleanLinks(raw: unknown): RequestLink[] {
  check(Array.isArray(raw), "Links must be a list.");
  return (raw as any[])
    .map((p) => ({
      kind: String(p?.kind ?? "") as LinkKind,
      title: String(p?.title ?? "").trim(),
      url: String(p?.url ?? "").trim(),
    }))
    .filter((p) => p.title || p.url)
    .map((p) => {
      check(LINK_KINDS.includes(p.kind), "Choose a kind for each link.");
      check(!!p.url, `Add a URL for "${p.title || "the link"}".`);
      return { ...p, url: cleanUrl(p.url), title: p.title || p.url };
    });
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
