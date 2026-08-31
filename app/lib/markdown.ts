// Pure markdown/string transforms and HTML-string builders, ported verbatim in
// behavior from the legacy build.cjs / app.js. No fs, no marked import here —
// these run on marked's output or on raw markdown text and are isomorphic.

import {
  VISIONS,
  type Cell,
  type Frontmatter,
} from "./constants";

// ── Escaping ───────────────────────────────────────────────────────

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;");
}

export function escapeHtml(s: unknown): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Like escapeHtml, but lets `{>> note <<}` markers through as trusted
// <span class="editorial">…</span>, and turns [text](https://…) into links.
export function escapeRich(s: unknown): string {
  return escapeHtml(s)
    .replace(
      /\{&gt;&gt;\s*([\s\S]*?)\s*&lt;&lt;\}/g,
      '<span class="editorial">$1</span>'
    )
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
}

// Inline editorial notes: {>> note text <<} → <span class="editorial">…</span>.
export function processEditorial(md: string): string {
  return md.replace(/\{>>\s*([\s\S]*?)\s*<<\}/g, (_, content: string) => {
    const safe = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="editorial">${safe}</span>`;
  });
}

// Parse a trailing `{vision: id}` tag off a problem-set heading.
export function parseVisionTag(title: string): { title: string; vision: string | null } {
  const mm = title.match(/\s*\{vision:\s*([a-z0-9_-]+)\s*\}\s*$/i);
  if (!mm) return { title, vision: null };
  return { title: title.slice(0, mm.index).trim(), vision: mm[1].toLowerCase() };
}

// ── HTML post-processing (operates on marked output) ───────────────

// Wrap any paragraph that opens with "A vivid case:" in a styled callout.
export function renderVividCases(html: string): string {
  return html.replace(
    /<p>A vivid case:\s*([\s\S]*?)<\/p>/g,
    '<aside class="vivid-case"><span class="vivid-case-label">A vivid case</span><p>$1</p></aside>'
  );
}

// Wrap the "Design choices…" paragraph + following <ol> in a collapsible.
export function wrapDesignChoices(html: string): string {
  const re =
    /<p><strong>Design choices the team must take a position on\.?<\/strong><\/p>\s*<ol>([\s\S]*?)<\/ol>/g;
  return html.replace(re, (_, items: string) => {
    return `<details class="design-choices"><summary><span>Design choices</span><span class="collapsible-chevron" aria-hidden="true"></span></summary><ol>${items}</ol></details>`;
  });
}

// Wrap each H3 under the Design Challenges H2 in a numbered entry.
export function wrapProblemSets(html: string): string {
  const headerMatch = html.match(
    /<h2[^>]*>\s*(?:Design Challenges|Problem Sets)\s*<\/h2>/i
  );
  if (!headerMatch) return html;
  const startIdx = headerMatch.index! + headerMatch[0].length;
  const rest = html.slice(startIdx);
  const nextH2 = rest.match(/<h2[^>]*>/);
  const sectionEnd = nextH2 ? startIdx + nextH2.index! : html.length;
  const section = html.slice(startIdx, sectionEnd);

  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
  const h3s: { start: number; end: number; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h3Re.exec(section)) !== null) {
    h3s.push({ start: m.index, end: m.index + m[0].length, title: m[1] });
  }
  if (h3s.length === 0) return html;

  let wrapped = section.slice(0, h3s[0].start);
  h3s.forEach((h, i) => {
    const bodyEnd = i + 1 < h3s.length ? h3s[i + 1].start : section.length;
    const body = section.slice(h.end, bodyEnd).trim();
    const parsed = parseVisionTag(h.title);
    const dataAttr = parsed.vision ? ` data-vision="${parsed.vision}"` : "";
    wrapped += `<div class="ps-detail-entry"${dataAttr}>`;
    wrapped += `<div class="ps-detail-header"><span class="ps-detail-number">${i + 1}</span><span class="ps-detail-title">${parsed.title}</span></div>`;
    wrapped += `<div class="ps-detail-body">${body}</div>`;
    wrapped += `</div>`;
  });

  return html.slice(0, startIdx) + wrapped + html.slice(sectionEnd);
}

// Wrap each top-level `## …` collapsible section (body sections) in <details>.
export function wrapCollapsibleSections(html: string, problemSetsPrefix?: string): string {
  const targets = new Set([
    "How humans solve this today",
    "Where AGI breaks it",
    "Design Challenges",
    "Problem Sets",
  ]);
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const matches: { start: number; end: number; title: string; full: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Re.exec(html)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, title: m[1].trim(), full: m[0] });
  }
  if (matches.length === 0) return html;

  let out = "";
  let cursor = 0;
  matches.forEach((h, i) => {
    const sectionEnd = i + 1 < matches.length ? matches[i + 1].start : html.length;
    out += html.slice(cursor, h.start);
    if (targets.has(h.title)) {
      const body = html.slice(h.end, sectionEnd);
      const isChallenges = h.title === "Design Challenges" || h.title === "Problem Sets";
      const displayTitle = isChallenges ? "Design challenges" : h.title;
      const slug = displayTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const prefix = isChallenges && problemSetsPrefix ? problemSetsPrefix : "";
      const hasBody = body.replace(/<[^>]+>/g, "").trim().length > 0;
      if (!isChallenges || hasBody || prefix) {
        out += `<details open class="collapsible-section collapsible-${slug}"><summary><h2>${displayTitle}</h2><span class="collapsible-chevron" aria-hidden="true"></span></summary><div class="collapsible-body">${prefix}${body}</div></details>`;
      }
    } else {
      out += html.slice(h.start, sectionEnd);
    }
    cursor = sectionEnd;
  });
  out += html.slice(cursor);
  return out;
}

// ── At-a-glance / Theory-of-change extraction (raw markdown) ───────

const TOC_SCORE_KEYS: Record<string, string> = {
  urgency: "urgency",
  tractability: "tractability",
  neglectedness: "default_neglect",
  maturity: "maturity",
};

export function extractTheoryOfChange(body: string): { fields: Frontmatter; body: string } {
  const m = body.match(/## Theory of change\n([\s\S]*?)(?=\n## [^#]|$)/i);
  if (!m) return { fields: {}, body };
  const section = m[1];
  const fields: Frontmatter = {};

  let prose = section;
  const scoresMatch = section.match(/\n\s*\*\*Scores\*\*\s*\n([\s\S]*)$/i);
  if (scoresMatch) {
    prose = section.slice(0, scoresMatch.index);
    const lineRe = /^\s*[-*]\s*([A-Za-z ]+?):\s*([1-5])\s*\/\s*5\s*(?:[—–-]\s*(.*))?$/gm;
    let sm: RegExpExecArray | null;
    while ((sm = lineRe.exec(scoresMatch[1])) !== null) {
      const key = TOC_SCORE_KEYS[sm[1].trim().toLowerCase()];
      if (!key) continue;
      fields[key] = parseInt(sm[2], 10);
      if (sm[3] && sm[3].trim()) fields[key + "_note"] = sm[3].trim();
    }
  }

  const steps: string[] = [];
  const stepRe = /^\s*\d+\.\s+(.*(?:\n(?!\s*\d+\.\s|\s*\*\*)[^\n]*)*)/gm;
  let firstStepIdx = -1;
  let st: RegExpExecArray | null;
  while ((st = stepRe.exec(prose)) !== null) {
    if (firstStepIdx === -1) firstStepIdx = st.index;
    steps.push(st[1].replace(/\s*\n\s*/g, " ").trim());
  }
  const introText = (firstStepIdx === -1 ? prose : prose.slice(0, firstStepIdx)).trim();

  if (introText) fields.diffusion = introText;
  if (steps.length) fields.diffusion_steps = steps;

  const stripped = (body.slice(0, m.index) + body.slice(m.index! + m[0].length))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { fields, body: stripped };
}

export interface AtGlance {
  problem: string | null;
  examples: string[] | null;
  examplesNotes: string[] | null;
  agiBreaks: string[] | null;
  agiBreaksNotes: string[] | null;
  notes: string[] | null;
  body: string;
}

export function extractAtGlance(body: string): AtGlance {
  const m = body.match(/## At a glance\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (!m)
    return { problem: null, examples: null, examplesNotes: null, agiBreaks: null, agiBreaksNotes: null, notes: null, body };

  const sub: Record<string, string> = {};
  let label: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (label) sub[label] = buf.join("\n").trim();
    buf = [];
  };
  for (const line of m[1].split("\n")) {
    const hm = line.match(/^### (.+?)\s*$/);
    if (hm) {
      flush();
      label = hm[1].trim();
    } else if (label) buf.push(line);
  }
  flush();

  const listItems = (text: string | undefined): string[] | null => {
    if (!text) return null;
    const out: string[] = [];
    for (const line of text.split("\n")) {
      const lm = line.match(/^\s*-\s+(.+)$/);
      if (lm) out.push(lm[1].trim());
    }
    return out.length ? out : null;
  };

  const subsectionNotes = (text: string | undefined, renderedItems: string[] | null): string[] | null => {
    if (!text) return null;
    const consumed = (renderedItems || []).join("\n");
    const out: string[] = [];
    const re = /\{>>\s*([\s\S]*?)\s*<<\}/g;
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(text)) !== null) {
      if (!consumed.includes(mm[0])) out.push(mm[1].trim());
    }
    return out.length ? out : null;
  };

  const problem = sub["Coordination challenge"] || sub["Problem"] || null;
  const examples = listItems(sub["Examples"]);
  const agiBreaks = listItems(sub["How AGI breaks them"]);

  const examplesNotes = subsectionNotes(sub["Examples"], examples);
  const agiBreaksNotes = subsectionNotes(sub["How AGI breaks them"], agiBreaks);

  const subText = Object.values(sub).join("\n");
  const orphanNotes: string[] = [];
  const noteRe = /\{>>\s*([\s\S]*?)\s*<<\}/g;
  let nm: RegExpExecArray | null;
  while ((nm = noteRe.exec(m[1])) !== null) {
    if (!subText.includes(nm[0])) orphanNotes.push(nm[1].trim());
  }

  const stripped = (body.slice(0, m.index) + body.slice(m.index! + m[0].length))
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    problem,
    examples,
    examplesNotes,
    agiBreaks,
    agiBreaksNotes,
    notes: orphanNotes.length ? orphanNotes : null,
    body: stripped,
  };
}

