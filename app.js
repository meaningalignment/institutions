// ── Constants ──────────────────────────────────────────────────────

const TABS = {
  human: {
    title: 'Existing Human Institutions',
    subtitle: 'Current institutional infrastructure (how humans do alignment)'
  },
  agi: {
    title: 'AGI Institutions (Required)',
    subtitle: 'New institutions needed for a world of autonomous AI agents'
  },
  fidelity: {
    title: 'Fidelity & Meaning',
    subtitle: 'Institutions for keeping things aligned with purpose, aligning organizations, governments, and markets to rich, accountable mandates'
  }
};

const ROWS = [
  { id: 'dyadic', name: 'Dyadic', desc: '2 parties' },
  { id: 'group', name: 'Group', desc: 'teams, clubs' },
  { id: 'community', name: 'Community', desc: 'orgs, cities' },
  { id: 'national', name: 'National', desc: 'states, nations' },
  { id: 'global', name: 'Global', desc: 'transnational' }
];

const COLS = [
  { id: 'protocols', name: 'Protocols', desc: 'standards & coordination' },
  { id: 'preferences', name: 'Preferences', desc: 'aggregated wants' },
  { id: 'rights', name: 'Rights', desc: 'formal entitlements & adjudication' },
  { id: 'incentives', name: 'Incentives', desc: 'structured payoffs' },
  { id: 'expertise', name: 'Expertise', desc: 'credentialed epistemic authority' },
  { id: 'norms', name: 'Norms', desc: 'behavioral expectations' },
  { id: 'thick-commitments', name: 'Thick Commitments', desc: 'articulated shared understanding' }
];

const GITHUB_REPO = 'https://github.com/meaningalignment/institutions';

// ── State ──────────────────────────────────────────────────────────

let manifest = null;
let methodsData = null;
const tabCache = {};   // tabId -> { cellKey -> { summary, body, people } }
let currentTab = 'human';


// ── Data loading ───────────────────────────────────────────────────

async function loadManifest() {
  if (manifest) return manifest;
  const resp = await fetch('data/manifest.json');
  manifest = await resp.json();
  return manifest;
}

async function loadMethods() {
  if (methodsData) return methodsData;
  const resp = await fetch('data/methods.yaml');
  const text = await resp.text();
  methodsData = jsyaml.load(text);
  return methodsData;
}

function parseCell(raw) {
  let frontmatter = {};
  let body = raw;

  // Parse YAML frontmatter if present
  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3);
    if (end !== -1) {
      const yamlStr = raw.slice(3, end).trim();
      if (yamlStr) {
        frontmatter = jsyaml.load(yamlStr) || {};
      }
      body = raw.slice(end + 3).trim();
    }
  }

  // Extract H1 as summary
  const h1Match = body.match(/^#\s+(.+)$/m);
  const summary = h1Match ? h1Match[1].trim() : '';

  // Body after the H1
  const bodyAfterH1 = h1Match ? body.slice(body.indexOf('\n', body.indexOf(h1Match[0])) + 1).trim() : body;

  return {
    summary,
    body: bodyAfterH1,
    people: frontmatter.people || []
  };
}

async function loadTab(tabId) {
  if (tabCache[tabId]) return tabCache[tabId];
  const m = await loadManifest();
  const cellNames = m[tabId] || [];
  const results = await Promise.all(
    cellNames.map(async (name) => {
      const resp = await fetch(`data/${tabId}/${name}.md`);
      const text = await resp.text();
      return { name, ...parseCell(text) };
    })
  );
  const cells = {};
  for (const r of results) {
    cells[r.name] = { summary: r.summary, body: r.body, people: r.people };
  }
  tabCache[tabId] = cells;
  return cells;
}

// ── Rendering: Grid ────────────────────────────────────────────────

function getMethodsForCol(colId, tabId, methods) {
  const base = (methods[colId] || []).map(m => ({ ...m }));
  const overrides = methods.tabOverrides?.[tabId]?.[colId] || {};

  // Add tab-specific methods
  const adds = overrides.add || [];
  for (const name of adds) {
    if (!base.find(m => m.name === name)) {
      base.push({ name });
    }
  }

  // Apply bold overrides
  const boldNames = overrides.bold || [];
  for (const m of base) {
    if (boldNames.includes(m.name)) {
      m.bold = true;
    }
  }

  return base;
}

