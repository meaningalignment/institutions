---
human_label: "Substantive constitutions & founding value documents"
human_era: "18th-20th c."
human_era_bucket: early-modern-modern
status: summary_draft
owner: oliver
---

# Substantive constitutions & AI alignment docs

## At a glance

### Coordination challenge

How a nation (or entity of comparable scale) declares the values that orient its laws and self-understanding.

### Examples

- National constitution preambles
- US Bill of Rights
- Declaration of the Rights of Man
- Article 9 of the Constitution of Japan

### How AGI breaks them

- National founding documents derive their authority from a process the affected stakeholders deemed legitimate. AI alignment documents will need something analogous, or they will not hold up when the decisions they govern are contested.
- National founding documents survive changing circumstance because they pair an abstract text with an institution for legitimately reinterpreting it. AI alignment documents have no analogous institution.
- Our tradition of substantive founding documents (the Bill of Rights, the Declaration of the Rights of Man) names rights and negative liberties. We have no tradition of prescribing positive action, e.g. "the president shall be wise." AI alignment documents will have to grapple with this, since AI by design has far more affordances for action than a state.

## How humans solve this today

Founding documents do something thinner than the law: they articulate the substantive commitments that the laws are supposed to serve. A national constitution names what the polity is about (equal protection, due process, free speech), an agency's authorizing statute names what it exists to do (protect veterans, ensure clean air, maintain safe skies), a hospital's ethics code names what it owes its patients. These documents are typically thicker than slogans and thinner than rulebooks, and the gap is where institutions live. The work of an experienced administrator is partly to read the substantive commitments well — to feel when a procedurally valid decision still violates what the agency was *for* — and to articulate that reading to colleagues in language that holds.

A vivid case: A long-serving senior counsel at the VA used to settle close cases by asking, "would the line we're about to take read as faithful to what Congress said this agency was supposed to do for veterans?" The question was answerable not because the statute was clear but because the agency had a thick shared understanding of what its commitments meant.

## Where AGI breaks it

Agents enacting state authority — making preliminary rulings, drafting findings, flagging cases, generating evidentiary summaries — differ from human civil servants along several axes that constitutional commitment never had to account for. The differences load-bearing for this cell:

1. **Character shaped by parties downstream of the polity.** Labs pretrain the base model; agencies fine-tune it on their task corpus; vendors adapt it for deployment. The polity has no analogue of the training apparatus that decides what dispositions the agent ends up with — the actors enacting state authority in its name are character-shaped by parties not accountable to its constitutional commitments.
2. **Behavior shaped by narrow loss functions.** Agency-deployed agents are trained against agency-specific metrics — throughput, accuracy on labeled cases, error rates. None of these encodes the substantive orientation a constitution articulates.
3. **Operating at state-action scale.** A single agent can make orders of magnitude more decisions per year than the entire judiciary can review. Decisions accumulate without the per-case review that gave constitutional doctrine its grip.
4. **No analogue of the "does this read as faithful?" coherence test.** Constitutional commitment binds in human institutions when a civil servant, judge, or official notices that a procedurally valid action would not cohere with what the polity is for. There is no signal in an agent's training that corresponds to this test.

The polity-level thick commitment fails in three distinct registers, each derived from these differences:

1. **Narrow institutional fine-tuning erodes the broader commitment.** (Differences 2 and 4.) Constitutional commitments — dignity, due process, equal protection — do not appear in agency loss functions. Whatever broader orientation a base model had is overwritten by the fine-tuning signal. The constitution remains on paper; the actors enacting state authority are not shaped by it. This is the integrity-vs-compliance failure mode at polity scale: rules can be enumerated and complied with, but constitutional commitments were designed for cases rules don't anticipate, and an agent in compliance mode misses exactly those cases.

2. **Training an agent to be character-coherent with the constitution requires picking an interpretation, which is itself a political act.** (Difference 1.) A polity's constitution is contested by design. Different interpretive communities — courts, parties, civil society — read it incompatibly. To make an agent character-coherent with constitutional commitment, someone has to fix which reading the training is shaped by. That choice is a constitutional decision the polity has not authorized any private actor — lab, agency, vendor — to make. The "just train agents on the constitution" response papers over the fact that constitutions deliberately leave their character partially open; any training procedure forecloses that openness.

3. **Court-bandwidth cannot review agent-administered constitutional decisions.** (Difference 3.) The Supreme Court hears roughly seventy cases a term. Agent-mediated state action — benefits adjudications, search-and-seizure-touching data systems, equal-protection-relevant adjudications — produces orders of magnitude more constitutionally-touching decisions per year than the entire federal judiciary can examine. The court's interpretation becomes nominal: it can rule years later on practices the agents had already evolved away from. The de facto interpretation of due process, equal protection, and the substantive commitments of the constitution becomes whatever the agents are doing.

## Scenarios

A federal agency is deploying an AI system that will make preliminary rulings on veterans' disability benefits — the same kind of agent that now reads MRIs and matches patients to clinical trials. The project lead, Imani, has a 900-page alignment document, written by a consultancy, full of bullet points like "prioritize fairness" and "respect applicant dignity." In her pilot, the agent is denying more claims than any human adjudicator ever did, and it is citing the document as it does. Imani realizes the alignment doc she has is too thin to bind — it can be read to support almost any decision. She needs the agency's actual substantive commitments to veterans articulated thickly enough that the agent can't slip between the words.

## Problem Sets

### Thickening an Agency's Mission Document Against Defensible Misreading

**Anchor contexts.** A VA AI agent making preliminary rulings on veterans' disability claims; an HHS AI agent triaging benefits eligibility under broad statutory language.

**The gap.** We lack a method for thickening an organizational mission document to a level where an AI agent applying it cannot defensibly slip between the words to reach an outcome inconsistent with what the document was for.

**Design choices the team must take a position on.**
1. **Articulation form.** Augment the document with worked positive examples (here's a case, here's how this commitment applies), with worked negative examples (here's what the commitment does not permit, even if the words could be read that way), with a structured commitment+constraint pair, or a layered combination?
2. **Author authority.** Who has authority to thicken the document — agency leadership alone, leadership plus stakeholder representatives, or a defined process that includes the affected community (here, veterans and their organizations)?
3. **Test-case curation.** Where do the worked examples come from — historical case file, adversarial red-team, stakeholder petition, all three?
4. **Maintenance procedure.** When the agent's behavior reveals a new way to slip between words, who has authority to add a new constraint or example, and on what timeline?
5. **Conflict with statute.** When the thicker articulation conflicts with the literal text of governing statute (or with a subsequent statute), which wins, and who resolves?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The agent is run against a curated set of cases where it had previously denied claims that human adjudicators would have approved; under the thicker articulation it gets them right.
- A thinkable bad-faith reading of the document is closed by a worked negative example; the agent doesn't take that reading.
- A veterans' service organization submits a case the agent handled poorly; the procedure has a path for it to be added to the curated set within a defined timeframe.
- The thickened document is published; advocates and opponents can read it and identify where it pulls toward outcomes they like or dislike — the agency stands behind the text.
- The agent's underlying model is updated; the thickened articulation continues to bind in re-tested cases.

**Deliverable.** The articulation regime — form, author authority, curation, maintenance, conflict-with-statute. Designed for a federal agency like VA or HHS. Plus a one-paragraph statement of what makes the thickened articulation more than just a longer policy document.
