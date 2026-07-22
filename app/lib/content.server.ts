// Server-only content loading. The markdown/YAML under data/ is bundled at
// BUILD time by the siteContent() Vite plugin (see vite.config.ts) into the
// `virtual:site-content` module, NOT read from disk at runtime — so it ships
// inside the serverless function bundle on Vercel with no dependency on the
// repo filesystem being present at request time.

import yaml from "js-yaml";
import { extractAtGlance, extractTheoryOfChange } from "./markdown";
import { COLS, ROWS, type Cell, type Frontmatter, type HumanInstitutionsData, type MethodTag } from "./constants";
import content from "virtual:site-content";

// cells / methods are keyed by filename stem; root is keyed by full filename.
const cellsByKey = content.cells;
const methodsByCol = content.methods;
const rootByName = content.root;

function baseName(p: string): string {
  return p.slice(p.lastIndexOf("/") + 1);
}

// Parse a cell markdown file: YAML frontmatter + H1 title, then fold the
// `## At a glance` and `## Theory of change` sections into frontmatter fields
// (and strip them from the body) so the summary/impact renderers can read them.
export function parseCell(raw: string): Cell {
  let frontmatter: Frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    try {
      frontmatter = (yaml.load(fmMatch[1]) as Frontmatter) || {};
    } catch {
      frontmatter = {};
    }
    raw = raw.slice(fmMatch[0].length);
  }

  const h1Match = raw.match(/^#\s+(.+)$/m);
  const summary = h1Match ? h1Match[1].trim() : "";
  const bodyAfterH1 = h1Match
    ? raw.slice(raw.indexOf("\n", raw.indexOf(h1Match[0])) + 1).trim()
    : raw;

  const ag = extractAtGlance(bodyAfterH1);
  if (ag.problem) frontmatter.problem = ag.problem;
  if (ag.examples) frontmatter.examples = ag.examples;
  if (ag.examplesNotes) frontmatter.examples_notes = ag.examplesNotes;
  if (ag.agiBreaks) frontmatter.agi_breaks = ag.agiBreaks;
  if (ag.agiBreaksNotes) frontmatter.agi_breaks_notes = ag.agiBreaksNotes;
  if (ag.notes) frontmatter.at_glance_notes = ag.notes;

  const toc = extractTheoryOfChange(ag.body);
  Object.assign(frontmatter, toc.fields);

  return { summary, body: toc.body, frontmatter };
}

// Read a single cell by "{row}-{col}" key. Returns null if missing.
export function loadCell(key: string): Cell | null {
  const raw = cellsByKey[key];
  return raw ? parseCell(raw) : null;
}

// Load every cell keyed by "{row}-{col}".
export function loadCells(): Record<string, Cell> {
  const cells: Record<string, Cell> = {};
  for (const [key, raw] of Object.entries(cellsByKey)) cells[key] = parseCell(raw);
  return cells;
}

// Column-level method tags (bottom row of the grid), keyed by column id.
export function loadMethods(): Record<string, MethodTag[]> {
  const methods: Record<string, MethodTag[]> = {};
  for (const [colId, raw] of Object.entries(methodsByCol)) {
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = yaml.load(fmMatch[1]) as { methods?: MethodTag[] };
      methods[colId] = fm?.methods || [];
    } else {
      methods[colId] = [];
    }
  }
  return methods;
}

// Dedicated, dated source for the Existing Human Institutions grid. Each cell
// contains multiple institution records that enter at a named timeline stop.
export function loadHumanInstitutions(): HumanInstitutionsData {
  const src = rootByName["human-institutions.json"];
  if (!src) throw new Error("content file not found: data/human-institutions.json");

  let data: HumanInstitutionsData;
  try {
    data = JSON.parse(src) as HumanInstitutionsData;
  } catch (error: any) {
    throw new Error(`could not parse human-institutions.json: ${error.message}`);
  }

  if (!Array.isArray(data.timeline) || !data.timeline.length || !data.cells) {
    throw new Error("human-institutions.json must define a non-empty timeline and cells object");
  }

  const errors: string[] = [];
  const eraIds = new Set<string>();
  for (const point of data.timeline) {
    if (!point.id || !point.date || !point.label || !point.description) {
      errors.push("timeline points require id, date, label, and description");
    }
    if (eraIds.has(point.id)) errors.push(`duplicate timeline id ${point.id}`);
    eraIds.add(point.id);
  }

  const expectedCellKeys = new Set(ROWS.flatMap((row) => COLS.map((col) => `${row.id}-${col.id}`)));
  for (const expectedKey of expectedCellKeys) {
    if (!data.cells[expectedKey]) errors.push(`missing cell ${expectedKey}`);
  }
  for (const actualKey of Object.keys(data.cells)) {
    if (!expectedCellKeys.has(actualKey)) errors.push(`unknown cell ${actualKey}`);
  }

  for (const [cellKey, cell] of Object.entries(data.cells)) {
    if (!cell.title || !Array.isArray(cell.institutions)) errors.push(`${cellKey}: missing title or institutions`);
    const recordIds = new Set<string>();
    let previousEraIndex = -1;
    for (const institution of cell.institutions || []) {
      if (!institution.id || !institution.name || !institution.since) {
        errors.push(`${cellKey}: institution records require id, name, and since`);
      }
      const eraIndex = data.timeline.findIndex((point) => point.id === institution.era);
      if (eraIndex < 0) errors.push(`${cellKey}/${institution.id}: unknown era ${institution.era}`);
      if (eraIndex >= 0 && eraIndex < previousEraIndex) {
        errors.push(`${cellKey}/${institution.id}: institutions must follow timeline order`);
      }
      previousEraIndex = Math.max(previousEraIndex, eraIndex);
      if (recordIds.has(institution.id)) errors.push(`${cellKey}: duplicate institution id ${institution.id}`);
      recordIds.add(institution.id);
    }
  }
  if (errors.length) throw new Error(`invalid human-institutions.json:\n${errors.join("\n")}`);

  return data;
}

// A method column's full page (parsed like a cell: H1 + body).
export function loadMethodCell(colId: string): Cell | null {
  const raw = methodsByCol[colId];
  return raw ? parseCell(raw) : null;
}

// ── Curriculum ─────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface CurriculumTheme {
  id: string;
  label: string;
  description: string;
  cells: string[];
  fields: { id: string; bridge: string }[];
}

// Load the entry-axis taxonomy from data/curriculum-map.yaml. Missing → [].
export function loadCurriculumMap(): CurriculumTheme[] {
  const src = rootByName["curriculum-map.yaml"];
  if (!src) return [];
  let doc: any;
  try {
    doc = yaml.load(src) || {};
  } catch (e: any) {
    console.warn(`[curriculum] could not parse curriculum-map.yaml: ${e.message}`);
    return [];
  }
  const themes = Array.isArray(doc.themes) ? doc.themes : [];
  return themes.map((t: any) => ({
    id: t.id || slugify(t.label || ""),
    label: t.label || "",
    description: t.description || "",
    cells: Array.isArray(t.cells) ? t.cells : [],
    fields: (Array.isArray(t.fields) ? t.fields : []).map((f: any) => ({
      id: f.id,
      bridge: (f.gain || "").trim(),
    })),
  }));
}

// Raw markdown files that whole-page routes parse themselves (curriculum.md,
// theory-of-change.md). `relPath` may include a leading dir which is ignored.
export function readDataFile(relPath: string): string {
  const name = baseName(relPath);
  const src = rootByName[name];
  if (src == null) throw new Error(`content file not found: ${relPath}`);
  return src;
}
