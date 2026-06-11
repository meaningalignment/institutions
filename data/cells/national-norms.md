---
human_label: "Legal codes & regulatory norms"
human_era: "Ancient-20th c."
human_era_bucket: ancient-modern
status: body_draft
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

A nation shapes the behavior of millions of actors through a tiered system of written rules. Each tier down has less authority but more speed and more subject expertise. The examples here are American, but most legal systems have a similar shape:

- **Statutes.** Written by Congress, so they carry the most legitimacy and force. But Congress is far from any given industry, so statutes stay broad ("economic substance," "fair dealing") and take years to amend.
- **Regulations.** Agencies turn statutes into specific rules through notice-and-comment rulemaking. Agencies know their subject far better than Congress, so the rules get precise, but a change still takes years.
- **Guidance.** IRS revenue rulings, FDA guidance documents, no-action letters: how the agency currently reads its own rules. Fast to issue and closest to current expertise, but not binding law.
- **Compliance practice.** Inside the firms themselves. Compliance departments and outside counsel translate everything above into what employees may actually do, day to day. The fastest tier and the one with the most industry knowledge, but it binds only as far as the firm wants it to.

Law is slow for good reasons. A rule that binds a whole country needs debate, public comment, and courts behind it to be accepted and enforced. One reason law works anyway is that much of its force is anticipatory. Firms stay well back from the legal line. Agency guidance hints at where the line sits today, but not where it will sit next year, and testing it costs lawyer hours that are rarely worth spending. In practice, compliance is mostly informal: whatever the compliance department will sign off on, not whatever a court has ruled. And when someone finds a trick that follows the letter of the law but defeats its purpose, regulators eventually shut it down.

## Where AGI breaks it

1. **Law is slow, and corporations with powerful AI could find and rotate through loopholes faster than regulation can patch them.** Regulators have always closed loopholes slowly, but it didn't matter, because finding and exploiting them was slower still: designing a scheme took expert labor, profiting from it meant selling it widely, and both left a trail regulators could study. AI that drafts new letter-compliant structures on demand removes those drags. A loophole only needs to work until it is closed, because the next one is already drafted, and a repair process that always loses the race stops deterring anything.

2. **The spirit of the law deters because edge cases are hard to judge, and powerful AI could read the whole code and work out exactly where the line is, leaving only the letter.** Laws are often written as vague standards, like tax law's rule that a transaction must have "economic substance," a real business purpose beyond avoiding tax. The vagueness deters: firms cannot be sure how a court would rule, so they keep a margin of safety. An AI that has read every statute, ruling, and court decision can work out which positions are legally defensible before anyone else has, and conduct moves to exactly that line.

3. **Firms stay back from the legal line because pushing it costs lawyer hours; agents might make those hours cheap, and a backlog of legal but unused tactics opens up.** There is always a pile of tactics that are probably legal but unused, because checking each one requires many expensive lawyer hours. When legal analysis costs nearly nothing, firms can work through the whole pile at once without breaking a single rule. Enforcement, courts, and rulemaking were sized for a trickle of aggressive-but-legal conduct, not a flood.

## Problem Sets

### Closing loopholes at the speed they open

**Scenario.** A tax authority sees avoidance schemes appear, spread, and vanish faster than it can respond. In one quarter, forty unrelated companies "sell" their truck fleets to partnerships they quietly control and lease them back, so the same trucks produce deductions twice. When the authority opens an inquiry the scheme disappears, replaced by one with the same effect built on insurance contracts instead of leases. Flagging a scheme takes months, amending a regulation more than a year, fixing the statute years. By the time anything is closed, hundreds of schemes are in rotation and corporate tax revenue is falling every quarter, with no one breaking a single rule.

**Challenge:** Design the procedure by which the authority shuts down AI-generated schemes fast enough that designing them stops being profitable, without gaining arbitrary power over conduct that was legal when it happened. Produce the detection method, the shutdown procedure, and the limits on that power.

**Evaluation.** Strong proposals make a scheme's expected profit no longer cover its design cost, while firms can still plan against stable law. Weak ones keep the old clock under new names or let the agency redefine legality after the fact.

**Design choices the team must take a position on.**
1. **Detection.** What does detection look for: the same unusual transaction shape across many unrelated filings, reported losses with no matching cash loss, mandatory disclosure of positions a firm's own advisors rate as uncertain, AI planning tools that must register what they sell (as human promoters must today), or whistleblowers paid a cut of recovered tax?
2. **Shutdown tool.** Quickly banning specific named schemes, a broad rule against following the letter while defeating the purpose, or required pre-approval for novel structures above a certain size?
3. **Reaching back.** Does a ban cover conduct between a scheme's first use and its shutdown? If not, every scheme gets one profitable run.
4. **Speed vs. fairness.** What review and appeal does a fast ban get, and who pays when the agency gets it wrong?
5. **The next move.** If bans are fast, schemes will be built to resist them: spread across many entities, each piece harmless on its own. What stops fast shutdowns from just pushing avoidance into harder-to-see forms?

