# Institutions

Interactive grid for exploring institutional design across scales (dyadic to global) and mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments), with three tabs: AGI, Human, and Fidelity. The AGI and Human grids share their cell bodies from `data/cells/` — each cell tells one story that covers how humans currently solve the problem and how AGI breaks it. The Human grid shows a different per-cell label (the existing-institution name) supplied via frontmatter. Fidelity stays separate.

This file documents the schema mechanics (frontmatter, section headings, build behavior). The cell quality bar — the principles we hold cells to and the checklist for evaluating one — lives in [STANDARDS.md](STANDARDS.md). The execution plan for bringing cells into compliance is in [plans/cell-standards-compliance.md](plans/cell-standards-compliance.md).

## Build

```
npm install
npm run build
```

This generates `index.html` (AGI grid), `human/index.html`, `fidelity/index.html`, `problem-sets/index.html`, and `data/manifest.json`. All HTML files are checked into git and deployed as static files via Vercel.

### Dev workflow

`npm run dev` starts both local servers at once with file-watch + live-reload:

- `http://127.0.0.1:5173/` — main site. Watches `data/`, `app.js`, `style.css`, `build.js`; on change reruns `build.js` and pushes a reload event over SSE to every open tab.
- `http://127.0.0.1:5174/` — Kanban (described below). Watches `data/` and pushes a reload event on change; the kanban renders fresh from disk on every request, so reload alone is enough.

Both servers inject a tiny `<script>` that listens on `/_reload` (Server-Sent Events) and calls `location.reload()` when the watcher fires. Run either standalone with `npm run serve` / `npm run kanban`.

### Kanban

The Kanban is a local-only tool — not part of the build, not deployed. It renders seven status columns (`not_started` → `summary_draft` → `summary_needs_work` → `summary_ok` → `body_draft` → `body_needs_work` → `body_ok`) live from the markdown files, lets you drag cards between columns and click owner pills to reassign (`oliver` / `joe` / `none`), and writes the edits back into the YAML frontmatter. Cards with inline editorial notes in their body display a `✎ N` badge. Everything kanban-specific lives in `scripts/kanban.js` and `scripts/kanban.css`; `build.js` knows nothing about it.

## Stack

- Static site, no framework — vanilla JS (`app.js`) + CSS (`style.css`)
- Build step (`build.js`) reads markdown from `data/cells/`, `data/fidelity/`, and `data/methods/`, renders HTML pages
- Content is markdown files named `{row}-{col}.md` (e.g. `dyadic-norms.md`)
- `marked` for markdown rendering, `js-yaml` for frontmatter and methods config
- Deployed on Vercel (`vercel.json`)

## Data layout

- `data/cells/{row}-{col}.md` — canonical cell. The H1 is the cell's real title (the gap statement) and is shown as the AGI-tab detail-view title. The optional `agents_label:` frontmatter field provides a short AGI-grid summary (falls back to H1). The optional `human_label:` field provides the Human-grid summary and the Human-tab detail title (falls back to H1). The body is the detail content for both tabs.
- `data/fidelity/{row}-{col}.md` — separate content for the Fidelity tab. Same schema as `data/cells/` but rendered standalone.
- `data/methods/{col}.md` — column-level reference (textbooks, tutorials, key concepts) shared across all three tabs. Frontmatter declares which method tags appear in the grid's methods row and whether they're bolded per tab. Methods content shows as a right-side rail on each detail page.

## Cell schema

Every file in `data/cells/` follows this structure. The build doesn't enforce it, but `extractProblemSets` keys off `## Problem Sets` and the per-problem `###` heading, so deviating from those names breaks the problem-sets aggregator. The grid and Kanban use frontmatter `status` to choose a marker variant and workflow column.

```markdown
---
agents_label: Norms between agents     # optional; AGI-grid summary (short). Falls back to H1.
human_label: Social conventions        # optional; Human-grid summary + Human-tab detail title. Falls back to H1.
hide_agi: true                         # optional; hide this cell from the AGI grid (renders empty). Use when no AGI story yet.
hide_human: true                       # optional; symmetric flag for the Human grid.
status: body_ok                        # not_started | summary_draft | summary_needs_work | summary_ok | body_draft | body_needs_work | body_ok. Drives grid marker and Kanban column.
owner: oliver                          # oliver | joe | none. Drives Kanban filter.
related: [group-norms]                 # optional; reserved for future cross-linking.
---

# {Cell title — the gap statement. Shown as the AGI-tab detail-view title.}

## At a glance

### Coordination challenge

{One-line statement of the coordination challenge for this row × col. Rendered as the "Coordination challenge" row in the summary box at the top of the detail page on both AGI and Human tabs.}

### Examples

- {3–5 short example-institution names for this row × col.}
- ...

### How AGI breaks them

- {3–5 very short bullets on how AGI breaks the human institutions in Examples.}
- ...

## How humans solve this today

{1–3 paragraphs naming the actual existing institution(s) — not generic theory.
End with a vivid micro-scenario, introduced by "A vivid case:".}

## Where AGI breaks it

{Paragraph versions of the bullets under `### How AGI breaks them`, in the same order. Start each paragraph with the matching bullet text in bold, then derive why the human mechanism no longer transmits, binds, represents, restrains, revises, allocates, or resolves in the same way. Name relevant structural agent properties inside the derivation. Avoid anthropomorphism. No scenario lives here.}

## Problem Sets

### {Problem title — names the institutional gap, not the topic}

