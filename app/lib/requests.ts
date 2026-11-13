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
  links: RequestLink[];
  sites: RequestSite[];
}

// Links attached to a request. A "case" argues the institution is needed, a
// "project" is a group designing it now, a "design" proposes one, a "test"
// reports on trying one. The request's stage
// follows from its links rather than being set by hand.
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

export const REQUEST_FIELDS = ["name", "vision", "row", "column", "description", "siteHints", "links"] as const;
export const SITE_FIELDS = ["name", "instead", "pain", "success", "status"] as const;

export interface RequestVision {
  id: string;
  label: string;
  url: string;
}