// Collect `{vision: id}` tags present in a cell body's Design Challenges.
export function visionTagsInBody(md: string | undefined): string[] {
  if (!md) return [];
  const psMatch = md.match(/## (?:Design Challenges|Problem Sets)\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (!psMatch) return [];
  const ids = new Set<string>();
  const re = /^###\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(psMatch[1])) !== null) {
    const parsed = parseVisionTag(m[1].trim());
    if (parsed.vision) ids.add(parsed.vision);
  }
  return Array.from(ids);
}

// ── Design-challenge aggregation (raw markdown bodies) ─────────────

export interface ProblemSet {
  title: string;
  vision: string | null;
  body: string;
  cellKey: string;
  tabId: string;
}

export function extractProblemSets(tabId: string, cells: Record<string, Cell>): ProblemSet[] {
  const problems: ProblemSet[] = [];
  for (const [cellKey, cell] of Object.entries(cells)) {
    if (!cell.body) continue;
    const psMatch = cell.body.match(
      /## (?:Design Challenges|Problem Sets)\n([\s\S]*?)(?=\n## [^#]|$)/
    );
    if (!psMatch) continue;
    const psContent = psMatch[1].trim();
    if (!psContent) continue;

    const h3Regex = /### (.+)/g;
    let match: RegExpExecArray | null;
    const h3s: { title: string; vision: string | null; start: number; headerEnd: number }[] = [];
    while ((match = h3Regex.exec(psContent)) !== null) {
      const parsed = parseVisionTag(match[1].trim());
      h3s.push({ title: parsed.title, vision: parsed.vision, start: match.index, headerEnd: match.index + match[0].length });
    }
    for (let i = 0; i < h3s.length; i++) {
      const bodyEnd = i + 1 < h3s.length ? h3s[i + 1].start : psContent.length;
      problems.push({
        title: h3s[i].title,
        vision: h3s[i].vision,
        body: psContent.slice(h3s[i].headerEnd, bodyEnd).trim(),
        cellKey,
        tabId,
      });
    }
  }
  return problems;
}

