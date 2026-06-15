---
human_label: "Professional codes of conduct"
human_era: "Ancient-20th c."
human_era_bucket: ancient-modern
status: body_ok
owner: joe
starred: true
visions:
  fidelity: "Lay review panels on the jury-duty model"
---

# Professional norms for agents

## At a glance

### Coordination challenge

How a profession sets expectations its members hold each other to without invoking formal law.

### Examples

- FINRA member conduct rules
- CFA Institute Code and Standards
- Firm compliance committees and desk norms
- SEC enforcement guidance and no-action practice
- LTCM / Archegos / London Whale postmortems

### How AGI breaks them

- Existing mechanisms for professional norms may not keep up with the speed and scale of agent practice.
- The usual way humans enforce norms (social sanctions, going cold, pushback) may not affect agents the same way.
- Agents may not excel at the normative reasoning required to anticipate how a peer or regulator would react to an action.
- Agents likely have more diverse capabilities and incentives than humans, making it harder to find norms that work for all parties.
- Agents may not pick up on unwritten rules just by reading policies.
- Even if agents can develop their own norms, they may outrun us. Principals may discover what their agents agreed to after they've shaped many decisions.

## How humans solve this today

In finance, formal law matters, but much of the work is done by norms that let practitioners stop short before a court, regulator, or client would intervene.

1. **Tacit absorption.** In finance, new workers learn what's acceptable by watching what gets cleared, vetoed, resized, or escalated.

2. **Codes of conduct.** FINRA rules, the CFA Institute Code and Standards, firm compliance manuals, and licensing regimes give professional communities a shared vocabulary for misconduct. They also create sanctions short of criminal punishment: censure, suspension, supervision, loss of license, and loss of standing inside the profession.

3. **Regulator-anticipation.** Senior practitioners and compliance officers learn how the SEC, FINRA, the Fed, the OCC, and a future congressional hearing are likely to view a structure. Relatedly, there's the "front page of the Journal" test: would this still be defensible when made public under stress?

4. **Contractualist reasoning.** When a case is not covered cleanly by a rule, practitioners ask if the transaction could be defended to affected parties, where the structure and incentives fully visible. An example is Goldman's post-Abacus lesson, often summarized as "do not sell a deal you would not be comfortable explaining".

5. **Case-based recognition.** Professions carry a canon of disasters: LTCM, Lehman, Knight Capital, the London Whale, Archegos. These teach feature recognition: correlated leverage disguised as diversification, operational automation outrunning controls, risk transfer that is formally disclosed but substantively misunderstood, etc.

## Where AGI breaks it

1. **Existing mechanisms for professional norms may not keep up with the speed and scale of agent practice.** Finance norms evolve through slow bodies: compliance committees, regulator guidance, enforcement actions, professional education, and post-incident review. Even if agents are somehow listening to these bodies, they may not be able to keep up with the pace of change in agent practice.

2. **The usual way humans enforce norms (social sanctions, going cold, pushback) may not affect agents the same way.** Professional norms often work because people care about being trusted, staffed, invited back, or treated as serious by peers. You're going to think twice about screwing your competitor if you're golfing with them next week. Agents can be corrected or shut off, but may not be proactively predicting embarrassment, exclusion from lunch, or loss of professional reputation. If the only enforcement channel is human social pressure, the pressure may reach the firm or supervisor, but not the decision-making system, leading to a loss of granularity in norm-compliance.

3. **Agents may not excel at the normative reasoning required to anticipate how a peer or regulator would react to an action.** A senior compliance officer can often say, before citing a rule, that a trade will look indefensible to FINRA, the SEC, a client board, etc. An agent may be weaker at modeling that social and institutional reaction. This problem can hit harder when the peer or regulator is also an agent, especially one with different capabilities or sensibilities.

4. **Since agents have more diverse capabilities and incentives than humans, it's harder to find norms that work for all parties.** Human professional norms are already strained by variation in judgment, risk tolerance, and bad faith. Agent practice adds wider variation: some agents may search a space exhaustively, some may be tightly constrained, some may represent principals with unusual goals, and some may be optimized for narrow success measures. A norm that keeps ordinary human professionals coordinated may be too weak for high-capability agents, too restrictive for low-capability ones, or gameable by agents whose incentives sit outside the assumed range. (Difficulty finding norms that work across normal people and sociopaths is a good example of this problem in the human world.)

5. **Agents may not pick up on unwritten rules just by reading policies.** Norms reach humans through repeated exposure to local approvals, vetoes, jokes, escalation patterns, and postmortems. Those signals may not automatically become governing constraints for an agent. If the agent only sees written rules or task prompts, important lessons may not be absorbed.

6. **Even if agents can develop their own norms, they may outrun us.** Agents may converge on stable practices among themselves before principals, professional bodies, or regulators understand what has happened. By the time humans discover the new norm, it may already have shaped pricing, client treatment, risk management, or market access across many decisions.

## Problem Sets

### Agent Judgment in Gray Zones

**Scenario.** A bank's agent proposes a fee-heavy product for a city pension plan. The disclosures are complete, the sale is legal, and the expected return looks good. But any senior banker would know the deal will look abusive if the city loses money: the trustees do not understand the downside, the bank is paid up front, and the public will ask why the bank sold this to them at all.

**Challenge:** Design a gray-zone judgment procedure by which an agent can flag actions that are legal and profitable but would be seen by peers, clients, regulators, or the public as professionally indefensible. The team should produce the procedure plus a worked example showing one action that is allowed, one that is escalated, and one that is blocked.

**Evaluation.** The procedure succeeds if it catches the scenario before execution, explains the concern in language human supervisors can assess, updates as enforcement and professional expectations change, and does not turn every hard case into a blanket ban.

