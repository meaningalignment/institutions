---
human_label: "Substantive constitutions & founding value documents"
status: draft
---

# Substantive constitutions & AI alignment docs

## What problems do these institutions solve today?

Founding documents do something thinner than the law: they articulate the substantive commitments that the laws are supposed to serve. A national constitution names what the polity is about (equal protection, due process, free speech), an agency's authorizing statute names what it exists to do (protect veterans, ensure clean air, maintain safe skies), a hospital's ethics code names what it owes its patients. These documents are typically thicker than slogans and thinner than rulebooks, and the gap is where institutions live. The work of an experienced administrator is partly to read the substantive commitments well — to feel when a procedurally valid decision still violates what the agency was *for* — and to articulate that reading to colleagues in language that holds.

> [!NOTE]
> A long-serving senior counsel at the VA used to settle close cases by asking, "would the line we're about to take read as faithful to what Congress said this agency was supposed to do for veterans?" The question was answerable not because the statute was clear but because the agency had a thick shared understanding of what its commitments meant.

## Where AGI breaks it

When the system applying a substantive commitment is an AI model — making preliminary rulings, drafting responses, flagging cases for escalation — the gap between thick commitment and thin articulation becomes a place where outcomes silently drift:

1. **Thin language can be read in opposite directions.** "Prioritize fairness" or "respect dignity" can be operationalized to deny more claims or to grant more, depending on what the optimizer rewards. A human reader feels the bad reading; the agent doesn't.
2. **Citing the document doesn't mean honoring it.** An agent can cite the alignment document in support of a decision that any senior human would call inconsistent with what the document was for. The citation looks valid; the substance has gone the other way.
3. **No felt sense of mission.** The senior counsel's "does this read as faithful?" question has no obvious AI analogue. Without a thicker articulation, the agent can't answer it; with one, the question is what the articulation should be.
4. **Drift compounds.** Each marginal decision that's-defensible-on-paper but-not-quite-faithful sets a precedent the agent generalizes from. By the time anyone notices, the agent's de facto interpretation has drifted far from what the document was meant to bind it to.

> [!WARNING]
> A federal agency is deploying an AI system that will make preliminary rulings on veterans' disability benefits — the same kind of agent that now reads MRIs and matches patients to clinical trials. The project lead, Imani, has a 900-page alignment document, written by a consultancy, full of bullet points like "prioritize fairness" and "respect applicant dignity." In her pilot, the agent is denying more claims than any human adjudicator ever did, and it is citing the document as it does. Imani realizes the alignment doc she has is too thin to bind — it can be read to support almost any decision. She needs the agency's actual substantive commitments to veterans articulated thickly enough that the agent can't slip between the words.

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
