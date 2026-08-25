// Queries against the ecosystem researcher DB for the Community page and
// researcher profiles. Server-only.
//
// Grouping mirrors ecosystem/src/researcher-grouping.ts:
//   advisors  → present in the `advisors` table (shown with what they advise on)
//   community → any Signal/Slack/Zoom/workshop involvement (researcher_involvements)
//   friends   → committed/warm researchers not already grouped above
// (ecosystem's code currently uses `committed` only; per the product ask we
// include `warm` too — see plans/…: "Friends group: warm+committed?".)

import { getSql } from "./db.server";

export interface Researcher {
  id: number;
  name: string;
  handle: string;
  affiliation: string;
  bio: string | null;
  bioSourceUrl: string | null;
  photoUrl: string | null;
  scholarUrl: string | null;
  rows: string[];
  methods: string[];
  tags: string[];
  seniority: string | null;
  commitment: string | null;
  contributionAreas: string[];
  worldClassMethods: string[];
  advisesAbout?: string | null;
}

export interface Community {
  advisors: Researcher[];
  community: Researcher[];
  friends: Researcher[];
}

const FRIEND_COMMITMENTS = new Set(["committed"]);

// Researcher photos are stored as site-relative paths (e.g. /photos/x.jpg).
// The cached originals are served from the players app.
const PHOTO_BASE = "https://players.meaningalignment.org";
function photoSrc(p: string | null | undefined): string | null {
  if (!p) return null;
  if (/^https?:\/\//.test(p)) return p;
  return PHOTO_BASE + (p.startsWith("/") ? p : "/" + p);
}

function toResearcher(r: any): Researcher {
  return {
    id: r.id,
    name: r.name ?? "",
    handle: r.handle ?? "",
    affiliation: r.affiliation ?? "",
    bio: r.bio ?? null,
    bioSourceUrl: r.bio_source_url ?? null,
    photoUrl: photoSrc(r.photo_url),
    scholarUrl: r.scholar_url ?? null,
    rows: r.rows ?? [],
    methods: r.methods ?? [],
    tags: r.tags ?? [],
    seniority: r.seniority ?? null,
    commitment: r.commitment ?? null,
    contributionAreas: r.contribution_areas ?? [],
    worldClassMethods: r.world_class_methods ?? [],
  };
}

export async function getCommunity(): Promise<Community> {
  const sql = getSql();
  const [researchers, advisors, involved] = await Promise.all([
    sql`SELECT id, name, handle, affiliation, bio, bio_source_url, photo_url, scholar_url, rows, methods,
        tags, seniority, commitment, contribution_areas, world_class_methods
        FROM researchers ORDER BY name`,
    sql`SELECT researcher_id, advises_about FROM advisors`,
    sql`SELECT DISTINCT researcher_id FROM researcher_involvements`,
  ]);

  const advisesBy = new Map<number, string>();
  for (const a of advisors as any[]) advisesBy.set(a.researcher_id, a.advises_about);
  const involvedSet = new Set<number>((involved as any[]).map((r) => r.researcher_id));

  const groups: Community = { advisors: [], community: [], friends: [] };
  for (const raw of researchers as any[]) {
    const r = toResearcher(raw);
    if (advisesBy.has(r.id)) {
      r.advisesAbout = advisesBy.get(r.id)!;
      groups.advisors.push(r);
    } else if (involvedSet.has(r.id)) {
      groups.community.push(r);
    } else if (r.commitment && FRIEND_COMMITMENTS.has(r.commitment)) {
      groups.friends.push(r);
    }
  }
  const byName = (a: Researcher, b: Researcher) => a.name.localeCompare(b.name);
  groups.advisors.sort(byName);
  groups.community.sort(byName);
  groups.friends.sort(byName);
  return groups;
}

export interface ResearcherProfile extends Researcher {
  involvements: { kind: string; name: string }[];
  canonicalWorks: { title: string; url: string | null }[];
}

export async function getResearcher(handleParam: string): Promise<ResearcherProfile | null> {
  const sql = getSql();
  const bare = handleParam.replace(/^@/, "");
  const rows = (await sql`
    SELECT id, name, handle, affiliation, bio, bio_source_url, photo_url, scholar_url, rows, methods,
        tags, seniority, commitment, contribution_areas, world_class_methods
    FROM researchers
    WHERE handle = ${"@" + bare} OR handle = ${bare} LIMIT 1
  `) as any[];
  if (!rows.length) return null;
  const base = toResearcher(rows[0]);

  const [advisor, involvements, works] = await Promise.all([
    sql`SELECT advises_about FROM advisors WHERE researcher_id = ${base.id} LIMIT 1`,
    sql`
      SELECT i.kind, i.name FROM researcher_involvements ri
      JOIN involvements i ON i.id = ri.involvement_id
      WHERE ri.researcher_id = ${base.id}
      ORDER BY i.kind, i.name
    `,
    sql`
      SELECT cw.title, cw.url FROM researcher_canonical_works rcw
      JOIN canonical_works cw ON cw.id = rcw.canonical_work_id
      WHERE rcw.researcher_id = ${base.id}
      ORDER BY cw.title
    `,
  ]);

  return {
    ...base,
    advisesAbout: (advisor as any[])[0]?.advises_about ?? null,
    involvements: (involvements as any[]).map((i) => ({ kind: i.kind, name: i.name })),
    canonicalWorks: (works as any[]).map((w) => ({ title: w.title, url: w.url ?? null })),
  };
}
