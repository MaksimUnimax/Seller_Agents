# Octoport SEO — M4B1 recovery R2 full-volume delta gate

Date: 2026-09-18
Status: **AUTHORIZED / REMOTE READBACK PASS / WORK MAY START**
WORK_ID: `OCTOPORT_SEO_M4B1_RECOVERY_2026-09-18_R2`
Stage: M4B1 recovery overlay
Preparation base HEAD: `ce7672e4572da22ce9b1c5045541a239394dcd54`

## 1. Why a second Work unit is required

M4B1 R1 correctly returned PARTIAL.

Main Chat then performed bounded Opera recovery rather than treating Work browser failures as site failures.

Results already persisted:

- original Work URL ledger: 372 rows;
- original Work page evidence: 249 rows;
- exact residual queue: 45;
- Opera post-recovery decisions: 45/45;
- Opera navigation enumeration: 23/23 entities;
- raw browser navigation evidence: persisted in two JSON authorities.

Residual URL outcome:

```text
43 INSPECTED/readable
1 AUTH_REQUIRED (Berkuz LK)
1 NOT_FOUND (Mayak /webinars_mayak)
remaining old environment/dynamic/site-policy residual = 0
```

Navigation enumeration exposed a new bounded same-entity URL universe that R1 could not see.

After conservative normalization and deduplication against the 372-row R1 ledger:

```text
INITIAL_NAVIGATION_DELTA_ROWS = 835
NEEDS_SCOPE_CLASSIFICATION = 649
NON_HTML_CANDIDATE = 111
LEGAL_OR_CORPORATE_CANDIDATE = 44
AUTH_OR_PRIVATE_CANDIDATE = 31
```

This is now a large-data/full-frontier unit. Manual selective inspection would violate the full-volume rule.

## 2. Frozen recovery inputs

Mandatory authorities:

- `M4B1_MAIN_CHAT_PARTIAL_QA_2026-09-18.md`;
- `M4B1_BROWSER_RECOVERY_GATE_2026-09-18.md`;
- `M4B1_BROWSER_RECOVERY_CHECKPOINT_2026-09-18.md`;
- `M4B1_RESIDUAL_BROWSER_OUTCOMES_2026-09-18.tsv`;
- `M4B1_NAVIGATION_BROWSER_EVIDENCE_A_2026-09-18.json`;
- `M4B1_NAVIGATION_BROWSER_EVIDENCE_B_2026-09-18.json`;
- `M4B1_NAVIGATION_DISCOVERY_DELTA_2026-09-18.tsv`;
- R1 Work scope/url/page/synthesis/candidate authorities;
- accepted M4A registry.

Exact browser-evidence blobs:

- nav A: `9e317dea6915857a7ff96a746aeabd7a731c5101`;
- nav B: `a2968d64b7888c07dd5b8ac8119c6c49b8dd89cc`;
- initial delta TSV: `9ec4cf1c72531e7e0e937fe576cfa116c7effed9`.

## 3. Do not redo accepted R1 evidence

The 249 original `INSPECTED` R1 pages remain accepted partial evidence.

Do NOT re-inspect them merely to rebuild the same evidence.

Exception:
a prior page may be opened only when strictly needed to resolve:
- redirect/canonical identity;
- discovery lineage for a newly enumerated URL;
- a material contradiction in current page state.

Any such repeat must be explicitly marked `REVISIT_FOR_IDENTITY_OR_LINEAGE`.

## 4. Recovery unit A — 43 browser-recovered pages

Exactly 43 rows in `M4B1_RESIDUAL_BROWSER_OUTCOMES_2026-09-18.tsv` have:

`post_recovery_state = INSPECTED`.

Main Chat proved those URLs publicly readable in Opera, but did not manually manufacture the full page-evidence schema in chat.

R2 must create structured page evidence for all 43 using the M4B1 page-evidence schema.

The two non-page residuals remain:

- Berkuz LK = `AUTH_REQUIRED`;
- Mayak `/webinars_mayak` = `NOT_FOUND`.

Do not reinterpret them without contradictory current public evidence.

## 5. Recovery unit B — 835 initial navigation delta rows

Every row in `M4B1_NAVIGATION_DISCOVERY_DELTA_2026-09-18.tsv` must receive a deterministic disposition.

The `preclassification_hint` is a triage hint, not an automatic truth verdict.

Allowed initial outcomes:

