# R02 ↔ R03 paired F2 comparison — own ChatGPT for Ozon vs Wildberries

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F2 paired closure`.  
Status: **CLOSED / F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH / F2 ORDINARY SEARCH INFORMATION SATURATED**.

Compared queries:

- R02: `chatgpt для ozon` — 20 normalized results;
- R03: `chatgpt для wildberries` — 20 normalized results.

Both were collected with the same Yandex Search settings: RU, region 225, page 0, flat groups, 20 groups, one doc per group, moderate family mode, typo off, relevance descending.

## 1. Why this comparison exists

The paired question is not which marketplace is better. It is whether own-ChatGPT F2 demand behaves as one shared mechanism/search job with marketplace-specific depth, or as materially different Ozon and Wildberries Search intents.

Allowed paired outcome vocabulary from the R03 pre-step:

`F2_SYMMETRIC_SHARED_CORE | F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH | F2_MATERIALLY_ASYMMETRIC | HOLD`.

Observed outcome:

**`F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH`**.

## 2. Exact URL overlap

```text
R02_URLS = 20
R03_URLS = 20
SHARED_EXACT_URLS = 8
URL_UNION = 32
URL_JACCARD = 25.00%
```

Shared exact URLs:

| Surface | R02 rank | R03 rank |
|---|---:|---:|
| JAFO direct Claude/ChatGPT ↔ WB/Ozon connection guide | 1 | 1 |
| API Master ChatGPT ↔ Ozon/WB connection guide | 2 | 2 |
| YouTube marketplace card/infographic in ChatGPT | 18 | 5 |
| Tablichki marketplace export analysis via ChatGPT | 6 | 6 |
| JAFO product/home | 10 | 8 |
| YouTube WB/Ozon automation with ChatGPT | 20 | 9 |
| SEO.WBCON ChatGPT product-description page | 13 | 10 |
| WBCON ChatGPT description instruction | 17 | 16 |

The exact shared URLs span both the target mechanism and contamination/adjacent jobs, which is why overlap must be interpreted together with rank and intent class rather than as a split/merge answer by itself.

## 3. Domain overlap

```text
R02_UNIQUE_DOMAINS = 15
R03_UNIQUE_DOMAINS = 12
SHARED_DOMAINS = 9
DOMAIN_UNION = 18
DOMAIN_JACCARD = 50.00%
```

Shared domains:

`api-master.ru, apimonster.ru, jafo.ru, seo.wbcon.ru, tablichki.tech, vc.ru, wbcon.ru, www.klerk.ru, www.youtube.com`.

This is a materially stronger domain overlap than exact-URL overlap, consistent with shared category/surface authority plus marketplace-specific documents.

## 4. Head overlap

```text
TOP3_EXACT_URL_SHARED = 2
TOP3_URL_UNION = 4
TOP3_URL_JACCARD = 50.00%
TOP3_DOMAIN_SHARED = 3
TOP3_DOMAIN_UNION = 3
TOP3_DOMAIN_JACCARD = 100.00%
```

The head is highly symmetric by mechanism:

1. JAFO direct connection guide ranks #1 in both.
2. API Master direct connection guide ranks #2 in both.
3. ApiMonster ranks #3 in both, but with mirrored marketplace-specific connector URLs: Ozon in R02, Wildberries in R03.

This is strong evidence for a shared own-ChatGPT connector/integration core.

Additional head metrics:

```text
TOP5_EXACT_URL_SHARED = 2 / UNION 8 / JACCARD 25.00%
TOP10_EXACT_URL_SHARED = 4 / UNION 16 / JACCARD 25.00%
TOP10_DOMAIN_SHARED = 5 / UNION 11 / JACCARD 45.45%
```

After the top three, the two SERPs diverge materially in page-type mix.

## 5. Intent-class comparison

| Primary class | R02 Ozon | R03 Wildberries |
|---|---:|---:|
| Direct own-ChatGPT connection | 4/20 | 3/20 |
| Marketplace integration / AI-agent adjacency | 2/20 | 1/20 |
| Manual seller-data/report analysis | 2/20 | 2/20 |
| Generic ChatGPT seller use | 2/20 | 3/20 |
| Card/content/SEO generation | 7/20 | 10/20 |
| Broad automation boundary | 1/20 | 1/20 |
| Lexical noise | 2/20 | 0/20 |

Combined direct connection + integration/agent:

```text
R02 = 6/20
R03 = 4/20
```

Manual-analysis share is equal at `2/20` each. Wildberries has a substantially heavier content/card/SEO tail (`10/20` vs `7/20`). Ozon has more distinct commercial integration surfaces and two lexical-collision results absent from R03.

## 6. Top-10 composition

R02 top-10:

```text
DIRECT_CONNECTION_OR_INTEGRATION = 6/10
MANUAL_ANALYSIS = 2/10
GENERIC_CHATGPT_SELLER = 1/10
CARD_CONTENT = 1/10
```

R03 top-10:

```text
DIRECT_CONNECTION_OR_INTEGRATION = 4/10
MANUAL_ANALYSIS = 2/10
CARD_CONTENT = 3/10
BROAD_AUTOMATION = 1/10
```

Therefore Ozon wording produces the cleaner connector/integration head after the common top-three core, while Wildberries begins mixing card/content jobs earlier.

## 7. Marketplace-specific depth

R02 scope coding:

```text
CLEARLY_OZON_SPECIFIC_SELLER_RELEVANT = 6/20
DUAL_WB_OZON_SELLER_RELEVANT = 10/20
BROADER_MULTI_MARKETPLACE = 2/20
LEXICAL_NOISE = 2/20
```

R03 scope coding:

```text
CLEARLY_WB_SPECIFIC_OR_WB_ANCHORED_SELLER_RELEVANT = 9/20
DUAL_WB_OZON_SELLER_RELEVANT = 10/20
BROADER_MULTI_MARKETPLACE_OR_GENERIC = 1/20
LEXICAL_NOISE = 0/20
```

Both SERPs contain the same very large `10/20` dual WB+Ozon core. Marketplace-specific depth differs in type:

- Ozon-specific depth includes more commercial integration/connector surfaces.
- WB-specific depth includes more SEO/card/content/tutorial surfaces.

This is meaningful asymmetry in depth, but not enough to overturn the shared mechanism core.

## 8. Relation to historical F1 agent pair

Historical S02/S03 `ии агент` evidence had only 6 shared exact URLs and `11/20` clearly marketplace-specific results on each side, with the accepted verdict `MIXED`.

F2 own-ChatGPT evidence behaves differently:

- the top-three mechanism is more tightly shared between marketplaces;
- exact URL overlap is 8/20-pair rather than 6 in the historical F1 pair;
- domain overlap is 50%;
- a dual-marketplace mechanism core remains 10/20 on each side;
- differences are expressed more strongly in downstream content/integration depth than in the primary connector head.

Therefore F1 and F2 should not be collapsed into one semantic label later, even though they share mechanical/product vocabulary.

## 9. Paired verdict

```text
F2_SHARED_MECHANISM_CORE = STRONG
F2_TOP3_DOMAIN_SYMMETRY = 100_PERCENT
F2_EXACT_URL_JACCARD = 25.00_PERCENT
F2_DOMAIN_JACCARD = 50.00_PERCENT
F2_DUAL_MARKETPLACE_CORE_R02 = 10/20
F2_DUAL_MARKETPLACE_CORE_R03 = 10/20
F2_MARKETPLACE_DEPTH_DIFFERS = YES
F2_MATERIALLY_ASYMMETRIC_AT_CORE = NO
F2_PAIRED_VERDICT = F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH
```

This verdict means: the own-ChatGPT mechanism is a shared marketplace job, while Ozon and Wildberries produce meaningful marketplace-specific supporting depth and contamination patterns.

It does **not** mean one generic final page must be used, and it does **not** authorize separate Ozon/WB pages. Final page ownership remains deferred to collection freeze, semantic clustering and page-role analysis.

## 10. Information-saturation decision

The named F2 ordinary-Search questions are now answered:

1. Generic own-AI connection intent is real — R01.
2. Explicit Ozon naming sharpens toward seller-data/connector integration — R02.
3. Explicit Wildberries naming confirms the same core but with a more content-heavy downstream mix — R03.
4. Ozon/WB symmetry versus divergence has been quantitatively measured.
5. Further synonym chasing would mainly repeat already-observed connector, manual-analysis and card/content surfaces without a named unresolved decision.

```text
MORE_F2_SEARCH_NOW = NO
F2_ORDINARY_SEARCH_INFORMATION_SATURATED = YES
R01_R03_F2_BLOCK = CLOSED_FOR_CURRENT_M3_PASS
```

This is a stop-at-information-saturation decision, not a claim that all F2 demand or all Search results have been exhaustively enumerated.

## 11. Next stage cursor

Proceed to **R04 pre-step only**:

`R04 = аналитика маркетплейсов для селлеров`

R04 is a different decision family (F3/F9): seller-owned analytics versus external-market intelligence, service discovery, education/profession and other analytics meanings.

Before any R04 provider action, Main Chat must perform fresh query-specific research/release, source-to-method trace, capability/boundary reconciliation, Work-trigger evaluation, persistence plan and owner-facing disclosure.

```text
R04_PROVIDER_ACTION = BLOCKED UNTIL R04 PRE-STEP PASS
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
FINAL_F2_PAGE_OWNERSHIP = BLOCKED UNTIL LATER CLUSTERING/PAGE-ROLE STAGES
```
