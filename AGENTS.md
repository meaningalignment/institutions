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

- `data/cells/{row}-{col}.md` — canonical cell. The H1 becomes the AGI grid summary and the detail-view title. The optional `human_label:` frontmatter field becomes the Human grid summary (and the Human-tab detail title). The body is the detail content for both tabs.
- `data/fidelity/{row}-{col}.md` — separate content for the Fidelity tab. Same schema as `data/cells/` but rendered standalone.
- `data/methods/{col}.md` — column-level reference (textbooks, tutorials, key concepts) shared across all three tabs. Frontmatter declares which method tags appear in the grid's methods row and whether they're bolded per tab. Methods content shows as a right-side rail on each detail page.

## Cell schema

Every file in `data/cells/` follows this structure. The build doesn't enforce it, but `extractProblemSets` keys off `## Problem Sets` and the per-problem `###` heading, so deviating from those names breaks the problem-sets aggregator. The grid uses frontmatter `status` to choose a marker variant (sketch / draft / ready); cells with no status get no marker.

```markdown
---
human_label: Social conventions       # optional; Human-grid summary + Human-tab detail title. Falls back to H1.
subtitle: {one-liner framing the challenge this cell's institutions address.}   # optional; renders under the detail title.
human_subtitle: {Human-tab override for subtitle.}                              # optional; falls back to subtitle on the Human tab.
status: ready                          # sketch | draft | ready. Drives grid marker. Optional.
related: [group-norms]                 # optional; reserved for future cross-linking.
---

# {AGI summary — H1, used as the AGI grid label and the AGI detail-view title}

## How do humans solve this today?

### Examples

- {4–8 named institutions, conventions, or mechanisms — short noun phrases, not sentences.}

{1–3 paragraphs naming the actual existing institution(s) — not generic theory.
End with a vivid micro-scenario, introduced by "A vivid case:".}

## Where AGI breaks it

{1–3 numbered failure modes (1., 2., 3.) describing specifically how the human
mechanism fails when one or more parties is an autonomous AI agent. Pure
failure-mode analysis — no scenario lives here.}

## Scenarios

{The vivid AGI scenario(s) showing the breakdown. Single scenario as prose;
multiple scenarios as ### subheadings.}

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

- **How do humans solve this today?** anchors readers in something familiar before the AGI-specific design problem hits. Always concrete (named institutions, named mechanisms), never generic ("humans cooperate by…").
- **Where AGI breaks it** is the load-bearing section: it states the specific ways the existing mechanism fails when one party is autonomous. Failure modes are concrete and enumerated; this is not the place for generic "AI is different."
- **Scenarios** illustrate the breakdown with vivid, named-person, named-situation prose. Concrete enough to test design proposals against; broad enough to generalize.
- **Anchor contexts** keep proposals testable against real scenarios while signaling they should generalize beyond them.
- **The gap** forces the brief to name an institutional absence ("we lack a procedure by which …") rather than a topic ("AI agents need to negotiate").
- **Design choices** force the team to take positions on 3–5 specific forks any answer must address. If you can't list them, the brief is still a topic, not a problem.
- **Success criterion (stress tests)** lets reviewers evaluate proposals against a shared standard rather than each importing their own.
- **Deliverable** keeps the conversation from staying at "this is an important problem."

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
