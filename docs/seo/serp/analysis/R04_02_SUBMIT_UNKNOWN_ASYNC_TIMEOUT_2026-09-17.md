# R04 lifecycle analysis — submit outcome UNKNOWN / ASYNC_TIMEOUT

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04-20260917`.  
Status: **SUBMIT INDETERMINATE / RAW PERSISTED + REMOTE READBACK PASS / NO RESUBMIT / LOCAL ITEM INSPECTION REQUIRED**.

## Observed Bridge facts

```text
action = submitN
ok = false
request_executed = UNKNOWN
provider_calls = 0
processed = 1
normalized = 0
bounded_stop = false
last.outcome = unknown
last.code = ASYNC_TIMEOUT
last.index = 0
last.operation_id = null
control = RUNNING
total = 1
PENDING = 0
SUBMITTING = 0
WAITING = 0
SUCCEEDED = 0
PARSE_FAILED = 0
FAILED = 0
UNKNOWN = 1
CANCELLED = 0
requests_started = 1
operations_accepted = 0
polls_started = 0
unresolved = 1
all_successful = false
busy = false
revision = 2
```

## Persistence/readback

Exact owner-returned envelope is persisted at:

`../raw/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md`.

Remote branch readback returned the complete envelope without drift.

```text
RAW_PERSISTENCE = PASS
REMOTE_READBACK = PASS
REQUEST_EXECUTED_UNKNOWN = CONFIRMED
ASYNC_TIMEOUT = CONFIRMED
UNKNOWN_ONE = CONFIRMED
OPERATION_ID_NULL = CONFIRMED
REQUESTS_STARTED_ONE = CONFIRMED
OPERATIONS_ACCEPTED_ZERO = CONFIRMED
REVISION_TWO = CONFIRMED
```

## Safety interpretation

This is not equivalent to a normal rejected submit and it is not evidence that the provider definitely received nothing.

`request_executed="UNKNOWN"` is authoritative ambiguity. `provider_calls=0` is therefore not sufficient evidence that a network request could not have crossed the provider boundary before the timeout was observed.

Consequences:

- a second `submitN` is forbidden because it could duplicate a provider operation/cost if the first request reached Yandex but its Operation response was lost;
- `collectN` is not yet justified because the returned envelope has no persisted `operation_id` and the item is not in `WAITING`;
- no zero-demand, provider-failure, or semantic conclusion is allowed;
- R05 and all later provider queries remain blocked.

Official Yandex asynchronous-operation semantics use the returned Operation object/ID as the monitoring handle. No Search-specific operation-recovery/list command has been established in the current Bridge contract for this timeout path.

## Safe recovery precedent

The accepted Bridge control surface includes a local, non-provider item inspection action used in prior deferred/indeterminate-state recovery:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"itemsPage","jobId":"octoport-serp-r04-20260917","after":-1,"limit":25}
```

Purpose: inspect the durable item state without issuing another Search submission.

The inspection must determine whether durable state contains any of:

```text
state
operation_id
submit_attempt
collect_attempt
next_poll_at
poll_count
submitted_at
last_polled_at
result_saved_at
parse_error
```

Decision after `itemsPage`:

1. If a non-null operation ID is durably present and the item is `WAITING`/collectable, preserve/read back that inspection and resume only the existing operation with bounded `collectN`.
2. If the item remains `UNKNOWN` with no operation ID, do not resubmit and do not collect. Keep R04 on HOLD for explicit provider/Bridge reconciliation.
3. If the item has become terminal, preserve that exact terminal state and follow the corresponding terminal gate.

## Current hard gate

```text
R04_START = PASS / PERSISTED / READBACK
R04_SUBMIT = INDETERMINATE / ASYNC_TIMEOUT / UNKNOWN
R04_REQUEST_EXECUTED = UNKNOWN
R04_OPERATION_ID = NULL
R04_UNKNOWN = 1
R04_SECOND_SUBMIT = FORBIDDEN
R04_COLLECTN = BLOCKED UNTIL DURABLE OPERATION ID / COLLECTABLE STATE IS PROVEN
R04_EXPORT = BLOCKED
R05 = BLOCKED
NEXT_SAFE_ACTION = LOCAL itemsPage INSPECTION ONLY
```
