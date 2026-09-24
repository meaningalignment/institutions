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
import { researcherKey, researcherNameSlug, researcherXUrl } from "./researcher-links";

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

// How a work was published (Postgres enum "WorkKind").
export type WorkKind =
  | "peer_reviewed" | "preprint" | "workshop" | "essay" | "report" | "book" | "chapter" | "lecture";

// Which /resources section a work is listed in (Postgres enum "ResourceSection").
export type ResourceSection = "selected" | "field" | "background";

export interface ResearchWork {
  id: number;
  title: string;
  url: string;
  authors: string[];
  year: number | null;
  venue: string | null;
  kind: WorkKind | null;
  summary: string | null;
  section: ResourceSection;
  fieldIds: string[];
  researchers: Pick<Researcher, "id" | "name" | "handle">[];
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
  const tags = r.tags ?? [];
  return {
    id: r.id,
    name: r.name ?? "",
    handle: r.handle ?? "",
    affiliation: r.affiliation ?? "",
    bio: typeof r.bio === "string" && r.bio.trim() ? r.bio : null,
    bioSourceUrl: r.bio_source_url ?? null,
    photoUrl: photoSrc(r.photo_url),
    scholarUrl: r.scholar_url ?? null,
    rows: r.rows ?? [],
    methods: r.methods ?? [],
    tags,
    seniority: r.seniority ?? null,
    commitment: r.commitment ?? null,
    contributionAreas: r.contribution_areas ?? [],
    worldClassMethods: r.world_class_methods ?? [],
  };
}

// The community page is read far more often than the roster changes, and the
// three Neon round trips dominate its load time. Cache per server instance
// with a short TTL; admin actions invalidate the local instance immediately,
// and the TTL bounds staleness on any other instance.
let communityCache: { data: Community; at: number } | null = null;
const COMMUNITY_TTL_MS = 60_000;

export function invalidateCommunityCache() {
  communityCache = null;
}

export async function getCommunity(): Promise<Community> {
  if (communityCache && Date.now() - communityCache.at < COMMUNITY_TTL_MS) {
    return communityCache.data;
  }
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
  // People with a known affiliation sort above those without, then
  // alphabetically within each block -- an unattributed card reads as less
  // complete, so it should not lead the list.
  const byName = (a: Researcher, b: Researcher) => {
    const aHas = a.affiliation.trim() !== "";
    const bHas = b.affiliation.trim() !== "";
    if (aHas !== bHas) return aHas ? -1 : 1;
    return a.name.localeCompare(b.name);
  };
  groups.advisors.sort(byName);
  groups.community.sort(byName);
  groups.friends.sort(byName);
  communityCache = { data: groups, at: Date.now() };
  return groups;
}

