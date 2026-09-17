# R05 full export analysis — `отчеты для селлеров маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F3 report-intent boundary`.  
Job: `octoport-serp-r05-20260917`.  
Operation: `sprsofoaue000d4c9epd`.  
Revision: `5`.  
Status: **PASS / ALL 20 RESULTS REVIEWED / R05 CLOSED FOR CURRENT M3 PASS**.

Raw/export authority: `../raw/R05_07_EXPORT_MANIFEST_2026-09-17.md`.

## 1. Export QA

```text
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
SOURCE_SHA256 = d18b9977e0ffc124194bd713871b3407429c044b813e87fff69359a930a5a429
EXPORT_PERSISTENCE = PASS / 10 LOSSLESS VERIFIED CHUNKS
```

No result was sampled or omitted. Classification uses title, snippet and, where needed, the complete normalized/raw export text.

## 2. Primary classes

Each result receives one primary non-overlapping class by its dominant observable user job:

- `SELLER_OPERATIONAL_BUSINESS_REPORTING` — management/financial business reporting over the seller's own business such as P&L, cash flow, profit and expense views, without a specific marketplace-native realization document being the central object;
- `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING` — a marketplace-native sales/realization/commission report or its interpretation is the central object;
- `ACCOUNTING_1C_COMMISSION_AGENT_REPORTING` — bookkeeping/reconciliation/accounting-led workflow around marketplace data and documents;
- `TAX_STATUTORY_REPORTING` — tax/FNS/statutory reporting is the dominant job;
- `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` — software/tool that aggregates, transforms or automates marketplace report data;
- `EXTERNAL_MARKET_ANALYTICAL_REPORTING` — paid/packaged analytical report based on wider marketplace/category/competitor data rather than the seller's authorized own-store data;
- `GENERIC_SELLER_REPORTING_CONTENT` — generic editorial reporting discussion without a stronger class;
- `NOISE_OTHER_INTENT` — unrelated intent.

`EXTERNAL_MARKET_ANALYTICAL_REPORTING` was added after inspecting the actual SERP because rank 17 is a distinct observed branch. It is not forced into noise or a predeclared class.

## 3. All-20 result coding

| Rank | Domain / surface | Primary class | Observable report job | Octoport fit |
|---:|---|---|---|---|
| 1 | secrets.tbank.ru | `SELLER_OPERATIONAL_BUSINESS_REPORTING` | P&L, cash flow, profit analytics for seller business | DIRECT/ADJACENT |
| 2 | totalcrm.ru | `ACCOUNTING_1C_COMMISSION_AGENT_REPORTING` | reconcile marketplace cabinet, realization report, bank and accounting; FNS risk | BOUNDARY |
| 3 | totalcrm.ru | `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING` | understand marketplace reports, expenses and unprofitable products | DIRECT/ADJACENT |
| 4 | indeepa.com / NRP | `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` | combines operational API data with regulated commission-agent reports | ADJACENT/BOUNDARY |
| 5 | secrets.tbank.ru | `TAX_STATUTORY_REPORTING` | seller tax reporting | BOUNDARY |
| 6 | noboring-finance.ru | `SELLER_OPERATIONAL_BUSINESS_REPORTING` | financial reports and clean-profit calculation | DIRECT/ADJACENT |
| 7 | kontur-extern.ru | `ACCOUNTING_1C_COMMISSION_AGENT_REPORTING` | accountant workflow for seller clients; accounting/tax errors | BOUNDARY |
| 8 | uniseller.io | `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING` | Ozon realization report, balances, discounts, UPD | DIRECT/ADJACENT |
| 9 | selsup.ru | `SELLER_OPERATIONAL_BUSINESS_REPORTING` | P&L report over seller revenue and expenses | DIRECT/ADJACENT |
| 10 | tochka.com / `Отчёт селлера` | `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` | aggregates marketplaces into one report, computes profit, AI hints | DIRECT/ADJACENT |
| 11 | tablichki.tech / P&L | `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` | parallel report loading/consolidation into P&L | DIRECT/ADJACENT |
| 12 | klerk.ru | `TAX_STATUTORY_REPORTING` | what reporting sellers and marketplaces must submit | BOUNDARY |
| 13 | tochka.com / Ozon guide | `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING` | Ozon realization/sales report document and interpretation | DIRECT/ADJACENT |
| 14 | sellper.ru | `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` | WB/Ozon financial reports and fees aggregated via API | DIRECT/ADJACENT |
| 15 | 42clouds.com | `TAX_STATUTORY_REPORTING` | seller tax reporting, FNS, deadlines and penalties | BOUNDARY |
| 16 | knopka.com | `TAX_STATUTORY_REPORTING` | AUSN/tax treatment of marketplace income and commissions | BOUNDARY |
| 17 | sellerden.ru / analytical reports | `EXTERNAL_MARKET_ANALYTICAL_REPORTING` | paid analytical reports for niche/category/product selection | BOUNDARY |
| 18 | planfact.io | `ACCOUNTING_1C_COMMISSION_AGENT_REPORTING` | financial accounting/recordkeeping structure for marketplace business | ADJACENT/BOUNDARY |
| 19 | reccora.ru | `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS` | upload marketplace Excel reports into dashboards and forecasts | DIRECT/ADJACENT |
| 20 | cleverence.ru | `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING` | Ozon realization report with legal/tax/accounting meaning | DIRECT/ADJACENT |

## 4. Aggregate intent mix

