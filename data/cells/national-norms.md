---
human_label: "Legal codes & regulatory norms"
human_era: "Ancient-20th c."
human_era_bucket: ancient-modern
status: summary_ok
owner: oliver
visions:
  fidelity: "Standards for institutional AI deployments"
---

# AIs that follow and update the law

## At a glance

### Coordination challenge

How a nation coordinates millions of actors around shared expectations of conduct.

### Examples

- Federal statutes like the Internal Revenue Code
- Agency regulations like the Code of Federal Regulations
- Agency guidance like IRS revenue rulings and FDA guidance documents
- Industry compliance practice like bank KYC programs

### How AGI breaks them

- Law is slow. Corporations with powerful AI could find and rotate through loopholes faster than regulation can patch them.
- The spirit of the law deters because edge cases are hard to judge. Powerful AI could read the whole code and work out exactly where the line is, leaving only the letter.
- Firms stay back from the legal line because pushing it costs lawyer hours. Agents might make those hours cheap, and a backlog of legal but unused tactics opens up.

## How humans solve this today

A nation coordinates millions of actors through a stack of written conduct rules, each layer trading speed against authority:

- **Statutes.** Legislatures write broad standards (the Internal Revenue Code's "economic substance," securities law's "fair dealing") — durable and authoritative, but deliberately general and slow to amend.
- **Regulations.** Agencies translate statutes into specific rules in the Code of Federal Regulations through notice-and-comment rulemaking: more precise than statute, still years per change.
- **Guidance.** The fast layer — IRS revenue rulings, FDA guidance documents, no-action letters — tells firms how the agency currently reads its own rules, without the force or the delay of formal rulemaking.
- **Compliance practice.** Firms internalize the rules through compliance departments, outside counsel, and standardized programs like bank KYC; most conduct is governed not by enforcement but by what the compliance function will sign off on.

Two quieter mechanisms hold the stack together. Vague standards deter: a firm that can't predict how a court will apply "economic substance" keeps a margin of safety, and testing an aggressive position costs real money in legal review and opinion letters. And the patch cycle holds: when a scheme that honors the letter while defeating the purpose starts to spread, agencies and courts close it — by listing the transaction, amending the rule, or striking it down under anti-abuse doctrine — before it does system-level damage.

A vivid case: the corporate tax-shelter wave of the late 1990s. Accounting firms marketed letter-compliant structures (BLIPS, Son-of-BOSS) to thousands of clients; the IRS designated them listed transactions, courts disallowed them under the economic-substance doctrine, and KPMG accepted a $456 million deferred-prosecution agreement. The patch cycle won — but only because each shelter took expert-years to design and had to be mass-marketed to be profitable, which made the wave slow enough to spot and counter.

## Where AGI breaks it

1. **Law is slow, and corporations with powerful AI could find and rotate through loopholes faster than regulation can patch them.** The patch cycle assumed exploitation was slower than repair: designing a scheme took scarce expert labor, profiting from it required marketing it widely, and both left a trail in filings the agency could study before the next scheme arrived. AI systems that can generate novel letter-compliant structures on demand remove each of those drags. A loophole no longer needs to last; it only needs to work until it is patched, because the successor is already drafted. Repair still runs on rulemaking time — years per change — while exploitation runs on inference time, and a patch cycle that loses the race stops deterring anything.

2. **The spirit of the law deters because edge cases are hard to judge, and powerful AI could read the whole code and work out exactly where the line is, leaving only the letter.** Standards like "economic substance" or "fair dealing" govern precisely because their application is uncertain: the firm bears the risk of guessing wrong, so it stays well back from where it guesses the line might be. A system that can read the entire body of statute, regulation, ruling, and litigated outcome, and predict the adjudicator's response to a novel structure with calibrated confidence, converts standards back into rules. Conduct migrates to exactly the predicted line. The deterrent force was never only in the text; it lived in the cost of resolving the text's vagueness, and that cost is what capable models remove.

3. **Firms stay back from the legal line because pushing it costs lawyer hours; agents might make those hours cheap, and a backlog of legal but unused tactics opens up.** At any moment there is a standing inventory of conduct that is probably legal but unexploited, because evaluating each tactic would cost legal review nobody has commissioned. The system's stability quietly depends on most of that inventory never being opened. Near-zero-cost legal analysis lets firms work through the backlog systematically — not violating any rule, just exercising every option the rules technically permit, all at once. Enforcement, courts, and rulemaking were all sized for a world in which legal-but-aggressive conduct trickled in; none of them has a procedure for the trickle becoming a flood.

## Problem Sets

### A patch cycle that runs on the exploiters' clock

**Scenario.** A national tax authority notices a new pattern in corporate filings: avoidance structures that appear, spread across a few dozen filers, and are abandoned the quarter they draw scrutiny — replaced by structurally different successors with the same effect. Each structure honors the letter of the code; several were plainly generated by the same class of AI planning tools. The authority's instruments run on old clocks: a listed-transaction designation takes months, a regulatory amendment eighteen months, a statutory fix years. By the time any single structure is closed, the revenue is gone and the tool that designed it has moved on. The general counsel asks for something the agency doesn't have: a way to patch at the speed of the thing patching against them.

