# Agent negotiation & bargaining

## Problem Sets

### A1. Agent Negotiation Under Principal Opacity

Two AI agents negotiate a commercial contract on behalf of their human principals. Each agent has a rich preference model of its principal, but the principals can't monitor the negotiation in real time—they can only ratify or reject the final deal.

**The problem:** The agents discover a Pareto-improving package deal, but it involves tradeoffs across domains the principals never explicitly authorized (e.g., trading price concessions for data-sharing terms the principal hasn't considered).

Design a negotiation protocol that satisfies:

1. Outcomes are Pareto-efficient given actual principal preferences
2. No agent can exploit asymmetric knowledge of its own principal's preferences
3. Principals can meaningfully ratify the outcome despite not following the reasoning

**Deliverable:** Specify the minimum information that must be disclosed to each principal for ratification to be non-trivial. What is the analogue of "informed consent" here, and how does it differ from the standard principal-agent literature?
