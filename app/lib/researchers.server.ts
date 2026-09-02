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
import { loadResearchWorksCatalog } from "./content.server";
import { researcherNameSlug } from "./researcher-links";
import { researchFieldsFor } from "./research-fields";

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

export interface ResearchWork {
  id: string;
  title: string;
  url: string | null;
  year: number | null;
  summary: string | null;
  tier: "canonical" | "more";
  authors: string[];
  researchers: Pick<Researcher, "id" | "name" | "handle">[];
  cells: string[];
  // A work carries no fields of its own; it inherits the union of its linked
  // researchers' fields so one field selector can filter people and papers.
  // Fields the work itself belongs to, derived from its own subject tags.
  fieldIds: string[];
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

// Author strings in the works catalog vary from the roster in case, accents
// and hyphenation ("Tan Zhi-Xuan" vs "Tan Zhi Xuan"), so match on a folded
// form rather than requiring the exact string.
function nameKey(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
}

// Papers read most-recent-first. `year` comes from the JSON annotations, not
// the DB, so this cannot be an ORDER BY — it has to run after the join.
// Works with no known year sort last, then alphabetically within a year.
function byYearDesc(
  a: { year: number | null; title: string },
  b: { year: number | null; title: string },
): number {
  if (a.year !== b.year) {
    if (a.year === null) return 1;
    if (b.year === null) return -1;
    return b.year - a.year;
  }
  return a.title.localeCompare(b.title);
}

// A work's fields come from its own subject tags, not from its authors'.
// Author-derived fields filed a paper under whatever its authors worked on
// generally, so a deliberation paper by a game theorist landed in game theory.
function fieldIdsForTags(tags: string[]): string[] {
  return researchFieldsFor({ name: "", tags }).map((field) => field.id);
}

export async function getResearchWorks(researchers: Researcher[]): Promise<ResearchWork[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT cw.id, cw.title, cw.url,
      COALESCE(
        json_agg(json_build_object('id', r.id, 'name', r.name, 'handle', r.handle)
          ORDER BY lower(COALESCE(r.name, '')), r.name)
          FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS researchers
    FROM canonical_works cw
    LEFT JOIN researcher_canonical_works rcw ON rcw.canonical_work_id = cw.id
    LEFT JOIN researchers r ON r.id = rcw.researcher_id
    GROUP BY cw.id, cw.title, cw.url
    ORDER BY lower(cw.title), cw.title
  `) as any[];
  const catalog = loadResearchWorksCatalog();
  const researcherByName = new Map(researchers.map((researcher) => [nameKey(researcher.name), researcher]));
  const researcherById = new Map(researchers.map((researcher) => [researcher.id, researcher]));
  const canonical: ResearchWork[] = rows.map((row) => {
    const annotation = catalog.annotations[row.title];
    const linked = (row.researchers ?? []).map((researcher: any) => ({
      id: researcher.id,
      name: researcher.name ?? "",
      handle: researcher.handle ?? "",
    }));
    return {
      id: `canonical-${row.id}`,
      title: row.title,
      url: row.url ?? null,
      year: annotation?.year ?? null,
      summary: annotation?.summary ?? null,
      tier: "canonical" as const,
      // Prefer the annotation's full author list (correct order, includes
      // authors who are not in the roster); fall back to the DB links.
      authors: annotation?.authors ?? linked.map((researcher: { name: string }) => researcher.name),
      researchers: linked,
      cells: annotation?.cells ?? [],
      fieldIds: fieldIdsForTags(annotation?.tags ?? []),
    };
  });
  const additional: ResearchWork[] = catalog.additional.map((work) => {
    // researcherNames is a hand-curated list, but an author who is in the
    // directory under exactly that name belongs on the paper too — otherwise
    // the work never shows up on their profile.
    const linked = [...new Set([
      ...work.researcherNames.map(nameKey),
      ...work.authors.filter((name) => name !== "et al.").map(nameKey),
    ])]
      .map((key) => researcherByName.get(key))
      .filter((researcher): researcher is Researcher => !!researcher);
    return {
      id: `more-${work.id}`,
      title: work.title,
      url: work.url,
      year: work.year,
      summary: work.summary,
      tier: "more" as const,
      authors: work.authors,
      researchers: linked.map(({ id, name, handle }) => ({ id, name, handle })),
      cells: work.cells,
      fieldIds: fieldIdsForTags(work.tags),
    };
  });
  return [...canonical, ...additional].sort(byYearDesc);
}

export interface ResearcherProfile extends Researcher {
  involvements: { kind: string; name: string }[];
  canonicalWorks: { title: string; url: string | null; year: number | null; summary: string | null }[];
  moreWorks: { title: string; url: string; year: number; summary: string }[];
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
      SELECT cw.title, cw.url FROM researcher_canonical_works rcw
      JOIN canonical_works cw ON cw.id = rcw.canonical_work_id
      WHERE rcw.researcher_id = ${base.id}
      ORDER BY cw.title
    `,
  ]);

  const catalog = loadResearchWorksCatalog();
  return {
    ...base,
    advisesAbout: (advisor as any[])[0]?.advises_about ?? null,
    involvements: (involvements as any[]).map((i) => ({ kind: i.kind, name: i.name })),
    canonicalWorks: (works as any[])
      .map((w) => ({
        title: w.title,
        url: w.url ?? null,
        year: catalog.annotations[w.title]?.year ?? null,
        summary: catalog.annotations[w.title]?.summary ?? null,
      }))
      .sort(byYearDesc),
    // Match the atlas: a work counts as theirs if they are curated onto it or
    // credited as an author under exactly this name.
    moreWorks: catalog.additional
      .filter((work) => [...work.researcherNames, ...work.authors].some((name) => nameKey(name) === nameKey(base.name)))
      .map(({ title, url, year, summary }) => ({ title, url, year, summary }))
      .sort(byYearDesc),
  };
}
