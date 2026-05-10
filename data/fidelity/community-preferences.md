# Outcome-specified procurement markets

Conventional procurement rewards suppliers who simplify and standardize: buyers specify inputs (hours, deliverables) rather than outcomes, because outcomes are expensive to verify and suppliers stake their businesses on cheap-talk quality claims. The result is a structural tilt away from solutions whose value comes from configuration or context.

A fidelity-oriented replacement pools demand, socializes the cost of verification, and lets buyers specify bundled outcomes (for example: a parent and adult child housed near each other, with sustained in-person contact verified at six months) rather than discrete goods. Suppliers bid on the bundle, with payment tied to whether it's actually delivered.

Design questions:
- How are outcome bundles specified specifically enough for suppliers to bid, but not so narrowly that Goodhart reappears at a higher level?
- How is evaluator capture avoided when the pool pays for evaluation?
- What's the welfare floor for recipients when the market is still learning what works?
- How do existing procurement regimes — public bidding law, Medicaid contracting, insurance markets — interface with an outcome-bundled replacement?

One specific mechanism in this family is the Combinatorial Risk-Sharing Auction (CRSA), which uses confidence staking and socialized verification to address these problems. Adjacent work: pay-for-success contracts, social impact bonds, and advance market commitments (such as the vaccine AMCs).

## Problem Sets

### CRSA for Community Eldercare

**Scenario.** *Westfield is rebidding its eldercare contracts. Under the current arrangement, Dorothy, 84, gets a rotating cast of aides for 45-minute visits; her son David has spent a year trying to get one consistent caregiver assigned, and to get someone on staff to notice that his mother does better on days the neighbor drops in. The quality scores the city tracks are fine; David's mother is not. The new city manager wants to pilot bids that pay for what David is actually asking for — "the same two aides, known to the family, coordinated with the neighbor, confirmed at six months" — instead of hours of service. She has two months and a skeptical council.*

A mid-size city wants to procure eldercare using a pool-based combinatorial auction instead of current bilateral contracts with home-health agencies. Eldercare has exactly the features these markets are designed for: outcomes are hard to measure (wellbeing, continuity of relationship, dignity), value comes from configuration (same caregivers over time, proximity to family, coordinated medical/social/housing), and current bilateral contracts reward modular, standardized service.

**The problem:** Design the first round of the auction.

1. **Bundle specification.** What are the bundles? Individual-level (one elder's full support configuration) or aggregated (all elders in a neighborhood)? How do you specify a verification criterion for a bundle like "sustained relational continuity with weekly in-person contact"?
2. **Value discovery.** Nobody yet knows what a bundled solution is worth vs. modular delivery. Design the value experiment: how do you randomize members across arms to learn, while respecting that members in the modular arm may have worse outcomes? What welfare floor applies?
3. **Bundling transfer.** Estimate the resale-option advantage a modular home-health agency has over a bundled supplier. What goes into the projected-demand and value-per-problem terms here, and where is the estimate likely to be most wrong?
4. **Incumbents and regulators.** Home-health agencies, Medicare/Medicaid, state licensing bodies — all have existing claims and knowledge. How does the pool launch without being blocked, captured, or starved of members?

**Deliverable:** First-round auction design — bundle examples, verification criteria, randomization scheme, transfer estimate. Identify the single hardest measurement problem you couldn't solve, and say what it would take to solve it.
