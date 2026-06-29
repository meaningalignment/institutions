# AGI Institutions Curriculum

**Who is it for?**

This curriculum is targeting two groups. The first is researchers already working on these problems who want an 80/20 of the important parts of an adjacent field. The second is people from a technical background interested in AI and society but not yet sure how to contribute, or how much relevant work already exists. If that's you, this should show why these problems are real and that fields well outside your own have a lot to say about them.

**What's in it, and what isn't?**

It is not comprehensive, and the pieces are not always a field's most famous or most representative. We picked work that is accessible and, in our judgment, directly relevant to the institutions powerful AI will reshape. Reading it should give you a sense of why each field matters and enough of its vocabulary to start talking to the people who work in it.

**How is it structured?**

We've selected seven academic fields we think are relevant: AI alignment, philosophy of values and moral reasoning, models of norms and norm learning, institutional and behavioral economics, game theory and mechanism design, and legal theory. Each field opens with a short overview and includes core readings, foundational works for going deeper, key concepts to grasp, and a four-week mini-course you can work through at one to three readings a week.

**How should I use it?**

The fields are independent; read them in any order. The key concepts are a good way to check whether a field has really landed. If you'd rather start from something concrete, use the **Start from a problem** or **Start from an institution** picker below: pick a concern you already care about (or an institution we need to build) and the fields reorder by relevance, each with a short note on what you'll gain from it for that problem.

---

## 1. The Big Picture

<!-- advisors: Joe Edelman -->

What are the drivers of societal change? What is the relationship between institutions, culture, and technology?

This is the orienting section: it treats institutions not as abstractions but as things implemented through organizations, customs, and self-governance — not only through markets and states. The throughline is that institutions are built and rebuilt as technology shifts the costs of coordination, and that values themselves can drift as those costs change. We picked work that connects technological change, institutional form, and the slow movement of what people take for granted, so the rest of the curriculum reads as design under those pressures rather than as separate fields.

*Core readings: ~4–6 hours.*

### Core readings

