#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'pdfs');

const TABS = [
  { id: 'agi', html: 'index.html', out: 'agi.pdf' },
  { id: 'human', html: 'human/index.html', out: 'human.pdf' },
  { id: 'fidelity', html: 'fidelity/index.html', out: 'fidelity.pdf' }
];

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('Chrome not found. Set $CHROME_BIN to your Chrome/Chromium binary.');
}

const chrome = findChrome();
console.log(`Using Chrome: ${chrome}`);
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const tab of TABS) {
  const input = path.join(ROOT, tab.html);
  const output = path.join(OUT_DIR, tab.out);
  if (!fs.existsSync(input)) {
    console.error(`Missing ${tab.html} — run \`npm run build\` first.`);
    process.exit(1);
  }
  console.log(`→ pdfs/${tab.out}`);
  const res = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${output}`,
    `file://${input}`
  ], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`Chrome exited with status ${res.status} for ${tab.id}`);
    process.exit(res.status || 1);
  }
}

console.log('Done. Generated pdfs/agi.pdf, pdfs/human.pdf, pdfs/fidelity.pdf.');
