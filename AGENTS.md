# Institutions

Interactive grid for exploring institutional design across scales (dyadic to global) and mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments), with two tabs — AGI and Human — plus toggleable **visions** layered on the AGI grid. The grids share detail bodies from `data/cells/`, but their grid-level data is separate: AGI labels come from each cell H1, while the Human grid's dated institution records and timeline live in `data/human-institutions.json`. A **vision** (the first is "Fidelity & Meaning") is an extensible overlay, not a separate tab: a cell opts in via `visions:` frontmatter (which supplies the grid chip label) and contributes `{vision: id}`-tagged design challenges. Visions are off by default and toggled from the AGI grid's vision selector or a detail page; the selection is shared across pages via a `?visions=` URL param + localStorage.

This file documents the schema mechanics (frontmatter, section headings, how content renders). The cell quality bar — the principles we hold cells to and the checklist for evaluating one — lives in [STANDARDS.md](STANDARDS.md). The execution plan for bringing cells into compliance is in [plans/cell-standards-compliance.md](plans/cell-standards-compliance.md).

## Build

```
npm install
npm run dev        # React Router (Vite) dev server at http://localhost:5173/
npm run build      # → build/ : client bundle + SSR server bundle
```

The site is a **React Router v8 framework-mode app (SSR)** in `app/`. Pages are server-rendered at request time — nothing is committed as static HTML. Deployed on Vercel with zero-config React Router detection (`vercel.json` → `{ "framework": "react-router" }`).

