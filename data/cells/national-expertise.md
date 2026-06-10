---
human_label: "Regulatory agencies (FDA, BaFin)"
human_era: "20th c."
human_era_bucket: twentieth
status: not_started
owner: oliver
visions:
  fidelity: "Mandate literacy in professional training"
---

# AI regulatory agencies & regulator-anticipation

## At a glance

### Coordination challenge

How a nation vests technical authority to gatekeep what enters markets and protect the public from bad outcomes.

### Examples

- FDA
- FAA
- EPA
- BaFin
- FERC

### How AGI breaks them

- Agency review assumes the regulated product decomposes into inspectable evidence; AI systems may not, leaving approval standards without an object to certify.
- Agent-generated filings can arrive faster than review capacity grows, making the agency's attention the scarce resource and the queue itself a strategic instrument.
- Firms with capable agents can model the regulator precisely enough to walk up to the enforcement line, collapsing the cautious distance that uncertainty used to produce.
- Agency authority rested on an expertise asymmetry in the public's favor; when frontier technical expertise is itself automated, the regulated may out-expert the regulator.

## How humans solve this today

National regulatory agencies — the FDA, FAA, EPA, BaFin, FERC and their peers — translate technical judgment into binding decisions about what may enter a market. The model is a stack:

- **Career technical staff.** Reviewers who spend decades in one domain (drug chemistry, airframe certification, grid reliability) and accumulate judgment the statute can't encode. Slow to build and hard to replace, but the basis of the agency's authority: the regulator usually knows the domain at least as well as the regulated.
- **Premarket gatekeeping.** Approval before entry — a new drug application, an airworthiness certificate, a banking license. The burden sits on the applicant to produce evidence in forms the agency knows how to evaluate: trial data, test flights, capital ratios.
- **Rules and guidance.** Published regulations plus the softer layer of guidance documents, no-action letters, and informal advice that tells firms how the agency currently reads its own rules. Deliberately slower than the industry it governs; the lag forces positions into writing where they can be challenged and litigated.
- **Post-market surveillance.** Adverse-event reporting, inspections, and enforcement, which catch what premarket review missed and feed the next round of rules.

The stack is stabilized by uncertainty: firms that can't predict exactly how the agency will react act conservatively, often consulting the regulator informally before consequential moves.

A vivid case: Renee's airline used to face a four-month wait for FAA guidance on subtle safety issues. The wait usually resolved into a phone call with the regulator-of-record, who would say informally whether the agency was inclined to write the issue up — letting her decide whether to ground a plane preemptively or fly while the formal process ran.

## Where AGI breaks it

1. **Agency review assumes the regulated product decomposes into inspectable evidence; AI systems may not.** A drug approval works because the artifact holds still: the molecule is fixed, trials measure its effects, and the evidence formats (protocols, endpoints, statistical plans) are ones reviewers have judged a thousand times. An AI system that is updated continuously, behaves differently across contexts, and can't be reduced to a mechanism a reviewer can interrogate doesn't fit those formats. The agency can still demand evidence, but it no longer knows what evidence would settle the question its statute makes it responsible for.

2. **Agent-generated filings can arrive faster than review capacity grows.** Gatekeeping presumed that producing a serious application was expensive — expensive enough that volume self-limited and the queue stayed reviewable. When applications, comment letters, incident reports, and petitions can be generated at near-zero marginal cost, review attention becomes the scarce resource, and the queue becomes a strategic instrument: a firm can bury a controversial filing among routine ones, or exhaust an opposing party's capacity to respond in a comment period.

3. **Firms with capable agents can model the regulator precisely enough to walk up to the enforcement line.** Conservative compliance was never just obedience; it was the product of uncertainty about how the agency would react, priced in lawyer hours. An agent trained on the agency's rules, guidance, enforcement history, and published decisions can estimate reactions well enough to optimize against them — staying technically inside every rule while draining the buffer that uncertainty used to enforce. The informal-consultation channel inverts too: instead of asking the regulator, firms ask a simulation of the regulator, and the agency loses the early visibility those consultations used to give it.

4. **Agency authority rested on an expertise asymmetry that automation may invert.** Deference to the FDA or BaFin — from courts, legislators, and firms — was earned by the agency knowing the domain better than almost anyone outside it. When frontier technical capability lives in models, and regulated firms operate more capable models than the agency can hire or buy, the agency reviews the applicant's claims with weaker tools than the ones that produced them. The question is not only budgetary; it is whether public-interest expertise can remain an in-house career when the expertise itself is a product the private sector makes.

## Problem Sets

### Status of an AI-issued regulator-anticipation opinion

