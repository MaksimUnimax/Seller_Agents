# SERP raw evidence — R01-05 collect succeeded

Date: 2026-09-17.
Query: `подключить chatgpt к маркетплейсу`.
Job: `octoport-serp-r01-20260917`.
Stage: `collectN`.

## Exact received bridge envelope

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-r01-20260917","ok":true,"request_executed":true,"provider_calls":1,"processed":1,"normalized":1,"bounded_stop":false,"last":{"outcome":"received","code":null,"index":0,"operation_id":"sprsmko0p531abn82fmk"},"progress":{"job_id":"octoport-serp-r01-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":1,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":1,"unresolved":0,"all_successful":true,"busy":false,"revision":5}}
```

## Preservation note

The complete lifecycle envelope is preserved exactly as supplied. This collection attempt polled the provider once and received the previously accepted operation `sprsmko0p531abn82fmk`. The job now has `SUCCEEDED:1`, `unresolved:0`, `all_successful:true`, and revision `5`.

This closes provider collection for R01. No second submit/new start is allowed. Semantic analysis still requires export of the normalized result set and remote readback before interpreting the SERP.
