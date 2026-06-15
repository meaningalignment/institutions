# Institutions

Interactive grid for exploring institutional design across scales (dyadic to global) and mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments), with two tabs — AGI and Human — plus toggleable **visions** layered on the AGI grid. The AGI and Human grids share their cell bodies from `data/cells/` — each cell tells one story that covers how humans currently solve the problem and how AGI breaks it. The Human grid shows a different per-cell label (the existing-institution name) supplied via frontmatter. A **vision** (the first is "Fidelity & Meaning") is an extensible overlay, not a separate tab: a cell opts in via `visions:` frontmatter (which supplies the grid chip label) and contributes `{vision: id}`-tagged problem sets. Visions are off by default and toggled from the AGI grid's vision selector or a detail page; the selection is shared across pages via a `?visions=` URL param + localStorage.

This file documents the schema mechanics (frontmatter, section headings, build behavior). The cell quality bar — the principles we hold cells to and the checklist for evaluating one — lives in [STANDARDS.md](STANDARDS.md). The execution plan for bringing cells into compliance is in [plans/cell-standards-compliance.md](plans/cell-standards-compliance.md).

## Build

```
npm install
npm run build
```

This generates `index.html` (AGI grid), `human/index.html`, `problem-sets/index.html`, `curriculum/index.html`, a `fidelity/index.html` redirect stub (old Fidelity-tab links → `/?visions=fidelity`), and `data/manifest.json`. All HTML files are checked into git and deployed as static files via Vercel.

### Dev workflow

`npm run dev` starts both local servers at once with file-watch + live-reload:

- `http://127.0.0.1:5173/` — main site. Watches `data/`, `app.js`, `style.css`, `build.js`; on change reruns `build.js` and pushes a reload event over SSE to every open tab.
- `http://127.0.0.1:5174/` — Kanban (described below). Watches `data/` and pushes a reload event on change; the kanban renders fresh from disk on every request, so reload alone is enough.

Both servers inject a tiny `<script>` that listens on `/_reload` (Server-Sent Events) and calls `location.reload()` when the watcher fires. Run either standalone with `npm run serve` / `npm run kanban`.

### Kanban

The Kanban is a local-only tool — not part of the build, not deployed. It renders nine status columns (`not_started` → `summary_draft` → `summary_needs_work` → `summary_ok` → `body_draft` → `body_needs_work` → `body_ok` → `expert_selected` → `expert_reviewed`) live from the markdown files, lets you drag cards between columns and click owner pills to reassign (`oliver` / `joe` / `ryan` / `none`), and writes the edits back into the YAML frontmatter. Dragging a card into an expert stage prompts for the reviewer's name, stored in the free-text `expert:` frontmatter field (also editable via the card's expert pill). Cards with inline editorial notes in their body display a `✎ N` badge. Everything kanban-specific lives in `scripts/kanban.js` and `scripts/kanban.css`; `build.js` knows nothing about it.

## Stack

- Static site, no framework — vanilla JS (`app.js`) + CSS (`style.css`)
- Build step (`build.js`) reads markdown from `data/cells/` and `data/methods/`, renders HTML pages
- Content is markdown files named `{row}-{col}.md` (e.g. `dyadic-norms.md`)
- `marked` for markdown rendering, `js-yaml` for frontmatter and methods config
- Deployed on Vercel (`vercel.json`)

## Data layout

- `data/cells/{row}-{col}.md` — canonical cell. The H1 is the cell's title and is used as both the AGI-grid summary and the AGI-tab detail-view title. The optional `human_label:` frontmatter field provides the Human-grid summary and the Human-tab detail title (falls back to H1). The body is the detail content for both tabs.
- `data/methods/{col}.md` — column-level reference (textbooks, tutorials, key concepts) shared across both tabs. Frontmatter declares which method tags appear in the grid's methods row and whether they're bolded per tab. Methods content shows as a right-side rail on each detail page.
- **Visions** have no data directory. They are declared by the `VISIONS` const in `build.js` (each entry: `id`, `label`, `color`, `description`). A cell joins a vision through its `visions:` frontmatter and `{vision: id}`-tagged problem sets (see Cell schema). Fidelity content used to live in `data/fidelity/`; it now lives inside the relevant `data/cells/` files as fidelity-tagged problem sets.

## Cell schema

Every file in `data/cells/` follows this structure. The build doesn't enforce it, but `extractProblemSets` keys off `## Problem Sets` and the per-problem `###` heading, so deviating from those names breaks the problem-sets aggregator. The grid and Kanban use frontmatter `status` to choose a marker variant and workflow column.

