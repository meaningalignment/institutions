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

export interface InstitutionRequest {
  id: number;
  name: string;
  vision: string | null;
  row: string;
  column: string;
  description: string;
  siteHints: string;
  papers: RequestPaper[];
  sites: RequestSite[];
}

// Papers attached to a request. A "case" argues the institution is needed, a
// "design" proposes one, a "test" reports on trying one. The request's stage
// follows from its papers rather than being set by hand.
export const PAPER_KINDS = ["case", "design", "test"] as const;
export type PaperKind = (typeof PAPER_KINDS)[number];
export const PAPER_KIND_LABEL: Record<PaperKind, string> = { case: "Case", design: "Design", test: "Test report" };

export interface RequestPaper {
  kind: PaperKind;
  title: string;
  url: string;
}

export const STAGES = ["wanted", "designed", "tested"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = { wanted: "Design wanted", designed: "Designed", tested: "Tested" };

export function requestStage(papers: RequestPaper[]): Stage {
  if (papers.some((p) => p.kind === "test")) return "tested";
  if (papers.some((p) => p.kind === "design")) return "designed";
  return "wanted";
}

export const REQUEST_FIELDS = ["name", "vision", "row", "column", "description", "siteHints", "papers"] as const;
export const SITE_FIELDS = ["name", "instead", "pain", "success", "status"] as const;

export interface RequestVision {
  id: string;
  label: string;
  url: string;
}
