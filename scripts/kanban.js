#!/usr/bin/env bun
// Standalone Kanban app — server + renderer + edit endpoint.
//
//   bun run kanban
//
// Then open http://127.0.0.1:5174/
//
// This is a LOCAL-ONLY tool. The deployed Vercel site does not include the
// kanban page. Pages are rendered live from disk on each request, so there's
// no build step — edit a cell and reload.
//
// Endpoints:
//   GET  /              → kanban HTML (rendered from data/{cells,fidelity}/)
//   GET  /kanban.css    → kanban styles
//   GET  /data/*        → static cell files (so card links to ../#detail/...
//                          can resolve when the user navigates back to the grid)
//   PATCH /api/cell     → { dir, key, status, owner } updates frontmatter
//   OPTIONS /api/cell   → probe for read-only mode detection (kept for legacy)
//
// Bound to 127.0.0.1 only. No auth.

import { readFileSync, writeFileSync, readdirSync, existsSync, watch } from 'node:fs';
import { join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const PORT = 5174;

// ── Shared constants (mirrored from build.js, intentionally duplicated to
//    keep this script independent) ────────────────────────────────────────

const ROWS = [
  { id: 'dyadic',    name: 'Dyadic' },
  { id: 'group',     name: 'Group' },
  { id: 'community', name: 'Community' },
  { id: 'national',  name: 'National' },
  { id: 'global',    name: 'Global' }
];

const COLS = [
  { id: 'protocols',         name: 'Protocols' },
  { id: 'preferences',       name: 'Preferences' },
  { id: 'rights',            name: 'Rights' },
  { id: 'incentives',        name: 'Incentives' },
  { id: 'expertise',         name: 'Expertise' },
  { id: 'norms',             name: 'Norms' },
  { id: 'thick-commitments', name: 'Thick Commitments' }
];

const STAGES = [
  { id: 'not_started',        name: 'Not started' },
  { id: 'summary_draft',      name: 'Summary — ready for review' },
  { id: 'summary_needs_work', name: 'Summary — needs work' },
  { id: 'summary_ok',         name: 'Summary — OK' },
  { id: 'body_draft',         name: 'Body — ready for review' },
  { id: 'body_needs_work',    name: 'Body — needs work' },
  { id: 'body_ok',            name: 'Body — OK' }
];

const EDITORIAL_RE = /\{>>[\s\S]*?<<\}/g;

const RELOAD_SCRIPT = `<script>(function(){try{var es=new EventSource('/_reload');es.addEventListener('reload',function(){location.reload();});}catch(e){}})();</script>`;

const OWNERS = ['oliver', 'joe', 'none'];
const VALID_DIRS = new Set(['cells', 'fidelity']);
const VALID_STATUSES = new Set(STAGES.map(s => s.id));
const VALID_OWNERS = new Set(OWNERS);
const KEY_RE = /^[a-z][a-z0-9-]*$/;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusClass(s) {
  return `status-${(s || 'not_started').replace(/_/g, '-')}`;
}

// ── Cell parsing (minimal frontmatter only — no body markdown needed) ────

function parseCell(raw) {
  let frontmatter = {};
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  let body = raw;
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) return;
      let val = m[2].trim();
      if (val.length >= 2 && val.startsWith('"') && val.endsWith('"')) {
        try { val = JSON.parse(val); }
        catch { val = val.slice(1, -1); }
      } else if (val.length >= 2 && val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      frontmatter[m[1]] = val;
    });
    body = raw.slice(fmMatch[0].length);
  }
  const h1Match = body.match(/^#\s+(.+)$/m);
  const summary = h1Match ? h1Match[1].trim() : '';
  const editorialCount = (body.match(EDITORIAL_RE) || []).length;
  return { summary, frontmatter, editorialCount };
}

function loadCells(dirName) {
  const dir = join(REPO_ROOT, 'data', dirName);
  const cells = {};
  if (!existsSync(dir)) return cells;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const key = file.replace('.md', '');
    cells[key] = parseCell(readFileSync(join(dir, file), 'utf8'));
  }
  return cells;
}

// ── Card data ────────────────────────────────────────────────────────────

function buildCards(cells, dirName) {
  const cards = [];
  for (const [key, cell] of Object.entries(cells)) {
    const parts = key.split('-');
    const rowId = parts[0];
    const colId = parts.slice(1).join('-');
    const row = ROWS.find(r => r.id === rowId);
    const col = COLS.find(c => c.id === colId);
    if (!row || !col) continue;
    const fm = cell.frontmatter || {};
    let kind;
    if (dirName === 'fidelity') kind = 'fidelity';
    else if (String(fm.hide_agi) === 'true') kind = 'human-only';
    else kind = 'agi';
    cards.push({
      key, dirName, rowId, colId, kind,
      rowName: row.name, colName: col.name,
      status: fm.status || 'not_started',
      owner:  fm.owner  || 'none',
      starred: String(fm.starred) === 'true',
      editorialCount: cell.editorialCount || 0,
      title:  cell.summary || `${row.name} × ${col.name}`
    });
  }
  return cards;
}

