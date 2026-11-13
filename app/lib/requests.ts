// Shared (isomorphic) types for /requests. Queries live in requests.server.ts.

export const REQUEST_STATUSES = ["wanted", "building", "trialing"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface RequestSite {
  id: number;
  name: string;
  instead: string;
  pain: string;
  success: string;
  status: RequestStatus;
}

// A request can sit at several grid rows (scales) and columns, and be seen
// through several lenses. The first row and column are its home cell, used
// for the cell link.
export interface InstitutionRequest {
  id: number;
  name: string;
  rows: string[];
  cols: string[];
  lenses: string[];
  description: string;
  siteHints: string;
  scores: RequestScores;
  links: RequestLink[];
  sites: RequestSite[];
}

// Three 1–5 judgments used for ranking (null = not scored yet).
//  likely: how likely it gets built anyway, without anyone pushing (5 = surely)
//  soon:   how soon it can find real application (5 = now)
//  impact: how much it matters if it exists (5 = a lot)
// Priority to work on = impact × (6 − likely): important and otherwise neglected.
export interface RequestScores {
  likely: number | null;
  soon: number | null;
  impact: number | null;
}
export const SCORE_KEYS = ["likely", "soon", "impact"] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];
export const SCORE_LABEL: Record<ScoreKey, string> = {
  likely: "Likely anyway",
  soon: "Soon to apply",
  impact: "Impact",
};
export const SCORE_HELP: Record<ScoreKey, string> = {
  likely: "How likely it gets built anyway, without anyone pushing for it (5 = surely)",
  soon: "How soon it can find real application (5 = now)",
  impact: "How much it matters if it exists (5 = a great deal)",
};

export function priority(s: RequestScores): number | null {
  if (s.likely == null || s.impact == null) return null;
  return s.impact * (6 - s.likely);
}

// Links attached to a request. A "case" argues the institution is needed, a
// "project" is a group designing it now, a "design" proposes one, a "test"
// reports on trying one. The request's stage follows from its links rather
// than being set by hand.
export const LINK_KINDS = ["case", "project", "design", "test"] as const;
export type LinkKind = (typeof LINK_KINDS)[number];
export const LINK_KIND_LABEL: Record<LinkKind, string> = { case: "Case", project: "Project", design: "Design", test: "Test report" };

export interface RequestLink {
  kind: LinkKind;
  title: string;
  url: string;
}

export const STAGES = ["wanted", "designing", "designed", "tested"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = { wanted: "Design wanted", designing: "In design", designed: "Designed", tested: "Tested" };

export function requestStage(links: RequestLink[]): Stage {
  if (links.some((p) => p.kind === "test")) return "tested";
  if (links.some((p) => p.kind === "design")) return "designed";
  if (links.some((p) => p.kind === "project")) return "designing";
  return "wanted";
}

export interface RequestLens {
  id: string;
  label: string;
  url: string;
}