```markdown
---
human_label: Social conventions        # optional; Human-grid summary + Human-tab detail title. Falls back to H1.
human_era: "Ancient / customary"       # optional; Human-tab display label for when the human institution-family was designed or became recognizable.
human_era_bucket: ancient              # optional; Human-tab color bucket: ancient | medieval | early-modern | industrial | twentieth | digital | ancient-medieval | ancient-modern | medieval-modern | early-modern-modern | industrial-digital.
hide_agi: true                         # optional; hide this cell from the AGI grid (renders empty). Use when no AGI story yet.
hide_human: true                       # optional; symmetric flag for the Human grid.
status: body_ok                        # not_started | summary_draft | summary_needs_work | summary_ok | body_draft | body_needs_work | body_ok | expert_selected | expert_reviewed. Drives grid marker and Kanban column.
owner: oliver                          # oliver | joe | ryan | none. Drives Kanban filter.
expert: Dr. Jane Doe                   # optional free text; the named expert reviewer. Required (and prompted in the Kanban) once status reaches an expert_* stage.
related: [group-norms]                 # optional; reserved for future cross-linking.
diffusion: "Who would use it…"         # optional; investor-facing. The prominent lead of the per-cell impact box (AGI tab only): who first adopts the design and the speculative path to wider diffusion. Single-line quoted string.
importance: "Why it matters…"          # optional; investor-facing, secondary. Importance / impact of the cell. Single-line quoted string.
neglectedness: "Won't happen by default because…"  # optional; investor-facing, secondary. How neglected / how likely it gets solved by default. Single-line quoted string.
visions:                               # optional; opt this cell into one or more visions overlaid on the AGI grid.
  fidelity: "Lay review panels…"       #   <vision-id>: "<grid chip label>". Vision ids come from the VISIONS const in build.js.
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

### {Problem title — names the institutional gap, not the topic} {vision: id}

(The trailing `{vision: id}` is optional — include it only to attach the problem set to a vision overlay; omit it for required briefs.)

**Scenario.** {A high-stakes example of the target coordination mechanism or institution working, failing, or needing to be rebuilt. Fold necessary context and stakes into this paragraph. Use plain language even when the scenario is domain-grounded.}

**Challenge:** {Design a procedure by which... One or two sentences naming the design task and what the team should produce in roughly one hour. Keep this tight; the rubric goes in Evaluation below.}

**Evaluation.** {Optional. One or two sentences describing what separates strong proposals from weak ones — the rubric, not the forks. Skip when the Challenge already makes the standard obvious.}

**Design choices the team must take a position on.**
1. **{Fork name}.** {Question phrased as a fork, not a topic.}
2. **{Fork}.** ...
3. **{Fork}.** ...
4. **{(optional) Fork}.** ...
5. **{(optional) Fork}.** ...

```

Multiple `###` problem sets under one cell are supported; each becomes its own entry on the problem-sets aggregate page.

**Per-cell impact box (investor framing).** The optional `diffusion`, `importance`, and `neglectedness` frontmatter fields render as a green-accented `.cell-impact` box at the top of the AGI-tab detail page (below the At-a-glance summary box; suppressed on the Human tab). `diffusion` — who would use the design and the speculative path to diffusion — is the prominent lead; `importance` and `neglectedness` sit below in smaller secondary text. Rendered by `renderImpactBox` in `app.js`; values are single-line quoted strings parsed by the inline frontmatter parser.

**"What is this?" project popup.** Every grid page (AGI + Human) has a `What is this?` button in the `.controls` row that opens an About modal explaining what the project is, why it's needed, and the five-stage theory of change (research/design → pairing the right people → prototypes/pilots → uptake → diffusion). Content lives in `renderAboutModal` / `ABOUT_STAGES` in `build.js`; the open/close JS is inline so it works without `app.js`.

**Vision-tagged problem sets.** Append `{vision: <id>}` to a problem set's `###` heading (e.g. `### Lay review panels on the jury-duty model {vision: fidelity}`) to attach it to a vision. Tagged problem sets are hidden by default and revealed only when that vision is toggled on — on the cell detail page and in the problem-sets aggregate (where they're grouped under the vision's label). Untagged problem sets are the cell's required briefs and always show. The tag is parsed in both `build.js` (`parseVisionTag` / `extractProblemSets`) and `app.js` (`parseVisionTag` / `wrapProblemSets`) — keep those two in sync.

On a cell detail page the vision toggle bar sits at the top of the `## Problem Sets` section (the only content a vision changes on that page), and lists only the visions this cell's problem sets actually use — a cell with no vision-tagged briefs shows no bar. `renderVisionToggleBar(onlyIds)` / `visionTagsInBody` in `app.js` compute and place it; the toggle is still threaded through the shared `?visions=` URL param + localStorage state, so flipping it here also updates the grid selector and the problem-sets aggregate.

### Why these particular sections

