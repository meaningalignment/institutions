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
//  leverage: how much shaping it now changes how it turns out, because early
//            designs lock in the pattern (5 = a great deal)
// Priority to work on = leverage × (6 − likely): shapeable now and otherwise neglected.
export interface RequestScores {
  likely: number | null;
  soon: number | null;
  leverage: number | null;
}
export const SCORE_KEYS = ["likely", "soon", "leverage"] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];
export const SCORE_LABEL: Record<ScoreKey, string> = {
  likely: "Likely anyway",
  soon: "Soon to apply",
  leverage: "Leverage",
};
export const SCORE_HELP: Record<ScoreKey, string> = {
  likely: "How likely it gets built anyway, without anyone pushing for it (5 = surely)",
  soon: "How soon it can find real application (5 = now)",
  leverage: "How much shaping it now changes how it turns out; early designs lock in the pattern (5 = a great deal)",
};

export function priority(s: RequestScores): number | null {
  if (s.likely == null || s.leverage == null) return null;
  return s.leverage * (6 - s.likely);
}

// Links attached to a request. A "case" argues the institution is needed, a
// "project" is a group designing it now, a "design" proposes one, a "test"
// reports on trying one, and a "use" is a place where it is in real use. The
// request's stage follows from its links rather than being set by hand.
export const LINK_KINDS = ["case", "project", "design", "test", "use"] as const;
export type LinkKind = (typeof LINK_KINDS)[number];
export const LINK_KIND_LABEL: Record<LinkKind, string> = { case: "Case", project: "Project", design: "Design", test: "Test report", use: "In use" };

export interface RequestLink {
  kind: LinkKind;
  title: string;
  url: string;
}

export const STAGES = ["wanted", "designing", "designed", "tested", "inuse"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = { wanted: "Design wanted", designing: "In design", designed: "Designed", tested: "Tested", inuse: "In use" };

export function requestStage(links: RequestLink[]): Stage {
  if (links.some((p) => p.kind === "use")) return "inuse";
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
