import type { Route } from "./+types/human";
import { loadGridCells, loadHumanInstitutions } from "../lib/content.server";
import { Grid } from "../components/Grid";
import { useBodyClass } from "../lib/useBodyClass";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN, TAB_META, TABS } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";

export const headers = staticContentHeaders;

let humanLoaderCache:
  | {
      cells: ReturnType<typeof loadGridCells>;
      humanInstitutions: ReturnType<typeof loadHumanInstitutions>;
    }
  | undefined;

export function meta(_: Route.MetaArgs) {
  const m = TAB_META.human;
  const title = `${TABS.human.title} — ${SITE_NAME}`;
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

export function loader(_: Route.LoaderArgs) {
  if (!humanLoaderCache) {
    humanLoaderCache = {
      cells: loadGridCells(),
      humanInstitutions: loadHumanInstitutions(),
    };
  }
  return humanLoaderCache;
}

export default function Human({ loaderData }: Route.ComponentProps) {
  useBodyClass("tab-human");
  return (
    <>
      <div id="grid-view">
        <Grid
          tabId="human"
          cells={loaderData.cells}
          humanInstitutions={loaderData.humanInstitutions}
        />
      </div>
    </>
  );
}
