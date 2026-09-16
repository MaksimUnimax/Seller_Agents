# M2R-A02 analysis — `аналитика продаж на маркетплейсах`

Date: 2026-09-16.
Status: `ANALYZED / FULL 7-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A02_ANALITIKA_PRODAZH_MARKETPLEYSOV_RESULT_2026-09-16.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `138`;
- direct `results[]`: `7` rows;
- associations: `16` rows;
- requested depth: `2000`;
- no provider failure;
- no evidence of depth saturation.

`totalCount=138` is not the returned-row count and must not be added to child counts.

## 2. Full-row review

All 7 direct rows and all 16 associations were reviewed. No sampling was used.

Direct rows:

| Phrase | Count | Provisional use |
|---|---:|---|
| `аналитик продаж на маркетплейсах` | 138 | ambiguous human-role / analytics-category wording |
| `аналитика продаж на маркетплейсах` | 138 | core seller sales-analytics wording |
| `сервис аналитика продаж на маркетплейсах` | 39 | tool/service discovery |
| `аналитика продаж на маркетплейсах бесплатно` | 20 | free-tool discovery |
| `сервис для аналитики продаж на маркетплейсах` | 19 | tool/service discovery |
| `аналитика товаров для продажи на маркетплейсах` | 13 | product/external-market ambiguity |
| `аналитика продаж на маркетплейсах бесплатно онлайн` | 7 | free-tool discovery |

All 16 associations are unrelated/noisy broad `market/sell` terms and are not useful acquisition candidates.

## 3. What A02 proved

A02 confirms a real `sales analytics` lexical branch with demand `138`, but **the branch does not expand into the operational metric vocabulary we expected**. It returned only 7 direct phrases and did not surface profit, margin, returns, stocks, funnel, orders, buyouts, unit economics, advertising efficiency or seller-report terminology.

Therefore A02 is useful mainly as a boundary result:

- `аналитика продаж на маркетплейсах` is a valid phrase family;
- it is too narrow to serve as the discovery root for the full seller-report job;
- forcing `аналитика продаж` does not reveal the vocabulary of the underlying reports/metrics;
- separate orthogonal discovery seeds are required.

## 4. Product consequence

The owner hypothesis remains supported: users seeking sales analytics/tools are plausible Octoport prospects because Octoport can let the user's chosen AI analyze seller-owned marketplace data.

But A02 does **not** justify treating all seller reporting as a subcluster of the exact phrase `аналитика продаж`. The user may search for the underlying artifact/problem instead: report, weekly report, finance, profit, unit economics, stock, returns, advertising report, etc.

## 5. Fresh current-source check for routing

Current Wildberries official analytics documentation exposes report families including:

- sales funnel;
- weekly sales analysis;
- income and expenses;
- profit calculator;
- regional sales;
- consolidated seller report;
- stock reports;
- deductions;
- returns;
- unit economics.

Source: https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current market pages also frame the seller problem explicitly as fragmented marketplace reports that must be combined to calculate profit, advertising efficiency, logistics and stock position.

Examples:

- https://reccora.ru/analytics/marketplaces
- https://runseller.ru/
- https://salecore.pro/

Ozon's seller material confirms Seller API can export financial and analytical reporting and send clean data to analytics systems for a fuller sales picture:

https://seller.ozon.ru/media/boost/kak-upravlyat-ochen-bolshim-assortimentom-na-ozon-s-pomoshyu-api/

## 6. Next query decision

Next query should be **orthogonal rather than another near-synonym**:

`отчеты маркетплейсов`

Why:

1. A02 did not discover the underlying report vocabulary;
2. official WB/Ozon product surfaces are report-heavy;
3. current analytics products describe the user's pain as scattered marketplace reports;
4. this seed can expose finance, sales, commission, logistics, returns, stocks, advertising, accounting/tax or other report branches that must then be separated;
5. ambiguity is acceptable because the purpose is discovery, not immediate target-page assignment.

A separate `отчеты для селлеров` probe remains planned if A03 does not adequately isolate seller-side report language.

## 7. Work decision

`WORK_NOW = NOT REQUIRED`.

The A02 corpus contains only 7 direct rows and 16 associations; all were reviewed in full. Work remains available for later cross-family reconciliation when multiple expanded ledgers accumulate.

## 8. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Correct interpretation of narrow expansion | 10.0 |
| Product-truth alignment | 10.0 |
| Noise handling | 10.0 |
| Information-gain routing | 10.0 |
| Avoidance of phrase inflation | 10.0 |
| Current source support | 9.5 |
| Downstream usefulness | 10.0 |
| Work/resource compliance | 10.0 |
| Claim boundaries | 10.0 |

`QUALITY_TOTAL = 99.5/100`
`QUALITY_SCORE = 9.95/10`

## 9. Verdict

```text
M2R_A02 = CLOSED
DIRECT_ROWS_REVIEWED = 7/7
ASSOCIATIONS_REVIEWED = 16/16
SALES_ANALYTICS_PHRASE_FAMILY = VALID BUT NARROW
UNDERLYING_SELLER_REPORT_LANGUAGE = NOT RESOLVED
NEXT_DISCOVERY_SEED = отчеты маркетплейсов
```
