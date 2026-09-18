# Octoport SEO — M4A R3 Main Chat return QA

Date: 2026-09-18
Status: **ACCEPTED WITH MAIN CHAT S03 TRANSPORT CORRECTION**
WORK_ID: `OCTOPORT_SEO_M4A_HARDENED_2026-09-18_R3`

## 1. Upload identity

Work start/end observed HEAD:
`5713ef8ca8a07d542bbb172cf49ff3ead8224ec5`

Owner staging upload commit:
`9b19cc669bdecdb7b04d9817cd41ca22dbd54701`

The upload advanced the branch by exactly one commit and added exactly the 11 required files under:

`docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R3/`

No unrelated file changed in that upload commit.

## 2. Artifact identity and hash QA

All 10 non-self-referential output SHA-256 values were independently recomputed from remote bytes and match `M4A_RETURN_MANIFEST.json` exactly.

The return manifest intentionally records its own hash as null.

Remote unpacked files:
- source manifest;
- 300-row occurrence ledger;
- 15 query profiles;
- 105 pairwise rows;
- 127 domain recurrence rows;
- 92 collision/uncertainty rows;
- 60 registry rows;
- 143 page candidates;
- analysis;
- QA;
- return manifest.

TSV column-shape errors: `0`.

## 3. Complete occurrence accounting

Independently recomputed:

```text
AUTHORITY_QUERIES = 15
ROWS_PER_QUERY = 20 each
TOTAL_OCCURRENCES = 300
UNIQUE_OCCURRENCE_IDS = 300
RANKS_1_20_COMPLETE_EACH_QUERY = true
ORIGINAL_R04_ROWS = 0
R04R1_ROWS = 20
BAD_RANK_BUCKETS = 0
MANDATORY_OCCURRENCE_FIELD_BLANKS = 0
ENUM_ERRORS = 0
```

All 15 export-authority paths and all 15 analysis-authority paths in the source manifest exist on the upload HEAD.

R06 uses the accepted recovery authority, not the superseded historical manifest.

## 4. Query profile QA

Rows: `15`.

For every query Main Chat independently recalculated:
- Top3 target-relevant count;
- Top10 target-relevant count;
- ranks 11–20 target-relevant count.

Profile metric mismatches: `0`.

## 5. Pairwise Top10 QA

Expected unique unordered pairs:

`15 choose 2 = 105`.

Observed:
- rows = `105`;
- unique unordered pairs = `105`;
- duplicate pairs = `0`;
- missing pairs = `0`;
- self-pairs = `0`.

For all 105 pairs Main Chat independently recalculated:
- exact URL overlap;
- domain overlap;
- URL union;
- domain union;
- URL Jaccard;
- domain Jaccard.

Metric mismatches: `0`.

URL overlap and domain overlap remain separate and no clustering verdict was produced.

## 6. Domain recurrence QA

Rows: `127`.

Every one of the 300 occurrence IDs appears in exactly one domain-recurrence row:
- missing occurrence refs = `0`;
- duplicate domain assignment refs = `0`;
- invalid occurrence refs = `0`.

For all 127 domains Main Chat independently recomputed:
- all occurrence count;
- distinct-query count;
- Top3 query coverage;
- Top10 query coverage;
- ranks 11–20 query coverage;
- distinct ranking URLs;
- target-relevant occurrence count;
- target-relevant distinct-query count.

Metric mismatches: `0`.

## 7. Collision/uncertainty QA

Occurrence-level rows marked collision/uncertain: `77`.
All 77 are represented in the ledger.

Query-scope collision rows: `15`, exactly one for every authority query:
- `occurrence_id_or_query_scope = QUERY_SCOPE`;
- `rank_or_scope = ALL_1_20`;
- `collision_type = MIXED_SERP_INTENT`.

Total ledger rows:
`77 + 15 = 92`.

No ambiguity was silently deleted.

## 8. Registry QA

Registry rows: `60`.
Unique registry IDs: `60`.
Invalid source-occurrence refs: `0`.
Invalid candidate classes: `0`.

