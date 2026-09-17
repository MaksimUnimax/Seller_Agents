# R04 lifecycle analysis — submit outcome UNKNOWN / ASYNC_TIMEOUT

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04-20260917`.  
Status: **SUBMIT UNKNOWN / RAW PERSISTED + READBACK PASS / ITEMS INSPECTED / ONE COLLECTN RECOVERY PROBE RELEASED**.

## Observed Bridge facts

```text
action = submitN
ok = false
request_executed = UNKNOWN
provider_calls = 0
processed = 1
normalized = 0
last.outcome = unknown
last.code = ASYNC_TIMEOUT
last.index = 0
last.operation_id = null
UNKNOWN = 1
requests_started = 1
operations_accepted = 0
polls_started = 0
unresolved = 1
revision = 2
```

Exact raw envelope is persisted at `../raw/R04_02_SUBMIT_UNKNOWN_ASYNC_TIMEOUT_2026-09-17.md` and passed remote readback.

## Correction to prior interpretation

The earlier conclusion that this single timeout made R04 a global Bridge blocker and prohibited `collectN` was too strong and is withdrawn.

What is actually established:

- the item is unresolved and currently recorded as `UNKNOWN`;
- no operation ID was returned in the submit envelope;
- a second `start` or `submitN` must not be issued while this exact job is being recovered;
- prior accepted Deferred Search workflow uses the same existing `jobId` for bounded `collectN` continuation and does not recreate/resubmit the query;
- therefore the next bounded recovery action is one `collectN` against this same job, allowing the Bridge itself to report whether the item is collectable, locally blocked, normalized, or terminal.

No semantic conclusion is drawn from this timeout.

## Current gate

```text
R04_START = PASS / PERSISTED / READBACK
R04_SUBMIT = UNKNOWN / ASYNC_TIMEOUT / PERSISTED / READBACK
R04_SECOND_START = FORBIDDEN
R04_SECOND_SUBMIT = FORBIDDEN
R04_ITEMS_PAGE = COMPLETED / UNKNOWN CONFIRMED
R04_COLLECTN_COUNT_1 = RELEASED
R04_EXPORT = BLOCKED UNTIL COLLECT RESULT
R05 = BLOCKED UNTIL R04 RESOLVED
NEXT_PHYSICAL_ACTION = ONE collectN ON EXISTING JOB
```
