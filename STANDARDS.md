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

This form is a diagnostic, not a mandate to make the sentence legalistic or over-specified. If the familiar name of the institution-family is already doing useful work, preserve it and make the friction visible in plain language.

### 1.2 Examples

Use three to five named human institutions, proper nouns, or recognizable named practices. The Examples list is not for statistics, generic social facts, broad domains, or abstract mechanisms.

Good examples have this shape:

- Named institution
- Named practice
- Recognizable market channel or institutionalized transaction pattern, such as job markets, consumer markets, or discretionary spending, when that is the actual mechanism the cell is about
- Recognizable everyday practice that carries the institution in ordinary life
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

Do not over-formalize the examples just to make them sound institution-like. "Email etiquette" may be better than a narrower formal substitute when the cell is about tacit social coordination and the everyday practice is the point.

When a fact or statistic is tempting as an example, usually move it into `How AGI breaks them` or the body as a baseline that the institution has historically produced. The example should name the practice or institution; the statistic should help explain what changes when the mechanism breaks.

### 1.3 How AGI breaks them

Use roughly three to six short bullets. Each bullet should tie an agent-era property or institutional change to a specific mechanism failure in the examples. These bullets are the compressed outline for `## Where AGI breaks it`; the body section should expand them in the same order, not introduce a second taxonomy.

Respect the order of the final summary bullets. If a user revises the summary, treat that as a substantive taxonomy change and redraft `## Where AGI breaks it` around the new sequence rather than preserving a previous analytical order.

Strong bullets:

- Name one failure mode, not a cluster joined by "and."
- Name the broken institutional assumption, not only the visible exploit. "Agents can flood the queue" is weaker than "review attention becomes the scarce resource and submission records become strategic inputs."
- Stay at the mechanism level: formation, transmission, enforcement, representation, ratification, appeal, revision, allocation, review, or accountability.
- Use uncertainty when the claim is empirical or capability-dependent: "may," "likely," "can," "could."
- Point to the institution or mechanism that has to adapt, not just to an implementation fix.
- Include system-level failures when they are the point: speed, scale, diversity, opacity, delegation, or principal lag can break institutions even if individual agents are capable.
- Read as complete sentences.

Failure patterns to avoid:

- **Conflation.** One bullet hides multiple distinct failure modes whose fixes would differ.
- **Exploit lists.** The bullets list agent tricks (sybils, speed, spam, arbitrage) without naming which human assumption made the institution work before.
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

**Pick the right form for a layered stack.** Numbered mini-paragraphs are not the default. For a stack of related instruments where each is doing a different job in the same system, prefer a short intro sentence followed by a bulleted list with bolded labels. Each bullet should be roughly **what it does** + **what it trades**, in one or two sentences. Reserve numbered-mechanism prose for cases where the mechanisms genuinely depend on each other in sequence or where the derivation across them needs continuous text. When in doubt, write it as bullets and only expand to prose if the bullets won't carry the meaning.

**Name the tradeoffs between mechanisms.** When the human side is a stack, the cell often turns on the fact that the instruments make different tradeoffs — fast vs. durable, representative vs. resolutional, high-fidelity vs. slow, cheap vs. gameable. The reader should be able to see why no single instrument is sufficient. This is distinct from naming the secondary pressures each instrument creates; it is about the relationship across the stack.

**Ask what pressures the mechanism created.** A human institution often does more than its most visible output. Job markets do not only distribute income; they can force employers to compete for cooperation, invest in human capital, and answer to worker values. Consumer markets do not only move goods; they can make production answer to household demand. Break analysis should name these secondary pressures when they are part of what made the institution work.

**Choose the right domain anchor.** Use a specific domain when it makes mechanisms visible. Stay cross-domain when the institution genuinely works across domains.

**Use named examples sparingly.** One named example per mechanism is plenty, only where it adds vividness. Do not double-anchor with multiple examples per clause, and do not repeat the same example across mechanism labels and the vivid case. The vivid case carries the weight; the mechanism labels do not need their own example apparatus.

**Close with a vivid case.** The case should show the mechanisms operating together in a named situation. It is not decorative; it is the concrete object the rest of the page can test against.

Vivid does not mean fully narrated. A compact case can be enough when it gives named parties, the relevant relationship, and two or three concrete norms that make the mechanism visible. Save high-stakes narrative detail for problem-set scenarios.

### 2.3 Where AGI breaks it

**Expand the At a Glance bullets.** Treat each `How AGI breaks them` bullet as the topic sentence for one paragraph or numbered item in `Where AGI breaks it`. Start each paragraph with the exact or lightly edited bullet text in bold, then continue with the derivation. The body can add institutional detail and caveats, but it should not surprise the reader with a new failure taxonomy.

Expansion should usually be compressed derivation, not a mini-essay. If the summary has already named the failure clearly, the paragraph only needs enough mechanism to show why the failure follows and what institutional assumption breaks.

**Lead with the assumption that breaks, not the agent capability.** The strongest derivation paragraphs follow the shape: human institution X assumes Y → agents make Y false → therefore the mechanism stops working. Resist starting with what agents can do; start with what the human institution silently relied on, then say why agents falsify it. This makes the breakdown analytical rather than a list of agent capabilities.

**Do not restate the bullet as a conclusion.** Ending a paragraph by re-asserting the bolded bullet ("therefore the mandate vocabulary is too coarse") is a tell of padding. The derivation should leave the conclusion in place; if the reader needs it restated, the middle of the paragraph isn't doing its job.

**Name the relevant agent properties inside the expansions.** Each paragraph should explain why a human mechanism no longer transmits, binds, represents, restrains, revises, allocates, or resolves in the same way. Mention the relevant structural properties where they matter, but do not begin the section with a separate preamble.

