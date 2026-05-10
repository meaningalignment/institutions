# Autonomous corp bylaws & grievance boards

## How humans solve this today

Member-governed organizations — cooperatives, condo associations, unions, partnerships — encode rights and grievance procedures in their bylaws. The structure is familiar: members can propose changes, vote on policy, and grieve a manager's decision through a defined channel (a grievance committee, a member meeting, ultimately the courts). The mechanisms presume that managers are persons who can be summoned, questioned, and held to account — and that their decisions, while binding in the moment, can be revisited and reversed if a process finds them improper. The legitimacy comes from the bylaws being public, the procedures being followed, and the outcomes being applied consistently.

A vivid case: When Andre's logistics co-op fired a dispatcher last year, the dispatcher invoked the grievance procedure in the bylaws. The committee met, heard both sides, found the firing inconsistent with prior practice, and reinstated him with backpay. The procedure was familiar enough that even the dispatcher's lawyer needed only an hour with the bylaws to brief his case.

## Where AGI breaks it

When AI agents take on managerial-shaped roles inside a member-governed organization — dispatching, routing, negotiating, allocating — the bylaws written for human managers cease to provide a path:

1. **No one to summon.** The "manager" whose decision is being grieved is an agent. There's no person to face the grievance committee, no record to subpoena, no career consequence the panel can impose.
2. **Decisions are continuous, not punctuated.** A human manager makes a few hundred decisions a quarter; an agent makes thousands. The grievance procedure can't review each one, but the cumulative pattern may be where the harm lives.
3. **Consistency is hard to define.** A grievance turns on showing the decision was inconsistent with how others were treated. Agents may treat each case slightly differently for reasons that are statistical rather than discriminatory; the bylaws don't have a vocabulary for that.
4. **Reversal is technically novel.** What does it mean to "overturn" an agent's decision and "make whole" the affected member? Restitution? Retraining the agent? Carving out an exception going forward?

A scenario: A worker cooperative runs a logistics business with eleven human co-owners and four AI agents that dispatch, route, and negotiate rate sheets. The agents make calls that matter — last month one of them took a route change that cost a driver his preferred Friday schedule. The driver, Andre, raised it at the next member meeting. Under the co-op's old bylaws, members can grieve a human manager; there is no path for a grievance against an agent. Andre wants one, the co-op wants one, and the agents themselves — asked — would welcome a channel where their decisions can be contested before they calcify into policy.

## Problem Sets

### Grievance Procedure Against an Agent in a Member-Governed Org

**Anchor contexts.** A worker-owned logistics cooperative whose dispatching/routing decisions are made by AI agents; a housing cooperative whose maintenance-prioritization and unit-allocation decisions are agent-mediated.

**The gap.** We lack bylaw amendments establishing standing and procedure for grieving an AI agent's decision in a member-governed organization, where the "manager" can't be summoned and the decision-stream is too dense for case-by-case review.

**Design choices the team must take a position on.**
1. **Standing.** Who can grieve an agent's decision — only the directly affected member, any member, or only members with measurable harm above a threshold?
2. **Decision granularity.** Per-decision grievance (Andre's lost Friday) or pattern grievance (the agent shifts schedules unfairly across drivers)? Both? What's the threshold for upgrading individual to pattern?
3. **Adjudicator.** Member committee, hybrid (agent does triage and surfaces options, member committee decides), or external arbitrator?
4. **Remedy menu.** Reverse the decision; compensate the affected member; constrain the agent's future decisions on this dimension; retire the agent. Pick a workable subset and defend it.
5. **Pattern-of-decisions rule.** When does a series of individually-defensible decisions become a grievable pattern, who detects it, and on what evidence (statistical, anecdotal, both)?
**Success criterion (stress tests).** A regime succeeds if it survives:
- Andre's specific grievance is heard within two member meetings; he gets a written reasoning he can read and respond to.
- A pattern grievance ("the agent disadvantages Friday-preference drivers") is heard with statistical evidence; the procedure handles it without requiring each driver to file separately.
- The agent's decisions are technically defensible but feel wrong to the membership; the procedure has language for this without collapsing into "the membership can override anything."
- A remedy of "constrain the agent's future scheduling along axis X" is enforceable and verifiable in the next month's data.
- A grievance committee member is themselves the affected driver; conflict of interest is handled cleanly.

**Deliverable.** Amendment text for the co-op's bylaws — standing, procedure, adjudicator, remedies, pattern rule. Plus a one-paragraph statement of which provisions have no analogue in grieving a human manager and why.