- **At a glance** is the cell's elevator pitch — three H3 subsections (`Coordination challenge`, `Examples`, `How AGI breaks them`). Pulled out of the body at render time and shown as the styled summary box at the top of the detail page; the section itself is stripped from the inline body so it doesn't render twice. Keeps everything in markdown so inline `{>> ... <<}` editorial notes work here too.
- **Human era metadata** is display-only metadata for the Human tab. `human_era` is the visible label; `human_era_bucket` chooses the periodic-table color bucket. Use a span bucket such as `ancient-modern` or `early-modern-modern` when a single design century would be misleading.
- **How humans solve this today** anchors readers in something familiar before the AGI-specific design problem hits. Always concrete (named institutions, named mechanisms), never generic ("humans cooperate by…").
- **Where AGI breaks it** is the load-bearing section: it states the specific ways the existing mechanism fails when one party is autonomous. It should be paragraph versions of the At a Glance `How AGI breaks them` bullets, in the same order, with no intro paragraph and no scenario prose. Resist anthropomorphism — agents are different institutional actors, not defective humans; don't write that they "fail to feel," "lack shame," or "miss the felt sense of." When a mechanism could apply to agents but with different objects (e.g. contractualist reasoning over agent counterparties whose training/principals/constraints are what's being modeled, not their reactions), name that explicitly rather than declaring the mechanism broken.
- **Problem Sets** turn selected mechanisms into design work. Each problem set contains its own `**Scenario.**`, `**Challenge:**`, optional `**Evaluation.**`, and `**Design choices the team must take a position on.**` Scenarios are high-stakes test objects, not a detached section. Challenge is the design task in one or two sentences; Evaluation (when present) names what separates strong from weak proposals. Strong problem sets can target formation, transmission, application, enforcement, appeal, revision, ratification, accountability, allocation, or evidence.
- **Design choices** force the team to take positions on 3–5 specific forks any answer must address. If you can't list them, the brief is still a topic, not a problem.

### Voice

Rigorous, not bombastic. Don't claim "load-bearing" without showing why. Don't reach for rhetorical flourish ("the trader's chill," "the silhouette of disaster," "felt cost"). Don't anthropomorphize agents — when you find yourself writing about what an agent "feels," "lacks the sense of," or is "embarrassed by," stop and instead name the structural property of the human institution that doesn't apply to agents. The reader is a serious institutional designer; the prose should read as sober analysis, not as advocacy.

### Status field

`status:` tracks where each cell sits in the writing pipeline. Nine values, in order:

- `not_started` — placeholder; no frontmatter content yet. Faint gray corner marker.
- `summary_draft` — the `## At a glance` section (Coordination challenge / Examples / How AGI breaks them) is drafted, ready for review.
- `summary_needs_work` — reviewer has flagged the summary; specifics live in inline editorial notes (`{>> ... <<}`) in the body. Orange marker.
- `summary_ok` — summary box reviewed and OK.
- `body_draft` — body sections (`## How humans solve this today`, `## Where AGI breaks it`, `## Problem Sets`) are drafted, ready for review.
- `body_needs_work` — reviewer has flagged the body; specifics live in inline editorial notes (`{>> ... <<}`). Red marker.
- `body_ok` — body reviewed and stable. Solid green marker.
- `expert_selected` — body is done and an expert reviewer has been named (`expert:` frontmatter). Blue marker. The Kanban requires an expert name to enter this stage.
- `expert_reviewed` — the named expert has reviewed the cell. Dark-green marker.

`body_ok` and the two `expert_*` stages all count as "published" — the deployed site shows their bodies and the AGI grid marks them done.

The corresponding CSS classes use hyphens (`status-not-started`, `status-summary-draft`, `status-summary-needs-work`, `status-expert-selected`, `status-expert-reviewed`, etc.).

### Inline editorial notes

Reviewers leave feedback inline using `{>> note text <<}` markers anywhere in the body. The build transforms them into `<span class="editorial">…</span>`. They are hidden on the deployed site by default and revealed on `localhost` / `127.0.0.1` or when `?editorial` is in the URL. The Kanban counts the markers per cell and shows a `✎ N` badge on the card when a cell has any. Multi-line notes are supported (the regex is `\{>>[\s\S]*?<<\}`). To address a note, edit the prose and delete the marker.

### Owner field

`owner:` is one of `oliver`, `joe`, `ryan`, or `none` (unassigned). Used by the Kanban page filter and the per-card "Assign to" popup. New cells start as `none`.

### Expert field

`expert:` is free text naming the expert reviewer. It is optional in general, but **required once `status` reaches `expert_selected` or `expert_reviewed`** — the Kanban prompts for it when you drag a card into an expert column, and the PATCH endpoint rejects an expert stage with no expert. It renders as a `👤` pill on the card (click to edit) and is cleared from frontmatter when set empty.

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
