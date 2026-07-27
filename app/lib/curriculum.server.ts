// Builds the curriculum page's inner HTML (sidebar + main column) server-side,
// ported from build.cjs generateCurriculumPage. The interactive reranking /
// scrollspy behavior is attached client-side by app/lib/curriculum-init.ts.

import { readDataFile, loadCurriculumMap, slugify, loadCells } from "./content.server";
import { renderMarkdown } from "./render.server";
import { esc, escapeHtml } from "./markdown";

export interface CurriculumData {
  title: string;
  innerHtml: string;
}

let curriculumCache: CurriculumData | undefined;

export function buildCurriculum(): CurriculumData {
  if (curriculumCache) return curriculumCache;
  const cells = loadCells();
  let md = readDataFile("curriculum.md");

  const title = (md.match(/^# (.+)$/m) || [, "Curriculum"])[1]!.trim();
  md = md.replace(/^# .+$/m, "").trim();

  const themes = loadCurriculumMap();

  const [intro, ...rawFields] = md.split(/(?=^## )/m);
  const introHtml = renderMarkdown(intro);

  const fields = rawFields.map((chunk) => {
    const name = (chunk.match(/^## (.+)$/m) || [, ""])[1]!.trim();
    const displayName = name.replace(/^\d+\.\s*/, "").trim();
    const body = chunk.replace(/^## .+$/m, "").replace(/\n---\s*$/m, "").trim();
    let bodyHtml = renderMarkdown(body);
    bodyHtml = bodyHtml.replace(
      /(<h3[^>]*>\s*Key concepts\s*<\/h3>\s*)<ul>/gi,
      '$1<ul class="curr-key-concepts">'
    );
    return { name: displayName, id: slugify(name), bodyHtml };
  });

  const navLink = (f: { id: string; name: string }, i: number) =>
    `<a href="#${f.id}" class="curr-toc-link">${i + 1}. ${esc(f.name)}</a>`;
  const tocHtml = fields.length
    ? `<nav class="curr-toc" aria-label="Fields">\n  ${fields.map(navLink).join("\n  ")}\n</nav>`
    : "";

  const sidebarItem = (f: { id: string; name: string }, i: number) =>
    `<li><a href="#${f.id}" class="curr-sidebar-link" data-target="${f.id}"><span class="curr-sidebar-num">${i + 1}</span><span class="curr-sidebar-label">${esc(f.name)}</span></a></li>`;
  const sidebarHtml = fields.length
    ? `<aside class="curr-sidebar" aria-label="Curriculum sections">
  <div class="curr-sidebar-title">Sections</div>
  <ul class="curr-sidebar-list">
    ${fields.map(sidebarItem).join("\n    ")}
  </ul>
</aside>`
    : "";

  const sectionsHtml = fields
    .map(
      (f, i) => `<details open class="curr-field" id="${f.id}" data-field="${f.id}">
  <summary class="curr-field-summary"><h2 class="curr-field-name"><span class="curr-field-num">${i + 1}</span><span class="curr-field-title">${esc(f.name)}</span></h2><span class="curr-field-chevron" aria-hidden="true"></span></summary>
  <div class="curr-field-body">
${f.bodyHtml}
  </div>
</details>`
    )
    .join("\n");

  // Validate theme field references (warn only, like the legacy build).
  const fieldIds = new Set(fields.map((f) => f.id));
  for (const t of themes) {
    if (!t.fields.length) console.warn(`[curriculum] theme "${t.id}" has no field references`);
    for (const fr of t.fields) {
      if (!fieldIds.has(fr.id))
        console.warn(`[curriculum] theme "${t.id}" references unknown field "${fr.id}"`);
      if (!fr.bridge || /^TODO/i.test(fr.bridge))
        console.warn(`[curriculum] theme "${t.id}" field "${fr.id}" has a TODO/empty gain line`);
    }
  }

  // Institutions: cell → themes inverse map.
  const cellThemes: Record<string, string[]> = {};
  for (const t of themes) {
    for (const cid of t.cells || []) {
      if (!cellThemes[cid]) cellThemes[cid] = [];
      if (!cellThemes[cid].includes(t.id)) cellThemes[cid].push(t.id);
    }
  }
  const institutions = Object.keys(cellThemes)
    .map((cid) => {
      const cell = cells[cid];
      if (!cell || cell.frontmatter?.hide_agi === true || !cell.summary) {
        console.warn(`[curriculum] institution "${cid}" referenced by a theme is missing or hidden`);
        return null;
      }
      return { id: cid, label: cell.summary, themes: cellThemes[cid] };
    })
    .filter((x): x is { id: string; label: string; themes: string[] } => x !== null)
    .sort((a, b) => a.label.localeCompare(b.label));

  const themeTilesHtml = themes
    .map(
      (t) => `      <button type="button" class="curr-picker-tile" role="listitem" data-theme="${esc(t.id)}">
        <span class="curr-picker-tile-label">${esc(t.label)}</span>
        <span class="curr-picker-tile-desc">${esc(t.description)}</span>
      </button>`
    )
    .join("\n");

  const instTilesHtml = institutions
    .map(
      (c) => `      <button type="button" class="curr-picker-tile curr-picker-tile-inst" role="listitem" data-cell="${esc(c.id)}">
        <span class="curr-picker-tile-label">${esc(c.label)}</span>
      </button>`
    )
    .join("\n");

  const pickerHtml =
    themes.length || institutions.length
      ? `<div class="curr-pickers" id="curr-pickers">
  <button type="button" class="curr-picker-reset" id="curr-picker-reset" hidden>Show all fields</button>
  <button type="button" class="curr-picker-change" id="curr-picker-change">Change selection <span aria-hidden="true">▸</span></button>
  ${
    themes.length
      ? `<details class="curr-picker" aria-label="Start from a problem">
    <summary class="curr-picker-summary"><span class="curr-picker-title">Start from a problem you care about</span><span class="curr-picker-chevron" aria-hidden="true"></span></summary>
    <div class="curr-picker-grid" role="list">
${themeTilesHtml}
    </div>
  </details>`
      : ""
  }
  ${
    institutions.length
      ? `<details class="curr-picker" aria-label="Start from an institution">
    <summary class="curr-picker-summary"><span class="curr-picker-title">Start from an institution we need to build</span><span class="curr-picker-chevron" aria-hidden="true"></span></summary>
    <div class="curr-picker-grid" role="list">
${instTilesHtml}
    </div>
  </details>`
      : ""
  }
</div>`
      : "";

  const themeMap: Record<string, any> = {};
  for (const t of themes) {
    themeMap[t.id] = { label: t.label, fields: t.fields.map((fr) => ({ id: fr.id, bridge: fr.bridge })) };
  }
  const cellMap: Record<string, any> = {};
  for (const c of institutions) cellMap[c.id] = { label: c.label, themes: c.themes };

  const themeMapJson =
    themes.length || institutions.length
      ? `<script type="application/json" id="curr-theme-map">${JSON.stringify({ themes: themeMap, cells: cellMap }).replace(/</g, "\\u003c")}</script>`
      : "";

  const innerHtml = `${sidebarHtml}
<div class="curr-main">
<a href="/" class="detail-back">← Back to grid</a>
<div class="curr-selection-chip" id="curr-selection-chip" hidden><span class="curr-selection-chip-kind"></span><span class="curr-selection-chip-label"></span><button type="button" class="curr-selection-chip-x" aria-label="Clear selection">×</button></div>
<div class="curr-page-title">${escapeHtml(title)}</div>
${introHtml}
${pickerHtml}
${tocHtml}
<div class="curr-fields" id="curr-fields">
${sectionsHtml}
</div>
${themeMapJson}
</div>`;

  curriculumCache = { title, innerHtml };
  return curriculumCache;
}
