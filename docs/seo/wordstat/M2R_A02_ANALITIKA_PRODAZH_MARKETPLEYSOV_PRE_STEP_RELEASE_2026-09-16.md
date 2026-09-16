# M2R-A02 pre-step research and query release — `аналитика продаж на маркетплейсах`

Date: 2026-09-16.
Stage: `M2R — seller analytics/report demand reacquisition`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is the bridge that turns the user's chosen supported AI into a marketplace employee; it is not the AI employee itself.
- M2R-A01 `аналитика маркетплейсов`: CLOSED / high information gain.
- A01 provider result: totalCount 4290; 162 direct rows; all rows reviewed.
- A01 exposed a material seller-task branch, including `аналитика продаж на маркетплейсах` = 138, `аналитик продаж маркетплейсов` = 188, product/data/internal/query/finance/price analytics variants.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A02`

`QUERY_TEXT = аналитика продаж на маркетплейсах`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map the search-language surface specifically around **seller sales analytics**, separating seller-owned operational/reporting needs from external market/niche intelligence and from analyst-profession/education intent.

Need to discover whether users naturally express needs around:

- sales dynamics;
- orders / buyouts / cancellations / returns;
- revenue / profit / margin / unit economics;
- conversion / funnel / CTR;
- stocks / turnover;
- product/card performance;
- regional sales;
- advertising-to-sales efficiency;
- seller reports / dashboards / services;
- Ozon/Wildberries variants;
- education / human analyst noise.

## 4. Why existing evidence is insufficient

A01 proves the broad analytics market and exposes the sales branch, but only 17/162 direct rows were classified as seller-task analytics. A01 was not centered on sales, reports, profit, funnel, returns, stocks or unit economics.

Historical M2 used `сервис аналитика продаж на маркетплейсах` = 39 and `сервис для аналитики продаж на маркетплейсах` = 19, which forced `сервис` into the wording and produced a narrow service-oriented branch.

A02 removes the `сервис` constraint and follows the stronger A01 child `аналитика продаж на маркетплейсах` = 138.

## 5. Fresh external method / market research — 2026-09-16

### Yandex Wordstat.GetTop

Source: https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current docs confirm GetTop returns last-30-days popular queries containing the phrase plus similar queries, with up to 2000 response phrases.

Method consequence: use as broad branch discovery; persist full results/associations before classification.

### Wildberries seller analytics / sales reports

Sources:

- https://seller.wildberries.ru/instructions/ru/ru/subcategory/seller-analytics
- https://seller.wildberries.ru/instructions/ru/am/material/daily-dynamics-and-sales-analysis-report
- https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current WB documentation exposes seller analytics and report families including sales funnel, weekly sales analysis, income/expense indicators, profit calculator, regional sales, brand share, stock reports, returns and other seller reports.

Product consequence: sales/report analytics is a genuine seller job, not merely external market intelligence.

### Ozon seller/API analytics capability

Source: https://seller.ozon.ru/media/boost/kak-upravlyat-ochen-bolshim-assortimentom-na-ozon-s-pomoshyu-api/

Ozon's seller material documents Seller API as able to export financial and analytical reporting and send data into analytics systems for a fuller sales picture. This source is older than the current 2026 WB pages, so it is capability corroboration only; endpoint-level current authority remains the project's Swagger/API audit.

## 6. Information-gain contract

A02 must add information beyond A01 by:

1. expanding seller-owned sales/report language;
2. discovering finance/profit/margin/unit-economics wording;
3. exposing funnel/conversion/order/buyout/return/stock vocabulary;
4. detecting advertising-efficiency crossovers;
5. finding marketplace-specific Ozon/WB sales-analytics variants;
6. separating service/tool search from human analyst jobs and training;
7. identifying targeted follow-up seeds for reports/finance/stock/returns if material.

## 7. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response. Then review every direct row and useful association and provisionally classify into:

- SALES_ORDERS_REVENUE;
- PROFIT_MARGIN_UNIT_ECONOMICS;
- FUNNEL_CONVERSION;
- STOCK_TURNOVER;
- RETURNS_CANCELLATIONS;
- PRODUCT_CARD_PERFORMANCE;
- AD_TO_SALES_ANALYTICS;
- REPORT_TOOL_SERVICE;
- MARKETPLACE_SPECIFIC;
- EXTERNAL_MARKET_INTELLIGENCE;
- HUMAN_ROLE_EDU;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly; applies only to exact request form and cannot erase A01 evidence.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 8. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `аналитика продаж на маркетплейсах`;
- numPhrases: `2000`;
- region: `225`;
- devices: `DEVICE_ALL`.

Maximum depth is intentional because quality/completeness is the priority and cost is not a decision gate.

## 9. Stop / reopen

One provider execution identity at a time. After full persistence/readback/analysis:

- release separate targeted probes for report/finance/stock/returns/ad branches when material;
- do not infer page count from phrase count;
- continue until family-level information saturation.

## 10. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A02_ANALITIKA_PRODAZH_MARKETPLEYSOV_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 11. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED`.

A02 is one bounded Wordstat branch. Work becomes preferred if multiple M2R family ledgers require cross-family full-volume dedup/classification or independent deep QA.

## 12. Downstream decision

A02 does not create a page. It determines which seller sales/report subfamilies deserve more Wordstat acquisition and later representative SERP verification.

## 13. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Product-truth alignment | 10.0 |
| Seller-vs-market boundary | 10.0 |
| Failure/zero semantics | 10.0 |
| Depth/completeness contract | 10.0 |
| Work/resource rule compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 14. Release verdict

```text
M2R_A02_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A02 = 0
```
