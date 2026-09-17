# R09 full export analysis — `поисковые запросы wildberries для продавца`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F7 seller search-analytics boundary`.  
Job: `octoport-serp-r09-20260917`.  
Operation: `sprut2nra25h2lmi10hv`.  
Revision: `5`.  
Status: **PASS / ALL 20 RESULTS REVIEWED / R09 CLOSED FOR CURRENT M3 PASS, SUBJECT TO DURABLE READBACK**.

Raw/export authority: `../raw/R09_05_EXPORT_MANIFEST_2026-09-17.md`.

## 1. Export QA

```text
SCHEMA = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
JOB_ID = octoport-serp-r09-20260917
REVISION = 5
TOTAL_ITEMS = 1
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
SOURCE_BYTES = 88032
SOURCE_SHA256 = 81fddff80beb249939fba76d87334b1926a4978d846b555ba32bbd277d221e5c
```

No result was sampled or omitted. The complete normalized top-20 plus raw provider payload was inspected.

## 2. Evidence-driven coding

The pre-step expected seller-owned search reports, marketplace-wide demand, third-party SEO/keyword tools, external competitor intelligence, buyer navigation, seller education/card SEO, niche analysis and noise.

The observed SERP is strongly seller-side, but the dominant page framing is **SEO/keyword/card optimization education**, not a pure analytics-report SERP.

Non-overlapping primary coding:

- `SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS`;
- `MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS`;
- `THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL`;
- `EXTERNAL_MARKET_OR_COMPETITOR_SEARCH_INTELLIGENCE`;
- `BUYER_SEARCH_NAVIGATION_OR_CONSUMER_HELP`;
- `SELLER_EDUCATION_OR_CARD_SEO_GUIDE`;
- `NICHE_ANALYSIS_WITH_SEARCH_QUERY_COMPONENT`;
- `NOISE_OTHER_INTENT`.

## 3. All-20 result coding

| Rank | Domain / surface | Primary class | Observable job / boundary |
|---:|---|---|---|
| 1 | sellermoon.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Seller-facing guide: uses WB cabinet's popular-search-query analytics to select keywords; primarily educational/card-SEO framing. |
| 2 | seller.wildberries.ru | MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS | Official WB seller report `Поисковые запросы на WB`; marketplace-wide buyer-query demand/report surface. |
| 3 | mpmgr.ru | THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL | Commercial MP Manager surface: analyzes real search queries/keywords and orders, plus external sources; third-party keyword/search tool. |
| 4 | dev.wildberries.ru | SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS | Official WB developer/API surface for `Поисковые запросы по вашим товарам`; direct own-product seller search analytics. |
| 5 | mpstats.io | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | MPSTATS media article about selecting keywords and raising card visibility; educational SEO framing. |
| 6 | mpmgr.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | MP Manager article explains WB search analytics and the two report tabs; educational/hybrid guide rather than a pure report landing. |
| 7 | reklama.tochka.com | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Tochka article on finding WB keywords, query statistics, Wordstat and popular phrases; seller SEO education. |
| 8 | vc.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | vc.ru article about query clusters/presets and demand frequency for WB promotion; seller SEO education. |
| 9 | sellermoon.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | SELLER MOON guide about where to put keywords in a WB card; card SEO/optimization education. |
| 10 | marpla.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Marpla guide on finding WB keywords with Wordstat and using them in descriptions/characteristics; card SEO education. |
| 11 | sellego.com | EXTERNAL_MARKET_OR_COMPETITOR_SEARCH_INTELLIGENCE | Sellego content explicitly analyzes missed queries via competitor article comparisons; external competitor-search intelligence. |
| 12 | marketguru.io | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | MarketGuru blog about WB keyword frequency and selection; seller SEO education. |
| 13 | wildcrm.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | WildCRM article on detecting search queries and optimizing cards for them; seller SEO education. |
| 14 | reklama.tochka.com | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Tochka article about WB ranking algorithms and query selection; seller SEO/ranking education. |
| 15 | vc.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | vc.ru SEO guide; references seller cabinet's popular search queries to collect keywords; seller education. |
| 16 | sellmonitor.com | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Sellmonitor SEO guide on collecting keywords and configuring WB card SEO; seller education. |
| 17 | sellermoon.ru | THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL | SELLER MOON online `Подбор запросов` tool supports WB/Ozon and competitor-card inputs; third-party keyword/search tool. |
| 18 | allo.tochka.com | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | Tochka SEO-promotion guide; explains WB Analytics search queries and card ranking/optimization; seller education. |
| 19 | sellermoon.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | SELLER MOON SEO guide; uses official popular-query tool and Wordstat for card optimization; seller education. |
| 20 | datamp.ru | SELLER_EDUCATION_OR_CARD_SEO_GUIDE | DataMP guide about selecting search queries for card optimization; seller education. |

## 4. Aggregate intent mix

```text
SELLER_EDUCATION_OR_CARD_SEO_GUIDE = 15/20 = 75%
THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL = 2/20 = 10%
MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS = 1/20 = 5%
SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS = 1/20 = 5%
EXTERNAL_MARKET_OR_COMPETITOR_SEARCH_INTELLIGENCE = 1/20 = 5%
BUYER_SEARCH_NAVIGATION_OR_CONSUMER_HELP = 0/20 = 0%
NICHE_ANALYSIS_WITH_SEARCH_QUERY_COMPONENT = 0/20 = 0%
NOISE_OTHER_INTENT = 0/20 = 0%
```

