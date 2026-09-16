# Octoport SEO — provider query release rule

Status: **ACTIVE / OWNER-LOCKED / HARD GATE**.
Date: 2026-09-16.
Origin: adapted from current KW-002 pre-step, information-gain, provider execution, persistence and anti-regression rules after owner correction during Octoport M3.

## Purpose

A new provider-backed query is a new evidence-producing execution unit. It must not be released merely because its parent roadmap stage already passed a generic pre-step.

```text
MAJOR-STAGE PRE-STEP PASS
!=
AUTOMATIC RELEASE OF EVERY PROVIDER QUERY INSIDE THAT STAGE
```

Each new query/candidate that can change semantic, competitor, split/merge, page-intent or acquisition decisions requires its own bounded release contract before **any Bridge lifecycle command, including local-only `start`**.

## Required order before a new query

```text
1. restore whole SEO/product goal
2. show full roadmap and current cursor
3. state completed vs remaining work
4. define exact new query-step goal/problem/output
5. reread applicable failure/anti-regression rules
6. perform fresh external research for material provider/method questions
7. disclose clickable sources + supported claims to owner in chat
8. write source -> method trace
9. write complete information-gain/outcome contract
10. verify current provider contract
11. verify current Bridge capability separately
12. evaluate Work trigger
13. define hard PASS/FAIL/HOLD gates
14. include plain-language why/what/result/blocker/next-action summary
15. persist the query release artifact
16. remote-readback the release artifact
17. only then issue the first Bridge lifecycle command
```

No first command may precede steps 1–16.

## Information-gain/outcome contract

Before release, record:

```text
QUERY_ID / QUERY_TEXT
OPEN DECISION / QUESTION
WHY CURRENT DURABLE EVIDENCE IS INSUFFICIENT
EXPECTED INCREMENTAL INFORMATION GAIN
WHAT SUCCESS_WITH_RESULTS CHANGES
WHAT SUCCESS_WITH_ZERO_RESULTS CHANGES
WHAT TECHNICAL/INCOMPLETE FAILURE CHANGES
PROVIDER / MODE / PARAMETERS
DEPTH / RESULT BOUNDARY
REQUEST COUNT / COST CAP
NO-BLIND-RETRY RULE
STOP CONDITION
RAW / EXPORT PERSISTENCE PATH
REMOTE READBACK REQUIREMENT
DOWNSTREAM DECISION USING THE RESULT
REOPEN / ESCALATION CONDITIONS
```

Technical failure is never negative semantic evidence. A valid zero is bounded to the exact request/settings/snapshot. A seed/query is not a final keyword, cluster or page.

## Provider docs and Bridge capability are separate gates

```text
CURRENT OFFICIAL PROVIDER DOCS
!=
CURRENT BRIDGE IMPLEMENTATION PROOF
```

Both must be checked when material.

Provider docs establish the external request/lifecycle/limits/pricing contract. Bridge evidence establishes which commands/state/persistence/recovery behaviors are accepted in the installed/current implementation.

## Bridge command sequencing after release

For current one-query deferred Search jobs:

```text
released query
-> local start
-> exact envelope persistence/readback
-> one submitN
-> exact accepted operation identity persistence/readback
-> due collectN only
-> preserve local NO_DUE guards separately
-> provider-backed terminal collect
-> persistence/readback
-> export
-> source identity/hash + complete normalized evidence persistence/readback
-> query closure
-> only then release another query
```

No blind resubmit of an accepted operation.

## Work rule

Before release, evaluate whether the step requires ChatGPT Work. Large/full-volume analysis must not be sampled or truncated to fit ordinary chat. Small one-query provider orchestration normally stays in Main Chat; cross-query matrices/corpora move to Work when complete analysis becomes unsafe here.

## Hard failure classes

- first Bridge command issued before query release/readback;
- stale provider docs reused without current check when material;
- provider docs treated as Bridge capability proof;
- Bridge tests treated as current provider-doc proof;
- no explicit information-gain contract;
- technical failure interpreted as negative demand/intent evidence;
- accepted async operation blindly resubmitted;
- next provider action before current evidence persistence/readback;
- large data sampled instead of Work handoff.

Any hard failure blocks PASS regardless of numeric quality score.

## Recovery after premature local-only start

If a local-only `start` was issued before release but `request_executed:false` and `provider_calls:0`:

```text
record process defect
-> preserve/readback local-start evidence
-> STOP before submit
-> complete missing pre-step/release + fresh research + owner disclosure
-> persist/readback release
-> only then decide whether existing local job may continue
```

Do not recreate the job merely to make history look clean. If any provider call already executed before release, classify separately and fail closed until reconciled.
