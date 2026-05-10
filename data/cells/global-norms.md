# Geopolitical supernegotiation

## How humans solve this today

Diplomatic norms and soft-law frameworks have evolved across centuries to handle the central problem of international agreement: states bargain through delegated negotiators whose mandates are bounded by domestic politics. Treaty texts circulate, working-group proposals are leaked deliberately to test domestic reception, "Track II" back-channels probe the space of what's actually possible, and legitimacy comes from a careful sequencing — exploration by negotiators, agreement at the table, then ratification by parliament or referendum. The norms about what topics can be linked (security and trade, but cautiously), what constitutes a credible signal, and when a side can walk away without losing face are mostly unwritten and learned slowly by professionals. The system is famously slow, but its slowness does work: it gives domestic constituencies time to absorb what's being agreed to, and it forces negotiators to bring back deals that look like the deals they were authorized to seek.

A vivid case: A bilateral fisheries dispute between Norway and Russia in the 1990s was resolved through a working group whose drafts were tested against parliamentary committees on both sides for months before the final text was tabled — the negotiators knew within a few percent what each side could ratify before they agreed.

## Where AGI breaks it

A capable AI mediator can search the agreement space far faster than any human delegation, and find genuinely better deals — but the domestic-legitimacy machinery cracks on what it returns:

1. **Cross-domain bundles bypass mandate.** AI can find Pareto-improving packages that link fisheries, education, infrastructure, and migration in ways no negotiator was authorized to consider — and which no parliamentary committee was set up to evaluate as a whole.
2. **Reasoning is illegible to the political process.** Even if the deal is good, the *case for it* may rest on combinatorial reasoning that no domestic constituency can absorb in time. Ratification becomes ratifying the AI's judgment, not the substance.
3. **Speed pressure compresses domestic consultation.** The other side accepted in an hour; your government is expected to respond in days, not the months traditional norm formation assumed.
4. **Laundering becomes possible.** A politically toxic concession can be smuggled inside a complex bundle that nobody on either side wants to publicly defend in pieces — but everyone benefits from in aggregate. Soft law has no good defense against this.

A scenario: Two neighboring countries have been locked for three years over a shared river basin — irrigation, hydropower, fishing downstream, a dam one side wants to raise. A bilateral AI mediator, negotiated in by both foreign ministries, returns a surprising proposal: drop the dam question entirely, fold in a joint university exchange, a cross-border rail subsidy, and a migratory-bird corridor no one had mentioned. Run the simulations and it's Pareto-better for farmers, fishers, and taxpayers on both sides. But neither country's negotiators were mandated to trade on universities or rail. Parliament could ratify the original dispute; nobody knows what to do with this. Bea, the lead mediator on the host side, has to decide this week whether to put it forward.

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
