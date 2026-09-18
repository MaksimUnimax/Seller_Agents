# M4 progress — Search competitor + landing corpus

Date: 2026-09-18
Branch: seo/wordstat-batch-01-2026-09-16
Status: **M4A R3 ACCEPTED 9.8/10 / M4B CURRENT / R2 SUSPENDED**

## Current cursor

~~~text
M3_PRIMARY_ORGANIC = CLOSED
M3_CONTROL_DEBT = OPEN UNTIL M6
M4 = CURRENT
M4A = R3_ACCEPTED
M4A_WORK_RETURN = UPLOADED_AND_ACCEPTED
M4A_RELEASE_READBACK = PASS
M4A_MAIN_CHAT_QA = PASS
M4B_LANDING_ACQUISITION = CURRENT
M5 = NOT STARTED
M7 = BLOCKED
~~~

## Current authorities

- docs/seo/LEVEL1/README.md
- docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md
- M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18.md = SUPERSEDED HISTORY
- M4A_WORK_PROMPT_2026-09-18.md = DO NOT EXECUTE

## Why M4A is next

Search competitors must be derived from accepted M3 recurrence, not from remembered brands or a business-rival shortlist.

Expected authority universe:
15 accepted query authorities × 20 organic rows = 300 occurrences.
Original R04 excluded. R04R1 is authority.

Full-volume cross-file recurrence/lineage analysis is assigned to ChatGPT Work under quality-first and Work-handoff rules.

## Next physical action

Main Chat re-prepares M4A from live HEAD after explicit LEVEL 1 + M4 LEVEL 2 read, persists/readbacks the new preparation, and only then may a new Work prompt be relayed.

No competitor/vendor landing collection is released before the M4A return is uploaded, remote-read back and independently accepted by Main Chat.


## 2026-09-18 — post-transfer audit state

The complete KW-002 Step06-22 rule-transfer audit materially changed the M4 method authority after the earlier M4A preparation was superseded.

New required authorities before M4A re-preparation:
- docs/seo/LEVEL1/README.md
- docs/seo/LEVEL2/README.md
- docs/seo/LEVEL2/OCTOPORT_STEP_RULES_INDEX.md
- docs/seo/LEVEL2/OCTOPORT_KW002_RULE_TRANSFER_AUDIT_2026-09-18.md
- docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md
- current M3 authority/evidence/failure history
- current external M4 method sources

New M4A must additionally implement transferred Step06 controls:
- Top3 / Top10 / 11-20 strength separation;
- explicit collision/uncertainty preservation;
- recurrence metric granularity;
- exact-URL and domain pairwise Top10 similarity across the frozen query set;
- curated registry from the complete recurrence universe.

M4B must implement transferred Step07 controls:
- only M4A-authorized competitors;
- deterministic host-scope policy;
- complete bounded URL frontier, not representative sampling;
- terminal URL-state accounting;
- canonicalization/redirect provenance;
- candidate provenance and reconciliation;
- competitor topic != proven demand.

CURRENT_CURSOR:
M4 CURRENT -> M4A REPREPARATION REQUIRED UNDER UPDATED LEVEL2 -> NO WORK PROMPT RELAY YET.


## 2026-09-18 — M4A R2 re-prepared after R0 and full KW-002 hardening transfer

R0 prerequisite:
M0_SCOPE_SOURCE_RETRO_CONSOLIDATION = PASS
M0_CURRENT_SCORE = 9.7/10

New current M4A execution authorities:
- M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18_R2.md
- M4A_EXECUTION_RELEASE_2026-09-18_R2.md
- M4A_WORK_PROMPT_2026-09-18_R2.md

The old M4A gate/prompt remains SUPERSEDED / DO NOT EXECUTE.

R2 execution unit:
- 15 accepted authority queries;
- 20 rows each;
- 300 occurrences;
- 105 unique unordered Top10 query pairs;
- no new provider calls;
- no external vendor browsing.

