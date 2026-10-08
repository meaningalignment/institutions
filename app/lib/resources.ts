// Parser for the /resources reading lists in data/resources/. Runs at BUILD
// time inside the siteContent() Vite plugin (vite.config.ts), which ships the
// parsed result in `virtual:site-content`. A malformed file therefore fails
// the build with its file and line, rather than silently dropping an entry.
// Kept free of server-only and virtual imports so vite.config.ts can load it.
//
// File format (README.md documents it for contributors):
//   {field-id}.md  frontmatter (curator, curator_bio, email), "# {Field label}",
//                  the blurb paragraph, then "## Selected papers" /
//                  "## Work in the field" / "## Foundations", each a list of
//                  entries. Entries appear on the page in file order.
//   elsewhere.md   "# Elsewhere", an intro paragraph, entries with By / Note.
//   people.md      "- [Name](url)" lines; names link there wherever they
//                  appear as an author or curator.
// An entry is "- [Title](url)" followed by indented "  - Key: value" lines.
// HTML comments are ignored, so an entry can be hidden by commenting it out.

import yaml from "js-yaml";

export type ResourceSection = "selected" | "field" | "background";

export const SECTION_HEADINGS: Record<string, ResourceSection> = {
  "Selected papers": "selected",
  "Work in the field": "field",
  Foundations: "background",
};

export const WORK_TYPES = [
  "Peer-reviewed",
  "Preprint",
  "Workshop paper",
  "Essay",
  "Report",
  "Book",
  "Book chapter",
  "Lecture",
];

export interface ResearchWork {
  title: string;
  url: string;
  authors: string[];
  year: number | null;
  venue: string | null;
  type: string | null;
  summary: string | null;
  section: ResourceSection;
  // Grid cells ("{row}-{col}") the work bears on.
  cells: string[];
}

export interface FieldList {
  id: string;
  blurb: string;
  curator: string | null;
  curatorBio: string | null;
  email: string | null;
  // In file order, which is page order within each section.
  works: ResearchWork[];
}

export interface ElsewhereItem {
  title: string;
  url: string;
  by: string;
  note: string;
}

export interface Resources {
  fields: Record<string, FieldList>;
  elsewhere: { intro: string; items: ElsewhereItem[] };
  // researcherKey(name) → profile URL.
  people: Record<string, string>;
}

// Matches an author string to a people.md name despite middle initials,
// accents and hyphenation: "Joel Z. Leibo" and "Joel Leibo" both key to
// "joel leibo", "Tan Zhi-Xuan" and "Tan Zhi Xuan" to "tan xuan".
export function researcherKey(name: string): string {
  const parts = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((part) => part.length > 1);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts.join("");
}

interface Entry {
  title: string;
  url: string;
  line: number;
  props: Record<string, string>;
}

interface ParsedFile {
  frontmatter: Record<string, unknown>;
  h1: string | null;
  intro: string;
  sections: { heading: string | null; line: number; entries: Entry[] }[];
}

const ENTRY_RE = /^- \[(.+)\]\((\S+)\)\s*$/;
const PROP_RE = /^ {2,}- ([A-Za-z]+):\s*(.*)$/;

