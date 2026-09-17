# R01 collect analysis — not due

Date: 2026-09-17.
Raw authority: `../raw/R01_03_COLLECT_NOT_DUE_2026-09-17.md`.
Status: **LOCAL NOT-DUE GUARD / OPERATION STILL WAITING / NEXT COLLECT MAY BE ATTEMPTED LATER**.

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

This was a local Bridge timing guard, not a provider poll and not a failure. Yandex was not contacted on this action. The previously accepted operation `sprsmko0p531abn82fmk` remains the only authoritative provider operation for R01.

No semantic conclusion is allowed. No second submit is allowed. Export remains blocked because no result has been collected yet.

## Hard checks

```text
JOB_ID_MATCH = PASS
NO_PROVIDER_CALL_ON_NOT_DUE = PASS
NO_PROVIDER_POLL_ON_NOT_DUE = PASS
WAITING_ONE_PRESERVED = PASS
UNRESOLVED_ONE_PRESERVED = PASS
REVISION_UNCHANGED = PASS
ACCEPTED_OPERATION_STILL_AUTHORITATIVE = sprsmko0p531abn82fmk
SECOND_SUBMIT_ALLOWED = false
EXPORT_ALLOWED = false
SEMANTIC_CONCLUSION_ALLOWED = false
```

## Next-action decision

A later bounded collection attempt against the same job is the only next provider-lifecycle action:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r01-20260917","count":1}
```

If Bridge again returns local `NO_DUE_OPERATIONS` with zero provider calls, preserve it and continue to treat the operation as waiting. If a provider-backed collect occurs, preserve the complete envelope and accepted operation truth before any export decision.

Not authorized:

- second `submitN`;
- new `start`;
- `exportPage` before successful collection/readback;
- R02 or later queries.
