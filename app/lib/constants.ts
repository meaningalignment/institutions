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

// Minimal cell shape sent to grid routes. Full Markdown bodies and expanded
// At-a-glance / theory fields stay on the server for detail-page rendering.
export interface GridCell {
  summary: string;
  hiddenOnAgi: boolean;
  hiddenOnHuman: boolean;
  status?: string;
  visions?: Record<string, string>;
  hasTheory: boolean;
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
    subtitle: "How human coordination infrastructure accumulated over time",
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

export interface HumanTimelinePoint {
  id: string;
  date: string;
  label: string;
  description: string;
}

export interface HumanInstitution {
  id: string;
  name: string;
  since: string;
  era: string;
}

export interface HumanInstitutionCell {
  title: string;
  institutions: HumanInstitution[];
}

export interface HumanInstitutionsData {
  timeline: HumanTimelinePoint[];
  methodNote: string;
  cells: Record<string, HumanInstitutionCell>;
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