**Thread the mechanism labels.** If the human section uses numbered mechanism labels, the breaks section should use the same labels or visibly corresponding ones. The selected problem sets should then pick from that same mechanism list.

**Say when a mechanism transposes.** Some human mechanisms do not simply fail. They may still apply, but over different objects, with different evidence, authority, timing, or accountability.

**Avoid anthropomorphism.** Agents are different institutional actors, not defective humans. Name structural properties instead of implying that agents lack human feelings or social intuitions.

**Keep the tone sober.** No rhetorical flourish, no "load-bearing" claim without showing the load, no dramatic phrasing that asks the reader to be impressed before the mechanism is clear.

**Em dashes sparingly.** Prefer parentheses, commas, or a new sentence. One em-dash per paragraph is a soft cap; more than two in adjacent sentences is a tell of unrevised draft prose.

### 2.4 Analytical core checklist

Before moving on, check:

- The human section names actual institutions and practices.
- The mechanism list is neither forced nor flattened.
- For layered stacks, the form is bullets with bolded labels (what it does + what it trades), unless prose is genuinely warranted.
- The tradeoffs across the stack are visible: the reader can see why no single instrument is sufficient.
- Examples are used sparingly — one per mechanism at most, only where they add vividness.
- The vivid case demonstrates the listed mechanisms.
- The AGI section starts directly with the expanded At a Glance bullets.
- The AGI-breaks body expands the At a Glance bullets in order.
- Each derivation leads with the human assumption that breaks, not the agent capability.
- No paragraph ends by restating its bolded bullet as a conclusion.
- The AGI-breaks body does not reintroduce bullets or capacities the final summary deliberately removed, unless the problem set later needs them and the text explains why.
- Each failure names the relevant agent properties and maps to a human mechanism.
- Mechanism labels are stable across sections.
- No scenarios have leaked into "Where AGI breaks it."
- No anthropomorphic claims carry the analysis.
- Em-dash usage stays sparing.

---

## 3. What makes good Problem Sets

Problem sets turn analysis into design work. They should make the reader want to build a procedure, not merely agree that a problem exists.

There is no separate `## Scenarios` section. Scenarios live inside problem sets, where they serve as high-stakes test objects for the design work.

Choose problem sets after the At a Glance bullets and `Where AGI breaks it` section have stabilized. If the framing changes, re-audit the problem sets; old briefs often keep solving the previous version of the page.

Each problem set needs:

- **Scenario.** A high-stakes example of the target coordination mechanism or institution working, failing, or needing to be rebuilt. Fold necessary context and stakes into this paragraph. Use plain language even when the scenario is domain-grounded.
- **Challenge:** The design task and deliverable, in one or two sentences. Prefer "Design a procedure by which..." over "We lack a procedure by which...". Keep this tight; the rubric belongs in Evaluation.
- **Evaluation.** *Optional.* One or two sentences naming what separates strong proposals from weak ones — the standard the forks get judged against. Skip when the Challenge already makes the standard obvious; include when there are non-obvious constraints (sits inside existing constitutional order, robust to manipulation, must compose with X, etc.).
- **Design choices.** Three to five forks. Each fork should show the available choices, not merely name a topic.

Good scenarios:

- Name the coordination mechanism or institution the team is supposed to design.
- Show a high-stakes case of that mechanism working, failing, or needing to be rebuilt.
- Name concrete institutions, roles, and consequences.
- Give the design team a test object: the proposed institution should make this scenario come out right.
- Make the stakes clear: who gets harmed, what breaks, or what loss becomes possible.
- Cut any detail that isn't load-bearing for the design forks or for making the stakes clear.
- Stay short enough that the challenge and design choices remain the center of the brief — usually three to five sentences.

Good challenges:

- Name the missing or inadequate institutional procedure.
- Include the deliverable inside the challenge.
- Stay tight — one or two sentences. Move the rubric (what makes a strong vs. weak proposal) into an optional **Evaluation.** paragraph that follows the Challenge.
- Add an Evaluation paragraph when the standard is non-obvious — for example, must sit inside an existing legal order, must remain robust under manipulation, must compose with another mechanism. Skip it when the Challenge already implies the standard.

Good problem-set selections:

- Cover the most important rebuilds implied by the AGI-breaks bullets.
- Do not merely mirror every bullet one-for-one.
- Include formation conditions when they are the core gap: sometimes the design problem is not that a norm, protocol, or commitment will be violated, but that it will not form, transmit, or become inspectable unless the setup makes that possible.
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
- The selected problem sets cover distinct institutional capacities: formation, transmission, application, enforcement, appeal, revision, ratification, accountability, allocation, or evidence.
- Every challenge names the design task and deliverable in one or two sentences.
- Where a non-obvious rubric exists, it lives in an **Evaluation.** paragraph rather than being folded into Challenge.
- Design choices are forks.
- The rubric (in Challenge or Evaluation) is specific enough that two proposals can be compared against it.
- Deliverables are concrete.

---

## Final review checklist

Run this once the cell feels close:

- The H1 names the AGI-era gap, not just the topic. **Do not change the H1 of an existing cell unless the user explicitly asks you to** — the H1 is the cell's identity, used as the AGI-grid label and the detail-view title, and authors rely on it being stable.
- `human_label` names the existing human institution-family.
- `status:` reflects the current Kanban stage.
- At a glance stands alone.
- The body follows the right variant: layered or single-mechanism.
- Mechanism names thread through humans, AGI breaks, and the selected scenario/problem-set briefs.
- The analysis is specific, non-anthropomorphic, and institutionally concrete.
- The problem sets are usable by a group in roughly one hour.
- The page teaches a designer what has to be rebuilt.
