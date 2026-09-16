# M2R-A05 pre-step research and query release — `отчеты продаж маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — task-qualified seller report discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- A01 `аналитика маркетплейсов`: CLOSED / high information gain.
- A02 `аналитика продаж на маркетплейсах`: CLOSED / real but lexically narrow.
- A03 `отчеты маркетплейсов`: CLOSED / large but accounting/1C-heavy.
- A04 `отчеты для селлеров`: CLOSED / seller qualifier did not clean the accounting/tax ambiguity; only 2 direct rows.
- Generic report discovery is saturated enough; next report probes must be task-qualified.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A05`

`QUERY_TEXT = отчеты продаж маркетплейсов`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map seller-operational **sales-report** language without the generic accounting contamination of `отчеты маркетплейсов` and without forcing `аналитика` into the phrase.

Need to learn whether this branch exposes:

- seller sales reports;
- revenue / buyouts / cancellations / returns;
- weekly realization / sales dynamics;
- product/card performance;
- region/channel breakdowns;
- financial crossover;
- stock/logistics crossover;
- advertising-to-sales reporting;
- Ozon/Wildberries-specific report terminology;
- report parsers/services;
- residual 1C/accounting/tax intent.

## 4. Why existing evidence is insufficient

A03 exposed `отчеты продаж маркетплейсов` = 448, making it the strongest task-qualified seller-report child under the broad report root.

A02 tested `аналитика продаж на маркетплейсах` = 138 but returned only 7 direct rows and did not expose the underlying report language. Therefore `отчеты продаж ...` has orthogonal information value: users may search the artifact/report rather than the analytical category.

A04 showed that `для селлеров` alone is too ambiguous and tax-associated, so the task word `продаж` is the correct refinement.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Use: last-30-days phrase/similar-query discovery at up to 2000 phrases. Wordstat evidence remains demand/language evidence, not page proof.

### Wildberries official seller analytics

https://seller.wildberries.ru/instructions/en/ru/material/sellers-analytics

Current seller analytics includes `Воронка продаж` and `Лента заказов`; the sales funnel tracks buyer actions through purchase and exposes period comparison.

### Wildberries official report families

https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current report list includes weekly sales analysis, income/expense indicators, profit calculator, regional sales, consolidated seller report, stock, returns/movements and unit economics.

### Wildberries weekly realization reports

https://seller.wildberries.ru/instructions/ru/am/material/A-13

Current documentation states that weekly realization reports contain sales and movement-of-funds information and are found under financial reports.

Method consequence: `отчеты продаж маркетплейсов` is grounded in a real seller workflow and should be tested separately from accounting/reporting roots.

## 6. Source -> method trace

| Question | Source | Use | Boundary |
|---|---|---|---|
| Can GetTop discover report-language variants? | Yandex Wordstat.GetTop | full-depth discovery | demand/language only |
| Are sales reports a genuine seller workflow? | WB seller analytics | retain sales/order/funnel branches | only supported data may become product claims |
| Do seller reports include finance/stock/returns/unit economics? | WB report families | watch crossovers | no automatic page split |
| Is realization reporting seller-operational? | WB weekly realization docs | distinguish seller finance/sales reports from statutory reporting | accounting/tax still excluded unless task maps to product |

## 7. Information-gain contract

A05 must add information beyond A02-A04 by:

1. discovering artifact/report language around seller sales;
2. testing whether `продаж` reduces accounting/tax contamination;
3. exposing orders/buyouts/returns/revenue/funnel/product-performance terms if present;
4. finding Ozon/WB-specific sales-report wording;
5. identifying financial/stock/ad report crossovers;
6. determining whether a sales-report SERP probe later deserves separate testing;
7. routing subsequent finance/stock/returns/ad branches from observed language rather than assumptions.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response first. Then classify all direct rows and useful associations into:

- SALES_REPORT_CORE;
- ORDERS_BUYOUTS_RETURNS;
- REVENUE_FINANCE_PROFIT;
- FUNNEL_CONVERSION;
- PRODUCT_CARD_PERFORMANCE;
- STOCK_LOGISTICS;
- AD_TO_SALES_REPORTING;
- MARKETPLACE_SPECIFIC;
- REPORT_TOOL_SERVICE;
- ACCOUNTING_1C_TAX;
- HUMAN_SERVICE_EDU;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. It would mean this exact phrasing does not expand, not that seller sales-report demand is absent.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `отчеты продаж маркетплейсов`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the quality-first rule.

## 10. Stop / reopen

After full persistence/readback/analysis:

- release finance/stock/returns/ad subfamilies separately if materially surfaced or still independently important;
- do not continue generic report synonyms;
- no page decision from raw counts;
- stop this subfamily when further probes stop changing the seller-report language map.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A05_OTCHETY_PRODAZH_MARKETPLEYSOV_RESULT_2026-09-16.md`

Sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

Work remains authorized/preferred later for cross-family full-volume reconciliation and independent QA when accumulated M2R ledgers justify it.

## 13. Downstream decision

A05 does not create a page. It tests whether sales-report demand is a clean seller-operational acquisition entrance and identifies the next evidence branches.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Orthogonal information gain | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Product-truth alignment | 10.0 |
| Accounting-contamination control | 10.0 |
| Outcome/failure contract | 10.0 |
| Depth/completeness | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A05_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A05 = 0
```
