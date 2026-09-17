# R09 collect 1 analysis — LOCAL NO_DUE / PASS

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R09 seller search-analytics boundary`.  
Job: `octoport-serp-r09-20260917`.  
Accepted operation: `sprut2nra25h2lmi10hv`.

## Returned state

```text
action = collectN
ok = true
request_executed = false
provider_calls = 0
processed = 1
normalized = 0
bounded_stop = false
last.outcome = null
last.code = NO_DUE_OPERATIONS
last.index = null
last.operation_id = null
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

## Interpretation

This is the expected Bridge local timing guard. The accepted deferred operation remains the same upstream operation `sprut2nra25h2lmi10hv`; this collect action did not call Yandex, did not create a new operation, did not poll the provider, and did not change revision/state.

Therefore:

- do not treat `NO_DUE_OPERATIONS` as provider failure or Search zero-result evidence;
- do not start or submit again;
- do not export yet;
- one further bounded `collectN count=1` may be released only after raw/analysis/progress remote readback;
- no semantic R09 conclusion is permitted yet;
- R10 remains blocked.

## Gate

```text
R09_START = PASS / READBACK
R09_SUBMIT = PASS / ACCEPTED / READBACK
R09_OPERATION_ID = sprut2nra25h2lmi10hv
R09_COLLECT_1 = LOCAL NO_DUE
R09_COLLECT_1_PROVIDER_CALLS = 0
R09_WAITING = 1
R09_POLLS_STARTED = 0
R09_UNKNOWN = 0
R09_REVISION = 2
R09_SECOND_START = FORBIDDEN
R09_SECOND_SUBMIT = FORBIDDEN
R09_COLLECT_2 = ELIGIBLE AFTER REMOTE READBACK + PROGRESS UPDATE
R09_EXPORT = BLOCKED
R10 = BLOCKED
```

Exact next action after durable readback:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r09-20260917","count":1}
```
