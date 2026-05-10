# Institutions

Interactive grid for exploring institutional design across scales (dyadic to global) and mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments), with three tabs: AGI, Human, and Fidelity.

## Build

```
npm install
npm run build
```

This generates `index.html`, `human/index.html`, `fidelity/index.html`, `problem-sets/index.html`, and `data/manifest.json`. All HTML files are checked into git and deployed as static files via Vercel.

## Stack

- Static site, no framework — vanilla JS (`app.js`) + CSS (`style.css`)
- Build step (`build.js`) reads markdown from `data/{agi,human,fidelity}/` and YAML from `data/methods.yaml`, renders HTML pages
- Content is markdown files named `{row}-{col}.md` (e.g. `dyadic-protocols.md`)
- `marked` for markdown rendering, `js-yaml` for methods config
- Deployed on Vercel (`vercel.json`)

## Content format

Each cell is a markdown file in `data/{tab}/`:
- `# H1` = cell summary shown in the grid
- Body after H1 = detail view content
- Optional `## Problem Sets` with `### Problem N` subsections
- Cells can also include lists of researchers, relevant papers, learning resources (textbooks, tutorials), links to existing implementations, etc. — any standard markdown

## Repo layout

- `build.js` — static site generator (run via `npm run build`)
- `app.js` — client-side interactivity (detail views, navigation)
- `style.css` — all styles
- `data/` — content (markdown + YAML + generated manifest)
- `vercel.json` — deployment config
