# R05 pre-step research and bounded release — `отчеты для селлеров маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F3 report-intent boundary`.  
Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**.

## 1. Current cursor

```text
M2R = ACCEPTED
S01-S03 = CLOSED
R01-R03 = CLOSED
R04 = CLOSED / 20
NEXT_CANDIDATE = R05
M7 = BLOCKED
M8 = BLOCKED
```

R04 established a mixed analytics SERP with a large seller-owned/internal component and a strong external/mixed SaaS component. It did not resolve the distinct meaning of `отчеты`.

## 2. Query identity

```text
QUERY_ID = R05
QUERY_TEXT = отчеты для селлеров маркетплейсов
FAMILY = F3
JOB_ID_PLANNED = octoport-serp-r05-20260917
RELATION = report-boundary control after R04 analytics
```

## 3. Exact open decision

What does current Yandex Search mean by the unqualified seller phrase `отчеты для селлеров маркетплейсов`?

The result set must distinguish at least:

1. seller operational/business reports: sales, orders, stock, ads, products, returns, shipments;
2. marketplace-native financial/realization reports and closing documents;
3. accounting/commission-agent/1C workflows built from marketplace reports;
4. tax/statutory accounting guidance;
5. reporting/automation SaaS or integrations;
6. generic seller-report guides/content;
7. unrelated noise.

The query does not authorize Octoport to become an accounting system, file tax returns, create accounting postings or promise unsupported marketplace report endpoints.

## 4. Why durable evidence is insufficient

Wordstat/M2R showed that report roots are heavily contaminated by accounting/1C/tax language. R04 showed that broad analytics is heavily software/service-oriented, but `аналитика` and `отчеты` are not interchangeable user jobs.

Current product truth allows read-only seller data access and report generation/download where supported, but this does not answer whether Search users asking for `отчеты` primarily want seller-operational data, marketplace financial documents or bookkeeping workflows.

```text
R05_REDUNDANT_WITH_R04 = NO
R05_INFORMATION_GAIN = HIGH
```

## 5. Fresh external/provider research — 2026-09-17

### R05-Y1 — current Yandex WebSearchAsync contract

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Current response remains an Operation resource with an operation `id`; the Search request supports the same query/group/sort parameters used for prior M3 probes.

Method use: preserve the same RU/region-225/page-0/top-20 comparison surface.

### R05-Y2 — current deferred lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Current docs instruct the caller to save the returned Operation ID and later retrieve that same operation. They also note deferred execution may take from five minutes to a few hours.

Method use: one submit, persist operation identity, bounded due collects, no blind replay.

### R05-WB1 — seller financial reports are a real first-party data class

Official WB API:

`https://dev.wildberries.ru/docs/openapi/financial-reports-and-accounting`

Current `Документы и бухгалтерия (finances)` surface exposes seller balance, financial reports and documents. Current report methods include lists/details of realization reports and acquiring-expense reports; the new finance API methods are documented for seller-authorized tokens.

Method use: code marketplace-native seller financial/realization reporting separately from generic accounting/tax workflows.

Boundary: a marketplace financial report is not automatically a bookkeeping/tax-filing service.

### R05-WB2 — current report migration confirms active first-party report lifecycle

Official WB API release notes, 2026-04-15:

`https://dev.wildberries.ru/release-notes?id=198`

WB added new finance-category realization-report methods and is replacing the older realization-report method.

Method use: current seller-report capability is active, not merely historical terminology.

### R05-OZ1 — current seller-owned reporting/analytics surface

Official Ozon Bank seller analytics surface:

`https://finance.ozon.ru/business/rko/marketpleysy/analitika-prodazh`

The current service describes downloadable/available seller reports over income, expenses, profit, sales dynamics and product-level operational/financial metrics for Ozon/Wildberries stores.

Method use: preserve seller-owned reporting as a legitimate product/search class.

Boundary: this does not prove that every Ozon Seller API report endpoint is available to Octoport; API capability remains governed separately by the accepted Ozon Swagger/product authority.

### R05-OZ2 — recent Seller API report lifecycle signal

Current Ozon Seller API notification channel, 2026-07-28:

`https://t.me/s/OzonSellerAPI?after=655`

It records current updates to `/v1/report/info`, `/v1/report/list` and a beta per-order realization-report endpoint.

Method use: corroborates that report list/info and realization-report workflows remain active vocabulary in the current Ozon seller ecosystem.

Claim boundary: this notification is a current product-update signal, not a substitute for the canonical Swagger used by Octoport implementation.

### R05-1C1 — marketplace reports enter an accounting/commission workflow

Official 1C ITS:

`https://its.1c.ru/db/content/updinfo/src/accounting/3.0.114/index.htm`

1C documents loading Wildberries and Ozon sales reports into `Отчет комиссионера о розничных продажах`; the full interface places this in `Продажи -> Отчеты комиссионеров`.

Method use: `отчет комиссионера`, 1C import/accounting and similar result pages form a separate accounting class rather than seller-operational reporting.

### R05-1C2 — current accounting-derived marketplace monitoring

Official 1C ITS:

