# R01 execution activation — `подключить chatgpt к маркетплейсу`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / post-M2R rebaseline`.  
Status: **ACTIVE / EXACTLY ONE LOCAL START RELEASED**.

Upstream authority:

- `../work/M2R_RECONCILIATION_MAIN_CHAT_RETURN_QA_2026-09-17.md` — M2R accepted with Main Chat corrections;
- `M3_QUERY_MATRIX_2026-09-17.md` — current accepted M3 query authority;
- `R01_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md` — query-specific research/release gate prepared and remote-read back;
- `../PROVIDER_QUERY_RELEASE_RULE.md` — current per-query hard gate;
- current owner chat — required source/method disclosure delivered and owner instructed `делай`.

## Activation facts

The required owner-facing disclosure has now been delivered in the current chat. It covered:

- current roadmap/cursor and accepted M2R return state;
- R01 exact decision question and why Wordstat/S01-S03 cannot answer it;
- fresh Yandex Search API / deferred lifecycle / pricing evidence already frozen in the R01 pre-step;
- current market-language evidence for connecting external AI/ChatGPT to marketplace seller data;
- explicit product-truth boundary: external/user-selected AI connected through Octoport, not a proprietary Octoport AI;
- information-gain and outcome contract;
- provider/Bridge separation;
- exactly-one-query cost/request guard;
- persistence/readback rule before any next lifecycle action.

The Opera Browser Connector is not currently connected, so Main Chat cannot physically invoke the local Bridge action from the browser in this session. That execution-surface limitation does not widen the release: exactly one local `start` is authorized and nothing else.

## R01 identity

```text
query_id = R01
job_id = octoport-serp-r01-20260917
query = подключить chatgpt к маркетплейсу
family = F2
```

No durable R01 job/start envelope exists yet.

## Released action

Exactly one local start is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r01-20260917","queries":["подключить chatgpt к маркетплейсу"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

This command shape is the same accepted one-query local-start schema used by the prior Octoport S01/S02/S03 Search jobs, with only the R01 job id/query/date changed.

Expected local-start property from accepted Bridge evidence:

```text
request_executed = false
provider_calls = 0
one item becomes PENDING
```

That expectation is not a substitute for the actual returned envelope. Preserve whatever the Bridge actually returns.

## Not released

This activation does **not** authorize:

- `submitN`;
- `collectN`;
- `exportPage`;
- retry or second `start`;
- R02 or any later query;
- any semantic conclusion before the actual R01 result exists.

## Post-start gate

After the local start response:

```text
receive complete bridge envelope
-> persist exact envelope as docs/seo/serp/raw/R01_01_START_2026-09-17.md
-> persist start analysis/progress
-> remote readback
-> verify job_id/query/counts/revision/request_executed/provider_calls
-> only then decide whether exactly one submitN may be released
```

If the local start unexpectedly executes a provider request, returns validation/provider/unknown state, or indicates an existing conflicting job, preserve exact truth and stop. Do not retry blindly.

## Activation verdict

```text
M2R_MAIN_CHAT_RETURN_QA = PASS
CURRENT_M3_MATRIX = PASS
R01_PRESTEP_REMOTE_READBACK = PASS
OWNER_FACING_DISCLOSURE = PASS
OWNER_EXECUTION_INSTRUCTION = PRESENT
R01_JOB_DURABLY_EXISTS = false
R01_LOCAL_START_COUNT_1_ALLOWED = true
R01_SUBMITN_ALLOWED = false
R01_COLLECTN_ALLOWED = false
R01_EXPORT_ALLOWED = false
R02_ALLOWED = false
```

Current physical cursor: execute the one released local R01 `start`, then return the complete envelope for persistence/readback and the next gate.
