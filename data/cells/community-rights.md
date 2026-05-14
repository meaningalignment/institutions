---
agents_label: "Procedural justice at AI speed"
human_label: "Municipal codes & local courts"
problem: "How a city codifies entitlements and runs a forum where residents can claim them against each other and the city itself."
examples: ["Municipal codes", "Local courts", "Zoning boards of appeal", "Tenant tribunals", "Police review boards"]
agi_breaks: ["Filings can be auto-generated faster than dockets can clear.", "Adjudication needs to keep pace with agent transactions.", "Hearing rights presuppose human parties.", "Appeal records are too large to actually be read."]
status: not_started
owner: none
---

# Procedural justice at AI speed

## How humans solve this today

Communities resolve everyday disputes through institutions that combine four layered practices, together calibrated to deliver procedural justice at the magnitudes that matter at community scale.

1. **Graduated forums calibrated to stakes.** Small-claims for monetary disputes under a threshold, municipal court for larger, district court above that, regulators for systemic. Marketplace dispute panels for marketplace returns; the local mediator for neighbor noise; the HOA board for community-living conflicts. Each forum's procedures — cost, speed, formality, evidence rules — are matched to the magnitude of what's at stake, and routing to the forum happens before the dispute is heard.

2. **Procedural commitments embodied in trained practitioners.** The hearing, the articulable basis for the ruling, the path to appeal — these are commitments judges, mediators, and code-enforcement officers carry by professional formation. They didn't have to be separately written into each ruling because the practitioner was trained to perform them.

3. **Social embedding of the practitioner.** Community courts worked partly because the judge was somebody's neighbor; the mediator was part of the community; the HOA board was accountable to members. The decision had a reputational ground that mattered to the practitioner, and the parties had a continuing relationship to the practitioner over time.

4. **Externally legitimate appeal authority.** Appeal flowed upward to a body both parties recognized — district court above small-claims, appellate court above district, regulators above municipal — whose legitimacy didn't depend on its relationship to the original deciding party. The appeal authority was structurally separate from the body whose decision was being appealed.

Together these mechanisms are calibrated to human-pace volumes — small-claims handles hundreds of cases per court per year, district courts thousands, regulators tens of thousands. They were not designed to absorb millions of disputes per day.

A vivid case: When Maggie's prior shop had a dispute with a supplier two years ago, she went to small-claims court — the right forum for the size of the dispute. The hearing took ninety minutes; the judge wrote a one-page reasoning citing the contract; the appeal rights were on the back of the order. Whatever else was wrong with the process, she knew what had happened and why.

## Where AGI breaks it

Several differences between the agent case and the human case load-bear on this cell. Two are about the deployment context the human institutions weren't designed for; three are about the agent as adjudicator.

- **Disputes arise at AI speed and volume.** Marketplace returns, content takedowns and their appeals, fraud-detection actions, agent-to-agent transactional disagreements — the dispute flow itself runs at agent pace, millions of cases per day. Human-paced adjudication is structurally insufficient regardless of staffing; the necessity (not just the option) of AI adjudication follows from this.
- **Behavior shaped by platform/developer instrumentation.** Feedback to the adjudicating agent is the platform's KPIs, not community reputation; the system behind a decision can be updated or kept opaque to the affected parties.
- **Tireless and high-throughput.** The agent can match the dispute flow because it has no fatigue and no per-decision attention budget — but the throughput requirement also means procedure has to fit inside the cycle time of the flow.
- **No community embedding.** Not situated in the community whose disputes are resolved; no neighbor relationships, no congregation membership, no ongoing presence the affected parties can recognize.
- **Not professionally formed.** Procedural commitments — hearing, articulable basis, appeal — aren't carried by training the way they're carried by a judge or mediator; they have to be built in by explicit deployment requirement.

Each of the four practices fails as a consequence:

1. **Graduated forums.** Communities built graduated forums so procedure matched stakes — and the routing happened at human pace, against a human-scale dispute flow. Against AI-speed dispute flow (millions per day), uniform fast handling is the default because there's no time for human-style triage. An agent applying the same procedural form to a $20 return dispute and a month's-rent account freeze isn't doing this from carelessness; it's the structural floor at flow rate. The magnitude-to-procedure calibration has to be rebuilt as something an agent can apply at decision time.

2. **Procedural commitments.** Hearing, articulable basis, and appeal lived in trained practitioners (not professionally formed) operating at human deliberation cadence (no AI-speed dispute flow to absorb). For an adjudication agent the commitments have to be built in as explicit deployment requirements, *and* be generatable inside the per-decision cycle time of the flow. Where they aren't, the decision arrives as a result rather than reasoning, and the affected party has no path to engage what was weighed.

3. **Social embedding.** Community courts worked partly because the practitioner was embedded in the community (no community embedding), so reputation tracked and the decision had a ground that mattered. An adjudication agent's only feedback loop is platform KPIs (behavior shaped by instrumentation), which the affected parties don't have view into. The party standing the procedure assumed — a knowable, continuing counterparty on both sides — is also weakened at platform scale.

