# AIs that follow and update the law

## How humans solve this today

The administrative state's job is to apply law to cases — and to keep doing so as the law changes. The mechanisms are well developed: legislative bodies pass statutes, agencies publish implementing regulations, regulated entities and the public read the published codes, and courts adjudicate disputes about what the text actually requires. When a statute changes, agencies issue updated guidance, train staff, and (where it matters) accept a transition period during which the old rule applies to in-flight matters. The whole pipeline depends on the people applying the law actually knowing what the current rule is — and on a clear chain of accountability when they don't.

A vivid case: When Yvonne's city council updated the zoning code last spring, the planning department issued a new version of the permitting handbook within a month, the senior planners briefed the junior ones, and a transition memo specified which applications would be reviewed under the old code. Mistakes still happened, but you could trace them.

## Where AGI breaks it

When the agents administering the law are AI systems trained on text — municipal codes, agency handbooks, case law — keeping them current is a different kind of problem:

1. **Training cutoffs are not updates.** An agent trained on last year's code doesn't *know* the new code exists. Unlike a human who reads an updated handbook, the agent's prior beliefs are baked in.
2. **Confident application of stale rules.** The agent doesn't say "I'm not sure"; it applies the rule it knows with the same fluency, masking the fact that the rule changed.
3. **Conflict-detection is missing.** A human planner who reads a new ordinance and then a permit can spot when the two are in tension. An agent applying the rule to a stream of applications may never notice the new statute conflicts with the old one it's invoking.
4. **Update propagation has no obvious owner.** When the council passes a change, who is responsible for ensuring the permitting agent — possibly hosted by a vendor, possibly retrained on a quarterly cycle — actually applies the new rule? The accountability chain is broken.

A scenario: A city's permitting agent has been processing building applications under zoning rules that were rewritten last spring. A neighborhood association notices that its historical-district protections — which they spent five years getting on the books — are not being applied to three new approvals. The agent, it turns out, was trained on last year's municipal code and has been applying the old rules with polished confidence. The association's chair, Yvonne, needs more than a bug fix. She needs to know that when the council passes something, the agents that administer it actually know — and that if the agent's reading conflicts with the statute, someone is checking.

## Problem Sets

### Propagation and Conflict-Detection for Law-Administering Agents

**Anchor contexts.** A city's permitting agent that must apply current zoning, building, and historical-district codes; a state's benefits-eligibility agent that must apply current statute and administrative rule.

**The gap.** We lack a propagation regime by which legislative changes reliably bind the AI agents administering the law within a specified time, plus a conflict-detection regime that surfaces when the agent's behavior diverges from current statute.

**Design choices the team must take a position on.**
1. **Update mechanism.** Periodic retraining, in-context retrieval at decision time, mandatory re-certification on change, or a layered combination?
2. **Update SLA.** How long after a statute changes must the agent's behavior reflect it — same day, 30 days, tied to severity? Who is accountable for missing the SLA?
3. **Conflict detection.** Who runs ongoing checks that the agent's outputs are consistent with current statute — the agency, an oversight body, third-party auditors? On what cadence and with what sample design?
4. **In-flight matter rule.** When the law changes mid-application, does the agent apply the old or new rule? What's the analog to administrative law's transition-handling, and who promulgates it?
5. **Liability for misapplied old rules.** When the agent has been applying stale rules for a quarter, what's the remedy for affected applicants — reversal, compensation, both? Who pays — the city, the vendor, both?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The council passes a zoning amendment Tuesday; by some defined deadline the permitting agent applies the new rule, verifiably to an outside auditor.
- Three permits were issued under the old rule between the amendment and the update; the affected neighborhood association has a clear, fast remedy path.
- The new rule conflicts with an older state statute the agent is also applying; the conflict is detected by the regime and escalated to humans.
- The vendor that maintains the agent goes out of business mid-update-cycle; the city has continuity options that don't require re-tendering before the next deadline.
- An auditor running a sample test finds the agent applies the rule correctly in 99% of cases but fails on a specific edge case; the procedure handles surfacing, fixing, and remediating the affected past decisions.

**Deliverable.** The legal-update regime — update mechanism, SLA, conflict detection, in-flight matter rule, liability allocation. Designed for municipal-administration agents (permitting, code enforcement, benefits adjudication). Identify which provisions have no analogue in how human administrators are updated.