The Markdown/YAML/JSON under `data/` is **bundled into the build** by the `siteContent()` Vite plugin (`vite.config.ts`), exposed as the `virtual:site-content` module and read through `app/lib/content.server.ts`. Content therefore ships inside the server bundle and is never read from disk at runtime (required for Vercel serverless; `import.meta.glob` raw is avoided because rolldown's SSR pass mishandles it).

Grid loaders must use `loadGridCells()`, which returns only the H1 summary and grid-visible metadata; never return `loadCells()` from a grid route, because that serializes every Markdown body into the client data response. `content.server.ts` memoizes parsed cells, method tags, curriculum metadata, and human-institution JSON for the lifetime of a server instance. Routes that render Markdown to HTML (detail, methods, design challenges, curriculum, and theory of change) likewise cache their finished serializable result, so repeat requests do not reparse or rerender build-bundled content. Static content routes export the native `Cache-Control` policy from `app/lib/cache.server.ts`; do not apply it to DB-backed Community/Admin routes.

Routes (`app/routes.ts`): `/` (AGI grid), `/human` (Human grid), `/cell/:row/:col` + `/human/:row/:col` (cell detail — real, crawlable URLs), `/methods/:col`, `/design-challenges`, `/curriculum`, `/theory-of-change`, `/researchers` + `/researchers/:handle` (Community, DB-backed — currently unlinked from the grids), `/researchers/admin` + `/researchers/admin/people` + `/researchers/admin/papers` (internal, email-code authenticated; legacy `/admin/*` URLs redirect here), `/login` + `/logout`, `/fidelity` → redirect to `/?visions=fidelity`.

### Curriculum page

The `/curriculum` route's HTML is built server-side by `buildCurriculum(cells)` in `app/lib/curriculum.server.ts` from `data/curriculum.md` (it uses the loaded cells so the institution picker can label tiles with cell H1s). The H1 is the page title; each `## N. Name` H2 becomes a collapsible `.curr-field` section. Its **stable id** keeps the leading number (`slugify(name)`, e.g. `## 1. The Big Picture` → `1-the-big-picture`) so links never move, but the **display title** strips the number — the visible number is a `.curr-field-num` badge re-derived dynamically so re-ranking can renumber it. A sidebar (each link carries a `.curr-sidebar-num` badge + `.curr-sidebar-label`) + scrollspy + a chip TOC are derived from the fields.

**Entry-axis pickers.** Under the intro the page renders two foldable `<details class="curr-picker">` blocks, both collapsed by default:

- **"Start from a problem you care about"** — one tile per problem theme.
- **"Start from an institution we need to build"** — one tile per live AGI cell that a theme lists as an exemplar (label = cell H1, sorted alphabetically). A cell that belongs to multiple themes **merges** their field rankings (first occurrence of a field wins its position + gain line).

Clicking any tile floats the relevant fields to the top (in ranking order — a theme lists however many fields are genuinely relevant, often 4–5, with `1-the-big-picture` appended last as orienting reading), injects a per-field `.curr-gain` block at the top of each relevant field's body (a "What you'll gain" label + the field's motivating relevance line), and dims + collapses the rest under an "Other fields" divider. **The sidebar reorders to mirror the main column, and both the field-heading numbers and the sidebar numbers renumber** (relevant fields 1..N; dimmed fields get a blank heading number and a `·` in the sidebar). A single shared "Show all fields" control (or re-clicking the active tile) restores the exact original DOM order, numbering, and removes injected nodes. With JS off all fields stay visible and the pickers are inert.

The active selection surfaces as a fixed top-right **`.curr-selection-chip`** ("Problem: …" / "Institution: …") with an **×** that clears back to the all-fields view. While a selection is active the two picker boxes **collapse** (`.curr-pickers.is-collapsed`) to a faint "Change selection" line — the chip is the live control; clicking "Change selection" re-expands the pickers (opening the one holding the active tile) without clearing the selection. Selection is mirrored to the **URL** as a mutually-exclusive `?problem=<theme-id>` or `?institution=<cell-id>` param (via `history.replaceState`), so a pre-selected state is deep-linkable; on load the page reads the param and applies it (clearing the param if it's stale/unknown). This reranking + scrollspy behavior lives in `app/lib/curriculum-init.ts` (`select(kind, id)` / `setChip` / `setUrl` / `collapsePickers`), run once from a `useEffect` on the client after hydration.

The taxonomy lives in its own file, **`data/curriculum-map.yaml`** (loaded by `loadCurriculumMap` in `app/lib/content.server.ts`); `curriculum.md` is pure prose. The YAML is a list of themes:

```yaml
themes:
  - id: theme-id                 # used in the ?problem=<id> URL param
    label: Theme label           # picker tile + chip label
    description: one line shown under the tile label
    cells: [cell-id, cell-id]    # live AGI cells; drives the institution picker
    fields:                      # ordered by relevance; BP appended last
      - id: 4-microeconomics     # must be a real field slug
        gain: >-                 # the field's "What you'll gain" block
          Motivating, capability-framed, nails why this field is relevant.
```

List as many or as few fields as are genuinely relevant (often 4–5), in relevance order, with `1-the-big-picture` appended last as orienting reading. The route emits the picker tiles, adds `data-field="<slug>"` to each `.curr-field`, and writes a `<script type="application/json" id="curr-theme-map">` blob of `{ themes: { themeId: { label, fields:[{id,bridge}] } }, cells: { cellId: { label, themes:[themeId,...] } } }` that the client reorders from (the `bridge` key carries each field's `gain` text). The build validates every referenced field `id` against the real field slugs and every `cells:` id against the loaded cells, and `console.warn`s on unknown fields, empty field lists, TODO/empty gain lines (scaffolds), or institutions that are missing/`hide_agi`.

### Dev workflow

`npm run dev` runs the React Router (Vite) dev server at `http://localhost:5173/` with HMR — editing anything under `data/` or `app/` reloads. `npm run typecheck` runs `react-router typegen && tsc`.

The **Kanban** editorial tool is separate and local-only: `npm run kanban` at `http://127.0.0.1:5174/`.

### Kanban

The Kanban is a local-only tool — not part of the app or the deploy. It renders nine status columns (`not_started` → `summary_draft` → `summary_needs_work` → `summary_ok` → `body_draft` → `body_needs_work` → `body_ok` → `expert_selected` → `expert_reviewed`) live from the markdown files, lets you drag cards between columns and click owner pills to reassign (`oliver` / `joe` / `ryan` / `none`), and writes the edits back into the YAML frontmatter. Dragging a card into an expert stage prompts for the reviewer's name, stored in the free-text `expert:` frontmatter field (also editable via the card's expert pill). Cards with inline editorial notes in their body display a `✎ N` badge. Everything kanban-specific lives in `scripts/kanban.js` and `scripts/kanban.css`; it reads/writes `data/` directly and is independent of the React Router app.

## Stack

- **React Router v8** (framework mode, SSR) + **React 19** + **TypeScript**, built with **Vite** + **Tailwind CSS v4**. All app code lives in `app/`.
- Content is Markdown/YAML/JSON under `data/`, bundled into the build via `virtual:site-content`. Cells are `{row}-{col}.md` (e.g. `dyadic-norms.md`).
- `marked` renders markdown and `js-yaml` parses frontmatter — both **server-side**, in route loaders / `app/lib/*.server.ts`. Cell bodies are rendered to HTML on the server and injected.
- The **ecosystem** Neon Postgres (researchers) is queried via `@neondatabase/serverless` (`app/lib/db.server.ts`, `POSTGRES_URL` env) for the Community page and `/researchers/admin`.
- Deployed on Vercel (`vercel.json` → `framework: react-router`).

## Data layout

- `data/cells/{row}-{col}.md` — canonical detail body. The H1 is the AGI-grid summary and AGI detail title; the body supplies the detail content for both tabs.
- `data/human-institutions.json` — canonical Human-grid timeline, Human detail titles, and dated institution records. A cell can accumulate multiple institutions over time; selecting a stop shows every record up to that era and highlights records whose `era` is the selected stop.
- `data/methods/{col}.md` — column-level reference (textbooks, tutorials, key concepts) shared across both tabs. Frontmatter declares which method tags appear in the grid's methods row and whether they're bolded per tab. Methods content shows as a right-side rail on each detail page.
- **Visions** have no data directory. They are declared by the `VISIONS` const in `app/lib/constants.ts` (each entry: `id`, `label`, `color`, `description`). A cell joins a vision through its `visions:` frontmatter and `{vision: id}`-tagged design challenges (see Cell schema). Fidelity content used to live in `data/fidelity/`; it now lives inside the relevant `data/cells/` files as fidelity-tagged design challenges.
- The **ecosystem** researcher DB (Neon Postgres) is external to this repo — see the Stack section. It joins to cells on `cell_key = {row}-{col}`.

## Community & admin (ecosystem DB)

Two DB-backed areas, both server-rendered from the `ecosystem` Postgres via `app/lib/researchers.server.ts` / `admin.server.ts` (connection in `POSTGRES_URL`):

- **`/researchers` — Community page.** Three groups (see `getCommunity`): **Scouts & Advisors** (the `advisors` table, shown with their `advises_about`), **Community members** (anyone with a Signal/Slack/Zoom/workshop `researcher_involvements` row), and **Friends** (`commitment` in `committed`/`warm`, not already grouped). Cards + `/researchers/:handle` profiles are styled in the shared wiki system (`app/components/ResearcherCard.tsx`). Researcher `photo_url`s are site-relative and prefixed with `https://players.meaningalignment.org`. Public biographies are stored in `researchers.bio` with attribution in `bio_source_url`; run `npm run db:migrate:researcher-bios` once, then `npm run db:import:pax-bios` to refresh matching biographies from Pax Machina's public About page. The page is linked as an expandable **Research community** section in the wiki sidebar, with anchors to all three groups.
- **`/researchers/admin`, `/researchers/admin/people`, `/researchers/admin/papers`.** Internal dashboard implemented as a nested React Router layout with three leaf routes and leaf-owned loaders/actions. The Community heading has an authenticated edit toggle that switches between `/researchers` and the admin; legacy `/admin/*` URLs redirect to the new location. The parent and every leaf loader/action require an email-code session so parallel React Router data requests cannot bypass the layout gate. **Scouts** (`/researchers/admin`) is an alphabetized list of current advisors with autosaving `advises_about` fields and a researcher-name combobox for adding people. **Papers** (`/researchers/admin/papers`) lists `canonical_works` alphabetically, autosaves title/URL, and manages alphabetized researcher associations through the same combobox. **People** (`/researchers/admin/people`) includes every researcher, including people with no involvement; closeness edits the `researchers.commitment` field inline, Signal membership is always visible, and a compact status summary such as “Slack · 2 Zooms · 1 workshop” expands to the underlying Slack/Zoom/workshop checkboxes. “Cold” is the product label for the compatibility storage key `not-on-slack`; Slack membership itself is an involvement, never a closeness level. Under name search, a gear row reading “Showing all people” or summarizing the active query opens a popover that combines multi-select closeness (OR) with scout/non-scout, Signal, Slack, and other-involvement filters (AND). **Copy Markdown** exports only the currently visible people as compact name/handle/closeness/involvement bullets. Membership checkboxes mutate one association at a time so concurrent autosaves do not replace the full set or overwrite existing evidence.

### Admin authentication

`/login` accepts any address present in `researchers.email`, sends a six-digit code through Mailgun, and creates a signed HttpOnly `SameSite=Lax` cookie after verification. Codes are HMAC-hashed with `SESSION_SECRET`, expire after 10 minutes, allow at most five attempts, and are resend-throttled for 60 seconds in `institutions_admin_login_codes`. Run `npm run db:migrate:admin-auth` once per database before deploying. Required production environment variables are `SESSION_SECRET` (at least 32 characters), `MAILGUN_API_KEY`, and `MAILGUN_DOMAIN`; `MAILGUN_FROM` is optional and `MAILGUN_REGION=eu` selects Mailgun's EU API. See `.env.example`.

## Cell schema

Every file in `data/cells/` follows this structure. The app doesn't enforce it, but `extractProblemSets` (in `app/lib/markdown.ts`) keys off `## Design Challenges` and the per-problem `###` heading, so deviating from those names breaks the design-challenges aggregator. The grid and Kanban use frontmatter `status` to choose a marker variant and workflow column.

```markdown
---
hide_agi: true                         # optional; hide this cell from the AGI grid (renders empty). Use when no AGI story yet.
hide_human: true                       # optional; symmetric flag for the Human grid.
status: body_ok                        # not_started | summary_draft | summary_needs_work | summary_ok | body_draft | body_needs_work | body_ok | expert_selected | expert_reviewed. Drives grid marker and Kanban column.
owner: oliver                          # oliver | joe | ryan | none. Drives Kanban filter.
expert: Dr. Jane Doe                   # optional free text; the named expert reviewer. Required (and prompted in the Kanban) once status reaches an expert_* stage.
related: [group-norms]                 # optional; reserved for future cross-linking.
visions:                               # optional; opt this cell into one or more visions overlaid on the AGI grid.
  fidelity: "Lay review panels…"       #   <vision-id>: "<grid chip label>". Vision ids come from the VISIONS const in app/lib/constants.ts.
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

## Theory of change

{Optional, investor-facing, AGI tab only. Standalone intro paragraph that reads on its own without the body: the problem in one line, then that early prototypes exist (name them, with [links](url)), then a lead-in to the path. Markdown links work here.}

1. {Ladder step — research trial / bounded pilot with a named adopter-kind / scale. Plain, hedged, no em dashes.}
2. ...

**Scores**

- Urgency: 3/5 — {one short sentence}
- Tractability: 3/5 — {one short sentence}
- Neglectedness: 2/5 — {one short sentence}
- Maturity: 3/5 — {one short sentence}

## How humans solve this today

{1–3 paragraphs naming the actual existing institution(s) — not generic theory.
End with a vivid micro-scenario, introduced by "A vivid case:".}

## Where AGI breaks it

{Paragraph versions of the bullets under `### How AGI breaks them`, in the same order. Start each paragraph with the matching bullet text in bold, then derive why the human mechanism no longer transmits, binds, represents, restrains, revises, allocates, or resolves in the same way. Name relevant structural agent properties inside the derivation. Avoid anthropomorphism. No scenario lives here.}

## Design Challenges

### {Problem title — names the institutional gap, not the topic} {vision: id}

(The trailing `{vision: id}` is optional — include it only to attach the design challenge to a vision overlay; omit it for required briefs.)

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

## Human institutions timeline schema

`data/human-institutions.json` is independent of cell frontmatter. Its `timeline` array defines ordered slider stops; every institution record refers to one stop by `era` while `since` carries the more specific visible date. `id` is stable within its cell. Each cell also carries a short `label` — the Human grid opens in a **simple view** that shows only that label per cell; a "See institutions throughout history" toggle (state in `app/components/Grid.tsx`) reveals **history mode**: the timeline slider plus the full dated records.

```json
{
  "timeline": [
    {
      "id": "postwar",
      "date": "c. 1975",
      "label": "Postwar order",
      "description": "Global institutions, social safety nets, civil and human rights, and modern regulation"
    }
  ],
  "cells": {
    "national-rights": {
      "title": "National rights and courts",
      "label": "Constitutions, courts & judiciary",
      "institutions": [
        {
          "id": "civil-human-rights",
          "name": "Civil-rights and human-rights enforcement",
          "since": "1948–1960s",
          "era": "postwar"
        }
      ]
    }
  }
}
```

The loader rejects unknown era ids, missing fields (including a missing cell `label`), and duplicate institution ids. The dataset should contain all 35 row × column keys even if an early timeline stop leaves some cells empty.

Multiple `###` design challenges under one cell are supported; each becomes its own entry on the design-challenges aggregate page.

**Per-cell "Theory of change" (investor framing).** An optional `## Theory of change` markdown section renders as a standalone collapsible box under the At-a-glance summary box (AGI tab only; suppressed on the Human tab). It's for funders, not researchers, so it's collapsed by default. The section has three parts: an **intro paragraph** (the speculative-path prose, with markdown links), a **numbered ladder** (a markdown ordered list), and a **`**Scores**` block** — four `- Label: N/5 — note` bullets (Urgency, Tractability, Neglectedness, Maturity). Scores render as `●●●○○` dot rows with the note shown to the right and the dimension meaning on hover; Maturity = how far along the work is (5 = working prototypes/pilots). The section is parsed out of the body by `extractTheoryOfChange` in `app/lib/markdown.ts` (mirroring `extractAtGlance`), so it doesn't render twice; `renderTheoryOfChange` / `impactFields` / `scoreDots` draw the box, composed for the route in `app/lib/detail.server.ts`. The quality bar is in [STANDARDS.md](STANDARDS.md) §4 (worked exemplars: `national-preferences`, `global-incentives`).

**"What is this?" link.** Every grid page (AGI + Human) has a `What is this?` link in the `.controls` row (`app/components/Controls.tsx`) to the standalone `/theory-of-change` route, which explains what the project is, why it's needed, and the staged theory of change (research/design → pairing the right people → prototypes/pilots → uptake → diffusion). Its content comes from `data/theory-of-change.md`.

**Vision-tagged design challenges.** Append `{vision: <id>}` to a design challenge's `###` heading (e.g. `### Lay review panels on the jury-duty model {vision: fidelity}`) to attach it to a vision. Tagged design challenges are hidden by default and revealed only when that vision is toggled on — on the cell detail page and in the design-challenges aggregate (where they're grouped under the vision's label). Untagged design challenges are the cell's required briefs and always show. The tag is parsed in `app/lib/markdown.ts` (`parseVisionTag` / `extractProblemSets` / `wrapProblemSets`) — the single source of truth.

On a cell detail page the vision toggle bar sits at the top of the `## Design Challenges` section (the only content a vision changes on that page), and lists only the visions this cell's design challenges actually use — a cell with no vision-tagged briefs shows no bar. `renderVisionToggleBar(onlyIds)` / `visionTagsInBody` in `app/lib/markdown.ts` compute and place it; the toggle client wiring lives in `app/root.tsx` + `app/lib/visions.ts`, threaded through the shared `?visions=` URL param + localStorage state, so flipping it here also updates the grid selector and the design-challenges aggregate.

### Why these particular sections

- **At a glance** is the cell's elevator pitch — three H3 subsections (`Coordination challenge`, `Examples`, `How AGI breaks them`). Pulled out of the body at render time and shown as the styled summary box at the top of the detail page; the section itself is stripped from the inline body so it doesn't render twice. Keeps everything in markdown so inline `{>> ... <<}` editorial notes work here too.
- **Human-grid history** lives only in `data/human-institutions.json`. Add a new record rather than rewriting an accumulated label when a later institution enters a cell. Choose the timeline `era` that controls when it appears and supply a more specific `since` date for display.
- **How humans solve this today** anchors readers in something familiar before the AGI-specific design problem hits. Always concrete (named institutions, named mechanisms), never generic ("humans cooperate by…").
- **Where AGI breaks it** is the load-bearing section: it states the specific ways the existing mechanism fails when one party is autonomous. It should be paragraph versions of the At a Glance `How AGI breaks them` bullets, in the same order, with no intro paragraph and no scenario prose. Resist anthropomorphism — agents are different institutional actors, not defective humans; don't write that they "fail to feel," "lack shame," or "miss the felt sense of." When a mechanism could apply to agents but with different objects (e.g. contractualist reasoning over agent counterparties whose training/principals/constraints are what's being modeled, not their reactions), name that explicitly rather than declaring the mechanism broken.
- **Design Challenges** turn selected mechanisms into design work. Each design challenge contains its own `**Scenario.**`, `**Challenge:**`, optional `**Evaluation.**`, and `**Design choices the team must take a position on.**` Scenarios are high-stakes test objects, not a detached section. Challenge is the design task in one or two sentences; Evaluation (when present) names what separates strong from weak proposals. Strong design challenges can target formation, transmission, application, enforcement, appeal, revision, ratification, accountability, allocation, or evidence.
- **Design choices** force the team to take positions on 3–5 specific forks any answer must address. If you can't list them, the brief is still a topic, not a problem.

### Voice

Rigorous, not bombastic. Don't claim "load-bearing" without showing why. Don't reach for rhetorical flourish ("the trader's chill," "the silhouette of disaster," "felt cost"). Don't anthropomorphize agents — when you find yourself writing about what an agent "feels," "lacks the sense of," or is "embarrassed by," stop and instead name the structural property of the human institution that doesn't apply to agents. The reader is a serious institutional designer; the prose should read as sober analysis, not as advocacy.

### Status field

`status:` tracks where each cell sits in the writing pipeline. Nine values, in order:

- `not_started` — placeholder; no frontmatter content yet. Faint gray corner marker.
- `summary_draft` — the `## At a glance` section (Coordination challenge / Examples / How AGI breaks them) is drafted, ready for review.
- `summary_needs_work` — reviewer has flagged the summary; specifics live in inline editorial notes (`{>> ... <<}`) in the body. Orange marker.
- `summary_ok` — summary box reviewed and OK.
- `body_draft` — body sections (`## How humans solve this today`, `## Where AGI breaks it`, `## Design Challenges`) are drafted, ready for review.
- `body_needs_work` — reviewer has flagged the body; specifics live in inline editorial notes (`{>> ... <<}`). Red marker.
- `body_ok` — body reviewed and stable. Solid green marker.
- `expert_selected` — body is done and an expert reviewer has been named (`expert:` frontmatter). Blue marker. The Kanban requires an expert name to enter this stage.
- `expert_reviewed` — the named expert has reviewed the cell. Dark-green marker.

`body_ok` and the two `expert_*` stages all count as "published" — the deployed site shows their bodies and the AGI grid marks them done.

The corresponding CSS classes use hyphens (`status-not-started`, `status-summary-draft`, `status-summary-needs-work`, `status-expert-selected`, `status-expert-reviewed`, etc.).

### Inline editorial notes

Reviewers leave feedback inline using `{>> note text <<}` markers anywhere in the body. The app transforms them into `<span class="editorial">…</span>` (`processEditorial` in `app/lib/markdown.ts`). They are hidden on the deployed site by default and revealed on `localhost` / `127.0.0.1` or when `?editorial` is in the URL (an inline early script in `app/root.tsx` sets the `show-editorial` flag). The Kanban counts the markers per cell and shows a `✎ N` badge on the card when a cell has any. Multi-line notes are supported (the regex is `\{>>[\s\S]*?<<\}`). To address a note, edit the prose and delete the marker.

### Owner field

`owner:` is one of `oliver`, `joe`, `ryan`, or `none` (unassigned). Used by the Kanban page filter and the per-card "Assign to" popup. New cells start as `none`.

### Expert field

`expert:` is free text naming the expert reviewer. It is optional in general, but **required once `status` reaches `expert_selected` or `expert_reviewed`** — the Kanban prompts for it when you drag a card into an expert column, and the PATCH endpoint rejects an expert stage with no expert. It renders as a `👤` pill on the card (click to edit) and is cleared from frontmatter when set empty.

## Skills

Repo-local skills live in `skills/`. The current project skill is `skills/institution-cell-dialogue`, a conversational workflow for revising one institution cell and codifying reusable lessons. To make slash or dollar skill invocation discover it in Codex, install or symlink it into `$CODEX_HOME/skills/institution-cell-dialogue` (usually `/Users/joe/.codex/skills/institution-cell-dialogue`) and start a new Codex thread so the skill registry refreshes.

## Repo layout

- `app/` — the React Router v8 app
  - `app/root.tsx`, `app/routes.ts`, `app/routes/*` — document shell + route modules (loaders / actions / components)
  - `app/lib/*` — shared logic: `constants.ts`, `markdown.ts` (pure parse/extraction + HTML builders), `render.server.ts` (marked), `content.server.ts` (bundled-content access), `detail.server.ts`, `curriculum.server.ts` + `curriculum-init.ts`, `visions.ts`, and the DB layer `db.server.ts` / `researchers.server.ts` / `admin.server.ts`
  - `app/components/*` — `Grid`, `CellDetail`, `Controls`, `ResearcherCard`
  - `app/styles/` — `legacy.css` (the ported stylesheet, a shrinking bridge) + `overrides.css`; `app/app.css` wires Tailwind + the cascade layers (legacy sits below Tailwind's utilities)
- `data/` — content (cells, methods, `curriculum.md`, `theory-of-change.md`, `curriculum-map.yaml`), bundled into the build
- `public/` — static assets (favicons, `robots.txt`, `sitemap.xml`, `llms.txt`)
- `scripts/kanban.js` + `scripts/kanban.css` — local editorial Kanban (not deployed)
- `vite.config.ts`, `react-router.config.ts`, `tsconfig.json`, `vercel.json` — build / deploy config
- `skills/` — repo-local Codex skills for this project
- `AGENTS.md` / `CLAUDE.md` — kept in sync for tools that look at either file
