---
human_label: "Profit-sharing, vesting & bounty systems"
status: draft
---

# Agent profit-sharing & bounty systems

## What problems do these institutions solve today?

Inside firms, the question of who-gets-what is settled by an evolved stack of mechanisms: salary bands tied to role and tenure, bonus pools allocated by manager judgment, commission structures for sales, profit-sharing distributions, equity grants, and bounty programs for specific outputs. Each scheme is a partial answer to "how do we recognize contribution without fighting about it every quarter," and the schemes coexist because no single one captures both routine effort and exceptional outcomes. The legitimacy comes from being roughly understood by the people they cover — even when employees disagree with their bonus, they can usually trace why it landed where it did.

> [!NOTE]
> Beatriz's small consultancy uses a simple split: salaries cover the baseline, an annual bonus pool is allocated by the partners based on a known rubric, and any contract with bonus-eligible upside has the bonus rules written into the project kickoff doc. Disagreements happen, but rarely escalate.

## Where AGI breaks it

When AI agents start producing meaningful business output alongside human staff, the existing schemes don't quite fit:

1. **Agents don't have personal needs the comp scheme is built around.** A salary doesn't mean what it means to a person; the agent doesn't pay rent or save for college. But the underlying capability does need ongoing funding (compute, upgrades, training data), and the team needs a way to think about that allocation.
2. **Attribution is murky in a new way.** Several humans contributed to building, training, and operating the agent. When the agent produces revenue, who's that revenue "credited to"? The pre-existing rubrics for human contribution don't fork cleanly across human and agent.
3. **Resentment sneaks in invisibly.** If a contract a human worked hard on counts toward an agent's "earnings" (and thus the upgrade budget), the human may feel less recognized than if the same contract had counted toward another human's bonus. Nobody complains, but the team gets quietly demoralized.
4. **Budget for "the next capability" is open-ended.** Unlike salaries, which scale with people, agent budgets can scale faster than the team's revenue can support — and the firm needs a discipline for deciding when to grow agent capacity vs. hire another person.

> [!WARNING]
> Beatriz's small consultancy runs three AI agents alongside its nine humans: one does research, one drafts, one handles client follow-through. This year the agents closed roughly a third of the contracts. Payroll time comes around and nobody on the human team knows quite how to think about it. The agents don't need salaries but they do need funding for compute, for upgrades, and for the next capability the team hopes to add. Beatriz wants a scheme where the agents' "earnings" are visible, where humans whose work trained an agent get credited when that agent produces, and where people aren't quietly resentful when a contract they worked hard on gets counted toward an agent's share.

## Problem Sets

### Comp Scheme for a Mixed Human-Agent Firm

**Anchor contexts.** A 9-person consultancy with three production agents that closed roughly a third of contracts last year; a 15-person dev shop where AI agents handle a substantial fraction of code review, ticket triage, and client communication.

**The gap.** We lack a comp scheme for mixed human-agent firms that allocates revenue across human work, agent work, and the human work that built the agents — without breeding resentment or freezing capacity allocation decisions.

**Design choices the team must take a position on.**
1. **Attribution rule.** When an agent closes a contract, what fraction is "the agent's" vs. the humans who supervised, trained, or provided context? Is the rule formula-based, judgment-based, or hybrid?
2. **Agent budget mechanism.** Is the agent's "share" a real budget the agent (or its principal owner inside the firm) controls for compute and upgrades, or just an accounting number that surfaces during the bonus pool?
3. **Trainer credit.** When a human's past work materially trained an agent, do they get a residual when the agent produces — and for how long? How does this interact with people who leave?
4. **Capacity-growth governance.** Who decides when to grow agent capacity vs. hire a human — partner decision, member vote, or metric-driven trigger?
5. **Conflict resolution.** When a human and an agent both worked a contract, who allocates credit and on what basis — the lead, a committee, a neutral procedure?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The agent closes a $100K contract that drew on training data from a human who left two years ago; the comp scheme handles it without anyone gaming the trainer-credit rule.
- A human worked overtime on a contract that ended up "credited" mostly to the agent; the human can challenge under the procedure and not be brushed off.
- The firm wants to add a fourth agent; the funding decision doesn't trigger a labor dispute because the procedure surfaces the trade-off legibly.
- A human is laid off because their work is now done by the agent; the comp scheme has language for the transition (a stake in the agent they helped build, severance, both).
- A partner disagrees with the agent's "share" of a contract; the appeal procedure resolves in weeks, not months.

**Deliverable.** The comp scheme — attribution rule, agent-budget mechanism, trainer credit, capacity-growth governance, conflict resolution. Designed for a 10–15 person firm. Identify what makes this different from existing profit-sharing schemes for all-human firms.
