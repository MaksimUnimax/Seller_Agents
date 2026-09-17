# R09 terminal collect analysis — SUCCEEDED

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R09 seller search-analytics boundary`.  
Job: `octoport-serp-r09-20260917`.  
Operation: `sprut2nra25h2lmi10hv`.

## Returned state

```text
action = collectN
ok = true
request_executed = true
provider_calls = 1
processed = 1
normalized = 1
bounded_stop = false
last.outcome = received
last.code = null
last.index = 0
last.operation_id = sprut2nra25h2lmi10hv
PENDING = 0
SUBMITTING = 0
WAITING = 0
COLLECTING = 0
RESULT_SAVED = 0
SUCCEEDED = 1
PARSE_FAILED = 0
FAILED = 0
UNKNOWN = 0
CANCELLED = 0
requests_started = 1
operations_accepted = 1
polls_started = 1
unresolved = 0
all_successful = true
busy = false
revision = 5
```

## Interpretation

The same accepted R09 deferred operation `sprut2nra25h2lmi10hv` was polled and completed successfully. Provider lifecycle is terminal and clean: one normalized successful result, no unresolved item, no failure, parse failure, cancellation or UNKNOWN state.

R09 is not semantically closed yet. The complete revision-5 export must be obtained, persisted losslessly, remotely read back and reviewed in full before any intent conclusion or transition to R10.

No further `start`, `submitN` or `collectN` is permitted for this job.

## Gate

```text
R09_PRE_STEP = PASS / PERSISTED / READBACK
R09_START = PASS / PERSISTED / READBACK
R09_SUBMIT = PASS / ACCEPTED / PERSISTED / READBACK
R09_COLLECT_1 = LOCAL NO_DUE / PERSISTED / READBACK
R09_COLLECT_2 = PASS / PROVIDER-BACKED SUCCESS
R09_OPERATION_ID = sprut2nra25h2lmi10hv
R09_SUCCEEDED = 1
R09_UNRESOLVED = 0
R09_ALL_SUCCESSFUL = true
R09_REVISION = 5
R09_FURTHER_START_SUBMIT_COLLECT = FORBIDDEN
R09_EXPORT_PAGE_REV5 = ELIGIBLE AFTER RAW+ANALYSIS+PROGRESS REMOTE READBACK
R09_SEMANTIC_RESULT = BLOCKED UNTIL COMPLETE EXPORT + FULL ANALYSIS
R10 = BLOCKED UNTIL R09 QUERY CLOSURE
```

Exact next action after durable readback:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"exportPage","jobId":"octoport-serp-r09-20260917","after":-1,"limit":25,"revision":5}
```