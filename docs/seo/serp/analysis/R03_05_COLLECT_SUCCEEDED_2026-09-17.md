# R03 lifecycle analysis — provider-backed collect succeeded

Date: 2026-09-17.  
Query: `chatgpt для wildberries`.  
Job: `octoport-serp-r03-20260917`.  
Status: **COLLECT SUCCEEDED / RAW PERSISTED / REMOTE READBACK PASS / EXACTLY ONE EXPORTPAGE RELEASED**.

Lossless raw transport:

- path: `../raw/R03_05_COLLECT_SUCCEEDED_2026-09-17.b64`;
- decoded UTF-8 bytes: `638`;
- decoded SHA-256: `157acce2d11c2ac56c03337ac6b2b4bca275d7976e4799e250db733694d052d1`.

Observed facts:

```text
action = collectN
ok = true
request_executed = true
provider_calls = 1
processed = 1
normalized = 1
bounded_stop = false
last.outcome = received
last.code = null
last.index = 0
operation_id = spr8vij9p1s7cijt2chi
control = RUNNING
total = 1
PENDING = 0
WAITING = 0
COLLECTING = 0
RESULT_SAVED = 0
SUCCEEDED = 1
PARSE_FAILED = 0
FAILED = 0
UNKNOWN = 0
CANCELLED = 0
requests_started = 1
operations_accepted = 1
polls_started = 1
unresolved = 0
all_successful = true
busy = false
revision = 5
```

## Persistence/readback result

The lossless raw artifact and this analysis were read back from branch `seo/wordstat-batch-01-2026-09-16`.

```text
RAW_PERSISTENCE = PASS
REMOTE_READBACK = PASS
OPERATION_ID_MATCH = PASS
SUCCEEDED_ONE = PASS
WAITING_ZERO = PASS
POLLS_STARTED_ONE = PASS
UNRESOLVED_ZERO = PASS
ALL_SUCCESSFUL_TRUE = PASS
REVISION_FIVE = PASS
FAILURE_PARSE_UNKNOWN_COUNTS_ZERO = PASS
```

Interpretation:

- the accepted R03 operation was polled exactly once at provider level and the result was received;
- the same operation id `spr8vij9p1s7cijt2chi` is preserved from submit to terminal collection;
- the item is now `SUCCEEDED=1` with `WAITING=0` and `unresolved=0`;
- the two previous `NO_DUE_OPERATIONS` responses were local timing guards and did not contact Yandex;
- no additional start, submit or normal collect is justified;
- revision `5` is the authoritative export revision.

## Released next action

Exactly one revision-bound export is now authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"exportPage","jobId":"octoport-serp-r03-20260917","after":-1,"limit":1,"revision":5}
```

The returned export must be persisted losslessly and remotely read back before full semantic analysis, R02↔R03 paired comparison, or any R04 action.

Still blocked:

```text
NEW_START = false
NEW_SUBMIT = false
FURTHER_COLLECT = false
R04 = false
FINAL_F2_PAGE_OWNERSHIP = false
```
