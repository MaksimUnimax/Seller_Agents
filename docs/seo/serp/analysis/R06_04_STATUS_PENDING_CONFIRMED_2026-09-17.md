# R06 delivered-status analysis — original local start confirmed

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R06 helper-intent boundary`.  
Job: `octoport-serp-r06-20260917`.

## Returned state

```text
action = status
ok = true
request_executed = false
provider_calls = 0
control = RUNNING
total = 1
PENDING = 1
WAITING = 0
SUCCEEDED = 0
FAILED = 0
UNKNOWN = 0
requests_started = 0
operations_accepted = 0
polls_started = 0
unresolved = 1
all_successful = false
busy = false
revision = 0
```

## Interpretation

The original local `start` did succeed before its delivery response failed. The durable R06 job exists with exactly one `PENDING` item at revision 0. The prior delivery-layer errors did not create a provider operation and did not alter the job into an UNKNOWN state.

Therefore:

- a second `start` is permanently forbidden;
- the next eligible lifecycle action is exactly one `submitN count=1` on this existing job;
- no collect/export action is eligible yet;
- no semantic Search conclusion is permitted yet.

## Gate

```text
R06_START = PASS / RECOVERED BY STATUS
R06_JOB_EXISTS = YES
R06_PENDING = 1
R06_UNKNOWN = 0
R06_REQUESTS_STARTED = 0
R06_OPERATIONS_ACCEPTED = 0
R06_REVISION = 0
R06_SECOND_START = FORBIDDEN
R06_SUBMIT_ONE = ELIGIBLE AFTER RAW+ANALYSIS+PROGRESS REMOTE READBACK
R06_COLLECT = BLOCKED
R06_EXPORT = BLOCKED
R08 = BLOCKED UNTIL R06 QUERY CLOSURE
```
