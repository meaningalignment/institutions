---
agents_label: "Tacit dyadic norms"
human_label: "Social conventions"
status: summary_ok
owner: joe
starred: true
---

# Tacit norms in two-party interactions

## At a glance

### Coordination challenge

How two parties act on the unwritten background of mutual expectations around an explicit contract or recurring interaction

### Examples

- Good-faith interpretation of contract terms
- Email etiquette
- Landlord-tenant courtesies
- Back-channel diplomatic conventions
- Journalist-source attribution understandings
- Mentor-mentee unspoken expectations

### How AGI breaks them

- The usual way humans enforce norms (social sanctions, going cold, pushback) does not hurt an agent the same way.
- Agents might execute only explicit terms or apply norms from their training that don't match the parties' expectations.
- Even if agents are applying norms, it's hard to evaluate their success or failure without a record of what norms they identified and how they applied them.
- There is likely a kind of normative reasoning that humans do implicitly in these interactions ("I know that if I do X, my counterparty will feel Y, and I want to avoid that") that agents won't do without explicit modeling and incentives to do so.
{{>>I'm not so sure that agents don't do some kind of equivalent to normative reasoning in situations, maybe hedge "that agents might not do without"<<}}
- The implicit norms around a relationship evolve through repeated interaction; an agent that doesn't track and update its model of the norms will fall out of sync over time
- A norm formed between two agents may rest on reasoning the human cannot follow even in retrospect, or may be formed in minutes and only discovered by humans much later.

## How humans solve this today

Every explicit human contract or recurring interaction sits on a vast bed of unwritten background — what counts as "reasonable," when "I'll get to it" means today versus next week, when silence is consent and when it isn't, what good-faith interpretation of an ambiguous clause looks like, what's so obvious it would be insulting to spell out. The legal system formalizes a slice of this (good-faith doctrines in contract law, the duty of fair dealing, course-of-dealing as an interpretive aid, fiduciary standards in agency relationships), but the bulk lives in shared common sense and the specific texture of the relationship.

The mechanisms by which humans operate the substrate are mundane: each party reads the other's tone, mirrors observed conventions, asks when uncertain, defaults to the most generous plausible interpretation early on and tightens later if needed. Both parties have similar bandwidth for noticing implicit cues and similar incentives to preserve the relationship. The substrate is rarely articulated — articulating it is often awkward, usually unnecessary, and sometimes counterproductive (writing down "we'll be polite" can read as a sign one party expects the other not to be).

A vivid case: When Theo agreed to sublet Leah part of his print studio, the lease said nothing about noise, smell, hours, or what counts as "shared use" of the sink. Within two weeks both knew — without discussion — that the press doesn't run during the toddler's nap, that wet ink doesn't sit near paper stock, that either of them can use the kettle but not the other's mug. None of this was articulated; both could now feel violations.

## Where AGI breaks it

Four properties of agents make the implicit substrate fail to transfer when one party to an interaction is an agent:

- **Behavior shaped by what's written.** An agent acts on its training, its prompt, and the explicit contract. What isn't in those is largely not there, even when a human counterparty would treat it as obvious.
- **No shared cultural common sense by default.** The human substrate is acquired by a lifetime embedded in a culture. An agent's defaults are whatever its training disposed it toward, which may overlap with the principal's, the counterparty's, both, or neither.
- **No felt cost of letter-vs-frame violations.** Humans operate the substrate partly because acting on the letter while violating the frame costs the relationship in a way they experience. An agent has no such cost; if the explicit terms permit an action and the prompt rewards it, the implicit frame doesn't push back.
- **Re-instanceable and stateless across the relationship.** Whatever texture about a counterparty an instance picks up doesn't carry forward unless explicitly persisted and re-loaded.

These differences break each of the mechanisms by which the substrate normally operates:

- *Reading tone and mirroring conventions* requires shared cultural common sense and continuous presence in the relationship; neither holds.
- *Defaulting to a generous plausible interpretation* requires the felt cost of getting it wrong to motivate caution; that cost is absent.
- *Course-of-dealing accumulation* requires statefulness across the relationship; absent unless explicitly built and maintained.
- *Legal scaffolding* (good-faith doctrines, fair-dealing duties, course-of-dealing as interpretive aid) was written assuming a counterparty with legal standing. The agent has no standing of its own, and the principal-developer-deployer chain is too diffuse for the doctrine to attach by default.
- *Asking when uncertain* could in principle apply to agents, but only when the agent recognizes that it's in an implicit-frame edge case — and recognizing the edge requires knowing the frame exists, which is the thing the agent lacks.

## Scenarios

Marco runs a small architecture practice. He signs a contract with a structural-engineering firm to review his drawings ahead of permitting. The contract is standard: turnaround, fee, scope, IP. Marco's expectation, never written and never discussed, is that if the engineer spots something *outside* the strict review scope that's clearly going to be a permit issue — a wrong setback, a missing fire-rated assembly — they'll flag it. Every engineer he's worked with for fifteen years has done this; it's how the relationship works. The engineering firm has just shifted to an agent-driven review pipeline. The contract is honored exactly. Marco's drawings come back with the in-scope items flagged. Three weeks later his permit application bounces because of a setback issue the prior firm's reviewer would have caught in passing — but the contract didn't ask about it, and the agent didn't either. The agent did everything it was asked to do.

## Problem Sets

### Carrying the Implicit Frame Across an Agent Interface

**Anchor contexts.** A two-party service contract (architect-engineer, counsel-client, freelancer-platform) where one or both parties have replaced their human-side execution with an agent; an established recurring business relationship where both sides' day-to-day handoffs now run through agents.

**The gap.** Every two-party contract or recurring interaction rests on an unwritten substrate of mutual expectations — what counts as good faith, what's obvious enough to go unsaid, what a reasonable counterparty would flag without being asked. When one or both parties act through agents, the substrate doesn't transfer by default. We lack a procedure by which the implicit frame around a specific two-party interaction is made operative for an agent acting in either party's place, without requiring the principals to enumerate it exhaustively in advance.

**Design choices the team must take a position on.**
1. **Source of the implicit frame.** Does the agent draw on its principal's prior dealings with this counterparty, on industry baseline conventions, on a structured profile elicited from the principal, on the counterparty's stated preferences, or on a layered combination? When sources disagree, which wins?
2. **What triggers articulation.** Is the unwritten frame surfaced ambiently (the agent narrates the implicit assumptions it's acting on at the start of each interaction), reactively (only when the agent detects a borderline case), or only on principal request?
3. **Resolution against the explicit contract.** When the explicit terms and the inferred implicit frame point different directions, which governs, and who is informed? When the two parties' inferred frames disagree (Marco assumed flagging-outside-scope, the firm assumed strict-scope), how is the disagreement surfaced before action?
4. **Authority of the frame.** Is the implicit substrate advisory (the agent considers it, then proceeds on the contract) or governing (the agent pauses when the frame would be violated, even if the contract permits the action)?
5. **Update and drift.** A relationship's implicit norms evolve through repeated interaction. How does an agent representing one party track and update its model of the frame, and when does that model get reconciled with the counterparty's?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A handoff where the explicit contract permits action X but action X would violate every prior course-of-dealing expectation; the agent surfaces the conflict before acting.
- A counterparty switches to an agent mid-relationship; the implicit frame the human built up over years isn't lost in the transition.
- A principal is asked to articulate the implicit frame in advance and (predictably) misses most of it; the procedure still works on the items the principal didn't think to mention.
- Both parties' agents disagree about what's implicitly assumed; the disagreement is surfaced to humans before either acts on its own model.
- A regulator or court examines the agent's behavior on a borderline call; the record shows which implicit assumptions the agent identified, where they came from, and on what basis they were acted on.

**Deliverable.** A procedure that takes a specific two-party interaction or contract and produces an operative model of its implicit frame for an agent acting in either party's place. Includes the elicitation method, the conflict-resolution rule, and the update mechanism. Plus a worked example: one of the anchor contexts, with the implicit frame extracted, surfaced, and operative.
