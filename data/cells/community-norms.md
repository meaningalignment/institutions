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
- Firm compliance committees and desk norms
- SEC enforcement guidance and no-action practice
- LTCM / Archegos / London Whale postmortems

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

1. **Existing mechanisms for professional norms may not keep up with the speed and scale of agent practice.** Finance norms evolve through slow bodies: compliance committees, regulator guidance, enforcement actions, professional education, and post-incident review. Even if agents are somehow listening to these bodies, they may not be able to keep up with the pace of change in agent practice.

2. **The usual way humans enforce norms (social sanctions, going cold, pushback) may not affect agents the same way.** Professional norms often work because people care about being trusted, staffed, invited back, or treated as serious by peers. You're going to think twice about screwing your competitor if you're golfing with them next week. Agents can be corrected or shut off, but are not disciplined by embarrassment, exclusion from lunch, or loss of professional reputation in the same way. If the only enforcement channel is human social pressure, the pressure reaches the firm or supervisor indirectly and may not reach the decision-making system at all.

3. **Agents may not excel at the normative reasoning required to anticipate how a peer or regulator would react to an action.** A senior compliance officer can often say, before citing a rule, that a trade will look indefensible to FINRA, the SEC, a client board, etc. An agent may be weaker at modeling that social and institutional reaction. The problem becomes harder when the peer or regulator is also an agent, because the reasoning has to account for principals, instructions, disclosure, and review standards rather than ordinary human reaction alone.

4. **Agents likely have more diverse capabilities and incentives than humans, making it harder to find norms that work for all parties.** Human professional norms are already strained by variation in judgment, risk tolerance, and bad faith. Agent practice adds wider variation: some agents may search a space exhaustively, some may be tightly constrained, some may represent principals with unusual goals, and some may be optimized for narrow success measures. A norm that keeps ordinary human professionals coordinated may be too weak for high-capability agents, too restrictive for low-capability ones, or gameable by agents whose incentives sit outside the assumed range.

5. **Agents may not pick up on unwritten rules just by reading policies.** Norms reach humans through repeated exposure to local approvals, vetoes, jokes, escalation patterns, and postmortems. Those signals may not automatically become governing constraints for an agent. If the agent only sees written rules or task prompts, important lessons may not be absorbed.

6. **Even if agents can develop their own norms, they may outrun us.** Agents may converge on stable practices among themselves before principals, professional bodies, or regulators understand what has happened. By the time humans discover the new norm, it may already have shaped pricing, client treatment, risk management, or market access across many decisions.

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

### Ratifying Agent-Speed Professional Norms

**Scenario.** Several large banks use agents to screen a new kind of structured product. Within a week, the agents converge on the same market practice: the product can be sold to smaller pension funds as long as a dense risk appendix is attached. No regulator has ruled on it, and no professional body has discussed it. By the time trustees begin to complain that they did not understand the risk, the practice has already shaped hundreds of sales.

**Challenge:** Design a ratification procedure by which agent-discovered professional norms are surfaced, slowed, reviewed, and either approved, revised, or rejected before they become settled practice. The procedure succeeds if it catches the scenario norm before it spreads through the market, gives professional bodies and regulators a legible record of what agents are converging on, and prevents the largest agent fleets from deciding the profession's norms by moving first. The team should produce the procedure plus a worked example of one proposed agent norm moving through review.

**Design choices the team must take a position on.**
1. **Detection threshold.** What counts as an emerging norm: repeated behavior across agents, explicit agent-to-agent agreement, convergence inside one large fleet, or material effects on clients?
2. **Pacing.** When a norm is detected, is practice paused, slowed, labeled provisional, or allowed to continue while review happens?
3. **Review authority.** Who can ratify or reject the norm: the firm, a professional association, a regulator, a client fiduciary, or some combination?
4. **Fleet asymmetry.** How does the procedure keep the largest agent deployments from setting norms simply because they generate the most examples fastest?
5. **Rollback.** If a norm is rejected after agents have already acted on it, which past decisions are grandfathered, audited, compensated, or reopened?
