# Cell Standards

The principles and checklist for cells in `data/cells/`. CLAUDE.md / AGENTS.md own the schema mechanics (frontmatter format, section headings, build behavior); this file owns the quality bar.

## Principles

These are what we landed on after working through dyadic-incentives, group-norms, group-thick-commitments, and community-rights together.

### 1. The H1 names the gap, not the topic.

"Procedural justice at AI speed" beats "AI judges and adjudication." "Professional norms for agents" beats "Agent norm intuition." `agents_label` mirrors H1 — both short, parallel to the human institution-family name in `human_label`.

### 2. Layer the anchor when the institution-family is plural.

When humans solve the problem through several distinct mechanisms (4–5 layered practices), enumerate them by number in "How humans solve this today." When there's one institutional answer (e.g., contracts), single-paragraph is fine. Don't force-layer or force-flatten.

### 3. The anchor is concrete and named.

Specific institutions (FINRA, CFA, Hippocratic oath, small-claims court, Médecins Sans Frontières Charter), specific people in the vivid case (Sarah, Iris, Maggie), specific norms ("we don't get bigger than the market in any one name"). Industry-anchored where it sharpens — finance for group-norms, mission-driven nonprofits for group-thick-commitments.

### 4. The vivid case demonstrates the mechanisms.

End "How humans solve this today" with a named-person, named-situation case that shows the layered mechanisms in action.

### 5. "Where AGI breaks it" opens with named differences.

3–5 differences between the agent case and the human case. Split labeled when both apply:
- **Agent properties**: tireless, autonomous, re-instanceable, no personal stake, no felt cost, perfect recall.
- **Context properties**: behavior shaped by developer/platform instrumentation, dispute-flow at AI speed, etc.

### 6. Per-mechanism failures derive from the named differences.

Each failure bullet cites *which* differences cause it. Reader can trace failures back to named differences and forward to rebuilds. No re-stipulation per bullet.

### 7. Mechanism labels match across sections.

The numbered mechanisms in the anchor reappear with the same names in breaks-it, scenarios, and problem sets. Reader threads them.

### 8. No anthropomorphism.

Don't write that agents "fail to feel," "lack shame," or "miss the felt sense of." When a mechanism could apply with different objects — contractualist reasoning over agent counterparties' training/principals/constraints rather than humans' reactions — say so explicitly rather than declaring the mechanism broken.

### 9. Scenarios are rebuilds, not failure scenes (for layered cells).

For cells with layered anchors: Scenarios is a numbered survey of how each mechanism could be rebuilt for agents, one sketch per mechanism, each a starting point not a worked design. Each rebuild is an institutional response to the named differences, not "the agent gets a fake version of the human capacity."

For single-mechanism cells: Scenarios stays as a vivid AGI breakdown scene.

### 10. Problem sets are mechanism-focused rebuilds.

2–3 per cell. Each picks ONE mechanism from the anchor and frames the design challenge of rebuilding it for agents. Avoid the omnibus "design the whole adjudication procedure" form.

Each problem set:
- Gap stated as "We lack X by which..."
- 5 design forks, each phrased as a fork (options listed), not a topic
- 5 stress tests, specific to the cell's scenarios
- Concrete deliverable (a spec, a template, a sample with worked example)
- Often a "name which provisions have no analogue in the human institution" prompt

### 11. Voice: rigorous, not bombastic.

Specific over generic. No rhetorical flourish ("the trader's chill," "the silhouette of disaster"). No "load-bearing" claims without showing why. The reader is a serious institutional designer; the prose reads as sober analysis, not advocacy.

## Cell quality checklist

Run this against any cell before declaring it done.

```
□ Frontmatter
  □ agents_label set
  □ human_label set

□ H1
  □ Gap statement, not topic
  □ Parallel to agents_label, short

□ How humans solve this today
  □ Layered (if institution-family is plural) OR single-paragraph (if one mechanism)
  □ Specific named institutions / practices / people (not generic theory)
  □ Industry-anchored where it sharpens
  □ Closes with vivid case (named person, named situation)
  □ Layered case demonstrates the load-bearing composition

□ Where AGI breaks it
  □ Opens with 3–5 named agent-vs-human differences
  □ Differences split labeled (agent property / context property) if both apply
  □ Per-mechanism failures derive from differences, each citing which
  □ Mechanism labels match anchor
  □ No anthropomorphism
  □ Mechanisms that apply with different objects: noted explicitly

□ Scenarios
  □ Layered cell: rebuild sketches, one per mechanism
  □ Single-mechanism cell: vivid AGI failure scene
  □ Rebuilds are institutional responses, not "fake versions of human capacity"
  □ Concrete institutional shapes named

□ Problem Sets
  □ 2–3, each picks one mechanism from anchor
  □ Gap: "We lack X by which..." form
  □ 5 design forks, phrased as forks (options listed)
  □ 5 stress tests, specific to the cell
  □ Concrete deliverable, often with "no-analogue" prompt
  □ Anchor contexts include human-affected + agent-affected variants where applicable

□ Voice
  □ No rhetorical flourish
  □ No "load-bearing" without showing why
  □ Specific over generic
  □ No anthropomorphism

□ Cross-section coherence
  □ Mechanism names thread anchor → breaks-it → scenarios → problem sets
  □ Same numbered ordering across sections
```

## Open questions

These are the parts of the standard not yet decided. Each is a candidate for a future iteration.

1. **Status taxonomy.** Currently no status field is set on any cell. The taxonomy could mark "meets standard / partial / not yet" tied to the checklist; or something more substantive (confidence in framing, anchor quality, problem-set teachability).

2. **Glossary of common agent properties.** Tireless, autonomous, re-instanceable, no personal stake, no felt cost, perfect recall, behavior shaped by developer instrumentation — these recur across cells. A reference page (similar to `data/methods/`) would let cells link instead of re-defining and prevent drift.

3. **Right number of problem sets.** Settled informally on 2–3. Worth making explicit.

4. **One-mechanism cell variant.** dyadic-incentives is the exemplar — single-paragraph anchor, no enumeration. Worth documenting the form as a permissible variant.

5. **Cross-cell connections.** Some problem sets in one cell solve a piece of another cell. Whether to add `related:` references and how to surface them in the UI.

6. **Where the "human failure scene" lives in layered cells.** The Maggie account-freeze scene (community-rights's pre-rebuild Scenarios body) was good. In the rebuild-sketches form, that vivid AGI failure scene loses its slot. Whether it should have its own slot, fold into breaks-it, or be cut.

7. **When industry-anchoring helps.** Finance for group-norms made the cell sharper. For other cells, the right anchoring industry isn't obvious. A guidance line on choosing.
