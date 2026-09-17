# R09 — collect 1 local NO_DUE

Date: 2026-09-17.  
Query: `поисковые запросы wildberries для продавца`.  
Job: `octoport-serp-r09-20260917`.  
Accepted operation: `sprut2nra25h2lmi10hv`.

Exact user-returned envelope:

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-r09-20260917","ok":true,"request_executed":false,"provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":null,"code":"NO_DUE_OPERATIONS","index":null,"operation_id":null},"progress":{"job_id":"octoport-serp-r09-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":1,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

No normalization or correction has been applied. `NO_DUE_OPERATIONS` is preserved as the Bridge local timing guard exactly as returned. No provider poll executed in this action.
