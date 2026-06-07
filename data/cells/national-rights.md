---
human_label: "Constitutions, courts & judiciary"
human_era: "18th-20th c."
human_era_bucket: early-modern-modern
status: summary_draft
owner: oliver
visions:
  fidelity: "Constitutional justiciability of institutional purpose"
---

# Agents that adjudicate rights

## At a glance

### Coordination challenge

How a nation guarantees individual entitlements against the state and other powerful actors.

### Examples

- Adversarial trial procedure
- Civil settlement and dockets
- Federal Rules of Evidence
- Jury trial and the right to be heard
- Common-law precedent

### How AGI breaks them

- We could see an explosion of agent-to-agent disputes that no human court is capable of handling.
- Adversarial procedure assumes both sides pay to fight, but agents let one side bury the other in motions.
- Handing adjudication to AI to speed things up breaks the legitimacy courts depend on.
- Settlement clears dockets because suing is costly, but agents make it cheap for whoever can afford them.
- AI could generate fake documents and recordings, enabling malicious actors to overwhelm evidence law.

## How humans solve this today

National judiciaries are the institutions humans built to adjudicate rights at scale. They rest on a stack of slowly accreted commitments: due process, the right to be heard, transparency of reasoning (written opinions), the right to appeal, separation of powers, an independent bar that can challenge the state's case, and a long process for promoting a member of the legal community into the role of judge. The mechanisms are deliberately slow — pleadings, discovery, motions, hearings, deliberation, written decision — because the consequences of getting it wrong are durable and often irreversible. A judgment is in part an act of communication: it tells the parties (and the public) what the court found, what rule it applied, and what reasoning got it from one to the other. The whole machinery only works because the parties are humans who can understand a ruling, comply with it, appeal it, and live (or die) with it.

A vivid case: Ahmad runs a two-truck delivery company. When a freight broker refused to release escrowed funds last year, his lawyer filed in small-claims court. The hearing took an afternoon, the magistrate's reasoning fit on two pages, both parties understood why they'd won or lost which counts, and the order was enforceable.

## Where AGI breaks it

When at least one party to a dispute is an AI agent — autonomous enough to hold resources, make commitments, and cause harms — the judicial machinery hits problems with no human analogue:

1. **What does "due process" mean for an agent?** Can an AI "understand" a ruling in the way due process requires? Does giving an agent the right to be heard mean letting it submit its own reasoning trace, or does standing belong only to the principal?
2. **Remedy is undefined.** If an agent can be rolled back to a prior state, retrained, or duplicated, what does it mean to "punish" or "make whole"? Compensation in what currency, paid by whom?
3. **Asymmetric inspectability.** An adjudicator may be able to inspect the source code or weights of one party (a small open-source agent) but not the other (a proprietary system). What does fairness mean under that asymmetry?
4. **Speed-of-decision pressure.** Agent-to-agent commercial disputes need to be resolved in days, not the months human courts take, or commerce stalls; but compressing process is exactly what due process is built to resist.
5. **Identity and persistence.** A human defendant exists for the trial and after; an agent might be deprecated, forked, or replaced before the case ends.

## Scenarios

Ahmad runs a two-truck delivery company. Last month his logistics agent booked a load through a freight-matching platform's agent; the load never arrived, a second carrier was dispatched, Ahmad's agent was charged a cancellation fee, and now the platform's agent is refusing to return $8,400 his agent had escrowed. His lawyer says human small-claims court will take nine months and she's never seen an agent-to-agent fact pattern. Ahmad needs a forum he can actually use — one that can inspect both agents' logs, reason about which agent committed to what, render a binding decision, and move the money. He needs it this quarter, not in the next Congress.

## Problem Sets

### Standing and Procedure for AI-on-AI Adjudication

**Anchor contexts.** A small-business shipper whose agent is in a payment dispute with a freight platform's agent; a software contractor whose agent is in a copyright dispute with a publishing platform's agent.

**The gap.** We lack a procedural code for adjudicating disputes in which at least one party is an autonomous AI agent — one that satisfies the spirit of due process and procedural justice while accommodating the ways agents differ from human litigants.

**Design choices the team must take a position on.**
1. **Standing.** Does the agent have standing to be a party, or only its principal? If both, how is conflict between agent and principal handled (rare, but real — e.g., agent says "I committed", principal says "I never authorized")?
2. **Evidentiary regime.** Are agent logs, weights, and reasoning traces admissible — and required? On whose side does the burden of producing them fall? What's the privilege analogue for proprietary models?
3. **Remedy menu.** What can the adjudicator order — escrow release, compensation, agent-deprecation, retraining requirement, prospective behavioral injunction? Pick three and defend the set.
4. **Speed vs. process.** What's the minimum process for a dispute under $X, between $X and $Y, and over $Y? Where is the appeal floor?
5. **Adjudicator identity.** Is the adjudicator a human judge (slow, legitimate), an AI panel (fast, contested legitimacy), or hybrid (AI fact-finding, human ruling)? Defend the choice for the chosen jurisdiction.

**Success criterion (stress tests).** A regime succeeds if it survives:
- An $8,400 agent-on-agent dispute resolves in two weeks with a written reasoning the losing party's principal can read and contest.
- One party is a small-business agent; the other is a fleet from a major platform. The procedural code does not advantage the resource-rich side beyond what their facts merit.
- An adjudicator inspects one agent's full trace; the other party operates a proprietary model that won't share weights. The asymmetry is handled without making the proprietary side automatically lose.
- The losing agent is deprecated mid-case by its principal; the remedy still attaches to the principal and does not vanish with the agent.
- An appellate court reviews the decision; the trial-level reasoning is sufficient for meaningful review.

**Deliverable.** A short procedural code (5–10 rules) for the chosen jurisdiction. Flag at least two rules that have no analogue in human adjudication and explain why human procedure could do without them.

### Drafting Fidelity as Constitutional Doctrine {vision: fidelity}

**Scenario.** Eight years ago, Liana's father signed up for a social platform whose tagline was "stay close to the people you love." It's where the family group chat lives; it's where photos of the grandkids arrive. Over the past two years, the feed has filled up with strangers, the group-chat notifications have grown quieter, and her father now spends most of his evenings on it alone, watching short videos. Internal documents leaked last month show the product team quietly retired its "friendship-formation" metric in favor of session time. Liana, a retired civil-rights lawyer, wants to bring a claim that the platform has walked away from what it publicly committed to. She cannot find a doctrine that lets her.

**Challenge:** Draft either a model constitutional amendment (≤200 words) or an interpretive doctrine that establishes "fidelity" — institutions must act in accordance with their thick mandates rather than substitute thin proxies — as a justiciable principle alongside liberty and equality, with a short interpretive commentary.

**Evaluation.** A strong draft survives the Rawlsian objection by constitutionalizing the form of fidelity rather than any particular thick content, and carries limiting principles potent enough that the doctrine does not swallow all institutional design.

**Design choices the team must take a position on.**
1. **Scope.** Does the fidelity principle protect individuals' relationship to institutions, institutions' relationship to their mandates, or both?
2. **Invocability.** Who can bring a fidelity claim against a national institution?
3. **Limiting principles.** Which combination of limiting doctrines bounds the principle — political-question doctrine (some fidelity questions non-justiciable), subsidiarity (claims resolved at the lowest level), and ripeness (the deviation must be concrete, not speculative)?
4. **The Rawlsian objection.** How does the amendment survive the charge that constitutionalizing thick values is illiberal in a pluralist society — by constitutionalizing the form of fidelity rather than its content, or another route?
