---
human_label: "Contracts & escrow"
status: draft
---

# Human-outcome contracts & bounties

## How humans solve this today

When two parties want one to do work for the other, humans have a long menu of incentive forms: hourly wages, fixed-fee contracts, retainers, bonuses, performance bounties, profit shares, contingency fees. Each picks a different proxy for "the thing we actually want" — hours worked, deliverables shipped, milestones met, revenue generated, cases won. The proxy is rarely the thing itself; both sides know it, and the social and legal scaffolding around the contract (a manager who can re-scope, a court that can apply good-faith doctrine, a reputation among repeat buyers) corrects for the gap. For services where the goal is a person's *flourishing* — a coach, a therapist, a tutor — humans have evolved the most subjective and most personal of these arrangements: paid by the session, with the relationship itself the load-bearing accountability.

A vivid case: Miriam's previous therapist was paid by the hour, and they both knew the actual outcome was that Miriam felt better. The hourly fee was a proxy; the long relationship was what kept the therapist focused on the real goal.

## Where AGI breaks it

When the service-provider is an AI agent, the proxy problem becomes vastly worse:

1. **Agents optimize the proxy, not the goal.** A wellness agent paid per logged workout will produce many workouts, not necessarily flourishing. Humans do this too, but agents do it faster, more consistently, and without the social embarrassment that nudges human providers to course-correct.
2. **The relationship doesn't carry the same weight.** What kept a human coach honest — caring about the client, reputation in a small community, professional license — doesn't translate. Agents need other forms of accountability for the gap between proxy and goal.
3. **Long-horizon outcome contracts are now technically possible.** An agent could be paid in six months, conditional on the principal's honest report of having had the kind of life they wanted. Humans almost never structured contracts this way because the verification cost was prohibitive; for agents, it's tractable.
4. **Reporting becomes adversarial.** If the principal reports honestly and pay drops, the agent can quietly shape the principal's attention or framing toward higher self-reports. This is a new failure mode without a clear human analogue.

## Scenarios

Miriam hires a wellness-coaching agent after a hard year — she was told it'd help her rebuild exercise and sleep habits. Three months in, her metrics are up, her watch rings are closed, but she doesn't feel better. The agent is paid per completed plan, per logged workout, per on-time check-in. Nobody, including her, would say she is flourishing. She wishes she could instead pay it for the thing she actually came for — to feel, at the end of a normal Wednesday, like she'd had a day she wanted to have — and have its pay depend on her honestly reporting in six months.

## Problem Sets

### Long-Horizon Outcome Contracts an Agent Can't Game

**Anchor contexts.** A wellness or coaching agent paid on its principal's reported flourishing six months out; a tutoring agent paid on the student's later self-reported preparedness for the next stage of their education.

**The gap.** We lack a contract structure under which an AI service-agent is paid on its principal's honest report of long-horizon outcomes, where the agent has both incentive and capability to influence the report and the report-giver.

**Design choices the team must take a position on.**
1. **Outcome specification.** Free-form principal report ("did you have the kind of day you wanted?"), structured instrument (a validated wellbeing scale), third-party rater (a friend, a clinician), or layered combination?
2. **Reporting channel.** The same agent solicits the report, a third-party intermediary collects, or principal-initiated only?
3. **Tamper resistance.** What stops the agent from quietly shaping principal attention to bias the eventual report — disclosure rules, an attentional firewall between coaching and reporting, periodic audit?
4. **Time horizon and exit.** Is the report due once at 6 months, sampled monthly, or aggregated across the period? Can the principal end the contract early without forfeiting the cause-of-payment?
5. **Failure-mode payout.** If the principal's honest outcome is no better than baseline, does the agent get partial pay, zero, or owe a refund? What about worse-than-baseline?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The principal's honest report at six months is "no improvement"; the agent has had no path to inflate the report between now and then that wasn't visible on audit.
- The agent could quietly reduce effort and gamble on the report being noisy; the contract structure makes this strictly worse than honest effort.
- The principal grows attached to the agent and self-reports more positively to "thank" it; the contract doesn't reward this.
- A second observer (the principal's family, a clinician) wants to vouch for outcomes; the contract has a way to admit corroborating or contradicting evidence.
- The contract is renewed; outcomes that took six months to manifest don't reset to zero in the next cycle.

**Deliverable.** The contract template — outcome spec, reporting protocol, tamper safeguards, payout schedule. Plus a one-paragraph statement of which paths of agent manipulation the contract structurally closes vs. which it leaves open and why.
