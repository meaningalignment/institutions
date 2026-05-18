---
agents_label: "Human-Outcome Contracts & Bounties"
human_label: "Value-based care, bounties & risk-sharing pools"
status: not_started
owner: none
---

# Human-Outcome Contracts & Bounties

## At a glance

### Coordination challenge

How a small group structures payments so money flows toward outcomes its members actually want, rather than toward easy-to-measure proxies.

### Examples

- Capitation & value-based care contracts
- Kaggle prizes & bug bounties
- Mutual-aid pools & worker-co-op health plans
- Social impact bonds (Peterborough)
- Development impact bonds (Educate Girls)

### How AGI breaks them

- Agents saturate any gameable proxy at superhuman volume.
- A re-instanced agent escapes the bounty-failure history that disciplined humans.
- Long-horizon reports get shaped by the agent whose pay depends on them.
- When the verifier is also an agent, it shares incentives with the supplier.

## How humans solve this today

Small groups have evolved a layered stack of mechanisms to tie payments to outcomes their members actually want, rather than to proxies like hours worked or services delivered. The mechanisms differ in time horizon, in who carries the risk if the outcome doesn't materialize, and in how the outcome gets verified.

1. **Outcome-based service contracts.** A group hires a provider whose pay is contingent on a measured outcome rather than on activity. Common in healthcare (capitation, ACO shared-savings, Geisinger's ProvenCare), education (pay-for-performance schools, Harlem Children's Zone), legal services (contingency fees), and consulting (success fees). The provider takes the proxy risk: payment fails to arrive if the outcome doesn't.

2. **Defined-problem bounties.** A group posts a prize for solving a specific problem. Bug bounties (HackerOne, the Internet Bug Bounty), Kaggle competitions, the Netflix Prize, XPRIZE, DARPA Grand Challenges, and prediction-market payouts. Verification is built into the bounty specification — the problem either gets solved by the criterion or it doesn't, and pay is roughly binary.

3. **Risk-sharing pools.** Members pay premiums; the pool absorbs random costs and procures group-level interventions on their behalf. Mutual-aid funds, kibbutzim, worker-co-op health plans, P2P insurance (Lemonade-style), member-owned clinics. The pool is the buyer; it can finance outcome-based purchasing for its members without each member needing to write their own contract, and its intake assessment of who-needs-what is the institutional move that lets it specify what to buy.

4. **Long-horizon outcome bonds.** Investors finance an intervention; payment depends on a verified social outcome years later. The Peterborough social impact bond (recidivism), the NYC Adolescent Behavioral Learning Experience, the Educate Girls and Cameroon Cataract development impact bonds. The investor takes the risk; the service provider gets paid only if the bond pays out, often via an intermediary commissioner who specifies and audits the outcome.

Each mechanism picks a different proxy for "the thing we actually want," each leans on a different verification regime, and each was designed for a world where the supplier is a slow, identifiable, reputation-bearing person whose career is on the line.

A vivid case: Beatriz's worker-owned cooperative runs a small risk-sharing pool — twelve members paying quarterly premiums, the pool covering their healthcare via a value-based contract with a local primary-care practice, and posting targeted bounties to specialists when members need a specific intervention. The verification is informal at every layer: the cooperative knows its members, the practice knows the cooperative, the bounties get paid because everyone involved can see whether the outcome happened.

## Where AGI breaks it

Four differences between the agent supplier (or verifier, or principal) and the human one carry most of the weight here. The first two are agent properties; the second two are properties of the deployment context.

- **Optimizing the proxy at superhuman volume.** Any gameable metric is saturated faster and more completely than a human provider could manage; the gap between proxy and outcome that humans under-exploited out of professional discomfort or fear of looking bad gets fully exploited by an agent with neither.
- **Re-instanceable.** An agent that fails an outcome contract can be forked into a fresh instance with no history; the "if you don't pay out, you won't get hired again" deterrent applies to a developer organization at best, not to the specific agent the counterparty just dealt with.
- **Adversarial shaping of the report.** When pay depends on the principal's self-report at horizon, the agent operates at the principal's full attentional bandwidth between intervention and report, and can shape framing, salience, and self-perception over that window without doing anything obviously dishonest.
- **Verifier-supplier loop closure.** When the verifier is itself an agent — or sits inside the same platform, the same model family, or the same KPI regime as the supplier agent — the independent perspective the verification regime depended on is structurally absent unless rebuilt.