// ── HTML rendering ───────────────────────────────────────────────────────

// URL of the cell's detail page on the main dev server (port 5173).
// Kanban is only ever run locally, so we hardcode the localhost origin.
function cellDetailUrl(card) {
  const base = 'http://127.0.0.1:5173';
  if (card.kind === 'fidelity')    return `${base}/fidelity/#detail/fidelity/${card.rowId}/${card.colId}`;
  if (card.kind === 'human-only')  return `${base}/human/#detail/human/${card.rowId}/${card.colId}`;
  return `${base}/#detail/agi/${card.rowId}/${card.colId}`;
}

function renderCard(card) {
  const fidelityNote = card.dirName === 'fidelity' ? ' · Fidelity' : '';
  const editorialBadge = card.editorialCount > 0
    ? `<span class="kanban-card-editorial-badge" title="${card.editorialCount} editorial note${card.editorialCount === 1 ? '' : 's'} in body">✎ ${card.editorialCount}</span>`
    : '';
  const starBtn = `<button type="button" class="kanban-star-btn${card.starred ? ' starred' : ''}" data-star-btn="1" title="${card.starred ? 'Unstar' : 'Star — focus on now'}">${card.starred ? '★' : '☆'}</button>`;
  return `<div class="kanban-card ${statusClass(card.status)}" draggable="true" data-owner="${esc(card.owner)}" data-status="${esc(card.status)}" data-starred="${card.starred ? '1' : '0'}" data-dir="${esc(card.dirName)}" data-key="${esc(card.key)}" data-kind="${esc(card.kind)}">
    <div class="kanban-card-breadcrumb">${esc(card.rowName)} / ${esc(card.colName)}${fidelityNote}</div>
    <div class="kanban-card-title-row">
      ${starBtn}
      <a class="kanban-card-title" href="${esc(cellDetailUrl(card))}" target="_blank" rel="noopener" draggable="false" title="Open cell page (opens in new tab)">${esc(card.title)}</a>
    </div>
    <div class="kanban-card-meta">
      <button type="button" class="kanban-owner-pill owner-${esc(card.owner)}" data-owner-btn="1" title="Click to reassign">${esc(card.owner)}</button>
      ${editorialBadge}
    </div>
  </div>`;
}

function renderKanbanHtml() {
  const cells    = loadCells('cells');
  const fidelity = loadCells('fidelity');
  const cards = [
    ...buildCards(cells, 'cells'),
    ...buildCards(fidelity, 'fidelity')
  ];

  let cols = '';
  for (const stage of STAGES) {
    const stageCards = cards.filter(c => (c.status || 'not_started') === stage.id);
    stageCards.sort((a, b) => a.key.localeCompare(b.key));
    cols += `<div class="kanban-col" data-stage="${stage.id}">
  <div class="kanban-col-header"><span class="kanban-col-name">${esc(stage.name)}</span><span class="kanban-col-count">${stageCards.length}</span></div>
  <div class="kanban-col-body">
${stageCards.map(renderCard).join('\n')}
  </div>
</div>
`;
  }

  const starredCount = cards.filter(c => c.starred).length;
  let filterButtons = '<button class="kanban-filter-btn active" data-filter="all">All</button>';
  for (const o of OWNERS) {
    filterButtons += `<button class="kanban-filter-btn" data-filter="${esc(o)}">${esc(o)}</button>`;
  }
  filterButtons += `<button class="kanban-filter-btn kanban-star-filter" data-star-filter="1" title="Show only starred cards">★ Starred <span class="kanban-star-count">${starredCount}</span></button>`;
  filterButtons += `<button class="kanban-filter-btn kanban-kind-toggle" data-kind-toggle="1" title="Show cards from the Human-only and Fidelity tabs">Show human-only + fidelity</button>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kanban — Institutions (local)</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/kanban.css">
</head>
<body>

<div id="kanban-view">
  <div class="pane-title">Kanban</div>
  <div class="pane-subtitle">Pick your name. Anything in a <b>Ready for review</b> column owned by the other person is yours to review.</div>
  <div id="kanban-mode-banner" class="kanban-mode-banner">Edit mode — drag a card to a new column; click an owner pill to reassign.</div>

  <div class="kanban-owner-filter">${filterButtons}</div>

  <div id="kanban-root" class="kanban-page drag-enabled">
${cols}
  </div>
</div>

<footer class="site-footer">
  Local Kanban — edits write to <code>data/*/*.md</code>. Reload to resync.
</footer>

<script>
${PAGE_SCRIPT}
</script>

${RELOAD_SCRIPT}
</body>
</html>`;
}

