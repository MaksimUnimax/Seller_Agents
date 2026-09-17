# R01 second collect analysis — not due

Date: 2026-09-17.
Raw authority: `../raw/R01_04_COLLECT_NOT_DUE_2026-09-17.md`.
Status: **SECOND LOCAL NOT-DUE GUARD / OPERATION STILL WAITING / NEXT COLLECT MAY BE ATTEMPTED**.

## Observed bridge state

```text
action = collectN
job_id = octoport-serp-r01-20260917
ok = true
request_executed = false
provider_calls = 0
processed = 1
normalized = 0
bounded_stop = false
code = NO_DUE_OPERATIONS
control = RUNNING
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

The second collection attempt was again stopped locally by the Bridge because the deferred operation was not yet due for polling. Yandex was not contacted. The authoritative accepted operation remains `sprsmko0p531abn82fmk`.

The lifecycle state is unchanged from the first not-due guard. This is neither provider failure nor zero-results evidence, and it does not justify resubmission or a new job.

## Hard checks

```text
JOB_ID_MATCH = PASS
SECOND_NOT_DUE_LOCAL_ONLY = PASS
REQUEST_EXECUTED_FALSE = PASS
PROVIDER_CALLS_ZERO = PASS
POLLS_STARTED_ZERO = PASS
WAITING_ONE = PASS
UNRESOLVED_ONE = PASS
REVISION_UNCHANGED = PASS
ACCEPTED_OPERATION_STILL_AUTHORITATIVE = sprsmko0p531abn82fmk
SECOND_SUBMIT_ALLOWED = false
EXPORT_ALLOWED = false
SEMANTIC_CONCLUSION_ALLOWED = false
```

## Next-action decision

The only valid lifecycle continuation remains another bounded collection attempt against the same job:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r01-20260917","count":1}
```

If Bridge again returns local `NO_DUE_OPERATIONS` with zero provider calls, preserve it and keep the operation in WAITING state. If a provider-backed collect occurs, preserve the complete envelope and operation/result truth before any export decision.

Not authorized:

- any second `submitN`;
- new `start`;
- `exportPage` before successful collect/readback;
- R02 or later queries.
