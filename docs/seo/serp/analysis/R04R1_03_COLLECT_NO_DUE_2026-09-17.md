# R04-R1 collect analysis — NO_DUE_OPERATIONS

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R04 controlled recovery`.  
Job: `octoport-serp-r04r1-20260917`.  
Operation: `sprqtqegnppne4lqbf2t`.

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
control = RUNNING
total = 1
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

This is a local not-due guard, not a provider result. No provider request or poll was executed. The accepted operation remains in `WAITING=1`; the durable operation identity from the accepted submit remains `sprqtqegnppne4lqbf2t`.

No semantic conclusion is permitted. This does not represent zero results, failure, timeout, or completion.

Following the accepted deferred-search lifecycle already used for R03, another separately released bounded `collectN` on the same job is appropriate after this raw envelope, this analysis, and progress state pass remote readback.

## Gate

```text
R04_R1_SUBMIT = PASS / ACCEPTED
R04_R1_OPERATION_ID = sprqtqegnppne4lqbf2t
R04_R1_COLLECT_1 = LOCAL NO_DUE / PERSISTED
R04_R1_WAITING = 1
R04_R1_UNKNOWN = 0
R04_R1_POLLS_STARTED = 0
R04_R1_REVISION = 2
R04_R1_SECOND_SUBMIT = FORBIDDEN
R04_R1_COLLECTN_NEXT = ELIGIBLE AFTER REMOTE READBACK + PROGRESS UPDATE
R04_R1_EXPORT = BLOCKED
R05 = BLOCKED UNTIL R04 QUERY CLOSURE
```