- `DUPLICATE_EXISTING_AUTHORITY`;
- `INSPECTED`;
- `OUT_OF_SCOPE`;
- `DUPLICATE_CANONICAL`;
- `FACET_OR_SORT_VARIANT`;
- `NON_HTML`;
- `ROBOTS_OR_SITE_POLICY_BLOCKED`;
- `AUTH_REQUIRED`;
- `CAPTCHA_OR_ANTI_BOT`;
- `HTTP_ERROR`;
- `TIMEOUT`;
- `NOT_FOUND`;
- `REDIRECT_IN_SCOPE`;
- `REDIRECT_OUT_OF_SCOPE`;
- `DYNAMIC_UNRESOLVED`;
- `EXECUTION_ENVIRONMENT_FAILURE`;
- `ERROR`.

No row may disappear because it looks like legal/auth/image content.

Obvious non-HTML extensions may become `NON_HTML` without full page-text capture, but lineage remains.

## 6. Scope classification

Use the exact frozen per-entity scope policy from R1.

### THEME_SCOPED_PUBLIC_TAXONOMY

For specialized seller/marketplace products:
include the relevant public product/module/use-case/help/guide/pricing/proof taxonomy.

Do not treat auth/private application pages as public product evidence.

### EVIDENCE_ANCHORED_RELEVANT_SUBTREE

For broad sites:
include only the marketplace/seller/AI/product subtree evidenced by the accepted anchors and frozen browser navigation.

Do not expand into unrelated corporate/general-content branches.

Examples of hard broad-site boundaries:

- KT.Team: marketplace/ecommerce AI pages and directly relevant AI solution content, not the complete consulting/HR/technology site;
- Legasoft: marketplace blog/service subtree, not all 1C/software catalog;
- Moysklad: marketplace content/product pages, not all retail/accounting knowledge;
- PromoPult: marketplace/ecommerce subtree linked from accepted anchors, not all SEO/PPC media;
- Saintpack: marketplace fulfillment/service pages, not corporate/legal media.

## 7. Recursive frontier rule

The 835 rows are the **initial frozen navigation delta**, not permission to stop at one depth.

For every new in-scope `INSPECTED` page:

- inspect allowed same-entity in-scope links;
- add genuinely new URLs to the recovery ledger with deterministic `M4B1R2U*` IDs;
- preserve parent/discovery lineage;
- continue until no unterminalized eligible URL remains.

Do NOT follow:

- external domains;
- private/authenticated areas;
- CAPTCHA-bypassed paths;
- unrelated site sections;
- arbitrary site search results not inside frozen scope.

If recursive scope grows materially, process deterministic complete chunks. Never sample.

## 8. Recovery URL overlay schema

Create `M4B1R2_URL_LEDGER_OVERLAY.tsv`.

Required fields:

- `recovery_url_id`;
- `initial_delta_id`;
- `registry_id`;
- `entity_name`;
- `candidate_class`;
- `scope_policy`;
- `raw_url`;
- `normalized_comparison_url`;
- `discovery_source_url`;
- `discovery_source_recovery_id`;
- `discovery_depth`;
- `initial_preclassification_hint`;
- `scope_disposition`;
- `redirect_chain`;
- `final_url`;
- `declared_canonical`;
- `terminal_state`;
- `captured_at`;
- `evidence_capture_method`;
- `http_or_tool_observation`;
- `residual_recovery_required`;
- `notes`.

All 835 initial delta IDs must appear exactly once in the overlay or be explicitly mapped to a duplicate recovery identity.

All recursive URLs get their own rows.

## 9. Page evidence overlay

Create `M4B1R2_PAGE_EVIDENCE_OVERLAY.tsv`.

Use the original M4B1 page-evidence schema plus:

- `recovery_url_id`;
- `source_layer` = `R1_RESIDUAL_RECOVERY` or `R2_NAVIGATION_DELTA`.

Every R2 `INSPECTED` recovery URL requires one page-evidence row.

Do not copy full page bodies.

## 10. Candidate-term overlay

Create `M4B1R2_CANDIDATE_TERMS_OVERLAY.tsv`.

Every new candidate keeps:
- recovery page provenance;
- short observed wording;
- normalized key;
- relation to existing M4B1 evidence;
- status;
- M6 validation requirement.

No competitor phrase becomes proven demand.

## 11. Final current entity synthesis

Create `M4B1R2_ENTITY_SYNTHESIS_CURRENT.tsv` with exactly 45 rows.

It must merge R1 partial evidence + R2 recovery overlay into the current state without modifying historical R1 files.

