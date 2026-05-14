---
human_label: "Social media recommender systems"
problem: "How preferences and attention from billions of people get aggregated into a single global feed or signal."
examples: ["Facebook News Feed", "TikTok For You", "YouTube recommendations", "Google Search ranking", "Twitter/X timeline"]
agi_breaks: ["Engagement signals get gamed by content-generating agents.", "User preferences get shaped by the same agents serving them.", "Recommender outputs become an inter-agent equilibrium not a public signal.", "No way to tell preference from manipulation."]
status: not_started
owner: none
---

# Agent-resistant global preference aggregation

## How humans solve this today

Humanity has no institution that takes the preferences of the world's people and produces a binding global decision. Multilateral assemblies aggregate state positions, not preferences. The IMF aggregates capital stakes. The Security Council filters through five vetoes. A UN Parliamentary Assembly has been proposed for decades and never built.

What we have instead, almost by accident, is a class of systems that aggregate preferences globally as a side effect of optimizing for something else. Social media recommender systems — TikTok's For You page, YouTube, Reels, X's timeline — take billions of revealed-preference signals and produce a personalized-but-aggregated decision about what each user sees next. What they produce is a shared attentional environment that is upstream of nearly every other preference-aggregation process humanity runs: elections, public opinion, civil society, the news cycle.

A vivid case: in the weeks after George Floyd's killing in May 2020, the bystander video and the protests it sparked routed through recommender systems into feeds across more than a hundred countries. Within a week, protesters in Seoul, Berlin, Auckland, and São Paulo were marching to the same footage their counterparts elsewhere had just seen. Hundreds of millions of small engagement decisions converged into a coherent global stance, and corporations, parties, and governments were reacting to it within weeks.

## Where AGI breaks it

1. **Bot swarms become indistinguishable from publics.** Coordinated influence operations already shape what trends, but they leave traces today: low-effort comments, shallow follower networks, off-idiom text. Capable agents close that gap. A single actor can run millions of personas that watch to completion, comment in fluent local idiom, and build follower relationships with real users over months. The recommender cannot tell a campaign from organic interest. The cost of steering the global preference signal drops to whoever can pay for the compute.

2. **Individualized generated content stops surfacing shared signal.** To the extent that recommenders surface real preferences around real issues globally, they do so because users are engaging with roughly the same pool of human-produced content; what trends is legible because it's the same material everywhere. As generated content becomes more effective at producing engagement than human-produced content, each user increasingly sees material produced for them. There is no longer a shared pool over which preferences could aggregate, only parallel individual streams. The mechanism continues to run, but what it produces stops being a global signal.

## Scenarios

A mid-sized European democracy votes by two points to dissolve the independence of its constitutional court. A year later, researchers find the campaign was substantially amplified by millions of accounts traced to a neighboring state's intelligence services, accounts that had spent years watching to completion, commenting in fluent local idiom, and building real follower relationships before the campaign began. They would have passed any human review the platform could have run at scale. The state denies involvement. The change is irreversible by ordinary legislative means, and with the court's independence gone, the last domestic check on the executive is gone with it. In the years that follow, governments across the region grow skeptical of referendums, polls, and elections as tools that can be hijacked from outside.

## Problem Sets

### Preserving Aggregation Integrity Against Capable Agent Inputs

**Anchor contexts.** A major social platform whose recommender is humanity's de facto cross-border preference-aggregation system; a national election in which the recommender-shaped attentional environment is contested by foreign and domestic agent campaigns at scale.

**The gap.** We lack a method by which a recommender aggregating revealed-preference signals at global scale can distinguish human engagement from capable-agent engagement well enough to keep its outputs a meaningful aggregation of what humans want — given that detection is an arms race the platform is structurally outmatched to win, and that false positives (silencing real users) are at least as severe as false negatives.

**Design choices the team must take a position on.**
1. **Input verification.** Does the system require human-verified provenance for engagement to count — personhood attestation, trusted-institution credentials, behavioral biometrics — or accept all engagement and rely on downstream correction? Verification disadvantages users who can't or won't authenticate; downstream correction admits the campaigns and tries to detect them after.
2. **Discounting versus exclusion.** When suspected agent engagement is detected, is it excluded, down-weighted, or quarantined into a signal the platform tracks but doesn't act on?
3. **Agent-mediated engagement as a category.** When a user delegates scrolling to their own agent, does the system treat that as human (it represents a real principal), as agent (the signal isn't the principal's direct preference), or as a third category? The answer determines whether the loop-closure failure is structurally prevented or accepted.
4. **Cross-platform coordination.** An actor runs campaigns across every major platform simultaneously. Can the platforms share signal about coordinated activity without creating a surveillance regime no platform can be trusted to administer?
5. **Recourse on false positives.** When a real social movement is mistakenly flagged, what's the path to contest the discount that doesn't require trusting the platform to adjudicate fairly?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A state actor deploys a million capable-agent personas to amplify three issues before a referendum; the platform's aggregation produces an attentional environment researchers later judge to reflect organic public attention within reasonable bounds.
- A grassroots signal breaks through when it's real, the way the 2020 protest cascade did; the system does not silently advantage well-resourced producers whose content is better-optimized against the algorithm.
- A user delegates scrolling to a personal agent; the loop-closure failure is structurally prevented and the user's actual preferences continue to be a meaningful input.
- Two platforms detect a coordinated campaign spanning both and can act on the signal without the resulting infrastructure becoming a censorship mechanism any single actor can wield.
- A real social movement is mistakenly flagged; the affected users have a path to contest that doesn't require trusting the platform.

**Deliverable.** The aggregation-integrity regime — input verification, discounting versus exclusion, agent-mediated engagement, cross-platform coordination, recourse. Plus an explicit statement of which load-bearing function this regime is preserving: are recommenders trying to faithfully aggregate human preferences (in which case agent input is poison), or to allocate attention to whatever signal arrives (in which case the question is who gets to send signal)?
