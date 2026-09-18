# LEVEL 2 — M5/M10 Search-only baseline and Alice diagnostic sequence

Status: ACTIVE / OWNER-LOCKED CROSS-STAGE METHOD
Date: 2026-09-18
KW-002 analog: Step14 + Step15 + Step16 + Step17

## Root problem prevented

AI evidence must not contaminate the Search-only baseline that it is supposed to test.

~~~text
NO FROZEN SEARCH BASELINE
-> NO CAUSAL AI DELTA
-> CHANGE / NO_CHANGE CANNOT BE PROVED
~~~

Official Yandex current guidance states that Search with Alice finds query-matching content, analyzes it and cites sources; Alice results are generated from pages indexed by Yandex. Alice source composition can change. Yandex Webmaster Alice visibility is evaluated on queries where the site already has sufficient Search visibility.

Project consequence:
ordinary Search remains the independent baseline; Alice is a bounded diagnostic and later visibility layer.

## M5 — hypothesis register only

M5 occurs after M4 but before Search semantic freeze.

Allowed:
- record candidate AI questions exposed by M3/M4;
- record what uncertainty a later Alice observation could resolve;
- record expected information gain and likely affected Search decision.

Forbidden:
- GenSearch/Alice provider acquisition;
- treating a hypothetical Alice question as demand;
- changing cluster/page architecture from AI;
- selecting final AI cases before Search baseline exists.

Output:
AI_DIAGNOSTIC_HYPOTHESIS_REGISTER.

PASS:
every row is provisional; AI_PROVIDER_CALLS = 0.

## M7/M8/M9 AI exclusion

Search-side freeze, semantic master and Search clustering must remain reconstructable without Alice evidence.

~~~text
M7_SEARCH_FREEZE_INPUT_ALICE = 0
M8_SEARCH_SEMANTIC_TRUTH_FROM_ALICE = 0
M9_SEARCH_CLUSTER_DECISION_FROM_ALICE = 0
~~~

Alice files may physically exist later but may not be joined into those baseline authorities.

## M10A — Search-only page/IA baseline

Input:
accepted M9 Search clusters + product truth/current site.

Method:
assign provisional/frozen Search-only query->page ownership and IA sufficient to state what ordinary Search evidence alone would implement.

Output:
SEARCH_ONLY_PAGE_IA_BASELINE with explicit HOLDs.

PASS:
each retained cluster has one Search-only owner hypothesis or HOLD; no AI evidence used.

## M10B — final AI diagnostic case selection

Input:
Search-only baseline + M5 hypothesis register.

Select cases only where AI can materially:
- change;
- enrich;
- de-risk;
- confirm no change;
- leave HOLD.

Every case records:
exact question/prompt, Search baseline decision, uncertainty, expected information gain, affected page/cluster, repeat/variability plan, stop rule.

No arbitrary representativeness quota.

## M10C — Alice/AI evidence acquisition

Before provider work:
- current provider/Bridge contract;
- exact execution mode;
- one-command/actual-result semantics;
- persistence/readback;
- claim boundary.

Preserve:
exact prompt/query/date, raw answer/evidence, cited sources/URLs, source/page types, follow-up decomposition, status/errors, provider identity, snapshot scope.

~~~text
ASSISTANT-GENERATED ANSWER != YANDEX AI EVIDENCE
ONE AI ANSWER != PERMANENT TRUTH
ABSENT/PARTIAL AI OUTPUT != NEGATIVE MARKET FACT
~~~

Use repeat snapshots when the diagnostic question is sensitive to variability.

## M10D — reconciliation

For every case classify exactly one:

CHANGE
ENRICH
DE_RISK
NO_CHANGE
HOLD

Keep:
Search baseline -> AI evidence -> causal delta -> affected final decision.

NO_CHANGE is valid and must not be turned into fake AI-specific pages.

## PASS

~~~text
SEARCH_ONLY_BASELINE_FROZEN_BEFORE_AI = true
FINAL_AI_CASES_HAVE_INFORMATION_GAIN = true
AI_PROVIDER_EVIDENCE_PERSISTED = PASS
AI_SOURCE_PROVENANCE = COMPLETE
SEARCH_BASELINE_NOT_REWRITTEN_RETROACTIVELY = true
EVERY_AI_DELTA_HAS_CAUSAL_CHAIN = true
SUPPORTED_NO_CHANGE_ACCEPTED = true
AI_SPECIFIC_FAKE_PAGE_CREATION = 0
OPEN_CRITICAL_DEFECTS = 0
~~~
