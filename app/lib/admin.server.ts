// Read + write helpers for the community admin dashboard (scouts, involvements, papers).
// Server-only. Every route loader and action using these helpers must require an
// authorized admin session before reading from or mutating the ecosystem DB.

import { getSql } from "./db.server";

export interface AdminResearcher {
  id: number;
  name: string;
  handle: string;
}

export type Closeness =
  | "core-team"
  | "committed"
  | "warm"
  | "not-on-slack"
  | "unknown";

export interface AdminPerson extends AdminResearcher {
  closeness: Closeness;
  involvementIds: number[];
  isScout: boolean;
}

export interface AdminScout {
  researcherId: number;
  name: string;
  handle: string;
  scoutsFor: string;
}

export interface Involvement {
  id: number;
  kind: string;
  name: string;
}

export interface PaperResearcher {
  id: number;
  name: string;
  handle: string;
}

export interface AdminPaper {
  id: number;
  title: string;
  url: string | null;
  researchers: PaperResearcher[];
}

export async function getResearchersList(): Promise<AdminResearcher[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, handle
    FROM researchers
    ORDER BY lower(COALESCE(name, '')), name
  `) as any[];
  return rows.map((r) => ({ id: r.id, name: r.name ?? "", handle: r.handle ?? "" }));
}

export async function getPeople(): Promise<AdminPerson[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT
      r.id,
      r.name,
      r.handle,
      COALESCE(r.commitment, 'unknown') AS closeness,
      EXISTS (
        SELECT 1 FROM advisors a WHERE a.researcher_id = r.id
      ) AS is_scout,
      COALESCE(
        array_agg(ri.involvement_id ORDER BY ri.involvement_id)
          FILTER (WHERE ri.involvement_id IS NOT NULL),
        ARRAY[]::integer[]
      ) AS involvement_ids
    FROM researchers r
    LEFT JOIN researcher_involvements ri ON ri.researcher_id = r.id
    GROUP BY r.id, r.name, r.handle, r.commitment
    ORDER BY lower(COALESCE(r.name, '')), r.name
  `) as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name ?? "",
    handle: r.handle ?? "",
    closeness: r.closeness,
    involvementIds: r.involvement_ids ?? [],
    isScout: r.is_scout,
  }));
}

export async function getScouts(): Promise<AdminScout[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT r.id AS researcher_id, r.name, r.handle, a.advises_about
    FROM advisors a
    JOIN researchers r ON r.id = a.researcher_id
    ORDER BY lower(COALESCE(r.name, '')), r.name
  `) as any[];
  return rows.map((r) => ({
    researcherId: r.researcher_id,
    name: r.name ?? "",
    handle: r.handle ?? "",
    scoutsFor: r.advises_about ?? "",
  }));
}

export async function getInvolvements(): Promise<Involvement[]> {
  const sql = getSql();
  const rows = (await sql`SELECT id, kind, name FROM involvements ORDER BY kind, name`) as any[];
  return rows.map((r) => ({ id: r.id, kind: r.kind, name: r.name }));
}

export async function getPapers(): Promise<AdminPaper[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT
      cw.id,
      cw.title,
      cw.url,
      COALESCE(
        json_agg(
          json_build_object('id', r.id, 'name', r.name, 'handle', r.handle)
          ORDER BY lower(COALESCE(r.name, '')), r.name
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS researchers
    FROM canonical_works cw
    LEFT JOIN researcher_canonical_works rcw ON rcw.canonical_work_id = cw.id
    LEFT JOIN researchers r ON r.id = rcw.researcher_id
    GROUP BY cw.id, cw.title, cw.url
    ORDER BY lower(cw.title), cw.title
  `) as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url ?? null,
    researchers: (r.researchers ?? []).map((researcher: any) => ({
      id: researcher.id,
      name: researcher.name ?? "",
      handle: researcher.handle ?? "",
    })),
  }));
}

// ── Mutations ──────────────────────────────────────────────────────

export async function addScout(researcherId: number) {
  const sql = getSql();
  await sql`
    INSERT INTO advisors (researcher_id, advises_about)
    VALUES (${researcherId}, '')
    ON CONFLICT (researcher_id) DO NOTHING
  `;
}

export async function updateScout(researcherId: number, scoutsFor: string) {
  const sql = getSql();
  await sql`
    UPDATE advisors
    SET advises_about = ${scoutsFor.trim()}
    WHERE researcher_id = ${researcherId}
  `;
}

export async function removeScout(researcherId: number) {
  const sql = getSql();
  await sql`DELETE FROM advisors WHERE researcher_id = ${researcherId}`;
}

export async function updateCloseness(researcherId: number, closeness: Closeness) {
  const sql = getSql();
  await sql`
    UPDATE researchers
    SET commitment = ${closeness}
    WHERE id = ${researcherId}
  `;
}

export async function setInvolvement(
  researcherId: number,
  involvementId: number,
  active: boolean
) {
  const sql = getSql();
  if (!active) {
    await sql`
      DELETE FROM researcher_involvements
      WHERE researcher_id = ${researcherId} AND involvement_id = ${involvementId}
    `;
    return;
  }

  const rows = (await sql`
    SELECT kind
    FROM involvements
    WHERE id = ${involvementId}
    LIMIT 1
  `) as any[];
  const kind = rows[0]?.kind;
  if (!kind) throw new Error("Involvement not found.");
  const evidence = kind === "signal" || kind === "slack" ? "member" : "attended";
  await sql`
    INSERT INTO researcher_involvements (researcher_id, involvement_id, evidence)
    VALUES (${researcherId}, ${involvementId}, ${evidence}::"InvolvementEvidence")
    ON CONFLICT (researcher_id, involvement_id) DO NOTHING
  `;
}

export async function addPaperResearcher(canonicalWorkId: number, researcherId: number) {
  const sql = getSql();
  await sql`
    INSERT INTO researcher_canonical_works (researcher_id, canonical_work_id)
    VALUES (${researcherId}, ${canonicalWorkId})
    ON CONFLICT (researcher_id, canonical_work_id) DO NOTHING
  `;
}

export async function removePaperResearcher(canonicalWorkId: number, researcherId: number) {
  const sql = getSql();
  await sql`
    DELETE FROM researcher_canonical_works
    WHERE researcher_id = ${researcherId} AND canonical_work_id = ${canonicalWorkId}
  `;
}

export async function updatePaper(canonicalWorkId: number, title: string, url: string | null) {
  const cleanTitle = title.trim();
  if (!cleanTitle) throw new Error("A paper title is required.");

  const sql = getSql();
  await sql`
    UPDATE canonical_works
    SET title = ${cleanTitle}, url = ${(url ?? "").trim() || null}
    WHERE id = ${canonicalWorkId}
  `;
}

export async function createPaper(title: string, url: string | null) {
  const cleanTitle = title.trim();
  if (!cleanTitle) throw new Error("A paper title is required.");

  const sql = getSql();
  await sql`
    INSERT INTO canonical_works (title, url)
    VALUES (${cleanTitle}, ${(url ?? "").trim() || null})
  `;
}
