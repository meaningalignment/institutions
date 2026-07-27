import type { Route } from "./+types/cell";
import { buildCellDetail } from "../lib/detail.server";
import { CellDetail } from "../components/CellDetail";
import { SiteFooter } from "../components/Controls";
import { useBodyClass } from "../lib/useBodyClass";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";

export const headers = staticContentHeaders;

export function loader({ params }: Route.LoaderArgs) {
  return buildCellDetail("agi", params.row, params.col);
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData ? `${loaderData.title} — ${SITE_NAME}` : SITE_NAME;
  return [
    { title },
    {
      tagName: "link",
      rel: "canonical",
      href: `${SITE_ORIGIN}/cell/${loaderData?.rowId}/${loaderData?.colId}`,
    },
  ];
}

export default function CellRoute({ loaderData }: Route.ComponentProps) {
  useBodyClass("tab-agi viewing-detail");
  return (
    <>
      <CellDetail data={loaderData} />
      <SiteFooter />
    </>
  );
}