// ── Summary box + theory-of-change HTML builders ──────────────────

export function renderSummaryBox(fm: Frontmatter | undefined | null): string {
  if (!fm) return "";
  const problem = fm.problem;
  const examples = Array.isArray(fm.examples) ? fm.examples : null;
  const agiBreaks = Array.isArray(fm.agi_breaks) ? fm.agi_breaks : null;
  const notes = Array.isArray(fm.at_glance_notes) ? fm.at_glance_notes : null;
  if (
    !problem &&
    (!examples || examples.length === 0) &&
    (!agiBreaks || agiBreaks.length === 0) &&
    (!notes || notes.length === 0)
  ) {
    return "";
  }

  const renderList = (items: string[]) => {
    let h = '<ul class="cell-summary-list">';
    for (const x of items) h += `<li>${escapeRich(x)}</li>`;
    h += "</ul>";
    return h;
  };

  const renderNotes = (items: string[] | null) => {
    if (!items || !items.length) return "";
    let h = "";
    for (const n of items) h += `<div class="cell-summary-note">${escapeHtml(n)}</div>`;
    return h;
  };

  const examplesNotes = Array.isArray(fm.examples_notes) ? fm.examples_notes : null;
  const agiBreaksNotes = Array.isArray(fm.agi_breaks_notes) ? fm.agi_breaks_notes : null;

  let html = '<aside class="cell-summary">';
  if (problem) {
    html += '<div class="cell-summary-row">';
    html += '<span class="cell-summary-label">Coordination challenge</span>';
    html += `<span class="cell-summary-text">${escapeRich(problem)}</span>`;
    html += "</div>";
  }
  if (examples && examples.length) {
    html += '<div class="cell-summary-row">';
    html += '<span class="cell-summary-label">Human Examples</span>';
    html += '<div class="cell-summary-cell">';
    html += renderList(examples);
    html += renderNotes(examplesNotes);
    html += "</div>";
    html += "</div>";
  }
  if (agiBreaks && agiBreaks.length) {
    html += '<div class="cell-summary-row">';
    html += '<span class="cell-summary-label">How AGI breaks them</span>';
    html += '<div class="cell-summary-cell">';
    html += renderList(agiBreaks);
    html += renderNotes(agiBreaksNotes);
    html += "</div>";
    html += "</div>";
  }
  if (notes && notes.length) {
    html += '<div class="cell-summary-row cell-summary-notes-row">';
    html += '<span class="cell-summary-label">Notes</span>';
    html += `<div class="cell-summary-cell">${renderNotes(notes)}</div>`;
    html += "</div>";
  }
  html += "</aside>";
  return html;
}

