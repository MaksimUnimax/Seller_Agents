# R07 bounded collect #3 analysis — TERMINAL SUCCESS

Date: 2026-09-17.  
Query: `как заполнить карточку товара wildberries`.  
Job: `octoport-serp-r07-20260917`.  
Operation: `sprh5ncfp74am7l6eofs`.

Observed state:

```text
ok = true
request_executed = true
provider_calls = 1
processed = 1
normalized = 1
last.outcome = received
PENDING = 0
WAITING = 0
SUCCEEDED = 1
FAILED = 0
UNKNOWN = 0
requests_started = 1
operations_accepted = 1
polls_started = 1
unresolved = 0
all_successful = true
revision = 5
```

Interpretation: the accepted R07 operation was actually polled and returned successfully. The provider lifecycle for this job is now terminal. No further `start`, `submitN` or `collectN` is permitted for the accepted job. After durable persistence and readback of this state, the only permitted provider action is `exportPage` pinned to revision 5. The complete export must then be persisted losslessly and analyzed across all returned results before R07 can close.