Top-10:

```text
SELLER_EDUCATION_OR_CARD_SEO_GUIDE = 7/10
THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL = 1/10
MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS = 1/10
SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS = 1/10
```

Derived seller-side share:

```text
SELLER_SIDE_RELEVANT_OR_ADJACENT = 20/20
BUYER_NAVIGATION = 0/20
DIRECT_OFFICIAL_ANALYTICS_REPORT_OR_API = 2/20
SEO_EDUCATION_OR_KEYWORD_TOOL = 17/20
EXTERNAL_COMPETITOR_SEARCH_INTELLIGENCE = 1/20
```

## 5. What R09 actually proves

The exact phrase `поисковые запросы wildberries для продавца` is **not buyer-navigation intent** in the observed top-20. Every result is seller-facing or seller-adjacent.

However, the dominant live interpretation is not “open a seller search-report dashboard.” Instead, Yandex overwhelmingly maps the query to:

- selecting keywords/search queries for a WB product card;
- understanding frequency/popularity and ranking;
- SEO/card optimization;
- using seller-cabinet analytics or third-party tools as inputs to that optimization.

The seller-owned report/API job is real and directly visible through the official WB API result at rank 4. Marketplace-wide query-demand analytics is also directly visible through the official WB seller report at rank 2. But together these direct official analytics surfaces are only `2/20`; the broader acquisition language is dominated by SEO/keyword education and tools (`17/20`).

Therefore the R09 wording is useful evidence for a seller search/SEO job, but it must **not** be treated as a clean acquisition synonym for “seller-owned search-report analytics.”

## 6. Product-truth implication for Octoport

For Octoport, R09 supports the following bounded seller job:

- let the user's chosen AI inspect or explain confirmed WB search-query/search-performance data where the authorized source/API exposes it;
- help interpret query positions, visibility, transitions, orders/conversion and related card-search performance;
- help reason about card/search optimization from confirmed seller data.

R09 does **not** authorize these stronger claims:

- complete external competitor keyword intelligence;
- automatic rewriting/editing of cards in launch scope;
- marketplace-wide data fields that are not confirmed available to Octoport through permitted APIs;
- guaranteed ranking improvement;
- autonomous SEO mutation.

The observed SEO-heavy SERP is a demand/intent signal, not capability authority.

## 7. R09 -> R10 boundary

R09 and R10 remain distinct.

R09 shows a strong query/keyword/card-SEO interpretation, with only a small direct-report layer. R10 (`анализ ниш wildberries для продавца`) asks a broader market/niche-data question and must test whether Search expects first-party WB niche analysis or MPStats-like external intelligence.

Nothing in R09 justifies merging niche analysis into search-query/card SEO.

```text
R09_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R09_MORE_SEARCH_NOW = NO
R09_BUYER_NAVIGATION_COLLISION = NO
R09_DIRECT_OFFICIAL_ANALYTICS_LAYER = REAL_BUT_MINOR_IN_SERP
R09_DOMINANT_SERP = SELLER_SEO_KEYWORD_CARD_OPTIMIZATION
R09_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R10_REMAINS_NEEDED = YES
```

## 8. M4 seeds from R09

Decision-relevant recurring/commercial surfaces to carry into later competitor reconciliation, without promoting them to final competitors yet:

- SELLER MOON;
- MP Manager;
- MPSTATS;
- Sellego;
- MarketGuru;
- WildCRM;
- Sellmonitor;
- Marpla;
- DataMP;
- Tochka marketplace SEO surfaces.

The official WB seller/help and developer/API results remain authority/reference surfaces, not ordinary competitors.

## 9. R09 verdict

```text
R09_VERDICT = SELLER_SIDE_SEARCH_QUERY_INTENT_CONFIRMED_BUT_SERP_DOMINATED_BY_SEO_KEYWORD_CARD_OPTIMIZATION_NOT_PURE_REPORT_ANALYTICS
R09_SELLER_EDUCATION_OR_CARD_SEO_GUIDE = 15/20
R09_THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL = 2/20
R09_MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS = 1/20
R09_SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS = 1/20
R09_EXTERNAL_COMPETITOR_SEARCH_INTELLIGENCE = 1/20
R09_BUYER_SEARCH_NAVIGATION = 0/20
R09_NICHE_ANALYSIS = 0/20
R09_NOISE = 0/20
R09_SELLER_SIDE_RELEVANT_OR_ADJACENT = 20/20
R09_DIRECT_OFFICIAL_ANALYTICS_REPORT_OR_API = 2/20
R09_SEO_EDUCATION_OR_KEYWORD_TOOL = 17/20
R09_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R09_MORE_SEARCH_NOW = NO
R09_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R10_REMAINS_NEEDED = YES
R09 = CLOSED FOR CURRENT M3 PASS AFTER DURABLE READBACK
```

This is a first-page observation for the exact R09 formulation at this collection time. It does not prove that narrower report names or other seller-query formulations have the same composition.

## 10. Next-query consequence

After durable persistence/readback closes R09, the next matrix candidate remains:

`R10 — анализ ниш wildberries для продавца`

R10 still requires its own fresh query-specific pre-step/release before any provider call. No R10 `start` is released by this artifact.