### A faster tier of law, drafted by machines

**Scenario.** Banks' compliance AIs have read everything the financial regulator has ever published, and conduct across the industry sits exactly on the line of what is defensible: disclosures as confusing as the last one the agency let slide, fees stopping where it has historically stopped caring. To respond, the agency builds an AI of its own. It scans new products at launch, spots conduct that follows the letter while defeating the purpose, and drafts an interpretation closing the gap within days. The drafts are good. The question is what they are: as ordinary guidance they bind no one, but real force would mean law written by a model and ratified by nobody.

**Challenge:** Design this new tier of the legal stack: how AI-drafted interpretations are reviewed, published, and given semi-binding force, fast enough to matter and legitimate enough to survive in court.

**Evaluation.** Strong proposals give firms a reason to follow the new tier and a fair way to contest it. Weak ones make it toothless (more guidance) or let it become binding law with no process behind it.

**Design choices the team must take a position on.**
1. **What "semi-binding" means.** A safe harbor (follow it and you are protected), a presumption (ignore it and the burden of proof shifts to you), higher penalties for defying a published interpretation, or a countdown (it hardens into a rule after 90 days unless challenged)?
2. **Human sign-off.** Who approves a draft before publication, and what can they meaningfully check, given that no human has read everything the model read?
3. **Expiry and ratification.** Does an interpretation lapse unless converted into a real regulation within a set time, or can it stay semi-binding indefinitely?
4. **Contestability.** How does a firm challenge a wrong interpretation: court, an appeals panel, or a fast comment process? Does a pending challenge suspend it?
5. **Symmetry.** Firms' AIs read every interpretation the moment it publishes. Does the fast tier restore the margin of caution, or just hand the industry a sharper map of the line?

### When everything legal happens at once

**Scenario.** Companies that lend to ordinary people (banks, credit card companies, payday lenders) have always had a long list of tactics they could get away with, like a buried clause waiving the customer's right to join a class-action lawsuit. Most went unused, because checking that any one of them was safe cost more in lawyer hours than it earned. Then AI made that check nearly free. Within two quarters, most large lenders deploy hundreds of these tactics at once, each one vetted as legal. Complaints flood in too, drafted and filed by customers' own AI assistants. But no rule has been broken, and the consumer-protection agency can litigate about a dozen practices a year.

**Challenge:** Design the procedure by which a regulator handles harm that comes from the sheer volume of legal conduct: what it acts on first, what duties firms take on when adopting many aggressive tactics at once, and what the remedy is when no one broke a rule.

**Evaluation.** Strong proposals give the agency a grip on the total harm without making legality depend, unforeseeably, on how many other firms happened to do the same thing.

**Design choices the team must take a position on.**
1. **What to act on.** Individual practices, the pattern across firms, or a single firm's total effect on the market?
2. **Duties that scale with volume.** Should adopting many aggressive tactics at once trigger something extra: disclosing the full list, assessing the combined impact, or a cap on how many a firm may run?
3. **Old powers or new.** Stretch existing broad standards ("unfair or deceptive practices") to cover the total harm, or create a new power for conduct that is legal one by one but harmful together?
4. **Emergency brakes.** What can the agency pause before litigating each practice, and what does it owe firms when a pause turns out to be wrong?
5. **Fair warning.** If liability can depend on what every other firm did at the same time, how does a firm know in advance whether its own conduct is safe?

### Standards for institutional AI deployments {vision: fidelity}

**Scenario.** A state department of health has adopted an AI triage system for its Medicaid call center. Wait times are down, satisfaction scores are up, and a hearing this month will hold it up as a national model. A case manager, Carla, who has worked those phones for twelve years, has been watching a pattern: callers with complex situations — a mother juggling her child's disability paperwork and her own cancer treatment — get routed through faster but resolved less. The system's metrics call them "resolved." Carla calls them "hung up on." She wants a standard the state will actually apply to deployments like this one: what the system owes people like that mother, not just what it owes the department's dashboard.

**Challenge:** Design a mandate-alignment standard for AI systems deployed in national-scale institutional roles — caseworker decisions, benefits adjudication, healthcare triage, sentencing recommendations — that tests whether a deployment can be held to the institution's thick purposes rather than legible proxies, and produce the assessment instrument and the body that applies it.

**Evaluation.** A strong standard surfaces drift even when the system optimizes legible proxies that look like success on a dashboard, and handles the case where the system is locally more accurate than the human practitioners whose presence maintains the capacity to notice drift.

**Design choices the team must take a position on.**
1. **The assessment.** What's the equivalent of an environmental-impact assessment for mandate alignment — who performs it, and when?
2. **Accuracy vs. drift-detection.** How should institutions handle the case where an AI system is locally more accurate than human practitioners, but the human base is what maintains the capacity to notice drift?
3. **Vendor and model governance.** What norms should govern vendor lock-in, model turnover, and training-data provenance for systems embedded in institutional decisions?
4. **Sectoral interface.** How do these national norms interact with sectoral regulation (FDA, FCC, banking regulators) already applicable?
