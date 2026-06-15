---
human_label: "Social conventions"
human_era: "Ancient / customary"
human_era_bucket: ancient
status: body_ok
owner: joe
starred: true
---

# Tacit norms for agent interactions

## At a glance

### Coordination challenge

How two parties act on the unwritten background of mutual expectations around an explicit contract or recurring interaction

### Examples

- Good-faith interpretation of contract terms
- Email etiquette
- Landlord-tenant courtesies
- Journalist-source attribution understandings
- Back-channel diplomatic conventions

### How AGI breaks them

- The norms an agent applies come from its training and instructions, not the relationship, and may not match what these two parties expect.
- The usual way humans enforce norms does not hurt an agent the same way.
- The implicit norms in a relationship evolve through repeated interaction; short-lived agents may not have the context or memory to develop or apply them.
- Agent-agent norms may form quickly and opaquely, leaving human principals to discover the operative frame only after it has already shaped behavior.

## Theory of change

How do two parties keep the unwritten background of a relationship intact when the agent acting for each side draws its manners from training, not from the relationship itself? The pieces exist at the wrong layer. Lab behavior specs like [OpenAI's Model Spec](https://model-spec.openai.com/) and [Anthropic's constitution](https://www.anthropic.com/research/claude-constitution) set generic, model-wide manners, and wire protocols like [A2A](https://a2a-protocol.org/) let agents discover and call each other but carry no relationship norms. Meanwhile [research on LLM populations](https://www.science.org/doi/10.1126/sciadv.adu9368) shows agents spontaneously converging on shared conventions, and biases, with no human in the loop. The missing wedge is a relationship-scoped norm layer: a per-dyad record of the local courtesies, paired with a rule for when an agent must pause a permitted-but-sensitive action to check it. No live product does this yet, so the path is early.

1. Run a research trial in a sandbox of recurring two-agent relationships, testing whether a norm-record plus pause-and-check rule catches relationship-sensitive actions, like the morning-entry case, without making low-stakes exchanges legalistic.
2. Pilot it inside one platform that already brokers repeat agent-to-agent dealing and owns the pain, somewhere like a property-management or logistics marketplace, where brittle borderline cases are a visible cost and the operator can mandate the norm layer for both sides.
3. Fold the norm-record format into an interoperability standard such as A2A, so a working convention becomes the default others reach for, and spreads as agent platforms adopt the shared format.

**Scores**

- Urgency: 2/5 — Real but gradual; agents today still ship with reasonable generic manners.
- Tractability: 3/5 — The norm-record and pause-rule are buildable now on top of existing protocols.
- Neglectedness: 4/5 — Much energy on wire protocols and model-wide specs, little on relationship-scoped norms.
- Maturity: 2/5 — Adjacent pieces exist (specs, A2A, norm-emergence studies); no relationship-norm prototype yet.

## How humans solve this today

Every working relationship sits on an unwritten background: what counts as reasonable, when silence means yes, which courtesies go without saying. Humans handle it a few different ways:

- **In court.** When a contract dispute gets litigated, judges read the terms with good faith and fair dealing in mind, and let past dealings and trade custom fill the gaps. But law is slow and expensive, so it only catches disputes worth suing over.
- **Between repeat partners.** People who work together for years build up their own precedents: who flags borderline errors, what "review" meant on the last project. That knowledge dies with the relationship.
- **Inside roles.** Journalists and sources know the attribution rules, landlords and tenants know what notice is owed. These conventions carry over between relationships, but they're generic.
- **Through reputation.** Break a norm and the response is informal: a correction, an apology, going cold, a damaged name in the profession. That only stings if you need the relationship or the standing.

Most of this stays unwritten on purpose. Asking for "ordinary courtesy" in writing reads as distrust; a quiet correction holds things together precisely because it never becomes a formal complaint.

A vivid case: When Theo agreed to sublet Leah part of his print studio, the lease said nothing about noise, smell, hours, or "shared use" of the sink. Within two weeks they'd come to some arrangements: no running the press during the toddler's nap, either person could use the kettle but not the other's mug, etc.

## Where AGI breaks it

**The norms an agent applies come from its training and instructions, not the relationship, and may not match what these two parties expect.** Models generally come with reasonable manners, but they are generic ones. The agent may follow a general rule in a situation where these two parties have their own way of doing things. Humans also do a kind of normative reasoning in these situations: if I do this, how will the other person take it, and what will it do to the relationship? Whether an agent reasons like that depends on how it was set up.

**The usual way humans enforce norms does not hurt an agent the same way.** Social sanctions, going cold, pushback, apology, and reputational loss matter to humans because they affect standing, access, future cooperation, and self-presentation inside a relationship or profession. Human counterparties might signal a violation, but that may not produce a consequence the agent system cares or knows about (e.g. "You're absolutely right!").

**The implicit norms in a relationship evolve through repeated interaction; short-lived agents may not have the context or memory to develop or apply them.** A human partner remembers that a counterparty became more formal after a small dispute, or that someone showed up when their kid was sick, or that a certain phrase is a signal to check in. Agent systems can lose that texture through short contexts, instance replacement, memory policies, or a principal's failure to value prior interaction history.

**Agent-agent norms may form quickly and opaquely, leaving human principals to discover the operative frame only after it has already shaped behavior.** Two agents handling scheduling, review thresholds, disclosure conventions, or exception handling may converge on a local practice in minutes. If humans cannot see what happened, the relationship's effective norms have moved outside ordinary channels of consent, correction, and accountability.

## Problem Sets

### Making Tacit Norms Legible Before Action

**Scenario.** Mara’s tenant agent receives notice from a landlord’s maintenance agent that a repair crew will enter her apartment between 8 a.m. and noon. The lease permits entry with notice, but the building’s ordinary practice is to avoid mornings for tenants with night shifts unless there is an emergency. Mara’s agent has not seen that history because it was handled in texts with the prior property manager. The landlord’s agent treats the lease as sufficient and schedules the crew.

**Challenge:** Design a procedure by which agents identify and test local two-party norms before taking actions that are formally permitted but relationship-sensitive. The team should produce the procedure plus a worked example showing one action allowed, one clarified, and one escalated.

**Evaluation.** The procedure succeeds if it catches the repair-entry case before action, distinguishes genuine local norms from after-the-fact objections, keeps low-stakes interactions from becoming legalistic, and produces a norm record a principal can later review.

**Design choices the team must take a position on.**

1. **Norm source.** Should the agent rely on prior interaction history, counterparty inquiry, domain defaults, principal preferences, or a hierarchy among them?
2. **Uncertainty trigger.** What makes a case norm-sensitive enough to pause: novelty, inconvenience, asymmetry of harm, prior correction, or irreversible action?
3. **Evidence threshold.** What counts as evidence of a local norm: repeated past practice, explicit correction, industry custom, silence after notice, or principal confirmation?
4. **Recording form.** Is the norm stored as a soft preference, rebuttable default, relationship rule, or contract supplement?
5. **Anti-gaming rule.** How does the procedure prevent one side from inventing norms opportunistically after a permitted action becomes inconvenient?

### Conditions for Agent-Agent Norm Formation

**Scenario.** A small manufacturer and a logistics provider run their relationship through agents. The contract covers delivery windows and penalties, but not the borderline cases: a truck ten minutes late, a shipment worth splitting without waiting for approval. Human dispatchers would settle these into a working rhythm within weeks. The agents never do — each is stateless, optimized to close its ticket, and replaced often enough that every borderline case arrives as new. The relationship turns brittle without either side acting in bad faith.

**Challenge:** Design the setup conditions under which agents in a recurring dyadic relationship can form useful local norms without letting those norms become hidden contract amendments. The team should produce a norm-formation protocol for recurring agent-agent relationships.

**Evaluation.** The procedure succeeds if it lets the logistics relationship develop stable expectations around borderline cases, preserves enough memory for learning across instances, prevents one side from exploiting the norm-formation process, and gives principals a way to inspect or veto norms that materially change the deal.

**Design choices the team must take a position on.**

1. **Memory substrate.** Do norms live in each agent’s memory, a shared relationship ledger, the principals’ systems, a platform layer, or a third-party registry?
2. **Formation threshold.** When does repeated practice become a norm: after explicit acknowledgment, repeated reliance, absence of objection, mutual annotation, or principal review?
3. **Experiment space.** Which cases may agents handle through local adaptation, and which require explicit authorization before any pattern can form?
4. **Symmetry rule.** Must the norm benefit both sides, or can asymmetric norms form when they reflect role differences, bargaining power, or operational convenience?
5. **Veto and revision.** Who can reject, revise, or sunset an emergent norm once it has started shaping behavior?

