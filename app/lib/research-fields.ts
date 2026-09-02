export interface FieldResearcher {
  name: string;
  tags: string[];
}

export interface ResearchField {
  id: string;
  label: string;
  /**
   * Exact tag names, lowercased. A person is in the field if any of their tags
   * matches one of these exactly.
   *
   * This used to be a substring match against the joined tag string, which
   * silently produced false positives whenever a short keyword appeared inside
   * an unrelated longer tag: "law" matched "coordination scaling laws" (ML
   * scaling curves), "ethics" matched "AI ethics" (a governance term, not moral
   * psychology), "mechanism design" matched people who merely listed it.
   * Exact matching removes that whole class of bug, at the cost of requiring
   * every new tag to be classified here — see UNASSIGNED_TAGS below.
   */
  tags: string[];
  /** Escape hatch for people whose tags do not describe what they actually work on. */
  people?: string[];
}

// Reader-facing fields follow the curriculum rather than exposing the
// granular and inconsistently scoped working tags stored in the roster.
export const RESEARCH_FIELDS: ResearchField[] = [
  {
    id: "multi-agent-systems",
    label: "Multi-agent systems",
    tags: [
      "multi-agent systems",
      "multi-agent reinforcement learning",
      "multi-agent rl",
      "multi-agent llms",
      "multi-agent communication",
      "cooperative ai",
      "cooperation",
      "ai for cooperation",
      "cooperation theory",
      "language model cooperation",
      "social dilemmas",
      "coordination scaling laws",
      "agent economies",
      "generative agents",
      "generative agent-based models",
      "concordia",
      "collective behaviour",
      "complex systems",
      "open-ended learning",
      "unsupervised environment design",
      "self-play",
      "llm agents",
      "agentic llms",
      "web agents",
      "agent benchmarks",
      "decentralized ai",
      "robotics",
      "open-source infrastructure",
      "protocol design",
    ],
  },
  {
    id: "aligning-ai-to-values",
    label: "Aligning AI to values",
    tags: [
      "ai alignment",
      "alignment",
      "value alignment",
      "pluralistic alignment",
      "pluralism",
      "meaning alignment",
      "values elicitation",
      "preference modeling",
      "preference aggregation",
      "preference change",
      "reward modeling",
      "rlhf",
      "constitutional ai",
      "moral learning",
      "computational models of moral learning",
      "institutional alignment",
      "legal alignment",
      "ai conversational alignment",
      "truth-seeking ai",
      "self-other overlap",
      "prosociality",
      "ai reflectors",
      "societal uplift",
      "diversity in ai",
      "ai fairness",
    ],
  },
  {
    // "AI governance" (24) and "AI policy" (12) are the two biggest tags in the
    // roster. Note that bare "ai safety"/"agi safety" are deliberately NOT
    // keywords anywhere: 22 people carry "AI safety" as an affiliation badge
    // rather than a description of their work, and including it collapsed
    // governance, technical safety and x-risk into one 61-person field. People
    // whose only safety signal is that badge are placed by their substantive
    // tags instead.
    id: "ai-governance-policy",
    label: "AI governance & policy",
    tags: [
      "ai governance",
      "ai policy",
      "agi policy",
      "ai safety policy",
      "ai agents governance",
      "ai for governance",
      "technology policy",
      "public policy",
      "economic policy",
      "compute governance",
      "technology governance",
      "technology regulation",
      "algorithmic governance",
      "platform governance",
      "climate governance",
      "blockchain governance",
      "data governance",
      "data policy",
      "national security",
      "international verification",
      "hardware monitoring",
      "antitrust",
      "government transparency",
      "responsible ai",
      "public-private governance",
      "open source ai policy",
      "defense innovation",
      "ai societal impacts",
      "ai impacts",
      "future of work",
      "online harms",
      "misinformation",
      "information integrity",
      "privacy",
      "privacy-preserving measurement",
      "metagov",
      "tum.ai",
      "ai education",
      "education",
      "financial services",
      "healthcare ai",
      "ai for social good",
      "climate ai",
      "social media",
      "platform design",
      "recommender systems",
      "polarization",
      "quantitative market research",
      "market governance of ai",
      "digital transformation",
      "ai law",
    ],
  },
  {
    // Merges the old "Cognitive science & moral psychology" and "Models of
    // norms & norm learning". Philosophy is a separate field: bare "philosophy"
    // said nothing about whether someone works on moral cognition.
    id: "moral-cognition-norms",
    label: "Moral cognition & norms",
    tags: [
      "moral psychology",
      "moral cognition",
      "moral reasoning",
      "moral progress",
      "cultural psychology",
      "social cognition",
      "computational social cognition",
      "fairness cognition",
      "theory of mind",
      "cognitive science",
      "computational cognitive science",
      "cognitive neuroscience",
      "cognitive modeling",
      "ai cognition",
      "ai mentality",
      "ai identity",
      "bayesian models of cognition",
      "human decision making",
      "memory",
      "reasoning",
      "llm reasoning",
      "llm psychology",
      "neuroscience-inspired ai",
      "brain-computer interfaces",
      "computational ethics",
      "computational kantianism",
      "normative ai",
      "normative decision theory",
      "contractualism",
      "cultural evolution",
      "active inference",
    ],
  },
  {
    // Also holds philosophy of language and linguistics. Those tags used to sit
    // in moral-cognition-norms (inherited from the old cognitive-science
    // field), which put philosophers of language in a moral-psychology field.
    id: "philosophy-of-ai",
    label: "Philosophy of AI",
    tags: [
      "philosophy",
      "philosophy of language",
      "pragmatics",
      "generics",
      "formal linguistics",
      "computational linguistics",
      "language and society",
      "philosophy of ai",
      "philosophy of mind",
      "philosophy of science",
      "political philosophy",
      "philosophical logic",
      "philosophical rationalism",
      "epistemology",
      "metaphysics",
      "metaethics",
      "ethics of ai",
      "value theory",
      "decision theory",
    ],
  },
  {
    id: "deliberative-democracy",
    label: "Deliberative democracy",
    tags: [
      "deliberative democracy",
      "democratic deliberation",
      "ai-assisted deliberation",
      "deliberation technology",
      "democratic ai",
      "democracy",
      "democratic theory",
      "democratic innovation",
      "democratic institutions",
      "democratic participation",
      "citizen assemblies",
      "citizens assemblies",
      "sortition",
      "participatory ai",
      "participatory budgeting",
      "participatory policymaking",
      "liquid democracy",
      "quadratic voting",
      "ai-mediated collective decision-making",
      "collective wisdom",
      "civic technology",
      "e-democracy",
      "habermas machine",
      "radicalxchange",
      "plural property",
      "proportionality",
      "method of equal shares",
    ],
  },
  {
    // Replaces the old "Institutional economics". There is deliberately no
    // "institutional design" field: the whole project is institutional design,
    // so the label does not distinguish anyone.
    id: "economics-of-ai",
    label: "Economics of AI",
    tags: [
      "economics",
      "economic theory",
      "ai economics",
      "digital economics",
      "economics of technology",
      "labor economics",
      "labor markets",
      "development economics",
      "behavioral economics",
      "experimental economics",
      "welfare economics",
      "competition economics",
      "microeconomics",
      "ai political economy",
      "ai and productivity",
      "tax policy",
      "algorithmic collusion",
      "ai pricing",
      "autobidding",
      "market design",
      "economic design",
    ],
  },
  {
    // Krzysztof Pelc and Andrew Konya sit here rather than in legal theory or
    // deliberation: the shared object is how parties with divergent interests
    // reach and sustain binding agreements.
    id: "negotiation-cooperation",
    label: "Negotiation & international cooperation",
    tags: [
      "diplomacy ai",
      "trade law",
      "credibility",
      "cooperation between states",
      "international relations",
      "international political economy",
      "conflict resolution",
    ],
    people: ["Andrew Konya"],
  },
  {
    id: "game-theory-mechanism-design",
    label: "Game theory & mechanism design",
    tags: [
      "game theory",
      "algorithmic game theory",
      "ai and game theory",
      "mechanism design",
      "social choice",
      "social choice theory",
      "computational social choice",
      "judgement aggregation",
      "voting theory",
      "condorcet methods",
      "split cycle",
      "auction theory",
      "fair division",
      "cake cutting",
      "equilibrium computation",
      "equilibrium finding",
      "nash equilibrium",
      "stackelberg games",
      "game dynamics",
      "learning in games",
      "no-regret learning",
      "regret minimization",
      "imperfect-information games",
      "poker ai",
    ],
  },
  {
    id: "legal-theory",
    label: "Legal theory",
    tags: [
      "ai law",
      "technology law",
      "international law",
      "agency law",
      "law and economics",
      "jurisprudence",
      "algorithmic accountability",
    ],
  },
];

