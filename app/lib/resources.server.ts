// The /resources reading lists, parsed at build time from data/resources/ (see
// app/lib/resources.ts), plus what is derived from them. Server-only.

import content from "virtual:site-content";
import { RESEARCH_FIELDS } from "./research-fields";
import type { ResearchWork, Resources } from "./resources";

export function loadResources(): Resources {
  return content.resources;
}

// Every listed work once, newest first then by title. A work on several
// fields' lists keeps its entry from the first of them in rail order.
let allWorksCache: ResearchWork[] | undefined;
export function allWorks(): ResearchWork[] {
  if (allWorksCache) return allWorksCache;
  const byUrl = new Map<string, ResearchWork>();
  for (const f of RESEARCH_FIELDS) {
    for (const w of content.resources.fields[f.id]?.works ?? []) if (!byUrl.has(w.url)) byUrl.set(w.url, w);
  }
  const title = (w: ResearchWork) => w.title.toLowerCase();
  allWorksCache = [...byUrl.values()].sort(
    (a, b) => (b.year ?? -1) - (a.year ?? -1) || (title(a) < title(b) ? -1 : title(a) > title(b) ? 1 : 0)
  );
  return allWorksCache;
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
  for (const list of Object.values(content.resources.fields)) {
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
