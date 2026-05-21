// ── Constants ──────────────────────────────────────────────────────

const TABS = {
  agi: { title: 'AGI Institutions (Required)' },
  human: { title: 'Existing Human Institutions' },
  fidelity: { title: 'Fidelity & Meaning' }
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
  { id: 'medieval', code: 'Md', label: 'Medieval' },
  { id: 'early-modern', code: 'Em', label: 'Early modern' },
  { id: 'industrial', code: 'In', label: 'Industrial' },
  { id: 'twentieth', code: '20', label: '20th century' },
  { id: 'digital', code: '21', label: 'Digital era' },
  { id: 'ancient-medieval', code: 'A-M', label: 'Ancient-medieval' },
  { id: 'ancient-modern', code: 'A+', label: 'Ancient-modern' },
  { id: 'medieval-modern', code: 'M+', label: 'Medieval-modern' },
  { id: 'early-modern-modern', code: 'E+', label: 'Early modern-modern' },
  { id: 'industrial-digital', code: 'I+', label: 'Industrial-digital' }
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

// ── Cell parsing ───────────────────────────────────────────────────

function parseCell(raw) {
  // Strip YAML frontmatter if present; tiny inline parser for key: value and key: [a, b]
  let frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) return;
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
      } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[m[1]] = val;
    });
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

  return { summary, body: ag.body, frontmatter };
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

// Wrap each H3 under the "Problem Sets" H2 in a numbered box. Operates on
// the HTML produced by marked.
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
    wrapped += `<div class="ps-detail-entry">`;
    wrapped += `<div class="ps-detail-header"><span class="ps-detail-number">${i + 1}</span><span class="ps-detail-title">${h.title}</span></div>`;
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
function wrapCollapsibleSections(html) {
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
      out += `<details open class="collapsible-section collapsible-${slug}"><summary><h2>${h.title}</h2><span class="collapsible-chevron" aria-hidden="true"></span></summary><div class="collapsible-body">${body}</div></details>`;
    } else {
      out += html.slice(h.start, sectionEnd);
    }
    cursor = sectionEnd;
  });
  out += html.slice(cursor);
  return out;
}

function renderBody(md) {
  return wrapCollapsibleSections(wrapDesignChoices(wrapProblemSets(renderVividCases(marked.parse(processEditorial(md))))));
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
  return escapeHtml(s).replace(
    /\{&gt;&gt;\s*([\s\S]*?)\s*&lt;&lt;\}/g,
    '<span class="editorial">$1</span>'
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
  if (!problem && (!examples || examples.length === 0) && (!agiBreaks || agiBreaks.length === 0) && (!notes || notes.length === 0)) return '';

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

  // Two-column layout: main body + methods rail
  html += '<div class="detail-layout">';
  html += '<div class="detail-main">';
  html += renderSummaryBox(cell.frontmatter);
  const status = (cell.frontmatter && cell.frontmatter.status) || '';
  const statusClass = status ? ` status-${status.replace(/_/g, '-')}` : '';
  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body${statusClass}">${renderBody(cell.body)}</div>`;
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

    // AGI and Human both load from data/cells/. Fidelity loads from data/fidelity/.
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

function updateScrollableState() {
  document.querySelectorAll('.table-wrapper').forEach(w => {
    w.classList.toggle('is-scrollable', w.scrollWidth > w.clientWidth + 1);
  });
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', () => {
  handleHash();
  updateScrollableState();
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(updateScrollableState);
    document.querySelectorAll('.table-wrapper').forEach(w => ro.observe(w));
  }
});
window.addEventListener('resize', updateScrollableState);
