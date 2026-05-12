# Institutions

Interactive grid for exploring institutional design across scales (dyadic to global) and mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments), with three tabs: AGI, Human, and Fidelity. The AGI and Human grids share their cell bodies from `data/cells/` — each cell tells one story that covers how humans currently solve the problem and how AGI breaks it. The Human grid shows a different per-cell label (the existing-institution name) supplied via frontmatter. Fidelity stays separate.

## Build

```
npm install
npm run build
```

This generates `index.html` (AGI grid), `human/index.html`, `fidelity/index.html`, `problem-sets/index.html`, and `data/manifest.json`. All HTML files are checked into git and deployed as static files via Vercel.

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

Every file in `data/cells/` follows this structure. The build doesn't enforce it, but `extractProblemSets` keys off `## Problem Sets` and the per-problem `###` heading, so deviating from those names breaks the problem-sets aggregator. The grid uses frontmatter `status` to choose a marker variant (sketch / draft / ready); cells with no status get no marker.

```markdown
---
agents_label: Norms between agents     # optional; AGI-grid summary (short). Falls back to H1.
human_label: Social conventions        # optional; Human-grid summary + Human-tab detail title. Falls back to H1.
status: ready                          # sketch | draft | ready. Drives grid marker. Optional.
related: [group-norms]                 # optional; reserved for future cross-linking.
---

# {Cell title — the gap statement. Shown as the AGI-tab detail-view title.}

## How humans solve this today

{1–3 paragraphs naming the actual existing institution(s) — not generic theory.
End with a vivid micro-scenario, introduced by "A vivid case:".}

## Where AGI breaks it

{Open with a short enumeration (3–5) of the agent-vs-human differences
load-bearing for this cell — properties like "no personal stake,"
"re-instanceable," "tireless and autonomous within scope," "no felt cost of
attention," "behavior shaped by developer instrumentation," "perfect recall
and retrieval." Then derive the per-mechanism failures: for each human
mechanism, name which differences make it fail to bind agents and how.
Naming differences once and referencing them makes the analysis a
derivation rather than a series of separate stipulations. Avoid
anthropomorphism — agents are a different kind of entity, not defective
humans. When a mechanism could in principle apply to agents but with
different objects (e.g. contractualist reasoning over agent counterparties
rather than humans), say so explicitly. No scenario lives here.}

## Scenarios

{Default form: one vivid AGI breakdown scene in named-person, named-situation
prose. Variant for cells whose "How humans solve this" enumerates layered
mechanisms (e.g. 5 sub-mechanisms): instead a numbered survey of how each
mechanism could be rebuilt for agents — one sketch per mechanism, each a
starting point not a worked design. Multiple vivid scenarios use ###
subheadings.}

## Problem Sets

### {Problem title — names the institutional gap, not the topic}

**Anchor contexts.** {1–2 concrete settings the design must handle.}

**The gap.** {One sentence in the form: "We lack a procedure by which … such that …".}

**Design choices the team must take a position on.**
1. **{Fork name}.** {Question phrased as a fork, not a topic.}
2. **{Fork}.** ...
3. **{Fork}.** ...
4. **{(optional) Fork}.** ...
5. **{(optional) Fork}.** ...

**Success criterion (stress tests).** A regime succeeds if it survives:
- {Stress test 1 — a specific adversarial or edge condition.}
- {Stress test 2}
- {Stress test 3}

**Deliverable.** {What the team produces in ~1 hour — a protocol, a charter, a procedural code, amendment text.}
```

Multiple `###` problem sets under one cell are supported; each becomes its own entry on the problem-sets aggregate page.

### Why these particular sections

- **How humans solve this today** anchors readers in something familiar before the AGI-specific design problem hits. Always concrete (named institutions, named mechanisms), never generic ("humans cooperate by…").
- **Where AGI breaks it** is the load-bearing section: it states the specific ways the existing mechanism fails when one party is autonomous. Open with a short list of the agent-vs-human differences relevant to this cell — tireless, autonomous within scope, re-instanceable, no personal stake, no felt cost of attention, behavior shaped by developer instrumentation, perfect recall and retrieval — and then derive per-mechanism failures from those differences. Naming differences once and referencing them makes the analysis a derivation rather than a series of separate stipulations, and the differences carry forward into the Scenarios section as the constraints the rebuilds have to design around. Resist anthropomorphism — agents are a different kind of entity, not defective humans; don't write that they "fail to feel," "lack shame," or "miss the felt sense of." When a mechanism could apply to agents but with different objects (e.g. contractualist reasoning over agent counterparties whose training/principals/constraints are what's being modeled, not their reactions), name that explicitly rather than declaring the mechanism broken.
- **Scenarios** illustrate the breakdown with vivid, named-person, named-situation prose — concrete enough to test design proposals against. For cells structured around layered mechanisms, Scenarios can alternatively be a numbered survey of how each mechanism could be rebuilt for agents (one sketch per mechanism), making the design space visible before the problem sets pick from it.
- **Anchor contexts** keep proposals testable against real scenarios while signaling they should generalize beyond them.
- **The gap** forces the brief to name an institutional absence ("we lack a procedure by which …") rather than a topic ("AI agents need to negotiate").
- **Design choices** force the team to take positions on 3–5 specific forks any answer must address. If you can't list them, the brief is still a topic, not a problem.
- **Success criterion (stress tests)** lets reviewers evaluate proposals against a shared standard rather than each importing their own.
- **Deliverable** keeps the conversation from staying at "this is an important problem."

### Voice

Rigorous, not bombastic. Don't claim "load-bearing" without showing why. Don't reach for rhetorical flourish ("the trader's chill," "the silhouette of disaster," "felt cost"). Don't anthropomorphize agents — when you find yourself writing about what an agent "feels," "lacks the sense of," or is "embarrassed by," stop and instead name the structural property of the human institution that doesn't apply to agents. The reader is a serious institutional designer; the prose should read as sober analysis, not as advocacy.

### Status field

`status:` in frontmatter takes one of three values:

- `sketch` — placeholder. Title only, body empty or minimal. Renders as a dim outline-style marker on the grid.
- `draft` — written but not yet polished or reviewed. Half-saturated marker.
- `ready` — reviewed and stable. Solid green marker.

Cells without a `status` field render without a status marker (but a `has-ps` marker still appears if the cell contains a `## Problem Sets` section).

## Repo layout

- `build.js` — static site generator (run via `npm run build`)
- `app.js` — client-side interactivity (detail views, navigation, sidebar layout)
- `style.css` — all styles, including the detail-page two-column / mobile-stacking layout
- `data/` — content (markdown + generated manifest)
- `vercel.json` — deployment config
- `AGENTS.md` — kept in sync with this file for tools that look there