4. **External appeal authority.** Appeal in the human case flowed to a body both parties recognized, whose legitimacy didn't depend on the appellant's relationship to the original deciding party. Platform-internal appeal has the appeal authority structurally tied to the deciding party (behavior shaped by instrumentation; the deciding system not transparent to affected parties). The legitimacy human appeal procedures relied on is structurally absent.

## Scenarios

Sketches of how each layer could be rebuilt for agents, given that the human assumptions don't hold. Each is a starting point, not a worked design.

1. **Graduated forums.** Stakes-tier routing built into the deployment, operating at flow rate: a fast classifier at decision time bins each action by consequence-magnitude (low / medium / high), and each tier gets a different procedural footprint. Low-tier decisions get fast auto-handling with summary reasoning and one-click appeal; high-tier (account freezes, irreversible actions, large monetary consequence) routes to a slower track with mandatory human review. The forum-to-magnitude calibration moves from courthouse architecture to a millisecond classifier that has to be right under flow rate.

2. **Procedural commitments.** Built in as explicit deployment requirements *and* generatable at decision speed: every AI-issued decision must surface what rule was triggered, what evidence weighed for and against, and the affected party's right of response, in language at a defined comprehension level — produced at the cycle time of the flow, not deliberated post-hoc. The commitments are audited by an external party on a defined sample. What the human practitioner carried by training, the deployment carries by specification, audit, and per-decision generation.

3. **Social embedding replaced by structural accountability.** Since the agent isn't situated in the community, the ongoing accountability that came from the practitioner being known and watched has to be relocated. An independent ombudsman or industry-wide standards body with pattern-oversight authority; required publication of aggregate decision patterns; standing for affected-community representatives to bring systemic concerns. The relationship the community had with the judge becomes a relationship the community has with an oversight body.

4. **External appeal authority.** A genuinely independent appeal floor with binding force — not "the same platform's appeal model" or "a different model on the same platform" but an externally legitimate body (sectoral ombudsman, regulator-adjacent panel, recognized arbitration association) whose legitimacy doesn't depend on its relationship to the platform. Appeals to this body have binding force on the platform, and pattern-level findings carry remediation authority.

## Problem Sets

### Routing AI-Issued Decisions to Procedure-Appropriate Forums at Flow Rate

**Anchor contexts.** A marketplace whose AI fraud-detection agent can take actions ranging from a delayed payout to a month-long account freeze, at millions of decisions per day; a content platform whose moderation agent issues actions from temporary mute to permanent ban, at the same scale; an agent-mediated transactional layer where disputes between principal-agent pairs arise at agent pace.

**The gap.** Human communities built graduated forums so procedure matched stakes, and routing happened at human pace against a human-scale dispute flow. At AI-speed flow there's no equivalent triage stage, so the same procedural form applies regardless of stakes — a small dispute and a high-consequence freeze get the same fast adjudication and the same one-line denial. We lack a routing layer that classifies AI-issued decisions by stakes at issuance, *operates inside the decision cycle time*, and triggers procedure-appropriate handling for each tier.

**Design choices the team must take a position on.**
1. **Stakes classification.** Decided ex-ante (defined tiers per decision type) or ex-post (assessed at decision time from features like financial value, irreversibility, account-standing impact)? What's the classifier and who maintains it?
2. **Tier procedures.** What does each tier get — auto-decision with summary reasoning, auto-decision with full reasoning, mandatory hold-for-human, mandatory hold-for-external-review? Define each tier's procedural footprint.
3. **Edge handling.** When a single action could fall in multiple tiers (e.g. small monetary value but irreversible), which tier governs? Default-up (heavier procedure on conflict), default-down, or explicit escalation rule?
4. **Tier updates.** When stakes profiles shift (a new product category has higher real consequence than the original tiering anticipated), who updates the routing rules, on what cadence, and what happens to in-flight decisions?
5. **Affected-party visibility.** Does the affected party know which tier their case is in, and does that disclosure happen pre-decision, at decision, or only on appeal?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A small-monetary dispute gets fast auto-handling; an account-freeze at the same monetary value gets human-mandatory routing because the irreversibility tier is different.
- A new product category emerges (subscription cancellations affecting recurring revenue); the tier rules update within a defined window without retro-litigating pre-update decisions.
- An adversary tries to game tier-routing by structuring complaints to land in lighter tiers; the classification is robust to this.
- A high-tier decision is incorrectly routed to a low-tier procedure; the structure has a path to re-route and remedy the procedural deficit.
- The platform updates its policies; tier-routing reflects the change without disabling existing protections on in-flight decisions.

**Deliverable.** The routing-layer specification — classifier, tier procedures, edge handling, update procedure, affected-party visibility. Plus a sample tiering for one chosen domain (marketplace, content platform, benefits administration) showing how 3–5 concrete decision types route.

### Per-Decision Procedural Floor at AI-Decision Speed

**Anchor contexts.** A marketplace's automated fraud-detection-and-freeze decisions affecting small shops; a content platform's automated takedown decisions affecting independent creators; an automated benefits-eligibility agent's decisions affecting recipients; an agent-mediated transaction layer where the deciding party and at least one disputing party are themselves agents.