- Joe Edelman — [Nothing to Be Done](https://medium.com/what-to-build/nothing-to-be-done-bfe2ce71a3a2) — argues many problems are structural, not motivational; sets up why redesigning institutions, not exhorting individuals, is the lever.
- Joe Edelman — [Drift](https://drafts.nxhx.org/drift/drift.pdf) — how the things people value erode as systems optimize for proxies; the core failure mode AI accelerates.
- Joe Edelman — [Freedom, Fairness, Fidelity](https://pax-machina.vercel.app/freedom-fairness-fidelity) — three criteria for evaluating institutions, used throughout the rest of this curriculum.
- Elinor Ostrom — [Beyond Markets and States](https://www.nobelprize.org/uploads/2018/06/ostrom_lecture.pdf) (2010 Nobel lecture) — communities govern shared resources without privatizing or nationalizing them; the canonical case that institutional design is a third option beyond "market it" or "regulate it."
- Avner Greif & Joel Mokyr — [Institutions and Economic History: A Critique of Professor McCloskey](https://www.cambridge.org/core/journals/journal-of-institutional-economics/article/institutions-and-economic-history-a-critique-of-professor-mccloskey/84B81FE15DE0BFBFD863F81059C570B6) (2007) — institutions as shared beliefs and expectations, not just formal rules; explains why imposed designs fail when the underlying beliefs don't follow.

### Foundational works

- Douglass North — *Institutions, Institutional Change and Economic Performance* (1990)
- Charles Taylor — *Modern Social Imaginaries* (2004)
- Elinor Ostrom — *Governing the Commons* (1990)
- Herbert Simon — The Architecture of Complexity (1962)
- Deirdre McCloskey — *Beyond Positivism, Behaviorism, and Neoinstitutionalism in Economics* (2022)
- Joel Mokyr — *A Culture of Growth* (2016)

### Key concepts

- Institutions as rules vs. institutions as beliefs
- Social imaginaries
- Self-governance and the commons
- Polycentric order
- Institutional drift
- Path dependence
- Culture and economic change
- Bounded rationality

---

## 2. AI Alignment

<!-- advisors: Smitha Milli, Saffron Huang, Taylor Sorensen -->

AI will be deeply embedded in our future institutions, so it matters how these systems are trained to follow instructions, represent values, and remain correctable.

Alignment is the youngest field here, grown out of machine learning and AI safety, concerned with how to make a model do what its principals actually want. The familiar version of the question is about a single model following instructions; the version that matters for institutions is how systems behave as participants in social orders — as negotiators, advisors, administrators, or intermediaries — which connects it to delegation, oversight, and certification. The conceptual readings cover the core training methods (RLHF, constitutional and character-based training) and the failure modes, like reward hacking and misgeneralization, that any institution leaning on these systems inherits.

Just as important is how alignment actually *gets done in practice*. A second strand here is the data and experimentation pipeline: how preference and feedback data is collected from large human populations, how the choice of behavioral signal and the handling of annotator disagreement quietly decide what a model learns, how alignment claims get tested through experiments and evals, and how deployed models are studied at population scale. This is the move from "specify the right values" to "run the data-collection and measurement pipeline that decides which values a model ends up with" — and it is where alignment most directly touches institutional design, since a population's input has to be elicited, weighted, and represented somehow.

*Core readings: ~9–13 hours.*

### Core readings

*Conceptual core — what alignment is for and what to train toward:*

- Long Ouyang et al. — [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155) (2022) — the InstructGPT paper that brought RLHF to language models; the technique that lets human judgment shape model behavior and the substrate most value-loading in deployed systems runs on.
- Yuntao Bai et al. — [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (2022) — training behavior against an explicit written set of principles rather than case-by-case labels; a concrete instance of encoding values as a governing document.
- Iason Gabriel — [Artificial Intelligence, Values, and Alignment](https://arxiv.org/abs/2001.09768) (2020) — maps "align to what?" (instructions, intentions, preferences, values) and why the target choice is itself a normative, institutional question.
- Anthropic — [Claude's Constitution](https://www.anthropic.com/news/claude-new-constitution) (2026) — read as a worked example of constitutional and character-based training, i.e. what it looks like to specify an agent's standing dispositions, not as a canonical text.
- Edelman et al. — [Full-Stack Alignment](https://arxiv.org/abs/2512.03399) (2025) — argues alignment must run through the institutions around the model, not only the model, and connects training-time choices to societal-scale ones.

*Practical strand — how alignment gets done: data, experiments, and measurement:*

- Stephen Casper, Xander Davies et al. — [Open Problems and Fundamental Limitations of RLHF](https://arxiv.org/abs/2307.15217) (2023) — the best survey of where RLHF actually breaks, separating tractable engineering problems from fundamental limits of learning from human feedback; the practical companion to the InstructGPT method.
- Smitha Milli et al. — [Engagement, User Satisfaction, and the Amplification of Divisive Content on Social Media](https://arxiv.org/abs/2305.16941) (2025) — a preregistered audit of X's live engagement-ranking algorithm showing it amplifies content users say they don't prefer; the canonical empirical case that optimizing a behavioral signal diverges from stated preference.
- Taylor Sorensen et al. — [A Roadmap to Pluralistic Alignment](https://arxiv.org/abs/2402.05070) (2024) — the field-defining taxonomy of pluralism (Overton / steerable / distributional) and the argument that standard RLHF actively reduces distributional pluralism by fitting to averages.
- Saffron Huang et al. — [Collective Constitutional AI: Aligning a Language Model with Public Input](https://arxiv.org/abs/2406.07814) (2024) — an end-to-end method for sourcing democratic public input (~1,000 participants via Polis) and folding it into a model's constitution; the canonical participatory-alignment case study on who decides the values.
- Saffron Huang et al. — [Values in the Wild](https://arxiv.org/abs/2504.15236) (2025) — empirically taxonomizes 3,307 values Claude expresses across ~308K real conversations; alignment measured at population scale rather than asserted.

### Foundational works

- Paul Christiano et al. — [Deep Reinforcement Learning from Human Feedback](https://arxiv.org/abs/1706.03741) (2017) — the original RLHF paper; learning a reward model from human preference comparisons, the substrate InstructGPT later applied to language models.
- Hugo Touvron, Louis Martin et al. — [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288) (2023) — the most detailed openly published account of a real RLHF data pipeline: preference-data collection, reward-model training, iterative RLHF.
- Shibani Santurkar et al. — [Whose Opinions Do Language Models Reflect?](https://arxiv.org/abs/2303.17548) (2023) — the OpinionQA framework on Pew survey data; the empirical method for measuring whose views a model represents.
- Alex Tamkin, Saffron Huang et al. — [Clio: Privacy-Preserving Insights into Real-World AI Use](https://arxiv.org/abs/2412.13678) (2024) — the privacy-preserving system that makes population-scale usage and values analysis possible; the infrastructure layer of empirical alignment.
- Paul Christiano — What Failure Looks Like (2019)
- Evan Hubinger et al. — Risks from Learned Optimization in Advanced Machine Learning Systems (2019)

### Key concepts

- RLHF
- Constitutional AI
- Character training
- Deliberative alignment
- Scalable oversight (as institutional oversight)
- Outer vs. inner alignment
- Reward hacking and Goodhart's law
- Specification gaming
- Delegation and principal-agent dynamics
- Multi-agent systems
- Preference data collection and reward-model training
- Proxy / behavioral-signal choice
- Annotator disagreement as signal, not noise
- A/B and online experimentation; algorithmic audits
- Pluralistic alignment (Overton / steerable / distributional)
- Clio-style population analysis
- Model evaluations as certification; red teaming at scale

### Four-week mini-course

- **Week 1 — What alignment is, and what we're aligning to.** Iason Gabriel, *AI, Values, and Alignment*; Long Ouyang et al., *InstructGPT / RLHF*. Establish the goal and its contestedness before the mechanics.
- **Week 2 — How it actually gets trained: feedback, data, constitutions.** Yuntao Bai et al., *Constitutional AI* with *Claude's Constitution*; Casper et al., *Open Problems and Fundamental Limitations of RLHF* (optionally Llama 2 for the concrete pipeline). From objective to mechanism — and where it breaks.
- **Week 3 — Whose preferences? Signals, disagreement, pluralism.** Smitha Milli et al., *Engagement, User Satisfaction…*; Taylor Sorensen et al., *A Roadmap to Pluralistic Alignment*. Interrogate the human data itself: proxy choice, disagreement, and the move from averaged to pluralistic values.
- **Week 4 — Measuring alignment at scale.** Saffron Huang et al., *Collective Constitutional AI* and *Values in the Wild* (with *Clio* as infrastructure); Edelman et al., *Full-Stack Alignment*. Close the loop: source values from populations, measure what deployed models do, and situate alignment in the institutional stack.

---

## 3. Philosophy of Values & Moral Reasoning

<!-- advisors: Joe Edelman, Ruth Chang -->

"Values" colloquially refers to what is important to us. But what are values, exactly? How have institutions encoded and understood them before, and do AI give us new affordances for modeling what matters?

Within philosophy this sits in ethics and metaethics. For AI, the live question is how a value gets *represented*: as a preference to satisfy, a reason to act on, a virtue internal to a practice, or a claim we can justify to others. Those are different answers from different corners of the field, and which one an institution adopts shapes what it can encode. Language models are able to encode values in thick ways, allowing us to move away from thinking of human wanting in terms of mere preferences. The companion question is *moral reasoning*: how someone moves from values to a decision in a hard case, especially when values are plural and don't reduce to a common scale — the problem of choosing well when the options are on a par rather than one being simply better.

*Core readings: ~8–12 hours.*

### Core readings

- Tan Zhi-Xuan et al. — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — argues preference-utility is too thin to carry what we mean by values; bridge between AI alignment and the philosophy of values.
- Alasdair MacIntyre — *After Virtue* (1981), ch. 14–15 — values as virtues internal to social practices; explains why values stripped from their practice lose their grip.
- Charles Taylor — What is Human Agency? (1977) — values in terms of motivations for choice.
- David Velleman — *The Possibility of Practical Reason* (2000), ch. 1 — values as reasons that can be acted on.
- T.M. Scanlon — *What We Owe to Each Other* (1998), ch. 1–2 — values as what we can justify to others; the contractualist frame for agents whose principals and constraints are what's being reasoned over.
- Ruth Chang — [Hard Choices](https://www.cambridge.org/core/journals/journal-of-the-american-philosophical-association/article/hard-choices/B82E4EE91FE0A4A4D38A0F866BC3FF9C) (2017) — when options are "on a par" rather than one being better, choice is an act of commitment that creates reasons rather than tracking them; the sharpest account of moral reasoning under value pluralism, and why an agent can't just maximize a scalar.

### Foundational works

- Aristotle — *Nicomachean Ethics*
- Philippa Foot — *Natural Goodness* (2001)
- Charles Taylor — *Sources of the Self* (1989)
- Bernard Williams — *Ethics and the Limits of Philosophy* (1985)
- Ruth Chang (ed.) — *Incommensurability, Incomparability, and Practical Reason* (1997)

### Key concepts

- Values as preferences vs. as reasons
- Values as virtues
- Values as social practices
- Values as public justification
- Strong evaluation
- Contractualism
- Thick vs. thin evaluative concepts
- Value pluralism
- Value incommensurability
- Parity and hard choices
- Moral realism
- Reflective equilibrium

### Four-week mini-course

- **Week 1 — What are values?** Tan Zhi-Xuan et al., *Beyond Preferences in AI Alignment*. Start where the curriculum's other fields end: why preference-utility is too thin to carry what we mean by values, and what the richer alternatives are.
- **Week 2 — Values as reasons and as strong evaluation.** Charles Taylor, *What is Human Agency?*; David Velleman, *The Possibility of Practical Reason*, ch. 1. The shift from "values are things I want" to "values are considerations I can act on and endorse."
- **Week 3 — Values inside practices, values owed to others.** Alasdair MacIntyre, *After Virtue*, ch. 14–15; T.M. Scanlon, *What We Owe to Each Other*, ch. 1–2. Two ways values get their grip that a thin model loses: internal to a practice, and answerable to others.
- **Week 4 — Reasoning under plural values.** Ruth Chang, *Hard Choices*. Pull the threads together on the hardest case: choosing well when values don't reduce to one scale, and what that means for an agent that can only optimize.

---

## 4. Modeling Norms & Norm Learning

<!-- advisors: Tan Zhi-Xuan, Joel Z. Leibo, Rakshit Trivedi -->

How do agents — human or artificial — infer the unwritten rules of a community, decide when to follow or enforce them, and revise them without the whole system collapsing?

Where philosophy of values asks *what* matters, this field asks how shared standards get *represented, learned, and sustained* in a population. It sits at the intersection of multi-agent reinforcement learning, Bayesian cognitive science, and the social science of norms — Bicchieri's account of norms as conditional preferences backed by empirical and normative expectations. It matters for AI and institutions because an agent that can read a community's norms from sparse observation, comply with them, and help enforce them is a far better institutional participant than one aligned only to a fixed reward or a single principal. The load-bearing design question is concrete: by what mechanism does a population of agents converge on shared standards, and what makes those standards stable, learnable by newcomers, and revisable without collapse.

*Core readings: ~7–10 hours.*

### Core readings

- Cristina Bicchieri — *Norms in the Wild: How to Diagnose, Measure, and Change Social Norms* (2017), selections — the operational account of norms as clusters of empirical and normative expectations you can measure and shift; gives the field its working vocabulary (conditional preferences, reference networks, pluralistic ignorance).
- Raphael Köster, Dylan Hadfield-Menell et al. — [Spurious normativity enhances learning of compliance and enforcement behavior in artificial agents](https://www.pnas.org/doi/10.1073/pnas.2106028118) (PNAS, 2022) — the canonical norm-emergence result: arbitrary "silly" rules plus third-party punishment let multi-agent RL agents bootstrap general compliance-and-enforcement machinery; the demonstration that norms can *emerge* from learning dynamics.
- Eugene Vinitsky, Raphael Köster, Joel Z. Leibo et al. — [A learning agent that acquires social norms from public sanctions in decentralized multi-agent settings](https://arxiv.org/abs/2106.09012) (Collective Intelligence, 2023) — agents learn arbitrary norms purely from *public sanctioning signals* when reward-sharing is impossible; directly relevant to decentralized institutions where who-punishes-whom is the only public channel.
- Ninell Oldenburg & Tan Zhi-Xuan — [Learning and Sustaining Shared Normative Systems via Bayesian Rule Induction in Markov Games](https://arxiv.org/abs/2402.13399) (AAMAS, 2024) — agents infer institutional rules by Bayesian induction over observed compliance, converge on a shared normative system even from divergent priors, and let newcomers bootstrap norms fast by observation; the clearest model of norms as *learnable, sustainable institutions* rather than fixed rewards.
- Atrisha Sarkar, Rakshit S. Trivedi, Gillian K. Hadfield et al. — [Normative Modules: A Generative Agent Architecture for Learning Norms that Supports Multi-Agent Cooperation](https://arxiv.org/abs/2405.19328) (2024) — the LLM-era entry: equips generative agents with a "normative module" that identifies an authoritative sanctioning institution and uses it for equilibrium selection; shows how the classic norm-emergence story ports onto LLM agents.
- Tan Zhi-Xuan, Micah Carroll, Matija Franklin & Hal Ashton — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — the field's framing argument: alignment should target the norms and role-appropriate standards negotiated among stakeholders, not a scalar over one principal's preferences; the bridge from norm-modeling to institutional AI.

### Foundational works

- Cristina Bicchieri — *The Grammar of Society: The Nature and Dynamics of Social Norms* (2006)
- Robert Axelrod — [An Evolutionary Approach to Norms](https://www.jstor.org/stable/1960858) (1986) — the classic agent-based simulation of norm emergence and metanorms (punishing those who fail to punish); ancestor of every MARL enforcement experiment.
- H. Peyton Young — [The Evolution of Social Norms](https://www.annualreviews.org/doi/10.1146/annurev-economics-080614-115322) (2015) — the evolutionary / equilibrium-selection backbone for how conventions and norms arise, stabilize, and tip.
- Dylan Hadfield-Menell, Smitha Milli, Pieter Abbeel, Stuart Russell & Anca Dragan — [Inverse Reward Design](https://arxiv.org/abs/1711.02827) (2017) — treats a specified reward as an *observation* of true intent under uncertainty; the technical seed of inferring norms rather than hard-coding them.
- Guido Boella & Leendert van der Torre — work on normative multi-agent systems (obligations, permissions, violation handling) — the deontic-logic, "norms as first-class system objects" tradition; the symbolic counterpoint to the learning-based view.

### Key concepts

- Social norm vs. convention vs. moral rule
- Empirical vs. normative expectations
- Conditional preference for compliance
- Norm emergence and convergence in populations
- Third-party punishment and sanctioning
- Metanorms (punishing non-punishers)
- Bayesian rule induction over observed behavior
- Equilibrium selection in coordination games
- "Silly rules" / spurious normativity and legible enforcement
- Decentralized learning from public sanction signals
- Inverse inference of norms and intent
- Role-based vs. preference-based alignment

### Four-week mini-course

- **Week 1 — The social-science model of norms.** Cristina Bicchieri, *Norms in the Wild* (selections). Start with the human concept: norms as expectation-supported conditional preferences, so the computational models have something precise to operationalize.
- **Week 2 — How norms emerge in learning agents.** Köster, Hadfield-Menell et al., *Spurious normativity* (skim Axelrod 1986 for lineage). See norms arise bottom-up from punishment dynamics in multi-agent RL, and connect it to the 1980s agent-based roots.
- **Week 3 — Inferring and sustaining shared norms.** Oldenburg & Zhi-Xuan, *Learning and Sustaining Shared Normative Systems*; pair with Hadfield-Menell et al., *Inverse Reward Design*. Shift from emergence to inference: how an agent reads a norm from sparse observation and how a group sustains a shared rule system.
- **Week 4 — Norms, LLM agents, and institutional alignment.** Sarkar, Trivedi & Hadfield, *Normative Modules*; Zhi-Xuan et al., *Beyond Preferences in AI Alignment*. Land in the present: norm-modeling on top of LLM agents, and the argument that institutions should align AI to negotiated role-norms, not preferences.

---

## 5. Institutional & Behavioral Economics

<!-- advisors: TODO -->

Why do markets deliver some goods well and others badly — and what does AI do to that boundary?

This is the "why markets deliver some goods well and others badly, and how institutions form" strand of economics — not textbook optimization. It runs from economic history and the theory of institutional change, through transaction-cost and information economics, to the behavioral and welfare critiques that ask what choice-and-price models leave out. For AI it is load-bearing twice over: agents change the cost of specifying, monitoring, and enforcing transactions — which is exactly what decides whether a good gets marketized or governed some other way — and they make it tempting to read values straight off behavior, the move this literature spent fifty years showing is unsafe. The two Klingefjord essays are MAI framing pieces that apply these ideas to the goods markets handle worst.

*Core readings: ~9–12 hours.*

### Core readings

- Oliver Klingefjord — [Coasean Compression](https://meaningalignment.substack.com/p/coasean-compression) (2026) — MAI framing: when a good is hard to specify and verify (connection, belonging), markets sell a cheaper contractible proxy instead of the real thing; how those frictions decide what markets can actually deliver.
- Oliver Klingefjord — [Baumol's Sawdust](https://meaningalignment.substack.com/p/baumols-sawdust) (2026) — MAI framing: why cheap AI substitutes for relational goods thin the social infrastructure that made the real goods possible, so competition deepens the failure instead of correcting it.

- Ronald Coase — The Nature of the Firm (1937) — firms exist because using the market is costly; the lens for asking which transactions AI agents pull inside an organization versus push back out to the market.
- Friedrich Hayek — The Use of Knowledge in Society (1945) — prices as a decentralized system for transmitting dispersed knowledge; the benchmark any AI "central planner" claim has to beat.
- George Akerlof — The Market for "Lemons" (1970) — how information asymmetry can collapse a market entirely; central to agents that can manufacture or detect asymmetry at scale.
- Oliver Williamson — Transaction Cost Economics: The Governance of Contractual Relations (1979) — when to govern a relationship by contract, hierarchy, or hybrid; a menu of institutional forms for agent relationships.
- Amartya Sen — Rational Fools (1977) — why revealed preference can't capture commitment and other-regarding reasons; the case against inferring values straight from behavior.
- Richard Thaler — [From Cashews to Nudges: The Evolution of Behavioral Economics](https://www.aeaweb.org/articles?id=10.1257/aer.108.6.1265) (2018 Nobel lecture) — the most accessible single tour of the behavioral critique of homo economicus; supplies the vocabulary (anomalies, mental accounting, nudges) in one sitting.

### Foundational works

- Oliver Hart & Bengt Holmström — The Theory of Contracts (1987)
- Adam Smith — *The Wealth of Nations* (1776), Books I–II
- Amartya Sen — *Development as Freedom* (1999)
- Samuel Bowles — *Microeconomics: Behavior, Institutions, and Evolution* (2004)

### Key concepts

- Transaction costs
- Information asymmetry
- Moral hazard
- Adverse selection
- Externalities
- Principal-agent problems
- Contract incompleteness
- Revealed preference and its limits
- Capabilities approach
- Bounded rationality and behavioral anomalies (loss aversion, framing, mental accounting)
- Baumol's cost disease
- Repugnance and contested commodification

### Four-week mini-course

- **Week 1 — Why firms and prices exist.** Ronald Coase, *The Nature of the Firm*; Friedrich Hayek, *The Use of Knowledge in Society*. Markets and firms are both answers to coordination costs, not defaults.
- **Week 2 — When markets break from the inside.** George Akerlof, *The Market for "Lemons"*; Oliver Williamson, *Transaction Cost Economics*. Information and contracting frictions decide which transactions get governed by market, hierarchy, or hybrid.
- **Week 3 — When the model of the chooser is wrong.** Amartya Sen, *Rational Fools*; Richard Thaler, *From Cashews to Nudges*. Revealed preference and rational-actor assumptions miss commitment, other-regard, and systematic bias.
- **Week 4 — The goods markets handle worst (MAI framing).** Oliver Klingefjord, *Coasean Compression* and *Baumol's Sawdust*. Hard-to-specify relational goods get compressed into proxies, and cheap AI substitutes deepen rather than correct the failure.

---

## 6. Game Theory & Mechanism Design

<!-- advisors: TODO (candidates: Andrew Koh, Jobst Heitzig, Marcus Pivato, Roberto Weber) -->

What happens when strategic agents interact, and can we design the rules of interaction so that self-interested behavior produces good outcomes? Game theory describes what people do; mechanism design works backwards from what we want them to do. Both become unavoidable once the strategic agents include AI.

Game theory grew out of economics and mathematics to model strategic interaction; mechanism design is its inverse, working backwards from a desired outcome to the rules that would produce it. The two connect to AI directly: once strategic actors include agents — players that can commit, search rule spaces, and best-respond at scale — the question of how to set rules so self-interest produces good outcomes stops being abstract. One caution worth carrying in: mechanism design is powerful exactly where goals, actions, and information can be formalized, and misleading when a simplified objective is mistaken for the institution's real purpose — so it reads best alongside Ostrom, Sen, and legal theory. We picked Schelling and Roth because they keep the field anchored in real institutions rather than formal models.

*Core readings: ~7–9 hours.*

### Core readings

- Thomas Schelling — *The Strategy of Conflict* (1960), ch. 3 — focal points: how coordination can succeed without communication; central to whether agents converge on shared expectations.
- Robert Axelrod — *The Evolution of Cooperation* (1984), ch. 1–4 — when cooperation emerges among self-interested players in repeated interaction; the baseline model for agent-to-agent relationships.
- Roger Myerson — Mechanism Design (2008 Nobel lecture) — the formal theory of designing rules so truth-telling and good behavior are incentive-compatible, plus its sharp limits.
- Alvin Roth — The Economist as Engineer (2002) — market design as a practical craft (matching, clearinghouses); the closest the field comes to actually building institutions.
- Alvin Roth — [Repugnance as a Constraint on Markets](https://www.aeaweb.org/articles?id=10.1257/jep.21.3.37) (2007) — the designer's-eye companion: efficient mechanisms aren't enough if the transaction is socially refused; a built-in check on naïve marketization.
- Gillian Hadfield & Andrew Koh — [An Economy of AI Agents](https://arxiv.org/abs/2509.01063) (2025) — how autonomous agents reshape markets, firms, and the institutions markets require; the current, accessible AI-meets-mechanism-design piece, written by an economist working on aligning strategic AI systems.

### Foundational works

- John von Neumann & Oskar Morgenstern — *Theory of Games and Economic Behavior* (1944), ch. 1–3
- Robert Aumann — Agreeing to Disagree (1976)
- William Vickrey — Counterspeculation, Auctions, and Competitive Sealed Tenders (1961)

### Key concepts

- Nash equilibrium
- Repeated games and the folk theorem
- Focal points
- Signaling
- Incentive compatibility
- Revelation principle and its limits
- VCG mechanisms
- Matching markets and auction design
- Collusion and coalition-proofness
- Commitment problems
- Robust and detail-free mechanism design
- Strategic AI agents as mechanism participants

### Four-week mini-course

- **Week 1 — Strategy and coordination.** Thomas Schelling, *The Strategy of Conflict*, ch. 3; Robert Aumann, *Agreeing to Disagree*. How agents coordinate, signal, and reason about each other's beliefs without enforceable rules.
- **Week 2 — Cooperation without a designer.** Robert Axelrod, *The Evolution of Cooperation*, ch. 1–4. When repeated interaction sustains cooperation among self-interested players — and when it can't.
- **Week 3 — Designing the rules.** Roger Myerson, *Mechanism Design* (Nobel lecture); William Vickrey, *Counterspeculation*. Working backwards from desired outcomes: incentive compatibility, the revelation principle, and where they break.
- **Week 4 — Building real institutions, for humans and agents.** Alvin Roth, *The Economist as Engineer* (with *Repugnance*); Gillian Hadfield & Andrew Koh, *An Economy of AI Agents*. Market design as craft and its limits, and what changes when the strategic participants are AI agents.

---

## 7. Legal Theory

<!-- advisors: TODO -->

How are rules made, interpreted, enforced, and contested? Law is our most developed technology for governing behavior through explicit rules. What happens to it when many of the actors are autonomous AI agents?

Law quietly assumes a set of conditions: rules are costly to interpret, enforcement capacity is limited, ambiguity creates friction, actors have human-scale attention, and process is slow enough to let expectations stabilize. AI agents can break each of these — searching rule spaces, exploiting ambiguity, generating disputes, and automating compliance theater cheaply. The readings build from what law *is* (Hart, Fuller) toward what its infrastructure costs and how code substitutes for it (Lessig, Hadfield); we added agency and fiduciary concepts because if agents act on behalf of humans, those doctrines move to the center.

*Core readings: ~6–9 hours.*

### Core readings

- Gillian Hadfield & Barry Weingast — [Microfoundations of the Rule of Law](http://pscourses.ucsd.edu/ps200b/Hadfield%20Weingast%20Microfoundations%20of%20rule%20of%20law.pdf) (2014) — what a legal order needs to actually work as decentralized coordination, not just on paper.
- H.L.A. Hart — *The Concept of Law* (1961), ch. 5–6 — law as a union of primary rules and secondary rules (rules for changing, interpreting, and recognizing rules); explains why a rule system needs machinery for its own revision.
- Lon Fuller — *The Morality of Law* (1964), ch. 2 — the inner morality of law: eight ways a rule system can fail procedurally even when well-intentioned; a checklist for any automated rule regime.
- Lawrence Lessig — Code is Law (1999) — how technical architecture regulates behavior as powerfully as statute; foundational for AI systems that *are* the enforcement layer.
- Gillian Hadfield — *Rules for a Flat World* (2017), ch. 1–2 — why legal infrastructure is scarce and expensive, and what a market for legal infrastructure could look like at machine scale.

### Foundational works

- Oliver Wendell Holmes — The Path of the Law (1897)
- Cass Sunstein & Adrian Vermeule — Interpretation and Institutions (2003)
- Scott Shapiro — *Legality* (2011)

### Key concepts

- Legal positivism vs. natural law
- The rule of recognition and legal validity
- Primary vs. secondary rules
- The inner morality of law (Fuller's procedural desiderata)
- The rule of law
- Common-law reasoning and precedent
- Adjudication, judicial discretion, and hard cases
- Legal interpretation (textualism, purposivism, originalism)
- Delegation and interpretive authority
- Agency law and fiduciary duty
- Due process
- Legal personhood

### Four-week mini-course

- **Week 1 — What law is.** H.L.A. Hart, *The Concept of Law*, ch. 5–6. Law as a union of primary rules and secondary rules — the rules for changing, interpreting, and recognizing rules; why a rule system needs machinery for its own revision.
- **Week 2 — How law can fail procedurally.** Lon Fuller, *The Morality of Law*, ch. 2. The eight ways a rule system fails even when well-intentioned — a direct checklist for any automated rule regime.
- **Week 3 — What a legal order costs.** Gillian Hadfield & Barry Weingast, *Microfoundations of the Rule of Law*; Gillian Hadfield, *Rules for a Flat World*, ch. 1–2. What a legal order needs to work as decentralized coordination, and why that infrastructure is scarce and expensive.
- **Week 4 — Code as the enforcement layer.** Lawrence Lessig, *Code is Law*. How technical architecture regulates as powerfully as statute — the load-bearing reading once AI systems *are* the enforcement layer.
