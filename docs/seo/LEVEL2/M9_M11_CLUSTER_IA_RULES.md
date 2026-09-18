# LEVEL 2 — M9/M11 Search clustering, baseline ownership and final IA

Status: ACTIVE
Date: 2026-09-18
KW-002 analog: Step13 + Step14 + Step18 architecture

Companion:
M5_M10_SEARCH_ONLY_AND_ALICE_SEQUENCE_RULES.md

## M9 — Search-only SERP + user-task clustering

### Purpose

Decide which Search queries can honestly be satisfied by the same page.

### Inputs

- accepted M8 Search-only semantic master;
- current accepted Search/SERP evidence;
- exact-URL/domain overlap authority;
- product capability boundary.

Alice evidence is prohibited from M9 cluster formation.

### Method

Combine:
- user task/job;
- intent / mixed intent;
- semantic meaning;
- exact URL overlap in current SERP;
- result/page-type behavior;
- marketplace specificity;
- funnel role where material;
- product usefulness/capability;
- cannibalization risk.

Exact URL overlap is stronger clustering evidence than domain overlap.

Do not use one universal numeric overlap threshold unless separately validated for this dataset.

~~~text
PRELIMINARY FAMILY != FINAL CLUSTER
DOMAIN OVERLAP != FINAL CLUSTER
LEXICAL SIMILARITY != FINAL CLUSTER
~~~

Mixed/uncertain boundaries remain HOLD rather than forced merge/split.

### Output

Search-only cluster authority with:
cluster ID;
member identities/queries;
primary user job;
intent;
SERP evidence summary;
merge/split rationale;
 page/content-type expectation;
ambiguity/HOLD;
upstream lineage.

### Work

If pairwise matrices and many-to-many membership become large, use Work on the complete selected set. No sampling.

### PASS

Every retained row is accounted; every merge/split is evidence-backed; no Alice input; no final implementation URL yet unless only a provisional role is needed for M10A.

## M10A — Search-only ownership / IA baseline

Before Alice evidence is acquired, freeze what ordinary Search evidence alone would implement.

For each M9 cluster assign:
- provisional primary page owner;
- page role/type;
- existing vs planned relation;
- parent/child IA relationship;
- internal-link responsibility;
- cannibalization boundary;
- HOLD where insufficient.

This baseline is immutable evidence for later AI reconciliation. AI may produce a delta, not rewrite history.

## M11 — final page ownership + IA

Input:
M10A Search baseline + accepted M10D AI reconciliation.

Method:
apply only causally supported AI deltas to the frozen Search baseline.

Physical action:
KEEP | OPTIMIZE | CREATE | ROUTE_INTERNAL_LINK | RECHECK/HOLD.

Rules:
- one governed primary owner per cluster unless explicit split evidence;
- no fake CREATE;
- page role must solve a distinct user task;
- no duplicate page purpose;
- unsupported product capability cannot justify a page;
- internal links must connect retained useful pages and prevent orphans;
- one canonical current architecture authority feeds M12-M18.

If M8/M9/M10 authority materially changes, affected M11 decisions reopen.

### PASS

~~~text
SEARCH_ONLY_BASELINE_EXISTS = true
AI_DELTAS_CAUSAL = true
EVERY_RETAINED_CLUSTER_HAS_OWNER_OR_HOLD = true
DUPLICATE_PAGE_PURPOSE = 0
FAKE_CREATE = 0
ORPHAN_PLANNED_TARGETS = 0
PRODUCT_TRUTH_CONFLICT = 0
ONE_CANONICAL_ARCHITECTURE_AUTHORITY = true
GITHUB_READBACK = PASS
~~~
