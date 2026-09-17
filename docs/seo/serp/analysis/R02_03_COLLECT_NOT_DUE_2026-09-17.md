# R02 lifecycle analysis — first collect not due

Date: 2026-09-17.  
Query: `chatgpt для ozon`.  
Job: `octoport-serp-r02-20260917`.  
Status: **LOCAL TIMING GUARD / NO PROVIDER CALL / WAITING PRESERVED**.

Lossless raw transport:

- path: `../raw/R02_03_COLLECT_NOT_DUE_2026-09-17.b64`;
- decoded UTF-8 bytes: `634`;
- decoded SHA-256: `69ef6eba46c122b4249106b66898bd2d189fb985229a9a91bb06fc4595dfb8f1`.

Observed facts:

```text
action = collectN
ok = true
request_executed = false
provider_calls = 0
processed = 1
normalized = 0
bounded_stop = false
last.code = NO_DUE_OPERATIONS
control = RUNNING
total = 1
PENDING = 0
WAITING = 1
SUCCEEDED = 0
FAILED = 0
UNKNOWN = 0
requests_started = 1
operations_accepted = 1
polls_started = 0
unresolved = 1
all_successful = false
busy = false
revision = 2
```

Interpretation:

- this was a local timing guard, not a provider-backed poll;
- Yandex was not contacted and no additional billable provider call occurred;
- the previously accepted operation `sprg1vmblbk160ogsha3` remains authoritative and unresolved;
- state remains `WAITING=1` at revision `2`;
- this is not a zero-result or semantic failure;
- no second start and no second submit are allowed.

Next gate after remote readback of the lossless raw artifact: release exactly one further bounded `collectN count=1` on the same R02 job. Export and R03 remain blocked until R02 reaches a provider-backed terminal result and that result is persisted/read back.
