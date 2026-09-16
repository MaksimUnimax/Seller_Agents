# SERP raw evidence — S03-04 collect succeeded

Дата: 2026-09-16.
Query: `ии агент для wildberries`.
Job: `octoport-serp-s03-20260916`.
Stage: `collectN`.

## Exact received bridge envelope

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-s03-20260916","ok":true,"request_executed":true,"provider_calls":1,"processed":1,"normalized":1,"bounded_stop":false,"last":{"outcome":"received","code":null,"index":0,"operation_id":"spr9s36a5612vaq2a2ma"},"progress":{"job_id":"octoport-serp-s03-20260916","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":1,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":1,"unresolved":0,"all_successful":true,"busy":false,"revision":5}}
```

## Preservation note

The complete received lifecycle envelope is preserved exactly as supplied. This collect executed one provider request (`request_executed:true`, `provider_calls:1`) and retrieved the same accepted operation `spr9s36a5612vaq2a2ma`. The item is now `SUCCEEDED:1`, `normalized:1`, `unresolved:0`, `all_successful:true`, revision `5`.

This lifecycle response does not contain the normalized SERP rows themselves. Intent/page-type/competitor comparison remains blocked until the revision-bound export is received and validated.

The immediately preceding S03-03 `MANUAL_OPERATION_ACTIVE` event was local-only (`request_executed:false`) and therefore did not duplicate the provider collect.