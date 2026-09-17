# R08 full export analysis — `аналитика рекламы маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F6 advertising-analysis boundary`.  
Job: `octoport-serp-r08-20260917`.  
Operation: `sprvt6p3aq5uj96uqs0b`.  
Revision: `5`.  
Status: **PASS / ALL 20 RESULTS REVIEWED / R08 CLOSED FOR CURRENT M3 PASS, SUBJECT TO DURABLE READBACK**.

Raw/export authority: `../raw/R08_06_EXPORT_MANIFEST_2026-09-17.md`.

## 1. Export QA

```text
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
SOURCE_SHA256 = b90dd63cd9b492e09e6e4dbdd5d8cf6b9b877d4ea16678637822445cacb0fba2
```

No result was sampled or omitted. The entire normalized top-20 was reviewed against the R08 pre-step boundary.

## 2. Evidence-driven umbrella classes

The pre-step expected seller-owned ad analytics, cross-marketplace ad SaaS, external-traffic analytics, automation, agencies, competitor intelligence, content/education and noise. The observed SERP also contains a large broader marketplace-analytics layer in which advertising is present or adjacent but not the dominant page framing. To avoid forcing rows into narrower categories, the first-pass non-overlapping umbrella coding is:

- `DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL`;
- `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS`;
- `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING`;
- `EDITORIAL_GUIDE_OR_COMPARISON`.

## 3. All-20 result coding

| Rank | Domain / surface | Primary class | Observable job / boundary |
|---:|---|---|---|
| 1 | mayak.bz | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | sales/statistics/stock analytics; ads not dominant in observed result |
| 2 | tablichki.tech | `DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL` | internal marketplace advertising analytics; spend/clicks/orders/profit and organic-vs-paid view |
| 3 | mpboost.pro | `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS` | analytics + marketplace advertising/promotion + reputation |
| 4 | yoolip.ai | `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS` | Ozon sales + advertising + unit economics/finance dashboard |
| 5 | mpstats.io / analytics | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | broad sales/competitor/niche analytics |
| 6 | mpstats.io / platform | `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS` | broad seller platform explicitly including advertising management |
| 7 | mpstats.io / chrome-plugin | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | browser analytics for sales/prices; advertising not dominant |
| 8 | mpstats.io / ads-analytics | `DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL` | external advertising/traffic to marketplace cards and advertising-post intelligence |
| 9 | partner.market.yandex.ru | `EDITORIAL_GUIDE_OR_COMPARISON` | marketplace campaign-effectiveness article / metric education |
| 10 | jvo.ru | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | broad marketplace product/business management and analytics |
| 11 | klerk.ru | `EDITORIAL_GUIDE_OR_COMPARISON` | comparison/list of marketplace analytics services |
| 12 | sellmonitor.com | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | broad analytics/promotion/competitor strategy |
| 13 | finance.ozon.ru | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | seller sales/product/profitability analytics; ads not dominant |
| 14 | limescope.ru | `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS` | sales/profit/advertising/stock/cost dashboard across marketplaces |
| 15 | marpla.ru | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | WB product/card/sales analytics |
| 16 | saby.ru | `EDITORIAL_GUIDE_OR_COMPARISON` | advertising metrics/CTR/CPC/CPM/CR/CPO/DRR/ROMI educational article |
| 17 | moysklad.ru | `EDITORIAL_GUIDE_OR_COMPARISON` | broad marketplace analytics guide/service comparison |
| 18 | mpfact.ru | `MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS` | WB/Ozon financial analytics explicitly including advertising spend, ROI and Ozon ad analytics |
| 19 | rask.pro | `BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING` | broad management analytics/reports/dashboards |
| 20 | torgstat.ru | `DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL` | advertising analytics plus automation in marketplace operations |

## 4. Aggregate intent mix

```text
DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL = 3/20 = 15%
MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS = 5/20 = 25%
BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING = 8/20 = 40%
EDITORIAL_GUIDE_OR_COMPARISON = 4/20 = 20%

AD_EXPLICIT_COMMERCIAL_SOFTWARE = 8/20 = 40%
COMMERCIAL_SOFTWARE_OR_SERVICE_SURFACES = 16/20 = 80%
EDITORIAL_GUIDE_OR_COMPARISON = 4/20 = 20%
```

