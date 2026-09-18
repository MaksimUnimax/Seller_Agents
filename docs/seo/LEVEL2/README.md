# Octoport SEO — LEVEL 2 step-specific rules

Status: ACTIVE / OWNER-LOCKED STRUCTURE
Date restored: 2026-09-18

LEVEL 2 = methodology and hard gates for a specific roadmap step.

~~~text
LEVEL 1 = universal rules
LEVEL 2 = step-specific method/scope/inputs/outputs/schemas/QA/stop rules
work/evidence/state/results = factual execution layer
~~~

No material step may be prepared or executed until applicable LEVEL 2 exists and has been read against live repository state.

Each LEVEL 2 contract must define:
- step purpose/problem;
- upstream authorities/inputs;
- allowed/prohibited sources;
- fresh method/provider evidence where needed;
- source -> method -> action trace;
- exact execution unit;
- schemas/mandatory fields;
- normalization/dedup/lineage rules;
- Work trigger/scope;
- Bridge/provider rules;
- persistence paths;
- QA/hard gates;
- known failures;
- stop/HOLD/reopen rules;
- downstream dependency;
- explicit non-goals.

Current LEVEL 2:
- M4_SEARCH_COMPETITOR_LANDING_RULES.md

Every preparation must record:
LIVE_HEAD, LEVEL1_FILES_READ, LEVEL2_FILE_READ, WORK_EVIDENCE_FILES_READ, FAILURE_HISTORY_READ, EXTERNAL_SOURCES_CHECKED, WORK_TRIGGER_DECISION, EXACT_OUTPUTS, HARD_GATES, STOP_RULES, PUBLICATION_PATH.

Missing required field = HOLD.
