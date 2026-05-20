---
human_label: "Diplomatic protocols & soft-law norms"
status: summary_ok
owner: oliver
starred: true
---

# Geopolitical supernegotiation

## At a glance

### Coordination challenge

How states settle on expectations of conduct toward each other without a global enforcer.

### Examples

- Diplomatic protocol
- Customary international law
- Nuclear taboo
- Just-war norms

### How AGI breaks them

- Agents could search the coalition space much faster than humans, but no ratification chain exists to handle deals at that speed.
- Agents could find better deals, but the case for them can be too complex for any parliament to evaluate.
- Agents could more effectively launder unacceptable concessions into deals through their size and complexity.
- Diplomatic statements and declarations bind because issuing them costs political capital, and agent-drafted versions cost nothing.

## How humans solve this today

There is no global enforcer, so states behave themselves by accumulating a track record: every public action becomes a precedent that other states cite back at them later, and breaking expectations costs credibility on every other negotiation a state is in. Some examples of how norms get enforced this way:

- **Diplomatic protocol.** A shared grammar for signaling intent in graduated steps, so escalation walks down a staircase whose every rung has a recognized meaning. The same grammar runs in reverse for de-escalation: peace negotiations move through layered tracks (unofficial back-channels, then serving officials in personal capacity, then formal talks), so concessions can be tested deniably before anyone is publicly committed.
- **Customary international law.** When behaviors get repeated long enough (freedom of navigation, diplomatic immunity, non-refoulement), they harden into law without any single ratification moment.
- **The nuclear taboo.** The convention, sustained since Hiroshima, that nuclear weapons are categorically different from conventional ones — a threshold no leader can cross without becoming a pariah. It holds because every year of non-use raises the cost of being the first to break the taboo.
- **Just-war norms (*jus ad bellum*, *jus in bello*).** These constrain force by controlling its justification. A state that cannot frame its war in this vocabulary loses legitimacy at home and abroad, which makes the war harder to sustain.

A vivid case: in 1990, Iraq's invasion of Kuwait violated the postwar norm against territorial conquest. The U.S. and U.K. went to the UN Security Council, securing Resolution 678 as explicit *jus ad bellum* authorization. The coalition then stopped once Kuwait was liberated rather than pushing on to Baghdad, honoring the *ad bellum* limit.

## Where AGI breaks it

A capable AI mediator can search the agreement space far faster than any human delegation, and find genuinely better deals — but the domestic-legitimacy machinery cracks on what it returns:

1. **Cross-domain bundles bypass mandate.** AI can find Pareto-improving packages that link fisheries, education, infrastructure, and migration in ways no negotiator was authorized to consider — and which no parliamentary committee was set up to evaluate as a whole.
2. **Reasoning is illegible to the political process.** Even if the deal is good, the *case for it* may rest on combinatorial reasoning that no domestic constituency can absorb in time. Ratification becomes ratifying the AI's judgment, not the substance.
3. **Speed pressure compresses domestic consultation.** The other side accepted in an hour; your government is expected to respond in days, not the months traditional norm formation assumed.
4. **Laundering becomes possible.** A politically toxic concession can be smuggled inside a complex bundle that nobody on either side wants to publicly defend in pieces — but everyone benefits from in aggregate. Soft law has no good defense against this.

## Scenarios

Two neighboring countries have been locked for three years over a shared river basin — irrigation, hydropower, fishing downstream, a dam one side wants to raise. A bilateral AI mediator, negotiated in by both foreign ministries, returns a surprising proposal: drop the dam question entirely, fold in a joint university exchange, a cross-border rail subsidy, and a migratory-bird corridor no one had mentioned. Run the simulations and it's Pareto-better for farmers, fishers, and taxpayers on both sides. But neither country's negotiators were mandated to trade on universities or rail. Parliament could ratify the original dispute; nobody knows what to do with this. Bea, the lead mediator on the host side, has to decide this week whether to put it forward.

## Problem Sets

### Legitimacy Constraints on AI-Discovered Agreements

**Anchor contexts.** A bilateral AI mediator surfacing cross-domain river-basin packages between two states; a multilateral AI assisting a climate-finance negotiation that proposes linkages with intellectual-property and migration policy.

**The gap.** We lack a legitimacy framework under which AI-discovered international agreements that exceed the negotiators' mandates can be promoted to legitimate proposals — without the framework itself becoming a vector for laundering politically unacceptable trades through technical complexity.

**Design choices the team must take a position on.**
1. **Search-stage permission.** Is the AI mediator allowed to search across all linkable domains, only across pre-declared domains, or across a "core plus declared optional extensions" with each extension flagged?
2. **Filter-stage authority.** Who decides which AI-discovered packages are even shown to negotiators — the negotiators themselves, an inter-ministerial committee, or a neutral third party? What's the audit trail?
3. **Re-mandate pathway.** When a package exceeds mandate, is the path back-to-parliament for an expanded mandate, or back-to-table to strip the unauthorized linkages? Pick one and defend the trade-off.
4. **Disclosure to publics.** What about the AI's reasoning becomes public when, and how — full traces, structured rationales, or summary memos? Where's the line between transparency and hostage-taking by domestic veto players?
5. **Veto allocation.** At each stage (search, filter, ratification), who holds a unilateral veto, and what does it take to override it?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The AI surfaces a clearly Pareto-improving package whose components no individual negotiator was authorized for; the deal reaches ratification (in some form) without requiring extra-constitutional moves.
- An adversarial party uses the AI to discover a package designed to look attractive in aggregate but contains a politically toxic concession on one side; the regime catches the concession before ratification.
- A small state on a multilateral negotiation faces a package designed by a richer state's mediator; the small state's veto is meaningfully informed despite capacity asymmetry.
- One side's domestic political constituency demands renegotiation a year later; the regime supports reopening without unraveling adjacent agreements.

**Deliverable.** A three-stage protocol (search → filter → ratification) with explicit criteria at each gate. Specify who holds veto at each stage and the chain of accountability if a deal that should have been blocked makes it through.
