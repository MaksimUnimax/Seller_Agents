# SERP raw evidence — R01-04 collect not due

Date: 2026-09-17.
Query: `подключить chatgpt к маркетплейсу`.
Job: `octoport-serp-r01-20260917`.
Stage: `collectN`.

## Exact received bridge envelope

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-r01-20260917","ok":true,"request_executed":false,"provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":null,"code":"NO_DUE_OPERATIONS","index":null,"operation_id":null},"progress":{"job_id":"octoport-serp-r01-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":1,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

## Preservation note

The complete lifecycle envelope is preserved exactly as supplied. This second collection attempt also did not poll Yandex: `request_executed:false`, `provider_calls:0`, `polls_started:0`. Bridge again returned local guard `NO_DUE_OPERATIONS`; the accepted operation `sprsmko0p531abn82fmk` remains authoritative and the job remains `WAITING:1`, `unresolved:1`, revision `2`.

This is not a provider failure and carries no semantic conclusion. No second submit/new start is allowed.
