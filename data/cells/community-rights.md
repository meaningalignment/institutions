# AI judges and adjudication

## How humans solve this today

Communities resolve everyday disputes through institutions calibrated to their stakes: small-claims court, municipal code enforcement, marketplace dispute-resolution panels, the local mediator, the rabbi or imam, the homeowners' association board. Each handles a different magnitude of conflict — eviction, code violation, marketplace return, congregational disagreement, neighbor noise — and each carries some version of the same procedural commitments: the affected person can be heard, the basis of the decision is articulable, and there's some path to appeal a clear error. The community courts work in part because the judge is somebody's neighbor; the procedures matter, but so does the social embedding.

A vivid case: When Maggie's prior shop had a dispute with a supplier two years ago, she went to small-claims court. The hearing took ninety minutes, the judge wrote a one-page reasoning, and the appeal rights were on the back of the order. Whatever else was wrong with the process, she knew what had happened and why.

## Where AGI breaks it

When the everyday adjudicators of community life become AI systems — fraud-detection agents, marketplace dispute resolvers, content moderators, automated benefits adjudicators — the procedural commitments developed for human judges quietly stop applying:

1. **No legible reasoning, no appeal floor.** The decision arrives as a result, not as a reasoned ruling. Whatever was weighed, by what rule, with what evidence, is invisible. The appeal asks the same opaque process to reconsider.
2. **Speed displaces process.** A seven-second adjudication leaves no time for a human-style hearing — but the consequences (an account freeze, a frozen payout, a content takedown) can be as severe as a small-claims judgment.
3. **Standing is uncertain.** Whom do you appeal to, on what grounds, in what venue? The platform's interface is the only door, and what's behind the door has no procedural commitments by default.
4. **Scale removes social embedding.** A neighborhood judge has reputational accountability to people who use the court; the adjudication agent has no equivalent — its decisions are evaluated against KPIs the affected party has no view into.

A scenario: Maggie's small e-commerce shop runs on a marketplace whose AI agents now handle nearly all disputes — delivery failures, return claims, chargebacks. Last month one of her orders was flagged by the platform's detection agent as fraudulent; her account was frozen, her inventory locked, and when she appealed, an adjudication agent reviewed the case in seven seconds and upheld the freeze. She doesn't know what reasoning it used, what evidence it weighed, or whom to appeal to. Her rent is due. She needs a system where the decisions made about her are legible, contestable, and reviewed by something she can actually address.

## Problem Sets

### Procedural Justice for AI-Issued Community-Scale Decisions

**Anchor contexts.** A marketplace's automated fraud-detection and account-freeze decisions affecting small shops; a content platform's automated moderation decisions affecting independent creators.

**The gap.** We lack a community-scale adjudication procedure for AI-issued decisions (account freezes, content takedowns, benefit denials) that satisfies procedural justice even when speed-of-decision and decision-volume make human-style hearings impossible.

**Design choices the team must take a position on.**
1. **Reasoning floor.** What does an AI-issued decision have to surface to the affected party — full trace, structured rationale citing the rule and evidence, or just a plain-language summary?
2. **Appeal venue.** Same AI re-runs the case, different AI, human reviewer, or hybrid (AI sample + human appeal)?
3. **Provisional remedy.** While appeal is pending, is the action stayed (freeze lifted), partial (limited operations allowed), or upheld?
4. **Class of error and remedy.** A wrongful freeze that costs Maggie a month of revenue — is the remedy reversal, compensation, attribution to the platform, or all three?
5. **Pattern oversight.** Who reviews whether the AI's overall decision pattern is fair, on what cadence, with what authority to constrain the model going forward?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Maggie's account freeze is appealed; she gets a written reasoning within 48 hours that names which transactions triggered the rule and what evidence cleared them.
- A clearly wrongful freeze is detected on first appeal; the freeze is reversed and Maggie is compensated for the lost month.
- A pattern emerges (small shops in one product category get more freezes); pattern oversight catches and surfaces it within a quarter.
- An adversary tries to use the appeal procedure to harass legitimate moderation; the procedure has rate-limiting that doesn't disadvantage parties with legitimate complaints.
- The marketplace updates its fraud-detection model; existing wrongful-freeze decisions are re-reviewed under the new model.

**Deliverable.** The adjudication procedure — reasoning floor, appeal venue, provisional remedy, error class, pattern oversight. Designed for a marketplace or content platform at the millions-of-actions-per-day scale. Identify which provisions have no analogue in small-claims court.
