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

// Statuses at or past `body_ok` — the body is reviewed and the cell counts as
// published (the expert-review stages come after body_ok in the workflow).
const READY_STATUSES = new Set(['body_ok', 'expert_selected', 'expert_reviewed']);

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
  if (tabId === 'human') html += renderHumanEraLegend(cells);
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

// ── "What is this?" project popup ──────────────────────────────────
// A button in the controls row that opens a modal explaining what the
// project is, why it's needed, and the theory of change. Identical on
// every grid page. The toggle JS is inline so it works without app.js.

const ABOUT_STAGES = [
  { n: '1', label: 'Research & design', text: 'Pair domain experts across disciplines — a mechanism designer with a legal scholar, an Ostrom scholar with an AI researcher — to produce concrete institutional designs for the problems in this grid.' },
  { n: '2', label: 'Pairing the right people', text: 'Most of the people who could do this work sit in separate fields and never collaborate on the most pressing problems. We convene them, scope the problem, and give them a venue that takes ideas to publication and critique.' },
  { n: '3', label: 'Prototypes & pilots', text: 'Build the most promising designs as simulations, demos, or small live deployments — run where failure is cheap and the mechanism can be observed in use.' },
  { n: '4', label: 'Uptake by institutions, labs & governments', text: 'A small forward-thinking jurisdiction, a frontier lab, or a regulatory body adopts a working example — turning a proposal into a place others can point to.' },
  { n: '5', label: 'Diffusion', text: 'A working example reshapes what counts as a legitimate institution everywhere else. The standard does not have to be copied — it has to exist, as a place to point.' }
];

function renderAboutModal(psLink = 'problem-sets/') {
  let stages = '';
  ABOUT_STAGES.forEach((s, i) => {
    stages += '<li class="about-stage">';
    stages += `<span class="about-stage-num">${s.n}</span>`;
    stages += '<div class="about-stage-body">';
    stages += `<span class="about-stage-label">${esc(s.label)}</span>`;
    stages += `<span class="about-stage-text">${esc(s.text)}</span>`;
    stages += '</div>';
    if (i < ABOUT_STAGES.length - 1) stages += '<span class="about-stage-arrow" aria-hidden="true">↓</span>';
    stages += '</li>';
  });

  return `<div class="about-overlay" id="about-overlay" hidden onclick="if(event.target===this)closeAbout()">
  <div class="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title">
    <button class="about-close" aria-label="Close" onclick="closeAbout()">×</button>
    <div class="about-eyebrow">About this grid</div>
    <h2 class="about-title" id="about-title">New institutions for a world of AI agents</h2>

    <div class="about-section">
      <h3>What this is</h3>
      <p>A map — and a research program — for the institutions a world of autonomous AI agents will need. It's laid out by <strong>scale</strong> (from two parties up to the whole globe) and by <strong>informational basis</strong> (the kind of information a group coordinates around: protocols, preferences, rights, incentives, expertise, norms, or thick commitments). Each cell names a coordination problem, shows how humans currently solve it, and how AI agents break that solution. The marked cells are where the human analogy breaks down and a new design is needed — and where the research program goes to work.</p>
    </div>

    <div class="about-section">
      <h3>Why it's needed</h3>
      <p>Human institutions — markets, courts, regulators, professional norms — were built for participants who are slow, embedded in networks of mutual responsibility, have reputations to protect, and can be held accountable. AI agents break those assumptions: they transact at machine speed, copy themselves, carry no reputational stake, and optimize harder than any human. Society needs concrete institutional designs for this world, and the people who could produce them work in separate disciplines and don't collaborate on the most pressing problems. Some of this work will happen by default through market incentives; this grid focuses on the designs that won't happen otherwise.</p>
    </div>

    <div class="about-section">
      <h3>Theory of change</h3>
      <p>Big institutional change doesn't come from a single master plan. It comes from several streams of work running in parallel, ending at a first formal adoption somewhere on the map, after which the standard slowly reshapes what counts as legitimate everywhere else. The exact path looks different for every cell — each one's "Path to impact" sketches its own ladder of adopters and pilots — but underneath them runs a common pattern:</p>
      <ol class="about-stages">${stages}</ol>
    </div>

    <div class="about-footer">Assembled by the <a href="https://meaningalignment.org" target="_blank" rel="noopener">Meaning Alignment Institute</a>. The problems in this grid are mapped, brief by brief, on the <a href="${psLink}">problem sets</a> page.</div>
  </div>
</div>
<script>
(function(){
  window.openAbout=function(){var o=document.getElementById('about-overlay');if(o){o.hidden=false;document.body.classList.add('about-open');}};
  window.closeAbout=function(){var o=document.getElementById('about-overlay');if(o){o.hidden=true;document.body.classList.remove('about-open');}};
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAbout();});
})();
</script>`;
}

