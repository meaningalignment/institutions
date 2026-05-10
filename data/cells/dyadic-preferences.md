# Agent negotiation & bargaining

## How humans solve this today

When two people negotiate on each other's behalf — a real-estate agent, a divorce lawyer, a procurement officer — the human practice has a few load-bearing features. Negotiators carry an explicit *mandate* from their principal: a price range, a list of dealbreakers, a few items flagged "ask me." They negotiate at human speed, which means principals can be looped in mid-deal when something unexpected comes up. Final terms are presented in a *legible package* — an offer letter, a marked-up contract, a one-page summary — and ratification means the principal actually reading it before signing. Where the package is too complex to read (a corporate merger, a union contract), institutions have grown around it: lawyers explain, ratification votes happen with discussion, regulators review. The point is not that any of this is fast, but that the principal can actually consent to what they signed.

A vivid case: Priya's mother needed an extra year of mortgage rate-lock when their refi hit a delay. Priya's broker spent two days finding a lender who would do it, came back with three options on a single sheet — rate, fees, the unusual condition each one carried — and Priya picked the middle one over coffee. The deal was complex, but the broker had already pre-filtered down to the choices Priya could actually evaluate.

## Where AGI breaks it

When agents negotiate on behalf of human principals, three things change at once: the search space gets vastly larger, the deals get faster, and the *ratifiable summary* becomes harder to construct. Specific failure modes:

1. **Pareto-improving but unauthorized.** Agents discover bundle deals (price concessions in exchange for data-sharing terms, or service tier in exchange for renewal length) the principal never explicitly authorized trades across. The deal is genuinely good, but the principal can't tell which trades are theirs to validate.
2. **Asymmetric model exploitation.** Each agent has a richer preference model of its own principal than the counterparty knows. Without protocol constraints, an agent can extract surplus by exploiting what the other side's agent doesn't know about its own principal's true bottom line.
3. **Ratification reduced to a coin flip.** Principals are asked to ratify in minutes a deal whose reasoning they can't follow. "Informed consent" — the legal fiction that has done so much work in human negotiation — quietly stops meaning anything.

A scenario: Priya's mother needs a live-in aide, and Priya's assistant agent has been talking with three care-agency agents for two days. This morning it surfaces a bundled proposal — one agency takes the live-in role, plus weekly grocery runs, plus coordinating with her mother's cardiologist — at a discount, if Priya commits for twelve months and accepts a switch of the primary aide. The deal is objectively better than the quotes Priya got herself last month. Ratification window closes at noon. Her mother is waiting. Priya needs to know, in the ten minutes before her daughter's parent-teacher conference, whether the trade-offs her agent just made are ones she would have made herself.

## Problem Sets

### Agent Negotiation Under Principal Opacity

**Anchor contexts.** A consumer-side personal-assistant agent negotiating long-term care or insurance bundles with provider agents; a small-business procurement agent buying logistics services from a multi-product enterprise agent.

**The gap.** We lack a negotiation protocol between AI agents acting for human principals such that ratification of the final package is meaningfully informed even when the principal cannot follow the reasoning that produced it.

**Design choices the team must take a position on.**
1. **Authorization granularity.** Does the principal pre-authorize categories of trade-offs (price ↔ data, price ↔ duration), or must each cross-domain bundle return for fresh approval?
2. **Disclosure minimum.** What is the smallest summary the agent must surface for ratification to be non-trivial — counterfactual ("here's what you'd have gotten without the bundle"), pareto-frontier ("here are the three deals on the frontier you ended up at"), or trade-table ("here's what we gave up where")?
3. **Symmetry mechanism.** How do you prevent each agent from exploiting asymmetric knowledge of its own principal — a clearinghouse with sealed bids, a "best alternative to" disclosure rule, a third-party auditor?
4. **Time pressure handling.** Is there a minimum ratification window that scales with the surprise-magnitude of the deal, and who computes "surprise"?
5. **Default on non-ratification.** If the principal doesn't engage in time, does the deal lapse, fall back to a pre-authorized default offer, or go to a human surrogate?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A 30%-better bundle deal arrives with cross-domain trades the principal never anticipated; the principal correctly accepts or rejects within the window.
- Both agents have private information about their principals' true preferences; neither can extract more than ε of the surplus that mutual disclosure would have allowed.
- The principal is on a flight when the deal lands; the system handles it without committing the principal to terms they would have rejected.
- An adversarial counterparty agent crafts a bundle designed to be hard to summarize; the disclosure rule still produces something a non-expert can act on.

**Deliverable.** The negotiation protocol, plus the minimum-disclosure spec, plus a one-paragraph statement of what "informed consent" means in this regime — and how that differs from the standard principal-agent literature.
