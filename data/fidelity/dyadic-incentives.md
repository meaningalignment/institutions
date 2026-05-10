# Confidence-staked bilateral contracts

**Scenario.** *Raul hires a contractor to renovate his grandmother's kitchen so she can stay in her home another decade. The bid is for materials and hours. The contractor, Dana, is good and has said she'll do right by the project. Six months in, it's over budget, a load-bearing question has been punted, and Raul is no closer to knowing whether his grandmother will actually be able to cook in her own kitchen. Both Raul and Dana would rather be in a deal where Dana stakes something on the outcome he cares about — his grandmother using the kitchen comfortably for ten years — and gets paid more if she delivers, less if she doesn't. Neither of them knows how to write that contract.*

In dyadic commercial relationships — contractor/client, service provider/subscriber, freelancer/buyer — the standard incentive structure pays for inputs or activities, because outcomes are expensive to verify. Suppliers make cheap claims about quality; buyers hedge by writing detailed input specs; both sides drift toward legible proxies rather than the underlying thing the transaction is for.

The design problem: make outcome-based payment credible at bilateral scale, despite expensive measurement and hard-to-verify supplier confidence.

Mechanisms in this family:

- **Proper scoring rules.** A supplier posts a deposit tied to their own stated probability of success; pass and they're rewarded proportional to the stake, fail and they forfeit it. Truthful confidence reporting becomes the supplier's best strategy.
- **Delayed verification.** Short-term payment triggers on contractually verifiable conditions, while longer-horizon outcome measurement updates the supplier's credibility for future engagements.

Design questions:
- When is verification cost low enough for bilateral contracting, and when does it require pooling across contracts (community scale)?
- How do you handle bundled outcomes whose value depends on configuration (proximity, timing, sequencing)?
- What's the role of reputation vs. formal scoring in long-term bilateral relationships — and how should they interact?

Adjacent work: pay-for-success contracts; prediction-market-based payment schemes; insurance-linked risk sharing.
