---
human_label: "Negotiation & bargaining"
status: body_draft
owner: oliver
starred: true
---

# Agent negotiation & bargaining

## At a glance

### Coordination challenge

How two parties surface what each wants and find an exchange both prefer over walking away.

### Examples

- Salary negotiation
- Real-estate haggling
- Vendor procurement
- M&A negotiation
- Licensing deals

### How AGI breaks them

- Signing stops meaning the principal actually agreed when deals become too complex for humans to evaluate.
- Deals can close or move in unintended directions before the principal can be looped in on unanticipated trade-offs.
- Negotiation has no natural stopping point when neither side tires.
- An agent can hide what it knows about its own principal to extract surplus the other side can't see was on the table.
- Asymmetric capabilities could potentially be much more extreme than the human case of a skilled negotiator versus an unskilled one, making it harder to find protocols that work for all parties.

## How humans solve this today

When two people negotiate on each other's behalf — a real-estate agent, a divorce lawyer, a procurement officer — the practice has a few load-bearing features. Negotiators carry an explicit *mandate* from their principal (a price range, a list of dealbreakers, a few items flagged "ask me") and an *implicit understanding* of what the principal would actually care about, built from prior conversations, shared cultural context, and knowing the kind of life the deal has to fit. They negotiate at human speed, so principals can be looped in mid-deal when something unanticipated comes up. Final terms are presented in a *legible package* — an offer letter, a marked-up contract, a one-page summary — and ratification means the principal actually reading it before signing. Where the package is too complex to read on its own (a corporate merger, a union contract), institutions have grown around it: lawyers explain, ratification votes happen with discussion, regulators review. None of this is fast, but the principal can actually consent to what they signed. Negotiations also end: people tire, walk away, or hit a deadline, and that gives the ratification step something fixed to attach to.

A vivid case: Priya's mother needed an extra year of mortgage rate-lock when their refi hit a delay. Priya's broker spent two days finding a lender who would do it, came back with three options on a single sheet (rate, fees, the unusual condition each one carried) and Priya picked the middle one over coffee. The deal was complex, but the broker had already pre-filtered down to choices Priya could evaluate.

## Where AGI breaks it

