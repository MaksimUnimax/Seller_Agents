# R09 — terminal collect succeeded

Date: 2026-09-17.  
Query: `поисковые запросы wildberries для продавца`.  
Job: `octoport-serp-r09-20260917`.  
Operation: `sprut2nra25h2lmi10hv`.

Exact user-returned envelope:

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-r09-20260917","ok":true,"request_executed":true,"provider_calls":1,"processed":1,"normalized":1,"bounded_stop":false,"last":{"outcome":"received","code":null,"index":0,"operation_id":"sprut2nra25h2lmi10hv"},"progress":{"job_id":"octoport-serp-r09-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":1,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":1,"unresolved":0,"all_successful":true,"busy":false,"revision":5}}
```

No normalization or correction has been applied. The same accepted deferred operation completed successfully. This is terminal lifecycle evidence for revision 5; the complete export is still required before semantic analysis.