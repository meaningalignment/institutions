#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

// Inline editorial notes: {>> note text <<} → <span class="editorial">…</span>.
// CSS hides them by default; visible on localhost or with ?editorial in URL.
// Duplicated in app.js so client-rendered cell bodies get the same treatment.
function processEditorial(md) {
  return md.replace(/\{>>\s*([\s\S]*?)\s*<<\}/g, (_, content) => {
    const safe = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<span class="editorial">${safe}</span>`;
  });
}

// Wrap the "Design choices the team must take a position on." paragraph and
// the immediately-following <ol> in a <details open> so users can collapse it.
// Duplicated in app.js for client-rendered cell bodies.
function wrapDesignChoices(html) {
  const re = /<p><strong>Design choices the team must take a position on\.?<\/strong><\/p>\s*<ol>([\s\S]*?)<\/ol>/g;
  return html.replace(re, (_, items) => {
    return `<details class="design-choices"><summary><span>Design Choices</span><span class="collapsible-chevron" aria-hidden="true"></span></summary><ol>${items}</ol></details>`;
  });
}

// ── SEO constants ──────────────────────────────────────────────────

const SITE_ORIGIN = 'https://www.agi-institutions.org';
const SITE_NAME = 'AGI Institutions';
const SITE_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;
const FAVICON_TAGS = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

const TAB_META = {
  agi: {
    description: 'An interactive map of the new institutions needed for a world of autonomous AI agents — from dyadic agent contracts to global AI governance frameworks. Explore coordination mechanisms across scales: dyadic, group, community, national, and global.',
    canonicalPath: '/',
    keywords: 'AGI institutions, AGI governance, AI institutional design, autonomous AI agents, AI society, AI coordination, AGI policy, AI governance frameworks, institutional design for AI'
  },
  human: {
    description: 'How existing human institutions handle coordination across scales — and how autonomous AI agents break them. Maps protocols, preferences, rights, incentives, expertise, norms, and thick commitments from dyadic to global.',
    canonicalPath: '/human/',
    keywords: 'human institutions, institutional design, AI governance comparison, AGI society, coordination mechanisms, human-AI coordination'
  },
  fidelity: {
    description: 'Institutions to align organizations, governments, and markets with rich, accountable mandates. Fidelity and meaning frameworks for the age of autonomous AI.',
    canonicalPath: '/fidelity/',
    keywords: 'fidelity institutions, organizational alignment, AI accountability, meaning alignment, mandate design'
  }
};

// ── Constants (shared with app.js) ─────────────────────────────────

const TABS = {
  agi: {
    title: 'AGI Institutions',   // shown as the selected-tab heading + page <title>
    nav: 'AGI Institutions',                // shown on the tab itself (no "(Required)")
    short: 'AGI',
    subtitle: 'New institutions needed for a world of autonomous AI agents'
  },
  human: {
    title: 'Existing Human Institutions',
    nav: 'Existing Human Institutions',
    short: 'Human',
    subtitle: 'Current institutional infrastructure (how humans do alignment)'
  }
};

// Visions: toggleable overlays of "visionary" institutions layered onto the
// AGI grid. A cell opts in via `visions:` frontmatter (id → grid chip label);
// problem sets opt in via a `{vision: id}` tag in their ### heading. Adding a
// vision = a new entry here plus content tagged with its id (no new files).
const VISIONS = [
  {
    id: 'fidelity',
    label: 'Fidelity & Meaning',
    color: '#b34a6c',
    description: 'Institutions that hold organizations, governments, and markets to rich, accountable mandates rather than thin, gameable proxies.'
  }
];

// Statuses whose body is published on the deployed site. `body_draft` counts as
// published, as do `body_ok` and the expert-review stages that come after it in
// the workflow; only the pre-body stages stay hidden.
const READY_STATUSES = new Set(['body_draft', 'body_ok', 'expert_selected', 'expert_reviewed']);

function esc(s) { return s.replace(/&/g, '&amp;'); }

const TAB_ORDER = ['human', 'agi'];

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

// AGI and Human grids both render from data/cells/. The AGI grid uses the
// H1; the Human grid uses `human_label` frontmatter (falls back to H1).
const TAB_BODY_DIR = { agi: 'cells', human: 'cells' };

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
  // Strip and parse YAML frontmatter if present.
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
  for (const dirName of ['cells']) {
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

function getHumanEra(fm) {
  const label = typeof fm?.human_era === 'string' ? fm.human_era.trim() : '';
  const bucket = typeof fm?.human_era_bucket === 'string' ? fm.human_era_bucket.trim() : '';
  if (!label || !HUMAN_ERA_BUCKET_IDS.has(bucket)) return null;
  const meta = HUMAN_ERA_BUCKETS.find(b => b.id === bucket);
  return { label, bucket, code: meta.code };
}

// A quiet "How to read this" affordance above the table on both grids. It's
// just a faint trigger word; hovering, focusing, or tapping it reveals a small
// popover explaining the two axes — rows = scale (how many actors coordinate),
// columns = informational basis (the kind of information a group coordinates
// around). Mirrors the language in data/theory-of-change.md. Built on <details>
// so it also works (as a click toggle) with no JS / on touch.
function renderAxisGuide() {
  return '<details class="axis-guide">'
    + '<summary class="axis-guide-trigger" aria-label="How to read this grid">How to read this</summary>'
    + '<div class="axis-guide-pop" role="note">'
    + '<div class="axis-guide-row"><span class="axis-guide-tag">Rows ↓</span>'
    + '<span class="axis-guide-text"><b>Scale</b> — how many actors are coordinating, dyadic to global</span></div>'
    + '<div class="axis-guide-row"><span class="axis-guide-tag">Cols →</span>'
    + '<span class="axis-guide-text"><b>Informational basis</b> — the kind of information the group coordinates around</span></div>'
    + '</div>'
    + '</details>\n';
}

function renderHumanEraLegend(cells) {
  const used = new Set(
    Object.values(cells)
      .map(cell => getHumanEra(cell.frontmatter)?.bucket)
      .filter(Boolean)
  );
  let html = '<div class="human-era-legend" aria-label="Human institution design era">';
  for (const bucket of HUMAN_ERA_BUCKETS) {
    if (!used.has(bucket.id)) continue;
    html += `<span class="human-era-legend-item era-${bucket.id}">`;
    html += `<span class="human-era-legend-label">${esc(bucket.label)}</span>`;
    html += '</span>';
  }
  html += '</div>\n';
  return html;
}

function renderGrid(tabId, cells, methods, dataPath) {
  // cells: the dict for this tab's body source (data/cells/ for both agi + human)
  // Per-cell summary: AGI uses H1; Human uses frontmatter.human_label || H1; Fidelity uses H1.
  const tab = TABS[tabId];
  let html = '';
  html += `<div class="pane-title">${esc(tab.title)}</div>\n`;
  html += `<div class="pane-subtitle">${esc(tab.subtitle)}</div>\n`;
  html += renderAxisGuide();
  if (tabId === 'human') html += renderHumanEraLegend(cells);
  html += '<div class="table-wrapper"><table>\n';

  html += '<thead><tr><th class="corner-cell axis-label-col">'
    + '<span class="axis-corner-y">Scale <span class="axis-arrow">↓</span></span>'
    + '<span class="axis-corner-x"><span class="axis-arrow">→</span> Basis</span>'
    + '</th>';
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
      const hideOnTab = cell && (
        (tabId === 'agi' && cell.frontmatter?.hide_agi === true) ||
        (tabId === 'human' && cell.frontmatter?.hide_human === true)
      );
      const summary = cell && !hideOnTab && (
        tabId === 'human' ? (cell.frontmatter?.human_label || cell.summary)
        : cell.summary
      );
      // Visionary institutions declared by the cell (AGI grid only). Each
      // becomes a toggleable chip; the label comes from `visions:` frontmatter.
      const visionEntries = (tabId === 'agi' && cell && cell.frontmatter
        && cell.frontmatter.visions && typeof cell.frontmatter.visions === 'object')
        ? VISIONS.filter(v => cell.frontmatter.visions[v.id])
            .map(v => ({ id: v.id, label: cell.frontmatter.visions[v.id] }))
        : [];
      if (cell && (summary || visionEntries.length)) {
        const classes = ['clickable'];
        const status = cell.frontmatter?.status;
        if (tabId === 'agi' && READY_STATUSES.has(status)) classes.push('status-body-ok');
        // Blue top-left flag: this cell has an investor-facing Theory of change
        // section (AGI grid only). Detected from the body markdown.
        if (tabId === 'agi' && cell.body && /^## Theory of change\s*$/m.test(cell.body)) {
          classes.push('has-theory');
        }
        const humanEra = tabId === 'human' ? getHumanEra(cell.frontmatter) : null;
        if (humanEra) classes.push('human-era-tile', `era-${humanEra.bucket}`);
        html += `<td class="${classes.join(' ')}" onclick="showDetail('${tabId}','${row.id}','${col.id}','${dataPath}')">`;
        if (humanEra) {
          html += '<div class="cell-content">';
          html += `<span class="human-era-label">${esc(humanEra.label)}</span>`;
          html += `<span class="human-cell-label">${esc(summary)}</span>`;
          html += '</div></td>';
        } else {
          html += '<div class="cell-content">';
          if (summary) html += `<span class="cell-required-label">${esc(summary)}</span>`;
          for (const ve of visionEntries) {
            html += `<span class="vision-chip" data-vision="${ve.id}">${esc(ve.label)}</span>`;
          }
          html += '</div></td>';
        }
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

// Parse a trailing `{vision: id}` tag off a problem-set heading.
// Mirrored in app.js wrapProblemSets — keep both in sync.
function parseVisionTag(title) {
  const m = title.match(/\s*\{vision:\s*([a-z0-9_-]+)\s*\}\s*$/i);
  if (!m) return { title, vision: null };
  return { title: title.slice(0, m.index).trim(), vision: m[1].toLowerCase() };
}

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
      const parsed = parseVisionTag(match[1].trim());
      h3s.push({ title: parsed.title, vision: parsed.vision, start: match.index, headerEnd: match.index + match[0].length });
    }
    for (let i = 0; i < h3s.length; i++) {
      const bodyEnd = i + 1 < h3s.length ? h3s[i + 1].start : psContent.length;
      problems.push({
        title: h3s[i].title,
        vision: h3s[i].vision,
        body: psContent.slice(h3s[i].headerEnd, bodyEnd).trim(),
        cellKey, tabId
      });
    }
  }
  return problems;
}

function renderProblemSetsPage(cells) {
  // All problem sets live in data/cells/. Untagged ones are "required" and
  // always shown; ones tagged `{vision: id}` are grouped per vision and
  // hidden unless that vision is active (CSS, driven by the same toggle).
  const all = extractProblemSets('agi', cells);
  const required = all.filter(p => !p.vision);
  const visionGroups = VISIONS
    .map(v => ({ v, items: all.filter(p => p.vision === v.id) }))
    .filter(g => g.items.length);

  const entry = (ps, num, visionId) => {
    const parts = ps.cellKey.split('-');
    const rowId = parts[0];
    const colId = parts.slice(1).join('-');
    const row = ROWS.find(r => r.id === rowId);
    const col = COLS.find(c => c.id === colId);
    const cellLabel = row && col ? `${row.name} / ${col.name}` : ps.cellKey;
    // Carry the vision in the URL (query before hash) so the cell opens with it on.
    const href = visionId
      ? `..?visions=${visionId}#detail/agi/${rowId}/${colId}`
      : `../#detail/agi/${rowId}/${colId}`;
    const dataAttr = visionId ? ` data-vision="${visionId}"` : '';
    let h = `<div class="ps-entry"${dataAttr}>\n`;
    h += '<div class="ps-entry-header">';
    h += `<span class="ps-entry-number">${num}</span>`;
    h += `<span class="ps-entry-title">${ps.title}</span>`;
    h += `<span class="ps-entry-cell"><a href="${href}">${cellLabel}</a></span>`;
    h += '</div>\n';
    h += `<div class="ps-entry-body">${wrapDesignChoices(marked.parse(processEditorial(ps.body)))}</div>\n`;
    h += '</div>\n';
    return h;
  };

  let html = '';
  html += '<a href="../" class="detail-back">&larr; Back to grid</a>\n';
  html += '<div class="ps-page-title">Problem Sets</div>\n';
  html += '<div class="ps-page-subtitle">For pairs/trios. ~1 hour each. Produce a concrete design sketch, not a literature review.</div>\n';
  html += renderVisionMenu();

  if (required.length) {
    html += `<div class="ps-group-title">Required</div>\n`;
    required.forEach((ps, i) => { html += entry(ps, `${i + 1}`, null); });
  }

  for (const g of visionGroups) {
    html += `<div class="ps-vision-group" data-vision="${g.v.id}">\n`;
    html += `<div class="ps-group-title">${esc(g.v.label)}</div>\n`;
    g.items.forEach((ps, i) => { html += entry(ps, `${i + 1}`, g.v.id); });
    html += `</div>\n`;
  }

  html += '<div class="ps-notes">\n';
  html += '<h3>Notes for Facilitators</h3>\n<ul>\n';
  html += '<li>Each problem is designed to reward mixed teams (e.g., a mechanism designer + a legal scholar; an Ostrom person + an AI safety researcher).</li>\n';
  html += '<li>The deliverables are deliberately concrete\u2014a protocol, a charter, amendment text\u2014to prevent the conversation from remaining at the level of \u201cthis is an important problem.\u201d</li>\n';
  html += '<li>Encourage teams to identify where their design <em>breaks</em> and to state the failure conditions explicitly.</li>\n';
  html += '</ul>\n</div>\n';

  return html;
}

// ── Visions: selector, theming, client registry ────────────────────

function renderVisionMenu() {
  if (!VISIONS.length) return '';
  let items = '';
  for (const v of VISIONS) {
    items += `<label class="vision-menu-item"><input type="checkbox" data-vision="${v.id}"><span class="vision-swatch" style="background:${v.color}"></span><span>${esc(v.label)}</span></label>`;
  }
  return `<details class="vision-menu"><summary>Visions</summary><div class="vision-menu-list">${items}</div></details>`;
}

// Per-vision colors + reveal rules. Generated so adding a vision needs no
// hand-written CSS. Base "hidden by default" rules live in style.css.
function renderVisionStyles() {
  if (!VISIONS.length) return '';
  let css = '';
  for (const v of VISIONS) {
    css += `.vision-chip[data-vision="${v.id}"],.ps-entry[data-vision="${v.id}"],.ps-detail-entry[data-vision="${v.id}"],.ps-vision-group[data-vision="${v.id}"]{--vision-color:${v.color};}`;
    css += `html.show-vision-${v.id} .vision-chip[data-vision="${v.id}"]{display:inline-block;}`;
    css += `html.show-vision-${v.id} .ps-entry[data-vision="${v.id}"],html.show-vision-${v.id} .ps-detail-entry[data-vision="${v.id}"],html.show-vision-${v.id} .ps-vision-group[data-vision="${v.id}"]{display:block;}`;
  }
  return `<style>\n${css}\n</style>`;
}

function renderVisionsRegistryTag() {
  const data = JSON.stringify(VISIONS.map(v => ({ id: v.id, label: v.label, color: v.color })));
  return `<script>window.__VISIONS__=${data};</script>`;
}

// ── "What is this?" link ───────────────────────────────────────────
// A link in the controls row to the standalone /theory-of-change/ page
// (what this grid is, why it's needed, and the theory of change). The
// page is generated by generateTheoryOfChangePage from
// data/theory-of-change.md.

function renderAboutButton(tocLink = 'theory-of-change/') {
  return `<a class="about-button" href="${tocLink}">What is this?</a>`;
}

// ── Generate grid page HTML ─────────────────────────────────────────

function generateGridPage(tabId, allCells, methods, cssPath, jsPath, dataPath) {
  const bodyDir = TAB_BODY_DIR[tabId];
  const grid = renderGrid(tabId, allCells[bodyDir], methods, dataPath);
  const tabLinks = TAB_ORDER.map(t => {
    const tab = TABS[t];
    const active = t === tabId ? ' active' : '';
    const href = t === 'agi' ? (tabId === 'agi' ? '#' : `${tabId === 'agi' ? '' : '../'}`)
      : (tabId === t ? '#' : `${tabId === 'agi' ? '' : '../'}${t}/`);
    // Simplify: root = agi, others = subfolders
    let link;
    if (t === 'agi') link = tabId === 'agi' ? '.' : '..';
    else link = tabId === 'agi' ? t + '/' : (tabId === t ? '.' : '../' + t + '/');
    return `    <a href="${link}" class="tab-link${active}"><span class="tab-full">${esc(tab.nav || tab.title)}</span><span class="tab-short">${esc(tab.short)}</span></a>`;
  }).join('\n');

  const tocLink = tabId === 'agi' ? 'theory-of-change/' : '../theory-of-change/';
  const visionMenu = tabId === 'agi' ? renderVisionMenu() : '';
  const aboutButton = renderAboutButton(tocLink);

  const meta = TAB_META[tabId];
  const pageTitle = `${esc(TABS[tabId].title)} — AGI Institutions`;
  const canonicalUrl = `${SITE_ORIGIN}${meta.canonicalPath}`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        description: TAB_META.agi.description,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` }
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Meaning Alignment Institute',
        url: 'https://meaningalignment.org',
        sameAs: ['https://github.com/meaningalignment/institutions']
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageTitle,
        description: meta.description,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: {
          '@type': 'Thing',
          name: 'AGI institutional design and AI governance'
        },
        keywords: meta.keywords
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FAVICON_TAGS}
<title>${pageTitle}</title>
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">
<link rel="canonical" href="${canonicalUrl}">
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${SITE_OG_IMAGE}">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${pageTitle}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="${SITE_OG_IMAGE}">
<!-- JSON-LD structured data -->
<script type="application/ld+json">${jsonLd}</script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${cssPath}">
${renderVisionStyles()}
</head>
<body class="tab-${tabId}">

<div class="controls">
  <nav class="tab-bar">
${tabLinks}
  </nav>
  ${visionMenu}
  ${aboutButton}
</div>

<div id="grid-view">
${grid}
</div>
<div id="detail-view"></div>

<footer class="site-footer">
  Assembled by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

${renderVisionsRegistryTag()}
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="${jsPath}"></script>

</body>
</html>`;
}

// ── Generate problem-sets/index.html ───────────────────────────────

function generateProblemSetsPage(cells) {
  const content = renderProblemSetsPage(cells);

  const psTitle = 'Problem Sets — AGI Institutions';
  const psDesc = 'Design problems for pairs and small teams exploring AGI institutional design: from agent contracts to global AI governance frameworks. Each problem is ~1 hour and produces a concrete design sketch.';
  const psCanonical = `${SITE_ORIGIN}/problem-sets/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FAVICON_TAGS}
<title>${psTitle}</title>
<meta name="description" content="${psDesc}">
<link rel="canonical" href="${psCanonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${psTitle}">
<meta property="og:description" content="${psDesc}">
<meta property="og:url" content="${psCanonical}">
<meta property="og:image" content="${SITE_OG_IMAGE}">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
${renderVisionStyles()}
</head>
<body>

<div id="problem-sets-view" style="display:block;width:100%;max-width:800px;">
${content}
</div>

<footer class="site-footer">
  Assembled by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

${renderVisionsRegistryTag()}
<script>
(function(){
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '' || /[?&]editorial(=|&|$)/.test(location.search)) {
    document.documentElement.classList.add('show-editorial');
  }
})();
// Vision toggle state (this page does not load app.js). Mirrors app.js.
(function(){
  function read(){
    var p = new URLSearchParams(location.search).get('visions');
    if (p !== null) return p ? p.split(',').filter(Boolean) : [];
    try { return JSON.parse(localStorage.getItem('visions') || '[]'); } catch(e){ return []; }
  }
  function apply(list){
    var r = document.documentElement;
    r.className = r.className.replace(/\\bshow-vision-\\S+/g, '').trim();
    list.forEach(function(id){ r.classList.add('show-vision-' + id); });
  }
  function persist(list){
    try { localStorage.setItem('visions', JSON.stringify(list)); } catch(e){}
    var params = new URLSearchParams(location.search);
    if (list.length) params.set('visions', list.join(',')); else params.delete('visions');
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
  var active = read();
  apply(active);
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('input[data-vision]').forEach(function(b){
      b.checked = active.indexOf(b.getAttribute('data-vision')) !== -1;
    });
    document.addEventListener('change', function(e){
      var t = e.target;
      if (!t || !t.matches || !t.matches('input[data-vision]')) return;
      // Toggle the changed vision in the active list (mirrors app.js:
      // don't union all checkboxes, a vision can have multiple copies).
      var id = t.getAttribute('data-vision');
      var ids = active.filter(function(v){ return v !== id; });
      if (t.checked) ids.push(id);
      active = ids; apply(ids); persist(ids);
      document.querySelectorAll('input[data-vision]').forEach(function(b){
        b.checked = ids.indexOf(b.getAttribute('data-vision')) !== -1;
      });
    });
  });
})();
</script>

</body>
</html>`;
}

// ── Generate curriculum/index.html ─────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Load the entry-axis taxonomy from data/curriculum-map.yaml. Returns an
// array of themes: { id, label, description, cells: [cellId],
// fields: [{ id, bridge }] }. The YAML uses `gain` for the field's
// "What you'll gain" text; we keep the `bridge` key internally so the rest of
// the pipeline (JSON blob, client JS) is unchanged. Missing file → no pickers.
function loadCurriculumMap() {
  const file = path.join(__dirname, 'data', 'curriculum-map.yaml');
  if (!fs.existsSync(file)) return [];
  let doc;
  try { doc = yaml.load(fs.readFileSync(file, 'utf8')) || {}; }
  catch (e) {
    console.warn(`[curriculum] could not parse curriculum-map.yaml: ${e.message}`);
    return [];
  }
  const themes = Array.isArray(doc.themes) ? doc.themes : [];
  return themes.map((t) => ({
    id: t.id || slugify(t.label || ''),
    label: t.label || '',
    description: t.description || '',
    cells: Array.isArray(t.cells) ? t.cells : [],
    fields: (Array.isArray(t.fields) ? t.fields : []).map((f) => ({
      id: f.id, bridge: (f.gain || '').trim(),
    })),
  }));
}

function generateCurriculumPage(cells) {
  cells = cells || {};
  let md = fs.readFileSync(path.join(__dirname, 'data', 'curriculum.md'), 'utf8');

  // The H1 is the page title; pull it out, then split on H2:
  // everything before the first H2 is the intro; each H2 starts a field.
  const title = (md.match(/^# (.+)$/m) || [, 'Curriculum'])[1].trim();
  md = md.replace(/^# .+$/m, '').trim();

  // Entry-axis taxonomy now lives in its own YAML file; curriculum.md is
  // pure prose.
  const themes = loadCurriculumMap();

  const [intro, ...rawFields] = md.split(/(?=^## )/m);
  const introHtml = marked.parse(processEditorial(intro));

  // Turn each raw "## Name\n...body" chunk into a renderable field. The id
  // slug keeps the leading number (e.g. "1-the-big-picture") for stable links;
  // the display name strips it so numbering can be re-derived dynamically when
  // a picker re-ranks the fields.
  const fields = rawFields.map((chunk) => {
    const name = (chunk.match(/^## (.+)$/m) || [, ''])[1].trim();
    const displayName = name.replace(/^\d+\.\s*/, '').trim();
    const body = chunk.replace(/^## .+$/m, '').replace(/\n---\s*$/m, '').trim();
    let bodyHtml = marked.parse(processEditorial(body));
    // Tag the "Key concepts" list so CSS can render it in two columns.
    bodyHtml = bodyHtml.replace(
      /(<h3[^>]*>\s*Key concepts\s*<\/h3>\s*)<ul>/gi,
      '$1<ul class="curr-key-concepts">'
    );
    return { name: displayName, id: slugify(name), bodyHtml };
  });

  const navLink = (f, i) => `<a href="#${f.id}" class="curr-toc-link">${i + 1}. ${esc(f.name)}</a>`;
  const tocHtml = fields.length
    ? `<nav class="curr-toc" aria-label="Fields">\n  ${fields.map(navLink).join('\n  ')}\n</nav>`
    : '';

  // Sidebar carries a dynamic number badge the client renumbers on re-rank.
  const sidebarItem = (f, i) =>
    `<li><a href="#${f.id}" class="curr-sidebar-link" data-target="${f.id}"><span class="curr-sidebar-num">${i + 1}</span><span class="curr-sidebar-label">${esc(f.name)}</span></a></li>`;
  const sidebarHtml = fields.length
    ? `<aside class="curr-sidebar" aria-label="Curriculum sections">
  <div class="curr-sidebar-title">Sections</div>
  <ul class="curr-sidebar-list">
    ${fields.map(sidebarItem).join('\n    ')}
  </ul>
</aside>`
    : '';

  const sectionsHtml = fields.map((f, i) => `<details open class="curr-field" id="${f.id}" data-field="${f.id}">
  <summary class="curr-field-summary"><h2 class="curr-field-name"><span class="curr-field-num">${i + 1}</span><span class="curr-field-title">${esc(f.name)}</span></h2><span class="curr-field-chevron" aria-hidden="true"></span></summary>
  <div class="curr-field-body">
${f.bodyHtml}
  </div>
</details>`).join('\n');

  // ── Entry-axis "Problem map" picker ──────────────────────────────
  // Validate every referenced field id resolves to a real field; warn on
  // misses (and on themes with no fields). Then build the picker tiles and
  // the JSON map the client reorders fields from.
  const fieldIds = new Set(fields.map((f) => f.id));
  for (const t of themes) {
    if (!t.fields.length) {
      console.warn(`[curriculum] problem-map theme "${t.id}" has no field references`);
    }
    for (const fr of t.fields) {
      if (!fieldIds.has(fr.id)) {
        console.warn(`[curriculum] problem-map theme "${t.id}" references unknown field "${fr.id}"`);
      }
      if (!fr.bridge || /^TODO/i.test(fr.bridge)) {
        console.warn(`[curriculum] problem-map theme "${t.id}" field "${fr.id}" has a TODO/empty gain line (scaffold)`);
      }
    }
  }

  // ── Institutions: cell → themes inverse map ──────────────────────
  // Each theme lists exemplar cells; invert that so the "Start from an
  // institution" picker can offer a tile per live AGI cell that re-ranks
  // fields by merging the themes the cell belongs to. Tile label = the cell
  // H1. Only cells that exist, are not hidden on the AGI grid, and map to at
  // least one theme appear.
  const cellThemes = {}; // cellId -> [themeId, ...]
  for (const t of themes) {
    for (const cid of (t.cells || [])) {
      if (!cellThemes[cid]) cellThemes[cid] = [];
      if (!cellThemes[cid].includes(t.id)) cellThemes[cid].push(t.id);
    }
  }
  const institutions = Object.keys(cellThemes)
    .map((cid) => {
      const cell = cells[cid];
      if (!cell || cell.frontmatter?.hide_agi === true || !cell.summary) {
        console.warn(`[curriculum] institution "${cid}" referenced by a theme is missing or hidden on the AGI grid`);
        return null;
      }
      return { id: cid, label: cell.summary, themes: cellThemes[cid] };
    })
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label));

  const themeTilesHtml = themes.map((t) => `      <button type="button" class="curr-picker-tile" role="listitem" data-theme="${esc(t.id)}">
        <span class="curr-picker-tile-label">${esc(t.label)}</span>
        <span class="curr-picker-tile-desc">${esc(t.description)}</span>
      </button>`).join('\n');

  const instTilesHtml = institutions.map((c) => `      <button type="button" class="curr-picker-tile curr-picker-tile-inst" role="listitem" data-cell="${esc(c.id)}">
        <span class="curr-picker-tile-label">${esc(c.label)}</span>
      </button>`).join('\n');

  // Two foldable pickers under the intro, both collapsed by default.
  const pickerHtml = (themes.length || institutions.length) ? `<div class="curr-pickers" id="curr-pickers">
  <button type="button" class="curr-picker-reset" id="curr-picker-reset" hidden>Show all fields</button>
  <button type="button" class="curr-picker-change" id="curr-picker-change">Change selection <span aria-hidden="true">▸</span></button>
  ${themes.length ? `<details class="curr-picker" aria-label="Start from a problem">
    <summary class="curr-picker-summary"><span class="curr-picker-title">Start from a problem you care about</span><span class="curr-picker-chevron" aria-hidden="true"></span></summary>
    <div class="curr-picker-grid" role="list">
${themeTilesHtml}
    </div>
  </details>` : ''}
  ${institutions.length ? `<details class="curr-picker" aria-label="Start from an institution">
    <summary class="curr-picker-summary"><span class="curr-picker-title">Start from an institution we need to build</span><span class="curr-picker-chevron" aria-hidden="true"></span></summary>
    <div class="curr-picker-grid" role="list">
${instTilesHtml}
    </div>
  </details>` : ''}
</div>` : '';

  const themeMap = {};
  for (const t of themes) {
    themeMap[t.id] = {
      label: t.label,
      fields: t.fields.map((fr) => ({ id: fr.id, bridge: fr.bridge })),
    };
  }
  const cellMap = {};
  for (const c of institutions) {
    cellMap[c.id] = { label: c.label, themes: c.themes };
  }
  const themeMapJson = (themes.length || institutions.length)
    ? `<script type="application/json" id="curr-theme-map">${JSON.stringify({ themes: themeMap, cells: cellMap }).replace(/</g, '\\u003c')}</script>`
    : '';

  const currTitle = `${esc(title)} — AGI Institutions`;
  const currDesc = 'A curriculum for institutional designers engaging with AI governance: mechanism design, constitutional design, market design, regulatory frameworks, and more — all contextualized for the age of autonomous AI agents.';
  const currCanonical = `${SITE_ORIGIN}/curriculum/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FAVICON_TAGS}
<title>${currTitle}</title>
<meta name="description" content="${currDesc}">
<link rel="canonical" href="${currCanonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${currTitle}">
<meta property="og:description" content="${currDesc}">
<meta property="og:url" content="${currCanonical}">
<meta property="og:image" content="${SITE_OG_IMAGE}">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
</head>
<body>

<div id="curriculum-view" class="curr-layout">
${sidebarHtml}
<div class="curr-main">
<a href="../" class="detail-back">&larr; Back to grid</a>
<div class="curr-selection-chip" id="curr-selection-chip" hidden><span class="curr-selection-chip-kind"></span><span class="curr-selection-chip-label"></span><button type="button" class="curr-selection-chip-x" aria-label="Clear selection">&times;</button></div>
<div class="curr-page-title">${esc(title)}</div>
${introHtml}
${pickerHtml}
${tocHtml}
<div class="curr-fields" id="curr-fields">
${sectionsHtml}
</div>
${themeMapJson}
</div>
</div>

<footer class="site-footer">
  Assembled by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

<script>
(function () {
  // Scrollspy: highlight sidebar link for the section in view
  var links = document.querySelectorAll('.curr-sidebar-link');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.dataset.target] = a; });
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      // Pick the topmost visible section
      var sections = Array.from(document.querySelectorAll('.curr-field'));
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible.has(sections[i].id)) { current = sections[i].id; break; }
      }
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.dataset.target === current);
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('.curr-field').forEach(function (s) { io.observe(s); });
  }
})();

(function () {
  // Entry-axis pickers: clicking a problem theme (or an institution) floats
  // its relevant fields to the top with a per-field "what you'll gain" line, and
  // collapses the rest under an "Other fields" divider. The sidebar and the
  // field headings renumber to match the new order. Degrades to
  // all-fields-visible with JS off (the picker tiles simply do nothing).
  var blob = document.getElementById('curr-theme-map');
  var container = document.getElementById('curr-fields');
  var tiles = Array.from(document.querySelectorAll('.curr-picker-tile'));
  var resetBtn = document.getElementById('curr-picker-reset');
  var pickers = document.getElementById('curr-pickers');
  var changeBtn = document.getElementById('curr-picker-change');
  var pickerDetails = pickers ? Array.from(pickers.querySelectorAll('details.curr-picker')) : [];
  if (!blob || !container || !tiles.length) return;

  // Collapse the picker boxes to a faint "Change selection" line while a
  // selection is active (the top-right chip is the live control); expand them
  // again to switch.
  function collapsePickers(on) {
    if (!pickers) return;
    pickers.classList.toggle('is-collapsed', !!on);
    if (on) pickerDetails.forEach(function (d) { d.open = false; });
  }

  var DATA;
  try { DATA = JSON.parse(blob.textContent); } catch (e) { return; }
  var THEMES = DATA.themes || {};
  var CELLS = DATA.cells || {};

  // Remember the original DOM order so reset is exact.
  var originalOrder = Array.from(container.querySelectorAll('.curr-field'));
  var byField = {};
  originalOrder.forEach(function (el) { byField[el.dataset.field] = el; });

  // Sidebar links keyed by field id, for reorder + renumber.
  var sidebarList = document.querySelector('.curr-sidebar-list');
  var sidebarLinks = {};
  var sidebarItems = {};
  Array.from(document.querySelectorAll('.curr-sidebar-link')).forEach(function (a) {
    sidebarLinks[a.dataset.target] = a;
    sidebarItems[a.dataset.target] = a.parentNode; // the <li>
  });
  var sidebarOriginal = sidebarList ? Array.from(sidebarList.children) : [];

  // Renumber field headings + sidebar to reflect current DOM order.
  function renumber() {
    var ordered = Array.from(container.querySelectorAll('.curr-field'));
    var n = 0;
    ordered.forEach(function (el) {
      var num = el.classList.contains('is-dimmed') ? '' : String(++n);
      var fnum = el.querySelector('.curr-field-num');
      if (fnum) fnum.textContent = num;
      var fid = el.dataset.field;
      var snum = sidebarLinks[fid] && sidebarLinks[fid].querySelector('.curr-sidebar-num');
      if (snum) snum.textContent = num || '·';
    });
  }

  function clearInjected() {
    container.querySelectorAll('.curr-gain').forEach(function (n) { n.remove(); });
    var divider = container.querySelector('.curr-other-divider');
    if (divider) divider.remove();
    originalOrder.forEach(function (el) {
      el.classList.remove('is-relevant', 'is-dimmed');
    });
  }

  // Selection chip (top-right) reflects the active selection and clears it.
  var chip = document.getElementById('curr-selection-chip');
  var chipKind = chip && chip.querySelector('.curr-selection-chip-kind');
  var chipLabel = chip && chip.querySelector('.curr-selection-chip-label');
  var chipX = chip && chip.querySelector('.curr-selection-chip-x');

  function setChip(kind, label) {
    if (!chip) return;
    if (!kind) { chip.hidden = true; return; }
    if (chipKind) chipKind.textContent = kind === 'institution' ? 'Institution' : 'Problem';
    if (chipLabel) chipLabel.textContent = label;
    chip.hidden = false;
  }

  // URL state: ?problem=<id> or ?institution=<id> (mutually exclusive).
  function setUrl(kind, id) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.delete('problem');
    url.searchParams.delete('institution');
    if (kind && id) url.searchParams.set(kind, id);
    window.history.replaceState(null, '', url.toString());
  }

  function reset(skipUrl) {
    clearInjected();
    // Restore original DOM order (fields + sidebar).
    originalOrder.forEach(function (el) { container.appendChild(el); });
    if (sidebarList) sidebarOriginal.forEach(function (li) { sidebarList.appendChild(li); });
    tiles.forEach(function (t) { t.classList.remove('is-active'); });
    sidebarOriginal.forEach(function (li) { li.classList.remove('is-dimmed'); });
    renumber();
    if (resetBtn) resetBtn.hidden = true;
    collapsePickers(false);
    setChip(null);
    if (!skipUrl) setUrl(null);
  }

  // Resolve a selection (theme or merged institution) to an ordered list of
  // {id, bridge} field rankings.
  function rankingForTheme(themeId) {
    var t = THEMES[themeId];
    return t ? { fields: t.fields.slice() } : null;
  }
  function rankingForCell(cellId) {
    var c = CELLS[cellId];
    if (!c) return null;
    // Merge the cell's themes: first occurrence of a field wins its bridge and
    // position.
    var seen = {};
    var fields = [];
    c.themes.forEach(function (tid) {
      var t = THEMES[tid];
      if (!t) return;
      t.fields.forEach(function (f) {
        if (seen[f.id]) return;
        seen[f.id] = true;
        fields.push(f);
      });
    });
    return { fields: fields };
  }

  function applyRanking(ranking) {
    if (!ranking || !ranking.fields.length) return;
    clearInjected();

    var relevantSet = {};
    ranking.fields.forEach(function (f) { relevantSet[f.id] = true; });

    // Relevant fields, in ranking order, to the top.
    ranking.fields.forEach(function (f) {
      var el = byField[f.id];
      if (!el) return;
      el.classList.add('is-relevant');
      el.classList.remove('is-dimmed');
      if (!el.open) el.open = true;
      var body = el.querySelector('.curr-field-body');
      if (body) {
        // Per-field "What you'll gain" block (same style as the old banner).
        var gain = document.createElement('div');
        gain.className = 'curr-gain';
        var glabel = document.createElement('span');
        glabel.className = 'curr-gain-label';
        glabel.textContent = 'What you\\u2019ll gain';
        gain.appendChild(glabel);
        var gtext = document.createElement('span');
        gtext.className = 'curr-gain-text';
        gtext.textContent = f.bridge;
        gain.appendChild(gtext);
        body.insertBefore(gain, body.firstChild);
      }
      container.appendChild(el);
      // Mirror order in the sidebar.
      if (sidebarList && sidebarItems[f.id]) {
        sidebarItems[f.id].classList.remove('is-dimmed');
        sidebarList.appendChild(sidebarItems[f.id]);
      }
    });

    // "Other fields" divider, then the rest (collapsed + dimmed).
    var divider = document.createElement('div');
    divider.className = 'curr-other-divider';
    divider.innerHTML = '<span>Other fields</span>';
    container.appendChild(divider);

    originalOrder.forEach(function (el) {
      if (relevantSet[el.dataset.field]) return;
      el.classList.add('is-dimmed');
      el.classList.remove('is-relevant');
      el.open = false;
      container.appendChild(el);
      if (sidebarList && sidebarItems[el.dataset.field]) {
        sidebarItems[el.dataset.field].classList.add('is-dimmed');
        sidebarList.appendChild(sidebarItems[el.dataset.field]);
      }
    });

    renumber();
    if (resetBtn) resetBtn.hidden = false;
  }

  // Central selection entry point used by tile clicks and URL state.
  // kind: 'problem' | 'institution'. Returns true if it applied.
  function select(kind, id, skipUrl) {
    var ranking, label;
    if (kind === 'problem') {
      var t = THEMES[id];
      if (!t) return false;
      ranking = rankingForTheme(id);
      label = t.label;
    } else if (kind === 'institution') {
      var c = CELLS[id];
      if (!c) return false;
      ranking = rankingForCell(id);
      label = c.label;
    } else {
      return false;
    }
    if (!ranking || !ranking.fields.length) return false;
    applyRanking(ranking);
    var attr = kind === 'problem' ? 'theme' : 'cell';
    tiles.forEach(function (o) { o.classList.toggle('is-active', o.dataset[attr] === id); });
    setChip(kind, label);
    collapsePickers(true);
    if (!skipUrl) setUrl(kind, id);
    return true;
  }

  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.classList.contains('is-active')) { reset(); return; }
      select(t.dataset.theme ? 'problem' : 'institution', t.dataset.theme || t.dataset.cell);
    });
  });
  if (resetBtn) resetBtn.addEventListener('click', function () { reset(); });
  if (chipX) chipX.addEventListener('click', function () { reset(); });
  // "Change selection" expands the pickers without clearing the current
  // selection; open the details holding the active tile so the user lands on it.
  if (changeBtn) changeBtn.addEventListener('click', function () {
    collapsePickers(false);
    var active = pickers && pickers.querySelector('.curr-picker-tile.is-active');
    var host = active && active.closest('details.curr-picker');
    (host ? [host] : pickerDetails).forEach(function (d) { d.open = true; });
  });

  // Apply selection from the URL on load (deep-linking). skipUrl=true so we
  // don't rewrite an identical URL. If the param is stale/unknown, clear it.
  (function () {
    var params = new URLSearchParams(window.location.search);
    var p = params.get('problem');
    var inst = params.get('institution');
    if (p) { if (!select('problem', p, true)) setUrl(null); }
    else if (inst) { if (!select('institution', inst, true)) setUrl(null); }
  })();
})();
</script>

</body>
</html>`;
}

// ── Generate theory-of-change/index.html ───────────────────────────
// A standalone page (formerly the "What is this?" modal). Reads
// data/theory-of-change.md. Prose H2 sections render as .about-section
// blocks; the "Theory of change" section's ordered list becomes the
// numbered .about-stage ladder, reusing the same CSS the modal used.

function generateTheoryOfChangePage() {
  let md = fs.readFileSync(path.join(__dirname, 'data', 'theory-of-change.md'), 'utf8');

  const title = (md.match(/^# (.+)$/m) || [, 'Theory of change'])[1].trim();
  md = md.replace(/^# .+$/m, '').trim();

  // Split into "## Heading\n...body" chunks.
  const chunks = md.split(/(?=^## )/m).filter((c) => c.trim());
  let sectionsHtml = '';

  for (const chunk of chunks) {
    const heading = (chunk.match(/^## (.+)$/m) || [, ''])[1].trim();
    const body = chunk.replace(/^## .+$/m, '').trim();

    // The "Theory of change" section carries the staged ladder: an intro
    // paragraph followed by an ordered list (one li per stage, each
    // "**Label.** text").
    const olMatch = body.match(/(?:^|\n)((?:\d+\. .+(?:\n(?!\d+\. ).*)*\n?)+)$/m);
    if (heading.toLowerCase() === 'theory of change' && olMatch) {
      const intro = body.slice(0, olMatch.index).trim();
      const items = olMatch[1]
        .split(/\n(?=\d+\. )/)
        .map((s) => s.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);

      let stages = '';
      items.forEach((item, i) => {
        const m = item.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/s);
        const label = m ? m[1].trim() : item;
        const text = m ? m[2].trim() : '';
        stages += '<li class="about-stage">';
        stages += `<span class="about-stage-num">${i + 1}</span>`;
        stages += '<div class="about-stage-body">';
        stages += `<span class="about-stage-label">${esc(label)}</span>`;
        stages += `<span class="about-stage-text">${esc(text)}</span>`;
        stages += '</div>';
        if (i < items.length - 1) stages += '<span class="about-stage-arrow" aria-hidden="true">↓</span>';
        stages += '</li>';
      });

      sectionsHtml += `<div class="about-section">
  <h3>${esc(heading)}</h3>
  ${intro ? marked.parse(processEditorial(intro)) : ''}
  <ol class="about-stages">${stages}</ol>
</div>`;
    } else {
      sectionsHtml += `<div class="about-section">
  <h3>${esc(heading)}</h3>
  ${marked.parse(processEditorial(body))}
</div>`;
    }
  }

  const tocTitle = `${esc(title)} — AGI Institutions`;
  const tocDesc = 'What this grid of institutions for a world of autonomous AI agents is, why it is needed, and the theory of change behind it.';
  const tocCanonical = `${SITE_ORIGIN}/theory-of-change/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FAVICON_TAGS}
<title>${tocTitle}</title>
<meta name="description" content="${tocDesc}">
<link rel="canonical" href="${tocCanonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${tocTitle}">
<meta property="og:description" content="${tocDesc}">
<meta property="og:url" content="${tocCanonical}">
<meta property="og:image" content="${SITE_OG_IMAGE}">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
</head>
<body>

<div id="curriculum-view" class="curr-layout toc-page">
<div class="curr-main">
<a href="../" class="detail-back">&larr; Back to grid</a>
<div class="curr-page-title">${esc(title)}</div>
${sectionsHtml}
</div>
</div>

<footer class="site-footer">
  Assembled by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>
</footer>

</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────

const methods = loadMethods();
const allCells = {
  cells: loadCells('cells')
};

generateManifest();

// AGI = root index.html
fs.writeFileSync(
  path.join(__dirname, 'index.html'),
  generateGridPage('agi', allCells, methods, 'style.css', 'app.js', 'data')
);
console.log('Generated index.html (AGI)');

// Human = subfolder
for (const tabId of ['human']) {
  fs.mkdirSync(path.join(__dirname, tabId), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, tabId, 'index.html'),
    generateGridPage(tabId, allCells, methods, '../style.css', '../app.js', '../data')
  );
  console.log(`Generated ${tabId}/index.html`);
}

// Fidelity is now the first "vision" overlaid on the AGI grid, not a tab.
// Keep a redirect stub so old /fidelity/ deep links still land somewhere.
fs.mkdirSync(path.join(__dirname, 'fidelity'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'fidelity', 'index.html'),
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>Fidelity & Meaning — Institutions</title>
<meta http-equiv="refresh" content="0; url=../?visions=fidelity">
<link rel="canonical" href="../?visions=fidelity"></head>
<body>The Fidelity tab is now a vision on the main grid. <a href="../?visions=fidelity">Continue &rarr;</a></body></html>`
);
console.log('Generated fidelity/index.html (redirect stub)');

// Problem sets
fs.mkdirSync(path.join(__dirname, 'problem-sets'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'problem-sets', 'index.html'),
  generateProblemSetsPage(allCells.cells)
);
console.log('Generated problem-sets/index.html');

// Curriculum
fs.mkdirSync(path.join(__dirname, 'curriculum'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'curriculum', 'index.html'),
  generateCurriculumPage(allCells.cells)
);
console.log('Generated curriculum/index.html');

// Theory of change (formerly the "What is this?" modal)
fs.mkdirSync(path.join(__dirname, 'theory-of-change'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'theory-of-change', 'index.html'),
  generateTheoryOfChangePage()
);
console.log('Generated theory-of-change/index.html');