R2 adds the missing hardened Step06 layer:
- Top3 / Top10 / 11-20;
- complete occurrence classification;
- query profiles;
- collision/uncertainty ledger;
- exact-URL and domain pairwise Top10 similarity;
- explicit recurrence granularity;
- complete domain recurrence universe;
- curated competitor registry;
- exact M4B ranking-URL anchors.

Role correction:
Main Chat has already performed Level1/Level2/research/release governance.
Work performs only the released full-volume execution plus narrow live-HEAD/input-drift preflight.

CURRENT_CURSOR:
M4 CURRENT -> M4A R2 PREPARED -> REMOTE READBACK -> OWNER RELAYS R2 WORK PROMPT -> WORK RETURN -> OWNER ONE-STAGING UPLOAD -> MAIN CHAT RETURN QA -> only then M4B.


## 2026-09-18 — M4A R2 Work preflight HOLD / R06 transport incident

Work correctly stopped before classification because R06 historical export transport failed exact-byte verification.

Current incident authority:
`../raw/R06_09_TRANSPORT_INTEGRITY_INCIDENT_2026-09-18.md`

Important:
- R06 provider collect/lifecycle remains valid;
- seven chunk blobs are unchanged and match their historical manifest identities;
- their reconstructed gzip SHA/CRC/ISIZE do not match the historical manifest;
- raw DEFLATE body is recoverable as valid 73,385-byte R06 JSON with the correct job/revision/operation and complete 20 ranks;
- no new provider call is authorized while deterministic provider-free recovery is available.

CURRENT_CURSOR:
M4 CURRENT -> R06 TRANSPORT RECOVERY -> MAIN CHAT RECOVERY QA -> NEW M4A RELEASE -> WORK.


## 2026-09-18 — R06 provider-free transport recovery ACCEPTED

Current R06 transport authority:
`../raw/recovery/R06_2026-09-18/R06_10_RECOVERED_EXPORT_MANIFEST_2026-09-18.md`

Recovery QA:
`../raw/recovery/R06_2026-09-18/R06_11_RECOVERY_QA_2026-09-18.md`

The historical R06 manifest is superseded for exact-byte identity.

No Search replay occurred.

```text
R06_DERIVED_RECOVERY_AUTHORITY = ACCEPTED
R06_INPUT_INTEGRITY_BLOCKER = CLOSED
M4A_R2 = remains SUSPENDED/HISTORICAL
NEXT = issue fresh M4A R3 release
```


## 2026-09-18 — M4A R3 release remote-readback PASS

R3 release commit:
`0369e0556bbee9728dd148a3e8452958e8479087`

Branch compare:
`identical / ahead_by=0 / behind_by=0`.

Read back:
- R3 pre-step gate: PASS;
- R3 execution release: PASS;
- R3 Work prompt: PASS;
- R3 staging target: PASS.

R06 derived recovery authority is frozen explicitly in R3.

```text
M4A_R3_RELEASE_READBACK = PASS
M4A_R3_WORK_START_ALLOWED = true
M4A_R2_WORK_START_ALLOWED = false
```

CURRENT_CURSOR:
M4 CURRENT -> OWNER RELAYS M4A R3 WORK PROMPT -> WORK EXECUTES COMPLETE 300/105 UNIT -> OWNER ONE-STAGING UPLOAD -> MAIN CHAT RETURN QA -> only then M4B.


## 2026-09-18 — M4A R3 Main Chat ACCEPT

Authority:
`M4A_R3_MAIN_CHAT_RETURN_QA_2026-09-18.md`

Independent Main Chat QA:
- all remote output hashes match manifest;
- 300/300 occurrences;
- 15/15 profiles;
- 105/105 pairwise rows and metrics independently recomputed;
- 127/127 domain recurrence metrics independently recomputed;
- 92 collision rows fully reconciled;
- 60 registry rows traceable;
- 143 M4B anchors traceable;
- R06 recovery verified;
- S03 one-character normalized transport defect repaired provider-free/content-equivalently.

Score:
`9.8/10`.

```text
M4A_R3 = ACCEPTED
M3_STEP06_ANALYTICAL_HARDENING_VIA_M4A = PASS
M4B = CURRENT
```
