# M2R-A01 admission analysis — SERVICE_NOT_ACTIVE

Date: 2026-09-16.
Query: `аналитика маркетплейсов`.
Raw authority: `../raw/M2R_A01_01_SERVICE_NOT_ACTIVE_2026-09-16.md`.

## Interpretation

The attempted `WORDSTAT_API_V1` command did not reach Yandex Wordstat. The bridge reported:

- active service: `search`;
- requested command family: `wordstat`;
- stage: `MANUAL_ADMISSION`;
- code: `SERVICE_NOT_ACTIVE`;
- `request_executed:false`;
- recoverable: `true`.

Therefore:

```text
PROVIDER_CALLS_ADDED = 0
WORDSTAT_OUTCOME = NOT_OBSERVED
SEMANTIC_CONCLUSION = NONE
QUERY_RELEASE_REMAINS_VALID = true
A01_PROVIDER_EXECUTION_STILL_PENDING = true
```

This is not a retry of an executed provider call. Reissuing the identical query after the manual bridge context is switched/returned to Wordstat is valid because the previous attempt was rejected before execution.

No changes are required to the query purpose, depth, success/zero/failure contract or downstream decision defined in `M2R_A01_ANALITIKA_MARKETPLEYSOV_PRE_STEP_RELEASE_2026-09-16.md`.

## Next action

Reissue exactly the released Wordstat query once Wordstat is the active manual service:

`WORDSTAT_API_V1 {"method":"getTop","phrase":"аналитика маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}`

Then persist/read back the complete provider response before any next provider action.
