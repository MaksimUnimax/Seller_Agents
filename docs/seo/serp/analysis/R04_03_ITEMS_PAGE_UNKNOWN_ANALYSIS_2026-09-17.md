# R04 recovery analysis — itemsPage after submit timeout

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04-20260917`.  
Status: **ITEMS INSPECTION COMPLETE / UNKNOWN CONFIRMED / ONE BOUNDED COLLECTN RECOVERY PROBE RELEASED**.

## Exact inspection result

```text
action = itemsPage
ok = true
request_executed = false
provider_calls = 0
row.index = 0
row.state = UNKNOWN
row.operation_id = null
row.poll_count = 0
row.error_code = ASYNC_TIMEOUT
row.parse_error = null
next_after = 0
```

Raw authority: `../raw/R04_03_ITEMS_PAGE_UNKNOWN_2026-09-17.md`.

## Correct interpretation

This proves only the current durable local item state:

```text
state = UNKNOWN
operation_id = null
poll_count = 0
error_code = ASYNC_TIMEOUT
```

It does not justify declaring the whole Bridge broken or pausing M3 indefinitely.

Prior accepted Deferred Search evidence shows that continuation is performed on the same existing job with bounded `collectN`, not by creating a new job or resubmitting the query. Therefore the next recovery probe is one `collectN` on `octoport-serp-r04-20260917`.

The purpose of this collect is to let the actual Bridge implementation decide and report the current state. We do not predict its outcome.

## Gate

```text
R04_SECOND_START = FORBIDDEN
R04_SECOND_SUBMIT = FORBIDDEN
R04_COLLECTN_COUNT_1 = RELEASED
R04_EXPORT = BLOCKED
R05 = BLOCKED
NEXT_PHYSICAL_ACTION = SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r04-20260917","count":1}
```
