// Server-only content loading. The markdown/YAML under data/ is bundled at
// BUILD time by the siteContent() Vite plugin (see vite.config.ts) into the
// `virtual:site-content` module, NOT read from disk at runtime — so it ships
// inside the serverless function bundle on Vercel with no dependency on the
// repo filesystem being present at request time.

import yaml from "js-yaml";
import { extractAtGlance, extractTheoryOfChange } from "./markdown";
import type { Cell, Frontmatter, MethodTag } from "./constants";
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
