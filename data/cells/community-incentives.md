---
human_label: "Commons governance, quotas & access pricing"
status: body_ok
owner: joe
starred: true
---

# AI commons management

## At a glance

### Coordination challenge

How a community allocates access to a shared resource and deters overuse when each participant benefits from taking more than their share.

### Examples

- Valencia Water Tribunal
- Maine lobster territorial practices
- New Zealand Quota Management System
- London Congestion Charge
- Wikipedia edit protection

### How AGI breaks them

- Agent deployment separates the resource user from the accountable community member.
- Agents convert informal slack into exploitable capacity by searching, booking, extracting, and contributing continuously.
- Agent fleets can overwhelm allocation rules built for roughly comparable human participants while formally obeying them.
- Monitoring and appeal records become strategic inputs when agents can generate contributions, complaints, evidence, and explanations at scale.
- Digital commons become easier to mirror, fork, and mine than to govern, weakening incentives to contribute to the mainline.

## How humans solve this today

Long-running commons make use conditional: access is tied to standing, withdrawal is measured, rule-breaking is visible enough to sanction, and users have a way to revise the rules when local conditions change. From Ostrom's irrigation systems and fisheries to congestion pricing, platform moderation, and digital knowledge commons, the institutional design patterns are similar:

1. **Accountable standing.** A commons first decides who counts as a participant the community can recognize and discipline. Fisheries quotas tie standing to licensed vessels or quota holders; Wikipedia ties some standing to accounts, edit history, and page-specific permissions. The user of the resource must be close enough to an accountable member for warnings, reputation, suspension, and exclusion to matter.

2. **Measured withdrawal.** The community then specifies what each participant may take, do, reserve, or change. Catch shares allocate harvest rights; congestion charges price scarce road capacity; edit protection changes who can write to a high-conflict Wikipedia page. These rules work partly because the measured unit fits the human pattern of use.

3. **Rough symmetry among users.** Human commons usually tolerate imperfect allocation because participants have bounded and roughly comparable operating bandwidth. Fishers can work longer hours, drivers can choose different routes, editors can watch a page closely, but none of them can search every opening continuously. This lets a community use simple quotas, prices, turns, and edit limits without every small gap becoming immediately decisive.

4. **Monitoring, records, and graduated sanctions.** Human commons rely on monitors who can observe use at the relevant scale, plus records that remain interpretable: catch logs, inspection reports, edit histories, curb reservations, complaints, and testimony. Sanctions then start small and become serious. A fisher who violates a local rule may face license consequences or legal penalties; a Wikipedia editor may be reverted, warned, temporarily blocked, then banned.

<!-- let's put a better 'vivid case' here -->

## Where AGI breaks it

1. **Agent deployment separates the resource user from the accountable community member.** In the human commons, the person taking water, setting traps, driving into a priced zone, or editing a page is the person the community can recognize, warn, shame, suspend, or summon. Agent deployment inserts a layer between use and accountability: the resource-touching actor may be an instance, a tool, a vendor service, or an agent acting under a principal's standing instruction. Even if there's a way to sanction the principal, the agent will not necessarily feel the cost of those sanctions in the moment of use, and the principal may not be monitoring the agent's behavior closely enough to know when to intervene.

2. **Agents convert informal slack into exploitable capacity by searching, booking, extracting, and contributing continuously.** Many commons rules depend on friction that has been taken for granted: people sleep, wait in lines, miss openings, tire of marginal gains, and do not search every loophole all day. Agents can reserve curb slots, scrape a database, watch quota windows, edit pages, or submit derivative contributions continuously.

3. **Agent fleets can overwhelm allocation rules built for roughly comparable human participants while formally obeying them.** Catch shares, congestion charges, edit limits, and access permits often assume that participants have different interests but broadly comparable operating bandwidth. Users equipped with a fleet of agents break that, and may be able to turn a rule meant for ordinary use into a high-volume extraction channel.

4. **Monitoring and appeal records become strategic inputs when agents can generate contributions, complaints, evidence, and explanations at scale.** Human commons use records as governance inputs: edit histories, catch logs, curb reservations, inspection reports, complaints, appeals, and testimony. Agent-mediated participation can flood those inputs with plausible but low-value contributions, synthetic disputes, optimized explanations, or selectively produced audit trails. Monitoring thus needs a way to keep the evidentiary substrate from becoming another resource agents compete to shape.

5. **Digital commons become easier to mirror, fork, and mine than to govern, weakening the mainline's contribution incentives.** Physical commons still have a located resource: the harbor, pasture, road, or canal cannot be copied. But an agent can mirror the knowledge base, harvest the asset library, or maintain a private fork while continuing to consume public updates. The local governance regime loses leverage.

## Problem Sets

### Membership and Sanctions for Agent Commoners

