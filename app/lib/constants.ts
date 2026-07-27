// Shared constants and small helpers, ported from the legacy build.cjs / app.js.
// Pure and isomorphic (no fs, no marked) — safe to import from any module.

export interface Frontmatter {
  [key: string]: any;
}

export interface Cell {
  summary: string;
  body: string;
  frontmatter: Frontmatter;
}

export interface MethodTag {
  name: string;
  bold?: boolean | string[];
  tabs?: string[];
}

export type TabId = "agi" | "human";

// ── SEO ────────────────────────────────────────────────────────────

export const SITE_ORIGIN = "https://www.agi-institutions.org";
export const SITE_NAME = "AGI Institutions";
export const SITE_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export const TAB_META: Record<string, { description: string; canonicalPath: string; keywords: string }> = {
  agi: {
    description:
      "An interactive map of the new institutions needed for a world of autonomous AI agents — from dyadic agent contracts to global AI governance frameworks. Explore coordination mechanisms across scales: dyadic, group, community, national, and global.",
    canonicalPath: "/",
    keywords:
      "AGI institutions, AGI governance, AI institutional design, autonomous AI agents, AI society, AI coordination, AGI policy, AI governance frameworks, institutional design for AI",
  },
  human: {
    description:
      "How existing human institutions handle coordination across scales — and how autonomous AI agents break them. Maps protocols, preferences, rights, incentives, expertise, norms, and thick commitments from dyadic to global.",
    canonicalPath: "/human/",
    keywords:
      "human institutions, institutional design, AI governance comparison, AGI society, coordination mechanisms, human-AI coordination",
  },
};

export const TABS: Record<string, { title: string; nav: string; short: string; subtitle: string }> = {
  agi: {
    title: "AGI Institutions",
    nav: "AGI Institutions",
    short: "AGI",
    subtitle: "New institutions needed for a world with powerful AI",
  },
  human: {
    title: "Existing Human Institutions",
    nav: "Existing Human Institutions",
    short: "Human",
    subtitle: "Current institutional infrastructure (how humans do alignment)",
  },
};

export const TAB_ORDER: string[] = ["human", "agi"];

export interface Vision {
  id: string;
  label: string;
  color: string;
  description: string;
}

// Visions: toggleable overlays layered onto the AGI grid. Add a vision = a new
// entry here plus content tagged with its id (frontmatter `visions:` + a
// `{vision: id}` tag on problem-set headings). No new files.
export const VISIONS: Vision[] = [
  {
    id: "fidelity",
    label: "Fidelity & Meaning",
    color: "#b34a6c",
    description:
      "Institutions that hold organizations, governments, and markets to rich, accountable mandates rather than thin, gameable proxies.",
  },
];

// Statuses whose body is published on the deployed site.
export const READY_STATUSES = new Set([
  "body_draft",
  "body_ok",
  "expert_selected",
  "expert_reviewed",
]);

export const GITHUB_REPO = "https://github.com/meaningalignment/institutions";

export interface AxisItem {
  id: string;
  name: string;
  desc: string;
}

export const ROWS: AxisItem[] = [
  { id: "dyadic", name: "Dyadic", desc: "2 parties" },
  { id: "group", name: "Group", desc: "teams, clubs" },
  { id: "community", name: "Community", desc: "orgs, cities" },
  { id: "national", name: "National", desc: "states, nations" },
  { id: "global", name: "Global", desc: "transnational" },
];

export const COLS: AxisItem[] = [
  { id: "protocols", name: "Protocols", desc: "standards & coordination" },
  { id: "preferences", name: "Preferences", desc: "aggregated wants" },
  { id: "rights", name: "Rights", desc: "formal entitlements & adjudication" },
  { id: "incentives", name: "Incentives", desc: "structured payoffs" },
  { id: "expertise", name: "Expertise", desc: "credentialed epistemic authority" },
  { id: "norms", name: "Norms", desc: "behavioral expectations" },
  { id: "thick-commitments", name: "Thick Commitments", desc: "articulated shared understanding" },
];

export interface HumanEraBucket {
  id: string;
  code: string;
  label: string;
}

export const HUMAN_ERA_BUCKETS: HumanEraBucket[] = [
  { id: "ancient", code: "An", label: "Ancient / customary" },
  { id: "ancient-medieval", code: "A-M", label: "Ancient-medieval" },
  { id: "ancient-modern", code: "A+", label: "Ancient-modern" },
  { id: "medieval-modern", code: "M+", label: "Medieval-modern" },
  { id: "early-modern-modern", code: "E+", label: "Early modern-modern" },
  { id: "twentieth", code: "20", label: "20th century" },
  { id: "industrial-digital", code: "I+", label: "Industrial-digital" },
  { id: "digital", code: "21", label: "Digital era" },
  { id: "medieval", code: "Md", label: "Medieval" },
  { id: "early-modern", code: "Em", label: "Early modern" },
  { id: "industrial", code: "In", label: "Industrial" },
];

export const HUMAN_ERA_BUCKET_IDS = new Set(HUMAN_ERA_BUCKETS.map((b) => b.id));

export function getHumanEra(
  fm: Frontmatter | undefined | null
): { label: string; bucket: string; code: string } | null {
  const label = typeof fm?.human_era === "string" ? fm.human_era.trim() : "";
  const bucket = typeof fm?.human_era_bucket === "string" ? fm.human_era_bucket.trim() : "";
  if (!label || !HUMAN_ERA_BUCKET_IDS.has(bucket)) return null;
  const meta = HUMAN_ERA_BUCKETS.find((b) => b.id === bucket)!;
  return { label, bucket, code: meta.code };
}

// Method tags for a column, filtered by tab and normalized to { name, bold }.
export function getMethodsForCol(
  colId: string,
  tabId: string,
  methods: Record<string, MethodTag[]>
): { name: string; bold: boolean }[] {
  return (methods[colId] || [])
    .filter((m) => !m.tabs || m.tabs.includes(tabId))
    .map((m) => {
      const bold = m.bold === true || (Array.isArray(m.bold) && m.bold.includes(tabId));
      return { name: m.name, bold };
    });
}

export function rowName(id: string): string {
  return ROWS.find((r) => r.id === id)?.name ?? id;
}

export function colName(id: string): string {
  return COLS.find((c) => c.id === id)?.name ?? id;
}

// Split a "{row}-{col}" cell key. The column id may contain a hyphen
// (e.g. "thick-commitments"), so the row is the first segment only.
export function splitCellKey(key: string): { row: string; col: string } {
  const parts = key.split("-");
  return { row: parts[0], col: parts.slice(1).join("-") };
}
