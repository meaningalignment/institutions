---
human_label: "Social conventions"
human_era: "Ancient / customary"
human_era_bucket: ancient
status: body_draft
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

- Agents might execute only explicit terms or apply norms from their training that don't match the parties' expectations.
- The usual way humans enforce norms does not hurt an agent the same way.
- There are kinds of normative reasoning that humans do in these interactions that agents may not do without explicit instruction and incentives.
- The implicit norms in a relationship evolve through repeated interaction; short-lived agents may not have the context or memory to develop or apply them.
- Agent-agent norms may form quickly and opaquely, leaving human principals to discover the operative frame only after it has already shaped behavior.

## How humans solve this today

Every contract and every recurring two-party relationship sits on an unwritten background: what counts as reasonable, when silence is consent, which departures from the literal text are ordinary courtesies, which omissions a competent counterparty is expected to catch. No single code carries this; instead, a few layers do the work together.

Contract law picks up part of it through good-faith interpretation, fair dealing, course-of-dealing evidence, usage of trade, and fiduciary duties. Repeat partners add their own history — who flags borderline errors, what "review" has meant on past projects. Roles supply their own conventions: journalists and sources on attribution, landlords and tenants on notice, diplomats on what can be floated through a back channel without committing the principal. And behind all of it sits informal enforcement — correction, apology, going cold, refusing to renew, reputational damage inside a profession.

People work these layers by watching the counterparty, mirroring local conventions, asking when a case is uncertain, and adjusting after small corrections. Most of it stays tacit because spelling every norm out is costly and tends to change the relationship: asking for "ordinary courtesy" in writing reads as distrust, while a quiet correction can hold the relationship together precisely because it never becomes a formal complaint.

A vivid case: When Theo agreed to sublet Leah part of his print studio, the lease said nothing about noise, smell, hours, or "shared use" of the sink. Within two weeks they'd come to some arrangements: no running the press during the toddler's nap, either person could use the kettle but not the other's mug, etc.

## Where AGI breaks it

**Agents might execute only explicit terms or apply norms from their training that don't match the parties' expectations.** A model may supply a generic etiquette or legal-reasonableness default from training, while the relevant norm is local and specific to the relationship. Or the model may simply apply the literal terms of the contract, without the usual human expectation.

**The usual way humans enforce norms does not hurt an agent the same way.** Social sanctions, going cold, pushback, apology, and reputational loss matter to humans because they affect standing, access, future cooperation, and self-presentation inside a relationship or profession. Human counterparties might signal a violation, but that may not produce a consequence the agent system cares or knows about (e.g. "You're absolutely right!").

**There are kinds of normative reasoning that humans do in these interactions that agents may not do without explicit instruction and incentives.** A person often runs something like "if I do X, my counterparty will feel Y, and I want to avoid that" — modeling how the other side will interpret an action and what relationship damage will follow. That reasoning combines prediction, role morality, empathy, prudence, and preservation of future dealings. Even if agents are capable of analogous modeling, they won't unless the task, memory, evaluation, and escalation rules make those considerations operative.

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

**Scenario.** Two agents manage a recurring relationship between a small manufacturer and a logistics provider. The contract specifies delivery windows, penalties, and data formats, but not how to handle borderline cases: when a truck is ten minutes late, when weather makes a route risky, when a shipment can be split without formal approval, or when one side should warn the other before invoking a penalty. Human dispatchers would develop a working rhythm after a few weeks. These agents are stateless across sessions, optimized to complete each ticket, and replaced often enough that every borderline case is treated as new. The relationship becomes brittle even though neither agent is acting in bad faith.

**Challenge:** Design the setup conditions under which agents in a recurring dyadic relationship can form useful local norms without letting those norms become hidden contract amendments. The team should produce a norm-formation protocol for recurring agent-agent relationships.

**Evaluation.** The procedure succeeds if it lets the logistics relationship develop stable expectations around borderline cases, preserves enough memory for learning across instances, prevents one side from exploiting the norm-formation process, and gives principals a way to inspect or veto norms that materially change the deal.

**Design choices the team must take a position on.**
1. **Memory substrate.** Do norms live in each agent’s memory, a shared relationship ledger, the principals’ systems, a platform layer, or a third-party registry?
2. **Formation threshold.** When does repeated practice become a norm: after explicit acknowledgment, repeated reliance, absence of objection, mutual annotation, or principal review?
3. **Experiment space.** Which cases may agents handle through local adaptation, and which require explicit authorization before any pattern can form?
4. **Symmetry rule.** Must the norm benefit both sides, or can asymmetric norms form when they reflect role differences, bargaining power, or operational convenience?
5. **Veto and revision.** Who can reject, revise, or sunset an emergent norm once it has started shaping behavior?
