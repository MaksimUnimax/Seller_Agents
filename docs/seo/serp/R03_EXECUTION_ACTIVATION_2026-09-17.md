# R03 execution activation — `chatgpt для wildberries`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F2 Wildberries paired control`.  
Status: **ACTIVE / EXACTLY ONE LOCAL START RELEASED**.

Upstream authority:

- `M3_QUERY_MATRIX_2026-09-17.md` — R03 is the accepted Wildberries-specific F2 paired candidate;
- `analysis/R02_06_EXPORT_ANALYSIS_2026-09-17.md` — R02 closed with Ozon sharpen confirmed but a large dual-marketplace core retained;
- `R03_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md` — query-specific R03 gate prepared and remote-read back;
- `../PROVIDER_QUERY_RELEASE_RULE.md` — per-query hard gate;
- current owner chat — owner-facing method/source disclosure delivered before activation.

## Activation facts

Owner-facing disclosure in the current chat covered:

- R02 closure and why R03 remains a necessary paired check;
- current Yandex WebSearchAsync request/deferred-operation model;
- official 2026 Wildberries API-token integration model;
- official WB category permissions and read-only versus read/write access;
- current market language for connecting a user's own ChatGPT/Claude to WB/Ozon seller cabinets through connector/MCP-style mechanisms;
- explicit product boundary: competitor mutation claims do not widen Octoport launch scope;
- persistence/readback before every next lifecycle action.

Repository check immediately before activation found no durable:

`raw/R03_01_START_2026-09-17.md`.

No prior R03 start artifact is being reused or overwritten.

## R03 identity

```text
query_id = R03
job_id = octoport-serp-r03-20260917
query = chatgpt для wildberries
family = F2
relation = Wildberries-specific paired control against R02; compared with generic R01
```

## Released action

Exactly one local start is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r03-20260917","queries":["chatgpt для wildberries"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

This preserves the accepted S01-S03/R01/R02 comparison settings. Only query/job identity changes.

Expected accepted Bridge local behavior:

```text
request_executed = false
provider_calls = 0
one item becomes PENDING
```

The actual returned Bridge envelope remains authority.

## Not released

This activation does not authorize:

- `submitN`;
- `collectN`;
- `exportPage`;
- retry or second `start`;
- R04 or later queries;
- any R02↔R03 paired semantic conclusion before R03 result exists;
- any final page/route/cluster/IA decision.

## Post-start gate

After the local start response:

```text
receive complete Bridge envelope
-> persist exact envelope as raw/R03_01_START_2026-09-17.md
-> persist start analysis/current cursor
-> remote readback
-> verify job_id/action/counters/revision/request_executed/provider_calls
-> only then decide whether exactly one submitN count=1 may be released
```

If start unexpectedly executes a provider call, reports a validation/provider/unknown state, or reveals an existing conflicting job, preserve exact truth and stop. Do not retry blindly.

## Activation verdict

```text
R01 = CLOSED
R02 = CLOSED
R03_PRESTEP_REMOTE_READBACK = PASS
OWNER_FACING_SOURCE_DISCLOSURE = PASS
R03_EXISTING_DURABLE_START_ARTIFACT = NONE
R03_LOCAL_START_COUNT_1_ALLOWED = true
R03_SUBMITN_ALLOWED = false
R03_COLLECTN_ALLOWED = false
R03_EXPORT_ALLOWED = false
R04_ALLOWED = false
```

Current physical cursor: execute exactly one released local R03 `start`, return the complete Bridge envelope, persist/read back, then gate the submit separately.
