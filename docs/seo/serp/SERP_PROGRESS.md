# SEO SERP collection — execution progress

Date: 2026-09-17.  
Branch: `seo/wordstat-batch-01-2026-09-16`.  
Status: **M2R RECONCILED / S01-S03 CLOSED / R01-R03 F2 BLOCK CLOSED / F2 SEARCH SATURATED / R04 OLD JOB FROZEN UNKNOWN / R04-R1 LOCAL START RELEASED**.

## Authorities

- master roadmap: `../SEO_MASTER_ROADMAP_2026-09-16.md`;
- execution rules: `../EXECUTION_RULES.md`;
- provider release hard gate: `../PROVIDER_QUERY_RELEASE_RULE.md`;
- current M3 matrix: `M3_QUERY_MATRIX_2026-09-17.md`;
- original R04 release: `R04_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md`;
- current R04 recovery authority: `R04_UNKNOWN_RECOVERY_DECISION_AND_RELEASE_2026-09-17.md`;
- R04 old-job start: `raw/R04_01_START_2026-09-17.md`, `analysis/R04_01_START_2026-09-17.md`;
- R04 old-job timeout submit: `raw/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md`, `analysis/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md`;
- R04 old-job local inspection: `raw/R04_03_ITEMS_PAGE_UNKNOWN_2026-09-17.md`, `analysis/R04_03_ITEMS_PAGE_UNKNOWN_ANALYSIS_2026-09-17.md`;
- R04 old-job no-due collect: `raw/R04_04_COLLECT_NO_DUE_AFTER_UNKNOWN_2026-09-17.md`, `analysis/R04_04_COLLECT_NO_DUE_AFTER_UNKNOWN_2026-09-17.md`.

Evidence rule:

`QUERY-SPECIFIC FRESH RESEARCH/RELEASE -> PROVIDER LIFECYCLE -> FULL RESPONSE PERSIST -> REMOTE READBACK -> FULL ANALYSIS/DECISION -> NEXT ACTION`.

## Closed Search evidence

```text
S01 ии агенты для маркетплейсов = CLOSED / 20
S02 ии агент для озон = CLOSED / 20
S03 ии агент для wildberries = CLOSED / 20
R01 подключить chatgpt к маркетплейсу = CLOSED / 20
R02 chatgpt для ozon = CLOSED / 20
R03 chatgpt для wildberries = CLOSED / 20
F2_PAIRED_VERDICT = F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH
F2_ORDINARY_SEARCH_INFORMATION_SATURATED = YES
```

## Current query — R04 `аналитика маркетплейсов для селлеров`

### Original job disposition

Original job:

```text
jobId = octoport-serp-r04-20260917
```

Start passed normally. The first and only provider submit timed out ambiguously and became durable `UNKNOWN` without an operation id:

```text
request_executed = UNKNOWN
last.code = ASYNC_OPERATION_TIMEOUT / ASYNC_TIMEOUT family
last.operation_id = null
UNKNOWN = 1
requests_started = 1
operations_accepted = 0
polls_started = 0
unresolved = 1
revision = 2
```

A local `itemsPage` then confirmed `UNKNOWN`, `operation_id=null`, `poll_count=0`. One separately released bounded `collectN` then returned:

```text
request_executed = false
provider_calls = 0
last.code = NO_DUE_OPERATIONS
UNKNOWN = 1
WAITING = 0
SUCCEEDED = 0
requests_started = 1
operations_accepted = 0
polls_started = 0
unresolved = 1
revision = 2
```

This proved that the old item is not collectable through the current job state. It did NOT prove that the timed-out request never reached Yandex.

Fresh Bridge inspection on `MaksimUnimax/Yandex_direct@hotfix/ymb-017-qualification-fix-2026-09-16` established:

- current public async protocol has no `reconcileUnknown` / `recover` action;
- submit on durable `UNKNOWN` requires reconciliation;
- collect selects `WAITING` and requires `operation_id`;
- worker recovery does not automatically replay ambiguous provider work.

Fresh official Yandex documentation established that deferred Search requires retaining the returned `Operation.id` for later `Get`; the Search API Operation reference exposes `Get` and `Cancel`, with no documented list/recovery-by-query path for a lost operation id.

Therefore the earlier rule `do not create another R04 job; continue same job with collectN` is now superseded by the complete recovery investigation.

Current old-job status:

```text
R04_OLD_JOB = octoport-serp-r04-20260917
R04_OLD_JOB_STATUS = FROZEN_TRANSPORT_UNKNOWN
R04_OLD_JOB_RESUBMIT = FORBIDDEN
R04_OLD_JOB_COLLECT = STOPPED_NO_DUE
R04_OLD_JOB_EXPORT = FORBIDDEN
R04_OLD_JOB_SEMANTIC_USE = FORBIDDEN
R04_OLD_JOB_HISTORY = PRESERVE
```

No zero-demand or negative-intent conclusion is permitted from this incident.

### Controlled R04 recovery acquisition

The R04 SEO question remains unresolved and high-information-gain. R05 cannot be released before R04 query closure under the current provider release rule.

A separately documented recovery decision therefore authorizes one fresh bounded acquisition for the SAME R04 query:

```text
QUERY_ID = R04-R1
QUERY_TEXT = аналитика маркетплейсов для селлеров
JOB_ID = octoport-serp-r04r1-20260917
maxRequests = 1
maxCostRub = 0.0305
```

This is not a resubmit of an accepted operation. The original job has no accepted operation id and remains frozen as immutable technical history. A possible duplicate provider execution/charge from the timed-out first attempt cannot be ruled out and is recorded explicitly.

Only the local recovery `start` is currently released. Provider submit remains blocked until the new start envelope is persisted and remotely read back.

## Current hard gate

```text
CURRENT_STAGE = M3 ORDINARY YANDEX SERP COLLECTION
CURRENT_QUERY = R04
R04_QUERY = аналитика маркетплейсов для селлеров
R04_OLD_JOB = FROZEN_TRANSPORT_UNKNOWN / PRESERVED
R04_OLD_JOB_SECOND_SUBMIT = FORBIDDEN
R04_OLD_JOB_FURTHER_COLLECT = FORBIDDEN
R04_QUERY_SEMANTIC_RESULT = NOT YET OBTAINED
R04_CONTROLLED_RECOVERY = PASS / RELEASED
R04_R1_JOB_ID = octoport-serp-r04r1-20260917
R04_R1_START = RELEASED EXACTLY ONCE
R04_R1_SUBMIT = BLOCKED UNTIL START PERSISTENCE + READBACK + ANALYSIS
R04_R1_COLLECT = BLOCKED
R04_R1_EXPORT = BLOCKED
R05 = BLOCKED UNTIL R04 QUERY CLOSURE
NEXT_PHYSICAL_ACTION = EXECUTE EXACTLY ONE LOCAL START FOR R04-R1 AND RETURN COMPLETE SEARCH_ASYNC_BATCH_RESULT_V1
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
```

## Exact currently released command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r04r1-20260917","queries":["аналитика маркетплейсов для селлеров"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```
