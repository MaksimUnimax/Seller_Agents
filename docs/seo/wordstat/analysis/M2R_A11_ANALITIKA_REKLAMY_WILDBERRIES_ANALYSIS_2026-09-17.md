# M2R-A11 analysis — `аналитика рекламы wildberries`

Date: 2026-09-17.
Status: `ANALYZED / TOTALCOUNT-ONLY RESULT`.
Raw authority: `../raw/M2R_A11_ANALITIKA_REKLAMY_WILDBERRIES_RESULT_2026-09-17.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `15`;
- `results[]`: absent;
- `associations[]`: absent;
- requested depth: `2000`;
- no provider failure.

This is **not** `result:{}` and not numeric zero. It is a successful `totalCount`-only response for the exact query family.

## 2. What A11 proved

The exact compound `аналитика рекламы wildberries` exists (`totalCount=15`) but is not a productive discovery root in Wordstat.

Combined with A10:

- generic `аналитика рекламы маркетплейсов` -> totalCount `33`, only one direct row;
- WB-specific `аналитика рекламы wildberries` -> totalCount `15`, no direct/association arrays.

Therefore the advertising family should not be abandoned; instead discovery must move to the **concrete seller metric / task language** that current WB documentation and current 2026 market content actually use.

## 3. Fresh routing evidence — 2026-09-17

Wildberries official/current material uses `ДРР` as a first-class seller advertising metric:

- WB Pro article published 12.06.2026 defines ДРР as the percentage of order revenue invested in advertising;
- it explicitly says sellers use ДРР to track advertising efficiency, compare campaign types and allocate budget;
- WB distinguishes `ДРР` for WB Media from `доля затрат` for WB Promotion.

Source:

- https://pro.wildberries.ru/insight/3D1cDmllZKqdNDJlcNHd6jHYZqq/3D1cJO4EKvo1OlSzgbpQiXpjENo

Current 2026 market language repeatedly uses the exact form `ДРР на Wildberries` / `drr вайлдберриз`, with user jobs around formula, norm, reduction, campaign profitability and comparison with margin.

Examples:

- https://wbaiprofit.ru/guides/drr-wildberries/
- https://mpmgr.ru/blog/analytics/drr-kak-schitat
- https://rmagent.ru/articles/analitika-reklamy-wildberries-kak-schitat-drr-i-okupaemost-po-kampaniyam
- https://esstats.ru/blog/drr-wb

## 4. Product consequence

The advertising acquisition opportunity is increasingly likely to be **metric-first**, not category-label-first.

Relevant Octoport job:

`user's chosen AI + WB advertising/sales data -> calculate/explain DRR, compare campaigns/products, diagnose waste and relate ad spend to profit/margin`.

Boundary remains strict:

- analytics/diagnostics/recommendations = core-adjacent;
- continuous automatic bid management / bidder / autobidder = separate category and not counted as core demand merely because it mentions ads.

## 5. Next query decision

Next query:

`дрр wildberries`

Why:

1. two category-style roots were weak/non-expansive;
2. `ДРР` is current official WB seller terminology;
3. current 2026 market pages repeatedly use the exact WB-specific phrase;
4. it can expose calculation, norm, reduction, profitability, campaign and cost language;
5. it can also expose bidder/automation contamination, which must be classified as boundary evidence;
6. it is a concrete seller metric analogous to the finance-family pivot from `финансовая аналитика` to `юнит экономика` / `прибыль` / `маржинальность`.

A paired Ozon advertising-analysis/metric probe remains required later; A12 is not a substitute for Ozon evidence.

## 6. Work decision

`WORK_NOW = NOT REQUIRED` for A11 itself because there are no phrase arrays to reconcile.

The cumulative M2R corpus continues to grow. After WB/Ozon advertising metric acquisition and one or two remaining major product-task families, proactive Work reconciliation should be triggered if it improves full-volume cross-family QA.

## 7. Quality score

| Criterion | /10 |
|---|---:|
| Correct totalCount-only handling | 10.0 |
| No zero/empty conflation | 10.0 |
| Cross-query interpretation | 10.0 |
| Fresh official terminology support | 10.0 |
| Current market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Autobidder boundary discipline | 10.0 |
| Information-gain routing | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 8. Verdict

```text
M2R_A11 = CLOSED
WORDSTAT_RESULT_TYPE = TOTALCOUNT_ONLY
TOTALCOUNT = 15
CATEGORY_LABEL_DISCOVERY = WEAK / NON-EXPANSIVE
ADVERTISING_JOB = STILL VALID
NEXT_QUERY = дрр wildberries
OZON_PAIRED_AD_PROBE = STILL REQUIRED LATER
```