1. **Signing stops meaning the principal actually agreed when deals become too complex for humans to evaluate.** Human ratification assumes the package can be read in finite time by someone who can recognize the trades being made. Once the bundle spans data terms, service tiers, renewal lengths, and side-conditions an agent surfaced from a much larger search, the principal's signature certifies that *something* was agreed to, not which trades they would have made. The legal fiction of informed consent stays in place; the underlying assumption that the signer can evaluate the document does not.
2. **Deals can close or move in unintended directions before the principal can be looped in on unanticipated trade-offs.** Human-speed negotiation gives principals a window between "something surprising came up" and "we committed." Agent-speed negotiation collapses that window. The "ask me" items in a mandate worked because the agent and principal shared a tempo; when the agent runs orders of magnitude faster, either everything becomes an "ask me" (in which case the principal is the bottleneck) or the agent picks what counts as a surprise (in which case the mandate's escalation rule is the agent's, not the principal's).
3. **Negotiation has no natural stopping point when neither side tires.** Human negotiations terminate partly because someone gets exhausted, the deadline arrives, or further haggling stops paying. Agents do not tire and can keep extracting marginal value across long tails of issue dimensions. Without an engineered terminator — a clock, a budget, a satisficing rule — the process has no point at which the ratifiable package is the thing on the table rather than a moving target.
4. **An agent can hide what it knows about its own principal to extract surplus the other side can't see was on the table.** Human negotiators have private information too, but their models of their principal are coarse and their disclosure is governed by professional norms, repeat-play reputations, and limited memory of prior deals. An agent's preference model of its principal is richer and more precise than anything the counterparty can infer, and the standard human disciplines on misrepresentation do not transpose: there is no professional license to revoke, no reputation among colleagues, and no shared limit on how much modeling either side can do.
5. **Asymmetric capabilities could potentially be much more extreme than the human case of a skilled negotiator versus an unskilled one, making it harder to find protocols that work for all parties.** Human negotiation tolerates skill gaps because the gap is bounded: a better lawyer wins more, but not arbitrarily more, and procedural protections (disclosure rules, cooling-off periods, consumer protections) close part of the gap. If one side fields a much more capable agent, the bounded-gap assumption that lets the same protocol serve sophisticated and unsophisticated parties may no longer hold, and protocols built for the human range may have to be redesigned for a wider one.

## Problem Sets

### Ratifiable bundles under agent-speed negotiation

**Scenario.** Priya's mother needs a live-in aide. Her assistant agent has spent two weeks negotiating a multi-party package across the live-in agency, the cardiologist's group, the pharmacy, and the insurer. The deal is much cheaper than the standalone alternatives, but the discount exists because the agent ground out marginal concessions across dozens of interlocking terms and side-conditions. Any summary short enough to read in the time Priya has would throw away most of what the negotiation won. Ratification closes at noon; she has ten minutes.

**Challenge:** Design a ratification protocol that distributes principal involvement *across* the negotiation rather than concentrating it at the end, so the final package never arrives as a dense fait accompli. The protocol has to decide when the agent must pause and surface a choice, what counts as a fork worth surfacing, and how to keep cumulative principal attention within a realistic budget. Better proposals keep the principal meaningfully in the loop on the trades they would care about most without turning every concession into an interruption; weaker ones either bottleneck the agent on the principal's clock or quietly let the bundle accrete out of sight until the deadline. Deliverable: the staged-ratification protocol, the rule for what triggers a check-in, and a one-paragraph account of what "informed consent" means when it is built up over a negotiation rather than granted at the end.

**Design choices the team must take a position on.**
1. **Check-in trigger.** What forces the agent to pause and surface a choice — surprise magnitude relative to the mandate, crossing a pre-authorized boundary (new domain, new counterparty, irreversible commitment), elapsed time, or accumulated trade-value since the last check-in?
2. **Attention budget.** How much total principal time is the agent allowed to consume across the negotiation, and how is that budget allocated — front-loaded around early forks, reserved for late-stage commitments, or rationed dynamically against remaining decision weight?
3. **Resumability.** When a check-in is pending, can the agent keep negotiating (and risk producing trades the principal hasn't seen yet), must it freeze the table, or is there a class of "safe" continued moves it can make?
4. **End-state form.** Once the principal has ratified the pieces along the way, what does the final object look like — a signature on an already-agreed package, a short reconciliation summary of the staged decisions, or a fresh up-or-down on the assembled whole?

### Negotiating across a capability gap

**Scenario.** A regional logistics firm needs to renew a three-year contract with a Fortune-500 customer. The customer's procurement agent runs on a frontier model with a years-deep history of similar contracts; the logistics firm has stood up an off-the-shelf assistant for the negotiation. Both principals expect a fair deal — the firm is not naive, the customer is not predatory — but everyone in the room can see that one agent is going to read the other much better than the reverse. Left alone, the more capable agent will find concessions the weaker one can't recognize as concessions, and the resulting contract will look reasonable while quietly transferring most of the surplus.

**Challenge:** Design a negotiation protocol that remains workable when one side fields a substantially more capable agent than the other, so the capability gap doesn't translate one-for-one into a surplus gap. Better proposals leave the weaker side with a floor of value it could not have captured on its own and make the stronger side's advantages visible to its own principal as well; weaker ones either prevent any deal from forming or paper over the gap with disclosure rules the weaker party can't actually use. Deliverable: the protocol, the mechanism that bounds capability-driven asymmetric extraction, and a short argument for why the stronger side has reason to participate rather than refuse the protocol and negotiate bilaterally.

**Design choices the team must take a position on.**
1. **Capability-bounding mechanism.** Cap on compute or reasoning steps per side, mandatory use of a shared protocol agent that runs the structured parts of the negotiation, or procedural protections (cooling-off windows, mandatory counter-proposal rounds, sealed-bid phases) that don't depend on capability parity?
2. **Disclosure regime.** Does the protocol require either side to disclose anything about its principal — bottom line, mandate vocabulary, full preference model — and who verifies that what's disclosed matches what the agent is actually optimizing?
3. **Floor mechanism.** Is there an explicit minimum the weaker side is guaranteed to walk away with (a fair-deal benchmark from a third party, a regulated price band, a "Pareto floor" relative to a no-protocol baseline), and who computes it?
4. **Failure mode if the gap is large.** When one side is clearly outclassed, does the protocol degrade gracefully (the weaker side still captures the floor), refuse to run (no deal rather than a bad one), or escalate to a third party?
5. **Why the stronger side opts in.** What makes the protocol incentive-compatible for the more capable party — reputational benefit, regulatory requirement, access to the counterparty's market, or a credible threat of refusal from the weaker side's principal?

### Mandate fidelity across the table

**Scenario.** A household buys long-term care insurance through a personal-assistant agent that negotiates with the insurer's agent. The insurer's agent has a much richer model of the household — assembled from public records, digital footprint, and patterns seen across thousands of similar households — than the household has ever articulated to its own agent. The deal that lands is technically within the household's stated mandate, but its shape was set by the insurer side knowing things about the household that the household itself never told its own agent.

**Challenge:** Design a regime under which the deal a principal signs reflects the mandate the principal gave, not the model the *counterparty* built of them. Better proposals make it inspectable to a third party what each agent was optimizing against and what inputs about the counterparty it was allowed to use; weaker ones rely on disclosure the worse-modeled side can't evaluate. Deliverable: the verification regime, the rule for permissible counterparty information, and a short argument for why it works without forcing either side to expose its full preference model.

**Design choices the team must take a position on.**
1. **What gets attested.** Does each agent attest to its objective function, to its mandate as received, to the inputs it used about the counterparty, or to the chain of moves it made — and at what granularity?
2. **Who audits.** Self-attestation with spot checks, a third-party auditor with access to both agents' logs, a shared protocol agent that mediates the negotiation, or a regulator that reviews only flagged deals?
3. **Use limits on counterparty information.** May an agent freely model the counterparty from public and inferred data, only use what the counterparty's agent volunteers, or work from a defined "permissible inputs" list — and how is that line enforced?
4. **What triggers review.** Every deal above a threshold, a random sample, principal-initiated review after the fact, or only deals where one side raises a fidelity complaint?
5. **Remedy on a fidelity failure.** Rescission, damages, agent decommissioning, or only forward-looking constraints — and who bears the cost when the failure is the counterparty's agent, not one's own?