For each entity include final:
- anchors accounted;
- R1 inspected pages;
- R2 additional inspected pages;
- out-of-scope/non-html/auth/not-found counts;
- complete discovered/terminal counts;
- public positioning/jobs/marketplace/data/AI/action/integration/pricing/proof/CTA patterns;
- Octoport overlap/difference;
- new candidate count;
- residual count;
- completion state.

## 12. Frontier reconciliation

Create `M4B1R2_FRONTIER_RECONCILIATION.tsv` — exactly 45 rows.

Mandatory count equation per entity:

```text
CURRENT_DISCOVERED_UNIQUE_URLS
=
CURRENT_TERMINAL_UNIQUE_URLS
+
OPEN_UNRESOLVED_UNIQUE_URLS
```

For PASS:
`OPEN_UNRESOLVED_UNIQUE_URLS = 0`.

Also record:
- original R1 URL count;
- initial navigation delta count;
- recursive R2 discovered count;
- duplicate-existing count;
- inspected R1;
- inspected R2;
- each terminal-state count.

## 13. Browser/environment rule

```text
TOOL FAILURE != SITE FAILURE
```

If Work cannot access a URL that Main Chat already proved readable, classify it as `EXECUTION_ENVIRONMENT_FAILURE`, never site-down.

Return exact residuals. Do not erase Opera recovery authority.

## 14. Work trigger

`WORK_TRIGGER = MET`.

Reason:

835 initial delta rows + 43 structured residual pages + recursive frontier + final 45-entity reconciliation is a full-volume, many-to-many browsing/data-integration unit.

Quality requires Work.

## 15. Required deliverables — exactly 9

1. `M4B1R2_SOURCE_MANIFEST.md`
2. `M4B1R2_URL_LEDGER_OVERLAY.tsv`
3. `M4B1R2_PAGE_EVIDENCE_OVERLAY.tsv`
4. `M4B1R2_ENTITY_SYNTHESIS_CURRENT.tsv`
5. `M4B1R2_CANDIDATE_TERMS_OVERLAY.tsv`
6. `M4B1R2_FRONTIER_RECONCILIATION.tsv`
7. `M4B1R2_ANALYSIS.md`
8. `M4B1R2_QA.md`
9. `M4B1R2_RETURN_MANIFEST.json`

## 16. Hard QA

PASS candidate requires:

```text
R1_PARTIAL_AUTHORITY_READ = true
OPERA_RESIDUAL_OUTCOMES_READ = true
NAV_A_B_BROWSER_EVIDENCE_READ = true
INITIAL_NAV_DELTA_ROWS = 835
ALL_INITIAL_DELTA_ROWS_DISPOSITIONED = true
R1_RECOVERED_INSPECTED_ROWS = 43
R1_RECOVERED_STRUCTURED_PAGE_EVIDENCE_ROWS = 43
BERKUZ_LK_AUTH_REQUIRED_PRESERVED = true
MAYAK_WEBINARS_MAYAK_NOT_FOUND_PRESERVED = true
RECURSIVE_ELIGIBLE_FRONTIER_CLOSED = true
ALL_RECOVERY_DISCOVERED_URLS_TERMINAL = true
SILENT_URL_LOSS = 0
ARBITRARY_SAMPLING = 0
FINAL_ENTITY_SYNTHESIS_ROWS = 45
FRONTIER_RECONCILIATION_ROWS = 45
OPEN_UNRESOLVED_URLS = 0
COMPETITOR_CLAIM_AS_OCTOPORT_FACT = 0
COMPETITOR_TOPIC_AS_PROVEN_DEMAND = 0
FULL_PAGE_COPY_STORAGE = 0
NEW_COMPETITOR_ENTITIES = 0
SEARCH_PROVIDER_CALLS = 0
WORDSTAT_PROVIDER_CALLS = 0
ALICE_PROVIDER_CALLS = 0
FINAL_CLUSTER_PAGE_IA_DECISIONS = 0
OPEN_CRITICAL_DEFECTS = 0
```

If environment failures remain, return `PARTIAL / RECOVERY_REQUIRED` with exact residuals; do not fake PASS.

## 17. Return

Work does not publish to GitHub.

One ZIP containing exactly the 9 outputs.

Owner uploads all 9 unpacked files together to:

`docs/seo/serp/competitors/work_return/M4B1_RECOVERY_2026-09-18_R2/`

Main Chat independently QA's the merged R1+R2 authority before M4B1 acceptance.
