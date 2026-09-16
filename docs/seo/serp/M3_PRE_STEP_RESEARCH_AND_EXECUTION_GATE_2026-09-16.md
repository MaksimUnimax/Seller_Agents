# Octoport M3 — pre-step research and execution gate

Date: 2026-09-16.
Status: **PASS FOR BOUNDED M3 COLLECTION / S02 MAY BE RELEASED AFTER CURRENT EVIDENCE DURABILITY CHECK**.
Stage: `M3 — Ordinary Yandex SERP collection`.

Companion authorities:

- `../EXECUTION_RULES.md`;
- `../WORK_HANDOFF_RULE.md`;
- `../STAGE_GATES_M0_M7.md`;
- `../SEO_MASTER_ROADMAP_2026-09-16.md`;
- `M3_QUERY_MATRIX_2026-09-16.md`.

## 1. Goal

Collect current ordinary Yandex SERP evidence for representative product-fit and control queries so later analysis can resolve:

- actual search intent;
- dominant page/content type;
- recurring search competitors;
- Ozon vs Wildberries page-split evidence;
- agent/assistant/category language;
- analytics/integration ambiguity;
- material new vocabulary gaps.

This stage does **not** decide final pages or site IA.

## 2. Relevant known failures / non-repeat controls

Transferred from KW-002 and current Octoport S01:

1. `BUSINESS RIVAL != SEARCH COMPETITOR` — derive competitors from live SERPs.
2. `PROVIDER SUCCESS != DURABLE EVIDENCE` — every lifecycle result/export is persisted/read back.
3. `WAITING/PENDING != FAILURE` — never resubmit an accepted deferred operation blindly.
4. `NO_DUE_OPERATIONS` local guard is not a provider call and not negative evidence.
5. `ONE SERP APPEARANCE != RECURRING COMPETITOR`.
6. `TOP20 DISCOVERY != FULL SERP COVERAGE`.
7. Bridge popup/current-job UI can be stale/misleading; lifecycle/export evidence is authority.
8. No batch burst while YMB batch semantics/UI bug are under repair; one-query jobs remain the current safe execution unit.
9. No next provider action until current response/export is durable and verified.

## 3. Fresh official provider research — 2026-09-16

### YS-M3-01 — Web Search API REST request schema

Publisher/class: Yandex AI Studio / `OFFICIAL_PROVIDER`.
URL: `https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearch/search`
Checked: 2026-09-16.

Supports:

- `searchType`, `queryText`, `familyMode`, zero-based `page`, `fixTypoMode`;
- relevance/time sorting;
- `GROUP_MODE_FLAT` / `GROUP_MODE_DEEP`;
- `groupsOnPage` 1..100;
- `docsInGroup` 1..3;
- region and localization fields.

Application: retain current S01 request settings for query-to-query comparability.

Boundary: provider parameter support does not prove our selected query matrix is analytically complete.

### YS-M3-02 — Deferred/asynchronous Search lifecycle

Publisher/class: Yandex AI Studio / `OFFICIAL_PROVIDER`.
URL: `https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`
Checked: 2026-09-16.

Supports:

- deferred text search;
- provider returns an operation identity;
- execution is checked/retrieved later through the operation lifecycle;
- completed result is returned via operation response data.

Application: accepted `operation_id` must be preserved and collected; do not resubmit while pending.

### YS-M3-03 — Deferred Search API endpoint

Publisher/class: Yandex AI Studio / `OFFICIAL_PROVIDER`.
URL: `https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`
Checked: 2026-09-16.

Supports the asynchronous Search request body using the same material search settings.

Application: current YMB deferred transport is semantically appropriate for M3.

### YS-M3-04 — Current pricing

Publisher/class: Yandex AI Studio / `OFFICIAL_PROVIDER`.
URL: `https://aistudio.yandex.ru/en/docs/search-api/pricing`
Checked: 2026-09-16.

Current RUB example in provider docs: daytime deferred requests `30.5 ₽ / 1000`, i.e. `0.0305 ₽` per provider submission; night deferred pricing is lower. Internal/authentication failures are not billed according to provider policy.

Application: one-query job cap remains `maxRequests=1`, `maxCostRub=0.0305` for daytime execution. Cost does not decide intent coverage but bounds accidental duplicate submission.

### YS-M3-05 — Yandex site/query market analysis context

