// Read + write helpers for the /admin dashboard (scouts, involvements, papers).
// Server-only. NOTE: these mutate the ecosystem DB and are currently unguarded —
// gate /admin (e.g. an ADMIN_TOKEN check) before exposing it on the live site.

import { getSql } from "./db.server";

export interface AdminResearcher {
  id: number;
  name: string;
  handle: string;
}
export interface Involvement {
  id: number;
  kind: string;
  name: string;
}
export interface CanonicalWork {
  id: number;
  title: string;
  url: string | null;
}
export interface ResearcherAdminDetail {
  advisesAbout: string | null;
  involvementIds: number[];
  paperIds: number[];
}

export async function getResearchersList(): Promise<AdminResearcher[]> {
  const sql = getSql();
  const rows = (await sql`SELECT id, name, handle FROM researchers ORDER BY name`) as any[];
  return rows.map((r) => ({ id: r.id, name: r.name ?? "", handle: r.handle ?? "" }));
}

export async function getInvolvements(): Promise<Involvement[]> {
  const sql = getSql();
  const rows = (await sql`SELECT id, kind, name FROM involvements ORDER BY kind, name`) as any[];
  return rows.map((r) => ({ id: r.id, kind: r.kind, name: r.name }));
}

export async function getCanonicalWorks(): Promise<CanonicalWork[]> {
  const sql = getSql();
  const rows = (await sql`SELECT id, title, url FROM canonical_works ORDER BY title`) as any[];
  return rows.map((r) => ({ id: r.id, title: r.title, url: r.url ?? null }));
}

export async function getResearcherAdminDetail(
  researcherId: number
): Promise<ResearcherAdminDetail> {
  const sql = getSql();
  const [advisor, involvements, papers] = await Promise.all([
    sql`SELECT advises_about FROM advisors WHERE researcher_id = ${researcherId} LIMIT 1`,
    sql`SELECT involvement_id FROM researcher_involvements WHERE researcher_id = ${researcherId}`,
    sql`SELECT canonical_work_id FROM researcher_canonical_works WHERE researcher_id = ${researcherId}`,
  ]);
  return {
    advisesAbout: (advisor as any[])[0]?.advises_about ?? null,
    involvementIds: (involvements as any[]).map((r) => r.involvement_id),
    paperIds: (papers as any[]).map((r) => r.canonical_work_id),
  };
}

// ── Mutations ──────────────────────────────────────────────────────

// Set (or clear) a researcher's scout/advisor status. A blank `advisesAbout`
// removes them from the advisors table.
export async function setAdvisor(researcherId: number, advisesAbout: string | null) {
  const sql = getSql();
  await sql`DELETE FROM advisors WHERE researcher_id = ${researcherId}`;
  const text = (advisesAbout ?? "").trim();
  if (text) {
    await sql`INSERT INTO advisors (researcher_id, advises_about) VALUES (${researcherId}, ${text})`;
  }
}

// Replace a researcher's involvement set. Evidence defaults by kind:
// signal → member, zoom/workshop → attended.
export async function saveInvolvements(researcherId: number, involvementIds: number[]) {
  const sql = getSql();
  const kinds = (await sql`SELECT id, kind FROM involvements`) as any[];
  const kindById = new Map<number, string>(kinds.map((k) => [k.id, k.kind]));

  await sql`DELETE FROM researcher_involvements WHERE researcher_id = ${researcherId}`;
  for (const involvementId of involvementIds) {
    const evidence = kindById.get(involvementId) === "signal" ? "member" : "attended";
    await sql`
      INSERT INTO researcher_involvements (researcher_id, involvement_id, evidence)
      VALUES (${researcherId}, ${involvementId}, ${evidence}::involvement_evidence)
      ON CONFLICT (researcher_id, involvement_id) DO NOTHING
    `;
  }
}

export async function addPaper(researcherId: number, canonicalWorkId: number) {
  const sql = getSql();
  await sql`
    INSERT INTO researcher_canonical_works (researcher_id, canonical_work_id)
    VALUES (${researcherId}, ${canonicalWorkId})
    ON CONFLICT (researcher_id, canonical_work_id) DO NOTHING
  `;
}

export async function removePaper(researcherId: number, canonicalWorkId: number) {
  const sql = getSql();
  await sql`
    DELETE FROM researcher_canonical_works
    WHERE researcher_id = ${researcherId} AND canonical_work_id = ${canonicalWorkId}
  `;
}

// Create a new canonical work and associate it with the researcher.
export async function createPaper(researcherId: number, title: string, url: string | null) {
  const sql = getSql();
  const cleanTitle = title.trim();
  const cleanUrl = (url ?? "").trim() || null;
  if (!cleanTitle) return;
  const rows = (await sql`
    INSERT INTO canonical_works (title, url) VALUES (${cleanTitle}, ${cleanUrl}) RETURNING id
  `) as any[];
  const id = rows[0]?.id;
  if (id) await addPaper(researcherId, id);
}