/**
 * Tags that intentionally belong to no field: generic method or affiliation
 * labels that would not help a reader filter ("machine learning", "NLP",
 * "mathematics"). Listed explicitly so `npm run check:tags` can tell a
 * deliberate omission from a tag nobody has classified yet.
 */
export const UNASSIGNED_TAGS: string[] = [
  // Technical-safety mechanisms. These were a separate "Technical safety &
  // oversight" field, now cut. As with existential risk, the people are better
  // described by their other work; a person whose only signal is one of these
  // simply has no field, which is an acceptable outcome.
  "scalable oversight",
  "chain-of-thought oversight",
  "ai evaluations",
  "llm evaluation",
  "dangerous capability evaluations",
  "interpretability",
  "mechanistic interpretability",
  "ai explainability",
  "formal verification",
  "provably safe ai",
  "agent foundations",
  "scientist ai",
  "technical ai research",
  "reward tampering",
  "agent incentives",
  "causal influence diagrams",
  "causal agency",
  "situational awareness",
  "goal misgeneralisation",
  "ai manipulation",
  "algorithmic manipulation",
  "llm social identity bias",
  "ai security",
  "unsupervised environment design",
  // Macro-strategic risk framing rather than a research method. These were a
  // separate "Existential risk & AI futures" field, which was cut: the people
  // in it are better described by what they actually do (governance,
  // philosophy, technical safety), and the label grouped Carlsmith with
  // Shavit on a shared concern rather than shared work.
  "existential risk",
  "ai existential risk",
  "ai risk",
  "frontier ai risks",
  "frontier safety",
  "gradual disempowerment",
  "macrostrategy",
  "futurism",
  "agi",
  "ai resilience",
  // Too broad to attribute a field from. Each of these was acting as a lone
  // bridge carrying someone into a narrower field they do not work in --
  // "collective intelligence" put Tan Zhi Xuan in Deliberative democracy,
  // "AI ethics" put Eloise Gabadou in moral philosophy. Better to
  // under-attribute than over-attribute: someone whose only signal for a field
  // is one of these is placed by their other tags instead.
  // Game-theoretic concept (coalitions in cooperative games), not
  // international negotiation -- it was carrying Jobst Heitzig into that field.
  "coalition formation",
  "ai ethics",
  "collective intelligence",
  "collective decision-making",
  "introspection",
  "dialogue systems",
  "world models",
  "category theory",
  "modal logic",
  "mathematics",
  // Affiliation badges, not descriptions of work. 22 people carry "AI safety";
  // treating it as a field keyword collapsed governance, technical safety and
  // x-risk into a single 61-person field. People are placed by their
  // substantive tags instead.
  "ai safety",
  "agi safety",
  // Not a field: the whole project is institutional design, so the label does
  // not distinguish anyone. Deliberate omission, not an oversight.
  "institutional design",
  "machine learning",
  "scientific machine learning",
  "reinforcement learning",
  "deep learning",
  "nlp",
  "llms",
  "generative models",
  "latent structure",
  "bayesian inference",
  "probabilistic programming",
  "statistical inference",
  "dynamical systems",
  "evolutionary computation",
  "open-endedness",
  "computational social science",
  "ml engineering",
  "research engineering",
  "human-ai interaction",
];

const normalize = (tag: string) => tag.trim().toLowerCase();

export function isInResearchField(
  person: FieldResearcher,
  field: ResearchField,
): boolean {
  if (field.people?.includes(person.name)) return true;
  const wanted = new Set(field.tags.map(normalize));
  return person.tags.some((tag) => wanted.has(normalize(tag)));
}

/** The field a single tag belongs to, if any. Used to link a profile tag to the filtered directory. */
export function fieldForTag(tag: string): ResearchField | undefined {
  const wanted = normalize(tag);
  return RESEARCH_FIELDS.find((field) => field.tags.some((t) => normalize(t) === wanted));
}

export function researchFieldsFor(person: FieldResearcher): ResearchField[] {
  return RESEARCH_FIELDS.filter((field) => isInResearchField(person, field));
}
