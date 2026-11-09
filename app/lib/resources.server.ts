// The /resources reading lists, parsed at build time from data/resources/ (see
// app/lib/resources.ts), plus what is derived from them. Server-only.

import content from "virtual:site-content";
import { RESOURCE_FIELDS } from "./research-fields";
import type { Resources } from "./resources";

export function loadResources(): Resources {
  return content.resources;
}

// Grid cell ("{row}-{col}") → the research fields it draws on most: the top
// three by number of works on that field's list naming the cell. One map
// drives the cell pages' "Further reading", the grid's field highlight and
// research-fields row, and /resources' "Relevant for".
export type CellFieldMap = Record<string, string[]>;
const CELL_FIELDS_PER_CELL = 3;
let cellFieldsCache: CellFieldMap | undefined;

export function getCellFieldMap(): CellFieldMap {
  if (cellFieldsCache) return cellFieldsCache;
  const counts: Record<string, Record<string, number>> = {};
  const shown = new Set(RESOURCE_FIELDS.map((f) => f.id));
  for (const list of Object.values(content.resources.fields)) {
    if (!shown.has(list.id)) continue;
    for (const work of list.works) {
      for (const cell of work.cells) {
        const fields = (counts[cell] ??= {});
        fields[list.id] = (fields[list.id] ?? 0) + 1;
      }
    }
  }
  const data: CellFieldMap = {};
  for (const cell of Object.keys(counts).sort()) {
    data[cell] = Object.entries(counts[cell])
      .sort(([a, x], [b, y]) => y - x || (a < b ? -1 : 1))
      .slice(0, CELL_FIELDS_PER_CELL)
      .map(([id]) => id);
  }
  cellFieldsCache = data;
  return data;
}
