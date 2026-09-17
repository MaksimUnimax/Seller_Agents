# R04 recovery analysis — durable UNKNOWN confirmed by itemsPage

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04-20260917`.  
Status: **HOLD / DURABLE UNKNOWN CONFIRMED / NO SAFE PROVIDER LIFECYCLE ACTION UNDER CURRENT BRIDGE CONTRACT**.

## 1. Exact inspection result

The owner executed the previously released local-only inspection:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"itemsPage","jobId":"octoport-serp-r04-20260917","after":-1,"limit":25}
```

Returned:

```text
action = itemsPage
ok = true
request_executed = false
provider_calls = 0
row.index = 0
row.state = UNKNOWN
row.operation_id = null
row.poll_count = 0
row.error_code = ASYNC_TIMEOUT
row.parse_error = null
next_after = 0
```

Raw authority:

`../raw/R04_03_ITEMS_PAGE_UNKNOWN_2026-09-17.md`.

## 2. Meaning

The local durable record did not recover after the submit timeout:

- state is still `UNKNOWN`;
- there is still no `operation_id`;
- no provider-backed poll has ever started;
- no parse error exists;
- this inspection itself made no provider call.

Therefore the previous ambiguity is now confirmed as the durable Bridge state, not a transient display artifact.

This still does **not** prove that Yandex definitely did not receive the original WebSearchAsync request. The submit envelope's authoritative field remains `request_executed=UNKNOWN`.

## 3. Current official-provider recovery check

Current Yandex Cloud operation documentation was rechecked on 2026-09-17.

Relevant official sources:

- `https://yandex.cloud/en/docs/api-design-guide/concepts/operation`
- `https://yandex.cloud/en/docs/api-design-guide/concepts/about-async`
- `https://yandex.cloud/en/docs/audit-trails/concepts/events`

Observed provider-control facts:

1. `Operation.Get` requires an already-known operation ID.
2. Generic `ListOperations` is documented for a specific resource; it is not a universal enumeration of all operation IDs across a service.
3. The current Audit Trails control-plane event reference for Yandex Search API lists customer-management events, not WebSearchAsync execution events.
4. No Search-API-specific documented endpoint was found that enumerates a lost WebSearchAsync operation by folder/query/time/request after the caller failed to receive the operation ID.

Therefore there is no verified provider-side recovery command that Main Chat can safely issue through the current Bridge contract.

## 4. Bridge-code/evidence check

Accessible project repositories/evidence were searched for documented `ASYNC_TIMEOUT`, `UNKNOWN`, `itemsPage`, and lost-operation recovery handling. No established Bridge action such as `recoverUnknown`, `reconcileUnknown`, or provider-operation enumeration was found in the searched accessible code/evidence.

No invented action will be released.

## 5. Safety decision

```text
R04_SUBMIT_OUTCOME = INDETERMINATE
R04_DURABLE_STATE = UNKNOWN
R04_OPERATION_ID = NULL
R04_POLL_COUNT = 0
R04_ERROR_CODE = ASYNC_TIMEOUT
R04_SECOND_START = FORBIDDEN
R04_SECOND_SUBMIT = FORBIDDEN
R04_COLLECTN = FORBIDDEN_WITHOUT_OPERATION_ID
R04_EXPORT = FORBIDDEN
R05 = BLOCKED
SEMANTIC_CONCLUSION_FROM_R04 = NONE
```

Why:

- resubmitting could duplicate a provider request/cost if the first request crossed the provider boundary but its Operation response was lost;
- collecting is impossible to justify without an operation identity or collectable durable state;
- treating the query as zero/failed would convert transport ambiguity into false semantic evidence.

## 6. Required recovery class

R04 is now a **Bridge reliability blocker**, not a Search-intent result.

Before R04 can resume, one of these must become true through an explicit, evidence-backed Bridge/provider reconciliation step:

1. the lost provider operation ID is recovered and durably attached to this exact job item; or
2. it is proven that the original request did not reach/create a provider operation, using a provider/Bridge mechanism that is authoritative enough to make a resubmit safe; or
3. the Bridge implements and verifies a bounded UNKNOWN-recovery protocol that prevents duplicate billable submission.

Until then, no provider action is authorized for R04 or later M3 queries.

## 7. Cursor

```text
CURRENT_QUERY = R04
R04_STATE = HOLD / BRIDGE_UNKNOWN_RECOVERY_BLOCKER
NEXT_PROVIDER_ACTION = NONE
NEXT_SAFE_WORK = BRIDGE UNKNOWN/ASYNC_TIMEOUT RECOVERY RECONCILIATION / PATCH DESIGN
M3_PROVIDER_COLLECTION = PAUSED AT R04
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
```
