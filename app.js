// ── Constants ──────────────────────────────────────────────────────

const TABS = {
  agi: { title: 'AGI Institutions' },
  human: { title: 'Existing Human Institutions' }
};

const ROWS = [
  { id: 'dyadic', name: 'Dyadic' },
  { id: 'group', name: 'Group' },
  { id: 'community', name: 'Community' },
  { id: 'national', name: 'National' },
  { id: 'global', name: 'Global' }
];

const COLS = [
  { id: 'protocols', name: 'Protocols' },
  { id: 'preferences', name: 'Preferences' },
  { id: 'rights', name: 'Rights' },
  { id: 'incentives', name: 'Incentives' },
  { id: 'expertise', name: 'Expertise' },
  { id: 'norms', name: 'Norms' },
  { id: 'thick-commitments', name: 'Thick Commitments' }
];

const GITHUB_REPO = 'https://github.com/meaningalignment/institutions';

const HUMAN_ERA_BUCKETS = [
  { id: 'ancient', code: 'An', label: 'Ancient / customary' },
  { id: 'ancient-medieval', code: 'A-M', label: 'Ancient-medieval' },
  { id: 'ancient-modern', code: 'A+', label: 'Ancient-modern' },
  { id: 'medieval-modern', code: 'M+', label: 'Medieval-modern' },
  { id: 'early-modern-modern', code: 'E+', label: 'Early modern-modern' },
  { id: 'twentieth', code: '20', label: '20th century' },
  { id: 'industrial-digital', code: 'I+', label: 'Industrial-digital' },
  { id: 'digital', code: '21', label: 'Digital era' },
  { id: 'medieval', code: 'Md', label: 'Medieval' },
  { id: 'early-modern', code: 'Em', label: 'Early modern' },
  { id: 'industrial', code: 'In', label: 'Industrial' }
];

const HUMAN_ERA_BUCKET_IDS = new Set(HUMAN_ERA_BUCKETS.map(b => b.id));

// Inline editorial notes ({>> ... <<}) are hidden by default. Reveal them
// when viewing locally or when the URL has ?editorial.
// On the deployed site, cells whose status isn't `body_ok` have their
// grid summary hidden behind a placeholder — click still works.
// Override with ?showall.
(function applyViewerFlags() {
  const host = location.hostname;
  const local = host === 'localhost' || host === '127.0.0.1' || host === '';
  const editorialFlag = /[?&]editorial(=|&|$)/.test(location.search);
  const showAllFlag = /[?&]showall(=|&|$)/.test(location.search);
  if (local || editorialFlag) document.documentElement.classList.add('show-editorial');
  if (!local && !showAllFlag) document.documentElement.classList.add('hide-unready');
})();

// ── Visions: toggleable overlays (shared state across pages) ────────
// `?visions=a,b` in the URL wins; otherwise localStorage. Active visions
// add `show-vision-<id>` on <html>, which CSS uses to reveal chips +
// vision-tagged problem sets. Mirrored by an inline script on the
// problem-sets page (which doesn't load app.js).
function getActiveVisions() {
  const p = new URLSearchParams(location.search).get('visions');
  if (p !== null) return p ? p.split(',').filter(Boolean) : [];
  try { return JSON.parse(localStorage.getItem('visions') || '[]'); } catch { return []; }
}
function applyVisionClasses(list) {
  const r = document.documentElement;
  Array.from(r.classList).forEach(c => { if (c.indexOf('show-vision-') === 0) r.classList.remove(c); });
  list.forEach(id => r.classList.add('show-vision-' + id));
}
function syncVisionCheckboxes(list) {
  document.querySelectorAll('input[data-vision]').forEach(b => {
    b.checked = list.indexOf(b.getAttribute('data-vision')) !== -1;
  });
}
// Toggle one vision in the active list based on the checkbox that changed.
// Don't union all checkboxes: the same vision can have several checkbox
// copies in the DOM (grid selector + detail toggle bar), and the not-yet-
// synced copies would override the one the user just unchecked.
function visionsAfterToggle(input) {
  const id = input.getAttribute('data-vision');
  const list = getActiveVisions().filter(v => v !== id);
  if (input.checked) list.push(id);
  return list;
}
function setActiveVisions(list) {
  try { localStorage.setItem('visions', JSON.stringify(list)); } catch {}
  const params = new URLSearchParams(location.search);
  if (list.length) params.set('visions', list.join(',')); else params.delete('visions');
  const qs = params.toString();
  // Preserve the #detail/... hash that drives detail routing.
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  applyVisionClasses(list);
  syncVisionCheckboxes(list);
}
// Compact vision toggle bar. On AGI detail pages it sits at the top of the
// Problem Sets section (the only content a vision changes), and lists only
// the visions this cell's problem sets actually use. `onlyIds`, when given,
// restricts which visions to show; an empty result returns ''.
function renderVisionToggleBar(onlyIds) {
  let visions = window.__VISIONS__ || [];
  if (Array.isArray(onlyIds)) visions = visions.filter(v => onlyIds.indexOf(v.id) !== -1);
  if (!visions.length) return '';
  let html = '<div class="vision-toggle-bar"><span class="vision-toggle-label">Include from visions</span>';
  for (const v of visions) {
    html += `<label class="vision-toggle"><input type="checkbox" data-vision="${v.id}"><span class="vision-swatch" style="background:${v.color}"></span>${escapeHtml(v.label)}</label>`;
  }
  html += '</div>';
  return html;
}

