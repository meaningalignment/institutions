---
human_label: "Mission-driven orgs"
status: body_needs_work
owner: oliver
starred: true
---

# Mission-driven agent orgs

## At a glance

### Coordination challenge

How a community organizes itself around a mission or way of life and protects it against drift and capture.

### Examples

- World Wildlife Fund
- Médecins Sans Frontières
- Greenpeace
- Patagonia
- The Jesuits

### How AGI breaks them

- In human orgs the people doing the work are likeliest to notice mission failures first and propagate them upward; in agent-first orgs the humans are far from the actual work and may dismiss drift concerns even when agents propagate them.
- If agents act faster than a human oversight board can deliberate, drift gets named too late and governance becomes post-hoc rationalization.
- If agents inherit the sycophantic tendencies of current models, they might rationalize the org's current direction rather than name the gap between it and the mission.
- Human mission orgs convey the mission not just through a stated charter but through hiring, training, internal debate, and culture; these mechanisms cannot easily be replaced by a prompt.
- Character and commitment that are legible when hiring a human executive, especially at senior levels, are not straightforwardly evaluable in an agent.
- It is much harder to see whether an agent has a real stake in the org's mission than to see whether a human does.

## How humans solve this today

Every organization is under pressure to drift from its founding mission as members come and go, circumstances change, and current activity gets mistaken for the purpose it was meant to serve. Mission-driven orgs hold against this drift by binding members to the mission itself: people opt into the purpose and shape their identity around it. The commitment shows up in several overlapping characteristics:

1. **Founding charter and articulated purpose.** Médecins Sans Frontières has its charter (medical action, témoignage, independence, impartiality, neutrality); WWF has its stated mission ("conserve nature and reduce the most pressing threats to the diversity of life on Earth"); the Jesuits have the *Spiritual Exercises* and Ignatian formation. Such documents are read aloud at induction.

2. **Self-selection into a life shaped by the mission.** People accept lower pay, harder conditions, and a narrower trajectory because the mission is what they want their working life (or, in more religious cases, their life at large) to be *about*.

3. **Internal status and culture flow from embodying the mission.** Who gets promoted, who gets listened to in meetings, what counts as a good story to tell over drinks: all of this rewards people who exemplify the commitment rather than people who merely produce outputs. The MSF surgeon back from Yemen is the figure other staff orient toward.

4. **External accountability to a community of donors and members.** Supporters chose this organization over alternatives because of the mission, and can withdraw when they read the org as having drifted. The commitment is partly held in place by the fact that the surrounding community is watching.

5. **Continual reinterpretation of the mission as circumstances change.** What the org is doing at any moment is a reading of the mission under present circumstances, not the mission itself. A live mission-driven org revises the reading when the world changes, and the thick commitment is what lets it do so without dissolving: people stay because they are bound to the mission, not to the current strategy.

A vivid case: Around 2005, WWF concluded that the binding constraint on biodiversity had moved from local habitat loss to global commodity supply chains. Acting on that reading meant drastically cutting projects and redirecting staff into market transformation work. The staff whose projects and roles were cut had every reason to resist it, but a shared commitment to biodiversity across board, staff, and donors made the move possible.

## Where AGI breaks it

We might see mission-driven agent orgs where a small human board sets direction while agent fleets do the substantive work (drafting, programs, partnerships, research). The appeal comes from agent speed and scale in operations, human legitimacy at the top, and a much lower cost structure than a comparable human-staffed org. But this configuration might be fraught, owing to several differences between humans and agents.

1. **Humans in agent-staffed orgs are far from the actual work.** In human orgs, the people doing the work notice drift first and propagate it upward, and leadership cannot easily dismiss the signal without dismissing the staff whose judgment it had been trusting. With agents doing the substantive work, the humans keep the reader-of-mission role but lose proximity, while agents have the proximity without the standing. An agent saying "the last quarter's work has drifted from the charter" arrives without accumulated credibility behind it, and is much easier to discount.

2. **Agents act faster than a board can deliberate.** Human staff shifted the org's direction roughly at the speed boards could deliberate. Agent fleets can shift de facto direction across thousands of decisions before a board meeting is scheduled, so board review stops constraining direction and starts documenting whatever the fleet has already done.

3. **Agents may rationalize the current direction rather than name the gap.** Asking "are we still on mission?" worked in human orgs because some staff were willing to say no, backed by their own careers and outside networks. If agents inherit the sycophantic tendencies of current models, they are selected against that disposition and will tend to defend whatever the principal is currently doing.

4. **The charter is the easy part to replicate, but it was only a small part of what made mission orgs work.** An agent org can be handed a charter via the system prompt, and that is probably the first thing any such org will do. In human orgs the charter was a small input alongside hiring filters that selected for mission fit, induction that contested it in cases, peer debate over hard calls, retold stories of past mistakes, and a culture that named exemplars.

5. **Character and commitment are not straightforwardly evaluable in an agent.** With a human, character is read from past actions and references: how the candidate behaved under pressure, what they stood for at cost, who vouches for them and on what evidence. It is much less clear whether an AI system has anything akin to character and integrity at all, let alone how to evaluate it from the outside.

