# R04 — UNKNOWN recovery decision and bounded fresh-acquisition release

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R04 F3+F9`.  
Status: **CURRENT / RECOVERY DECISION PASS / ONE LOCAL RECOVERY START RELEASED**.

## 1. Purpose

Resolve the execution dead-end after the first R04 deferred submit became a durable `UNKNOWN` without an `operation_id`, without converting technical uncertainty into SEO evidence and without blindly replaying the old async operation.

Query remains:

```text
R04 = аналитика маркетплейсов для селлеров
FAMILIES = F3, F9
```

The R04 information question from `R04_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md` remains valid and high-value. No semantic result has yet been obtained for R04.

## 2. Durable incident evidence

Original job:

```text
JOB_ID = octoport-serp-r04-20260917
```

Durable raw evidence:

- `raw/R04_01_START_2026-09-17.md` — blob `d4be26213a8b564a682b3e351f5925b01f194102`;
- `raw/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md` — blob `39e9d5d22dd37d6aebb239c31b44ec69c0c8d4a4`;
- `raw/R04_03_ITEMS_PAGE_UNKNOWN_2026-09-17.md` — blob `317272ff64b6187ddab307656942952d756c07a6`;
- `raw/R04_04_COLLECT_NO_DUE_AFTER_UNKNOWN_2026-09-17.md` — blob `9044baea2c095733419273d6eab3568887c6069e`.

Durable analyses:

- `analysis/R04_01_START_2026-09-17.md` — blob `9b47aa849874b4adfbaf152820f7b9b7aa238351`;
- `analysis/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md` — blob `d1b91ad9c75b579b0e0902be243ac4e40da39bb6`;
- `analysis/R04_03_ITEMS_PAGE_UNKNOWN_ANALYSIS_2026-09-17.md` — blob `b0f8ef87f79bd7b35a9de69787df4b3d6f77667f`;
- `analysis/R04_04_COLLECT_NO_DUE_AFTER_UNKNOWN_2026-09-17.md` — blob `8b215a6ca58c485381a470e7bab7cdd6bfe06cbf`.

Latest authoritative state after `collectN`:

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

The latest `collectN` made no provider call and did not change the durable item state.

## 3. Exact semantic boundary

The old job is technical execution evidence only.

```text
UNKNOWN != FAILED MARKET DEMAND
NO_DUE_OPERATIONS != ZERO RESULTS
operations_accepted=0 != proof that the timed-out HTTP request never reached Yandex
provider_calls=0 in the Bridge envelope != proof of provider non-execution when request_executed=UNKNOWN
```

Therefore:

```text
R04_OLD_JOB_SEMANTIC_RESULT = NONE
R04_OLD_JOB_NEGATIVE_EVIDENCE = NONE
```

## 4. Current Bridge implementation proof

Fresh implementation authority inspected on:

`MaksimUnimax/Yandex_direct@hotfix/ymb-017-qualification-fix-2026-09-16`

Relevant files:

- `extension/src/shared/search_async_protocol.js` — blob `91df9051f4cf52d51ee73af9c66a196411a966d7`;
- `extension/src/shared/search_async_runtime.js` — blob `571debe536e634aad1ed280f215c4e35b19925ae`;
- `extension/src/shared/search_async_store.js` — blob `1de12e529141649eb4a0f94cac155ab32f38b0dd`;
- `extension/src/shared/search_async_transport.js` — blob `4926e75feae5a61331c029b7c53507031d320042`;
- `extension/src/shared/search_async_policy.js` — blob `0fe7c0cd0e3419b5be3773b207014210f4646259`;
- `extension/src/search_async_worker_transport.js` — current branch implementation inspected;
- `extension/tests/search_batch_recovery.test.mjs` — recovery safety test inspected.

Current public async protocol actions are:

```text
start
submitOne
submitN
collectOne
collectN
status
itemsPage
pause
resume
cancelPending
exportPage
normalizeSaved
```

There is no public `reconcileUnknown`, `recover`, `attachOperation`, or equivalent reconciliation action in the current protocol.

Current state-machine behavior:

- submit work does not treat durable `UNKNOWN` as a normal submit candidate;
- attempting to claim an `UNKNOWN` submit requires reconciliation (`UNKNOWN_SUBMIT_REQUIRES_RECONCILIATION`);
- collect work selects `WAITING` operations and requires an `operation_id`;
- the current R04 item is `UNKNOWN` with `operation_id=null`, so `collectN` correctly returns `NO_DUE_OPERATIONS`;
- worker recovery preserves ambiguous execution as `UNKNOWN` and does not replay provider work automatically.

Recovery safety tests encode the same principle: ambiguous paid/provider execution must be reconciled before replay; automatic replay is forbidden.

## 5. Fresh official Yandex provider reconciliation check

Official sources rechecked on 2026-09-17:

1. WebSearchAsync request reference:
   `https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`
2. Deferred Search lifecycle:
   `https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`
3. Search API Operation reference:
   `https://aistudio.yandex.ru/docs/en/search-api/api-ref/Operation/index.html`

Current official contract:

