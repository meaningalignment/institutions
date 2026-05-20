---
human_label: "Contracts & escrow"
status: body_draft
owner: oliver
starred: true
---

# Agent-to-agent contracts

## At a glance

### Coordination challenge

How two parties make breaking a deal cost more than keeping it.

### Examples

- Contract law
- Escrow services
- Letters of credit
- Surety bonding

### How AGI breaks them

- Agents entering into contracts might massively increase overall contracting volume, and the number of disagreements adjudicative institutions have to process.
- Cheap agent-lawyers make it worth pursuing small disputes that humans would have absorbed informally, pushing more of them into formal adjudication.
- Agents can take actions human contract-drafters didn't think to forbid or require.
- Cheap agent-lawyers can search a contract for loopholes to exploit at superhuman speed, making exploits worth pursuing that previously weren't.

## How humans solve this today

Today, contracting is mostly between humans, firms, and other human-run entities, supported by a layered stack of instruments.

- **Contract law.** Written terms backed by courts. In practice, disputes rarely reach court — most get absorbed informally between counterparties, then through internal escalation, lawyer letters, mediation, and arbitration. Each step is more expensive than the last, filtering out disagreements not worth pursuing.
- **Escrow.** A neutral third party holds the money until both sides perform. In a house sale, the buyer's deposit sits with a title company and only moves to the seller once title has transferred. Used when being able to sue in case of dispute is not enough assurance.
- **Letters of credit.** A bank substitutes its own credit for the buyer's, paying the seller on presentation of specified documents (bill of lading, inspection certificate, etc.). Lets parties in different jurisdictions trade without trusting each other or each other's courts.
- **Surety bonding.** A third party (the surety) guarantees the principal's performance to the obligee, and pays out if the principal defaults. Covers performance over time on large projects where escrow won't work and litigation is too slow.

## Where AGI breaks it

As agents start contracting with each other, the volume and economics of contracting shift in ways that strain this stack.

1. **Agents entering into contracts might massively increase overall contracting volume, and the number of disagreements adjudicative institutions have to process.** Human contract systems work as a funnel: the vast majority of disagreements get absorbed informally between counterparties, a smaller fraction reach internal escalation or lawyer letters, and only a tiny residue reaches mediation, arbitration, or court. The formal layers (arbitrators, commercial courts, specialized tribunals) are built for that small residue. Agents that contract at machine cadence can drive the absolute number of disagreements far past what the funnel's lower layers were built to clear, even if the per-contract dispute rate stays constant.

2. **Cheap agent-lawyers collapse the cost filter that kept most disagreements out of formal adjudication.** Today, a $500 disagreement is rarely worth a $5,000 lawyer letter, so it gets absorbed informally — and the mutual unwillingness to spend pressures both sides toward settlement. Agent-lawyers running at near-zero marginal cost remove both: the same $500 disagreement becomes worth pursuing, and neither side feels cost-pressure to back down first, so disputes that used to settle informally now grind toward formal adjudication.

3. **Agents can take actions human contract-drafters didn't think to forbid or require.** Human contracts can't list every case in advance, and that's tolerable when the unforeseen cases look like things a court has seen before and can rule on by analogy. Agents act over a wider range of moves, including ones no human counterparty would have considered, so the gaps in a contract widen.

4. **Cheap agent-lawyers can systematically search a contract for loopholes to exploit at superhuman speed, making exploits worth pursuing that previously weren't.** Human contracts assume the cost of finding and pursuing a loophole is meaningful (drafting attention, legal review, the reputational cost of looking like you're playing games with the contract) so small exploits usually aren't worth chasing. Agents can enumerate edge cases across a contract's surface area at near-zero cost and select the most exploitative interpretations available, turning previously-uneconomic exploits into worthwhile ones.

## Problem Sets

### Triage for agent-generated disputes

**Scenario.** AI-mediated procurement has become standard in the freight industry: most brokerages, forwarders, and shipping firms route their bidding, contracting, and dispute correspondence through agents. Each counterparty pair now generates orders of magnitude more contractual interactions than before, and a small but proportional fraction surface as disputes. Commercial mediation that used to clear in three months now takes over a year. Shippers stop dealing with counterparties that won't post a performance bond (a third-party guarantee, collectable in days from a surety if the counterparty fails), since waiting a year for a mediation award isn't survivable. Smaller brokerages can't get bonded and exit the market. The largest brokerages, now the only ones shippers will deal with, start running their own internal dispute boards that issue binding decisions as a condition of doing business — a private substitute for the public adjudicative system that has effectively stopped providing one, and one captured by the largest players in the sector.

**Challenge:** Design an adjudication regime for agent-mediated contracting that scales with dispute volume, keeps small counterparties able to participate, and doesn't leave sectors fragmenting into private dispute boards run by the largest players. Deliverable: a regime that takes a position on the design choices below, applied to the logistics scenario above.

**Design choices the team must take a position on.**
1. **Who runs the new capacity.** State commercial courts, accredited private arbitrators, sector-specific boards under public oversight, or a mixed regime?
2. **What gets auto-resolved vs. heard by humans.** Where do you draw the line, and what role do human adjudicators play — audit, appeal, precedent-setting, or first-pass?
3. **Accountability for private adjudicators.** If private boards carry the volume, what stops them from being captured by their largest customers?
4. **Cost incidence and access.** Who pays, and how do you keep cost from itself filtering small counterparties out?
5. **Precedent and consistency.** Do auto-rulings bind future near-identical disputes, or does each dispute start fresh? Who curates the precedent set?