function renderGrid(tabId, cells, methods) {
  const tab = TABS[tabId];

  let html = '';
  html += `<div class="pane-title">${tab.title}</div>`;
  html += `<div class="pane-subtitle">${tab.subtitle}</div>`;
  html += '<div class="table-wrapper"><table>';

  // Header row
  html += '<thead><tr><th class="corner-cell axis-label-col"></th>';
  for (const col of COLS) {
    html += `<th class="col-header"><span class="col-name">${col.name}</span><span class="col-desc">${col.desc}</span></th>`;
  }
  html += '</tr></thead><tbody>';

  // Data rows
  for (const row of ROWS) {
    html += '<tr>';
    html += `<th class="row-header"><span class="row-name">${row.name}</span><span class="row-desc">${row.desc}</span></th>`;
    for (const col of COLS) {
      const key = `${row.id}-${col.id}`;
      const cell = cells[key];
      if (cell) {
        html += `<td class="clickable" data-tab="${tabId}" data-row="${row.id}" data-col="${col.id}">`;
        html += `<div class="cell-content">${cell.summary}</div></td>`;
      } else {
        html += `<td><div class="cell-empty"></div></td>`;
      }
    }
    html += '</tr>';
  }

  // Methods row
  html += '<tr class="methods-row">';
  html += '<th class="row-header"><span class="row-name">Methods</span><span class="row-desc">design practices</span></th>';
  for (const col of COLS) {
    const tags = getMethodsForCol(col.id, tabId, methods);
    html += '<td><div class="cell-content">';
    for (const tag of tags) {
      const cls = tag.bold ? 'method-tag bold' : 'method-tag';
      html += `<span class="${cls}">${tag.name}</span>`;
    }
    html += '</div></td>';
  }
  html += '</tr>';

  html += '</tbody></table></div>';
  return html;
}

// ── Rendering: Detail page ─────────────────────────────────────────

function renderDetail(tabId, rowId, colId, cell) {
  const tab = TABS[tabId];
  const row = ROWS.find(r => r.id === rowId);
  const col = COLS.find(c => c.id === colId);
  const cellFile = `${rowId}-${colId}.md`;
  const ghLink = `${GITHUB_REPO}/edit/main/data/${tabId}/${cellFile}`;

  let html = '';
  html += `<a href="#grid/${tabId}" class="detail-back">← Back to grid</a>`;
  html += '<div class="detail-breadcrumb">';
  html += `<a href="#grid/${tabId}">${tab.title}</a> › ${row.name} › ${col.name}`;
  html += '</div>';
  html += `<div class="detail-title">${cell.summary}</div>`;

  // People
  if (cell.people && cell.people.length > 0) {
    html += '<div class="people-section"><h2 style="font-family:\'DM Serif Display\',serif;font-size:18px;font-weight:400;color:#2d2a26;margin-bottom:8px;">People</h2>';
    html += '<div class="people-list">';
    for (const p of cell.people) {
      html += '<div class="person-card">';
      if (p.url) {
        html += `<a href="${p.url}"><span class="person-name">${p.name}</span></a>`;
      } else {
        html += `<span class="person-name">${p.name}</span>`;
      }
      if (p.role) {
        html += `<span class="person-role">${p.role}</span>`;
      }
      html += '</div>';
    }
    html += '</div></div>';
  }

  // Body content
  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body">${marked.parse(cell.body)}</div>`;
  } else {
    html += `<div class="detail-placeholder">This cell hasn't been documented yet. <a href="${ghLink}">Contribute on GitHub →</a></div>`;
  }

  // Edit link
  html += `<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e6e1d8;font-size:12px;color:#b5b0a8;">`;
  html += `<a href="${ghLink}" style="color:#8a8378;">Edit this page on GitHub →</a>`;
  html += '</div>';

  return html;
}

// ── Rendering: Problem Sets page ───────────────────────────────────

