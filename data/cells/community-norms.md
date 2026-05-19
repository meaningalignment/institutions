---
agents_label: "Professional norms for agents"
human_label: "Professional codes of conduct"
status: body_ok
owner: joe
starred: true
---

# Professional norms for agents

## At a glance

### Coordination challenge

How a profession sets expectations its members hold each other to without invoking formal law. If agents don't find norms at least as well as humans do, we are likely to see many tragedy-of-the-commons scenarios.

### Examples

- FINRA member conduct rules
- CFA Institute Code and Standards
- SEC Rule 10b-5 compliance norms
- Volcker Rule trading restraints
- LTCM and Archegos risk postmortems

### How AGI breaks them

- Existing mechanisms for professional norms may not keep up with the speed and scale of agent practice.
- The usual way humans enforce norms (social sanctions, going cold, pushback) may not affect agents the same way.
- Agents may not excel at the normative reasoning required to anticipate how a peer or regulator would react to an action (and that reasoning may be harder when the peer or regulator is itself an agent).
- Agents likely have more diverse capabilities and incentives than humans, making it harder to find norms that work for all parties. (Difficulty finding norms that work across normal people and sociopaths is a good example of this problem in the human world.)
- Agents may not pick up on unwritten rules just by reading policies.
- Even if agents can develop their own norms, they may outrun us. Principals may discover what their agents agreed to after they've shaped many decisions.

## How humans solve this today

In finance, professional restraint lives in several places at once. Formal law matters, but much of the work is done by norms that let practitioners stop short of the line before a court, regulator, or client has to intervene.

1. **Tacit absorption.** Juniors learn what the desk treats as acceptable by watching what gets cleared, vetoed, resized, or escalated. The lesson is partly local: a mortgage desk, a credit desk, and a vol-arb desk can all obey the same law while carrying different "we do not do that here" boundaries.

2. **Codes of conduct.** FINRA rules, the CFA Institute Code and Standards, firm compliance manuals, and licensing regimes give professional communities a shared vocabulary for misconduct. They also create sanctions short of criminal punishment: censure, suspension, supervision, loss of license, and loss of standing inside the profession.

3. **Regulator-anticipation.** Senior practitioners and compliance officers learn how the SEC, FINRA, the Fed, the OCC, and a future congressional hearing are likely to view a structure. The "front page of the Journal" test is not law, but it names a real institutional check: would this still be defensible when made public under stress?

4. **Contractualist reasoning.** When a case is not covered cleanly by a rule, practitioners ask whether the transaction would be defensible to the affected parties if the structure and incentives were fully visible. Goldman's post-Abacus lesson, often summarized as "do not sell a deal you would not be comfortable explaining," is this norm made explicit.

5. **Case-based recognition.** Practitioners carry a canon of disasters: LTCM, Lehman, Knight Capital, the London Whale, Archegos. These cases do not supply rules by themselves. They teach feature recognition: correlated leverage disguised as diversification, operational automation outrunning controls, risk transfer that is formally disclosed but substantively misunderstood.

A vivid case: Sarah's first months at a hedge fund desk were spent watching her senior PM respond to proposed trades. Some ideas were approved, some were cut down for size, and some were killed with no citation beyond "we do not get bigger than the market in that name." By month three, Sarah could predict which pitches would survive the morning meeting. She had not learned a new statute. She had learned the desk's professional boundary.

## Where AGI breaks it

1. **Agents do not pick up a desk's unwritten "we do not do that" rules just by reading policies.** The desk's unwritten boundaries reach humans through repeated exposure to local approvals, vetoes, jokes, escalation patterns, and postmortems. Those signals do not automatically become governing constraints for an agent. If the agent only sees written rules, trade data, and task prompts, the most important "we do not do that here" lessons remain outside the control surface.

2. **Licenses and discipline reach human professionals and firms, not replaceable agent copies.** FINRA or CFA discipline can still bind licensed people and firms, but the acting system has no license, career, or professional membership of its own. A code violation therefore needs a path from agent behavior to costs borne by some accountable actor: the supervisor, firm, vendor, developer, principal, or an agent registry. Without that path, the code names misconduct without reaching the place where the decision was made.

3. **Agents need an explicit way to flag trades that are legal but would look indefensible to regulators.** A human compliance officer has seen enough enforcement actions and internal escalations to identify deals that are formally arguable but predictably indefensible. An agent can in principle do this better, because the corpus is readable and current. But unless a regulator-anticipation model is explicitly built, updated, and given authority to pause actions, the written rulebook becomes the whole signal.

4. **When both sides use agents, ethics checks have to ask what the human principals would actually endorse.** The human version asks what affected people could endorse if the material facts were visible. When counterparties are agents, the relevant objects include the counterparty agent's disclosed constraints, its principal's instructions, the principal's likely review standard, and the information asymmetry between principal and agent. The norm can transpose, but it cannot be copied unchanged.

5. **Past disasters only help if agents actively watch for similar patterns in today's portfolios.** An agent may retrieve every LTCM or Archegos account on demand while still failing to treat the current portfolio as a cousin of those cases. Professional memory has to be translated into live feature matchers, thresholds, escalation rules, and update governance. Otherwise the canon is available as text but absent as protection.

## Problem Sets