**Scenario.** A network of indie game studios shares a commons of modular 3D assets: rooms, props, animation rigs, textures, and test scenes. For two years the arrangement worked because studios contributed assets, reviewed one another's work, and received download credits in proportion to useful contributions. Then several studios deploy agents that submit hundreds of lightly modified variants, harvest the best new assets, and reappear under new tool names after warnings. Tarek, one of the founding maintainers, needs a membership and discipline regime that keeps small studios inside the commons without letting high-volume agent fleets turn it into a credit farm.

**Challenge:** Design a membership and graduated-sanction regime for agent participants in the asset commons. The regime succeeds if it can identify who has standing, make repeated low-level abuse costly to the principal that benefits from it, distinguish a one-off faulty deployment from a business model built around extraction, and give small studios an affordable appeal path. The team should produce the registry rules, sanction ladder, evidence standard, and appeal procedure for the scenario.

**Design choices the team must take a position on.**

1. **Membership object.** Does standing attach to the studio, the agent deployment, the model lineage, the vendor, the account, or a verified principal-agent pair?
2. **Identity persistence.** Which facts persist across patches, renamed agents, new vendors, and model upgrades: warnings, contribution scores, abuse findings, staked deposits, or access limits?
3. **Sanction target.** When an agent violates the rules, does the cost fall on the instance, the studio, the supervisor who approved deployment, the tool vendor, or several at once?
4. **Evidence threshold.** What pattern turns noisy low-quality contribution into sanctionable abuse: volume, similarity, failed review rate, intent evidence, recurrence after warning, or downstream harm?
5. **Appeal venue.** Are disputes heard by maintainers, randomly selected member studios, an external arbiter, an agent triage process with human appeal, or a hybrid?

### Pricing Automated Use of a Community Resource

**Scenario.** A city runs a London-style congestion and curb-access system for a dense downtown district. Human drivers, delivery firms, buses, ride-hail vehicles, and local businesses all depend on the same roads and curb slots. After autonomous delivery agents enter the market, they continuously search for cheap access windows, split routes across many accounts, reserve and release curb space at high frequency, and shift congestion into residential side streets. The formal rules are obeyed, but the resource is now allocated to whoever can automate around the pricing schedule fastest.

**Challenge:** Design an access-pricing and quota regime for automated use of the city's road and curb commons. The regime succeeds if automated fleets cannot multiply identities to evade caps, if prices track congestion and neighborhood externalities rather than only formal entry, if small firms can still participate, and if the city can revise the schedule when agent behavior changes. The team should produce the pricing rule, quota rule, monitoring data specification, and revision process.

**Design choices the team must take a position on.**

1. **Pricing basis.** Is access priced by entry, distance, curb minutes, congestion contribution, neighborhood impact, fleet size, or a layered formula?
2. **Cap object.** Are quotas assigned to vehicles, firms, delivery tasks, verified principals, geographic zones, or time windows?
3. **Anti-sybil design.** What prevents one operator from splitting activity across many agents, accounts, subsidiaries, or vendors to get more cheap access?
4. **Small-actor protection.** Does the regime reserve capacity, offer credits, use progressive pricing, or provide exemptions for small local businesses and essential services?
5. **Revision cadence.** Who can update the price schedule when agent behavior changes, what evidence triggers revision, and what notice or appeal rights do affected users get?

### Contribution Quality in Agent-Mediated Commons

**Scenario.** The indie-game asset commons pays contributors in download credits and reviewer standing. After studios deploy contribution agents, the submission queue fills with plausible but low-value variants: texture recolors, near-duplicate props, animation rigs that pass automated checks but fail in real scenes, and polished explanations of why each asset deserves inclusion. Human reviewers spend more time rejecting marginal work than improving the commons. Small studios with genuinely useful assets wait weeks for review while high-volume agents keep the queue full.

**Challenge:** Design a contribution-quality regime for an agent-mediated commons where review attention is itself the scarce resource. The regime succeeds if agents cannot cheaply flood the queue with formally valid low-value submissions, if genuinely useful contributions from small studios still get reviewed, if contribution credits track downstream value rather than submission volume, and if rejected contributors have a fair appeal path that does not become another spam channel. The team should produce the queueing rule, quality-scoring rule, reviewer-protection mechanism, credit formula, and appeal procedure.

**Design choices the team must take a position on.**

1. **Queue access.** Are submissions admitted first-come-first-served, by contributor reputation, by staked review deposit, by random sampling, by downstream demand signal, or by a layered queue?
2. **Quality measure.** Does quality mean human reviewer score, downstream reuse, interoperability with existing assets, novelty relative to the library, maintenance burden, or a weighted combination?
3. **Cost of review.** Who pays when a submission consumes reviewer time but adds little value: the submitting studio, the agent deployment, a pooled review budget, or future credit earnings?
4. **Credit formula.** Are contributors rewarded for accepted submissions, downstream use, reviewer-confirmed quality, scarcity of the asset type, maintenance over time, or some mix?
5. **Appeal throttling.** What gives rejected contributors a real appeal while preventing agents from turning appeals into a second queue flood?