function renderAboutButton() {
  return '<button class="about-button" onclick="openAbout()" aria-haspopup="dialog">What is this?</button>';
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

  const psLink = tabId === 'agi' ? 'problem-sets/' : '../problem-sets/';
  const visionMenu = tabId === 'agi' ? renderVisionMenu() : '';
  const aboutButton = renderAboutButton();
  const aboutModal = renderAboutModal(psLink);

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

${aboutModal}

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

function generateCurriculumPage() {
  let md = fs.readFileSync(path.join(__dirname, 'data', 'curriculum.md'), 'utf8');

  // The H1 is the page title; pull it out, then split on H2:
  // everything before the first H2 is the intro; each H2 starts a field.
  const title = (md.match(/^# (.+)$/m) || [, 'Curriculum'])[1].trim();
  md = md.replace(/^# .+$/m, '').trim();
  const [intro, ...rawFields] = md.split(/(?=^## )/m);
  const introHtml = marked.parse(processEditorial(intro));

  // Turn each raw "## Name\n...body" chunk into a renderable field.
  const fields = rawFields.map((chunk) => {
    const name = (chunk.match(/^## (.+)$/m) || [, ''])[1].trim();
    const body = chunk.replace(/^## .+$/m, '').replace(/\n---\s*$/m, '').trim();
    let bodyHtml = marked.parse(processEditorial(body));
    // Tag the "Key concepts" list so CSS can render it in two columns.
    bodyHtml = bodyHtml.replace(
      /(<h3[^>]*>\s*Key concepts\s*<\/h3>\s*)<ul>/gi,
      '$1<ul class="curr-key-concepts">'
    );
    return { name, id: slugify(name), bodyHtml };
  });

  const navLink = (f) => `<a href="#${f.id}" class="curr-toc-link">${esc(f.name)}</a>`;
  const tocHtml = fields.length
    ? `<nav class="curr-toc" aria-label="Fields">\n  ${fields.map(navLink).join('\n  ')}\n</nav>`
    : '';

  const sidebarItem = (f) =>
    `<li><a href="#${f.id}" class="curr-sidebar-link" data-target="${f.id}">${esc(f.name)}</a></li>`;
  const sidebarHtml = fields.length
    ? `<aside class="curr-sidebar" aria-label="Curriculum sections">
  <div class="curr-sidebar-title">Sections</div>
  <ul class="curr-sidebar-list">
    ${fields.map(sidebarItem).join('\n    ')}
  </ul>
</aside>`
    : '';

  const sectionsHtml = fields.map((f) => `<details open class="curr-field" id="${f.id}">
  <summary class="curr-field-summary"><h2 class="curr-field-name">${esc(f.name)}</h2><span class="curr-field-chevron" aria-hidden="true"></span></summary>
  <div class="curr-field-body">
${f.bodyHtml}
  </div>
</details>`).join('\n');

  const currTitle = `${esc(title)} — AGI Institutions`;
  const currDesc = 'A curriculum for institutional designers engaging with AI governance: mechanism design, constitutional design, market design, regulatory frameworks, and more — all contextualized for the age of autonomous AI agents.';
  const currCanonical = `${SITE_ORIGIN}/curriculum/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
<div class="curr-page-title">${esc(title)}</div>
${introHtml}
${tocHtml}
${sectionsHtml}
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
</script>

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
  generateCurriculumPage()
);
console.log('Generated curriculum/index.html');
