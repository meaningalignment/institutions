# Cell Standards

Work through a cell in this order:

1. **At a glance** - the summary box: Coordination challenge / Examples / How AGI breaks them.
2. **How humans solve this today / Where AGI breaks it** - the analytical core.
3. **Problem Sets** - scenario-grounded design briefs.

Each stage should tighten the next one: the summary names the institutional family, the body explains the mechanisms, and the problem sets turn selected scenarios into design work.

---

## 1. What makes a good "At a glance" section

The summary box has to stand alone. A reader who sees only the three subsections should understand the coordination problem, the existing human institutions or practices, and why autonomous agents put pressure on them.

### 1.1 Coordination challenge

Use one sentence in the form: **How [parties] [verb] [object/outcome] [under friction]**.

Each element should be doing work:

- **Parties.** Who is being coordinated.
- **Verb.** The coordination act.
- **Object.** What gets coordinated.
- **Friction.** Why the coordination is hard or cannot be solved unilaterally.

### 1.2 Examples

Use three to five named human institutions, proper nouns, or recognizable named practices. The Examples list is not for statistics, generic social facts, broad domains, or abstract mechanisms.

Good examples have this shape:

- Named institution
- Named practice
- Named forum or procedure
- Named rule family or code
- Named canonical case, if cases are part of how the institution teaches itself

Bad examples have this shape:

- A statistic
- A vague sector or issue area
- A general social fact
- A future design proposal
- A failure mode rather than a human institution

Use a domain anchor when it makes the mechanism visible. Do not anchor in a domain merely for color; the domain should supply named institutions, roles, cases, or procedures the body can use.

### 1.3 How AGI breaks them

Use roughly three to six short bullets. Each bullet should tie an agent-era property or institutional change to a specific mechanism failure in the examples. These bullets are the compressed outline for `## Where AGI breaks it`; the body section should expand them in the same order, not introduce a second taxonomy.

Strong bullets:

- Name one failure mode, not a cluster joined by "and."
- Stay at the mechanism level: formation, transmission, enforcement, representation, ratification, appeal, revision, allocation, review, or accountability.
- Use uncertainty when the claim is empirical or capability-dependent: "may," "likely," "can," "could."
- Point to the institution or mechanism that has to adapt, not just to an implementation fix.
- Include system-level failures when they are the point: speed, scale, diversity, opacity, delegation, or principal lag can break institutions even if individual agents are capable.
- Read as complete sentences.

Failure patterns to avoid:

- **Conflation.** One bullet hides multiple distinct failure modes whose fixes would differ.
- **Topic-level stakes.** The bullet says the problem matters, but not what institutional mechanism breaks.
- **Unsupported certainty.** The bullet predicts capabilities or adoption patterns too confidently.
- **Premature rebuilds.** The bullet names a proposed fix before naming the failure that makes the fix necessary.

### 1.4 At a glance checklist

Before moving on, check:

- The coordination challenge is one sentence, not a topic label.
- The examples are named institutions or practices.
- The AGI-breaks bullets are mechanism-level and paired roughly with the examples.
- The AGI-breaks bullets outline the body section below.
- The summary can be understood without the body.
- The prose is spare enough to survive in the grid.

---

## 2. What makes good "How humans solve this today" / "Where AGI breaks it"

These sections are the analytical core. The goal is not to summarize a field. The goal is to name the human institution-family concretely enough that a reader can see what has to be rebuilt for agents.

### 2.1 Ideal body format

For layered cells, use this shape:

1. **How humans solve this today.** Open with the concrete human setting. Enumerate the mechanisms with stable names and numbers. Close with a vivid case introduced by "A vivid case:".
2. **Where AGI breaks it.** Write paragraph versions of the At a Glance AGI-breaks bullets, in the same order. Do not add an intro paragraph and do not put scenarios here.
3. **Problem Sets.** Pick two or three of the most important rebuilds and turn them into scenario-grounded design briefs.

For single-mechanism cells, do not force a numbered list. A single layered paragraph may be cleaner. The scenario still lives inside the problem set, as the concrete case the design has to survive.

### 2.2 How humans solve this today

**Anchor in named institutions, not generic theory.** Name the actual institutions, roles, procedures, cases, and practices humans use today.

**Layer when the institution-family is plural.** Some coordination challenges have one main human answer. Others work through several mechanisms in composition. Name the layers once and keep the names stable.

**Choose the right domain anchor.** Use a specific domain when it makes mechanisms visible. Stay cross-domain when the institution genuinely works across domains.

**Close with a vivid case.** The case should show the mechanisms operating together in a named situation. It is not decorative; it is the concrete object the rest of the page can test against.

### 2.3 Where AGI breaks it