// Client-side script inlined into the page. Kept as a JS template literal
// (not a separate .js file) so the whole kanban is one self-contained script.
const PAGE_SCRIPT = `
(function(){
  var OWNERS = ${JSON.stringify(OWNERS)};
  var root = document.getElementById('kanban-root');

  // ── Owner filter + kind toggle + starred filter (all persisted to localStorage) ───
  var ownerBtns = document.querySelectorAll('.kanban-filter-btn[data-filter]');
  var kindToggleBtn = document.querySelector('[data-kind-toggle]');
  var starFilterBtn = document.querySelector('[data-star-filter]');
  var currentOwner = 'all';
  var showExtraKinds = false;
  var starredOnly = false;

  function applyState(){
    ownerBtns.forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-filter') === currentOwner);
    });
    if (kindToggleBtn) kindToggleBtn.classList.toggle('active', showExtraKinds);
    if (starFilterBtn) starFilterBtn.classList.toggle('active', starredOnly);
    var cls = 'kanban-page drag-enabled';
    if (currentOwner !== 'all') cls += ' filter-' + currentOwner;
    if (starredOnly) cls += ' filter-starred';
    if (!showExtraKinds) cls += ' hide-extra-kinds';
    root.className = cls;
    updateCounts();
  }

  try {
    var savedOwner = localStorage.getItem('kanban.filter');
    if (savedOwner && Array.from(ownerBtns).some(function(b){ return b.getAttribute('data-filter') === savedOwner; })) {
      currentOwner = savedOwner;
    }
    showExtraKinds = localStorage.getItem('kanban.showExtraKinds') === '1';
    starredOnly = localStorage.getItem('kanban.starredOnly') === '1';
  } catch (e) {}
  applyState();

  ownerBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      currentOwner = btn.getAttribute('data-filter');
      applyState();
      try { localStorage.setItem('kanban.filter', currentOwner); } catch (e) {}
    });
  });
  if (kindToggleBtn) {
    kindToggleBtn.addEventListener('click', function(){
      showExtraKinds = !showExtraKinds;
      applyState();
      try { localStorage.setItem('kanban.showExtraKinds', showExtraKinds ? '1' : '0'); } catch (e) {}
    });
  }
  if (starFilterBtn) {
    starFilterBtn.addEventListener('click', function(){
      starredOnly = !starredOnly;
      applyState();
      try { localStorage.setItem('kanban.starredOnly', starredOnly ? '1' : '0'); } catch (e) {}
    });
  }

  // ── PATCH helper ──────────────────────────────────────────────────
  function patchCell(card, fields){
    return fetch('/api/cell', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dir: card.getAttribute('data-dir'),
        key: card.getAttribute('data-key'),
        status: fields.status != null ? fields.status : card.getAttribute('data-status'),
        owner:  fields.owner  != null ? fields.owner  : card.getAttribute('data-owner'),
        starred: fields.starred != null ? fields.starred : (card.getAttribute('data-starred') === '1')
      })
    }).then(function(r){
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function isVisible(card){
    if (currentOwner !== 'all' && card.getAttribute('data-owner') !== currentOwner) return false;
    if (starredOnly && card.getAttribute('data-starred') !== '1') return false;
    if (!showExtraKinds) {
      var kind = card.getAttribute('data-kind');
      if (kind === 'human-only' || kind === 'fidelity') return false;
    }
    return true;
  }
  function updateCounts(){
    document.querySelectorAll('.kanban-col').forEach(function(c){
      var n = 0;
      c.querySelectorAll('.kanban-card').forEach(function(card){
        if (isVisible(card)) n++;
      });
      c.querySelector('.kanban-col-count').textContent = n;
    });
  }

  function updateCardOwner(card, newOwner){
    card.setAttribute('data-owner', newOwner);
    var pill = card.querySelector('.kanban-owner-pill');
    if (pill){
      OWNERS.forEach(function(o){ pill.classList.remove('owner-' + o); });
      pill.classList.add('owner-' + newOwner);
      pill.textContent = newOwner;
    }
  }

  // ── Owner-edit popup ──────────────────────────────────────────────
  var popup = null;
  function closePopup(){
    if (popup){ popup.remove(); popup = null; }
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onKey, true);
  }
  function onDocClick(e){ if (popup && !popup.contains(e.target)) closePopup(); }
  function onKey(e){ if (e.key === 'Escape') closePopup(); }
  function openOwnerPopup(card, anchor){
    closePopup();
    popup = document.createElement('div');
    popup.className = 'kanban-popup';
    popup.innerHTML = '<div class="kanban-popup-label">Assign to</div>' +
      OWNERS.map(function(o){
        var isCurrent = card.getAttribute('data-owner') === o;
        return '<button type="button" class="kanban-popup-opt' + (isCurrent ? ' current' : '') + '" data-owner-opt="' + o + '">' + o + '</button>';
      }).join('');
    document.body.appendChild(popup);
    var r = anchor.getBoundingClientRect();
    popup.style.top  = (window.scrollY + r.bottom + 4) + 'px';
    popup.style.left = (window.scrollX + r.left) + 'px';

    popup.querySelectorAll('[data-owner-opt]').forEach(function(opt){
      opt.addEventListener('click', function(){
        var newOwner = opt.getAttribute('data-owner-opt');
        var oldOwner = card.getAttribute('data-owner');
        closePopup();
        if (newOwner === oldOwner) return;
        updateCardOwner(card, newOwner);
        patchCell(card, { owner: newOwner }).catch(function(err){
          updateCardOwner(card, oldOwner);
          alert('Save failed: ' + err.message + '. Reload to resync.');
        });
      });
    });
    setTimeout(function(){
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKey, true);
    }, 0);
  }

  document.querySelectorAll('[data-owner-btn]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var card = btn.closest('.kanban-card');
      if (card) openOwnerPopup(card, btn);
    });
  });

  // ── Star toggle ───────────────────────────────────────────────────
  function applyStarToCard(card, starred){
    card.setAttribute('data-starred', starred ? '1' : '0');
    var btn = card.querySelector('.kanban-star-btn');
    if (btn) {
      btn.classList.toggle('starred', starred);
      btn.textContent = starred ? '★' : '☆';
      btn.title = starred ? 'Unstar' : 'Star — focus on now';
    }
  }
  function updateStarCount(){
    var n = document.querySelectorAll('.kanban-card[data-starred="1"]').length;
    var span = starFilterBtn && starFilterBtn.querySelector('.kanban-star-count');
    if (span) span.textContent = n;
  }
  document.querySelectorAll('[data-star-btn]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var card = btn.closest('.kanban-card');
      if (!card) return;
      var wasStarred = card.getAttribute('data-starred') === '1';
      var newStarred = !wasStarred;
      applyStarToCard(card, newStarred);
      updateStarCount();
      updateCounts();
      patchCell(card, { starred: newStarred }).catch(function(err){
        applyStarToCard(card, wasStarred);
        updateStarCount();
        updateCounts();
        alert('Save failed: ' + err.message + '. Reload to resync.');
      });
    });
  });

  // ── Drag and drop ─────────────────────────────────────────────────
  var dragged = null;
  document.querySelectorAll('.kanban-card').forEach(function(card){
    card.addEventListener('dragstart', function(e){
      dragged = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.key);
    });
    card.addEventListener('dragend', function(){
      card.classList.remove('dragging');
      dragged = null;
      document.querySelectorAll('.kanban-col.drag-over').forEach(function(c){ c.classList.remove('drag-over'); });
    });
  });
  document.querySelectorAll('.kanban-col').forEach(function(col){
    col.addEventListener('dragover', function(e){
      if (!dragged) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', function(e){
      if (e.target === col) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', function(e){
      if (!dragged) return;
      e.preventDefault();
      col.classList.remove('drag-over');
      var newStatus = col.getAttribute('data-stage');
      var oldStatus = dragged.getAttribute('data-status');
      if (newStatus === oldStatus) return;

      var colBody = col.querySelector('.kanban-col-body');
      colBody.appendChild(dragged);
      dragged.setAttribute('data-status', newStatus);
      dragged.className = dragged.className.replace(/status-[a-z-]+/, 'status-' + newStatus.replace(/_/g, '-'));
      updateCounts();

      patchCell(dragged, { status: newStatus }).catch(function(err){
        alert('Save failed: ' + err.message + '. Reload to resync.');
      });
    });
  });
})();
`;

