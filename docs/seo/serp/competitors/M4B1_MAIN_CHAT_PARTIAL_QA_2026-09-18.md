# Octoport SEO — M4B1 Main Chat partial-return QA

Date: 2026-09-18
Status: **PARTIAL ACCEPTED AS RECOVERY AUTHORITY / M4B1 NOT ACCEPTED**
WORK_ID: `OCTOPORT_SEO_M4B1_PRODUCT_VENDOR_2026-09-18_R1`
Owner upload HEAD: `ddb7ce16f325f92014de383039400523a7de7742`

## 1. Upload identity

Owner upload advanced the branch by exactly one commit from the authorized M4B1 release and added exactly the 9 required files under:

`docs/seo/serp/competitors/work_return/M4B1_PRODUCT_VENDOR_2026-09-18_R1/`

No unrelated path changed in that upload commit.

## 2. Independent artifact integrity

Main Chat independently recomputed SHA-256 for all 8 non-self-referential outputs covered by the return manifest.

Result:

```text
OUTPUT_HASH_MISMATCHES = 0
RETURN_MANIFEST_JSON_PARSE = PASS
TSV_COLUMN_SHAPE_ERRORS = 0
```

## 3. Independent accounting

```text
SCOPE_ROWS = 45
URL_LEDGER_ROWS = 372
ACCEPTED_ANCHORS = 100
DISCOVERED_URL_ROWS = 272
PAGE_EVIDENCE_ROWS = 249
ENTITY_SYNTHESIS_ROWS = 45
CANDIDATE_TERM_ROWS = 390
```

Terminal states independently reproduced:

```text
INSPECTED = 249
EXECUTION_ENVIRONMENT_FAILURE = 38
DYNAMIC_UNRESOLVED = 5
ROBOTS_OR_SITE_POLICY_BLOCKED = 2
OUT_OF_SCOPE = 71
AUTH_REQUIRED = 3
NON_HTML = 4
```

Residual recovery rows:
`45 = 38 execution-environment + 5 dynamic + 2 site-policy-blocked`.

Entities with `browser_navigation_enumerated=false`:
`23`.

Scope completion:
- `12 COMPLETE_BOUNDED_FRONTIER`;
- `33 RECOVERY_REQUIRED`.

## 4. Join QA

```text
INSPECTED_URL_WITHOUT_PAGE_EVIDENCE = 0
PAGE_EVIDENCE_WITHOUT_INSPECTED_URL = 0
ENTITY_SYNTHESIS_WITHOUT_SCOPE_ENTITY = 0
CANDIDATE_TERM_WITHOUT_PAGE_ID = 0
```

Candidate statuses:
- ALREADY_PRESENT = 239
- POSSIBLE_VARIANT = 105
- OUT_OF_SCOPE = 46

No candidate is current demand authority.

## 5. Verdict

Work correctly returned PARTIAL rather than manufacturing PASS.

The 249 inspected pages, 45 scope rows, 45 synthesis rows, 390 candidate rows and terminal ledger are accepted as **durable partial evidence**.

They are not final M4B1 authority until residual recovery closes.

```text
M4B1_WORK_PARTIAL_RETURN = VALID
M4B1 = RECOVERY_REQUIRED
M4B1_ACCEPTED = false
M4B2_ALLOWED = false
M4C_ALLOWED = false
```

Exact recovery queues are frozen in sibling files:
- `M4B1_RECOVERY_URL_QUEUE_2026-09-18.tsv`;
- `M4B1_NAVIGATION_RECOVERY_QUEUE_2026-09-18.tsv`.