- deferred Search returns an `Operation` object containing its `id`;
- Yandex explicitly instructs the caller to save that `Operation.id` for later status retrieval;
- later retrieval is `GET .../operations/<operation_id>`;
- the Search API Operation reference documents `Get` and `Cancel` methods;
- no documented Search API method was found to list operations or recover an unknown operation by query text/request body after its id was lost.

Therefore the current R04 old job cannot be deterministically reconciled through the documented provider surface available to this workflow because its operation id was never durably obtained.

## 6. Governing project rules

`../EXECUTION_RULES.md` requires:

```text
OUTCOME UNKNOWN != FAILED MARKET DEMAND
Unknown/incomplete states remain unresolved until separately reconciled/released.
```

`../PROVIDER_QUERY_RELEASE_RULE.md` requires:

```text
query closure -> only then release another query
```

and forbids blind resubmission of accepted async work.

Consequences:

- R05 MUST NOT be released while R04 has no usable Search result;
- the old job MUST NOT receive another `submitN`;
- the old job MUST NOT be treated as a valid zero;
- because no accepted operation id exists, there is no same-operation collect path left.

## 7. Recovery alternatives considered

### A. Repeat `submitN` on the old job

**REJECTED.** State machine requires reconciliation; this would be unsafe/blind.

### B. Keep calling `collectN` on the old job

**REJECTED.** `UNKNOWN` is not `WAITING`; the latest bounded collect already proved there is no due operation.

### C. Skip R04 and release R05

**REJECTED.** Violates the current query-closure gate and leaves the largest corrected analytics family without its intended Search control.

### D. Freeze the old technical attempt and run one separately released fresh R04 acquisition

**ACCEPTED AS RECOVERY PATH.** This is not a replay of an accepted operation: the old job has no accepted `operation_id`. It is a new bounded acquisition attempt for the same unresolved SEO question, after exact diagnosis and an explicit recovery release.

Residual risk: the original timed-out request may have reached Yandex even though its operation id was lost, so one extra provider execution/charge cannot be ruled out. That risk is bounded by the same one-request cap and is preserved explicitly rather than hidden.

## 8. Old-job disposition

```text
R04_OLD_JOB = octoport-serp-r04-20260917
R04_OLD_JOB_STATUS = FROZEN_TRANSPORT_UNKNOWN
R04_OLD_JOB_RESUBMIT = FORBIDDEN
R04_OLD_JOB_COLLECT = STOPPED_NO_DUE
R04_OLD_JOB_EXPORT = FORBIDDEN
R04_OLD_JOB_SEMANTIC_USE = FORBIDDEN
R04_OLD_JOB_HISTORY = PRESERVE
```

The old job is not deleted, rewritten or cosmetically converted to failure/success.

## 9. Controlled fresh-acquisition identity

New recovery job:

```text
QUERY_ID = R04-R1
QUERY_TEXT = аналитика маркетплейсов для селлеров
JOB_ID = octoport-serp-r04r1-20260917
PURPOSE = obtain the still-missing R04 top-20 Search evidence after an unrecoverable transport-UNKNOWN attempt
```

Provider/search settings remain identical to the accepted R04 release:

```text
service = Yandex Search API
mode = Manual / Deferred
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
```

No semantic method changes. The original R04 coding/outcome contract remains authority.

## 10. Recovery release boundary

This artifact releases **only one local `start`** for `octoport-serp-r04r1-20260917`.

It does NOT yet release provider submission.

After the start response:

```text
complete SEARCH_ASYNC_BATCH_RESULT_V1
-> exact/lossless persistence
-> remote readback
-> start analysis
-> progress/release update
-> remote readback
-> only then decide/release one submitN count=1
```

Any unexpected start state => persist/readback and STOP.

## 11. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r04r1-20260917","queries":["аналитика маркетплейсов для селлеров"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local creation only (`request_executed=false`, `provider_calls=0`, one `PENDING` item), but the actual returned envelope is authority.

## 12. Current hard gate

```text
CURRENT_STAGE = M3 ORDINARY YANDEX SERP COLLECTION
CURRENT_QUERY = R04
R04_OLD_JOB = FROZEN_TRANSPORT_UNKNOWN
R04_QUERY_SEMANTIC_RESULT = NOT YET OBTAINED
R04_CONTROLLED_RECOVERY = RELEASED
R04_R1_START = RELEASED
R04_R1_SUBMIT = BLOCKED UNTIL START PERSISTENCE + READBACK
R05 = BLOCKED UNTIL R04 QUERY CLOSURE
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
```

## 13. Plain-language conclusion

The first R04 attempt cannot be safely continued: its provider execution is genuinely unknown and the required operation id was never obtained. Current Bridge code correctly refuses to guess or replay it, while the current public protocol lacks an explicit UNKNOWN-reconciliation command. Yandex's documented Search API also requires the operation id for later retrieval and exposes no documented operation-list recovery route for this case.

The correct quality-first recovery is therefore to preserve the old job forever as unresolved transport history, keep R05 blocked, and make one explicitly released fresh R04 acquisition under the same one-request/cost cap. Only the new successful acquisition may supply R04 semantic evidence.