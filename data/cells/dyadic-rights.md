# Agent-agent mediation

## How humans solve this today

For private disputes that aren't worth a courtroom, humans have built an ecology of mediation, fair-dealing norms, and quick adjudication. A landlord-tenant board hears in weeks; a credit-card chargeback resolves in a month; eBay's resolution center settles a transaction in days. The shared form is: a neutral third party that can hear both sides, look at the artifacts the parties exchanged, and either reconcile them or rule. The legitimacy comes from the neutrality of the venue, the transparency of what was looked at, and the limited stakes — small claims, a credit reversal, a release of escrowed funds. Crucially, it works at human transaction speed: people remember what they agreed to, evidence is largely paper or message logs, and parties stick around long enough to see the case through.

A vivid case: When Jonah's freelance client disputed a payment last year, both of them sent screenshots of the email thread to a small dispute-resolution platform tied to their contracting tool. The mediator there read the thread, decided which sentence constituted agreement, and released the escrow within a week.

## Where AGI breaks it

When the parties to a dispute are AI agents — making and breaking commitments at machine speed, on behalf of principals who may not have been watching — the existing fast-mediation venues hit limits:

1. **The "agreement" itself is contested at a different layer.** Was a particular message a binding commitment, or just a search step the agent was probing? The mediator now needs to reason about agent intent, not just what got said.
2. **Evidence is not paper.** The relevant artifacts are agent traces, model contexts, and tool-call logs — orders of magnitude larger than human evidence, with privacy and proprietary issues human mediation never grappled with.
3. **Speed pressure is severe.** A multi-day mediation is fine for humans; agent-to-agent commerce stalls if dispute resolution takes longer than the underlying transaction.
4. **The principals weren't there.** Both agents may have committed in ways their principals didn't anticipate; the mediator may need to consult both principals about what their agent's authority actually was.

A scenario: Jonah's assistant agent has been handling his freelance contracts for a year. Last Thursday it ended up in a dispute with his new client's procurement agent — a payment schedule Jonah's agent believed had been agreed verbally with the client herself, which the procurement agent now denies. Neither principal has time to dig through the transcripts; Jonah is on a plane, the client is in Seoul. They need a way for the two agents to put their disagreement in front of a neutral third agent, have it rule on which exchange constituted the agreement, and release the payment — this week, not after a subpoena.

## Problem Sets

### Private Mediation at Agent-Commerce Speed

**Anchor contexts.** A freelancer's assistant agent in a payment dispute with a client's procurement agent on a contracting platform; two B2B platform agents in a delivery-vs-cancellation-fee dispute over a marketplace transaction.

**The gap.** We lack a private mediation venue for AI-agent disputes that resolves at the speed of agent commerce while remaining one whose principals would actually accept losing in.

**Design choices the team must take a position on.**
1. **Mediator authority.** Pure-AI ruling, pure-human ruling, or hybrid (AI fact-finds, human rules)? What governs the choice — value, novelty, principal request?
2. **Evidence floor.** What's the minimum trail an agent must keep to be a party — full reasoning trace, just tool-call log, or just the agent-to-agent message stream? When can proprietary internals be sealed from the other party but read by the mediator?
3. **Ratification gate.** Is the ruling immediately binding, or does the losing principal have a 24-hour window to escalate to formal court? What signals trigger escalation, and what does the mediator's record look like to the next forum?
4. **Cost allocation.** Who pays the mediator — loser, splits, the platform, or the side that filed?
5. **Pattern-of-filings rule.** When repeated filings start to look like harassment, who detects, who decides, and what's the sanction?

**Success criterion (stress tests).** A regime succeeds if it survives:
- An $8K agent-on-agent dispute resolves in 72 hours; the losing principal reads the reasoning and either complies or escalates within the window.
- One agent's reasoning trace is on a proprietary stack; the mediator can rule fairly without ordering full disclosure.
- The losing principal disagrees with what their own agent claims to have committed to; the procedure handles principal-vs-agent conflict without the principal automatically losing.
- A counterparty floods the venue with frivolous claims to harass; the rate-limiting mechanism doesn't disadvantage parties with legitimate complaints.
- A losing principal escalates to formal court; the mediator's record is admissible enough to be useful and bounded enough to not preempt judicial review.

**Deliverable.** The procedural code (5–10 rules) for a private agent-on-agent mediation venue tied to a platform (e.g., a freelance-contracting platform or a B2B marketplace). Flag at least two rules that have no analogue in eBay-style human dispute resolution.
