# R04-R1 terminal collect analysis — SUCCEEDED

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R04 controlled recovery`.  
Job: `octoport-serp-r04r1-20260917`.  
Operation: `sprqtqegnppne4lqbf2t`.

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
last.operation_id = sprqtqegnppne4lqbf2t
control = RUNNING
total = 1
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

The same accepted deferred operation `sprqtqegnppne4lqbf2t` was polled and returned successfully. The recovery job is terminal and clean: `SUCCEEDED=1`, `unresolved=0`, `all_successful=true`, with no parse failure, failure, cancellation or UNKNOWN state.

This terminal lifecycle success is not yet the semantic R04 result. The complete normalized export must still be obtained, persisted losslessly, remotely read back and fully analyzed before R04 can close or R05 can be released.

## Gate

```text
R04_R1_START = PASS / PERSISTED / READBACK
R04_R1_SUBMIT = PASS / PERSISTED / READBACK
R04_R1_OPERATION_ID = sprqtqegnppne4lqbf2t
R04_R1_COLLECT_TERMINAL = PASS / SUCCEEDED
R04_R1_SUCCEEDED = 1
R04_R1_UNRESOLVED = 0
R04_R1_ALL_SUCCESSFUL = true
R04_R1_REVISION = 5
R04_R1_FURTHER_COLLECT = FORBIDDEN
R04_R1_EXPORT_PAGE = ELIGIBLE AFTER RAW+ANALYSIS+PROGRESS REMOTE READBACK
R04_SEMANTIC_RESULT = BLOCKED UNTIL COMPLETE EXPORT + ANALYSIS
R05 = BLOCKED UNTIL R04 QUERY CLOSURE
```
