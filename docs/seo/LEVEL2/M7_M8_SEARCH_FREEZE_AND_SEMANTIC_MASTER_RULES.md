# LEVEL 2 — M7/M8 Search freeze and Search-only semantic master

Status: ACTIVE
Date: 2026-09-18
KW-002 analog: Step09 + Step10 + Step11 boundary

## M7 — Search-side collection freeze

### Purpose

Freeze one auditable Search-side evidence snapshot before expensive semantic decisions.

M7 is not a claim that search demand can never change. It is a versioned evidence boundary.

### Required inputs

- current product truth;
- accepted Wordstat/demand evidence and retro audits;
- accepted M3 Search evidence + closed control debt;
- accepted M4 competitor registry/page corpus;
- accepted M6 named-gap closure;
- all provider outcomes terminal/known;
- all downstream-required evidence durable/read back.

Alice/AI evidence is not an M7 input.

### Freeze manifest

Record:
- live branch/HEAD;
- every authoritative file/path/hash;
- data layer and row/count expectations;
- superseded/historical authorities excluded from current truth;
- explicit HOLD/known limitations;
- Work W1 allowed input set;
- prohibited inputs;
- freeze timestamp/version.

### PASS

~~~text
PRODUCT_SCOPE_CURRENT = PASS
M2_DEMAND_AUTHORITY = PASS_WITH_ACCEPTED_LIMITATIONS
M3_CONTROL_DEBT = CLOSED
M4_COMPETITOR_CORPUS = ACCEPTED
M6_HIGH_VALUE_GAPS = CLOSED_OR_EXPLICIT_NONBLOCKING_HOLD
UNKNOWN_PROVIDER_OUTCOMES = 0
SEARCH_EVIDENCE_DURABLE_READBACK = PASS
ALICE_EVIDENCE_IN_SEARCH_FREEZE = 0
FREEZE_MANIFEST = COMPLETE
W1_INPUT_AUTHORITY = FROZEN
~~~

If a material upstream authority changes after M7, identify dependent outputs and reopen only affected stages. Do not silently mutate the freeze.

## M8 — Search-only semantic master + nuanced row decisions

### Purpose

Build the full governed Search semantic authority from the frozen Search-side evidence without Alice contamination.

KW-002 lessons transferred:
- candidate master freeze before expensive judgments;
- no default KEEP;
- frequency is evidence, not a verdict;
- ambiguity survives as HOLD;
- mechanical QA != semantic QA;
- one canonical current authority feeds downstream.

### Data layers

Preserve distinct:
RAW occurrence evidence;
normalized semantic identities;
working candidates;
HOLD/REVIEW;
excluded history;
brand defense;
source/query/page provenance.

Do not erase original occurrences when identities are deduplicated analytically.

### Required row-level fields

At minimum:
- semantic identity;
- raw/source lineage;
- demand/provenance;
- relevance state;
- reason code;
- user task/job;
- intent / mixed intent;
- commercial/informational role;
- product/business-fit state;
- ambiguity/evidence need;
- priority tier + textual basis;
- redundancy/canonicality relation;
- preliminary family role;
- marketplace/LLM/entity tags where material.

### Semantic controls

~~~text
SUBSTRING/PREFIX != LEXEME PROOF
TOKEN != REFERENT PROOF
REFERENT != INTENT
POSITIVE PRODUCT TOKEN DOES NOT OVERRIDE FOREIGN CONTEXT
LOW FREQUENCY != EXCLUDE
HIGH FREQUENCY != KEEP
MATERIAL AMBIGUITY -> HOLD
~~~

Any production classifier must receive an independent/adversarial semantic diagnostic that is not merely the same rule replayed.

Representative defects are regression tests, not patch targets:
mechanism fix -> rerun complete affected universe -> sibling-change report.

### Alice exclusion

M8 must be independently reproducible with AI files unavailable.

~~~text
ALICE_INPUT_ROWS = 0
AI_SOURCE_USED_FOR_SEARCH_RELEVANCE = 0
AI_SOURCE_USED_FOR_SEARCH_INTENT = 0
AI_SOURCE_USED_FOR_PRIORITY = 0
~~~

### Work

M8 is expected full-volume Work when ordinary chat risks skipped rows, joins, reason-code accounting, lineage loss or weak QA.

Main Chat freezes the contract and accepts/rejects the return. Work does not mutate methodology.

### PASS

~~~text
RAW_LINEAGE_LOSS = 0
SILENT_ROW_LOSS = 0
EVERY_IDENTITY_HAS_STATE_REASON = true
DEFAULT_KEEP = 0
UNCERTAINTY_EXPLICIT = true
INDEPENDENT_SEMANTIC_QA = PASS
ALICE_CONTAMINATION = 0
CURRENT_AUTHORITY_UNAMBIGUOUS = true
COUNTS/JOINS/REASON_CODES = RECONCILED
GITHUB_REMOTE_READBACK = PASS
OPEN_CRITICAL_DEFECTS = 0
~~~
