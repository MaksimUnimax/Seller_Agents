# R07 bounded collect #3 envelope — exact returned result

Date: 2026-09-17.  
Query: `как заполнить карточку товара wildberries`.  
Job: `octoport-serp-r07-20260917`.  
Operation: `sprh5ncfp74am7l6eofs`.  
Action: `collectN`.

Exact returned envelope:

```json
{"action":"collectN","job_id":"octoport-serp-r07-20260917","ok":true,"request_executed":true,"provider_calls":1,"processed":1,"normalized":1,"bounded_stop":false,"last":{"outcome":"received","code":null,"index":0,"operation_id":"sprh5ncfp74am7l6eofs"},"progress":{"job_id":"octoport-serp-r07-20260917","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":1,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":1,"unresolved":0,"all_successful":true,"busy":false,"revision":5}}
```

No normalization or inference was applied to the returned envelope above.