// ── Theory-of-change (impact) box ──────────────────────────────────

interface ImpactScoreDef {
  key: string;
  label: string;
  desc: string;
}

const IMPACT_SCORES: ImpactScoreDef[] = [
  { key: "urgency", label: "Urgency", desc: "How time-sensitive is this problem?" },
  { key: "tractability", label: "Tractability", desc: "How hard is this design problem?" },
  {
    key: "default_neglect",
    label: "Neglectedness",
    desc: "How likely is this to be solved by market forces or existing research institutions by default?",
  },
  {
    key: "maturity",
    label: "Maturity",
    desc: "How far along is this work already, from a bare idea to working prototypes and early pilots?",
  },
];

interface ImpactFields {
  diffusion: string;
  steps: string[];
  exampleWork: string[];
  scores: Record<string, number>;
  notes: Record<string, string>;
  hasScore: boolean;
}

export function impactFields(fm: Frontmatter | undefined | null): ImpactFields | null {
  if (!fm) return null;
  const diffusion = typeof fm.diffusion === "string" ? fm.diffusion.trim() : "";
  const steps = Array.isArray(fm.diffusion_steps)
    ? fm.diffusion_steps.map((s: unknown) => String(s).trim()).filter(Boolean)
    : [];
  const exampleWork = Array.isArray(fm.example_work)
    ? fm.example_work.map((s: unknown) => String(s).trim()).filter(Boolean)
    : [];
  const scores: Record<string, number> = {};
  const notes: Record<string, string> = {};
  let hasScore = false;
  for (const s of IMPACT_SCORES) {
    const n = parseInt(fm[s.key], 10);
    if (n >= 1 && n <= 5) {
      scores[s.key] = n;
      hasScore = true;
      const note = fm[s.key + "_note"];
      if (typeof note === "string" && note.trim()) notes[s.key] = note.trim();
    }
  }
  if (!diffusion && !steps.length && !hasScore && !exampleWork.length) return null;
  return { diffusion, steps, exampleWork, scores, notes, hasScore };
}

