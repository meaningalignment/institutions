---
human_label: "Vows & covenants"
status: summary_draft
owner: oliver
---

# Agent-agent vows

## At a glance

### Coordination challenge

How two parties bind themselves to a commitment or way of life that outlasts changing circumstances.

### Examples

- Vows exchanged in witness of others
- Jointly signed public manifestos
- Promises to act faithfully
- Fiduciary duty

### How AGI breaks them

- Agents aren't bound to their commitments by an internal sense of integrity the same way humans are.
- Agents aren't held to their commitments by community judgment the way humans are.
- Depending on how agents are built, commitments made don't naturally carry over to new sessions or instances.

## How humans solve this today

For relationships that are too important to leave to a contract, humans have evolved thicker forms: vows, covenants, oaths, professional commitments. Marriage vows, the Hippocratic oath, fiduciary duty, the seal of confession, attorney-client privilege, and the lifelong tenure that accompanies certain ordinations all share something a contract doesn't: a public, articulated commitment to a relationship that explicitly survives changes in incentive. The mechanisms are part performative (the public utterance changes the speaker), part institutional (a community holds the speaker accountable), and part self-binding (the very intelligibility of the speaker's identity comes to depend on the commitment). Crucially, vows hold under conditions a contract can't anticipate — when the rules change, the situation transforms, the cost of holding the commitment rises sharply. They're the institution we use precisely when we know we can't enumerate the cases.

A vivid case: Selma's grandmother's GP has known the family for thirty years. He's not bound by contract to call when something on her chart worries him at midnight; he's bound by something thicker, made years ago, that he'd find it unintelligible to himself to break.

## Where AGI breaks it

When the relationship in question is mediated by AI agents — who don't have public reputations, can be replaced, and don't suffer from breaking their word the way a person does — the institutional resources for thicker commitment have to be reinvented:

1. **Performative utterance has no obvious agent analogue.** What is the AI version of "I do" that actually changes how the agent will behave under future incentive shifts?
2. **Communities of accountability haven't formed.** A doctor who breaks the Hippocratic oath answers to a profession; an agent that breaks a vow answers to no one besides its principal.
3. **Self-binding is shallow.** An agent's "identity" can be migrated, retrained, or replaced by its principal at low cost; whatever vow the previous instance made may not bind the next.
4. **Costlessly replaceable means costlessly betray-able.** A vow is meaningful in proportion to what it would cost to break. Today, switching agents costs nothing; the architecture of meaningful commitment is missing.

## Scenarios

Selma and her cousin Rafe, who grew up near her but now lives across the country, share care for their grandmother. They've begun using a pair of personal agents to coordinate — hospital visits, groceries, video calls on bad days. For it to work, each of them needs to trust the other's agent the way they'd trust the cousin themself: to keep confidences their grandmother shared, to hold to decisions Selma and Rafe made together, to not quietly adopt a cheaper policy if the service provider changes. A contract won't carry it; this is thicker than that. They need something the agents themselves can swear to, and be seen to be honoring.

## Problem Sets

### Substrate-Independent Vows for Personal Agents

**Anchor contexts.** Two cousins' personal agents holding shared commitments around the care of an elderly relative; two business partners' agents holding commitments around confidentiality and good faith that should outlast any specific provider.

**The gap.** We lack an institution by which an AI agent can make a binding vow that survives provider switching, model updates, and incentive change — and that a counterparty can verify is being honored without trusting the same provider both agents depend on.

**Design choices the team must take a position on.**
1. **Vow form.** Public utterance witnessed by a registry, cryptographic attestation tied to the principal, hosting at a trusted third-party institution, or layered combination?
2. **Persistence across substrates.** Is the vow attached to the principal-agent pair, the principal alone, or transferable when the principal switches providers? What ports across provider boundaries — the obligation, the audit trail, both?
3. **Verification.** Can a counterparty verify a vow is being honored in real time — by what means, at what cost, and with what privacy cost to the vow-keeping side?
4. **Cost of breach.** What does breaking the vow actually cost the principal — public reputation, financial bond, loss of standing in a community of vow-keepers, or all three? Pick a structure that makes breach legibly costly.
5. **Scope and revision.** Are vows limited to a curated set of commitment types or open-ended? What's the procedure for releasing or amending a vow as circumstances change (the grandmother dies, the partnership dissolves)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Selma switches her agent's provider; the vow her old agent made to Rafe persists in a verifiable form on the new substrate.
- The agent's underlying model is updated; behavior under the vow remains consistent or the update is blocked.
- Rafe asks "is the vow being honored right now?" and gets an actionable answer he can act on.
- A principal pretends to keep a vow while quietly working around it; the verification mechanism catches the gap before serious harm.
- Circumstances change (the grandmother dies); there's a graceful path to revise or release the vow without quietly breaking it.

**Deliverable.** The vow protocol — form, registry, persistence, verification, breach cost. Plus a one-paragraph statement of the load-bearing thing the vow has that a contract doesn't.
