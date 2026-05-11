#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

// ── Constants (shared with app.js) ─────────────────────────────────

const TABS = {
  agi: {
    title: 'AGI Institutions (Required)',
    short: 'AGI',
    subtitle: 'New institutions needed for a world of autonomous AI agents'
  },
  human: {
    title: 'Existing Human Institutions',
    short: 'Human',
    subtitle: 'Current institutional infrastructure (how humans do alignment)'
  },
  fidelity: {
    title: 'Fidelity & Meaning',
    short: 'Fidelity',
    subtitle: 'Institutions to align things (orgs, gov\'ts, markets) with rich, accountable mandates'
  }
};

function esc(s) { return s.replace(/&/g, '&amp;'); }

const TAB_ORDER = ['agi', 'human', 'fidelity'];

// AGI and Human grids both render from data/cells/. The Human grid uses
// `human_label` frontmatter when present (falls back to H1). Fidelity has
// its own directory.
const TAB_BODY_DIR = { agi: 'cells', human: 'cells', fidelity: 'fidelity' };

const ROWS = [
  { id: 'dyadic', name: 'Dyadic', desc: '2 parties' },
  { id: 'group', name: 'Group', desc: 'teams, clubs' },
  { id: 'community', name: 'Community', desc: 'orgs, cities' },
  { id: 'national', name: 'National', desc: 'states, nations' },
  { id: 'global', name: 'Global', desc: 'transnational' }
];

const COLS = [
  { id: 'protocols', name: 'Protocols', desc: 'standards &amp; coordination' },
  { id: 'preferences', name: 'Preferences', desc: 'aggregated wants' },
  { id: 'rights', name: 'Rights', desc: 'formal entitlements &amp; adjudication' },
  { id: 'incentives', name: 'Incentives', desc: 'structured payoffs' },
  { id: 'expertise', name: 'Expertise', desc: 'credentialed epistemic authority' },
  { id: 'norms', name: 'Norms', desc: 'behavioral expectations' },
  { id: 'thick-commitments', name: 'Thick Commitments', desc: 'articulated shared understanding' }
];

const GITHUB_REPO = 'https://github.com/meaningalignment/institutions';

// ── Data loading ───────────────────────────────────────────────────

function parseCell(raw) {
  let frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    try { frontmatter = yaml.load(fmMatch[1]) || {}; }
    catch (e) { frontmatter = {}; }
    raw = raw.slice(fmMatch[0].length);
  }

  const h1Match = raw.match(/^#\s+(.+)$/m);
  const summary = h1Match ? h1Match[1].trim() : '';
  const bodyAfterH1 = h1Match
    ? raw.slice(raw.indexOf('\n', raw.indexOf(h1Match[0])) + 1).trim()
    : raw;

  return { summary, body: bodyAfterH1, frontmatter };
}

function loadCells(dirName) {
  const dir = path.join(__dirname, 'data', dirName);
  const cells = {};
  if (!fs.existsSync(dir)) return cells;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const name = file.replace('.md', '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    cells[name] = parseCell(raw);
  }
  return cells;
}

function loadMethods() {
  const dir = path.join(__dirname, 'data', 'methods');
  const methods = {};
  if (!fs.existsSync(dir)) return methods;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const colId = file.replace('.md', '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = yaml.load(fmMatch[1]);
      methods[colId] = fm.methods || [];
    } else {
      methods[colId] = [];
    }
  }
  return methods;
}

function getMethodsForCol(colId, tabId, methods) {
  return (methods[colId] || [])
    .filter(m => !m.tabs || m.tabs.includes(tabId))
    .map(m => {
      const bold = m.bold === true || (Array.isArray(m.bold) && m.bold.includes(tabId));
      return { name: m.name, bold };
    });
}

// ── Generate manifest ──────────────────────────────────────────────

