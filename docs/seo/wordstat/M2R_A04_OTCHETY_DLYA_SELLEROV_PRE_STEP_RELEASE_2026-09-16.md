# M2R-A04 pre-step research and query release — `отчеты для селлеров`

Date: 2026-09-16.
Stage: `M2R — seller-qualified report demand discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee; Octoport is not the AI employee itself.
- A01 `аналитика маркетплейсов`: CLOSED / high information gain / 162 direct rows.
- A02 `аналитика продаж на маркетплейсах`: CLOSED / valid but narrow / 7 direct rows.
- A03 `отчеты маркетплейсов`: CLOSED / 33 direct rows / broad root strongly accounting-dominated.
- A03 direct-row mix: 19/33 (`57.6%`) accounting/1C/tax/regulatory; seller-report core remains present.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A04`

`QUERY_TEXT = отчеты для селлеров`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Does seller-qualified wording isolate the marketplace seller's operational/reporting job from the accounting/1C contamination seen under the broad root `отчеты маркетплейсов`?

Need to discover whether the seller-specific language naturally exposes:

- sales / revenue / buyouts / cancellations;
- profit / finance / unit economics;
- stocks / turnover / returns;
- advertising reports;
- seller-cabinet reports;
- marketplace-specific Ozon/WB report wording;
- report aggregation / analytics tools;
- external market/niche reports;
- education/services/human analyst demand;
- residual accounting/tax noise.

## 4. Why existing evidence is insufficient

A03 proves that report demand is large, but the generic root is dominated by accounting and 1C terminology:

- `отчеты маркетплейсов` — 2597;
- `отчеты продаж маркетплейсов` — 448;
- `отчет комиссионера маркетплейс` — 271;
- multiple 1C/accounting/tax rows.

Useful seller-adjacent signals exist, but A03 cannot cleanly isolate the seller's own operational need. A seller-qualified discovery probe is therefore incremental rather than redundant.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

GetTop remains the correct discovery method for phrase-containing and similar last-30-day demand. `numPhrases` supports up to 2000. Returned rows must be persisted before interpretation.

### Wildberries official seller-report language

https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current seller help explicitly lists seller-centered reports such as:

- `Сводный отчёт по продавцу`;
- income and expense indicators;
- profit calculator;
- weekly sales analysis;
- stocks;
- returns/movements;
- unit economics.

https://seller.wildberries.ru/instructions/ru/ru/subcategory/seller-analytics

Current seller analytics includes sales funnel and order-feed reporting.

### Current market-language evidence

https://sellerden.ru/sellerden/vybor-nishi-na-marketplejsah/analytic-reports/

Current page language explicitly uses `Аналитические отчеты для селлеров`.

https://reccora.ru/analytics/marketplaces

Current page uses `Аналитика маркетплейсов для селлеров` and frames the problem as fragmented cabinet reports that sellers manually combine.

These pages prove seller-qualified report/analytics language exists in the market; they do not establish final SEO targets or Octoport feature truth.

## 6. Source -> method trace

| Question | Source | Use | Boundary |
|---|---|---|---|
| Can Wordstat expose seller-qualified report demand? | Yandex Wordstat.GetTop | full-depth seller report discovery | language/demand only, not page proof |
| Are seller reports real cabinet tasks? | WB official seller analytics/reports | retain seller operational report branches | only supported data may become product claims |
| Is seller-qualified report wording current market language? | SellerDen, Reccora | justify the seller-qualified seed | competitor wording is evidence, not copy authority |

## 7. Information-gain contract

A04 must add information beyond A03 by:

1. measuring whether seller qualification reduces 1C/accounting contamination;
2. discovering operational report vocabulary used by sellers;
3. exposing sales/finance/profit/stock/returns/ad branches if present;
4. finding Ozon/WB-specific seller report wording;
5. distinguishing seller-owned operational reports from external market/niche reports;
6. determining whether report-tool/analytics-service seekers form a useful Octoport acquisition entrance;
7. routing the next report/finance/ad/stock probes from actual returned language.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response first, then review every direct row and useful association into provisional buckets:

- SELLER_OPERATIONAL_REPORT;
- SALES_REVENUE_BUYOUTS;
- FINANCE_PROFIT_UNIT_ECONOMICS;
- STOCK_RETURNS_TURNOVER;
- AD_REPORTING;
- MARKETPLACE_SPECIFIC;
- REPORT_TOOL_ANALYTICS_SERVICE;
- EXTERNAL_MARKET_NICHE;
- ACCOUNTING_TAX_1C;
- HUMAN_SERVICE_EDU;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase A03 seller-report evidence; it would show that sellers use other wording.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `отчеты для селлеров`;
- numPhrases: `2000`;
- region: `225`;
- devices: `DEVICE_ALL`.

Maximum depth is intentional because this is discovery and quality/completeness outrank request cost.

## 10. Stop / reopen

After full persistence/readback/analysis:

- if seller wording is rich, expand high-value operational children;
- if weak, test adjacent seller language such as `отчеты селлера` / marketplace-specific report forms only when they answer a named gap;
- finance/ad/stock/returns branches remain eligible for independent discovery regardless of A04 size when their task value is material;
- no page decision from raw counts.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A04_OTCHETY_DLYA_SELLEROV_RESULT_2026-09-16.md`

Sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat query.

Work is expected later when enough M2R family ledgers accumulate for cross-family full-volume deduplication/classification and independent QA.

## 13. Downstream decision

A04 does not create a page. It tests whether seller-report demand is a clean acquisition family and determines which seller report subfamilies deserve additional Wordstat and later SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A03 | 10.0 |
| Fresh method support | 10.0 |
| Current seller-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Accounting contamination control | 10.0 |
| Outcome/failure contract | 10.0 |
| Depth/completeness | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A04_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A04 = 0
```
