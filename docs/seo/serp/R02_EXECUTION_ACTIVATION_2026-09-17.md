# R02 execution activation — `chatgpt для ozon`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F2 Ozon-specific control`.  
Status: **ACTIVE / EXACTLY ONE LOCAL START RELEASED**.

Upstream authority:

- `M3_QUERY_MATRIX_2026-09-17.md` — R02 is the current Ozon-specific F2 candidate;
- `analysis/R01_06_EXPORT_ANALYSIS_2026-09-17.md` — R01 closed with generic F2 mechanism confirmed but materially mixed top-20;
- `R02_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md` — query-specific research/release gate, remote-read back;
- `../PROVIDER_QUERY_RELEASE_RULE.md` — per-query hard gate;
- current owner chat — owner-facing source/method disclosure delivered before activation.

## Activation facts

Owner-facing disclosure covered:

- R01 closure and why R02 remains non-redundant;
- current Yandex WebSearchAsync request and deferred-operation contract;
- current Ozon-specific external-AI connection language from 2026 API/MCP/Actions pages;
- generic ChatGPT-for-Ozon contamination control from current Ozon seller communication;
- product-truth boundary: external/user-selected AI connected through Octoport, not proprietary Octoport AI;
- no mutation/automation claim widening;
- one-query cost/request cap;
- persistence/readback before every next lifecycle action.

Repository check immediately before activation found no durable `raw/R02_01_START_2026-09-17.md`; no prior R02 local-start envelope is being reused or overwritten.

## R02 identity

```text
query_id = R02
job_id = octoport-serp-r02-20260917
query = chatgpt для ozon
family = F2
relation = Ozon-specific control against R01; paired with R03
```

## Released action

Exactly one local start is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r02-20260917","queries":["chatgpt для ozon"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

This preserves the accepted one-query S01-S03/R01 comparison settings. Only query/job identity changes.

Expected local behavior from accepted Bridge evidence:

```text
request_executed = false
provider_calls = 0
one item becomes PENDING
```

The actual returned Bridge envelope remains authoritative even if it differs.

## Not released

This activation does **not** authorize:

- `submitN`;
- `collectN`;
- `exportPage`;
- retry or second `start`;
- R03 or later queries;
- semantic conclusion before R02 result exists.

## Post-start gate

After the local start response:

```text
receive complete envelope
-> persist exact envelope as raw/R02_01_START_2026-09-17.md
-> persist start analysis/progress
-> remote readback
-> verify job_id/query/counts/revision/request_executed/provider_calls
-> only then decide whether exactly one submitN may be released
```

If start unexpectedly executes a provider request, returns validation/provider/unknown state, or reports an existing conflicting job, preserve exact truth and stop. Do not retry blindly.

## Activation verdict

```text
R01 = CLOSED
R02_PRESTEP_REMOTE_READBACK = PASS
OWNER_FACING_DISCLOSURE = PASS
R02_EXISTING_START_ARTIFACT = NONE
R02_LOCAL_START_COUNT_1_ALLOWED = true
R02_SUBMITN_ALLOWED = false
R02_COLLECTN_ALLOWED = false
R02_EXPORT_ALLOWED = false
R03_ALLOWED = false
```

Current physical cursor: execute exactly one released local R02 `start`, return the complete Bridge envelope, then persist/read back and gate the submit separately.
