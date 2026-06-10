---
human_label: "Bylaws & grievance boards"
human_era: "Medieval-industrial"
human_era_bucket: medieval-modern
status: not_started
owner: oliver
visions:
  fidelity: "Internal resolution of charter-breach disputes"
---

# Autonomous corp bylaws & grievance boards

## At a glance

### Coordination challenge

How a team gives members standing entitlements and a forum to challenge how power inside the group is used.

### Examples

- Corporate bylaws
- HR grievance boards
- Union shop stewards
- University ombuds
- Co-op member rights

### How AGI breaks them

- The decision-maker being challenged stops being a person who can be summoned, questioned, or sanctioned, which is what grievance procedures were built around.
- Agents produce a continuous stream of small decisions rather than a few punctuated rulings, so the harm often lives in patterns that per-case review can't reach.
- Grievances turn on showing inconsistency with prior practice, and statistical decision-making doesn't fit that vocabulary: each case can be defensible while the pattern is not.
- "Overturn and make whole" assumed a manager who can be ordered to redo the decision; remedies against an agent (constraint, retraining, rollback) have no bylaw vocabulary yet.
- Whoever configures and runs the agents holds real power over members, but the bylaws don't name that role as an office with duties, accountability, or removal.

## How humans solve this today

Member-governed organizations — cooperatives, condo associations, unions, partnerships — give members rights against the group's own power through a stack of instruments, all of which presume that the power being challenged is held by persons who can be summoned, questioned, and sanctioned:

- **Bylaws and charters.** The public text of member entitlements and officer powers: who can vote, who can be removed, what process a decision must follow. Citable but rigid; amendment takes a supermajority and time.
- **Grievance procedures.** A defined channel for contesting a specific decision — a committee, a hearing, a written ruling. Slow and formal, but binding, and each ruling adds to the record of "prior practice" the next grievance is argued against.
- **Union representation.** Shop stewards and grievance arbitration give the affected member an advocate and an escalation path that doesn't depend on the goodwill of the manager being challenged. The price is formality: a contract, a bargaining unit, and a process measured in months.
- **Ombuds offices.** Informal and confidential, with no binding power; they absorb the conflicts too small or too delicate for a formal grievance.
- **Courts as backstop.** Statutory member rights (cooperative law, employment law, fiduciary duties) when internal forums fail. Expensive and slow enough that almost everything settles internally, which is the point.

A vivid case: when Andre's logistics co-op fired a dispatcher last year, the dispatcher invoked the grievance procedure in the bylaws. The committee met, heard both sides, found the firing inconsistent with prior practice, and reinstated him with backpay. The procedure was legible enough that the dispatcher's lawyer needed only an hour with the bylaws to brief the case.

## Where AGI breaks it

1. **The decision-maker being challenged stops being a person who can be summoned, questioned, or sanctioned.** A grievance hearing works by putting the manager in the room: they explain their reasoning, answer questions about it, and carry career consequences if the ruling goes against them. When the dispatching or allocation decision was made by an agent, each lever assumes something that isn't there. There is no testimony beyond logs, no career the panel can discipline, and the operator who configured the agent can truthfully say they did not make the specific call being grieved.

2. **Agents produce a continuous stream of small decisions rather than a few punctuated rulings.** Grievance procedures were sized for a human manager's decision tempo: a few consequential calls a quarter, each discrete enough to contest on its own. An agent making thousands of routing, scheduling, or allocation decisions produces harms that are real in aggregate but trivial individually; per-case review either misses them or drowns in them.

3. **Grievances turn on showing inconsistency with prior practice, and statistical decision-making doesn't fit that vocabulary.** The committee's question — was this member treated differently from others in the same situation? — assumes decisions are rule-like enough to compare. An agent may treat every case slightly differently for reasons that are statistical rather than invidious, so each decision is defensible in isolation while the distribution disadvantages a class of members. The bylaws have no category for that, and proving it requires pattern analysis across the decision stream that no individual grievant can run alone.

4. **"Overturn and make whole" assumed a manager who can be ordered to redo the decision.** Reversing a human decision is institutionally simple: the committee directs, the manager complies, and the ruling itself teaches the manager what not to repeat. Against an agent the remedy menu is unsettled — reverse this output, compensate the member, constrain future decisions on this dimension, retrain, retire — and none of these automatically propagates the ruling into future behavior the way a corrected manager does. A remedy the committee cannot verify in next month's decisions is a remedy in name only.

5. **Whoever configures and runs the agents holds real power over members that the bylaws don't name as an office.** Member governance works by mapping power onto accountable roles: the treasurer, the board, the general manager, each elected or appointed, each removable. Agent configuration — objectives, constraints, escalation rules — is at least as consequential as any of those roles, but it typically sits with whoever happens to administer the systems, acquired without election and exercised without defined duties. Power has moved to a position the group's constitutional structure doesn't see.

## Problem Sets

### Grievance procedure against an agent's decisions