// Every listed work, newest first (hidden ones, with no section, are left
// out), with the roster members linked to it.
export async function getResearchWorks(): Promise<ResearchWork[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT w.id, w.title, w.url, w.authors, w.year, w.venue, w.kind, w.summary, w.section, w.fields,
      COALESCE(
        json_agg(json_build_object('id', r.id, 'name', r.name, 'handle', r.handle) ORDER BY r.name)
          FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS researchers
    FROM canonical_works w
    LEFT JOIN researcher_canonical_works rcw ON rcw.canonical_work_id = w.id
    LEFT JOIN researchers r ON r.id = rcw.researcher_id
    WHERE w.section IS NOT NULL
    GROUP BY w.id
    ORDER BY w.year DESC NULLS LAST, lower(w.title)
  `) as any[];
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    url: row.url,
    authors: row.authors ?? [],
    year: row.year ?? null,
    venue: row.venue ?? null,
    kind: row.kind ?? null,
    summary: row.summary ?? null,
    section: row.section,
    fieldIds: row.fields ?? [],
    researchers: (row.researchers ?? []).map((r: any) => ({ id: r.id, name: r.name ?? "", handle: r.handle ?? "" })),
  }));
}

// Grid cell ("{row}-{col}") → the research fields it draws on most: the top
// three by number of listed works naming that cell. One map drives the cell
// pages' "Further reading", the grid's field highlight and research-fields
// row, and /resources' "Relevant for". Cached per instance with a short TTL.
export type CellFieldMap = Record<string, string[]>;
const CELL_FIELDS_PER_CELL = 3;
let cellFieldsCache: { data: CellFieldMap; at: number } | null = null;
const CELL_FIELDS_TTL_MS = 5 * 60_000;

export async function getCellFieldMap(): Promise<CellFieldMap> {
  if (cellFieldsCache && Date.now() - cellFieldsCache.at < CELL_FIELDS_TTL_MS) return cellFieldsCache.data;
  const sql = getSql();
  const rows = (await sql`
    SELECT cell, field, count(*)::int AS works
    FROM canonical_works, unnest(cells) AS cell, unnest(fields) AS field
    WHERE section IS NOT NULL
    GROUP BY cell, field
    ORDER BY cell, works DESC, field
  `) as any[];
  const data: CellFieldMap = {};
  for (const row of rows) {
    const fields = (data[row.cell] ??= []);
    if (fields.length < CELL_FIELDS_PER_CELL) fields.push(row.field);
  }
  cellFieldsCache = { data, at: Date.now() };
  return data;
}

// researcherKey(name) → X profile for every roster member with a handle. Used to link author and curator names on
// /resources without pointing at /researchers profiles.
let linksCache: { data: Record<string, string>; at: number } | null = null;

export async function getResearcherLinks(): Promise<Record<string, string>> {
  if (linksCache && Date.now() - linksCache.at < CELL_FIELDS_TTL_MS) return linksCache.data;
  const sql = getSql();
  const rows = (await sql`SELECT name, handle FROM researchers`) as any[];
  const data: Record<string, string> = {};
  for (const row of rows) {
    const url = researcherXUrl(row.handle);
    if (row.name && url) data[researcherKey(row.name)] ??= url;
  }
  linksCache = { data, at: Date.now() };
  return data;
}

type ProfileWork = { title: string; url: string; year: number | null; summary: string | null };

export interface ResearcherProfile extends Researcher {
  involvements: { kind: string; name: string }[];
  canonicalWorks: ProfileWork[];
  moreWorks: ProfileWork[];
}

export async function getResearcher(handleParam: string): Promise<ResearcherProfile | null> {
  const sql = getSql();
  const bare = handleParam.replace(/^@/, "");
  let rows = (await sql`
    SELECT id, name, handle, affiliation, bio, bio_source_url, photo_url, scholar_url, rows, methods,
        tags, seniority, commitment, contribution_areas, world_class_methods
    FROM researchers
    WHERE handle = ${"@" + bare} OR handle = ${bare} LIMIT 1
  `) as any[];
  if (!rows.length) {
    const peopleWithoutHandles = (await sql`
      SELECT id, name, handle, affiliation, bio, bio_source_url, photo_url, scholar_url, rows, methods,
          tags, seniority, commitment, contribution_areas, world_class_methods
      FROM researchers
      WHERE handle IS NULL OR btrim(handle) = ${""}
    `) as any[];
    const match = peopleWithoutHandles.find((person) => researcherNameSlug(person.name ?? "") === bare.toLowerCase());
    rows = match ? [match] : [];
  }
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
      SELECT w.title, w.url, w.year, w.summary, w.section FROM researcher_canonical_works rcw
      JOIN canonical_works w ON w.id = rcw.canonical_work_id
      WHERE rcw.researcher_id = ${base.id} AND w.section IS NOT NULL
      ORDER BY w.year DESC NULLS LAST, lower(w.title)
    `,
  ]);

  const linked = (works as any[]).map((w) => ({
    title: w.title as string,
    url: w.url as string,
    year: (w.year as number | null) ?? null,
    summary: (w.summary as string | null) ?? null,
    selected: w.section === "selected",
  }));
  const strip = ({ selected: _, ...work }: (typeof linked)[number]) => work;
  return {
    ...base,
    advisesAbout: (advisor as any[])[0]?.advises_about ?? null,
    involvements: (involvements as any[]).map((i) => ({ kind: i.kind, name: i.name })),
    canonicalWorks: linked.filter((w) => w.selected).map(strip),
    moreWorks: linked.filter((w) => !w.selected).map(strip),
  };
}