`https://its.1c.ru/db/content/updinfo/src/accounting/3.0.162/index.html`

1C's `Монитор маркетплейсов` compares marketplace sales using accounting data and can lead users to load missing marketplace reports.

Method use: a page can discuss marketplace reports/analytics while its actual user job remains accounting reconciliation.

## 6. Source -> method trace

| Question | Evidence | R05 use | Boundary |
|---|---|---|---|
| Current Search async request/lifecycle? | Yandex official docs | same comparable top-20 lifecycle | provider docs != Bridge capability |
| Do marketplace-native seller financial reports exist? | WB official finance/report docs | seller financial/realization class | not automatically tax/accounting service |
| Is seller-owned report language current on Ozon? | Ozon official seller analytics + Seller API update signal | seller-report class | canonical Octoport API authority stays separate |
| Why separate 1C/accounting? | official 1C marketplace report workflows | accounting/commission class | accounting workflow != seller operational report |
| Why Search now? | M2R + R04 closure | measure live dominance and page types | no final page decision |

## 7. Full-result coding plan

Every normalized organic result will be reviewed with:

```text
rank
url/domain/title/snippet/full export text when needed
page type = product/tool/help/article/accounting-guide/integration/service/course/noise
marketplace scope = WB/Ozon/multi/generic
user = seller/operator/accountant/bookkeeper/agency/other
report source = seller cabinet/API / accounting system / SaaS aggregation / unclear
report job = operational / financial-realization / closing-doc / accounting / tax / analytical / other
commercial intent = tool/SaaS/integration/service/editorial
Octoport fit = direct / adjacent / boundary / noise
```

Primary classes:

- `SELLER_OPERATIONAL_BUSINESS_REPORTING`;
- `MARKETPLACE_FINANCIAL_REALIZATION_REPORTING`;
- `ACCOUNTING_1C_COMMISSION_AGENT_REPORTING`;
- `TAX_STATUTORY_REPORTING`;
- `REPORTING_AUTOMATION_OR_INTEGRATION_SAAS`;
- `GENERIC_SELLER_REPORTING_CONTENT`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; these classes are not quotas.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export the complete top-20; classify all rows; measure operational-vs-financial-vs-accounting intent and page types; decide the usable Octoport report-language boundary.

### VALID ZERO

Weakens only this exact formulation. It does not erase known marketplace report capabilities or F3 demand.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry. Any ambiguous provider execution requires separate reconciliation/release before a new paid attempt.

## 9. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = отчеты для селлеров маркетплейсов
searchType = SEARCH_TYPE_RU
region = 225
page = 0
groupsOnPage = 20
docsInGroup = 1
groupMode = GROUP_MODE_FLAT
familyMode = FAMILY_MODE_MODERATE
fixTypoMode = FIX_TYPO_MODE_OFF
sortMode = SORT_MODE_BY_RELEVANCE
sortOrder = SORT_ORDER_DESC
maxRequests = 1
maxCostRub = 0.0305
jobId = octoport-serp-r05-20260917
```

## 10. Current Bridge capability

Current Bridge branch rechecked before release:

```text
REPO = MaksimUnimax/Yandex_direct
BRANCH = hotfix/ymb-017-qualification-fix-2026-09-16
HEAD = 469a69b628ef00e79718996cfd7bbb0291edddec
```

This same async implementation successfully completed the accepted R04-R1 lifecycle immediately before R05: local start, one accepted submit with persisted operation ID, local no-due guards, provider-backed terminal collect and revision-pinned export.

Bridge capability and provider documentation remain separate proofs.

## 11. Persistence / Work / conflict gates

```text
RAW_LIFECYCLE_PATH_PREFIX = docs/seo/serp/raw/R05_*
ANALYSIS_PATH_PREFIX = docs/seo/serp/analysis/R05_*
FULL_EXPORT_PERSISTENCE = REQUIRED BEFORE SEMANTIC ANALYSIS
REMOTE_READBACK = REQUIRED BEFORE EVERY NEXT PROVIDER ACTION
WORK_TRIGGER_FOR_ONE_TOP20 = NOT MET
R05_EXISTING_DURABLE_START_ARTIFACT = NONE (404 CHECKED)
```

One top-20 query remains safe for full Main Chat review; no sampling is allowed.

## 12. Release gate

```text
R04 = CLOSED / PERSISTED / READBACK
R05_INFORMATION_GAIN = HIGH
FRESH_YANDEX_PROVIDER_RESEARCH = PASS
FRESH_WB_REPORT_RESEARCH = PASS
FRESH_OZON_REPORT_RESEARCH = PASS WITH API-AUTHORITY BOUNDARY
FRESH_1C_ACCOUNTING_BOUNDARY_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
CURRENT_BRIDGE_HEAD = VERIFIED
EXISTING_JOB_CONFLICT = NONE
WORK_TRIGGER = NOT MET
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

This artifact releases **only one local start**. It does not release `submitN`.

## 13. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r05-20260917","queries":["отчеты для селлеров маркетплейсов"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local-only creation with one `PENDING` item. Actual returned envelope is authority.
