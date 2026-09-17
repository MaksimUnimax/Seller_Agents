# SERP raw evidence — R01-03 collect not due

Date: 2026-09-17.
Query: `подключить chatgpt к маркетплейсу`.
Job: `octoport-serp-r01-20260917`.
Stage: `collectN`.

## Exact received bridge envelope

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-r01-20260917","ok":true,"request_executed":false,"provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":null,"code":"NO_DUE_OPERATIONS","index":null,"operation_id":null},"progress":{"job_id":"octoport-serp-r01-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":1,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

## Preservation note

The complete lifecycle envelope is preserved exactly as supplied. This collection attempt did not poll Yandex: `request_executed:false`, `provider_calls:0`, `polls_started:0`. Bridge returned local guard `NO_DUE_OPERATIONS`; the accepted deferred operation from the prior submit remains authoritative and the job remains `WAITING:1`, `unresolved:1`, revision `2`.

This state is not a provider failure and has no semantic meaning about demand or SERP content. No resubmission is allowed.