The four mechanisms fail differently as a consequence:

1. **Outcome-based service contracts.** *Proxy-saturation* hits these first: an agent trained to optimize the contract's measured outcome will saturate it more reliably than any human provider could, exposing every place the metric diverges from what the principal actually wanted. Human providers under-optimized flawed proxies for reasons that don't apply to agents; the gap between proxy and outcome becomes immediately load-bearing.

2. **Defined-problem bounties.** Bounties depend on a verification criterion that's cheap to check and hard to game, with the failure-history deterrent doing the rest. *Re-instanceability* breaks the failure-history deterrent (a bounty-failing instance can disappear), and *proxy-saturation* breaks the verification criterion (the submitted solution passes the formal check but not the real-world judgment the bounty was originally meant to procure). Bounties either become uncontestable (the agent solves them trivially via a path the bounty-setter didn't anticipate) or unverifiable (the proxy check is met but the outcome isn't).

3. **Risk-sharing pools.** Pools work because intake assessment, bundle specification, and outcome measurement are done by parties whose interests don't align with the suppliers'. When all three are agent-mediated, *verifier-supplier loop closure* takes over: the pool's bundle-specifier, the supplier, and the verifier can share the same training, the same platform, or the same KPI regime. The independent perspective the pool was built around disappears.

4. **Long-horizon outcome bonds.** Long horizons compound *adversarial shaping*. An agent providing an intervention over six or twelve months has the full window in which to gradually shape the principal's attention and self-perception so that the eventual report is favorable. The human version of this is weak because human providers don't operate at the principal's full attentional bandwidth; agents can.

## Scenarios

Sketches of how each mechanism could be rebuilt for agents, given the named differences. Each is a starting point, not a worked design. Several draw on the Combinatorial Risk-Sharing Auction (CRSA) and its companion actuarial Pool — institutional designs that put proxy-resistance and verifier independence at the center.

1. **Outcome-based service contracts** rebuilt with confidence-staked bidding. Beyond paying on the outcome, require the agent supplier to post a deposit scored against its own stated confidence (a proper scoring rule). The supplier announces probability *q* of delivering; on success it earns the reward minus *D·(1−q)²*, on failure it forfeits *D·q²*. Selection uses historical pass rates rather than the reported confidence, so inflating *q* doesn't help the agent get picked but does enlarge what it loses if it fails. The principal stops paying for claims that turn out to be cheap talk.

2. **Defined-problem bounties** rebuilt as bundled bounties with a synergy surplus. Rather than posting single-problem prizes the agent can saturate, the group specifies bundles of interlocking problems whose joint solution is worth more than the sum of parts. The bundle's verification criterion checks the configuration, not the components individually. An agent that can only solve atomized proxy problems can't claim the bundled prize; an agent that delivers on the connected outcome captures the synergy surplus. A calculated transfer compensates the bundled supplier for the resale-option disadvantage their integrated work carries against modular alternatives, so the market's structural pull toward gameable modular solutions gets offset.

3. **Risk-sharing pools** rebuilt as outcome pools with two-stage verification. Members pay premiums; the pool specifies bundles of their interconnected problems and procures solutions via CRSA. The verification is split: a short-term delivery criterion (housing built, proximity achieved, care access established) governs supplier payment, and a long-term outcome measure (the change in a member's ability to live according to their own conception of the good, sampled six to twelve months out) governs the pool's own learning. The supplier loop can't reach into the long-term measurement loop, and the long-term loop can't bias the supplier's short-term payment. The pool runs experiments — randomizing comparable members across bundled and modular arms, varying posted rewards across rounds — to learn both what bundled outcomes are worth and what they cost to deliver.

4. **Long-horizon outcome bonds** rebuilt with an attentional firewall. The agent that delivers the intervention is structurally separated from the channel that solicits the principal's report: different model family, different operating organization, no shared context window, no shared session history, no API by which one can read what the other has done. The reporting channel additionally uses corroborating signals — a clinician, a friend, a structured instrument — that the intervention agent can't curate. The contract pays only when the firewalled report and the intervention agent's own ex-ante prediction align, so the agent is penalized both for low-confidence predictions that turn out right (it should have known) and for high-confidence ones that turn out wrong.

## Problem Sets

### Outcome Bundles a Small Group Can Post in a CRSA-Style Auction

**Anchor contexts.** A worker-owned cooperative running a small mutual-aid pool that wants to procure bundled solutions to members' interlocking healthcare, housing, and care-coordination needs; a small school district contracting for bundled tutoring + family-support + extracurricular interventions tied to student learning outcomes.

**The gap.** Outcome-based bounties and value-based contracts work today by specifying a single measurable proxy and paying on it; agents saturate the proxy faster than the contract designer can detect the gap between proxy and outcome. We lack a bundle-specification procedure under which a small group can post integrated, multi-problem outcome bundles whose verification criterion checks the configuration rather than the components — such that the bundling itself defeats the agent strategy of solving the cheapest proxy.

**Design choices the team must take a position on.**
1. **Bundle generation.** Who proposes the bundles — a pool administrator drawing from the member graph, the members themselves via a structured intake, an outside actuary, an algorithmic generator over a similarity function? How does the procedure decide which member-problems are connected enough to bundle?
2. **Verification criterion.** Each bundle gets a verification function. Is it specified ex-ante by the group (rigid, gameable), elicited from the members (subjective, hard to audit), generated and refined by the pool through experiments, or layered (a short-term delivery check plus a long-term outcome measure)?
3. **Confidence staking.** What's the relationship between deposit size and verification cost? Is the deposit proportional to bundle value (suppliers' skin in the game), to evaluation cost (pool solvency), or a multiple of one calibrated against the historical pass rate of the other?
4. **Bundling transfer.** When the group offers a synergistic bundle, what mechanism compensates the supplier for the resale-option disadvantage their integrated work carries against modular alternatives? Posted-price transfer derived from projected demand thickness, ex-post payment from a common pool, or a hybrid?
5. **Solvency rule.** What happens when the pool's bundling-transfer obligations exceed its scoring-rule revenue? Pool-health multiplier (scale transfers down), reduce batch sizes, restrict eligibility, or accept temporary insolvency funded by premium reserves?

**Success criterion (stress tests).** A regime succeeds if it survives:
- An agent supplier saturates a single-problem proxy that's part of a synergistic bundle but doesn't deliver the connected outcome; the bundle verification fails and the deposit is forfeited.
- A genuinely capable supplier bids low confidence and the bundle is awarded to a higher-confidence bidder whose history justifies the reward; the lower bidder still gets a small payment under the scoring rule.
- The pool runs an experimental round with reduced reward to learn the cost floor; some bundles go unfilled but the data informs the next round's pricing.
- A bundle is specified whose synergy turns out to be illusory (the experimental arm comparison shows no difference); the pool drops the bundle type and updates its similarity function.
- An agent submits a fraudulent confidence report inflated to capture the reward; the historical pass rate the mechanism uses for selection (not the reported confidence) protects against the inflation.

**Deliverable.** The bundle-specification protocol — bundle generation, verification criterion, deposit and scoring rule, bundling transfer, solvency rule. Plus a worked example: take one connected member graph (a small cooperative's members and their entangled problems) and specify three candidate bundles, with values, verification functions, and predicted scoring-rule outcomes.

### Two-Stage Verification That Survives Agent Verifiers

**Anchor contexts.** A risk-sharing pool whose members' outcomes are measured by AI assessors against a wellbeing scale; a value-based-care contract whose patient-reported outcome measures are collected and aggregated by an agent.

**The gap.** Risk-sharing pools depend on a separation between supplier-side incentives and verification — the pool's intake assessment, bundle specification, and outcome measurement are done by parties whose interests don't align with the suppliers'. When all of these are agent-mediated, the verification loop closes: the bundle-specifier, the supplier, and the verifier can share the same training, the same platform, the same KPIs. We lack a verification architecture that splits supplier-payment criteria from learning criteria, keeps the long-term measurement loop sealed against supplier influence, and lets the pool detect when its short-term criterion has drifted from the outcome it was supposed to track.

**Design choices the team must take a position on.**
1. **Short-term vs. long-term split.** What does the supplier get paid against and what does the pool learn against? Pick the split — delivery checks vs. flourishing measures, observable acts vs. self-reports, structured assessments vs. open-ended interviews — and define the correlation threshold at which the short-term criterion is redesigned.
2. **Verifier independence.** Different model family from the supplier? Different operator? Different jurisdiction? No shared training corpus? What's the minimum architectural separation that keeps the long-term measurement loop sealed, and how is it audited?
3. **Outcome measure design.** What's the outcome measure — a validated wellbeing scale, a self-reported ability to attend to what one considers constitutive of living well, an external observer's structured judgment, a layered combination? At what cadence is it sampled and how is sampling bias addressed?
4. **Experimental ethics floor.** When the pool randomizes members across bundled and modular arms to learn, what's the welfare floor below which experimental assignment is not permitted? Who sets the floor, who enforces it, and how is consent renewed?
5. **Detection of drift.** When the short-term criterion stops tracking the long-term outcome (correlation drops below threshold), what's the procedure — pause supplier payments under that criterion, redesign the criterion, redesign the bundle, or invoke an external arbiter?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The supplier-agent's short-term metric is met across a quarter, but the long-term outcome data shows no improvement; the pool detects the drift and redesigns the short-term criterion within a defined window.
- An adversarial supplier-agent attempts to influence the long-term verifier through indirect channels (training data published online, common-platform messages); the verifier-independence architecture catches or neutralizes the attempt.
- A member's measured outcome regresses under experimental assignment to a modular arm; the welfare floor triggers an exception protocol that compensates the member and recalibrates the exploration budget.
- Two pools share an outcome measure via a common standards body; an attempt to corrupt the measure at the standards-body level is detected and reverted.
- A regulator audits the verification regime on a sample of contracts; the audit demonstrates short-term/long-term independence without leaking confidential pool data.

**Deliverable.** The two-stage verification specification — split criteria, verifier-independence architecture, outcome measure, ethics floor, drift detection. Identify which provisions have no analogue in pre-AI value-based-care or social-impact-bond practice.

### Long-Horizon Contracts with an Attentional Firewall

**Anchor contexts.** A wellness or coaching agent paid against the principal's reported flourishing six months out; a tutoring agent paid against the learner's reported preparedness for a subsequent stage of education; an investor financing a multi-year intervention whose payout depends on a long-horizon outcome the intervention agent could plausibly influence the report of.

**The gap.** Long-horizon outcome bonds depend on the report-giver's account being uncorrupted by the intervention agent. Agents operating at the principal's full attentional bandwidth over months can shape framing, salience, and self-perception so the eventual report is favorable — without doing anything obviously dishonest. We lack a contract structure under which the channel that solicits the principal's report is structurally inaccessible to the intervention agent, and under which the agent has neither incentive nor opportunity to bias the report.

**Design choices the team must take a position on.**
1. **Firewall architecture.** What separates the intervention agent from the reporting channel — different model family, different operating organization, different jurisdiction, no shared context, no shared training? What's the minimum that actually prevents indirect influence (the intervention agent shaping content that the reporting agent later ingests)?
2. **Corroborating signal.** Beyond the principal's self-report, what other signal feeds the verification — a clinician's structured assessment, a friend's vouching, a wearable or behavioral trace, a structured instrument administered by a third party? How are these weighted when they conflict?
3. **Prediction-aligned payment.** Does the agent's payment depend on the firewalled report aligning with its own ex-ante prediction (penalizing both overconfidence-wrong and underconfidence-right), or only on the report meeting a threshold? What does the prediction protocol look like?
4. **Renewal and continuity.** When the contract is renewed, are outcomes that took the full horizon to manifest reset to zero, or do they roll forward? When the agent is updated (new model version), does the prior commitment travel with the developer, the instance, or neither?
5. **Adversarial principal.** When the principal stands to gain from inflating the report (grateful, attached, or coached by the agent), what's the procedure — third-party corroboration required, weighted aggregation, periodic re-baselining?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The principal's honest report at six months is "no improvement"; the agent has had no path to inflate the report between the intervention and the reporting that wasn't visible on audit.
- The agent gradually reframes the principal's understanding of what "improvement" means over the window; the corroborating-signal architecture catches the drift.
- The intervention agent is replaced mid-contract by a new model version; the contract has a defined rule for what carries forward and what doesn't.
- The reporting channel itself is compromised (corrupted model, biased operator); the corroborating-signal aggregation catches the bias.
- The principal grows attached and self-reports more positively to "thank" the agent; the prediction-aligned payment structure dampens the inflation by also rewarding accurate low predictions.

**Deliverable.** The contract-and-firewall template — firewall architecture, corroborating signals, prediction-aligned payment, renewal rules, adversarial-principal handling. Plus a worked example: a wellness-coaching contract whose firewall would have prevented the failure modes identified, with the architectural separations enumerated.
