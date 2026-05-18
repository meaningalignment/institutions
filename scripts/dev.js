#!/usr/bin/env bun
// Launcher: spawns the kanban server (5174) and the static dev server (5173)
// as child processes, forwards their stdio, and stops them both on Ctrl+C.

import { spawn } from 'node:child_process';

const targets = [
  { name: 'kanban', script: 'scripts/kanban.js' },
  { name: 'serve',  script: 'scripts/serve.js' }
];

const procs = targets.map(({ name, script }) => {
  const p = spawn('bun', [script], { stdio: 'inherit', cwd: process.cwd() });
  p.on('exit', code => {
    console.log(`[${name}] exited with code ${code}`);
    cleanup();
  });
  return p;
});

let cleaning = false;
function cleanup() {
  if (cleaning) return;
  cleaning = true;
  for (const p of procs) {
    try { p.kill('SIGTERM'); } catch {}
  }
  setTimeout(() => process.exit(0), 100);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
