# M3 — representative Yandex SERP query matrix

Date: 2026-09-16.
Status: **ACTIVE / REBASELINING AFTER OWNER PRODUCT-CORRECTION**.
Authority: `../SEO_MASTER_ROADMAP_2026-09-16.md`, `../PRODUCT_TRUTH.md`, `../QUALITY_FIRST_RESOURCE_RULE.md`.

## 1. Why M3 is being rebaselined

The first matrix correctly explored the existing `ИИ-агент` search category, but the owner clarified the core product more precisely:

**Octoport is not itself an AI employee. Octoport is the bridge/tool that turns the user's chosen supported AI into an employee for work with Ozon/Wildberries.**

Therefore the relevant search market is broader than people who already type `ИИ-агент`. Existing demand can enter through older categories and problem language: seller analytics, reports, marketplace help, operational product-card work, advertising analysis and connection of ChatGPT/other LLMs to marketplace data.

Quality is the primary constraint. Provider cost, Work usage and token budget are not reasons to skip a materially useful evidence step.

## 2. Execution principle

For every newly released provider query:

`query-specific fresh research/release -> provider lifecycle -> full persistence/readback -> full-row analysis -> decision -> next query`.

No fixed query quota. No sampling when full analysis is feasible. No keyword inflation merely to reach a large row count. Reruns/re-acquisition are allowed whenever corrected product truth or new evidence creates material information gain.

## 3. Evidence already retained

| ID | Query | What it proved | State |
|---|---|---|---|
| S01 | `ии агенты для маркетплейсов` | a real marketplace AI-agent SERP/category exists; not only card-image generation | `CLOSED / VALID / 20 RESULTS` |
| S02 | `ии агент для озон` | Ozon-specific seller/API/data intent exists alongside generic category pages | `CLOSED / VALID / 20 RESULTS` |
| S03 | `ии агент для wildberries` | WB-specific intent exists; paired Ozon/WB result is MIXED: shared category core + marketplace-specific depth | `CLOSED / VALID / 20 RESULTS` |

These steps remain valid. They cover one important acquisition entrance but are not sufficient to describe the whole Octoport market.

## 4. Rebaseline decision

Before automatically executing the old S04 sequence, reopen demand acquisition as `M2R` for missing task families. Current Wordstat accounting shows only `195` unique direct phrase strings (`423` including broad associations/non-echoed seeds), and B02 mostly remeasured B01 discoveries rather than materially enlarging the direct phrase universe.

Old S04-S17 are **not discarded**. Their release order is paused until M2R determines the best representative queries for the corrected product model.

## 5. Required task families before M3 can close

### F1 — Existing AI-agent / assistant category

Already materially covered by S01-S03.

Remaining questions only if they add information:

- singular vs plural generic agent wording;
- assistant wording;
- generic vs marketplace-specific merge/split;
- discovery/comparison query behavior.

Purpose: capture people already searching for the nearest existing category.

### F2 — Connect the user's own AI/LLM to marketplace

Need demand + SERP evidence around:

- ChatGPT/Claude/Gemini or generic AI connected to Ozon/WB;
- `подключить ИИ к кабинету/данным маркетплейса`;
- natural-language access to seller data;
- extension/bridge wording where real search demand exists.

Purpose: test search language closest to Octoport's differentiating mechanism: the user keeps their chosen AI and Octoport gives it access to the marketplace.

### F3 — Seller-cabinet analytics and reports

Need representative demand + SERP evidence around:

- analytics of seller cabinet;
- sales / profit / stock / returns analytics;
- seller reports / marketplace report services;
- internal/seller-owned data analytics;
- search-query analytics where relevant;
- services that aggregate or explain marketplace reports.

Purpose: capture users who currently think they need an analytics/reporting service but could instead use their AI as an analyst through Octoport.

### F4 — Daily help with marketplace work

Need search-language discovery around tasks such as:

- help working in Ozon/WB seller cabinet;
- how to understand/use cabinet functions;
- products, supplies, orders, returns, reviews, prices and operational workflows;
- manager/seller assistant/help wording.

Purpose: capture the broader employee/helper job, not only analytics.

