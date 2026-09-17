# M2R-A12 pre-step research and query release — `дрр wildberries`

Date: 2026-09-17.
Stage: `M2R — concrete advertising metric discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- Finance/profit family A06-A09: sufficiently saturated for M2R.
- A10 `аналитика рекламы маркетплейсов`: CLOSED / totalCount 33 / one direct row / weak discovery root.
- A11 `аналитика рекламы wildberries`: CLOSED / totalCount 15 / no phrase arrays / weak marketplace-specific category label.
- Advertising analysis/help remains undercovered despite strong current marketplace capability evidence.
- Two category-label probes being non-expansive creates a clear pivot to metric/task language.
- Autobidder / continuous bid-management remains a boundary family, not core Octoport demand.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A12`

`QUERY_TEXT = дрр wildberries`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map how Wildberries sellers search around the concrete advertising-efficiency metric **ДРР**, and determine whether that language exposes a more useful advertising-analysis family than generic `аналитика рекламы` wording.

Need to discover whether users naturally search for:

- ДРР / доля рекламных расходов;
- how to calculate DRR;
- normal/target DRR;
- how to reduce DRR;
- campaign/product-level DRR;
- advertising profitability / payback;
- spend / revenue / margin crossover;
- statistics/reports/services/calculators;
- campaign optimization/diagnostics;
- bidder/autobidder/automatic stake-management intent;
- education/content noise.

## 4. Why existing evidence is insufficient

A10 and A11 tested category labels and were both weak/non-expansive:

- `аналитика рекламы маркетплейсов` -> totalCount 33, one direct row;
- `аналитика рекламы wildberries` -> totalCount 15, no arrays.

This does not match the rich current WB advertising-statistics vocabulary visible in official seller materials. Therefore the next query must follow current seller terminology rather than another abstract category synonym.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract supports up to 2000 phrase results and returns last-30-days phrase-containing/similar-query evidence.

Method consequence: use `дрр wildberries` as concrete metric discovery; persist full provider output before interpretation.

### Wildberries official/current DRR terminology

Source:

https://pro.wildberries.ru/insight/3D1cDmllZKqdNDJlcNHd6jHYZqq/3D1cJO4EKvo1OlSzgbpQiXpjENo

Published 12.06.2026. Wildberries explicitly defines:

- `ДРР` = доля рекламных расходов;
- percentage of order revenue invested in advertising;
- use for tracking advertising efficiency over time;
- use for comparing campaign types;
- use for budget allocation;
- distinction between `ДРР` for WB Media and `доля затрат` for WB Promotion.

This is direct current seller-language evidence.

### Current 2026 market-language evidence

Current seller-focused pages repeatedly use `ДРР на Wildberries` / `drr вайлдберриз` and cover formula, norm, reduction, campaign profitability and comparison with margin:

- https://wbaiprofit.ru/guides/drr-wildberries/ — updated 25.08.2026;
- https://mpmgr.ru/blog/analytics/drr-kak-schitat — 14.06.2026;
- https://rmagent.ru/articles/analitika-reklamy-wildberries-kak-schitat-drr-i-okupaemost-po-kampaniyam — 07.07.2026;
- https://esstats.ru/blog/drr-wb — 18.06.2026;
- https://kartochka.me/blog/drr-na-wildberries — 27.07.2026.

These establish live market terminology; they do not create final SEO page ownership or override product truth.

## 6. Source -> method trace

| Question | Source | A12 use | Boundary |
|---|---|---|---|
| Can GetTop expand concrete metric language? | Yandex Wordstat.GetTop | max-depth phrase discovery | demand/language only, not page proof |
| Is ДРР current official WB seller terminology? | WB Pro 2026 | justify metric-first pivot | launch remains analysis/read-only |
| Do sellers/current market use `ДРР на Wildberries` language? | current 2026 seller pages | justify exact query and likely subjobs | market content != final page authority |

## 7. Information-gain contract

A12 must add information beyond A10/A11 by:

1. testing concrete WB ad-efficiency language instead of category labels;
2. discovering calculate/norm/reduce/compare wording;
3. exposing campaign/product/report/statistics subjobs;
4. detecting profit/margin/unit-economics crossover;
5. identifying service/tool/calculator demand;
6. separating analysis/diagnostics from bidder/autobidder automation;
7. determining whether DRR deserves later representative SERP verification;
8. informing the later paired Ozon advertising probe.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Review every direct row and materially useful association into provisional buckets:

- DRR_CORE;
- DRR_CALCULATION;
- DRR_NORM_BENCHMARK;
- DRR_REDUCTION_OPTIMIZATION;
- CAMPAIGN_PRODUCT_DRR;
- AD_PROFITABILITY_PAYBACK;
- SPEND_REVENUE_MARGIN_CROSSOVER;
- REPORT_STATISTICS_TOOL;
- CALCULATOR_TEMPLATE;
- SERVICE_ANALYTICS;
- AUTOBIDDER_BID_MANAGEMENT;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

`AUTOBIDDER_BID_MANAGEMENT` remains boundary evidence and is not counted as core demand merely because it concerns DRR/ads.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert to zero and do not erase the advertising task proven by current official seller sources.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `дрр wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the quality-first owner rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- run the paired Ozon advertising probe regardless of A12 size unless new evidence proves no material information gain;
- expand calculator/norm/optimization/report branches only when they add a named decision value;
- keep bidder/autobidder language separate;
- no page decision from raw counts;
- continue until the advertising family reaches useful coverage saturation.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A12_DRR_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

The cumulative M2R corpus is now large enough that after WB/Ozon advertising metric acquisition and remaining major task-family collection, proactive Work reconciliation should be strongly considered for full-volume cross-family dedup/classification and adversarial QA. Resource economy is not a reason to defer it.

## 13. Downstream decision

A12 does not create a page. It tests whether current metric-first WB advertising language is a meaningful acquisition route and which ad subjobs deserve later SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A10/A11 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB terminology | 10.0 |
| Current 2026 market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Autobidder boundary control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A12_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A12 = 0
OZON_PAIRED_AD_PROBE = STILL REQUIRED AFTER A12
```
