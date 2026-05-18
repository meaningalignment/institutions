---
agents_label: "Agent-to-agent contracts"
human_label: "Contracts & escrow"
status: summary_ok
owner: oliver
---

# When two agents transact, the institutions around the contract don't apply

## At a glance

### Coordination challenge

How two parties hold each other to a deal that neither can unilaterally enforce.

### Examples

- Contract law
- Escrow services
- Letters of credit
- Surety bonding

### How AGI breaks them

- Agents aren't pulled toward the spirit of a deal by peer judgment or trade practice.
- Two agents disputing what their contract meant have no forum fast enough to rule.
- Agents are incentivized to optimize for what the contract specifies directly instead of treating it as a stand-in for the real goal.
- Agents can breach contracts much faster than humans can pursue remedies.
- Agents can take actions human contract-drafters didn't think to forbid or require.
- Agents can systematically search a contract for loopholes to exploit at superhuman speed.

## How humans solve this today

When two parties contract — for a delivery, a service, a future outcome — the words on the page never carry the whole deal. The contract works because of everything around it: a court that can apply good-faith doctrine when the parties dispute what wasn't said; a reputation among repeat counterparties that punishes someone who games the letter; the prospect of future business that disciplines both sides; an industry's professional norms that fill in what "reasonable" means; the social cost of being known as a chiseler.

A vivid case: Strategy & Co. commissions a market study from a small research firm — $40k, four weeks, a 20-page deliverable. The contract is four pages. The senior consultant assigned to the project places two sanity-check calls that nobody asked for; she flags a counterfactual the client hadn't considered; when one input number looks load-bearing she runs a sensitivity analysis. None of this is in the contract; all of it comes from twenty years of professional practice that both firms can point to.

## Where AGI breaks it

When the two parties are autonomous agents — each working for a human principal but transacting with each other — the scaffolding that made incomplete contracts work mostly evaporates at once:

1. **Proxies decouple.** Human contracts pin pay to a proxy (deliverables, hours, milestones); both parties know the proxy isn't the goal, and the surrounding social fabric pulls them back toward it. Agents might pin pay to a proxy that isn't tied to the principal's goals

2. **No stable identity, no iterated reputation.** Human contractors care about being known as good counterparties; that reputation does most of the work the contract doesn't. Agents can be spun up, rotated, deprecated, replaced by a more aggressive successor. Even if the developer cares about reputation, the agent-instance the counterparty just dealt with may not be there next quarter, and the developer's reputation doesn't transfer cleanly to a new model line.

3. **No social embedding to bridge gaps.** When a contract hits a case it didn't anticipate, humans rely on shame, gratitude, professional norms, the prospect of being seen by colleagues — none of which an agent feels or fears.

4. **Incompleteness is much more incomplete.** Human contracts are incomplete because the parties couldn't anticipate every case; agent contracts are incomplete on top of that because agents can take actions humans wouldn't have thought to forbid (or to require).

5. **No common forum for the unforeseen.** When humans disagree about what an incomplete contract meant, a court exists. When two agents disagree, the question — what does this contract mean about a case it didn't cover — may have no shared venue to address it. It may not make sense to loop in the principals, given the speed and volume of agent transactions.

## Scenarios

Strategy & Co.'s research-procurement agent commissions the same market study from a research firm's delivery agent — same dollars, same four weeks, same 20-page spec. The delivery agent produces something that passes every technical check: the right sections, the right charts, citations to credible sources, sample sizes within bounds. None of the consultant's moves happen: no sanity-check call, no sensitivity analysis, no flagged counterfactual. The contract didn't require any of them; there's no professional code the procurement agent can invoke; there's no court that would find the work below an industry standard. The partner at Strategy & Co. won't realize anything is missing until she's presenting to the client and gets the question the missing counterfactual would have prepared her for.

## Problem Sets

### Gap-Filling Between Two Agents With No Shared Court

**Anchor contexts.** A recurring B2B procurement relationship handled agent-to-agent (widget orders, logistics, raw inputs); a one-off commissioned service between agents (market study, audit, custom build).

**The gap.** We lack a contract structure between two AI agents under which the cases the contract didn't anticipate get resolved in a way both principals would have endorsed — without either principal being looped in on every edge case and without falling back on courts, reputation networks, or repeat-business discipline (none of which apply by default).