No `RECURRING_PRODUCT_VENDOR` violates the recurrence admission rule.
No `RELEVANT_ONE_OFF_PRODUCT_VENDOR` falsely claims multi-query recurrence.

Registry remains Search-derived evidence, not proof of business rivalry.

## 9. M4B anchor QA

Page candidates: `143`.

- invalid registry joins = `0`;
- ranking/normalized URLs not traceable to accepted occurrences = `0`.

These are M4B starting anchors only, not final page ownership or final site architecture.

## 10. Aggregate analytical QA

Independently recomputed occurrence composition:

```text
TARGET_RELEVANT = 204
PARTIAL_OR_ADJACENT = 81
NON_TARGET = 15
HOLD = 0
```

Market surfaces:

```text
THIRD_PARTY_PRODUCT_VENDOR = 156
EDITORIAL_OR_PUBLISHER = 97
OTHER = 22
NATIVE_MARKETPLACE = 12
AGGREGATOR_OR_DIRECTORY = 7
SERVICE_OR_AGENCY = 6
```

All page-type aggregate counts in `M4A_ANALYSIS.md` match the occurrence ledger.

## 11. Main Chat correction MC-QAF-01 — S03 normalized transport

Historical S03 normalized file is malformed by exactly one extra trailing closing brace.

Independent Main Chat check:

```text
historical blob = 0a8db42e188c112610790c3260da263bde66a621
historical chars = 9407
standard whole-file JSON parse = FAIL
first/only complete object chars = 9406
trailing data = exactly "}"
second object = none
ambiguity = none
```

The single complete object parses and has:
- accepted S03 job/revision/operation/query;
- embedded source identity;
- 20 results;
- ranks 1–20;
- accepted validation fields.

Work documented this issue before analysis and used exactly that object.

Main Chat materialized a content-equivalent corrected normalized transport under:

`docs/seo/serp/exports/recovery/S03_2026-09-18/`

No M4A rerun is required because the recovered file is exactly the object Work used, with no semantic or row change.

## 12. R06 QA

R06 current recovery authority remains accepted.

Work reports and Main Chat prior recovery QA agree:

```text
source bytes = 73385
source SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
gzip bytes = 20604
gzip SHA256 = f764c509f47f0a53a33b90a7c3dc5c8f61d62137da1b339360acb9c844a1b608
historical R06 manifest used as current = false
```

No provider replay occurred.

## 13. Scope boundary

Confirmed from Work outputs:

```text
NEW_PROVIDER_CALLS = 0
EXTERNAL_VENDOR_BROWSING = 0
FINAL_CLUSTER_DECISIONS = 0
FINAL_PAGE_OWNERSHIP_DECISIONS = 0
URL/H1/TITLE/IA_FINALIZATION = 0
```

## 14. Main Chat quality score

| dimension | score /10 |
|---|---:|
| goal/output completeness | 10.0 |
| method/source support | 9.5 |
| input evidence/provenance integrity | 9.5 |
| coverage/completeness | 10.0 |
| analytical correctness/claim boundaries | 9.5 |
| adversarial QA quality | 10.0 |
| persistence/readback/reproducibility | 10.0 |
| owner usability/plain language | 9.5 |
| information gain/execution efficiency | 10.0 |
| downstream readiness | 10.0 |

```text
QUALITY_TOTAL = 98 / 100
QUALITY_SCORE = 9.8 / 10
ALL_HARD_GATES = PASS after MC-QAF-01 transport repair
OPEN_CRITICAL_DEFECTS = 0
```

## 15. Acceptance

```text
M4A_R3 = ACCEPTED
M3_STEP06_ANALYTICAL_HARDENING_VIA_M4A = PASS
R06_RECOVERY_AUTHORITY = ACCEPTED
S03_NORMALIZED_TRANSPORT_RECOVERY = PASS
M4B_ALLOWED = true
M3_FULL_SERP_DEVICE_REGION_TEMPORAL_CONTROL = STILL DEFERRED_TO_M6
M7 = BLOCKED
```

Next physical stage:
M4B — current authorized competitor/public-surface acquisition under the M4 Level2 contract.
