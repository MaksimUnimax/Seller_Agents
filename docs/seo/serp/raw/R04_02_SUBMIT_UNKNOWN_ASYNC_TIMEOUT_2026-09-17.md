# R04 raw lifecycle envelope — submit unknown / async timeout

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04-20260917`.  
Lifecycle action: `submitN`.

Exact owner-returned Bridge envelope:

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"submitN","job_id":"octoport-serp-r04-20260917","ok":false,"request_executed":"UNKNOWN","provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":"unknown","code":"ASYNC_TIMEOUT","index":0,"operation_id":null},"progress":{"job_id":"octoport-serp-r04-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":1,"CANCELLED":0},"requests_started":1,"operations_accepted":0,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

No normalization or correction has been applied to the envelope above.
