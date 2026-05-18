#!/usr/bin/env bun
// Live dev server for the built static site.
//
//   bun run serve
//
// Then open http://127.0.0.1:5173/
//
// Watches data/, app.js, style.css, build.js; reruns build.js on change and
// pushes a reload event over SSE so every open tab refreshes itself. HTML
// responses are intercepted to inject the SSE listener.
//
// Bound to 127.0.0.1 only. Local development only — not part of the deploy.

import { readFileSync, existsSync, watch, statSync } from 'node:fs';
import { join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const PORT = 5173;

const RELOAD_SCRIPT = `<script>(function(){try{var es=new EventSource('/_reload');es.addEventListener('reload',function(){location.reload();});}catch(e){}})();</script>`;

// ── SSE live-reload ──────────────────────────────────────────────────

const sseClients = new Set();
function broadcastReload() {
  const payload = 'event: reload\ndata: 1\n\n';
  for (const ctrl of [...sseClients]) {
    try { ctrl.enqueue(payload); }
    catch { sseClients.delete(ctrl); }
  }
}

// ── Build runner (re-spawns build.js as a child) ─────────────────────

let buildInFlight = false;
let buildPending = false;
let buildTimer = null;

function scheduleBuild() {
  clearTimeout(buildTimer);
  buildTimer = setTimeout(() => {
    buildTimer = null;
    if (buildInFlight) { buildPending = true; return; }
    runBuild();
  }, 400);
}

function runBuild() {
  if (buildInFlight) return;
  buildInFlight = true;
  buildPending = false;
  const t = Date.now();
  const proc = Bun.spawnSync(['bun', 'build.js'], {
    cwd: REPO_ROOT, stdout: 'pipe', stderr: 'pipe'
  });
  buildInFlight = false;
  if (proc.exitCode === 0) {
    console.log(`built in ${Date.now() - t}ms`);
    broadcastReload();
  } else {
    console.error('build failed:\n' + new TextDecoder().decode(proc.stderr));
  }
  if (buildPending) scheduleBuild();
}

// Initial build so the served files are up to date.
runBuild();

// ── Watchers ─────────────────────────────────────────────────────────

const WATCH_TARGETS = ['data', 'app.js', 'style.css', 'build.js'];
for (const rel of WATCH_TARGETS) {
  const p = join(REPO_ROOT, rel);
  if (!existsSync(p)) continue;
  const opts = statSync(p).isDirectory() ? { recursive: true } : {};
  try {
    watch(p, opts, (_event, filename) => {
      if (filename && filename.startsWith('.')) return;
      // Inside data/, only .md edits should trigger a rebuild — otherwise
      // build.js writing data/manifest.json kicks off an infinite loop.
      if (rel === 'data' && filename && !filename.endsWith('.md')) return;
      scheduleBuild();
    });
  } catch (e) {
    console.warn(`serve: watch failed for ${rel}: ${e.message}`);
  }
}

// ── HTTP ─────────────────────────────────────────────────────────────

function injectReload(html) {
  return html.includes('</body>')
    ? html.replace('</body>', RELOAD_SCRIPT + '</body>')
    : html + RELOAD_SCRIPT;
}

const server = Bun.serve({
  hostname: '127.0.0.1',
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

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

    let rel = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    if (rel.endsWith('/')) rel += 'index.html';
    let filePath = join(REPO_ROOT, rel);
    if (!filePath.startsWith(REPO_ROOT)) {
      return new Response('Not found', { status: 404 });
    }

    if (!existsSync(filePath)) {
      // Try `<path>/index.html` for paths missing a trailing slash.
      const withIndex = join(filePath, 'index.html');
      if (existsSync(withIndex)) filePath = withIndex;
      else return new Response('Not found', { status: 404 });
    }

    if (filePath.endsWith('.html')) {
      const html = readFileSync(filePath, 'utf8');
      return new Response(injectReload(html), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response(Bun.file(filePath));
  }
});

console.log(`Dev server on http://127.0.0.1:${server.port}/`);
console.log('Watching data/, app.js, style.css, build.js — rebuilds + reloads on change.');