```text
SELLER_OPERATIONAL_BUSINESS_REPORTING = 3/20 = 15%
MARKETPLACE_FINANCIAL_REALIZATION_REPORTING = 4/20 = 20%
ACCOUNTING_1C_COMMISSION_AGENT_REPORTING = 3/20 = 15%
TAX_STATUTORY_REPORTING = 4/20 = 20%
REPORTING_AUTOMATION_OR_INTEGRATION_SAAS = 5/20 = 25%
EXTERNAL_MARKET_ANALYTICAL_REPORTING = 1/20 = 5%
GENERIC_SELLER_REPORTING_CONTENT = 0/20
NOISE_OTHER_INTENT = 0/20
```

Grouped boundary measures:

```text
SELLER_OPERATIONAL_PLUS_NATIVE_MARKETPLACE_REPORTING = 7/20 = 35%
ACCOUNTING_PLUS_TAX = 7/20 = 35%
REPORTING_AUTOMATION_SAAS = 5/20 = 25%
EXTERNAL_ANALYTICAL_REPORT = 1/20 = 5%
```

Top 10:

```text
TOP10_SELLER_OPERATIONAL = 3/10
TOP10_MARKETPLACE_FINANCIAL_REALIZATION = 2/10
TOP10_ACCOUNTING = 2/10
TOP10_TAX = 1/10
TOP10_REPORTING_SAAS = 2/10
```

The top 10 therefore has no single clean report meaning. Seller/business/native-report intent is material, but accounting/tax and automation surfaces are also prominent.

## 5. Page-type / user-job shape

The first page is predominantly explanatory/commercial finance/reporting content and reporting tools, not a clean marketplace operational-report download SERP.

Repeated themes include:

- P&L / profit / cash-flow management;
- marketplace realization and commission reports;
- reconciliation between marketplace, bank and bookkeeping values;
- tax/FNS/AUSN reporting;
- software that aggregates marketplace reports into dashboards or consolidated financial views;
- accountant-facing interpretation of seller documents.

There is no meaningful unrelated-noise problem. The ambiguity is semantic and commercial: several legitimate meanings of `отчеты/отчетность` coexist.

## 6. R04 versus R05

R04 and R05 are not redundant.

R04 `аналитика маркетплейсов для селлеров` was dominated by analytics software/services with a large seller-owned internal class plus strong external market/competitor intelligence.

R05 shifts materially toward financial documents, realization reports, accounting, tax and reporting automation:

```text
R04_EXTERNAL_OR_MIXED_ANALYTICS_TOP10 = 6/10
R05_ACCOUNTING_OR_TAX = 7/20
R05_SELLER_OR_NATIVE_REPORTING = 7/20
R05_REPORTING_SAAS = 5/20
```

Thus `аналитика` and `отчеты` must remain separate intent evidence at M3/M8/M9.

## 7. Product implication for Octoport

The word `отчеты` is safe only when scope is explicit and tied to seller-authorized marketplace data and actually supported outputs, for example:

- reports/analysis over the seller's own sales, orders, stock, advertising, finance and product data;
- marketplace-native reports that the accepted API/Swagger authority actually exposes;
- generation/download of supported report artifacts.

Broad acquisition language such as `отчетность для селлеров`, `финансовая отчетность` or `налоговая отчетность` is unsafe for the launch promise because current Search frequently means bookkeeping, FNS/tax compliance, accounting reconciliation, commission-agent documents or legal reporting.

Search evidence does not authorize Octoport to become an accounting system, calculate/file taxes, create bookkeeping postings, replace 1C/accountants, or claim support for a marketplace report endpoint not separately proven by product/API authority.

The native realization-report class is nevertheless genuine seller demand and should stay available for later page/spec decisions where product capability supports it.

## 8. R05 verdict

```text
R05_VERDICT = FINANCE_ACCOUNTING_HEAVY_SELLER_REPORTING_SERP_WITH_MIXED_NATIVE_REPORT_AND_AUTOMATION_INTENT
R05_SELLER_OPERATIONAL_BUSINESS = 3/20
R05_MARKETPLACE_FINANCIAL_REALIZATION = 4/20
R05_ACCOUNTING_1C_COMMISSION = 3/20
R05_TAX_STATUTORY = 4/20
R05_REPORTING_AUTOMATION_SAAS = 5/20
R05_EXTERNAL_MARKET_ANALYTICAL = 1/20
R05_GENERIC_CONTENT = 0/20
R05_NOISE = 0/20
R05_ACCOUNTING_PLUS_TAX = 7/20
R05_SELLER_PLUS_NATIVE_REPORTING = 7/20
R05_MORE_SEARCH_NOW = NO
R05_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R05_PAGE_OWNERSHIP_DECISION = DEFERRED TO M9/M11
R05 = CLOSED FOR CURRENT M3 PASS
```

This is a representative first-page observation for this exact broad formulation, not proof that every narrower reporting query has the same composition.

## 9. Next-query consequence

R05 has answered the report-intent boundary sufficiently for the current M3 pass. R06 `помощник селлера маркетплейсов` remains independently valuable because it tests a different positioning ambiguity: human marketplace assistant/manager/outsourcing versus software/AI copilot/helper.

```text
R06_INFORMATION_GAIN = HIGH
R06 = NEXT CANDIDATE
R06_REQUIRES_OWN_QUERY_SPECIFIC_PRE_STEP = true
```

No R06 provider command may be released until R05 closure/progress is persisted and remotely read back, and the separate R06 pre-step/release itself passes remote readback.
