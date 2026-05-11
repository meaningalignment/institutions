---
human_label: "Elections, deliberative polls & national exchanges"
status: draft
---

# Agents that represent national interests / large groups

## What problems do these institutions solve today?

When a large constituency needs to be represented in a negotiation it can't all attend, humans have evolved layered representation: elected officials, deliberative polls, citizen assemblies, mandate-bound negotiating teams, public-comment periods on proposed deals, and ratification by legislature or referendum. The legitimacy comes from a chain — voters → representative → negotiator → outcome — that each link can in principle audit. Where the constituency is heterogeneous (rural and urban counties, different industries, different income groups), the practice is to bring those differences explicitly into the room: subcommittee structures, regional caucuses, dissents on the record. The system is slow and often imperfect, but the slowness gives the constituency time to notice when their representative is drifting from what they sent them to do.

> [!NOTE]
> When a state delegation negotiates with a federal agency over an infrastructure formula, the lead negotiator carries a written mandate vetted by a legislative committee, returns weekly to the committee with status, and brings the final agreement back for ratification before signing. By the time the deal is announced, the smaller counties have already had their say.

## Where AGI breaks it

When the negotiator becomes an AI agent representing a state, a region, or a large interest group, the slowness that protected the constituency-representative chain is gone — and several mechanisms wobble:

1. **Mandate compression.** A human mandate is partial, ambiguous, and consciously incomplete; the negotiator interprets it on the fly and is held to account afterward. An AI's "mandate" is whatever its objective function approximates, and the constituency has no easy view into what's being optimized vs. averaged away.
2. **Constituency heterogeneity gets averaged.** AI optimizers tend to maximize an aggregate; minority constituencies (smaller counties, harder-hit industries) lose at the average and the system has no native vocabulary for surfacing the loss.
3. **Real-time consultation breaks.** A weekly check-in with a committee can't keep up with an AI negotiator that needs to make tactical concessions in minutes.
4. **Representative drift is invisible.** A human negotiator who drifts from mandate gets called out by adversaries, journalists, or their own staff; an AI's drift is detectable only to those who can read what it's doing — and the constituency rarely can.

> [!WARNING]
> A state government is rolling out a consumer-protection initiative and, for the first time, is represented in the multi-party deals being struck between platform operators and local utility regulators by an AI negotiator. State Senator Fielder, who pushed the bill, watches it work through the first dry run and feels a tight mix of pride and worry. The agent is faster and better-briefed than any staff she could afford; on paper, it secures terms she would have pushed for. But it is also making compromises on consumer remedies that she knows her constituents in the smaller counties would not accept. She needs to be sure the agent is representing her state, not optimizing an average.

## Problem Sets

### Representation Without Averaging Out the Minority Constituency

**Anchor contexts.** A US state's AI negotiator representing the state in multi-party deals with platform operators and federal agencies; a regional bloc's AI representing member states in WTO-adjacent trade negotiations.

**The gap.** We lack a representation regime for AI negotiators acting on behalf of geographically or otherwise heterogeneous constituencies, such that minority interests aren't quietly averaged out of the negotiated outcome.

**Design choices the team must take a position on.**
1. **Mandate structure.** Single objective function with weights, multiple constituency-weighted objectives, or veto-bearing constituencies (smaller counties have a "no" they can invoke on specific dimensions)?
2. **Real-time consultation cadence.** What's the protocol for the AI checking back with constituent representatives mid-negotiation — daily summary, threshold-triggered escalation, or pre-defined trade boundaries it cannot cross unilaterally?
3. **Heterogeneity surfacing.** Does the negotiator have to publish, mid-deal, what trade-offs would land hardest on which constituents? Who reads it in time to act?
4. **Drift detection.** Who has authority to detect that the AI has drifted from mandate, on what evidence, with what fast remedy (instructed to renegotiate, suspended, replaced)?
5. **Ratification structure.** Who ratifies — elected officials only, elected officials plus a constituency-weighted vote, referendum on contested deals?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A deal is reached that benefits the state on average but hurts the smallest counties; the procedure surfaces this clearly and gives those counties a meaningful path to object before ratification.
- The AI reaches a tactical compromise mid-negotiation; the consultation protocol either approved it within mandate or it's flagged for review within hours, not weeks.
- An adversary negotiator tries to exploit a tight ratification window; the procedure has a fallback that protects the state from being locked into something the constituency would reject.
- The AI is replaced or updated mid-negotiation; mandate continuity holds and counterparties cannot exploit the transition.
- A constituency representative is unreachable when the AI needs a check-in; the default isn't "agree to whatever," but a substantive fallback that errs toward the constituency.

**Deliverable.** The representation regime — mandate structure, consultation cadence, heterogeneity surfacing, drift detection, ratification. Designed for a US state delegation negotiating with a federal agency or platform consortium. Identify which provisions have no analogue in human delegated negotiation.