**Scenario.** {A high-stakes example of the target coordination mechanism or institution working, failing, or needing to be rebuilt. Fold necessary context and stakes into this paragraph. Use plain language even when the scenario is domain-grounded.}

**Challenge:** {Design a procedure by which... Include the design task, success criterion, and deliverable in one paragraph. Make clear what counts as a better or worse proposal and what the team should produce in roughly one hour.}

**Design choices the team must take a position on.**
1. **{Fork name}.** {Question phrased as a fork, not a topic.}
2. **{Fork}.** ...
3. **{Fork}.** ...
4. **{(optional) Fork}.** ...
5. **{(optional) Fork}.** ...

```

Multiple `###` problem sets under one cell are supported; each becomes its own entry on the problem-sets aggregate page.

### Why these particular sections

- **At a glance** is the cell's elevator pitch — three H3 subsections (`Coordination challenge`, `Examples`, `How AGI breaks them`). Pulled out of the body at render time and shown as the styled summary box at the top of the detail page; the section itself is stripped from the inline body so it doesn't render twice. Keeps everything in markdown so inline `{>> ... <<}` editorial notes work here too.
- **How humans solve this today** anchors readers in something familiar before the AGI-specific design problem hits. Always concrete (named institutions, named mechanisms), never generic ("humans cooperate by…").
- **Where AGI breaks it** is the load-bearing section: it states the specific ways the existing mechanism fails when one party is autonomous. It should be paragraph versions of the At a Glance `How AGI breaks them` bullets, in the same order, with no intro paragraph and no scenario prose. Resist anthropomorphism — agents are different institutional actors, not defective humans; don't write that they "fail to feel," "lack shame," or "miss the felt sense of." When a mechanism could apply to agents but with different objects (e.g. contractualist reasoning over agent counterparties whose training/principals/constraints are what's being modeled, not their reactions), name that explicitly rather than declaring the mechanism broken.
- **Problem Sets** turn selected mechanisms into design work. Each problem set contains its own `**Scenario.**`, `**Challenge:**`, and `**Design choices the team must take a position on.**` Scenarios are high-stakes test objects, not a detached section. The challenge folds together the missing procedure, success criterion, and deliverable. Strong problem sets can target formation, transmission, application, enforcement, appeal, revision, ratification, accountability, allocation, or evidence.
- **Design choices** force the team to take positions on 3–5 specific forks any answer must address. If you can't list them, the brief is still a topic, not a problem.

### Voice

Rigorous, not bombastic. Don't claim "load-bearing" without showing why. Don't reach for rhetorical flourish ("the trader's chill," "the silhouette of disaster," "felt cost"). Don't anthropomorphize agents — when you find yourself writing about what an agent "feels," "lacks the sense of," or is "embarrassed by," stop and instead name the structural property of the human institution that doesn't apply to agents. The reader is a serious institutional designer; the prose should read as sober analysis, not as advocacy.

### Status field

`status:` tracks where each cell sits in the writing pipeline. Seven values, in order:

- `not_started` — placeholder; no frontmatter content yet. Faint gray corner marker.
- `summary_draft` — the `## At a glance` section (Coordination challenge / Examples / How AGI breaks them) is drafted, ready for review.
- `summary_needs_work` — reviewer has flagged the summary; specifics live in inline editorial notes (`{>> ... <<}`) in the body. Orange marker.
- `summary_ok` — summary box reviewed and OK.
- `body_draft` — body sections (`## How humans solve this today`, `## Where AGI breaks it`, `## Problem Sets`) are drafted, ready for review.
- `body_needs_work` — reviewer has flagged the body; specifics live in inline editorial notes (`{>> ... <<}`). Red marker.
- `body_ok` — body reviewed and stable. Solid green marker.

The corresponding CSS classes use hyphens (`status-not-started`, `status-summary-draft`, `status-summary-needs-work`, etc.).

### Inline editorial notes

Reviewers leave feedback inline using `{>> note text <<}` markers anywhere in the body. The build transforms them into `<span class="editorial">…</span>`. They are hidden on the deployed site by default and revealed on `localhost` / `127.0.0.1` or when `?editorial` is in the URL. The Kanban counts the markers per cell and shows a `✎ N` badge on the card when a cell has any. Multi-line notes are supported (the regex is `\{>>[\s\S]*?<<\}`). To address a note, edit the prose and delete the marker.

### Owner field

`owner:` is one of `oliver`, `joe`, or `none` (unassigned). Used by the Kanban page filter and the per-card "Assign to" popup. New cells start as `none`.

## Skills

Repo-local skills live in `skills/`. The current project skill is `skills/institution-cell-dialogue`, a conversational workflow for revising one institution cell and codifying reusable lessons. To make slash or dollar skill invocation discover it in Codex, install or symlink it into `$CODEX_HOME/skills/institution-cell-dialogue` (usually `/Users/joe/.codex/skills/institution-cell-dialogue`) and start a new Codex thread so the skill registry refreshes.

## Repo layout

- `build.js` — static site generator (run via `npm run build`)
- `app.js` — client-side interactivity (detail views, navigation, sidebar layout)
- `style.css` — all styles, including the detail-page two-column / mobile-stacking layout
- `data/` — content (markdown + generated manifest)
- `skills/` — repo-local Codex skills for this project
- `vercel.json` — deployment config
- `AGENTS.md` / `CLAUDE.md` — kept in sync for tools that look at either file
