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
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
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
  return { summary, body: bodyAfterH1, frontmatter };
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

  // Two-column layout: main body + methods rail
  html += '<div class="detail-layout">';
  html += '<div class="detail-main">';
  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body">${marked.parse(cell.body)}</div>`;
  } else {
    html += `<div class="detail-placeholder">This cell hasn\u2019t been documented yet. <a href="${ghLink}">Contribute on GitHub \u2192</a></div>`;
  }
  html += `<div class="detail-footer"><a href="${ghLink}">Edit this page on GitHub \u2192</a></div>`;
  html += '</div>';

  if (methodsCell && methodsCell.body && methodsCell.body.trim()) {
    html += '<aside class="detail-rail">';
    html += `<div class="rail-label">${col.name} \u2014 methods &amp; references</div>`;
    html += `<div class="rail-body">${marked.parse(methodsCell.body)}</div>`;
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
    html += `<div class="detail-body">${marked.parse(cell.body)}</div>`;
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
window.addEventListener('DOMContentLoaded', handleHash);