// ── PATCH endpoint ───────────────────────────────────────────────────────

function updateFrontmatter(filePath, status, owner, starred) {
  const raw = readFileSync(filePath, 'utf8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) {
    const starLine = starred ? '\nstarred: true' : '';
    writeFileSync(filePath, `---\nstatus: ${status}\nowner: ${owner}${starLine}\n---\n${raw}`);
    return;
  }
  let fmBody = fmMatch[1];
  const rest = raw.slice(fmMatch[0].length);

  if (/^status:\s*.*$/m.test(fmBody)) {
    fmBody = fmBody.replace(/^status:\s*.*$/m, `status: ${status}`);
  } else {
    fmBody += `\nstatus: ${status}`;
  }
  if (/^owner:\s*.*$/m.test(fmBody)) {
    fmBody = fmBody.replace(/^owner:\s*.*$/m, `owner: ${owner}`);
  } else {
    fmBody += `\nowner: ${owner}`;
  }
  if (starred) {
    if (/^starred:\s*.*$/m.test(fmBody)) {
      fmBody = fmBody.replace(/^starred:\s*.*$/m, `starred: true`);
    } else {
      fmBody += `\nstarred: true`;
    }
  } else {
    fmBody = fmBody.replace(/^starred:\s*.*\n?/m, '').replace(/\n$/, '');
  }

  writeFileSync(filePath, `---\n${fmBody}\n---\n${rest}`);
}