**Scenario.** A mid-size airline's safety agent flags a subtle drift in one of its diagnostic pipelines — a pattern it believes the FAA would care about, but that no current rule explicitly forbids. Under the old regime, the safety officer, Renee, would have written a letter, heard back in four months, and flown the planes in the meantime. Instead she queries the agent the FAA now operates for exactly this purpose: here is our situation, how would the regulator view it? The answer comes back in seconds and she grounds one aircraft for six days. Then the questions start circulating in the general counsel's office: what exactly did the FAA just tell us, what is it worth if the agency later disagrees, and did the airline two gates over get the same answer?

**Challenge:** Design the regime governing AI-issued regulator-anticipation opinions: their legal status, the consistency the agency commits to, and the protection a firm gets for relying on them — fast enough to be useful at agent speed without the opinions hardening into de facto law that no rulemaking ever produced.

**Evaluation.** Strong proposals survive both failure directions: opinions so binding that the model's outputs become uncontestable regulation, and opinions so weightless that no firm can prudently act on them.

**Design choices the team must take a position on.**
1. **Status of the opinion.** Pure advisory with no protection, a good-faith reliance shield, or precedential within bounds until formally changed?
2. **Consistency commitment.** Does the agency commit to the system answering similar questions alike across firms and across time, and what happens when an inconsistency is found?
3. **Update transparency.** When a model update changes the answer, are firms that relied on the prior answer notified, shielded, or reopened?
4. **Human override.** Can a senior regulator override the system's answer, and what triggers their attention — random sampling, severity thresholds, firm escalation?
5. **Answer-shopping.** How does the regime handle a firm rephrasing the same question across many submissions to fish for a favorable reading, without making legitimate clarification hard?

### An approval pathway for systems the agency can't decompose

**Scenario.** A developer submits a hospital triage model for authorization. The model outperforms clinicians on every retrospective benchmark, but it is updated monthly, its behavior shifts with the patient mix, and no reviewer can trace why it deprioritizes a given case. The agency's evidence playbook — fixed artifact, frozen behavior, pre-specified endpoints — doesn't apply. Rejecting the system means keeping a worse triage process in place; approving it means certifying something the agency cannot inspect and whose behavior next quarter is not the behavior it reviewed.

**Challenge:** Design the evidence regime by which a regulator authorizes a continuously updated AI system: what the applicant must produce in place of the traditional safety case, what ongoing obligations replace one-time approval, and what triggers re-review.

**Evaluation.** Strong proposals name evidence the agency can actually evaluate with the staff it has and keep authorization meaningful after the tenth model update; weak ones either re-demand mechanistic transparency the artifact can't provide or collapse into trusting the developer's own evaluations.

**Design choices the team must take a position on.**
1. **Evidence object.** What stands in for the frozen artifact — capability evaluations, behavioral audits on held-out cases, certification of the developer's process, or staged deployment with monitored exposure?
2. **Update rule.** Which changes require re-authorization: any weight change, performance drift past a threshold, or changes to the training pipeline rather than the model?
3. **Who runs the evaluations.** The applicant under agency protocols, the agency itself, or accredited third parties — and who pays?
4. **Monitoring obligations.** What post-deployment reporting is mandatory, and what observed behavior triggers suspension versus correction?
5. **Failure allocation.** When an authorized system harms someone after an update, how is responsibility divided between the developer, the deployer, and the agency that authorized the regime?

### Mandate literacy in professional training {vision: fidelity}

**Scenario.** A newly appointed regulator at a federal financial agency, Arjun, sits down for his orientation and realizes something odd. Every part of his formal training is about rules — which statutes, which enforcement tools, which precedents. Nothing in it asks him to engage with what the agency is actually for — whose savings it protects, what "fair dealing" was meant to cover, why the statute he is learning to enforce was passed in the first place. The senior colleagues who carry that understanding are due to retire in the next decade. Arjun begins to understand that if the training pipeline doesn't change, the agency will still enforce rules but will lose its ability to recognize when the rules and the purpose have diverged.

**Challenge:** Design a professional-training regime that builds mandate literacy — the capacity to recognize when an institution's rules have drifted from its purpose — into the pipeline that produces a national-scale institution's practitioners, and specify which programs carry it, how it is taught, and how the state's role relates to profession-set content.

**Evaluation.** A strong design makes mandate literacy something practitioners can be tested and credentialed on rather than a forgettable box-check, and gives the system a way to surface and replace training programs that have themselves drifted.

**Design choices the team must take a position on.**
1. **Which programs carry it.** Which professional training programs should carry mandate-level instruction, and how — following the partial models of law-school jurisprudence and medical-school ethics rotations, or something broader?
2. **Lip-service resistance.** How do you prevent mandate-training from being taught as lip service — a box-check that everyone forgets after graduation?
3. **State vs. profession.** What role should the state play, given templates like federally funded medical residencies whose content is nonetheless set by professional bodies?
4. **Surfacing drift.** How do you surface and replace training programs that have themselves drifted — journalism schools that train for clicks, business schools that train for shareholder-value maximization at the expense of broader mandates?