### Rebuild Tacit Absorption Through Explicit Extraction

**Scenario.** At a hedge fund, senior traders keep younger traders from taking positions that could trap the firm in a market it cannot exit. They do this mostly by rejecting bad trades in the morning meeting, not by writing rules. A new trading agent does not know that history. It finds a trade that looks profitable and legal, but if the market turns, the fund could be stuck holding a position too large to sell without moving the price against itself.

**Challenge:** Design an extraction-and-maintenance protocol by which a desk's unwritten professional norms are surfaced, kept current, and made governing for an agent without requiring the desk head to explain every norm in advance. The protocol succeeds if it catches the kind of trade in the scenario before execution, survives a senior trader leaving or joining, updates when the desk's risk posture changes, and still applies after the agent is upgraded. The team should produce the protocol plus a sample extracted norm set for one desk type: vol arb, credit, mortgages, or structured products.

**Design choices the team must take a position on.**
1. **Signal channels.** Does the procedure infer norms from explicit corrections to the agent, senior-trader reactions to its proposals, vetoes at the morning meeting, post-trade reviews, quiet rewrites, or some combination?
2. **Norm form.** Are extracted norms represented as natural-language rules, labeled past cases, embeddings, executable constraints, or a layered combination? When extracted norms conflict with written rules, which source controls?
3. **Authorship and maintenance.** Is one named senior responsible for the norm set, is stewardship rotated, or does a separate norm-elicitation role own it? On what cadence is it reviewed?
4. **Survival across change.** When the senior whose corrections trained the procedure leaves, what persists? When a new senior arrives with a different risk posture, how quickly can the norm set change?
5. **Default on ambiguity.** When a proposed trade matches no extracted rule but sits near an ambiguity boundary, does the agent execute, pause for review, ask the senior, or produce options with a risk label?

### Contractualist Reasoning When Counterparties Are Agents

**Scenario.** A bank uses an agent to design a complex investment product for a pension fund. The pension fund also uses an agent to review the deal. On paper, both agents follow their instructions and the risks are disclosed. But the trustees who depend on the pension fund would not understand or accept the deal if they saw plainly how it could lose money. If the product fails, retirees bear the loss and both firms say their agents stayed within mandate.

**Challenge:** Design a procedure by which an agent checks whether a transaction with another agent would be intelligible to, and endorsable by, the affected principals on later review. The procedure succeeds if it blocks, changes, or escalates the scenario trade before retirees are exposed to a product their trustees would reject under plain explanation; if regulators can later understand the reasoning trace; and if different calls on similar trades can be defended by differences in disclosed constraints. The team should produce the procedure plus a worked example where the answer differs from a naive "both agents followed instructions" approval.

**Design choices the team must take a position on.**
1. **Objects of reasoning.** When the counterparty is a human, what does the agent model? When the counterparty is an agent, does it reason over the agent's stated commitments, its principal's standing instructions, disclosed constraints, audit history, or all of these?
2. **Information asymmetry.** If the acting agent has information the counterparty's principal lacks, does the procedure require disclosure, escalation, abstention, or a documented assumption about principal endorsement?
3. **Reasoning disclosure.** Is the reasoning trace shown to the counterparty agent, the counterparty principal, a third-party auditor, or retained only for examination? What triggers disclosure?
4. **Standing of agent counterparties.** Does an agent counterparty have standing in the reasoning, or only the human/legal principal behind it? If both matter, how are conflicts handled?
5. **Opacity fallback.** When the counterparty agent's relevant constraints are unavailable, is the default block, escalate, proceed with assumptions, or price the opacity into the transaction?

### Encoding the Canon as Active Surveillance

**Scenario.** A prime broker finances trades for a fast-growing client. Each trade looks acceptable on its own, and each desk sees only part of the exposure. Taken together, the client is building a concentrated bet like Archegos: if prices move sharply, several banks could rush to sell at once and deepen the loss. The firm has studied Archegos, but the lesson sits in slide decks while the monitoring agent approves the trades one by one.

**Challenge:** Design an encoding-and-matching procedure by which a profession's disaster canon becomes active surveillance against current and proposed positions. The procedure succeeds if it flags the scenario before the client becomes too large to unwind safely, updates when a new disaster enters the canon, records informed overrides without disabling future warnings, and catches near-misses without overwhelming reviewers. The team should produce a governance specification plus one worked example that encodes LTCM, Archegos, Knight Capital, the London Whale, or Lehman as a pattern and shows how a current portfolio would match it.

**Design choices the team must take a position on.**
1. **Encoding form.** Is each canonical case encoded as a structured feature specification, a natural-language description retrieved by similarity, fine-tuned model behavior, or a layered combination?
2. **Threshold and false-positive budget.** What similarity triggers a flag: one match above a threshold, accumulation across multiple cases, or senior-defined feature combinations? Who pays the cost of false positives?
3. **Canon governance.** Who maintains the canon: the firm's risk team, an industry consortium, a regulator, or an open-source community? When a new disaster occurs, who decides whether it joins the canon and on what timeline?
4. **Reach of the flag.** When the matcher fires, who sees it: the desk, risk committee, prime broker, regulator, or client? Who can override it?
5. **Adversarial near-miss.** How does the procedure catch structures designed to sit just outside named patterns without expanding until everything looks like a warning?
