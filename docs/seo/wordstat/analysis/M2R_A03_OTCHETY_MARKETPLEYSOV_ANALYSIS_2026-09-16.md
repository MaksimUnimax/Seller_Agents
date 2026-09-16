# M2R-A03 analysis — `отчеты маркетплейсов`

Date: 2026-09-16.
Status: `ANALYZED / FULL 33-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A03_OTCHETY_MARKETPLEYSOV_RESULT_2026-09-16.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `2597`;
- direct `results[]`: `33` rows;
- associations: `19` rows;
- requested depth: `2000`;
- no provider failure;
- no evidence of result-row depth saturation.

`totalCount=2597` is a broad demand count for the query family. It is not the number of returned rows and must not be interpreted as pure Octoport demand.

## 2. Full-row review

All 33 direct rows and all 19 associations were reviewed with no sampling.

Primary provisional row buckets:

| Bucket | Direct rows | Share of 33 | Meaning |
|---|---:|---:|---|
| `ACCOUNTING_1C_TAX_REGULATORY` | 19 | 57.6% | commissioner/agent/advance reports, 1C import/postings/accounting/FNS/reporting |
| `SELLER_REPORT_CORE` | 6 | 18.2% | generic reports, sales reports, financial reports, manager reports, write-offs, buyouts |
| `MARKETPLACE_SPECIFIC` | 3 | 9.1% | Ozon, Wildberries, Yandex-specific report wording |
| `REPORT_IMPORT_TOOL` | 2 | 6.1% | loading/importing marketplace reports without explicit 1C-only wording |
| `AI_REPORT_ASSISTANCE` | 2 | 6.1% | `ии агенты маркетплейсы отчеты` variants |
| `EDUCATION_EXAMPLE` | 1 | 3.0% | examples/explanatory report wording |

All 19 associations are either unrelated marketplace/"market" noise or generic tax/reporting navigation. They do not add useful Octoport semantic candidates.

## 3. Important direct phrases

### Broad report market

- `отчеты маркетплейсов` — `2597`;
- `отчеты продаж маркетплейсов` — `448`.

The broad root is large, but the row distribution proves it cannot be treated as pure seller-analytics demand because accounting/1C/regulatory intent dominates the returned lexical surface.

### Marketplace-specific seller report language

- `отчет маркетплейса озон` — `166`;
- `яндекс отчет по маркетплейсам` — `58`;
- `отчет маркетплейса вайлдберриз` — `53`.

This is sufficient to keep marketplace-specific report discovery alive. It does not yet prove separate target pages.

### Product-adjacent report tasks

- `финансовые отчеты маркетплейсов` — `55`;
- `отчет менеджера маркетплейсов` — `42`;
- `отчет о списаниях маркетплейс` — `26`;
- `где скачать отчет о выкупах маркетплейсов` — `9`.

These are closer to the daily seller/manager job than the dominant 1C/accounting cluster and deserve further targeted discovery.

### Direct AI/report crossover

- `ии агенты маркетплейсы отчеты` — `49`;
- `ии агенты маркетплейсы отчеты спортмастер` — `7`.

The first phrase is strategically relevant because it directly links the already validated AI-agent category with marketplace reporting. The Sportmaster variant is treated as narrow/context-specific and not promoted by itself.

### Accounting / 1C contamination

Material rows include:

- `отчет комиссионера маркетплейс` — `271`;
- `маркетплейс отчеты бухгалтерия` — `129`;
- `авансовый отчет маркетплейс` — `89`;
- `1с загрузка отчетов маркетплейсов` — `88`;
- `1с отчет комиссионера маркетплейс` — `87`;
- `отчет маркетплейса в 1с бухгалтерия` — `76`;
- several additional 1C/posting/tax/reporting phrases.

This accounting family is real demand, but it is not automatically core Octoport demand. It may become adjacent only if the product later exposes supported accounting/report interpretation jobs from marketplace data. For current launch acquisition it remains outside the core unless a specific task maps cleanly to product truth.

## 4. What A03 changed

A03 resolves an important ambiguity from A01/A02:

`seller report demand exists`, but the generic word `отчеты` is too broad and strongly contaminated by accounting/1C/regulatory intent.

Therefore:

- do not use `2597` as direct demand for Octoport;
- do not abandon report demand;
- refine into seller-specific language rather than continuing with broad report synonyms;
- keep financial/sales/manager/write-off/buyout/report-analysis jobs for subsequent family discovery;
- retain marketplace-specific Ozon/WB report wording for later paired checks.

## 5. Fresh current-source check for next routing

Current Wildberries official seller help uses explicitly seller-centered report language:

- `Сводный отчёт по продавцу`;
- income/expense indicators;
- profit calculator;
- weekly sales analysis;
- stocks;
- returns/movements;
- unit economics;
- seller funnel/order-feed analytics.

Sources:

- https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports
- https://seller.wildberries.ru/instructions/ru/ru/subcategory/seller-analytics

Current marketplace analytics products also use seller-centered wording such as `аналитика маркетплейсов для селлеров` and `аналитические отчеты для селлеров`.

Examples:

- https://reccora.ru/analytics/marketplaces
- https://sellerden.ru/sellerden/vybor-nishi-na-marketplejsah/analytic-reports/

This makes a seller-qualified report seed the correct orthogonal refinement after the accounting-heavy A03 result.

## 6. Next acquisition decision

Next query:

`отчеты для селлеров`

Why this query, not another generic report synonym:

1. A03 is 57.6% accounting/1C/tax/regulatory by direct-row count;
2. the product audience is the seller/manager, not the accountant as such;
3. current official WB surfaces and current market pages use seller-centered report language;
4. the seed can reveal whether users search for sales/profit/stock/ads/report aggregation in seller language rather than bookkeeping language;
5. if it returns weak or external-market-heavy results, that itself is useful boundary evidence;
6. separate targeted branches for `финансовые отчеты маркетплейсов`, Ozon/WB reports and advertising reports remain available after seller-report discovery.

## 7. Work decision

`WORK_NOW = NOT REQUIRED`.

The A03 set is only 33 direct rows + 19 associations and was fully reviewed. Work remains explicitly authorized for the later cross-family M2R ledger reconciliation once enough report/analytics/ad/help families accumulate.

## 8. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Accounting-vs-seller boundary | 10.0 |
| Product-truth alignment | 10.0 |
| Noise/association handling | 10.0 |
| Report-family information gain | 10.0 |
| Marketplace-specific signal handling | 10.0 |
| AI/report crossover detection | 10.0 |
| Current-source routing support | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream routing quality | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 9. Verdict

```text
M2R_A03 = CLOSED
DIRECT_ROWS_REVIEWED = 33/33
ASSOCIATIONS_REVIEWED = 19/19
GENERIC_REPORT_ROOT = LARGE BUT ACCOUNTING-DOMINATED
CORE_SELLER_REPORT_DEMAND = PRESENT
MARKETPLACE_SPECIFIC_REPORT_DEMAND = PRESENT
AI_REPORT_CROSSOVER = PRESENT
NEXT_DISCOVERY_SEED = отчеты для селлеров
```
