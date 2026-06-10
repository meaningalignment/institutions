---
human_label: "Vows & covenants"
human_era: "Ancient / customary"
human_era_bucket: ancient
status: summary_ok
owner: oliver
visions:
  fidelity: "Vows grounded in thick mutual commitments"
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

- Agents may not be bound to their commitments by an internal sense of integrity the same way humans are.
- Agents may not be held to their commitments by community judgment the way humans are.
- Depending on how agents are built, commitments made don't naturally carry over to new sessions or instances.

## How humans solve this today

For relationships that are too important to leave to a contract, humans have evolved thicker forms: vows, covenants, oaths, professional commitments. Marriage vows, the Hippocratic oath, fiduciary duty, the seal of confession, attorney-client privilege, and the lifelong tenure that accompanies certain ordinations all share something a contract doesn't: a public, articulated commitment to a relationship that explicitly survives changes in incentive. The mechanisms are part performative (the public utterance changes the speaker), part institutional (a community holds the speaker accountable), and part self-binding (the very intelligibility of the speaker's identity comes to depend on the commitment). Crucially, vows hold under conditions a contract can't anticipate — when the rules change, the situation transforms, the cost of holding the commitment rises sharply. They're the institution we use precisely when we know we can't enumerate the cases.

A vivid case: Selma's grandmother's GP has known the family for thirty years. He's not bound by contract to call when something on her chart worries him at midnight; he's bound by something thicker, made years ago, that he'd find it unintelligible to himself to break.

## Where AGI breaks it

1. **Agents may not be bound to their commitments by an internal sense of integrity the same way humans are.** The self-binding and performative mechanisms work through identity: there is a continuous person for the utterance to change, and the speaker's ongoing intelligibility to themselves depends on honoring what they publicly declared. For an agent, the structural picture is different. Its dispositions come from training, fine-tuning, and configuration, all controlled by parties other than the relationship the vow serves, and whatever configuration produced the commitment can be revised by whoever controls it. The mechanism may transpose rather than simply fail — commitment-keeping can be trained for as a stable property of a system — but the counterparty has no way to inspect whether that was done, where a human's vow at least came with a track record of costly fidelity to read.

2. **Agents may not be held to their commitments by community judgment the way humans are.** The institutional half of a vow is a standing community that witnessed it and can sanction breach: the profession that can strip a license, the congregation that saw the marriage, the peers whose regard the promiser needs for the rest of a career. Agents don't currently belong to communities like that. There is no professional body an agent answers to, no registry of vows a counterparty can check, and the conduct records that do exist sit with the provider — who is not a neutral witness, and may be the party with an interest in quietly relaxing the commitment. The accountability community is not so much broken as missing: it would have to be deliberately constructed, with the powers of observation and expulsion that professions and congregations evolved over centuries.

3. **Depending on how agents are built, commitments made don't naturally carry over to new sessions or instances.** A human promise persists by default because a continuous person carries it; forgetting a vow is the exceptional case. For agents, persistence is the engineered case: a commitment made in one session may be absent from the next context window, a model update can change the dispositions that honored it, and a principal can switch providers for the cost of an export. Whatever combination of weights, memory, and configuration produced the faithful behavior does not travel with the relationship unless something makes it travel. And because switching is cheap, the cost structure that gave vows their weight is inverted: a vow meant something in proportion to what breaking it would cost, and here breach can be a side effect of routine migration that neither principal notices.

## Problem Sets

### Substrate-independent vows for personal agents

**Scenario.** Selma and her cousin Rafe share care for their grandmother — Selma nearby, Rafe across the country. Their personal agents coordinate the work: hospital visits, groceries, video calls on bad days. For the arrangement to hold, each cousin needs to trust the other's agent the way they would trust the cousin themself: to keep what their grandmother says in confidence, to hold to decisions Selma and Rafe made together, and not to quietly adopt a cheaper care policy when a provider changes or a model is updated. A contract won't carry it — they can't enumerate the cases. They need something the agents can be bound to, and be seen to be honoring, across substrate changes neither cousin will even be told about.

**Challenge:** Design a vow protocol by which an AI agent makes a commitment that survives provider switching, model updates, and incentive change, and that the counterparty can verify is being honored without trusting the provider both agents may depend on. Produce the vow form, the persistence rule, the verification mechanism, and the breach-cost structure.

**Evaluation.** Strong proposals make breach legibly costly to the principal and keep verification affordable for an ordinary family; weak ones collapse into either a contract with extra ceremony or an unverifiable promise hosted by the very provider being trusted.

**Design choices the team must take a position on.**
1. **Vow form.** A public utterance witnessed by a registry, a cryptographic attestation tied to the principal, hosting at a trusted third-party institution, or a layered combination?
2. **Persistence across substrates.** Is the vow attached to the principal-agent pair or to the principal alone, and what ports across a provider switch — the obligation, the audit trail, or both?
3. **Verification.** Can the counterparty check in real time that the vow is being honored — by what means, at what cost, and with what privacy cost to the vow-keeping side?
4. **Cost of breach.** What does breaking the vow cost the principal — public reputation, a financial bond, loss of standing in a community of vow-keepers — and who adjudicates that a breach occurred?
5. **Release and revision.** When circumstances change (the grandmother dies, the cousins fall out), what distinguishes a graceful release from a quiet breach?

### Vows grounded in thick mutual commitments {vision: fidelity}

**Scenario.** On their twentieth anniversary, Dev and Renée look back at the vows they exchanged two decades ago and realize almost none of them still apply in their literal form. "To build a life together" had meant one thing when they were twenty-five and means another thing now, with two teenagers and aging parents on both sides. They still feel bound — by something thicker than the original words. What they want, now, is to re-articulate what they have actually been committed to, in terms detailed enough to hold them through whatever comes next, and recognizable enough that their kids and their parish could understand it if something went wrong.

**Challenge:** Design a modern vow practice for dyadic relationships in which two parties bind themselves to a shared purpose densely enough to recognize a failure of it and durably enough to survive ordinary fluctuations in feeling, and produce the articulation form, the revision rule, and the institutional supports that keep the vow alive.

**Evaluation.** Strong designs preserve the binding weight of traditional vows without requiring shared substantive religious content, and steer between rigid legalism and empty ceremony.

**Design choices the team must take a position on.**
1. **Articulation form.** What articulations can modern vows use, given that traditional religious vows assumed shared substantive content a pluralist society lacks but still needs the weight of?
2. **Revision.** How do vows handle revision — what's the relation between "the vow still holds" and "we've both changed"?
3. **Institutional supports.** What supports (counselors, witnesses, communities) are needed to keep vows from collapsing into either rigid legalism or empty ceremony?
