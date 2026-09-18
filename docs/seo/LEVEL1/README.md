# Octoport SEO — LEVEL 1 universal process rules

Status: ACTIVE / OWNER-LOCKED / MANDATORY FOR EVERY MATERIAL STEP
Date restored: 2026-09-18

LEVEL 1 = universal rules for the entire Octoport SEO program.

It governs context restoration, live GitHub authority, evidence classes, Bridge/provider release, Work usage, large-data handling, persistence/readback, QA/acceptance, failures and authority drift.

Canonical LEVEL 1 authorities:
- ../EXECUTION_RULES.md
- ../QUALITY_FIRST_RESOURCE_RULE.md
- ../WORK_HANDOFF_RULE.md
- ../METHODOLOGY.md
- ../PRODUCT_TRUTH.md
- this file

## Mandatory two-level pre-step gate

Before any material step, step preparation, Work prompt, Bridge/provider call, execution, QA, publication, acceptance, cursor move or roadmap move, Main Chat must:

1. restore current context;
2. fetch/verify live branch and HEAD;
3. read roadmap/current-state authority;
4. read LEVEL 1;
5. read the exact applicable LEVEL 2;
6. read current work/evidence/state/results;
7. read known failures/rejected attempts;
8. perform fresh external method/provider research when required;
9. freeze exact inputs, outputs, schemas, lineage/dedupe, QA, stop/HOLD rules, Work/Bridge policy and publication path;
10. record preparation durably in GitHub;
11. remote-readback;
12. only then release execution.

~~~text
LIVE HEAD
-> LEVEL 1 READ
-> APPLICABLE LEVEL 2 READ
-> WORK/EVIDENCE/FAILURE HISTORY READ
-> FRESH METHOD CHECK
-> EXACT STEP CONTRACT
-> GITHUB PERSIST
-> REMOTE READBACK
-> ONLY THEN PREPARE/EXECUTE
~~~

## Fail closed

If applicable LEVEL 2 is missing, stale, contradictory or unread:

~~~text
STEP_PREPARATION_ALLOWED = false
WORK_PROMPT_ALLOWED = false
BRIDGE_PROVIDER_ALLOWED = false
EXECUTION_ALLOWED = false
QA_ACCEPTANCE_ALLOWED = false
CURSOR_ADVANCE_ALLOWED = false
~~~

Memory, chat summary, an earlier step's rules or a result file never substitutes for live LEVEL 1 + exact LEVEL 2.

## Three-layer separation

~~~text
LEVEL 1 = universal project rules
LEVEL 2 = exact step methodology / gates / contract
work/evidence/state/results = execution data and outputs
~~~

## Large data

~~~text
CURRENT STEP
-> WORK TRIGGER
-> PRE-HANDOFF MANIFEST
-> CANONICAL WORK PROMPT
-> COMPLETE EXECUTION UNIT IN WORK
-> COMPLETE ARTIFACT RETURN
-> GITHUB STAGING
-> MAIN CHAT COUNTS/ROWS/JOINS/LINEAGE/PROVENANCE/QA
-> ACCEPT | REWORK | HOLD
~~~

No sampling, first-N, truncation or summary-before-full-analysis as a substitute.

## Persistence

~~~text
CHAT != STORAGE
LOCAL FILE != ACCEPTED AUTHORITY
PROVIDER SUCCESS != PASS
WORK OUTPUT != PASS
COMMIT EXISTS != PASS

MATERIAL RESULT
-> GITHUB
-> FAST-FORWARD COMMIT
-> REMOTE READBACK
-> QA
-> ONLY THEN ACCEPTED
~~~