async function renderProblemSets() {
  // Load all tabs
  await loadMethods();
  const allTabs = {};
  for (const tabId of Object.keys(TABS)) {
    allTabs[tabId] = await loadTab(tabId);
  }

  const problemSetsByTab = {};

  for (const [tabId, cells] of Object.entries(allTabs)) {
    for (const [cellKey, cell] of Object.entries(cells)) {
      if (!cell.body) continue;
      // Find ## Problem Sets section
      const psMatch = cell.body.match(/## Problem Sets\n([\s\S]*?)(?=\n## [^#]|$)/);
      if (!psMatch) continue;

      const psContent = psMatch[1].trim();
      if (!psContent) continue;

      // Split into individual problem sets by ### headers
      const problems = [];
      const h3Regex = /### (.+)/g;
      let match;
      const h3Positions = [];
      while ((match = h3Regex.exec(psContent)) !== null) {
        h3Positions.push({ title: match[1].trim(), start: match.index, headerEnd: match.index + match[0].length });
      }

      for (let i = 0; i < h3Positions.length; i++) {
        const bodyStart = h3Positions[i].headerEnd;
        const bodyEnd = i + 1 < h3Positions.length ? h3Positions[i + 1].start : psContent.length;
        problems.push({
          title: h3Positions[i].title,
          body: psContent.slice(bodyStart, bodyEnd).trim(),
          cellKey,
          tabId
        });
      }

      if (problems.length > 0) {
        if (!problemSetsByTab[tabId]) problemSetsByTab[tabId] = [];
        problemSetsByTab[tabId].push(...problems);
      }
    }
  }

  let html = '';
  html += `<a href="#grid/${currentTab}" class="detail-back">← Back to grid</a>`;
  html += '<div class="ps-page-title">Problem Sets</div>';
  html += '<div class="ps-page-subtitle">For pairs/trios. ~1 hour each. Produce a concrete design sketch, not a literature review.</div>';

  const tabLabels = {
    agi: 'Part A: AGI Institutions (Required)',
    fidelity: 'Part B: High-Fidelity Society',
    human: 'Part C: Existing Human Institutions'
  };

  for (const tabId of ['agi', 'fidelity', 'human']) {
    const problems = problemSetsByTab[tabId];
    if (!problems || problems.length === 0) continue;

    html += `<div class="ps-group-title">${tabLabels[tabId]}</div>`;

    for (const ps of problems) {
      const parts = ps.cellKey.split('-');
      const rowId = parts[0];
      const colId = parts.slice(1).join('-');
      const row = ROWS.find(r => r.id === rowId);
      const col = COLS.find(c => c.id === colId);
      const cellLabel = row && col ? `${row.name} / ${col.name}` : ps.cellKey;

      html += '<div class="ps-entry">';
      html += '<div class="ps-entry-header">';
      html += `<span class="ps-entry-title">${ps.title}</span>`;
      html += `<span class="ps-entry-cell"><a href="#detail/${ps.tabId}/${rowId}/${colId}">${cellLabel}</a></span>`;
      html += '</div>';
      html += `<div class="ps-entry-body">${marked.parse(ps.body)}</div>`;
      html += '</div>';
    }
  }

  // Facilitator notes
  html += '<div class="ps-notes">';
  html += '<h3>Notes for Facilitators</h3>';
  html += '<ul>';
  html += '<li>Each problem is designed to reward mixed teams (e.g., a mechanism designer + a legal scholar; an Ostrom person + an AI safety researcher).</li>';
  html += '<li>The deliverables are deliberately concrete—a protocol, a charter, amendment text—to prevent the conversation from remaining at the level of "this is an important problem."</li>';
  html += '<li>Encourage teams to identify where their design <em>breaks</em> and to state the failure conditions explicitly.</li>';
  html += '</ul>';
  html += '</div>';

  return html;
}

// ── Router ─────────────────────────────────────────────────────────

async function route() {
  const hash = location.hash || '#';
  const gridView = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');
  const problemSetsView = document.getElementById('problem-sets-view');
  const controls = document.querySelector('.controls');

  gridView.style.display = 'none';
  detailView.style.display = 'none';
  problemSetsView.style.display = 'none';

  if (hash === '#problem-sets') {
    controls.style.display = 'flex';
    problemSetsView.style.display = 'block';
    problemSetsView.innerHTML = '<div style="text-align:center;color:#b5b0a8;padding:40px;">Loading…</div>';
    problemSetsView.innerHTML = await renderProblemSets();
    return;
  }

  const detailMatch = hash.match(/^#detail\/(\w+)\/(\w+)\/(.+)$/);
  if (detailMatch) {
    const [, tabId, rowId, colId] = detailMatch;
    controls.style.display = 'none';
    detailView.style.display = 'block';

    const cells = await loadTab(tabId);
    const key = `${rowId}-${colId}`;
    const cell = cells[key];

    if (cell) {
      detailView.innerHTML = renderDetail(tabId, rowId, colId, cell);
    } else {
      // Empty cell — show placeholder
      const tab = TABS[tabId];
      const row = ROWS.find(r => r.id === rowId);
      const col = COLS.find(c => c.id === colId);
      const ghLink = `${GITHUB_REPO}/new/main/data/${tabId}?filename=${rowId}-${colId}.md`;
      detailView.innerHTML = `
        <a href="#grid/${tabId}" class="detail-back">← Back to grid</a>
        <div class="detail-breadcrumb">
          <a href="#grid/${tabId}">${tab.title}</a> › ${row.name} › ${col.name}
        </div>
        <div class="detail-title">${row.name} × ${col.name}</div>
        <div class="detail-placeholder">
          This cell hasn't been defined yet. <a href="${ghLink}">Create it on GitHub →</a>
        </div>`;
    }
    return;
  }

  // Grid view (default)
  controls.style.display = 'flex';
  gridView.style.display = 'flex';

  const tabMatch = hash.match(/^#grid\/(\w+)$/);
  const tabId = tabMatch ? tabMatch[1] : 'agi';
  currentTab = tabId;

  updateActiveTab(tabId);

  const [cells, methods] = await Promise.all([loadTab(tabId), loadMethods()]);
  gridView.innerHTML = renderGrid(tabId, cells, methods);

  // Attach click handlers to cells
  gridView.querySelectorAll('td.clickable').forEach(td => {
    td.addEventListener('click', () => {
      const t = td.dataset.tab;
      const r = td.dataset.row;
      const c = td.dataset.col;
      location.hash = `#detail/${t}/${r}/${c}`;
    });
  });
}

// ── Init ───────────────────────────────────────────────────────────

function updateActiveTab(tabId) {
  document.querySelectorAll('.tab-link').forEach(link => {
    link.classList.toggle('active', link.dataset.tab === tabId);
  });
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