function parseFile(raw: string, file: string, errors: string[]): ParsedFile {
  // Blank out comments but keep their newlines, so line numbers stay true.
  let text = raw.replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ""));
  let offset = 0;
  let frontmatter: Record<string, unknown> = {};
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    try {
      frontmatter = (yaml.load(fm[1]) as Record<string, unknown>) || {};
    } catch (e: any) {
      errors.push(`${file}:1: could not read the frontmatter: ${e.message}`);
    }
    offset = fm[0].split("\n").length - 1;
    text = text.slice(fm[0].length);
  }

  const out: ParsedFile = { frontmatter, h1: null, intro: "", sections: [] };
  const intro: string[] = [];
  let section: ParsedFile["sections"][number] | null = null;
  let entry: Entry | null = null;
  let lastKey: string | null = null;

  text.split("\n").forEach((line, i) => {
    const n = i + 1 + offset;
    const where = `${file}:${n}`;
    if (!line.trim()) {
      lastKey = null;
      return;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^# (.+)$/))) {
      out.h1 = m[1].trim();
    } else if ((m = line.match(/^## (.+)$/))) {
      section = { heading: m[1].trim(), line: n, entries: [] };
      out.sections.push(section);
      entry = null;
    } else if ((m = line.match(ENTRY_RE))) {
      if (!section) {
        section = { heading: null, line: n, entries: [] };
        out.sections.push(section);
      }
      entry = { title: m[1].trim(), url: m[2], line: n, props: {} };
      section.entries.push(entry);
      lastKey = null;
    } else if ((m = line.match(PROP_RE))) {
      if (!entry) return void errors.push(`${where}: "${m[1]}" isn't under an entry ("- [Title](https://…)").`);
      const key = m[1].toLowerCase();
      if (key in entry.props) errors.push(`${where}: "${m[1]}" is listed twice for this entry.`);
      entry.props[key] = m[2].trim();
      lastKey = key;
    } else if (entry && lastKey && /^ {4,}\S/.test(line)) {
      // A long value wrapped onto an indented line.
      entry.props[lastKey] = `${entry.props[lastKey]} ${line.trim()}`.trim();
    } else if (!section && out.h1 && !/^\s/.test(line)) {
      intro.push(line.trim());
    } else if (line.startsWith("- ")) {
      errors.push(`${where}: an entry must look like "- [Title](https://…)".`);
    } else {
      errors.push(`${where}: couldn't read this line. Entry details go on indented "  - Key: value" lines.`);
    }
  });
  out.intro = intro.join(" ");
  return out;
}

function checkKeys(entry: Entry, allowed: string[], file: string, errors: string[]) {
  for (const key of Object.keys(entry.props)) {
    if (!allowed.includes(key)) {
      const list = allowed.map((k) => k[0].toUpperCase() + k.slice(1)).join(", ");
      errors.push(`${file}:${entry.line}: unknown detail "${key}" (use ${list}).`);
    }
  }
  if (!/^https?:\/\//.test(entry.url)) errors.push(`${file}:${entry.line}: the link must start with https://.`);
}

const WORK_KEYS = ["authors", "year", "venue", "type", "cells", "summary"];
const FIELD_FRONTMATTER = ["curator", "curator_bio", "email"];

function parseWork(entry: Entry, section: ResourceSection, cellKeys: Set<string>, file: string, errors: string[]): ResearchWork {
  checkKeys(entry, WORK_KEYS, file, errors);
  const p = entry.props;
  const where = `${file}:${entry.line}`;
  const list = (v: string | undefined) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  let year: number | null = null;
  if (p.year) {
    if (/^\d{4}$/.test(p.year)) year = Number(p.year);
    else errors.push(`${where}: Year should be four digits, not "${p.year}".`);
  }
  let type: string | null = null;
  if (p.type) {
    type = WORK_TYPES.find((t) => t.toLowerCase() === p.type.toLowerCase()) ?? null;
    if (!type) errors.push(`${where}: unknown Type "${p.type}" (use one of: ${WORK_TYPES.join(", ")}).`);
  }
  const cells = list(p.cells);
  for (const cell of cells) {
    if (!cellKeys.has(cell)) errors.push(`${where}: unknown cell "${cell}" (use a file name from data/cells, without .md).`);
  }
  return {
    title: entry.title,
    url: entry.url,
    authors: list(p.authors),
    year,
    venue: p.venue || null,
    type,
    summary: p.summary || null,
    section,
    cells,
  };
}

// `files` maps a file name in data/resources ("legal-theory.md") to its text.
// Throws one error listing every problem found.
export function parseResources(
  files: Record<string, string>,
  fields: { id: string; label: string }[],
  cellKeys: Set<string>,
): Resources {
  const errors: string[] = [];
  const result: Resources = { fields: {}, elsewhere: { intro: "", items: [] }, people: {} };
  const fieldIds = new Set(fields.map((f) => f.id));

  for (const [name, raw] of Object.entries(files)) {
    const file = `data/resources/${name}`;
    const stem = name.replace(/\.md$/, "");
    const parsed = parseFile(raw, file, errors);

    if (stem === "people") {
      for (const s of parsed.sections) {
        for (const e of s.entries) {
          checkKeys(e, [], file, errors);
          result.people[researcherKey(e.title)] ??= e.url;
        }
      }
    } else if (stem === "elsewhere") {
      result.elsewhere.intro = parsed.intro;
      for (const s of parsed.sections) {
        for (const e of s.entries) {
          checkKeys(e, ["by", "note"], file, errors);
          result.elsewhere.items.push({ title: e.title, url: e.url, by: e.props.by ?? "", note: e.props.note ?? "" });
        }
      }
    } else if (fieldIds.has(stem)) {
      const label = fields.find((f) => f.id === stem)!.label;
      if (parsed.h1 !== label) errors.push(`${file}: the title should be "# ${label}" (field names are set in app/lib/research-fields.ts).`);
      const fm = parsed.frontmatter;
      for (const key of Object.keys(fm)) {
        if (!FIELD_FRONTMATTER.includes(key)) errors.push(`${file}: unknown frontmatter "${key}" (use ${FIELD_FRONTMATTER.join(", ")}).`);
      }
      const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
      const list: FieldList = {
        id: stem,
        blurb: parsed.intro,
        curator: str(fm.curator),
        curatorBio: str(fm.curator_bio),
        email: str(fm.email),
        works: [],
      };
      const seen = new Set<string>();
      for (const s of parsed.sections) {
        const section = s.heading ? SECTION_HEADINGS[s.heading] : undefined;
        if (!section) {
          const allowed = Object.keys(SECTION_HEADINGS).map((h) => `"## ${h}"`).join(", ");
          errors.push(`${file}:${s.line}: entries must sit under ${allowed}.`);
          continue;
        }
        for (const e of s.entries) {
          if (seen.has(e.url)) errors.push(`${file}:${e.line}: this link is already listed in this file.`);
          seen.add(e.url);
          list.works.push(parseWork(e, section, cellKeys, file, errors));
        }
      }
      result.fields[stem] = list;
    } else if (name !== "README.md") {
      errors.push(`${file}: not a field. Field files are named after a field id: ${[...fieldIds].join(", ")}.`);
    }
  }

  for (const f of fields) {
    if (!result.fields[f.id]) errors.push(`data/resources/${f.id}.md is missing.`);
  }
  if (errors.length) throw new Error(`Problems in data/resources:\n  ${errors.join("\n  ")}`);
  return result;
}