function generateManifest() {
  const manifest = {};
  for (const dirName of ['cells', 'fidelity']) {
    const dir = path.join(__dirname, 'data', dirName);
    if (!fs.existsSync(dir)) { manifest[dirName] = []; continue; }
    manifest[dirName] = fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .sort();
  }
  fs.writeFileSync(
    path.join(__dirname, 'data', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated data/manifest.json');
  return manifest;
}

// ── Render grid HTML ───────────────────────────────────────────────

function cellsWithProblemSets(cells) {
  const ps = new Set();
  for (const [key, cell] of Object.entries(cells)) {
    if (cell.body && /^## Problem Sets$/m.test(cell.body)) ps.add(key);
  }
  return ps;
}

function renderGrid(tabId, cells, methods, dataPath) {
  // cells: the dict for this tab's body source (data/cells/ for agi+human, data/fidelity/ for fidelity)
  // Per-cell summary: AGI uses H1; Human uses frontmatter.human_label || H1; Fidelity uses H1.
  const tab = TABS[tabId];
  const psKeys = cellsWithProblemSets(cells);
  let html = '';
  html += `<div class="pane-title">${esc(tab.title)}</div>\n`;
  html += `<div class="pane-subtitle">${esc(tab.subtitle)}</div>\n`;
  html += '<div class="pane-definition">';
  html += '<span class="pane-definition-term">Institutions</span> are the rules, norms, and mechanisms that structure how people interact &mdash; the coordination infrastructure that sits between individual choices and collective outcomes.';
  html += '</div>\n';
  html += '<div class="table-wrapper"><table>\n';

  html += '<thead><tr><th class="corner-cell axis-label-col"></th>';
  for (const col of COLS) {
    html += `<th class="col-header"><span class="col-name">${col.name}</span><span class="col-desc">${col.desc}</span></th>`;
  }
  html += '</tr></thead>\n<tbody>\n';

  for (const row of ROWS) {
    html += '<tr>';
    html += `<th class="row-header"><span class="row-name">${row.name}</span><span class="row-desc">${row.desc}</span></th>`;
    for (const col of COLS) {
      const key = `${row.id}-${col.id}`;
      const cell = cells[key];
      const summary = cell && (
        tabId === 'human' ? (cell.frontmatter?.human_label || cell.summary) : cell.summary
      );
      if (cell && summary) {
        const classes = ['clickable'];
        if (psKeys.has(key)) classes.push('has-ps');
        const status = cell.frontmatter?.status;
        if (status) classes.push(`status-${status}`);
        html += `<td class="${classes.join(' ')}" onclick="showDetail('${tabId}','${row.id}','${col.id}','${dataPath}')">`;
        html += `<div class="cell-content">${summary}</div></td>`;
      } else {
        html += '<td><div class="cell-empty"></div></td>';
      }
    }
    html += '</tr>\n';
  }

  html += '<tr class="methods-row">';
  html += '<th class="row-header"><span class="row-name">Methods</span><span class="row-desc">design practices</span></th>';
  for (const col of COLS) {
    const tags = getMethodsForCol(col.id, tabId, methods);
    html += `<td class="clickable" onclick="showDetail('${tabId}','methods','${col.id}','${dataPath}')"><div class="cell-content">`;
    for (const tag of tags) {
      const cls = tag.bold ? 'method-tag bold' : 'method-tag';
      html += `<span class="${cls}">${tag.name}</span>`;
    }
    html += '</div></td>';
  }
  html += '</tr>\n';

  html += '</tbody></table></div>';
  return html;
}

// ── Render problem sets HTML ───────────────────────────────────────

function extractProblemSets(tabId, cells) {
  const problems = [];
  for (const [cellKey, cell] of Object.entries(cells)) {
    if (!cell.body) continue;
    const psMatch = cell.body.match(/## Problem Sets\n([\s\S]*?)(?=\n## [^#]|$)/);
    if (!psMatch) continue;
    const psContent = psMatch[1].trim();
    if (!psContent) continue;

    const h3Regex = /### (.+)/g;
    let match;
    const h3s = [];
    while ((match = h3Regex.exec(psContent)) !== null) {
      h3s.push({ title: match[1].trim(), start: match.index, headerEnd: match.index + match[0].length });
    }
    for (let i = 0; i < h3s.length; i++) {
      const bodyEnd = i + 1 < h3s.length ? h3s[i + 1].start : psContent.length;
      problems.push({
        title: h3s[i].title,
        body: psContent.slice(h3s[i].headerEnd, bodyEnd).trim(),
        cellKey, tabId
      });
    }
  }
  return problems;
}

function renderProblemSetsPage(allCells) {
  const sections = [
    { id: 'merged', label: 'Part A: AGI-Era Institutions', prefix: 'A', linkTab: 'agi' },
    { id: 'fidelity', label: 'Part B: Fidelity &amp; Meaning', prefix: 'B', linkTab: 'fidelity' }
  ];

  let html = '';
  html += '<a href="../" class="detail-back">&larr; Back to grid</a>\n';
  html += '<div class="ps-page-title">Problem Sets</div>\n';
  html += '<div class="ps-page-subtitle">For pairs/trios. ~1 hour each. Produce a concrete design sketch, not a literature review.</div>\n';

  for (const section of sections) {
    const problems = extractProblemSets(section.id, allCells[section.id] || {});
    if (problems.length === 0) continue;

    html += `<div class="ps-group-title">${section.label}</div>\n`;

    problems.forEach((ps, i) => {
      const parts = ps.cellKey.split('-');
      const rowId = parts[0];
      const colId = parts.slice(1).join('-');
      const row = ROWS.find(r => r.id === rowId);
      const col = COLS.find(c => c.id === colId);
      const cellLabel = row && col ? `${row.name} / ${col.name}` : ps.cellKey;
      const num = `${section.prefix}${i + 1}`;

      html += '<div class="ps-entry">\n';
      html += '<div class="ps-entry-header">';
      html += `<span class="ps-entry-number">${num}</span>`;
      html += `<span class="ps-entry-title">${ps.title}</span>`;
      const pageBase = section.linkTab === 'agi' ? '..' : `../${section.linkTab}`;
      html += `<span class="ps-entry-cell"><a href="${pageBase}/#detail/${section.linkTab}/${rowId}/${colId}">${cellLabel}</a></span>`;
      html += '</div>\n';
      html += `<div class="ps-entry-body">${marked.parse(ps.body)}</div>\n`;
      html += '</div>\n';
    });
  }

  html += '<div class="ps-notes">\n';
  html += '<h3>Notes for Facilitators</h3>\n<ul>\n';
  html += '<li>Each problem is designed to reward mixed teams (e.g., a mechanism designer + a legal scholar; an Ostrom person + an AI safety researcher).</li>\n';
  html += '<li>The deliverables are deliberately concrete—a protocol, a charter, amendment text—to prevent the conversation from remaining at the level of “this is an important problem.”</li>\n';
  html += '<li>Encourage teams to identify where their design <em>breaks</em> and to state the failure conditions explicitly.</li>\n';
  html += '</ul>\n</div>\n';

  return html;
}

// ── Generate grid page HTML ─────────────────────────────────────────

function generateGridPage(tabId, allCells, methods, cssPath, jsPath, dataPath) {
  const bodyDir = TAB_BODY_DIR[tabId];
  const grid = renderGrid(tabId, allCells[bodyDir], methods, dataPath);
  const tabLinks = TAB_ORDER.map(t => {
    const tab = TABS[t];
    const active = t === tabId ? ' active' : '';
    let link;
    if (t === 'agi') link = tabId === 'agi' ? '.' : '..';
    else link = tabId === 'agi' ? t + '/' : (tabId === t ? '.' : '../' + t + '/');
    return `    <a href="${link}" class="tab-link${active}"><span class="tab-full">${esc(tab.title)}</span><span class="tab-short">${esc(tab.short)}</span></a>`;
  }).join('\n');

  const psLink = tabId === 'agi' ? 'problem-sets/' : '../problem-sets/';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(TABS[tabId].title)} — Institutions</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${cssPath}">
</head>
<body>

<div class="controls">
  <nav class="tab-bar">
${tabLinks}
  </nav>
  <a href="${psLink}" class="nav-link">Problem Sets</a>
</div>

<div id="grid-view">
${grid}
</div>
<div id="detail-view"></div>

<footer class="site-footer">
  Backed by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="${jsPath}"></script>

</body>
</html>`;
}

// ── Generate problem-sets/index.html ───────────────────────────────

function generateProblemSetsPage(allCells) {
  const content = renderProblemSetsPage(allCells);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Problem Sets — Institutions</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
</head>
<body>

<div id="problem-sets-view" style="display:block;width:100%;max-width:800px;">
${content}
</div>

<footer class="site-footer">
  Backed by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────

const methods = loadMethods();
const allCells = {
  cells: loadCells('cells'),
  fidelity: loadCells('fidelity')
};
allCells.merged = allCells.cells;

generateManifest();

// AGI = root index.html
fs.writeFileSync(
  path.join(__dirname, 'index.html'),
  generateGridPage('agi', allCells, methods, 'style.css', 'app.js', 'data')
);
console.log('Generated index.html (AGI)');

// Human and Fidelity = subfolders
for (const tabId of ['human', 'fidelity']) {
  fs.mkdirSync(path.join(__dirname, tabId), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, tabId, 'index.html'),
    generateGridPage(tabId, allCells, methods, '../style.css', '../app.js', '../data')
  );
  console.log(`Generated ${tabId}/index.html`);
}

// Problem sets
fs.mkdirSync(path.join(__dirname, 'problem-sets'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'problem-sets', 'index.html'),
  generateProblemSetsPage(allCells)
);
console.log('Generated problem-sets/index.html');