// Collect the `{vision: id}` tags present in a cell body's Problem Sets so the
// detail page only offers toggles for visions that actually change something.
function visionTagsInBody(md) {
  if (!md) return [];
  const psMatch = md.match(/## Problem Sets\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (!psMatch) return [];
  const ids = new Set();
  const re = /^###\s+(.+)$/gm;
  let m;
  while ((m = re.exec(psMatch[1])) !== null) {
    const parsed = parseVisionTag(m[1].trim());
    if (parsed.vision) ids.add(parsed.vision);
  }
  return Array.from(ids);
}
// Apply early so active chips/sections don't flash hidden then appear.
applyVisionClasses(getActiveVisions());

// ── Cell parsing ───────────────────────────────────────────────────

function parseCell(raw) {
  // Strip YAML frontmatter if present; tiny inline parser for key: value and key: [a, b]
  let frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    const unquote = (s) => {
      const v = s.trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        return v.slice(1, -1);
      }
      return v;
    };
    const lines = fmMatch[1].split('\n');
    for (let li = 0; li < lines.length; li++) {
      const m = lines[li].match(/^(\w+):\s*(.*)$/);
      if (!m) continue;
      let val = m[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        const inner = val.slice(1, -1);
        const items = [];
        let buf = '';
        let quote = null;
        for (let i = 0; i < inner.length; i++) {
          const ch = inner[i];
          if (quote) {
            if (ch === '\\' && i + 1 < inner.length) { buf += ch + inner[++i]; continue; }
            if (ch === quote) { quote = null; continue; }
            buf += ch;
          } else if (ch === '"' || ch === "'") {
            quote = ch;
          } else if (ch === ',') {
            items.push(buf.trim());
            buf = '';
          } else {
            buf += ch;
          }
        }
        if (buf.trim()) items.push(buf.trim());
        val = items.filter(Boolean);
      } else if (val === '') {
        // A key with no inline value may be followed by a YAML block list
        // (`  - item` lines). Consume them as an array.
        const items = [];
        while (li + 1 < lines.length && /^\s*-\s+/.test(lines[li + 1])) {
          items.push(unquote(lines[++li].replace(/^\s*-\s+/, '')));
        }
        val = items.length ? items.filter(Boolean) : '';
      } else {
        val = unquote(val);
      }
      frontmatter[m[1]] = val;
    }
    raw = raw.slice(fmMatch[0].length);
  }

  const h1Match = raw.match(/^#\s+(.+)$/m);
  const summary = h1Match ? h1Match[1].trim() : '';
  const bodyAfterH1 = h1Match
    ? raw.slice(raw.indexOf('\n', raw.indexOf(h1Match[0])) + 1).trim()
    : raw;

  // Pull the `## At a glance` section into frontmatter fields for the
  // existing renderSummaryBox path, and strip it from the body so it
  // doesn't also render inline.
  const ag = extractAtGlance(bodyAfterH1);
  if (ag.problem) frontmatter.problem = ag.problem;
  if (ag.examples) frontmatter.examples = ag.examples;
  if (ag.examplesNotes) frontmatter.examples_notes = ag.examplesNotes;
  if (ag.agiBreaks) frontmatter.agi_breaks = ag.agiBreaks;
  if (ag.agiBreaksNotes) frontmatter.agi_breaks_notes = ag.agiBreaksNotes;
  if (ag.notes) frontmatter.at_glance_notes = ag.notes;

  // Pull the `## Theory of change` section into the same frontmatter fields
  // impactFields reads (diffusion, diffusion_steps, scores + *_note), so the
  // renderer is unchanged. Strip it from the body too.
  const toc = extractTheoryOfChange(ag.body);
  Object.assign(frontmatter, toc.fields);

  return { summary, body: toc.body, frontmatter };
}

// Map a Theory-of-change score label to its frontmatter key.
const TOC_SCORE_KEYS = {
  urgency: 'urgency',
  tractability: 'tractability',
  neglectedness: 'default_neglect',
  maturity: 'maturity'
};

