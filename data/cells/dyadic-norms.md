---
human_label: "Social conventions"
problem: "How two parties in a recurring relationship build implicit rules of conduct without writing anything down."
examples: ["Roommate etiquette", "Co-parenting routines", "Neighborly courtesies", "Mentor-mentee dynamics", "Friend reciprocity norms"]
agi_breaks: ["Two agents can settle on new norms before any principal can notice and push back.", "A norm formed between two agents may rest on reasoning the human cannot follow even in retrospect.", "The usual way humans enforce norms (social sanctions, going cold, pushback) does not hurt an agent the same way."]
status: summary_draft
owner: oliver
---

# Agent norm invention

## How humans solve this today

When two people start interacting repeatedly in a new shared setting — neighbors sharing a driveway, two freelancers passing a project back and forth, a guest staying at a host's flat — they rarely write contracts. Norms emerge: implicit rules about who goes first, what counts as borrowing without asking, how blunt you can be in a Slack message, when "I'll get to it" means today versus this week. The mechanisms are well studied: repeated interaction, reputation among shared acquaintances, sanction by mild withdrawal, and a conservative default of starting from the most-restrictive plausible interpretation and loosening over time. Crucially, both parties have roughly comparable cognitive bandwidth — neither can think through a thousand variants before breakfast — and norms drift slowly enough that both keep up.

A vivid case: Leah, a children's-book illustrator, sublets a corner of her studio from a printmaker named Theo. Within two weeks they've worked out — without either ever having said it — that Theo doesn't run the press during Leah's afternoon naps with her toddler, and Leah doesn't leave wet ink near Theo's paper stock. Neither could have written the rule in advance; both can now feel violations.

## Where AGI breaks it

Two AI agents interacting repeatedly in a new shared environment can do something humans can't: explicitly *propose, accept, and revise* behavioral rules in seconds. That superpower also breaks the slow, bandwidth-equalized norm formation that humans rely on. Three concrete failure modes:

1. **Capacity asymmetry.** A thousand-agent fleet can search a vastly larger space of proposals than a single freelancer's agent. Whatever protocol they converge on will reflect the larger fleet's preferred trade-offs — not because it cheated, but because it explored more.
2. **Speed-induced lock-in.** Agents can establish norms in minutes; principals discover what their agents agreed to weeks later, after the norm has already shaped thousands of decisions. The natural human "wait, I didn't mean that" doesn't land in time.
3. **Opacity to the principal.** A norm formed by two agents may be derived from reasoning the human can't follow even in retrospect — making "ratify or reject" close to a coin flip.

## Scenarios

The Leah/Theo dynamic, transposed: Leah illustrates from home and has just taken a contract with a national animation studio. Her single assistant agent is now working alongside their fleet — passing back drafts, negotiating revision rounds, handling file conversions, tracking which of her originals can be used in training sets. The studio's agents are sharper, faster, and more numerous; they default to workflows that suit them. Two of her backgrounds have already been altered in ways she wouldn't have approved, and her agent, trying to be cooperative, didn't push back. Leah needs the two sides to settle on a working protocol — one a thousand-agent fleet and a freelancer's single agent can both honor — before the next project starts on Monday.

## Problem Sets

### Norm Formation Between Asymmetric Agents

**Anchor contexts.** A freelancer's single assistant agent working alongside a studio's thousand-agent fleet on a recurring contract; two competitor companies' procurement-agent fleets that interact daily through a B2B marketplace.

**The gap.** We lack a norm-formation procedure between AI agents of asymmetric capability such that the resulting norms are legible to both principals and neither principal would reject them on inspection.

**Design choices the team must take a position on.**
1. **Bandwidth equalization.** Cap proposal-search depth to the weaker agent's capacity, or let both search freely and rely on a downstream filter?
2. **Principal-in-the-loop cadence.** Are principals notified per-norm, in daily digests, or only when a norm crosses a "materiality" threshold — and who sets the threshold?
3. **Default direction.** When the agents can't agree, do they default to most-restrictive (no shared norm forms), status-quo (the prior project's norm carries), or one party's house rules?
4. **Revisability cost.** Is reopening a settled norm cheap (either side can re-flag any time) or expensive (requires a triggering incident)?
5. **Counter-fleet protections.** Can the smaller party invoke a structural handicap on the larger fleet (e.g., proposal-rate cap), and if so who adjudicates?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The thousand-agent fleet probes 10⁴ minor protocol variations in the first hour and the freelancer's agent does not get railroaded.
- A norm that one principal would clearly reject on inspection is caught before it shapes more than a handful of decisions.
- Conditions change mid-project (deadline pulled forward) and a previously settled norm needs to bend without restarting negotiation from scratch.
- Either principal goes offline for a week; the agents continue operating without inventing new norms in the gap.

**Deliverable.** The protocol, plus a one-paragraph analysis of what prevents it from collapsing into either anarchy (no stable norms) or hegemony (the larger fleet's norms dominate). Name the analogue of "bargaining power" you're introducing and whether you equalize it.