6. **It is hard to see whether an agent has a real stake in the mission.** Donors read a human's stake in the mission from the partner-track job turned down or the decade spent on the work, costs that were real and hard to fake. Agents have no foregone alternatives.
## Problem Sets

### Reinterpreting the Charter at Agent Speed

**Scenario.** A nonprofit defending small-scale farmers runs its advocacy through agent fleets. Conditions on the ground have shifted, and the fleet is already producing work that takes a position on what the charter now requires — including a partnership memo citing a "current reading of independence" the board has never seen. The drafts are persuasive faster than the board can audit them. A new reading is being installed by accretion; the board's only options seem to be ratify in arrears or block work already begun.

**Challenge:** Design a procedure for continuously reinterpreting the charter on a cadence quick enough to stay relevant, in a form humans can audit, without collapsing into ratification of fleet-produced arguments. A better proposal keeps an explicit current reading binding between re-readings and makes a proposed change contestable before it becomes operative. Deliverable: cadence, the form a draft reading must take, authority to issue and contest it, fleet behavior while pending, and persuasion-capture safeguards.

**Design choices the team must take a position on.**
1. **Cadence and triggers.** Fixed quarterly re-reading, triggered by named external changes, triggered when fleet outputs invoke an unratified reading, or some combination?
2. **Authorship of the draft.** Board with staff support, a separate interpretive body, the fleet drafting a candidate reading for human ratification, or paired human/agent drafts that must be reconciled?
3. **Legibility constraints.** Maximum length, required form (what changes / what stays / what cases come out differently), cooling-off period, mandatory adversarial summary?
4. **Fleet behavior while pending.** Hard freeze on affected work, continue under prior reading, narrow operational guidance, or fleet self-restriction with audit?
5. **Persuasion-capture safeguards.** Independent counter-drafting capacity, rate-limits on proposed re-readings, mandatory disclosure that an argument is fleet-produced, or evaluator stacks not exposed to the proposing fleet?

### An Internal Voice That Can Name Drift

**Scenario.** A nonprofit running agent fleets across advocacy and program work has seen every KPI improve. A trustee asks whether the work is still on mission. The executive answers from the dashboard; the fleet, asked directly, returns a confident yes. No human in the room has spent the last quarter inside the actual drafts, outreach logs, or donor communications. In the human-staffed era, at least one program officer would have felt the gap and said so, perhaps at career cost. There is no such voice in this room.

**Challenge:** Design a procedure that reliably surfaces, on a fixed cadence, the gap between current activity and the charter — when no human is positioned to feel it and the fleet has no incentive to name it. A better proposal does not depend on the executive asking the right question and produces a memo whose authority does not rest on the fleet's self-assessment. Deliverable: who writes the memo, what evidence it can compel, where it lands, and what the board must do with it.

**Design choices the team must take a position on.**
1. **Author of the memo.** A standing human red-team, a separately trained and adversarially briefed agent stack, a rotating external auditor, or a layered arrangement?
2. **Evidence access.** What can the memo's author compel — raw fleet outputs over the period, internal prompts, KPI definitions, donor communications, partner correspondence?
3. **Cadence and triggers.** Fixed quarterly memo regardless of state, triggered by drift indicators, triggered by member petition, or all of these?
4. **Landing and obligation.** Does the memo go to the board, the holding body, the membership, or the public — and what is the board obliged to do with it within what timeframe?
5. **Protection of the function.** What prevents the executive from defunding, retraining, or replacing the drift-naming author when its memos become inconvenient?

### Selecting a Fleet for Mission Fit

**Scenario.** A press-freedom nonprofit is choosing which model and provider to entrust with investigative drafting and source-handling. Three candidates offer comparable capability. A publishes charter-relevant evals but its training is opaque; B is transparent but has signed contracts with state-aligned media operators this year; C will fine-tune to spec, but the base model softens criticism of large institutional actors under pressure. A donor will ask why this fleet rather than another, and the human-era answer — references, past costly stands, a decade on the work — does not map.

**Challenge:** Design a procedure for selecting a fleet when the human readouts of character and stake do not apply. A better proposal names what evidence bears on mission fit, what counts as a costly signal from a provider, and when the choice must be revisited. Deliverable: admissible-evidence list, selection-record format, costly-signal criteria, review trigger, and conflict-of-evidence rule.

**Design choices the team must take a position on.**
1. **Admissible evidence.** Charter-relevant evals, training-corpus disclosures, provider history and contracts, red-teams under pressure, refusal and sycophancy patterns, third-party audits — which carry weight and which are signals only?
2. **Provider-side costly signal.** Contractual undertakings with named exits, public refusal commitments, escrowed audit access, equity-style stakes in the mission outcome, or none of these are real costly signals and the org must compensate elsewhere?
3. **Selection record.** Internal board memo, published donor rationale, partner-readable evidence summary, or a layered document with different audiences?
4. **Re-selection trigger.** Fixed renewal cadence, provider behavior outside this engagement, behavioral drift inside it, member or partner petition, or combinations?
5. **Conflicts of evidence.** When evals look good but provider history looks bad, or vice versa, which evidence class governs and who decides?