**Challenge:** Design the expedited anti-avoidance regime — the detection instrument, the fast-designation procedure, and its limits — by which a national authority closes AI-generated letter-compliant schemes on a timescale that changes the exploiters' economics, without acquiring arbitrary retroactive power over conduct that was legal when taken.

**Evaluation.** Strong proposals are fast enough that a scheme's expected profit no longer covers its design cost, while leaving firms able to plan against stable law; weak ones either keep the old clock under new names or let the agency redefine legality after the fact.

**Design choices the team must take a position on.**
1. **Detection.** How does the authority see schemes early — mandatory disclosure of uncertain positions, promoter-style registration duties extended to AI planning tools, statistical surveillance of filings, or whistleblower economics?
2. **Patch instrument.** Fast designation of specific structures (listed-transaction style), a principles-based general anti-avoidance rule applied case by case, or pre-clearance requirements for novel structures above a threshold?
3. **Retroactivity.** Does a patch reach conduct between a scheme's first use and its designation — and if not, doesn't that concede every scheme its first profitable run?
4. **Speed vs. process.** What review and appeal does a fast designation get, and who bears the cost when the agency designates wrongly?
5. **Equilibrium effects.** If patches are fast, schemes will be designed to be patch-resistant — distributed across entities, individually innocuous. What keeps the regime from simply pushing avoidance into harder-to-see forms?

### Deterrence when the adjudicator can be simulated

**Scenario.** A bank's compliance agent can predict, with calibrated confidence, how the financial regulator will treat any proposed product or structure — trained on every public rule, ruling, enforcement action, and speech the agency has produced. Across the industry, the same tools push conduct to exactly the predicted line: disclosures are precisely as opaque as the last unchallenged precedent allows, fee structures stop exactly where enforcement history says the agency stops caring. Nothing is illegal, and the supervisors can feel the difference — the margin of conservatism that examination used to rely on is gone, and "fair dealing" now means whatever the simulation says it has historically meant.

**Challenge:** Design how a national regulator preserves the deterrent force of standards when regulated firms can simulate its judgment — through how rules are drafted, how enforcement is structured, or what duties attach to line-walking conduct itself.

**Evaluation.** Strong proposals restore a margin between predicted tolerance and actual conduct without abandoning the rule-of-law requirement that firms be able to know what is forbidden; weak ones rely on the agency being deliberately arbitrary, which fails that requirement, or on firms politely declining to use the simulations.

**Design choices the team must take a position on.**
1. **Drafting response.** Do agencies write more rules (precise but gameable), more standards (flexible but now simulable), or standards with explicitly reserved discretion that a simulation cannot price?
2. **Enforcement structure.** Randomized enforcement intensity, graduated penalties that scale with proximity to the line, or enforcement that explicitly weighs purpose-defeat rather than only rule-breach?
3. **Status of regulator-simulation.** Is simulating the agency a protected compliance activity, a disclosable one, or in some uses an aggravating factor at enforcement?
4. **Intent revival.** Should letter-compliant but purpose-defeating conduct carry liability when the firm's own tools show it knew exactly where the line was — and what evidence of that knowledge is discoverable?
5. **Honest-actor cost.** Every mechanism above raises uncertainty for ordinary firms too. How is the added burden kept from falling hardest on small actors without frontier tools?

### Standards for institutional AI deployments {vision: fidelity}

**Scenario.** A state department of health has adopted an AI triage system for its Medicaid call center. Wait times are down, satisfaction scores are up, and a hearing this month will hold it up as a national model. A case manager, Carla, who has worked those phones for twelve years, has been watching a pattern: callers with complex situations — a mother juggling her child's disability paperwork and her own cancer treatment — get routed through faster but resolved less. The system's metrics call them "resolved." Carla calls them "hung up on." She wants a standard the state will actually apply to deployments like this one: what the system owes people like that mother, not just what it owes the department's dashboard.

**Challenge:** Design a mandate-alignment standard for AI systems deployed in national-scale institutional roles — caseworker decisions, benefits adjudication, healthcare triage, sentencing recommendations — that tests whether a deployment can be held to the institution's thick purposes rather than legible proxies, and produce the assessment instrument and the body that applies it.

**Evaluation.** A strong standard surfaces drift even when the system optimizes legible proxies that look like success on a dashboard, and handles the case where the system is locally more accurate than the human practitioners whose presence maintains the capacity to notice drift.

**Design choices the team must take a position on.**
1. **The assessment.** What's the equivalent of an environmental-impact assessment for mandate alignment — who performs it, and when?
2. **Accuracy vs. drift-detection.** How should institutions handle the case where an AI system is locally more accurate than human practitioners, but the human base is what maintains the capacity to notice drift?
3. **Vendor and model governance.** What norms should govern vendor lock-in, model turnover, and training-data provenance for systems embedded in institutional decisions?
4. **Sectoral interface.** How do these national norms interact with sectoral regulation (FDA, FCC, banking regulators) already applicable?
