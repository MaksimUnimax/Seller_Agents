# R04 execution activation — `аналитика маркетплейсов для селлеров`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F3+F9 analytics boundary`.  
Status: **ACTIVE / EXACTLY ONE LOCAL START RELEASED**.

Upstream authority:

- `M3_QUERY_MATRIX_2026-09-17.md` — R04 is the accepted next analytics candidate;
- `analysis/R02_VS_R03_OWN_CHATGPT_PAIRED_COMPARISON_2026-09-17.md` — F2 Search block closed at information saturation;
- `R04_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md` — query-specific research/release gate, remote-read back;
- `../PROVIDER_QUERY_RELEASE_RULE.md` — per-query hard gate;
- current owner chat — owner-facing source/method disclosure delivered before activation.

## Activation facts

Owner-facing disclosure covered:

- current Yandex WebSearchAsync request/deferred lifecycle and unchanged comparison settings;
- official WB seller-owned analytics surfaces: funnel, own-product search queries, stocks and seller CSV/report analytics;
- official Ozon seller-owned analytics examples: own-product search analytics and seller promotion/promocode metrics;
- current market distinction between internal seller-cabinet analytics and external market/niche/competitor intelligence;
- explicit product boundary: external-intelligence Search demand cannot widen Octoport capability without source/product authority;
- persistence/readback before every next lifecycle action.

Repository conflict check before activation found no durable:

`raw/R04_01_START_2026-09-17.md`.

## R04 identity

```text
query_id = R04
job_id = octoport-serp-r04-20260917
query = аналитика маркетплейсов для селлеров
families = F3, F9
relation = broad analytics intent control; conceptual pair with R05 reports
```

## Released action

Exactly one local start is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r04-20260917","queries":["аналитика маркетплейсов для селлеров"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

This preserves the accepted S01-S03/R01-R03 comparison settings. Only query/job identity changes.

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
- R05 or later queries;
- any final analytics page/cluster/IA decision.

## Post-start gate

After the local start response:

```text
receive complete Bridge envelope
-> persist exact envelope as raw/R04_01_START_2026-09-17.md
-> persist start analysis/current cursor
-> remote readback
-> verify job_id/action/counters/revision/request_executed/provider_calls
-> only then decide whether exactly one submitN count=1 may be released
```

If start unexpectedly executes a provider call, reports validation/provider/unknown state, or reveals an existing conflicting job, preserve exact truth and stop. Do not retry blindly.

## Activation verdict

```text
F2_SEARCH_BLOCK = CLOSED / SATURATED
R04_PRESTEP_REMOTE_READBACK = PASS
OWNER_FACING_SOURCE_DISCLOSURE = PASS
R04_EXISTING_DURABLE_START_ARTIFACT = NONE
R04_LOCAL_START_COUNT_1_ALLOWED = true
R04_SUBMITN_ALLOWED = false
R04_COLLECTN_ALLOWED = false
R04_EXPORT_ALLOWED = false
R05_ALLOWED = false
```

Current physical cursor: execute exactly one released local R04 `start`, return the complete Bridge envelope, persist/read back, then gate submit separately.
