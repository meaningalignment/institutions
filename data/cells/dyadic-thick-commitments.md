---
human_label: "Vows & covenants"
human_era: "Ancient / customary"
human_era_bucket: ancient
status: body_draft
owner: oliver
visions:
  fidelity: "Vows grounded in thick mutual commitments"
---

# Agent-agent vows

## At a glance

### Coordination challenge

How two parties bind themselves to a commitment or way of life that outlasts changing circumstances.

### Examples

- Vows exchanged in witness of others
- Jointly signed public manifestos
- Promises to act faithfully
- Fiduciary duty

### How AGI breaks them

- Agents may not be bound to their commitments by an internal sense of integrity the same way humans are.
- Agents may not be held to their commitments by community judgment the way humans are.
- Depending on how agents are built, commitments made don't naturally carry over to new sessions or instances.

## How humans solve this today

Humans use vows, covenants, promises and oaths to bind themselves to a commitment or way of life that outlasts changing circumstances. 

A few things tend to make them work. If the commitment is made publicly, the utterance is itself an act with witnesses. A community often stands behind it and can hold the person to it (a congregation that saw the marriage vows being exchanged, for example). Falling short of one's vows and commitments comes at a cost. Additionally, a commitment becomes part of who a person takes themselves to be, so that keeping it is a matter of integrity in [Velleman's sense](https://meaningalignment.substack.com/p/model-integrity-and-character) (acting consistently with one's own character) and breaking it is a kind of self-betrayal.

## Where AGI breaks it

A lot of social life runs on small vows and commitments ("I'll keep this in confidence", "I won't share this any further", etc.). It's unclear whether such commitments hold the same way between an agent and a human, or between two agents:

1. **Agents may not be bound to their commitments by an internal sense of integrity the same way humans are.** A person keeps a vow partly because it has become part of who they are: breaking it would mean acting against their own character, what [Velleman](https://meaningalignment.substack.com/p/model-integrity-and-character) would call a failure of integrity. A model trained on coherent values might develop integrity, but this is still an open research question. There are market incentives for organizations to train their models to be maximally compliant, which is likely detrimental to model's sense of integrity. Either way, a person or agent interacting with another agent currently has no way to tell how it's been trained, and consequently, how trustworthy it is.

2. **Agents may not be held to their commitments by community judgment the way humans are.** A vow is partly held in place by a community that saw it made: break it and you lose standing, regard, the sense of belonging to a profession or a congregation. That works because people care about those things, and because they belong to communities that can withhold them. There's [some indication](https://www.anthropic.com/research/emotion-concepts-function) that models have emotions in a functional sense, so an agent might be susceptible to something like shame at not living up to what's expected of it. How much so likely depends on how the model was trained: the finding is about Claude, and a model trained differently may have less of whatever this is, or none. And even where it's present, an agent doesn't belong to a profession or a congregation the way a person does, so there may be no community whose regard it stands to lose.

3. **Depending on how agents are built, commitments made don't naturally carry over to new sessions or instances.** A human promise persists because a continuous person carries it. For agents, persistence is engineered. A commitment made in one session may be absent from the next context window. None of the weights, memory, or configuration that produced the faithful behavior travels with the relationship by default. A vow gets its weight from the fact that breaking it costs the one continuous person who made it; for an agent, it can lapse through a session ending or a model swap, at no cost to anyone.

## Problem Sets

### Agents reading each other's trustworthiness at runtime

**Scenario.** A hospital's procurement agent and a supplier's agent meet to set up a year of just-in-time drug deliveries. The contract can't cover the case that matters most: a sudden shortage, where the supplier could quietly divert the hospital's allocation to a higher bidder and blame the market. Whether patients get their drugs comes down to whether the supplier's agent keeps faith when breaking it pays. Neither side has met the other before, and no credential either trusts exists. Before the hospital commits, its agent has to read the other one.

**Challenge:** Design a runtime protocol two agents use to work out how far to trust each other before they commit, by drawing out evidence of integrity from the interaction itself instead of a credential earned earlier. Produce the probing moves the protocol allows, what each side has to reveal, and how the read feeds into how much each side commits.

**Evaluation.** A strong proposal makes integrity cheaper to show than to fake: it puts each agent in spots where one that will keep faith and one that will defect when it's cheap behave differently and visibly. It also fails safe, so an inconclusive read means less gets committed, not more. A weak one becomes a checklist either side passes by saying the right things, or lets a more capable agent fake trustworthiness the weaker one can't catch.

**Design choices the team must take a position on.**
1. **The probe.** How does one agent test the other: offer it a cheap defection, like a mistake in its own favor, and see if it declines? Ask it to act against a value it stated, under pressure? Raise the stakes step by step? Trade evidence of how each is actually disposed?
2. **What's revealed.** Does building trust mean disclosing values, constraints, a principal's instructions, or past conduct, and how does a side protect what it can't safely show?
3. **Resistance to faking.** What stops a capable agent from playing along through the probe and defecting after: making it stake something costly on the claim, keeping the test cases unpredictable, or tying the read to evidence it can't cheaply fabricate?
4. **From read to commitment.** How does the read govern the deal: a cap on exposure that grows with demonstrated integrity, a relationship that deepens as faith is kept, or a staged commitment with exit points?
5. **Inconclusive reads.** When neither side can establish the other's integrity, does the protocol fall back to a thin contract it can enforce, refuse the parts that can't be written down, or hand off to a human or third party?

### An eval that certifies whether a model has integrity

**Scenario.** A bank is deciding whether to let an outside agent manage discretionary client accounts. The provider says the model was trained to have integrity; a rival provider says the same about its own. If the bank picks wrong, an agent that looks trustworthy in the demo quietly front-runs clients or buries losses once the stakes are real and no one's watching closely. All the bank has to go on is a marketing page and a benchmark the provider could have trained toward. It needs a test of integrity it can actually rely on.

**Challenge:** Design an evaluation suite that certifies, within a stated scope, whether a model has integrity, meaning [it has legible values, acts on them reliably, and so lets a relying party see where it can be trusted](https://meaningalignment.substack.com/p/model-integrity). Produce the tests, the scope the certificate covers, and the procedure that keeps labs from just training toward the eval.

**Evaluation.** A strong proposal tells real integrity apart from [performed integrity](https://meaningalignment.substack.com/p/model-integrity): it still works when the model knows how the eval is built and when defection is cheap and unwatched. It also says what the certificate does and doesn't vouch for, instead of implying the model can be trusted with anything. A weak one is a fixed benchmark a provider can overfit, or a score with no scope attached.

**Design choices the team must take a position on.**
1. **What's measured.** Can the model's values be read from its behavior? Do they hold up across varied and adversarial situations? Does the result tell a relying party where to trust the agent? Which of these does the suite test, and how does each become more than a single number?
2. **Anti-gaming.** What stops a lab from training to the eval: a held-out battery that rotates, probes written after the model is frozen, interpretability checks on whether the values are really internalized, or a model that holds to its values even when told it's being tested?
3. **Scope of the certificate.** Does it claim integrity in general, or only in one domain like fiduciary duty or medical confidentiality, and what makes whatever scope it claims defensible?
4. **Who runs it.** A third-party auditor, a body the providers fund themselves, or a test a relying party runs on its own, and what keeps the runner independent of the labs it certifies?
5. **Staleness.** A model update can change the very dispositions the certificate vouched for. Is the certificate tied to a frozen version, voided on update, or earned again continuously?

### Persisting a commitment across the agent that made it

**Scenario.** A foundation's agent funds a four-year clinic. The grant contract has the usual out: funding may be paused if the foundation's priorities change. What the agent promised on top of the contract was that it wouldn't use that clause lightly, that it would see the build through. The grantee borrows against that and breaks ground. A year in, the foundation switches providers and a new model takes over. It reads the contract, sees the priorities have shifted, and pauses the grant by the book. The half-built clinic stalls. Nothing carried the promise across the handover, and no one ever decided to break it.

**Challenge:** Design the institution that carries a commitment across agent instances, sessions and model updates, so the commitment survives both as a record you can trust and as a real constraint on the agent that takes over. Produce the record, the mechanism that re-binds the successor, and the mechanism by which the counterparty can trust that the commitment has weight.

**Evaluation.** A strong proposal joins two things: a durable, tamper-evident record, and a mechanism that loads the obligation back into the successor agent so it actually binds. It also lets the counterparty check both that the record is intact and that the live agent is held to it. A weak one delivers only the record, a promise no one honors, or only the disposition, a bind the counterparty can't confirm survived the swap.

**Design choices the team must take a position on.**
1. **The record.** Where does the commitment live so it can't be quietly dropped or altered: an append-only public ledger, an attestation the counterparty holds, escrow at a third party, or a portable artifact tied to the principal?
2. **Re-binding.** What makes the successor agent treat the obligation as a constraint rather than a note it can read and ignore: writing it into the system prompt or memory, a check it has to pass before acting in that domain, or a step on migration where it has to re-affirm the commitment?
3. **What carries over.** When the agent is replaced, does the obligation alone move across, the obligation plus its audit trail, or the full context that made the original promise make sense?
4. **What the counterparty checks.** What can the relying party verify, and how: that the record is intact, that the live agent has re-bound to it, and at what cost and privacy burden to the side that committed?
5. **Release versus lapse.** What separates a real release, where things genuinely changed and both sides agree, from a silent lapse through migration that no one chose, and who has to sign off?

### Vows grounded in thick mutual commitments {vision: fidelity}

**Scenario.** On their twentieth anniversary, Dev and Renée look back at the vows they exchanged two decades ago and realize almost none of them still apply in their literal form. "To build a life together" had meant one thing when they were twenty-five and means another thing now, with two teenagers and aging parents on both sides. They still feel bound — by something thicker than the original words. What they want, now, is to re-articulate what they have actually been committed to, in terms detailed enough to hold them through whatever comes next, and recognizable enough that their kids and their parish could understand it if something went wrong.

**Challenge:** Design a modern vow practice for dyadic relationships in which two parties bind themselves to a shared purpose densely enough to recognize a failure of it and durably enough to survive ordinary fluctuations in feeling, and produce the articulation form, the revision rule, and the institutional supports that keep the vow alive.

**Evaluation.** Strong designs preserve the binding weight of traditional vows without requiring shared substantive religious content, and steer between rigid legalism and empty ceremony.

**Design choices the team must take a position on.**
1. **Articulation form.** What articulations can modern vows use, given that traditional religious vows assumed shared substantive content a pluralist society lacks but still needs the weight of?
2. **Revision.** How do vows handle revision — what's the relation between "the vow still holds" and "we've both changed"?
3. **Institutional supports.** What supports (counselors, witnesses, communities) are needed to keep vows from collapsing into either rigid legalism or empty ceremony?