Top-10:

```text
DIRECT_AD_ANALYTICS_OR_MANAGEMENT_TOOL = 2/10
MIXED_MARKETPLACE_SUITE_WITH_EXPLICIT_AD_ANALYTICS = 3/10
BROAD_MARKETPLACE_ANALYTICS_WITHOUT_AD_DOMINANT_FRAMING = 4/10
EDITORIAL_GUIDE_OR_COMPARISON = 1/10
```

## 5. What R08 actually proves

`аналитика рекламы маркетплейсов` is a real seller advertising-analysis acquisition intent, but it is not a clean one-page-type SERP. Search mixes:

- dedicated advertising-analysis/management tools;
- broader seller suites where advertising analytics is one important module;
- generic marketplace analytics platforms;
- educational/comparison content.

The direct/mixed ad-software layer is material (`8/20`, including `5/10` in the top ten), so advertising analytics is not merely incidental wording. At the same time, broad analytics occupies the largest single umbrella class (`8/20`), which means the phrase cannot safely be equated with only native campaign dashboards or only one advertising channel.

The observed result also proves a genuine external-traffic boundary: MPSTATS rank 8 explicitly covers external advertising driving traffic to marketplace cards. Therefore later semantic ownership must distinguish seller-owned marketplace campaign diagnostics from external-traffic analysis where the product truth requires it.

## 6. Relation to R04 and product truth

R04 proved that broad `аналитика маркетплейсов для селлеров` mixes seller-owned operations with external/mixed market intelligence. R08 narrows the job enough to expose a substantial advertising-specific software layer while preserving overlap with broad analytics.

For Octoport this supports advertising-analysis vocabulary only inside confirmed product/API authority: read/analyze/explain/diagnose/recommend over authorized seller data. Competitor claims about campaign management, automation or bid control do not authorize Octoport write actions.

## 7. Marketplace-specific control decision

The generic top-20 resolves the current M3 question sufficiently:

- an advertising-analysis user job exists;
- its main collision is broad marketplace analytics, not a hidden human-agency-dominated intent;
- external traffic is a real neighboring meaning and is now explicitly identified;
- no decision-changing WB-vs-Ozon divergence is exposed that justifies spending two more Search calls now.

Therefore:

```text
R08_MORE_F6_SEARCH_NOW = NO
R08_MARKETPLACE_SPECIFIC_PAIR = HOLD
R08_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R08_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
```

A marketplace-specific control may be reopened later only from a concrete gap register, not automatically.

## 8. M4 seeds from R08

Recurring/decision-relevant commercial surfaces worth carrying into the later M4 cross-query competitor registry include, without yet promoting them to final competitors:

- MPSTATS;
- Tablichki;
- Yoolip;
- LimeScope;
- MPfact;
- Torgstat;
- Mayak;
- Sellmonitor.

M4 registry authority still depends on reconciliation across the complete M3 corpus.

## 9. R08 verdict

```text
R08_VERDICT = DISTINCT_AD_ANALYTICS_JOB_WITH_MIXED_BROAD_ANALYTICS_SERP_AND_SUFFICIENT_BOUNDARY_RESOLUTION
R08_DIRECT_AD_TOOL = 3/20
R08_MIXED_SUITE_WITH_AD_ANALYTICS = 5/20
R08_BROAD_ANALYTICS = 8/20
R08_EDITORIAL = 4/20
R08_AD_EXPLICIT_COMMERCIAL_SOFTWARE = 8/20
R08_TOP10_AD_EXPLICIT_SOFTWARE = 5/10
R08_MORE_F6_SEARCH_NOW = NO
R08_MARKETPLACE_SPECIFIC_PAIR = HOLD
R08_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R08_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R08 = CLOSED FOR CURRENT M3 PASS AFTER DURABLE READBACK
```

This is a representative first-page observation for the exact generic formulation at this collection time; it does not prove that every narrower Ozon/WB advertising query has identical composition.

## 10. Next-query consequence

After durable persistence/readback closes R08, the next matrix candidate is:

`R09 — поисковые запросы wildberries для продавца`

R09 must receive its own query-specific pre-step/release before any provider call. No R09 `start` is permitted merely because R08 analysis exists locally.
