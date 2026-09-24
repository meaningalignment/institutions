import type { Route } from "./+types/home";
import { loadGridCells } from "../lib/content.server";
import { Grid } from "../components/Grid";
import { useBodyClass } from "../lib/useBodyClass";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN, TAB_META, TABS } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";
import { getCellFieldMap, type CellFieldMap } from "../lib/researchers.server";

export const headers = staticContentHeaders;

let homeLoaderCache:
  | { cells: ReturnType<typeof loadGridCells> }
  | undefined;

export function meta(_: Route.MetaArgs) {
  const m = TAB_META.agi;
  const title = `${TABS.agi.title} — ${SITE_NAME}`;
  const canonical = `${SITE_ORIGIN}${m.canonicalPath}`;
  return [
    { title },
    { name: "description", content: m.description },
    { name: "keywords", content: m.keywords },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: m.description },
    { property: "og:url", content: canonical },
    ...OG_IMAGE_META,
  ];
}

export async function loader(_: Route.LoaderArgs) {
  if (!homeLoaderCache) {
    homeLoaderCache = { cells: loadGridCells() };
  }
  // The research-fields row and ?field= highlight are extras; if the DB is
  // unavailable the grid renders without them.
  const cellFields = await getCellFieldMap().catch(() => ({}) as CellFieldMap);
  return { ...homeLoaderCache, cellFields };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  useBodyClass("tab-agi");
  return (
    <>
      <div id="grid-view">
        <Grid tabId="agi" cells={loaderData.cells} cellFields={loaderData.cellFields} />
      </div>
    </>
  );
}