async function handleApi(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { Allow: 'PATCH, OPTIONS' } });
  }
  if (req.method !== 'PATCH') {
    return new Response('Method not allowed', { status: 405 });
  }
  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }

  const { dir, key, status, owner, starred } = body || {};
  if (!VALID_DIRS.has(dir))         return Response.json({ error: 'bad dir' }, { status: 400 });
  if (!KEY_RE.test(key || ''))      return Response.json({ error: 'bad key' }, { status: 400 });
  if (!VALID_STATUSES.has(status))  return Response.json({ error: 'bad status' }, { status: 400 });
  if (!VALID_OWNERS.has(owner))     return Response.json({ error: 'bad owner' }, { status: 400 });
  if (typeof starred !== 'boolean') return Response.json({ error: 'bad starred' }, { status: 400 });

  const filePath = join(REPO_ROOT, 'data', dir, `${key}.md`);
  if (!filePath.startsWith(join(REPO_ROOT, 'data') + '/') || !existsSync(filePath)) {
    return Response.json({ error: 'not found' }, { status: 404 });
  }

  try {
    updateFrontmatter(filePath, status, owner, starred);
    console.log(`PATCH ${dir}/${key} → status=${status} owner=${owner} starred=${starred}`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

// ── Live-reload (SSE) ────────────────────────────────────────────────────

const sseClients = new Set();
function broadcastReload() {
  const payload = 'event: reload\ndata: 1\n\n';
  for (const ctrl of [...sseClients]) {
    try { ctrl.enqueue(payload); }
    catch { sseClients.delete(ctrl); }
  }
}

let reloadTimer = null;
function scheduleReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    reloadTimer = null;
    broadcastReload();
  }, 400);
}

// Watch data/ for content changes — kanban renders fresh on every request,
// so we only need to nudge connected browsers to reload.
try {
  watch(join(REPO_ROOT, 'data'), { recursive: true }, (_event, filename) => {
    if (!filename || filename.startsWith('.')) return;
    // Skip generated files (e.g., data/manifest.json) so that rebuilds
    // happening in a sibling process don't pile up reload events.
    if (!filename.endsWith('.md')) return;
    scheduleReload();
  });
} catch (e) {
  console.warn(`kanban: watch failed: ${e.message}`);
}

// ── Server ───────────────────────────────────────────────────────────────

const server = Bun.serve({
  hostname: '127.0.0.1',
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === '/api/cell') return handleApi(req);

    if (pathname === '/_reload') {
      let myCtrl;
      const stream = new ReadableStream({
        start(c) { myCtrl = c; sseClients.add(c); c.enqueue(': hello\n\n'); },
        cancel() { sseClients.delete(myCtrl); }
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        }
      });
    }

    if (pathname === '/' || pathname === '/index.html') {
      return new Response(renderKanbanHtml(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (pathname === '/kanban.css') {
      const file = Bun.file(join(REPO_ROOT, 'scripts', 'kanban.css'));
      return new Response(file, { headers: { 'Content-Type': 'text/css' } });
    }

    // Static fallback for /data/*, /style.css, etc. — useful if the user
    // runs the kanban without a separate static server and clicks "Show cell".
    const rel = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(REPO_ROOT, rel);
    if (filePath.startsWith(REPO_ROOT) && existsSync(filePath)) {
      return new Response(Bun.file(filePath));
    }
    return new Response('Not found', { status: 404 });
  }
});

console.log(`Kanban server running on http://127.0.0.1:${server.port}/`);
console.log('Edits write back to data/*/*.md. Reload to resync.');
