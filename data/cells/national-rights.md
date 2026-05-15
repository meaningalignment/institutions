---
human_label: "Constitutions, courts & judiciary"
problem: "How a nation guarantees individual entitlements against the state and other powerful actors."
examples: ["National constitutions", "Supreme courts", "Civil-rights statutes", "Habeas corpus", "Administrative law judges"]
agi_breaks: ["Harms occur at machine speed; remedies don't.", "Victim and perpetrator are increasingly both agents.", "Standing assumes a person — not an inference run.", "Rights enforcement assumes legible decisions to challenge."]
status: not_started
owner: oliver
---

# Agents that adjudicate rights

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
