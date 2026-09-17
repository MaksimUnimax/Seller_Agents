# R06 delivery-composer error analysis

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / R06 helper-intent boundary`.

## Returned error

```text
bridge = yandex-marketing-bridge
version = 0.1.9
status = ERROR
service = wordstat
channel = manual
stage = DELIVERY_COMPOSER
code = COMPOSER_NOT_FOUND
recoverable = true
request_executed = false
automatic_retry = false
run_id = null
operation = null
operation_id = null
autorun_continues = false
```

## Interpretation

This is a local UI-delivery failure: the Bridge could not find the ChatGPT composer while attempting delivery. The envelope contains no provider operation identity and explicitly reports `request_executed=false`.

However, because the failure occurs at `DELIVERY_COMPOSER`, it is not sufficient by itself to prove whether the earlier **local-only R06 `start` state mutation** was or was not committed before delivery failed. A local `start` would not require a Yandex provider request, so `request_executed=false` proves that no provider request was executed but does not, by itself, safely prove that the local R06 job does not exist.

Therefore blindly repeating `start` is not authorized yet. The safe recovery is a non-provider local-state diagnostic for the planned job ID.

## Recovery gate

```text
R06_PROVIDER_REQUEST_EXECUTED = false
R06_PROVIDER_OPERATION_ID = null
R06_PROVIDER_COST_RISK_FROM_THIS_ERROR = NONE OBSERVED
R06_LOCAL_START_RESULT = NOT DELIVERED
R06_LOCAL_JOB_EXISTENCE = UNRESOLVED
R06_SECOND_START = NOT AUTHORIZED
R06_SUBMIT = BLOCKED
R06_STATUS_DIAGNOSTIC = SAFE / NON-PROVIDER / NEXT
```

Expected recovery branches:

- if local `status` shows `PENDING=1` / revision 0, treat the original local start as having succeeded and persist that state; do **not** start again;
- if local `status` says the job is absent/not found, then separately release exactly one fresh local `start` with the same R06 job ID;
- if `status` itself returns another delivery/UI error, persist it and stop; do not infer local state or submit provider work.

No semantic Search conclusion is drawn from this UI-delivery failure.
