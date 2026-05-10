# Standards for institutional AI deployments

**Scenario.** *A state department of health has adopted an AI triage system for its Medicaid call center. Wait times are down, satisfaction scores are up, and a hearing this month will hold it up as a national model. A case manager, Carla, who has worked those phones for twelve years, has been watching a pattern: callers with complex situations — a mother juggling her child's disability paperwork and her own cancer treatment — get routed through faster but resolved less. The system's metrics call them "resolved." Carla calls them "hung up on." She wants a standard the state will actually apply to deployments like this one: what the system owes people like that mother, not just what it owes the department's dashboard.*

When AI systems are deployed in national-scale institutional roles — caseworker decisions, benefits adjudication, healthcare triage, judicial sentencing recommendations — they become part of the institution's mandate-to-operations chain. If the system optimizes for legible proxies (resolution rate, throughput, cost-per-case) rather than the institution's thick purposes, the deployment silently accelerates drift.

A regime that requires mandate-alignment would ask whether a proposed AI deployment can be held to the institution's mandate: whether its objective function reflects the mandate, whether its errors are surfaced and reviewable, and whether practitioners retain the capacity to recognize drift.

Design questions:
- What's the equivalent of an environmental-impact assessment for mandate alignment? Who performs it, and when?
- How should institutions handle the case where an AI system is locally more accurate than human practitioners, but the human base is what maintains the capacity to notice drift?
- What norms should govern vendor lock-in, model turnover, and training-data provenance for systems embedded in institutional decisions?
- How do national norms here interact with sectoral regulation (FDA, FCC, banking regulators) already applicable?

Adjacent work: algorithmic impact assessments; the emerging AI-governance literature on institutional deployment; administrative law on automated decision systems.
