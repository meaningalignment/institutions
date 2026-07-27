import type { Route } from "./+types/human";
import { loadCells, loadMethods } from "../lib/content.server";
import { Grid } from "../components/Grid";
import { Controls, SiteFooter } from "../components/Controls";
import { useBodyClass } from "../lib/useBodyClass";
import { SITE_NAME, SITE_ORIGIN, SITE_OG_IMAGE, TAB_META, TABS } from "../lib/constants";

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
    { property: "og:image", content: SITE_OG_IMAGE },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export function loader(_: Route.LoaderArgs) {
  return { cells: loadCells(), methods: loadMethods() };
}

export default function Human({ loaderData }: Route.ComponentProps) {
  useBodyClass("tab-human");
  return (
    <>
      <Controls tabId="human" />
      <div id="grid-view">
        <Grid tabId="human" cells={loaderData.cells} methods={loaderData.methods} />
      </div>
      <SiteFooter />
    </>
  );
}
