# R12 terminal collect analysis — PASS

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R12 AI-selection intent`.  
Job: `octoport-serp-r12-20260917`.  
Operation: `sprg1h1jiado7rud8j2b`.

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
operation_id = sprg1h1jiado7rud8j2b
PENDING = 0
WAITING = 0
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

The accepted R12 Yandex operation was polled once and returned successfully. The result was normalized successfully. There is no unresolved item and no failed, parse-failed, cancelled or UNKNOWN state.

R12 therefore enters **export-only** mode:

- no further `start`;
- no further `submitN`;
- no further `collectN`;
- exactly one revision-pinned `exportPage` for revision 5 becomes eligible only after this raw envelope, this analysis and progress are durably persisted and remotely read back;
- M3 is not closed until the complete R12 export is persisted losslessly and the full bounded top-20 is analyzed.

## Gate

```text
R12_TERMINAL_SUCCESS = YES
R12_OPERATION_ID = sprg1h1jiado7rud8j2b
R12_SUCCEEDED = 1
R12_POLLS_STARTED = 1
R12_UNRESOLVED = 0
R12_ALL_SUCCESSFUL = true
R12_REVISION = 5
R12_PROVIDER_EXECUTION = CLOSED
R12_MODE = EXPORT-ONLY
R12_EXPORT_PAGE = ELIGIBLE AFTER RAW+ANALYSIS+PROGRESS REMOTE READBACK
R12_MORE_COLLECT = FORBIDDEN
M3_CLOSURE = BLOCKED UNTIL EXPORT + LOSSLESS PERSISTENCE + ALL20 ANALYSIS + READBACK
```

Exact next action after durable readback:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"exportPage","jobId":"octoport-serp-r12-20260917","after":-1,"limit":25,"revision":5}
```
