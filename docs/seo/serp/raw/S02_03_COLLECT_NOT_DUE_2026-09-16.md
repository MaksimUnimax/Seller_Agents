# SERP raw evidence — S02-03 collect not due

Дата: 2026-09-16.
Query: `ии агент для озон`.
Job: `octoport-serp-s02-20260916`.
Stage: `collectN`.

## Exact received bridge envelope

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-s02-20260916","ok":true,"request_executed":false,"provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":null,"code":"NO_DUE_OPERATIONS","index":null,"operation_id":null},"progress":{"job_id":"octoport-serp-s02-20260916","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":1,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

## Preservation note

The complete received lifecycle envelope is preserved exactly as supplied. This was a local due-time guard only: `request_executed:false`, `provider_calls:0`, `last.code:"NO_DUE_OPERATIONS"`. The existing accepted operation remains pending in local job state (`WAITING:1`, `revision:2`). No provider failure or zero-result inference is allowed from this response.
