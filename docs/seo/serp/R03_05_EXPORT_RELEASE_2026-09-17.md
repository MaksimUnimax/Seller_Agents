# R03 revision-bound export release

Date: 2026-09-17.  
Query: `chatgpt для wildberries`.  
Job: `octoport-serp-r03-20260917`.  
Status: **COLLECT TERMINAL PASS / EXACTLY ONE EXPORTPAGE RELEASED**.

Evidence basis:

- R03 start persisted/read back;
- exactly one submit accepted;
- authoritative operation: `spr8vij9p1s7cijt2chi`;
- two intermediate `NO_DUE_OPERATIONS` timing guards persisted/read back;
- provider-backed collect persisted losslessly and read back;
- terminal state: `SUCCEEDED=1`, `WAITING=0`, `unresolved=0`, `all_successful=true`;
- authoritative revision: `5`;
- no failure/parse/unknown/cancelled state.

Exactly one revision-bound export is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"exportPage","jobId":"octoport-serp-r03-20260917","after":-1,"limit":1,"revision":5}
```

The returned complete export artifact/envelope must be persisted losslessly and remotely read back before semantic analysis, R02↔R03 paired comparison, or any R04 action.

Not authorized:

- new `start`;
- any further `submitN`;
- any further normal `collectN`;
- R04;
- final F2 page/cluster/IA decisions.
