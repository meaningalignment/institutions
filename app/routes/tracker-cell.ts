// The tracker requests that sit in one grid cell, as JSON. Cell pages are
// static and cached, so they fetch this after load instead of reading the
// database in their own loader.

import type { Route } from "./+types/tracker-cell";
import { getRequests } from "../lib/requests.server";
import { priority, requestStage, type Stage } from "../lib/requests";

export interface CellRequest {
  id: number;
  name: string;
  description: string;
  stage: Stage;
  sites: number;
}

export async function loader({ params }: Route.LoaderArgs) {
  const all = await getRequests();
  const requests: CellRequest[] = all
    .filter((r) => r.rows.includes(params.row) && r.cols.includes(params.col))
    .sort((a, b) => (priority(b.scores) ?? -1) - (priority(a.scores) ?? -1) || a.name.localeCompare(b.name))
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      stage: requestStage(r.links, r.sites),
      sites: r.sites.length,
    }));
  return Response.json({ requests }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
}
