// Server-only markdown rendering (imports `marked`). Kept out of the client
// bundle: the whole detail body is rendered to HTML in loaders and handed to
// components via dangerouslySetInnerHTML.

import { marked } from "marked";
import {
  processEditorial,
  renderVividCases,
  wrapProblemSets,
  wrapDesignChoices,
  wrapCollapsibleSections,
} from "./markdown";

// marked.parse is synchronous with the default (non-async) options.
function md(src: string): string {
  return marked.parse(src) as string;
}

// Plain markdown → HTML (with editorial notes processed). For intro/section
// prose on the curriculum and theory-of-change pages.
export function renderMarkdown(src: string): string {
  return md(processEditorial(src));
}

// Full cell body render pipeline (mirrors app.js renderBody).
export function renderBody(src: string, problemSetsPrefix?: string): string {
  return wrapCollapsibleSections(
    wrapDesignChoices(wrapProblemSets(renderVividCases(md(processEditorial(src))))),
    problemSetsPrefix
  );
}

// A single problem-set body (for the aggregate problem-sets page).
export function renderProblemSetBody(src: string): string {
  return wrapDesignChoices(md(processEditorial(src)));
}
