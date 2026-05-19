# Cell Standards

The quality bar for cells in `data/cells/`. CLAUDE.md and AGENTS.md own schema mechanics: frontmatter, section headings, build behavior, Kanban status values. This file owns what makes a cell good.

Work through a cell in this order:

1. **At a glance** - the summary box: Coordination challenge / Examples / How AGI breaks them.
2. **How humans solve this today / Where AGI breaks it** - the analytical core.
3. **Scenarios and Problem Sets** - scenario-grounded design briefs.

Do not treat these as independent chores. Each stage should tighten the next one: the summary names the institutional family, the body explains the mechanisms, and the problem sets turn selected scenarios into design work.

The current body exemplar is [community-norms](data/cells/community-norms.md). Use it as the reference shape for layered cells.

---

## 1. What makes a good "At a glance" section

The summary box has to stand alone. A reader who sees only the three subsections should come away knowing what coordination problem the cell is about, which human institutions currently address it, and why agents threaten those institutions.

### 1.1 Coordination challenge

Use one sentence in the form: **How [parties] [verb] [object/outcome] [under friction]**.

Each element should be doing work:

- **Parties.** Who is being coordinated: two parties, a profession, a community, states.
- **Verb.** The coordination act: hold each other to, allocate, settle on, set expectations.
- **Object.** What gets coordinated: a deal, conduct, a scarce resource, public authority.
- **Friction.** Why coordination is hard: without formal law, without a global enforcer, where neither party can unilaterally enforce.

Good examples:

- "How two parties hold each other to a deal that neither can unilaterally enforce." - [dyadic-incentives](data/cells/dyadic-incentives.md)
- "How a community allocates a shared scarce resource and keeps users from depleting it." - [community-incentives](data/cells/community-incentives.md)
- "How a profession sets expectations its members hold each other to without invoking formal law." - [community-norms](data/cells/community-norms.md)
- "How states settle on expectations of conduct toward each other without a global enforcer." - [global-norms](data/cells/global-norms.md)

### 1.2 Examples

Use three to five named human institutions, proper nouns, or recognizable named practices. The Examples list is not for statistics, generic social facts, or issue areas.

Good examples:

- "Contract law / Escrow services / Letters of credit / Surety bonding" - [dyadic-incentives](data/cells/dyadic-incentives.md)
- "FINRA member conduct rules / CFA Institute Code and Standards / SEC Rule 10b-5 compliance norms / Volcker Rule trading restraints / LTCM and Archegos risk postmortems" - [community-norms](data/cells/community-norms.md)
- "Kidney exchange (NKR) / School-choice matching / Lobster gangs of Maine / Irrigation water boards / Fishery quotas" - [community-incentives](data/cells/community-incentives.md)

Avoid examples like "stable labor share of GDP" or "consumer spending as 70% of GDP." Those may be useful facts for the body, but they are not institutions.

Industry anchoring is often the difference between a generic cell and a usable one. Finance sharpens professional norms because the relevant codes, regulator-anticipation, and disaster canon are named and teachable. Use an industry anchor when it reveals the mechanism; stay cross-cutting when the institution really is cross-cutting.

### 1.3 How AGI breaks them

Use three to five short bullets. Each bullet should tie an agent property to a specific mechanism failure in one of the examples. These bullets are the compressed outline for `## Where AGI breaks it`; the body section should expand them in the same order, not introduce a second list of failures.

Strong bullets:

- Name one failure, not a cluster joined by "and."
- Make the agent property visible: re-instanceable, agent-paced, no career stake, behavior shaped by standing instructions, text retrievable but not active.
- Point to a human mechanism: peer judgment, license discipline, tacit absorption, regulator-anticipation, canon recognition.
- Read as a complete sentence.

Current exemplar pattern from [community-norms](data/cells/community-norms.md):

- "Agents do not pick up a desk's unwritten 'we do not do that' rules just by reading policies."
- "Licenses and discipline reach human professionals and firms, not replaceable agent copies."
- "Agents need an explicit way to flag trades that are legal but would look indefensible to regulators."
- "When both sides use agents, ethics checks have to ask what the human principals would actually endorse."
- "Past disasters only help if agents actively watch for similar patterns in today's portfolios."

Failure patterns to avoid:

- **Conflation.** "AI mediates consumer choice and increasingly is the consumer" hides mediation, principalship, and demand composition.
- **Topic-level stakes.** "If agents do not develop norms, shared resources collapse" names the importance of the topic, not the mechanism that breaks.
- **Unsupported empirical claims.** If the claim is shaky, reformulate around the institutional failure or hedge.
- **Missing mechanisms.** If the Examples list has five layered institutions, the break bullets should not all attack only one layer.

### 1.4 At a glance checklist

Before moving on, check:

- The coordination challenge is one sentence, not a topic label.
- The examples are named institutions or named practices.
- The AGI-breaks bullets are mechanism-level and paired roughly with the examples.
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

**Anchor in named institutions, not generic theory.** "Humans coordinate by shared expectations" is not enough. The community-norms anchor names finance desks, FINRA, the CFA Institute, SEC Rule 10b-5, the Volcker Rule, Goldman/Abacus, LTCM, Lehman, Knight Capital, the London Whale, and Archegos.

**Layer when the institution-family is plural.** Some problems have one main human answer, like contract law for dyadic incentives. Others work through several mechanisms in composition. Professional norms in finance use tacit absorption, codes, regulator-anticipation, contractualist reasoning, and case-based recognition. Name those layers once and keep the names stable.

**Choose the right industry anchor.** Use a specific industry when it makes mechanisms visible. Finance is useful for professional norms; medicine might be better for triage expertise; courts might be better for procedural rights. Do not add an industry merely for color.

**Close with a vivid case.** The case should show the mechanisms operating together in a named situation. It is not an anecdotal flourish; it is the concrete object the rest of the page can test against.

### 2.3 Where AGI breaks it

**Expand the At a Glance bullets.** Treat each `How AGI breaks them` bullet as the topic sentence for one paragraph or numbered item in `Where AGI breaks it`. The body can add derivation, institutional detail, and caveats, but it should not surprise the reader with a new failure taxonomy.

**Name the relevant agent properties inside the expansions.** Each paragraph should explain why a human mechanism no longer transmits, binds, restrains, or recognizes in the same way. Mention the relevant structural properties where they matter, but do not begin the section with a separate preamble.

**Thread the mechanism labels.** If the human section has "1. Tacit absorption," the breaks section should have the corresponding "1. Tacit absorption..." failure. The same labels should appear again in the selected Problem Sets.

**Say when a mechanism transposes.** Some human mechanisms do not simply fail. Contractualist reasoning, for example, can still operate, but over different objects: principals, standing instructions, disclosed constraints, and counterparty agents.

**Avoid anthropomorphism.** Do not say agents "lack shame," "fail to feel," or "miss the felt sense." Name the institutional property instead: no professional membership, no career stake, no social embedding, no license, no local absorption pathway.

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

## 3. What makes good Scenarios and Problem Sets

These sections turn analysis into design work. They should make the reader want to build a procedure, not merely agree that a problem exists.

### 3.1 Scenarios

Scenarios live inside problem sets. A separate `## Scenarios` section tends to split the page into analysis, then speculative rebuild sketches, then design briefs; the better shape is to put the concrete case directly in the brief that uses it.

Each problem set should begin with a short `**Scenario.**` paragraph. Fold the domain context into the scenario instead of using a separate `Anchor contexts` line.

Good scenarios:

- Name the coordination mechanism or institution the team is supposed to design.
- Show a high-stakes case of that mechanism working, failing, or needing to be rebuilt.
- Name concrete institutions, roles, and consequences.
- Use plain language even when the scenario is grounded in a technical domain.
- Give the design team a test object: the proposed institution should make this scenario come out right.
- Make the stakes clear: who gets harmed, what breaks, or what loss becomes possible.
- Stay short enough that the challenge and design choices remain the center of the brief.

### 3.2 Problem Sets

Use two or three problem sets per cell. Each should pick one rebuild problem from the analysis. Avoid an omnibus prompt like "design professional norms for agents"; it is too broad to answer or evaluate.

Each problem set needs:

- **Scenario.** A high-stakes example of the target coordination mechanism or institution working, failing, or needing to be rebuilt. Fold necessary context and stakes into this paragraph.
- **Challenge:** The design task, success criterion, and deliverable. Prefer "Design a procedure by which..." over "We lack a procedure by which...". Include how the proposed institution will be judged and what the team should produce.
- **Design choices.** Three to five forks. Each fork should show the available choices, not merely name a topic.

Strong problem sets often ask the team to identify which provisions have no analogue in the human institution and why. That prompt forces the design past translation.

### 3.3 Scenarios and problem sets checklist

Before declaring the body done, check:

- Each problem set contains its own scenario.
- Each scenario is a high-stakes test object for the institution the problem set asks the team to design.
- Each scenario is clear to a serious general reader, even when domain-grounded.
- Problem sets pick two or three mechanisms rather than the whole cell.
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

## Open Questions

- **Agent-property vocabulary.** Tireless, re-instanceable, no career stake, agent-paced, jurisdiction-portable, behavior shaped by standing instructions, text retrievable but not active: these recur. A shared glossary may eventually prevent drift.
- **Cross-cell links.** Some problem sets solve pieces of other cells. The reserved `related:` field may become useful once more bodies are at `body_ok`.
