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

// Anchor heading used to detect whether this cell has an AGI-breakdown — drives
// the "AGI breaks this" title badge.
const AGI_SECTION_HEADING = 'Where AGI breaks it';

// GFM alerts → callout extension for `marked`.
// `> [!NOTE]` / `> [!WARNING]` blockquotes render as <aside class="callout …">.
//   NOTE     → callout-human (tan/gold)  — vivid human case
//   WARNING  → callout-agi   (orange)    — AGI scenario
const GFM_ALERT_TYPES = {
  NOTE:      { cls: 'callout-human', label: 'A vivid case' },
  WARNING:   { cls: 'callout-agi',   label: 'How AGI breaks it — a scenario' },
  TIP:       { cls: 'callout-tip',   label: 'Tip' },
  IMPORTANT: { cls: 'callout-important', label: 'Important' },
  CAUTION:   { cls: 'callout-caution', label: 'Caution' }
};

function installGfmAlertExtension() {
  if (typeof marked === 'undefined' || marked._gfmAlertsInstalled) return;
  marked.use({
    extensions: [{
      name: 'gfmAlert',
      level: 'block',
      start(src) { return src.match(/^>\s*\[!/m)?.index; },
      tokenizer(src) {
        const rule = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][^\n]*\n((?:>[^\n]*\n?)*)/i;
        const m = rule.exec(src);
        if (!m) return;
        const type = m[1].toUpperCase();
        const inner = m[2]
          .split('\n')
          .map(line => line.replace(/^>\s?/, ''))
          .join('\n')
          .trim();
        return {
          type: 'gfmAlert',
          raw: m[0],
          alertType: type,
          tokens: this.lexer.blockTokens(inner, [])
        };
      },
      renderer(token) {
        const meta = GFM_ALERT_TYPES[token.alertType] || { cls: 'callout-note', label: token.alertType };
        const body = this.parser.parse(token.tokens);
        return (
          `<aside class="callout ${meta.cls}">` +
          `<div class="callout-label">${meta.label}</div>` +
          `<div class="callout-body">${body}</div>` +
          `</aside>`
        );
      }
    }]
  });
  marked._gfmAlertsInstalled = true;
}

// ── Cell parsing ───────────────────────────────────────────────────

function parseCell(raw) {
  let frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) return;
      let val = m[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
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

// ── Body rendering ────────────────────────────────────────────────

function renderBody(body) {
  installGfmAlertExtension();
  let html = marked.parse(body);
  html = html.replace(
    new RegExp(`<h2(\\s[^>]*)?>${AGI_SECTION_HEADING}</h2>`),
    `<h2 id="where-agi-breaks-it">${AGI_SECTION_HEADING}</h2>`
  );
  return html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Detail page ────────────────────────────────────────────────────

function renderDetail(tabId, rowId, colId, cell, dataPath, methodsCell, opts) {
  const tab = TABS[tabId] || { title: tabId };
  const row = ROWS.find(r => r.id === rowId) || { name: rowId };
  const col = COLS.find(c => c.id === colId) || { name: colId };
  const ghPath = (opts && opts.ghPath) || `cells/${rowId}-${colId}.md`;
  const ghLink = `${GITHUB_REPO}/edit/main/data/${ghPath}`;
  const title = (opts && opts.titleOverride) || cell.summary;

  // Show "AGI breaks this" badge only on the Human tab — it flags that the existing
  // institution is likely to break in a world of autonomous AI agents. On the AGI
  // and Fidelity tabs the section is descriptive context, not a warning.
  const showBadge = tabId === 'human'
    && new RegExp(`^## ${AGI_SECTION_HEADING}$`, 'm').test(cell.body || '');

  let html = '';
  html += `<a href="#" class="detail-back" onclick="hideDetail();return false;">← Back to grid</a>`;
  html += '<div class="detail-breadcrumb">';
  html += `${tab.title} › ${row.name} › ${col.name}`;
  html += '</div>';

  html += '<div class="detail-title-row">';
  html += `<h1 class="detail-title">${escapeHtml(title)}</h1>`;
  if (showBadge) {
    html += `<a href="#where-agi-breaks-it" class="agi-breaks-badge" onclick="scrollToAgiBreaks(event)" title="This institution is likely to break in a world of autonomous AI agents">`;
    html += `<span class="agi-breaks-dot"></span>AGI breaks this`;
    html += `</a>`;
  }
  html += '</div>';

  html += '<div class="detail-layout">';
  html += '<div class="detail-main">';
  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body">${renderBody(cell.body)}</div>`;
  } else {
    html += `<div class="detail-placeholder">This cell hasn’t been documented yet. <a href="${ghLink}">Contribute on GitHub →</a></div>`;
  }
  html += `<div class="detail-footer"><a href="${ghLink}">Edit this page on GitHub →</a></div>`;
  html += '</div>';

  if (methodsCell && methodsCell.body && methodsCell.body.trim()) {
    html += '<aside class="detail-rail">';
    html += `<div class="rail-label">${col.name} — methods &amp; references</div>`;
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
  html += `<a href="#" class="detail-back" onclick="hideDetail();return false;">← Back to grid</a>`;
  html += '<div class="detail-breadcrumb">';
  html += `${tab.title} › Methods › ${col.name}`;
  html += '</div>';
  html += `<h1 class="detail-title">${escapeHtml(cell.summary)}</h1>`;

  if (cell.body && cell.body.trim()) {
    html += `<div class="detail-body">${marked.parse(cell.body)}</div>`;
  } else {
    html += `<div class="detail-placeholder">This page hasn’t been documented yet. <a href="${ghLink}">Contribute on GitHub →</a></div>`;
  }

  html += `<div class="detail-footer"><a href="${ghLink}">Edit this page on GitHub →</a></div>`;
  return html;
}

// ── Show/hide detail ───────────────────────────────────────────────

function scrollToAgiBreaks(event) {
  event.preventDefault();
  const target = document.getElementById('where-agi-breaks-it');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const top = rect.top + window.scrollY - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

async function showDetail(tabId, rowId, colId, dataPath) {
  const gridView = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');
  const controls = document.querySelector('.controls');

  gridView.style.display = 'none';
  if (controls) controls.style.display = 'none';
  detailView.style.display = 'block';
  location.hash = `#detail/${tabId}/${rowId}/${colId}`;
  window.scrollTo(0, 0);

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
          <a href="#" class="detail-back" onclick="hideDetail();return false;">← Back to grid</a>
          <div class="detail-breadcrumb">Methods › ${col.name}</div>
          <h1 class="detail-title">${col.name}</h1>
          <div class="detail-placeholder">
            This page hasn’t been defined yet. <a href="${ghLink}">Create it on GitHub →</a>
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
        <a href="#" class="detail-back" onclick="hideDetail();return false;">← Back to grid</a>
        <div class="detail-breadcrumb">${tab.title} › ${row.name} › ${col.name}</div>
        <h1 class="detail-title">${row.name} × ${col.name}</h1>
        <div class="detail-placeholder">
          This cell hasn’t been defined yet. <a href="${ghLink}">Create it on GitHub →</a>
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
  if (controls) controls.style.display = 'flex';
  gridView.style.display = 'flex';
  history.replaceState(null, '', location.pathname);
}

// ── Handle back/forward and direct detail links ────────────────────

function getDataPath() {
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
