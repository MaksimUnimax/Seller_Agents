# R08 second collect analysis — NO_DUE_OPERATIONS

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R08 advertising-analysis boundary`.  
Job: `octoport-serp-r08-20260917`.  
Operation: `sprvt6p3aq5uj96uqs0b`.

## Returned state

```text
action = collectN
ok = true
request_executed = false
provider_calls = 0
processed = 1
normalized = 0
bounded_stop = false
last.code = NO_DUE_OPERATIONS
WAITING = 1
SUCCEEDED = 0
FAILED = 0
UNKNOWN = 0
requests_started = 1
operations_accepted = 1
polls_started = 0
unresolved = 1
revision = 2
```

## Interpretation

This is again only the Bridge local due-time guard. No provider request and no Yandex operation poll executed. Accepted operation `sprvt6p3aq5uj96uqs0b` remains `WAITING=1`; there is no failure, cancellation, parse failure or UNKNOWN state.

No semantic Search conclusion is permitted. Marketplace-specific WB/Ozon controls remain HOLD. A third bounded `collectN count=1` on the same job is eligible only after this exact raw envelope, this analysis and the shared progress cursor pass remote readback.

## Gate

```text
R08_SUBMIT = PASS / ACCEPTED
R08_OPERATION_ID = sprvt6p3aq5uj96uqs0b
R08_COLLECT_1 = LOCAL NO_DUE / PERSISTED / READBACK
R08_COLLECT_2 = LOCAL NO_DUE / PERSISTED
R08_WAITING = 1
R08_UNKNOWN = 0
R08_POLLS_STARTED = 0
R08_REVISION = 2
R08_SECOND_START = FORBIDDEN
R08_SECOND_SUBMIT = FORBIDDEN
R08_COLLECT_3 = ELIGIBLE AFTER REMOTE READBACK + PROGRESS UPDATE
R08_EXPORT = BLOCKED
R08_MARKETPLACE_SPECIFIC_PAIR = HOLD
R09 = BLOCKED UNTIL R08 QUERY CLOSURE
```
