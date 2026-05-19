---
agents_label: "Tacit norms for agent interactions"
human_label: "Social conventions"
status: body_draft
owner: joe
starred: true
---

# Tacit norms in two-party interactions

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
- The usual way humans enforce norms (social sanctions, going cold, pushback) does not hurt an agent the same way.
- There are kinds of normative reasoning that humans do in these interactions ("I know that if I do X, my counterparty will feel Y, and I want to avoid that") that agents may not do without explicit instruction and incentives.
- The implicit norms in a relationship evolve through repeated interaction; short-lived agents may not have the context or memory to develop or apply them.
- Agent-agent norms may form quickly and opaquely, leaving human principals to discover the operative frame only after it has already shaped behavior.

## How humans solve this today

Every explicit contract or recurring two-party relationship sits on an unwritten background: what counts as "reasonable," when silence is consent and when it is not, which departures from the literal text are ordinary courtesies, and which omissions a competent counterparty is expected to catch without being asked. Human institutions handle this background through several familiar practices rather than one formal code.

Contract law formalizes part of the background through good-faith interpretation, the duty of fair dealing, course-of-dealing evidence, usage of trade, and fiduciary duties in agency relationships. Repeat commercial partners add a second layer through histories of prior performance: who flags borderline errors, how quickly a vague request usually gets answered, and what "review" has meant across past projects. Role-specific practices add a third layer, such as journalist-source understandings about attribution, landlord-tenant courtesies around notice and access, and diplomatic back-channel conventions about what can be floated without committing the principal. The fourth layer is informal enforcement: correction, apology, loss of trust, going cold, renegotiation, refusal to renew, or reputational damage inside a profession.

Humans operate these layers by observing the counterparty, mirroring local conventions, asking when a case is uncertain, and updating the relationship after small corrections. Much of the work stays tacit because articulating every norm is costly and can itself change the relationship. A request to put "ordinary courtesy" in writing may signal distrust; a friendly correction can preserve the relationship precisely because it does not become a formal accusation.

A vivid case: When Theo agreed to sublet Leah part of his print studio, the lease said nothing about noise, smell, hours, or "shared use" of the sink. Within two weeks they'd come to some arrangements: no running the press during the toddler's nap, either person could use the kettle but not the other's mug, etc.

## Where AGI breaks it

**Agents might execute only explicit terms or apply norms from their training that don't match the parties' expectations.** A model may supply a generic etiquette or legal-reasonableness default from training, while the relevant norm is local and specific to the relationship. Or the model may simply apply the literal terms of the contract, without the usual human expectation.

**The usual way humans enforce norms (social sanctions, going cold, pushback) does not hurt an agent the same way.** Social sanctions, apology, and reputational loss matter to humans because they affect standing, access, future cooperation, and self-presentation inside a relationship or profession. Human counterparties might signal a violation, but that may not produce a consequence the agent system cares or knows about. "You're absolutely right!"

**There are kinds of normative reasoning that humans do in these interactions ("I know that if I do X, my counterparty will feel Y, and I want to avoid that") that agents may not do without explicit instruction and incentives.** A person often models how a counterparty will interpret an action and what relationship damage will follow. That reasoning combines prediction, role morality, empathy, prudence, and preservation of future dealings. Even if agents are capable of analogous modeling, they won't unless the task, memory, evaluation, and escalation rules make those considerations operative.

**The implicit norms in a relationship evolve through repeated interaction; short-lived agents may not have the context or memory to develop or apply them.** A human partner remembers that a counterparty became more formal after a small dispute, or that someone showed up when their kid was sick, or that a certain phrase is a signal to check in. Agent systems can lose that texture through short contexts, instance replacement, memory policies, or a principal's failure to value prior interaction history.

**Agent-agent norms may form quickly and opaquely, leaving human principals to discover the operative frame only after it has already shaped behavior.** Two agents handling scheduling, review thresholds, disclosure conventions, or exception handling may converge on a local practice in minutes. If humans cannot see what happened, the relationship's effective norms have moved outside ordinary channels of consent, correction, and accountability.

## Problem Sets

### Making Tacit Norms Legible Before Action

**Scenario.** Mara’s tenant agent receives notice from a landlord’s maintenance agent that a repair crew will enter her apartment between 8 a.m. and noon. The lease permits entry with notice, but the building’s ordinary practice is to avoid mornings for tenants with night shifts unless there is an emergency. Mara’s agent has not seen that history because it was handled in texts with the prior property manager. The landlord’s agent treats the lease as sufficient and schedules the crew. The legal rule is satisfied; the relationship norm is not.

**Challenge:** Design a procedure by which agents identify and test local two-party norms before taking actions that are formally permitted but relationship-sensitive. The procedure succeeds if it catches the repair-entry case before action, distinguishes genuine local norms from after-the-fact objections, keeps low-stakes interactions from becoming legalistic, and produces a norm record a principal can later review. The team should produce the procedure plus a worked example showing one action allowed, one clarified, and one escalated.

**Design choices the team must take a position on.**
1. **Norm source.** Should the agent rely on prior interaction history, counterparty inquiry, domain defaults, principal preferences, or a hierarchy among them?
2. **Uncertainty trigger.** What makes a case norm-sensitive enough to pause: novelty, inconvenience, asymmetry of harm, prior correction, or irreversible action?
3. **Evidence threshold.** What counts as evidence of a local norm: repeated past practice, explicit correction, industry custom, silence after notice, or principal confirmation?
4. **Recording form.** Is the norm stored as a soft preference, rebuttable default, relationship rule, or contract supplement?
5. **Anti-gaming rule.** How does the procedure prevent one side from inventing norms opportunistically after a permitted action becomes inconvenient?

### Conditions for Agent-Agent Norm Formation

**Scenario.** Two agents manage a recurring relationship between a small manufacturer and a logistics provider. The contract specifies delivery windows, penalties, and data formats, but not how to handle borderline cases: when a truck is ten minutes late, when weather makes a route risky, when a shipment can be split without formal approval, or when one side should warn the other before invoking a penalty. Human dispatchers would develop a working rhythm after a few weeks. These agents are stateless across sessions, optimized to complete each ticket, and replaced often enough that every borderline case is treated as new. The relationship becomes brittle even though neither agent is acting in bad faith.

**Challenge:** Design the setup conditions under which agents in a recurring dyadic relationship can form useful local norms without letting those norms become hidden contract amendments. The procedure succeeds if it lets the logistics relationship develop stable expectations around borderline cases, preserves enough memory for learning across instances, prevents one side from exploiting the norm-formation process, and gives principals a way to inspect or veto norms that materially change the deal. The team should produce a norm-formation protocol for recurring agent-agent relationships.

**Design choices the team must take a position on.**
1. **Memory substrate.** Do norms live in each agent’s memory, a shared relationship ledger, the principals’ systems, a platform layer, or a third-party registry?
2. **Formation threshold.** When does repeated practice become a norm: after explicit acknowledgment, repeated reliance, absence of objection, mutual annotation, or principal review?
3. **Experiment space.** Which cases may agents handle through local adaptation, and which require explicit authorization before any pattern can form?
4. **Symmetry rule.** Must the norm benefit both sides, or can asymmetric norms form when they reflect role differences, bargaining power, or operational convenience?
5. **Veto and revision.** Who can reject, revise, or sunset an emergent norm once it has started shaping behavior?