### F5 — Product-card work, with strict creative-generator boundary

Include operational/content assistance such as:

- how to create/fill/check a card;
- attributes/characteristics;
- description/SEO;
- category/compliance/content preparation;
- card workflow in seller cabinet.

Exclude as core Octoport demand:

- standalone AI image generation;
- infographic generators;
- background/photo generators;
- AI photoshoots and pure creative-card generators.

Purpose: distinguish `help me work with the product card` from the large unrelated `generate me a picture/card` market.

### F6 — Advertising analysis/help, excluding autobidder market

Include:

- advertising reports and statistics;
- campaign effectiveness;
- DRR/ACOS-like diagnostics where marketplace terminology supports it;
- explanations/recommendations/planning;
- seller questions about campaign performance.

Exclude as core product category:

- real-time bid bots;
- 24/7 automatic bid-management services whose primary value is continuous bid changes.

Purpose: capture analytical/employee assistance without confusing Octoport with specialist bidding automation.

### F7 — Marketplace/search/niche analytics where source capability exists

Need separate evidence for:

- buyer/search-query analytics;
- promising-niche/search-demand tasks;
- marketplace-level analytics available from confirmed Ozon/WB sources;
- competitor/market intelligence only where source/API capability is actually verified.

Purpose: not to promise a full MPStats replacement, but to include market/search analysis jobs that the user's AI can genuinely perform from available official data.

### F8 — Knowledge/help about how the marketplace cabinet works

Need query-family discovery around:

- how a function in seller cabinet works;
- what a report/metric/status means;
- how to perform a seller workflow;
- Ozon/WB help/instructions questions.

Purpose: test the `live seller data + official marketplace help knowledge + conversational AI` use case.

Boundary: current evidence does not prove a dedicated Ozon/WB knowledge-base Seller API endpoint. Official help/knowledge pages and operational APIs are separate authoritative sources unless endpoint-level evidence later proves otherwise.

### F9 — Comparison/discovery of AI/tools for marketplaces

Retain old S04-style intent:

- `какой ИИ для маркетплейсов`;
- best/which AI/tool wording only when Wordstat/SEARCH supports it.

Purpose: capture users who know the problem but not the solution category and may currently compare card generators, analytics tools, agents and general LLMs together.

### F10 — Broad noise controls

Retain broad controls such as:

- `ии для маркетплейсов`;
- `нейросеть для маркетплейсов`;
- noisy `помощь` roots if useful.

Purpose: quantify contamination from card/image/content generation and protect final semantics from false demand inflation.

## 6. M2R -> M3 release logic

For each family:

1. perform fresh external research where required;
2. inspect existing B01/B02 evidence first;
3. run new Wordstat probes freely when they add information;
4. expand promising children/associations instead of stopping after one seed;
5. build a family-level phrase ledger;
6. choose representative Search queries from actual language/demand;
7. run enough current SERPs to resolve intent/page-type/competitor ambiguity;
8. stop only on information saturation, not because a request costs money or because an old quota was reached.

## 7. Work trigger

ChatGPT Work is explicitly allowed and encouraged whenever a complete family-level or cross-family analysis will be more reliable at full volume there.

Use Work for:

- large phrase-ledger dedup/classification;
- complete competitor corpus review;
- cross-family SERP overlap matrices;
- multi-source reconciliation;
- independent adversarial QA;
- any rerun/reclassification after product-truth changes where full-volume treatment improves quality.

No resource-economy objection applies under `QUALITY_FIRST_RESOURCE_RULE.md`.

## 8. M3 closure rule

M3 cannot close merely because S01-S17 were executed. It closes only when representative current SERP evidence is sufficient across the task families above and new queries stop materially changing:

- acquisition-intent map;
- recurring search competitors/page types;
- Ozon/WB merge/split evidence;
- own-LLM connection language;
- analytics/report intent;
- daily-work/help intent;
- product-card operational intent vs creative-generator noise;
- advertising-analysis intent vs autobidder noise;
- marketplace/search/niche analytics boundaries;
- official-help/knowledge task intent;
- candidate future Page Jobs and lexical gaps.

Until then `M7 COLLECTION FREEZE = BLOCKED`.