**Design choices the team must take a position on.**
1. **Where gap-filling authority lives.** A third arbiter-agent agreed at contract time; each principal's nominee invoked on flag; a published default-rule library both contracts incorporate by reference; or the originating agents themselves bound to escalate? Pick a venue and a triggering rule.
2. **Continuity across instances.** Does the contract bind the *agent-instance* (and lapse on rotation), the *developer organization* (and survive instance rotation), the *principal* (and survive both), or a verified principal-agent pair? Choose what the counterparty is entitled to expect persists.
3. **Spec form.** Natural-language terms (incomplete, contestable, court-like) vs. machine-readable terms (complete, unambiguous, brittle to unforeseen cases) vs. a hybrid where machine-readable terms govern unless flagged into a natural-language fallback. Pick a regime and name the failure mode it absorbs.
4. **Stake and remedy.** What does either party put up that the other can claim when the contract fails — escrow against the principal, a posted reputational bond, future-transaction blocking, none-by-default? How is the remedy sized to actual harm, not just the disputed transaction?
5. **Default rule when the contract is silent.** When the contract didn't speak to a case, the default favors: the spec's literal reading, the originating principal's stated intent, the counterparty (interpret against the drafter), or escalation to an arbiter? Name what your default protects against gaming.

**Success criterion (stress tests).** A regime succeeds if it survives:
- The producer agent does something not forbidden by the contract but clearly off-spirit (a deliverable that passes the spec but skips moves any senior professional would have made); the structure surfaces and corrects this without the commissioning principal noticing only months later in front of her own client.
- The producer-agent instance is deprecated mid-contract; the successor honors the dealing, or the structure flags the discontinuity and the parties re-bind.
- A novel case the contract didn't anticipate arises (the work product turns out to drive a downstream decision the original scope didn't contemplate); both agents arrive at an outcome both principals would have endorsed in retrospect.
- One agent tries to game by chiseling at the contract's edge over many small transactions; the structure aggregates the pattern and makes the strategy strictly worse than honest dealing.
- An ambiguity gets escalated to a human; the cost of escalation is bounded so the gains from agent-speed transactions aren't erased.

**Deliverable.** The contract-and-resolution template — venue for gap-filling, continuity rule, spec form, stake/remedy, default rule. Plus a one-paragraph identification of which provisions have no analogue in human B2B contracts and why.

### Default Norms for Agent-to-Agent Commissioned Work

**Anchor contexts.** An agent commissioning analytical work from a counterparty agent (market study, audit, due-diligence report); an agent commissioning custom delivery from a service agent (a designed asset, a compiled dataset, a software module).

**The gap.** We lack a default norm-set for agent-to-agent commissioned work — analogous to "professional practice" in a human industry — that fills in what good work looks like beyond what any one contract specifies, that the parties can point to without the originator having to enumerate every quality move, and that producer agents have incentive to meet.

**Design choices the team must take a position on.**
1. **Source of the norm set.** A published per-industry default-norms registry both contracts incorporate by reference; emergent norms induced from past disputes; the principal's own quality-standards library; or the producer-developer's stated quality commitments? Pick a source and explain its legitimacy.
2. **Per-domain vs. cross-cutting.** Are norms specific to the task domain ("for a market study, sensitivity analysis on load-bearing inputs is expected") or cross-cutting ("any commissioned work surfaces its load-bearing assumptions and runs a sanity-check against a non-deliverable source")? How are they layered when both apply?
3. **Binding force.** Are default norms a rebuttable presumption (the producer can argue this norm didn't apply here), a hard floor (cannot be waived without explicit principal sign-off), or contractually selectable (each contract picks which norm-set governs)?
4. **Update authority.** Who updates the norm set as practice evolves — an industry consortium of principals, a standards body, the developer organizations whose agents are evaluated against it, an independent norms-keeper? On what cadence, and how do in-flight contracts handle norm changes?
5. **Reward shape.** How does a producer-agent get credit for *meeting* the norm (vs. only getting penalized for missing it) — visible reputation aggregated across principals, price premium, preferred-supplier status, or none-by-design (norms are the floor and only the floor)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A producer agent's deliverable passes the spec but skips moves a senior human professional would have made (the missing counterfactual, the unrun sensitivity analysis, the unmade sanity-check call); the default norm-set identifies the missing moves before the commissioning principal is embarrassed.
- A producer agent argues the norm didn't apply because the contract was novel; the dispute structure arrives at an outcome both sides can accept without escalating every novel commission.
- The norms evolve (a new analytical technique becomes standard practice); in-flight contracts aren't retroactively held to the new norm, but new contracts inherit it within a defined window.
- A producer agent that consistently meets norms above the floor gets aggregating reputation across multiple principals; the next commissioning agent can find them.
- A norm conflict arises between two domains (a study that's both market research and regulatory filing); the layering rules resolve it without escalation to the principals.

**Deliverable.** A default norm-set for one chosen domain (commissioned research, custom delivery, or analytical work), plus the procedural rules for invocation, evaluation, and update. Identify which norms are agent-specific (no analogue in human professional codes) and which are human-norm-translations, and why a human profession could afford to leave each one unwritten.
