import type { Route } from "./+types/cell";
import { buildCellDetail } from "../lib/detail.server";
import { CellDetail } from "../components/CellDetail";
import { useBodyClass } from "../lib/useBodyClass";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";
import { getCellFieldMap, type CellFieldMap } from "../lib/researchers.server";
import { RESEARCH_FIELDS } from "../lib/research-fields";

export const headers = staticContentHeaders;

export async function loader({ params }: Route.LoaderArgs) {
  const detail = buildCellDetail("agi", params.row, params.col);
  // "Further reading" is a nicety; a DB hiccup shouldn't take the cell down.
  const fieldMap = await getCellFieldMap().catch(() => ({}) as CellFieldMap);
  const resourceFields = (fieldMap[`${params.row}-${params.col}`] ?? []).flatMap((id) => {
    const field = RESEARCH_FIELDS.find((f) => f.id === id);
    return field ? [{ id: field.id, label: field.label }] : [];
  });
  return { ...detail, resourceFields };
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
    { property: "og:title", content: title },
    ...OG_IMAGE_META,
  ];
}

export default function CellRoute({ loaderData }: Route.ComponentProps) {
  useBodyClass("tab-agi viewing-detail");
  return (
    <>
      <CellDetail data={loaderData} resourceFields={loaderData.resourceFields} />
    </>
  );
}
