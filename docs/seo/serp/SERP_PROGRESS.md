# SEO SERP collection — execution progress

Date: 2026-09-17.  
Branch: `seo/wordstat-batch-01-2026-09-16`.  
Status: **M2R RECONCILED / S01-S03 CLOSED / R01-R03 F2 BLOCK CLOSED / R04 OLD JOB FROZEN UNKNOWN / R04-R1 SUBMIT PASS / ONE COLLECT RELEASED**.

## Authorities

- master roadmap: `../SEO_MASTER_ROADMAP_2026-09-16.md`;
- execution rules: `../EXECUTION_RULES.md`;
- provider release hard gate: `../PROVIDER_QUERY_RELEASE_RULE.md`;
- current M3 matrix: `M3_QUERY_MATRIX_2026-09-17.md`;
- original R04 release: `R04_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md`;
- R04 recovery authority: `R04_UNKNOWN_RECOVERY_DECISION_AND_RELEASE_2026-09-17.md`;
- old R04 technical history: `raw/R04_01_START_2026-09-17.md`, `raw/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md`, `raw/R04_03_ITEMS_PAGE_UNKNOWN_2026-09-17.md`, `raw/R04_04_COLLECT_NO_DUE_AFTER_UNKNOWN_2026-09-17.md`;
- recovery start: `raw/R04R1_01_START_2026-09-17.md`, `analysis/R04R1_01_START_2026-09-17.md`;
- recovery submit: `raw/R04R1_02_SUBMIT_2026-09-17.b64`, `analysis/R04R1_02_SUBMIT_2026-09-17.md`.

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

Original job `octoport-serp-r04-20260917` remains frozen as `FROZEN_TRANSPORT_UNKNOWN`, preserved only as technical history. It has no semantic use and receives no further submit/collect/export actions.

Controlled recovery job:

```text
QUERY_ID = R04-R1
JOB_ID = octoport-serp-r04r1-20260917
QUERY = аналитика маркетплейсов для селлеров
```

Recovery start passed and was persisted/read back.

The one released provider submit returned:

```text
action = submitN
ok = true
request_executed = true
provider_calls = 1
processed = 1
normalized = 0
bounded_stop = false
last.outcome = accepted
last.code = null
last.index = 0
last.operation_id = sprqtqegnppne4lqbf2t
control = RUNNING
total = 1
PENDING = 0
SUBMITTING = 0
WAITING = 1
COLLECTING = 0
RESULT_SAVED = 0
SUCCEEDED = 0
PARSE_FAILED = 0
FAILED = 0
UNKNOWN = 0
CANCELLED = 0
requests_started = 1
operations_accepted = 1
polls_started = 0
unresolved = 1
all_successful = false
busy = false
revision = 2
```

The connector blocked direct raw Markdown persistence, so the exact envelope is preserved losslessly as Base64 at:

`raw/R04R1_02_SUBMIT_2026-09-17.b64`

Decoded identity:

```text
UTF8_BYTES = 642
SHA256 = 9fe964233e17c10438ba0ba620460d9a4ef6d0cd1045e56d6f23d81521c50150
```

Remote readback of both lossless raw and submit analysis passed.

Interpretation: the new recovery job is now in the normal deferred lifecycle with an accepted, durable operation identity `sprqtqegnppne4lqbf2t` and `WAITING=1`. There is no `UNKNOWN` state on this job.

Exactly one bounded collect is now released. A local `NO_DUE_OPERATIONS` response remains possible and must be persisted/read back before any further collect. A provider-backed terminal response must likewise be persisted/read back before export.

## Current hard gate

```text
CURRENT_STAGE = M3 ORDINARY YANDEX SERP COLLECTION
CURRENT_QUERY = R04
R04_OLD_JOB = FROZEN_TRANSPORT_UNKNOWN / PRESERVED
R04_OLD_JOB_FURTHER_ACTIONS = FORBIDDEN
R04_R1_JOB_ID = octoport-serp-r04r1-20260917
R04_R1_START = PASS / PERSISTED / READBACK
R04_R1_SUBMIT = PASS / PERSISTED / READBACK
R04_R1_OPERATION_ID = sprqtqegnppne4lqbf2t
R04_R1_WAITING = 1
R04_R1_UNKNOWN = 0
R04_R1_REVISION = 2
R04_R1_SECOND_START = FORBIDDEN
R04_R1_SECOND_SUBMIT = FORBIDDEN
R04_R1_COLLECTN_COUNT_1 = RELEASED EXACTLY ONCE
R04_R1_EXPORT = BLOCKED UNTIL TERMINAL COLLECT PERSISTENCE + READBACK
R05 = BLOCKED UNTIL R04 QUERY CLOSURE
NEXT_PHYSICAL_ACTION = EXECUTE EXACTLY ONE collectN count=1 ON R04-R1 AND RETURN COMPLETE SEARCH_ASYNC_BATCH_RESULT_V1
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
```

## Exact currently released command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r04r1-20260917","count":1}
```