export function scoreDots(n: number): string {
  let h = '<span class="impact-score-dots" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    h += `<span class="impact-dot${i <= n ? " filled" : ""}"></span>`;
  }
  h += "</span>";
  return h;
}

function impactBodyHtml(f: ImpactFields): string {
  let html = "";
  if (f.diffusion) {
    html += `<div class="cell-impact-text">${escapeRich(f.diffusion)}</div>`;
  }
  if (f.steps && f.steps.length) {
    html += '<ol class="cell-impact-steps">';
    for (const step of f.steps) html += `<li>${escapeRich(step)}</li>`;
    html += "</ol>";
  }
  if (f.hasScore) {
    html += '<div class="impact-scores">';
    for (const s of IMPACT_SCORES) {
      const n = f.scores[s.key];
      if (!n) continue;
      const tip = escapeHtml(s.desc);
      const note = f.notes[s.key] ? escapeRich(f.notes[s.key]) : "";
      html += `<div class="impact-score-row" aria-label="${s.label}: ${tip}">`;
      html += `<span class="impact-score-label">${s.label}</span>`;
      html += `<span class="impact-score-value"><span class="impact-score-dots-wrap">${scoreDots(n)}</span><span class="impact-score-num" aria-hidden="true">${n}/5</span></span>`;
      html += note ? `<span class="impact-score-note">${note}</span>` : '<span class="impact-score-note"></span>';
      html += `<span class="impact-tip" role="tooltip">${tip}</span>`;
      html += "</div>";
    }
    html += "</div>";
  }
  if (f.exampleWork && f.exampleWork.length) {
    html += '<div class="impact-example-work">';
    html += '<span class="impact-example-label">Example work</span>';
    html += '<ul class="impact-example-list">';
    for (const item of f.exampleWork) html += `<li>${escapeRich(item)}</li>`;
    html += "</ul>";
    html += "</div>";
  }
  return html;
}

export function renderTheoryOfChange(fm: Frontmatter | undefined | null): string {
  const f = impactFields(fm);
  if (!f) return "";
  return `<details class="cell-theory"><summary><span class="cell-impact-summary-label">Theory of change</span><span class="collapsible-chevron" aria-hidden="true"></span></summary><div class="cell-impact-rows">${impactBodyHtml(f)}</div></details>`;
}

// Compact vision toggle bar shown at the top of the Design Challenges section.
// `onlyIds`, when given, restricts which visions to show.
export function renderVisionToggleBar(onlyIds?: string[]): string {
  let visions = VISIONS;
  if (Array.isArray(onlyIds)) visions = visions.filter((v) => onlyIds.indexOf(v.id) !== -1);
  if (!visions.length) return "";
  let html = '<div class="vision-toggle-bar"><span class="vision-toggle-label">Include from visions</span>';
  for (const v of visions) {
    html += `<label class="vision-toggle"><input type="checkbox" data-vision="${v.id}"><span class="vision-swatch" style="background:${v.color}"></span>${escapeHtml(v.label)}</label>`;
  }
  html += "</div>";
  return html;
}

// Per-vision colors + reveal rules (CSS text, no <style> wrapper). Generated so
// adding a vision needs no hand-written CSS. Base "hidden by default" rules live
// in the legacy stylesheet.
export function visionStylesCss(): string {
  let css = "";
  for (const v of VISIONS) {
    css += `.vision-chip[data-vision="${v.id}"],.ps-entry[data-vision="${v.id}"],.ps-detail-entry[data-vision="${v.id}"],.ps-vision-group[data-vision="${v.id}"]{--vision-color:${v.color};}`;
    css += `html.show-vision-${v.id} .vision-chip[data-vision="${v.id}"]{display:inline-block;}`;
    css += `html.show-vision-${v.id} .ps-entry[data-vision="${v.id}"],html.show-vision-${v.id} .ps-vision-group[data-vision="${v.id}"]{display:block;}`;
    css += `html.show-vision-${v.id} .ps-detail-entry[data-vision="${v.id}"]{display:grid;}`;
  }
  return css;
}