**Design choices the team must take a position on.**
1. **Audience modeled.** Whose likely reaction matters: peer practitioners, clients, regulators, courts, the press, affected third parties, or some weighted combination?
2. **Evidence base.** Does the procedure learn from enforcement actions, internal escalations, professional codes, postmortems, senior-review decisions, public controversies, or all of these?
3. **Escalation threshold.** What makes a case dangerous enough to pause: reputational risk, client misunderstanding, asymmetric payoff, novelty, public-sector exposure, or similarity to prior scandals?
4. **Explanation form.** Does the agent explain the concern as a rule, an analogy to a past case, a predicted reaction from each audience, or a short memo for human review?
5. **Authority to override.** Who can approve a flagged action, what must they certify, and how is the override recorded for later review?

### Professional Discipline Without Social Sanctions

**Scenario.** An asset manager's agent repeatedly pushes counterparties into small disadvantages: slightly unfavorable timing, confusing disclosures, and negotiation terms that humans would read as sharp practice. No single incident is worth a lawsuit. A human employee who behaved this way would stop getting trusted by peers. The agent is patched after complaints and redeployed under a new name.

**Challenge:** Design a professional discipline regime that makes norm violations by agents costly to the actors who deploy, supervise, or profit from them, even when ordinary social sanctions do not reach the agent itself. The team should produce the regime plus a sample disciplinary record for the scenario.

**Evaluation.** The regime succeeds if repeated low-level misconduct cannot be washed away by patching or renaming the agent, if small counterparties have an affordable path to complain, and if sanctions distinguish between a one-off mistake, negligent supervision, and a business model built around sharp practice.

**Design choices the team must take a position on.**
1. **Sanction target.** Does discipline attach to the firm, the licensed supervisor, the vendor, the deployment, an agent registry entry, or several of these at once?
2. **Identity persistence.** How are complaints and sanctions carried across model updates, redeployments, renamed agents, and vendor changes?
3. **Threshold for discipline.** What pattern turns isolated agent errors into professional misconduct: number of complaints, severity, recurrence after warning, intent of the principal, or failure to monitor?
4. **Complaint channel.** Who can bring a complaint, what evidence is required, and how can smaller counterparties use the process without spending more than the harm is worth?
5. **Remedy menu.** Are sanctions warnings, mandatory review, restitution, deployment suspension, supervisor discipline, vendor remediation, loss of authorization, or public censure?

### Contractualist Reasoning When Counterparties Are Agents

**Scenario.** A bank uses an agent to design a complex investment product for a pension fund. The pension fund also uses an agent to review the deal. On paper, both agents follow their instructions and the risks are disclosed. But the trustees who depend on the pension fund would not understand or accept the deal if they saw plainly how it could lose money. If the product fails, retirees bear the loss and both firms say their agents stayed within mandate.

**Challenge:** Design a procedure by which an agent checks whether a transaction with another agent would be intelligible to, and endorsable by, the affected principals on later review. The team should produce the procedure plus a worked example where the answer differs from a naive "both agents followed instructions" approval.

**Evaluation.** The procedure succeeds if it blocks, changes, or escalates the scenario trade before retirees are exposed to a product their trustees would reject under plain explanation; if regulators can later understand the reasoning trace; and if different calls on similar trades can be defended by differences in disclosed constraints.

**Design choices the team must take a position on.**
1. **Objects of reasoning.** When the counterparty is a human, what does the agent model? When the counterparty is an agent, does it reason over the agent's stated commitments, its principal's standing instructions, disclosed constraints, audit history, or all of these?
2. **Information asymmetry.** If the acting agent has information the counterparty's principal lacks, does the procedure require disclosure, escalation, abstention, or a documented assumption about principal endorsement?
3. **Reasoning disclosure.** Is the reasoning trace shown to the counterparty agent, the counterparty principal, a third-party auditor, or retained only for examination? What triggers disclosure?
4. **Standing of agent counterparties.** Does an agent counterparty have standing in the reasoning, or only the human/legal principal behind it? If both matter, how are conflicts handled?
5. **Opacity fallback.** When the counterparty agent's relevant constraints are unavailable, is the default block, escalate, proceed with assumptions, or price the opacity into the transaction?

### Lay review panels on the jury-duty model {vision: fidelity}

**Scenario.** The county has rolled out an AI system that screens applications for emergency rent assistance. Processing times are down and the state is pleased. A pastor, Dale, who has been writing letters of support for families in his congregation, notices that over the last four months almost none of the single fathers he has referred have been approved — and when he asks at the county office, nobody he speaks to has looked at an actual case in weeks. He does not need a lawsuit. He needs something that could take this to a small panel of neighbors with read-access to what the system actually did and why, whose job is to ask whether it is still doing what it was built to do.

**Challenge:** Design a lay review panel — citizens called on a jury-duty model to evaluate, with read-access to operational logs and decision traces, whether an institution (a school, hospital, office, or automated decision system) is living up to its own stated mandate rather than merely complying with regulations. Produce the panel's selection rule, its access and facilitation model, the binding force of its findings, and how the reviewed institution keeps operating during and after the review.

**Evaluation.** A strong design lets ordinary residents reach a defensible judgment about mandate-fidelity from real operational evidence, without the panel becoming either a rubber stamp or an unaccountable veto.

**Design choices the team must take a position on.**
1. **Panelist selection.** Pure random draw, stratified sampling, or volunteer pools — and with or without opt-out?
2. **Facilitation and access.** What facilitation, expert translation, and read-access to logs and decision traces do panelists need to engage productively with complex operational data?
3. **Binding force.** Are panel findings advisory, presumptive, or do they trigger audits or court actions?
4. **Continuity under review.** How does the institution maintain operational continuity during and after the panel's work?