**Scenario.** A worker cooperative runs a logistics business with eleven human co-owners and four AI agents that dispatch, route, and negotiate rate sheets. Last month one of the agents made a route change that cost a driver, Andre, his preferred Friday schedule. Under the co-op's bylaws, members can grieve a human manager's decision; there is no path for a grievance against an agent — no one to summon to the hearing, and no obvious way to tell whether Andre's case is a one-off or part of a pattern in the agent's scheduling. Andre wants a channel, and the co-op wants one in place before a larger dispute arrives.

**Challenge:** Design the bylaw amendments that establish standing and procedure for grieving an AI agent's decision in a member-governed organization: the standing rules, the adjudicator, the remedy menu, and the rule for when individual grievances become pattern grievances.

**Evaluation.** Strong proposals handle both Andre's single lost Friday and a statistical pattern across drivers without requiring each affected member to file separately, and produce remedies that verifiably constrain the agent's future decisions rather than only compensating past ones.

**Design choices the team must take a position on.**
1. **Standing.** Who can grieve an agent's decision — only the directly affected member, any member, or only members with harm above a threshold?
2. **Decision granularity.** Per-decision grievance (Andre's lost Friday), pattern grievance (the agent disadvantages Friday-preference drivers), or both — and what upgrades an individual case to a pattern case?
3. **Adjudicator.** A member committee, a hybrid (an agent does triage and assembles the record, members decide), or an external arbitrator?
4. **Remedy menu.** Reverse the decision, compensate the member, constrain the agent's future decisions on this dimension, retire the agent — which subset is workable, and who verifies that a constraint actually held in next month's data?
5. **Evidence access.** What decision logs and comparison data is the grievant entitled to, and who bears the cost of the pattern analysis no individual member could produce alone?

### Making agent control an accountable office

**Scenario.** Three years after the same cooperative automated dispatching, a quiet shift has occurred: the member who administers the agents — sets their objectives, adjusts their constraints, decides when to update them — has become the most powerful person in the co-op, though he holds no elected position. When the membership voted to prioritize driver schedule stability over delivery speed, the change had to be translated into the agents' configuration, and what got implemented was his reading of the vote. Nobody alleges bad faith; the problem is structural. The bylaws name a treasurer who handles less money than the agents move every week, and say nothing about the role that actually steers the organization.

**Challenge:** Design the constitutional treatment of agent control in a member-governed organization: define the office (or distribute the power), its disclosure duties, the way members audit that votes were faithfully translated into configuration, and how the holder is chosen and removed.

**Evaluation.** Strong proposals make configuration power visible and contestable without making every parameter change a member vote; weak ones either re-centralize the power under a new name or grind operations to a halt.

**Design choices the team must take a position on.**
1. **Office or distribution.** Is agent control a single named office, a committee, a split between configuration and audit, or a rotating duty?
2. **Translation accountability.** When a member vote must be translated into agent configuration, who verifies the translation was faithful, and what happens when members dispute the reading?
3. **Disclosure duties.** What must be disclosed to members and on what cadence: full configurations, changes only, or effects (decision statistics) rather than mechanisms?
4. **Selection and removal.** Elected, board-appointed, or hired with member confirmation — and what does removal look like when the role requires technical skill few members have?
5. **Emergency powers.** When an agent misbehaves at 2 a.m., what can the office-holder change unilaterally, and what review does an emergency change trigger?

### Internal resolution of charter-breach disputes {vision: fidelity}

**Scenario.** A five-year-old worker cooperative wrote into its founding charter that it would never take on clients from the defense sector. Last quarter the business side, under pressure, signed a contract with a logistics contractor whose revenue turns out to be three-quarters military. Two longtime members, Hiro and Olga, believe this is a straightforward breach of the charter; the board believes the contract is technically outside the prohibition. There is no internal mechanism for adjudicating the claim — the dispute is drifting toward member resignations and a public fight. What Hiro and Olga want is a forum inside the co-op that can actually hear their claim, rule on whether the charter was honored, and bind the board to the result.

**Challenge:** Design a fidelity-oriented charter and its adjudication procedure — a substantive layer on top of the group's bylaws that articulates the mandate densely enough for members to bring a breach claim, plus the forum that hears such claims and binds the group to the result. Produce the standing rules, the remedy and escalation menu, and the safeguards against factional capture.

**Design choices the team must take a position on.**
1. **Standing.** Who has standing to bring a mandate-breach claim inside a group — members, former members, affected non-members?
2. **Remedy and escalation.** What's the internal remedy when a claim is upheld — policy change, officer removal, rearticulation of the mandate itself — and when does the dispute escalate outside the group?
3. **Anti-factionalism.** How do you prevent the process from becoming a vehicle for ordinary factional disputes — ripeness-style doctrines requiring concrete harm, thresholds for what counts as a mandate specification rigorous enough to adjudicate against, or some other gate?
4. **Legal interface.** How does the claim procedure interact with existing employment, partnership, or cooperative law?