Publisher/class: Yandex Webmaster / `OFFICIAL_YANDEX`.
URL: `https://www.yandex.ru/support/webmaster/en/service/queries-selection`
Checked: 2026-09-16.

Supports automatic query clustering by meaning/user intent and demand/competition information in Webmaster market analysis.

Application: corroborates that query meaning/intent, not lexical equality, is the downstream decision target. This tool will become an additional measurement/evidence layer when Octoport Webmaster data is available.

### YS-M3-06 — Site structure

Publisher/class: Yandex Webmaster / `OFFICIAL_YANDEX`.
URL: `https://yandex.ru/support/webmaster/en/recommendations/site-structure`
Checked: 2026-09-16.

Supports clear crawlable link structure and pages belonging to logical site sections.

Application: downstream page architecture must remain coherent and linked, but this source does not authorize pages before M7/M11.

## 4. Current Bridge capability evidence

Project-test source: current KW-002 execution on YMB `0.1.8`, commit recorded there as `1af6d07828b352ac7a520896d8cc41e9f24a17b0`.

Current accepted behavior evidenced in KW-002 and independently reproduced by Octoport S01:

```text
start = local-only, provider_calls 0
submitN count=1 = exactly one provider submission when accepted
accepted operation_id is persisted
collectN before due can return local NO_DUE_OPERATIONS, provider_calls 0
provider-backed collect retrieves same operation
SUCCEEDED result can be normalized/exported
```

Current exact one-query command shape:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"...","queries":["..."],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Then, only after persisted/read-back start:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"submitN","jobId":"...","count":1}
```

Collection/export are separately released after their prior lifecycle evidence is durable.

## 5. M3 search settings

For comparability across the representative matrix:

```text
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
```

This is a bounded top-20 discovery surface, not a claim of full SERP coverage.

## 6. Execution unit / Work decision

Current provider acquisition remains one bounded query at a time because:

- S01 produced only 20 normalized rows;
- exact response persistence and manual lifecycle control are reliable at this scale;
- the known popup/state bug and current batch-semantics repair argue against increasing provider concurrency merely for speed.

Current decision:

```text
PROVIDER_ORCHESTRATION_WORK_TRIGGER = NOT_MET
CROSS_QUERY_ANALYSIS_WORK_TRIGGER = REEVALUATE AFTER ACCUMULATED M3/M4 CORPUS
```

When recurrence/overlap/competitor-corpus comparison becomes large enough that ordinary chat risks partial analysis, the complete current corpus is handed to Work. Sampling is forbidden.

## 7. S02 information-gain contract

Query: `ии агент для озон`.

Why existing evidence is insufficient:

- Wordstat confirms observed demand (`40`), but not result-page intent;
- S01 proves a generic marketplace AI-agent category, but cannot determine whether Ozon-specific wording produces distinct marketplace-specific product pages, generic agent products, articles or built-in Ozon surfaces;
- page ownership `/ozon` vs generic home remains unresolved.

What a result can change:

- strengthen/weaken a distinct Ozon commercial landing hypothesis;
- identify Ozon-specific search competitors/pages;
- show whether marketplace-specific SERP differs materially from generic S01;
- reveal new Ozon integration/task terminology for later gap review.

What technical failure changes: nothing semantically; branch remains unresolved.

What a valid empty result would mean: bounded absence of returned Search rows for this exact query/settings/snapshot only, not zero market demand.

Provider bound: exactly one deferred submit for the one-query job.

## 8. PASS gate

```text
FRESH_PROVIDER_RESEARCH = PASS
CURRENT_OFFICIAL_REQUEST_SCHEMA_CHECK = PASS
CURRENT_DEFERRED_LIFECYCLE_CHECK = PASS
CURRENT_PRICE_CHECK = PASS
BRIDGE_0_1_8_CAPABILITY_RECONCILED = PASS
KNOWN_FAILURE_CONTROLS_RESTATED = PASS
S02_INFORMATION_GAIN_CONTRACT = PASS
ONE_QUERY_BOUND = PASS
NO_BLIND_RETRY = ACTIVE
PERSIST_READBACK_BEFORE_NEXT_ACTION = ACTIVE
WORK_TRIGGER = EVALUATED
M3_PROVIDER_EXECUTION_ALLOWED = true
```

This gate authorizes preparation of S02 local `start`; it does not authorize `submitN` until the returned start envelope is persisted and read back.