// Extract the `## Theory of change` section into the frontmatter shape
// impactFields consumes. Format:
//   {intro prose}
//   1. {ladder step}  2. ...
//   **Scores**
//   - Urgency: 3/5 — {note}
// Returns { fields, body } with the section stripped from body.
function extractTheoryOfChange(body) {
  const m = body.match(/## Theory of change\n([\s\S]*?)(?=\n## [^#]|$)/i);
  if (!m) return { fields: {}, body };
  const section = m[1];
  const fields = {};

  // Scores block: everything from a `**Scores**` line onward.
  let prose = section;
  const scoresMatch = section.match(/\n\s*\*\*Scores\*\*\s*\n([\s\S]*)$/i);
  if (scoresMatch) {
    prose = section.slice(0, scoresMatch.index);
    const lineRe = /^\s*[-*]\s*([A-Za-z ]+?):\s*([1-5])\s*\/\s*5\s*(?:[—–-]\s*(.*))?$/gm;
    let sm;
    while ((sm = lineRe.exec(scoresMatch[1])) !== null) {
      const key = TOC_SCORE_KEYS[sm[1].trim().toLowerCase()];
      if (!key) continue;
      fields[key] = parseInt(sm[2], 10);
      if (sm[3] && sm[3].trim()) fields[key + '_note'] = sm[3].trim();
    }
  }

  // Ladder: numbered list items. Intro: prose before the first one.
  const steps = [];
  const stepRe = /^\s*\d+\.\s+(.*(?:\n(?!\s*\d+\.\s|\s*\*\*)[^\n]*)*)/gm;
  let firstStepIdx = -1;
  let st;
  while ((st = stepRe.exec(prose)) !== null) {
    if (firstStepIdx === -1) firstStepIdx = st.index;
    steps.push(st[1].replace(/\s*\n\s*/g, ' ').trim());
  }
  const introText = (firstStepIdx === -1 ? prose : prose.slice(0, firstStepIdx)).trim();

  if (introText) fields.diffusion = introText;
  if (steps.length) fields.diffusion_steps = steps;

  const stripped = (body.slice(0, m.index) + body.slice(m.index + m[0].length))
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { fields, body: stripped };
}

// Extract the `## At a glance` section: H3 subsections for `Coordination
// challenge`, `Examples`, `How AGI breaks them`. Returns the parsed data
// plus the body with the section removed.
function extractAtGlance(body) {
  const m = body.match(/## At a glance\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (!m) return { problem: null, examples: null, agiBreaks: null, notes: null, body };

  const sub = {};
  let label = null;
  let buf = [];
  const flush = () => { if (label) sub[label] = buf.join('\n').trim(); buf = []; };
  for (const line of m[1].split('\n')) {
    const hm = line.match(/^### (.+?)\s*$/);
    if (hm) { flush(); label = hm[1].trim(); }
    else if (label) buf.push(line);
  }
  flush();

  const listItems = (text) => {
    if (!text) return null;
    const out = [];
    for (const line of text.split('\n')) {
      const lm = line.match(/^\s*-\s+(.+)$/);
      if (lm) out.push(lm[1].trim());
    }
    return out.length ? out : null;
  };

  // Extract editorial markers from a subsection's captured text that
  // aren't inside its rendered items — these are standalone notes the
  // reviewer dropped under the H3 and we'll show them in that H3's row.
  const subsectionNotes = (text, renderedItems) => {
    if (!text) return null;
    const consumed = (renderedItems || []).join('\n');
    const out = [];
    const re = /\{>>\s*([\s\S]*?)\s*<<\}/g;
    let mm;
    while ((mm = re.exec(text)) !== null) {
      if (!consumed.includes(mm[0])) out.push(mm[1].trim());
    }
    return out.length ? out : null;
  };

  const problem = sub['Coordination challenge'] || sub['Problem'] || null;
  const examples = listItems(sub['Examples']);
  const agiBreaks = listItems(sub['How AGI breaks them']);

  // Notes attached to each H3. Coordination challenge prose flows through
  // escapeRich, so any `{>> ... <<}` already renders inline — no extra
  // collection needed. Examples / AGI breaks render only the bullet items,
  // so a paragraph-style note under those H3s would otherwise vanish.
  const examplesNotes = subsectionNotes(sub['Examples'], examples);
  const agiBreaksNotes = subsectionNotes(sub['How AGI breaks them'], agiBreaks);

  // Notes that aren't inside any recognized H3 (before the first H3, or
  // under an unrecognized H3) — surface them in a catch-all "Notes" row.
  const subText = Object.values(sub).join('\n');
  const orphanNotes = [];
  const noteRe = /\{>>\s*([\s\S]*?)\s*<<\}/g;
  let nm;
  while ((nm = noteRe.exec(m[1])) !== null) {
    if (!subText.includes(nm[0])) orphanNotes.push(nm[1].trim());
  }

  const stripped = (body.slice(0, m.index) + body.slice(m.index + m[0].length))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    problem,
    examples,
    examplesNotes,
    agiBreaks,
    agiBreaksNotes,
    notes: orphanNotes.length ? orphanNotes : null,
    body: stripped
  };
}

// ── Markdown post-processing ───────────────────────────────────────

// Wrap any paragraph that opens with "A vivid case:" in a styled callout.
// Runs on the HTML produced by marked, so the input is `<p>A vivid case: ...</p>`.
function renderVividCases(html) {
  return html.replace(
    /<p>A vivid case:\s*([\s\S]*?)<\/p>/g,
    '<aside class="vivid-case"><span class="vivid-case-label">A vivid case</span><p>$1</p></aside>'
  );
}

// Inline editorial notes: {>> note text <<} → <span class="editorial">…</span>.
// CSS hides them by default; visible on localhost or with ?editorial in the URL.
function processEditorial(md) {
  return md.replace(/\{>>\s*([\s\S]*?)\s*<<\}/g, (_, content) => {
    const safe = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<span class="editorial">${safe}</span>`;
  });
}

// Parse a trailing `{vision: id}` tag off a problem-set heading.
// Mirrored in build.js parseVisionTag — keep both in sync.
function parseVisionTag(title) {
  const mm = title.match(/\s*\{vision:\s*([a-z0-9_-]+)\s*\}\s*$/i);
  if (!mm) return { title, vision: null };
  return { title: title.slice(0, mm.index).trim(), vision: mm[1].toLowerCase() };
}

// Wrap each H3 under the "Problem Sets" H2 in a numbered box. Operates on
// the HTML produced by marked. A `{vision: id}` tag in the heading marks the
// entry as belonging to that vision (hidden unless the vision is active).
function wrapProblemSets(html) {
  const headerMatch = html.match(/<h2[^>]*>\s*Problem Sets\s*<\/h2>/i);
  if (!headerMatch) return html;
  const startIdx = headerMatch.index + headerMatch[0].length;
  const rest = html.slice(startIdx);
  const nextH2 = rest.match(/<h2[^>]*>/);
  const sectionEnd = nextH2 ? startIdx + nextH2.index : html.length;
  const section = html.slice(startIdx, sectionEnd);

  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
  const h3s = [];
  let m;
  while ((m = h3Re.exec(section)) !== null) {
    h3s.push({ start: m.index, end: m.index + m[0].length, title: m[1] });
  }
  if (h3s.length === 0) return html;

  let wrapped = section.slice(0, h3s[0].start);
  h3s.forEach((h, i) => {
    const bodyEnd = i + 1 < h3s.length ? h3s[i + 1].start : section.length;
    const body = section.slice(h.end, bodyEnd).trim();
    const parsed = parseVisionTag(h.title);
    const dataAttr = parsed.vision ? ` data-vision="${parsed.vision}"` : '';
    wrapped += `<div class="ps-detail-entry"${dataAttr}>`;
    wrapped += `<div class="ps-detail-header"><span class="ps-detail-number">${i + 1}</span><span class="ps-detail-title">${parsed.title}</span></div>`;
    wrapped += `<div class="ps-detail-body">${body}</div>`;
    wrapped += `</div>`;
  });

  return html.slice(0, startIdx) + wrapped + html.slice(sectionEnd);
}

// Wrap the "Design choices the team must take a position on." paragraph and
// the immediately-following <ol> in a <details open> so users can collapse it.
// Duplicated in build.js for the standalone problem-sets page.
function wrapDesignChoices(html) {
  const re = /<p><strong>Design choices the team must take a position on\.?<\/strong><\/p>\s*<ol>([\s\S]*?)<\/ol>/g;
  return html.replace(re, (_, items) => {
    return `<details class="design-choices"><summary><span>Design Choices</span><span class="collapsible-chevron" aria-hidden="true"></span></summary><ol>${items}</ol></details>`;
  });
}

// Wrap each top-level `## …` section whose title is one of the targets in a
// `<details open>` so the reader can collapse it. Operates on the HTML
// produced by marked, after problem-set wrapping. The H2 becomes the
// `<summary>`; everything up to the next H2 (or end) becomes the body.
function wrapCollapsibleSections(html, problemSetsPrefix) {
  const targets = new Set([
    'How humans solve this today',
    'Where AGI breaks it',
    'Problem Sets',
  ]);
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const matches = [];
  let m;
  while ((m = h2Re.exec(html)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, title: m[1].trim(), full: m[0] });
  }
  if (matches.length === 0) return html;

  let out = '';
  let cursor = 0;
  matches.forEach((h, i) => {
    const sectionEnd = i + 1 < matches.length ? matches[i + 1].start : html.length;
    out += html.slice(cursor, h.start);
    if (targets.has(h.title)) {
      const body = html.slice(h.end, sectionEnd);
      const slug = h.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      // The vision toggle bar belongs to the Problem Sets section — it's the
      // only content a vision reveals — so prepend it inside that body.
      const prefix = (h.title === 'Problem Sets' && problemSetsPrefix) ? problemSetsPrefix : '';
      out += `<details open class="collapsible-section collapsible-${slug}"><summary><h2>${h.title}</h2><span class="collapsible-chevron" aria-hidden="true"></span></summary><div class="collapsible-body">${prefix}${body}</div></details>`;
    } else {
      out += html.slice(h.start, sectionEnd);
    }
    cursor = sectionEnd;
  });
  out += html.slice(cursor);
  return out;
}

function renderBody(md, problemSetsPrefix) {
  return wrapCollapsibleSections(wrapDesignChoices(wrapProblemSets(renderVividCases(marked.parse(processEditorial(md))))), problemSetsPrefix);
}

// ── Summary box at top of detail (problem + example institutions) ──

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Like escapeHtml, but lets `{>> note <<}` markers through as trusted
// <span class="editorial">…</span>. For use in the summary box where the
// content is plain text (not full markdown).
function escapeRich(s) {
  return escapeHtml(s)
    .replace(
      /\{&gt;&gt;\s*([\s\S]*?)\s*&lt;&lt;\}/g,
      '<span class="editorial">$1</span>'
    )
    // Markdown links [text](https://…). URLs are escaped (& → &amp;) by
    // escapeHtml above; only http(s) targets are allowed.
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
}

function getHumanEra(fm) {
  const label = typeof fm?.human_era === 'string' ? fm.human_era.trim() : '';
  const bucket = typeof fm?.human_era_bucket === 'string' ? fm.human_era_bucket.trim() : '';
  if (!label || !HUMAN_ERA_BUCKET_IDS.has(bucket)) return null;
  const meta = HUMAN_ERA_BUCKETS.find(b => b.id === bucket);
  return { label, bucket, code: meta.code };
}

function renderHumanEraMeta(fm) {
  const humanEra = getHumanEra(fm);
  if (!humanEra) return '';
  let html = `<div class="human-era-detail era-${humanEra.bucket}">`;
  html += `<span class="human-era-label">${escapeHtml(humanEra.label)}</span>`;
  html += '</div>';
  return html;
}

function renderSummaryBox(fm) {
  if (!fm) return '';
  const problem = fm.problem;
  const examples = Array.isArray(fm.examples) ? fm.examples : null;
  const agiBreaks = Array.isArray(fm.agi_breaks) ? fm.agi_breaks : null;
  const notes = Array.isArray(fm.at_glance_notes) ? fm.at_glance_notes : null;
  if (!problem && (!examples || examples.length === 0) && (!agiBreaks || agiBreaks.length === 0) && (!notes || notes.length === 0)) {
    return '';
  }

  const renderList = (items) => {
    let h = '<ul class="cell-summary-list">';
    for (const x of items) h += `<li>${escapeRich(x)}</li>`;
    h += '</ul>';
    return h;
  };

  const renderNotes = (items) => {
    if (!items || !items.length) return '';
    let h = '';
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
    html += '</div>';
  }
  if (examples && examples.length) {
    html += '<div class="cell-summary-row">';
    html += '<span class="cell-summary-label">Human Examples</span>';
    html += '<div class="cell-summary-cell">';
    html += renderList(examples);
    html += renderNotes(examplesNotes);
    html += '</div>';
    html += '</div>';
  }
  if (agiBreaks && agiBreaks.length) {
    html += '<div class="cell-summary-row">';
    html += '<span class="cell-summary-label">How AGI breaks them</span>';
    html += '<div class="cell-summary-cell">';
    html += renderList(agiBreaks);
    html += renderNotes(agiBreaksNotes);
    html += '</div>';
    html += '</div>';
  }
  if (notes && notes.length) {
    html += '<div class="cell-summary-row cell-summary-notes-row">';
    html += '<span class="cell-summary-label">Notes</span>';
    html += `<div class="cell-summary-cell">${renderNotes(notes)}</div>`;
    html += '</div>';
  }
  html += '</aside>';
  return html;
}

// Standalone collapsible "Theory of change" box, rendered under the summary
// box on the AGI detail page. Collapsed by default (it's investor-facing).
// Its content runs full-width inside the box (no label gutter).
function renderTheoryOfChange(fm) {
  const f = impactFields(fm);
  if (!f) return '';
  return `<details class="cell-theory"><summary><span class="cell-impact-summary-label">Theory of change</span><span class="collapsible-chevron" aria-hidden="true"></span></summary><div class="cell-impact-rows">${impactBodyHtml(f)}</div></details>`;
}

// Investor-facing "Path to impact" content. For funders, not researchers, so
// it's a collapsed disclosure folded into the foot of the summary box. The
// `diffusion` prose is the main body; three 1–5 scores follow, all oriented
// so higher = stronger case to fund.
//   diffusion      — prose: who would use it / path to adoption (the body)
//   urgency        — 1–5: how time-sensitive
//   tractability   — 1–5: how solvable now (5 = most doable)
//   default_neglect— 1–5: how unlikely to be solved by default (5 = most neglected)
// Each dimension has: a 1–5 score (frontmatter `key`), a `desc` (the generic
// meaning, shown as a hover tip), and a per-cell justification sentence
// (frontmatter `<key>_note`) shown to the right of the dots.
const IMPACT_SCORES = [
  { key: 'urgency', label: 'Urgency', desc: 'How time-sensitive is this problem?' },
  { key: 'tractability', label: 'Tractability', desc: 'How hard is this design problem?' },
  { key: 'default_neglect', label: 'Neglectedness', desc: 'How likely is this to be solved by market forces or existing research institutions by default?' },
  { key: 'maturity', label: 'Maturity', desc: 'How far along is this work already, from a bare idea to working prototypes and early pilots?' }
];

function impactFields(fm) {
  if (!fm) return null;
  const diffusion = typeof fm.diffusion === 'string' ? fm.diffusion.trim() : '';
  // Optional ordered steps (the diffusion ladder), as a YAML array. Rendered
  // as a numbered list under the diffusion intro prose.
  const steps = Array.isArray(fm.diffusion_steps)
    ? fm.diffusion_steps.map(s => String(s).trim()).filter(Boolean) : [];
  // Optional list of prior/related work (each item may be a markdown link).
  const exampleWork = Array.isArray(fm.example_work)
    ? fm.example_work.map(s => String(s).trim()).filter(Boolean) : [];
  const scores = {};
  const notes = {};
  let hasScore = false;
  for (const s of IMPACT_SCORES) {
    const n = parseInt(fm[s.key], 10);
    if (n >= 1 && n <= 5) {
      scores[s.key] = n;
      hasScore = true;
      const note = fm[s.key + '_note'];
      if (typeof note === 'string' && note.trim()) notes[s.key] = note.trim();
    }
  }
  if (!diffusion && !steps.length && !hasScore && !exampleWork.length) return null;
  return { diffusion, steps, exampleWork, scores, notes, hasScore };
}

// Five dots, filled to `n` (1–5).
function scoreDots(n) {
  let h = '<span class="impact-score-dots" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    h += `<span class="impact-dot${i <= n ? ' filled' : ''}"></span>`;
  }
  h += '</span>';
  return h;
}

function impactBodyHtml(f) {
  let html = '';
  if (f.diffusion) {
    html += `<div class="cell-impact-text">${escapeRich(f.diffusion)}</div>`;
  }
  if (f.steps && f.steps.length) {
    html += '<ol class="cell-impact-steps">';
    for (const step of f.steps) html += `<li>${escapeRich(step)}</li>`;
    html += '</ol>';
  }
  if (f.hasScore) {
    html += '<div class="impact-scores">';
    for (const s of IMPACT_SCORES) {
      const n = f.scores[s.key];
      if (!n) continue;
      const tip = escapeHtml(s.desc);
      const note = f.notes[s.key] ? escapeRich(f.notes[s.key]) : '';
      // Custom hover popup (no native-title delay): the row carries the tip,
      // shown instantly on hover via CSS. aria-label keeps it accessible.
      html += `<div class="impact-score-row" aria-label="${s.label}: ${tip}">`;
      html += `<span class="impact-score-label">${s.label}</span>`;
      html += `<span class="impact-score-value"><span class="impact-score-dots-wrap">${scoreDots(n)}</span><span class="impact-score-num" aria-hidden="true">${n}/5</span></span>`;
      html += note ? `<span class="impact-score-note">${note}</span>` : '<span class="impact-score-note"></span>';
      html += `<span class="impact-tip" role="tooltip">${tip}</span>`;
      html += '</div>';
    }
    html += '</div>';
  }
  if (f.exampleWork && f.exampleWork.length) {
    html += '<div class="impact-example-work">';
    html += '<span class="impact-example-label">Example work</span>';
    html += '<ul class="impact-example-list">';
    for (const item of f.exampleWork) html += `<li>${escapeRich(item)}</li>`;
    html += '</ul>';
    html += '</div>';
  }
  return html;
}

// ── Detail page ────────────────────────────────────────────────────

function renderDetail(tabId, rowId, colId, cell, dataPath, methodsCell, opts) {
  // opts: { titleOverride, ghPath } \u2014 titleOverride lets the human tab show
  // the human_label as the title while the body comes from data/cells/.
  // ghPath is the path under data/ to send Edit-on-GitHub to.
  const tab = TABS[tabId] || { title: tabId };
  const row = ROWS.find(r => r.id === rowId) || { name: rowId };
  const col = COLS.find(c => c.id === colId) || { name: colId };
  const ghPath = (opts && opts.ghPath) || `cells/${rowId}-${colId}.md`;
  const ghLink = `${GITHUB_REPO}/edit/main/data/${ghPath}`;
  const title = (opts && opts.titleOverride) || cell.summary;

  let html = '';
  html += `<a href="#" class="detail-back" onclick="hideDetail();return false;">\u2190 Back to grid</a>`;
  html += '<div class="detail-breadcrumb">';
  html += `${tab.title} \u203A ${row.name} \u203A ${col.name}`;
  html += '</div>';
  html += `<div class="detail-title">${title}</div>`;
  if (tabId === 'human') html += renderHumanEraMeta(cell.frontmatter);

  // The vision toggle bar lives inside the Problem Sets section (the only
  // content a vision reveals), and only when this cell has vision-tagged
  // problem sets. Threaded into renderBody as the section's prefix.
  const visionBar = tabId === 'agi'
    ? renderVisionToggleBar(visionTagsInBody(cell.body)) : '';

  // Investor-facing "Theory of change" (AGI only): a standalone collapsed box
  // rendered under the summary box.
  const theoryBox = tabId === 'agi'
    ? renderTheoryOfChange(cell.frontmatter) : '';

  // Two-column layout: main body + methods rail
  html += '<div class="detail-layout">';
  html += '<div class="detail-main">';
  html += renderSummaryBox(cell.frontmatter);
  html += theoryBox;
  const status = (cell.frontmatter && cell.frontmatter.status) || '';
  // Expert-review stages come after body_ok; treat them as a reviewed body so
  // the deployed site still shows the content.
  const READY_STATUSES = new Set(['body_ok', 'expert_selected', 'expert_reviewed']);
  const bodyStatus = READY_STATUSES.has(status) ? 'body_ok' : status;
  const statusClass = bodyStatus ? ` status-${bodyStatus.replace(/_/g, '-')}` : '';
  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body${statusClass}">${renderBody(cell.body, visionBar)}</div>`;
    html += `<div class="detail-placeholder detail-body-hidden-notice">This cell isn\u2019t ready yet.</div>`;
  } else {
    html += `<div class="detail-placeholder">This cell hasn\u2019t been documented yet. <a href="${ghLink}">Contribute on GitHub \u2192</a></div>`;
  }
  html += `<div class="detail-footer"><a href="${ghLink}">Edit this page on GitHub \u2192</a></div>`;
  html += '</div>';

  if (methodsCell && methodsCell.body && methodsCell.body.trim()) {
    const methodsGhLink = `${GITHUB_REPO}/edit/main/data/methods/${colId}.md`;
    html += '<aside class="detail-rail">';
    html += `<div class="rail-label">${col.name} \u2014 methods &amp; references</div>`;
    html += `<div class="rail-body">${marked.parse(processEditorial(methodsCell.body))}</div>`;
    html += `<div class="rail-footer"><a href="${methodsGhLink}">Edit on GitHub \u2192</a></div>`;
    html += '</aside>';
  }
  html += '</div>';
  return html;
}

function renderMethodsDetail(tabId, colId, cell) {
  const tab = TABS[tabId] || { title: tabId };
  const col = COLS.find(c => c.id === colId) || { name: colId };
  const ghLink = `${GITHUB_REPO}/edit/main/data/methods/${colId}.md`;

  let html = '';
  html += `<a href="#" class="detail-back" onclick="hideDetail();return false;">\u2190 Back to grid</a>`;
  html += '<div class="detail-breadcrumb">';
  html += `${tab.title} \u203A Methods \u203A ${col.name}`;
  html += '</div>';
  html += `<div class="detail-title">${cell.summary}</div>`;

  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body">${renderBody(cell.body)}</div>`;
  } else {
    html += `<div class="detail-placeholder">This page hasn\u2019t been documented yet. <a href="${ghLink}">Contribute on GitHub \u2192</a></div>`;
  }

  html += `<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e6e1d8;font-size:12px;color:#b5b0a8;">`;
  html += `<a href="${ghLink}" style="color:#8a8378;">Edit this page on GitHub \u2192</a></div>`;
  return html;
}

// ── Show/hide detail ───────────────────────────────────────────────

async function showDetail(tabId, rowId, colId, dataPath) {
  const gridView = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');
  const controls = document.querySelector('.controls');

  gridView.style.display = 'none';
  controls.style.display = 'none';
  detailView.style.display = 'block';
  document.body.classList.add('viewing-detail');
  location.hash = `#detail/${tabId}/${rowId}/${colId}`;

  try {
    if (rowId === 'methods') {
      const resp = await fetch(`${dataPath}/methods/${colId}.md`);
      if (resp.ok) {
        const cell = parseCell(await resp.text());
        detailView.innerHTML = renderMethodsDetail(tabId, colId, cell);
      } else {
        const col = COLS.find(c => c.id === colId) || { name: colId };
        const ghLink = `${GITHUB_REPO}/new/main/data/methods?filename=${colId}.md`;
        detailView.innerHTML = `
          <a href="#" class="detail-back" onclick="hideDetail();return false;">\u2190 Back to grid</a>
          <div class="detail-breadcrumb">Methods \u203A ${col.name}</div>
          <div class="detail-title">${col.name}</div>
          <div class="detail-placeholder">
            This page hasn\u2019t been defined yet. <a href="${ghLink}">Create it on GitHub \u2192</a>
          </div>`;
      }
      return;
    }

    // AGI and Human both load from data/cells/.
    const bodyDir = (tabId === 'agi' || tabId === 'human') ? 'cells' : tabId;
    const [cellResp, methodsResp] = await Promise.all([
      fetch(`${dataPath}/${bodyDir}/${rowId}-${colId}.md`),
      fetch(`${dataPath}/methods/${colId}.md`).catch(() => null)
    ]);

    const methodsCell = methodsResp && methodsResp.ok
      ? parseCell(await methodsResp.text()) : null;

    if (cellResp.ok) {
      const cell = parseCell(await cellResp.text());
      const opts = { ghPath: `${bodyDir}/${rowId}-${colId}.md` };
      // On the Human tab, use frontmatter.human_label as the detail title if present.
      if (tabId === 'human' && cell.frontmatter && cell.frontmatter.human_label) {
        opts.titleOverride = cell.frontmatter.human_label;
      }
      detailView.innerHTML = renderDetail(tabId, rowId, colId, cell, dataPath, methodsCell, opts);
      syncVisionCheckboxes(getActiveVisions());
    } else {
      const tab = TABS[tabId] || { title: tabId };
      const row = ROWS.find(r => r.id === rowId) || { name: rowId };
      const col = COLS.find(c => c.id === colId) || { name: colId };
      const ghLink = `${GITHUB_REPO}/new/main/data/${bodyDir}?filename=${rowId}-${colId}.md`;
      detailView.innerHTML = `
        <a href="#" class="detail-back" onclick="hideDetail();return false;">\u2190 Back to grid</a>
        <div class="detail-breadcrumb">${tab.title} \u203A ${row.name} \u203A ${col.name}</div>
        <div class="detail-title">${row.name} \u00D7 ${col.name}</div>
        <div class="detail-placeholder">
          This cell hasn\u2019t been defined yet. <a href="${ghLink}">Create it on GitHub \u2192</a>
        </div>`;
    }
  } catch {
    detailView.innerHTML = '<div class="detail-placeholder">Failed to load cell data.</div>';
  }
}

function hideDetail() {
  const gridView = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');
  const controls = document.querySelector('.controls');

  detailView.style.display = 'none';
  controls.style.display = 'flex';
  gridView.style.display = 'flex';
  document.body.classList.remove('viewing-detail');
  history.replaceState(null, '', location.pathname);
}

// ── Handle back/forward and direct detail links ────────────────────

function getDataPath() {
  // If app.js is loaded from ../app.js, we're in a subfolder
  const script = document.querySelector('script[src$="app.js"]');
  return script && script.getAttribute('src').startsWith('../') ? '../data' : 'data';
}

function handleHash() {
  const hash = location.hash;
  const match = hash.match(/^#detail\/(\w+)\/(\w+)\/(.+)$/);
  if (match) {
    showDetail(match[1], match[2], match[3], getDataPath());
  } else if (hash === '' || hash === '#') {
    hideDetail();
  }
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', () => {
  handleHash();
  syncVisionCheckboxes(getActiveVisions());
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('input[data-vision]')) {
      setActiveVisions(visionsAfterToggle(t));
    }
  });
});