**The gap.** The procedural commitments that gave human adjudication its legitimacy — hearing, articulable basis, appeal handoff, provisional remedy — were carried by trained practitioners operating at human deliberation pace and weren't separately specified per ruling. For AI-issued decisions, those commitments have to be built in as explicit deployment requirements *and* be generatable inside the per-decision cycle time of an AI-speed dispute flow. We lack a specification of the procedural floor every AI-issued decision must meet at flow rate, that an affected party can hold the deploying organization to and that a regulator can audit on a sample.

**Design choices the team must take a position on.**
1. **Reasoning surface.** What does each decision surface to the affected party — full computational trace, structured rationale citing the rule and evidence cleared, plain-language summary, or layered (summary by default, trace on request)? At what comprehension level?
2. **Right to be heard.** Pre-decision (the affected party responds before action), post-decision (action is taken with a window to respond), or only on appeal? What's the trade-off at AI-decision speed and volume?
3. **Provisional remedy during appeal.** While appeal is pending, is the action stayed (e.g. freeze lifted), partial (limited operations allowed), upheld with refund-on-reversal, or upheld with no remedy?
4. **Remedy classification.** A wrongful action that costs the affected party a defined kind of harm — is the remedy reversal-only, reversal + compensation, reversal + compensation + public attribution? Are remedies tiered by class of error?
5. **Audit and proof.** How does an affected party (or a regulator) prove the procedural floor was met or not met — required logging, third-party audit access, public sampling of decisions, all of the above?

**Success criterion (stress tests).** A regime succeeds if it survives:
- An affected party's first request after an adverse decision: they get the reasoning in a form they can engage, not platform boilerplate.
- A wrongful action is reversed; the remedy includes the actual cost the affected party bore, not a tokenized refund.
- An appeal is filed against an irreversible action; the provisional-remedy rule reflects the irreversibility.
- A regulator audits compliance with the procedural floor; the platform demonstrates it on a sampled set without leaking confidential model details.
- Adversaries try to abuse the right-to-be-heard procedure to slow legitimate moderation; rate-limiting protects against abuse without degrading access for legitimate complainants.

**Deliverable.** The procedural-floor specification — reasoning surface, right-to-be-heard rule, provisional-remedy rule, remedy classification, audit form. Designed to operate at platform throughput. Identify which provisions have no analogue in small-claims court (and why the human institution could afford to leave them implicit).

### External Appeal Authority with Binding Force at Scale

**Anchor contexts.** A marketplace's freeze-and-takedown decisions; a content platform's moderation actions; a public-benefits agency's automated eligibility decisions; agent-mediated transactional disputes whose volume puts even the *appellate* layer at AI-speed pressure.

**The gap.** Human appeal procedures flowed to authorities both parties recognized — district court, state regulator, recognized arbitrator — whose legitimacy didn't depend on the appellant's relationship to the original deciding party. Platform-internal appeal has the appeal authority structurally tied to the deciding party (the same platform, often the same model family, evaluated against the same KPIs). We lack an externally legitimate appeal floor for AI-issued community-scale decisions, with binding force at the per-case level and pattern-oversight authority at the systemic level — designed to operate against the volume that AI-speed dispute flow produces even at the appellate stage.

**Design choices the team must take a position on.**
1. **Source of legitimacy.** Where does the appeal authority come from — a regulator with statutory authority, an industry-wide standards body (analogous to FINRA for finance), a recognized arbitration association, a publicly chartered ombudsman?
2. **Scope.** Per-case review (an affected party brings their case), pattern-level review (the authority audits the decision pattern across many cases), or both, with what triggers each?
3. **Binding force.** Advisory only (platform may follow), binding on the platform (must comply), binding with penalty (non-compliance carries fine, suspension, or loss of operating license)?
4. **Access threshold.** Who can bring an appeal — any affected party, only those who exhaust platform-internal appeal first, only above a stakes threshold, only with sponsoring counsel? What's the rate-limiting against frivolous use?
5. **Funding and capture-resistance.** Funded by the platforms (capture risk), by a regulatory levy, by affected-party fees (access barrier), or general public funding? What independence safeguards?

**Success criterion (stress tests).** A regime succeeds if it survives:
- An affected party's appeal is heard by an authority whose legitimacy doesn't depend on the platform's cooperation; the decision is binding.
- A pattern of wrongful decisions across many cases is detected; the authority has standing to require the platform to remediate, not just to publish a finding.
- An adversary tries to use the appeal mechanism to harass legitimate moderation; access threshold and rate-limiting handle it without disadvantaging legitimate complainants.
- The authority is challenged for capture (industry-funded); the structure has independence safeguards that hold up under that pressure.
- A platform updates its model; existing decisions that would now be re-evaluated under the new model can be raised to the appeal authority.

**Deliverable.** The external-appeal authority specification — source of legitimacy, scope, binding force, access threshold, funding and capture-resistance. Plus an explicit comparison with how FINRA, state insurance commissioners, or banking ombudsmen handle equivalent appeal functions for non-AI institutions, and what about those institutions doesn't transfer.
