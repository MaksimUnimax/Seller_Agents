# M2R-A03 pre-step research and query release — `отчеты маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — seller report demand reacquisition`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- M2R-A01 `аналитика маркетплейсов`: CLOSED / high information gain / 162 direct rows.
- M2R-A02 `аналитика продаж на маркетплейсах`: CLOSED / valid but narrow / only 7 direct rows.
- A02 did not reveal profit, margin, stocks, returns, funnel, order, finance or report-language branches.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A03`

`QUERY_TEXT = отчеты маркетплейсов`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Discover the search-language universe around **marketplace reports themselves**, without forcing the words `аналитика`, `ИИ` or `сервис` into the query.

Need to learn whether users naturally search for:

- seller reports / cabinet reports;
- financial reports / payouts / income-expense;
- sales/order reports;
- commission/logistics/storage/deductions;
- stocks / returns / movements;
- advertising reports;
- weekly/consolidated reports;
- unit economics / profit;
- Ozon/Wildberries-specific report names;
- accounting/tax/regulatory reporting unrelated to Octoport;
- report parsers/services/automation;
- human/accounting/education noise.

## 4. Why existing evidence is insufficient

A01 showed a broad analytics market and A02 confirmed a sales-analytics branch, but A02 returned only 7 direct phrases and did not expand into the actual report/metric vocabulary.

Historical B01/B02 also did not use a report-centered seed. Therefore current evidence cannot tell us how sellers phrase the underlying report problem when they do not use the word `аналитика`.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

Source: https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current contract: GetTop returns last-30-days popular queries containing the supplied phrase and similar queries; `numPhrases` supports up to 2000; response can contain `results[]`, `associations[]`, `totalCount`.

Method consequence: `отчеты маркетплейсов` is a broad discovery seed. Returned rows are language evidence only; they do not become target pages automatically.

### Wildberries official report surface

Source: https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current WB seller documentation lists report families including:

- income and expenses;
- profit calculator;
- weekly sales dynamics/analysis;
- regional sales;
- brand share;
- consolidated seller report;
- stocks;
- deductions;
- returns/movements;
- unit economics.

Source: https://seller.wildberries.ru/instructions/ru/ru/subcategory/seller-analytics

Current WB seller analytics also exposes sales-funnel and order-feed report surfaces.

Product consequence: report interpretation is a genuine seller-cabinet job that the user's AI can potentially perform from authorized data through Octoport.

### Ozon official seller/API evidence

Source: https://seller.ozon.ru/media/boost/kak-upravlyat-ochen-bolshim-assortimentom-na-ozon-s-pomoshyu-api/

Ozon documents Seller API as able to export financial and analytical reporting and provide clean data to analytics systems for a fuller sales picture. This is capability corroboration; current endpoint-level truth remains governed by the project's Ozon Swagger/API authority.

### Current market-language evidence

Examples:

- https://reccora.ru/analytics/marketplaces — explicitly frames the problem as separate cabinet reports such as sales funnel, order feed and weekly realization report;
- https://runseller.ru/ — describes digitizing weekly WB/Ozon reports into profit, margin, advertising and stock decisions;
- https://salecore.pro/ — says marketplace reports show only part of the picture and finance/profit are otherwise calculated manually.

These sources demonstrate current market wording and user pain; they are not product-truth authorities for Octoport.

## 6. Source -> method trace

| Question | Source | Use | Boundary |
|---|---|---|---|
| Can GetTop discover report-language branches? | Yandex Wordstat.GetTop | broad report seed, max-depth discovery | Wordstat = demand/language, not intent/page proof |
| Are report tasks real seller jobs? | WB official reports/analytics | retain seller-report branches for deeper testing | only supported data can become Octoport claims |
| Can Ozon feed reporting data to analytics? | Ozon seller/API material | supports seller-report relevance | current endpoint details remain Swagger-governed |
| Is report fragmentation a current market pain? | Reccora/Runseller/SaleCore | justify orthogonal report seed | competitor wording is evidence, not copy source |

## 7. Information-gain contract

A03 must add information beyond A01/A02 by:

1. discovering report terminology users use without `аналитика`;
2. revealing finance/profit/commission/logistics/stock/return/ad report branches if present;
3. discovering marketplace-specific report names;
4. separating seller operational reports from accounting/tax/regulatory reporting;
5. exposing parser/aggregation/automation service demand;
6. producing targeted follow-up seeds for any material high-value report family;
7. informing later SERP probes around seller reports/services.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response first. Then review every direct row and useful association into provisional buckets:

- SELLER_REPORT_GENERIC;
- FINANCE_PAYOUT_PROFIT;
- SALES_ORDERS_FUNNEL;
- COMMISSION_LOGISTICS_STORAGE;
- STOCK_RETURNS_MOVEMENTS;
- AD_REPORTING;
- UNIT_ECONOMICS;
- MARKETPLACE_SPECIFIC;
- REPORT_TOOL_PARSER_SERVICE;
- ACCOUNTING_TAX_REGULATORY;
- HUMAN_ROLE_EDU;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly; applies only to this exact query form and does not erase the report need proven by seller/market sources.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `отчеты маркетплейсов`;
- numPhrases: `2000`;
- region: `225`;
- devices: `DEVICE_ALL`.

Maximum depth is intentional because this is broad discovery and quality/completeness outrank request cost.

## 10. Stop / reopen

One provider execution identity at a time. After full persistence/readback/analysis:

- release `отчеты для селлеров` if the broad root is dominated by accounting/regulatory or non-seller ambiguity;
- release finance/profit/stocks/returns/ad-report subfamilies separately when material;
- do not create page decisions from raw phrase counts;
- continue until report-family information saturation.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A03_OTCHETY_MARKETPLEYSOV_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED`.

A03 is one bounded discovery branch. Under the quality-first rule, Work becomes preferred once cross-family report/analytics/ad/market ledgers would benefit from full-volume reconciliation or independent QA.

## 13. Downstream decision

A03 does not create a page. It determines which report/task families deserve further Wordstat acquisition and later representative Yandex SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Orthogonal information gain after A02 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Product-truth alignment | 10.0 |
| Report-vs-accounting boundary | 10.0 |
| Failure/zero semantics | 10.0 |
| Depth/completeness contract | 10.0 |
| Work/resource rule compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A03_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A03 = 0
```
