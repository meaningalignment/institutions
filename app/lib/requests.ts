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
  readMoreUrl: string;
  siteHints: string;
  sites: RequestSite[];
}

export const REQUEST_FIELDS = ["name", "vision", "row", "column", "description", "readMoreUrl", "siteHints"] as const;
export const SITE_FIELDS = ["name", "instead", "pain", "success", "status"] as const;

export interface RequestVision {
  id: string;
  label: string;
  url: string;
}