**Expand the At a Glance bullets.** Treat each `How AGI breaks them` bullet as the topic sentence for one paragraph or numbered item in `Where AGI breaks it`. The body can add derivation, institutional detail, and caveats, but it should not surprise the reader with a new failure taxonomy.

**Name the relevant agent properties inside the expansions.** Each paragraph should explain why a human mechanism no longer transmits, binds, represents, restrains, revises, allocates, or resolves in the same way. Mention the relevant structural properties where they matter, but do not begin the section with a separate preamble.

**Thread the mechanism labels.** If the human section uses numbered mechanism labels, the breaks section should use the same labels or visibly corresponding ones. The selected problem sets should then pick from that same mechanism list.

**Say when a mechanism transposes.** Some human mechanisms do not simply fail. They may still apply, but over different objects, with different evidence, authority, timing, or accountability.

**Avoid anthropomorphism.** Agents are different institutional actors, not defective humans. Name structural properties instead of implying that agents lack human feelings or social intuitions.

**Keep the tone sober.** No rhetorical flourish, no "load-bearing" claim without showing the load, no dramatic phrasing that asks the reader to be impressed before the mechanism is clear.

### 2.4 Analytical core checklist

Before moving on, check:

- The human section names actual institutions and practices.
- The mechanism list is neither forced nor flattened.
- The vivid case demonstrates the listed mechanisms.
- The AGI section starts directly with the expanded At a Glance bullets.
- The AGI-breaks body expands the At a Glance bullets in order.
- Each failure names the relevant agent properties and maps to a human mechanism.
- Mechanism labels are stable across sections.
- No scenarios have leaked into "Where AGI breaks it."
- No anthropomorphic claims carry the analysis.

---

## 3. What makes good Problem Sets

Problem sets turn analysis into design work. They should make the reader want to build a procedure, not merely agree that a problem exists.

There is no separate `## Scenarios` section. Scenarios live inside problem sets, where they serve as high-stakes test objects for the design work.

Choose problem sets after the At a Glance bullets and `Where AGI breaks it` section have stabilized. If the framing changes, re-audit the problem sets; old briefs often keep solving the previous version of the page.

Each problem set needs:

- **Scenario.** A high-stakes example of the target coordination mechanism or institution working, failing, or needing to be rebuilt. Fold necessary context and stakes into this paragraph. Use plain language even when the scenario is domain-grounded.
- **Challenge:** The design task, success criterion, and deliverable. Prefer "Design a procedure by which..." over "We lack a procedure by which...". Include how the proposed institution will be judged and what the team should produce.
- **Design choices.** Three to five forks. Each fork should show the available choices, not merely name a topic.

Good scenarios:

- Name the coordination mechanism or institution the team is supposed to design.
- Show a high-stakes case of that mechanism working, failing, or needing to be rebuilt.
- Name concrete institutions, roles, and consequences.
- Give the design team a test object: the proposed institution should make this scenario come out right.
- Make the stakes clear: who gets harmed, what breaks, or what loss becomes possible.
- Stay short enough that the challenge and design choices remain the center of the brief.

Good challenges:

- Name the missing or inadequate institutional procedure.
- Include the success criterion inside the challenge.
- Include the deliverable inside the challenge.
- Make clear what counts as a better or worse proposal.

Good problem-set selections:

- Cover the most important rebuilds implied by the AGI-breaks bullets.
- Do not merely mirror every bullet one-for-one.
- Avoid niche rebuilds unless they reveal the cell's core design problem.
- Work as a coherent set: each brief should cover a different institutional capacity.
- Remain open to replacement if a sharper scenario exposes a better design problem.

### 3.1 Problem-set checklist

Before declaring the body done, check:

- Each problem set contains its own scenario.
- Each scenario is a high-stakes test object for the institution the problem set asks the team to design.
- Each scenario is clear to a serious general reader, even when domain-grounded.
- Problem sets pick two or three mechanisms rather than the whole cell.
- The selected problem sets match the final AGI-breaks framing.
- The selected problem sets cover distinct institutional capacities.
- Every challenge names the design task, success criterion, and deliverable.
- Design choices are forks.
- Success criteria are specific enough that two proposals can be compared against them.
- Deliverables are concrete.

---

## Final review checklist

Run this once the cell feels close:

- The H1 and `agents_label` name the AGI-era gap, not just the topic.
- `human_label` names the existing human institution-family.
- `status:` reflects the current Kanban stage.
- At a glance stands alone.
- The body follows the right variant: layered or single-mechanism.
- Mechanism names thread through humans, AGI breaks, and the selected scenario/problem-set briefs.
- The analysis is specific, non-anthropomorphic, and institutionally concrete.
- The problem sets are usable by a group in roughly one hour.
- The page teaches a designer what has to be rebuilt.
