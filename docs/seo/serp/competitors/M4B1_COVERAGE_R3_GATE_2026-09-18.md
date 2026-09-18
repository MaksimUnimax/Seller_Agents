# Octoport SEO — M4B1 Coverage Closure R3 gate

Date: 2026-09-18
Status: **PREPARED / RELEASE CANDIDATE / WORK NOT STARTED**
WORK_ID: `OCTOPORT_SEO_M4B1_COVERAGE_CLOSURE_2026-09-18_R3`
Stage: M4B1 page-surface lane
Purpose: canonical discovery-channel closure after accepted R1+R2 partial evidence
Preparation base HEAD: `c852ff094864b56093848a04f142e2f146576a62`

## 1. Why R3 exists

R1 and R2 already produced substantial current page-surface evidence.

Accepted current layers:

```text
R1 URL authority = 372 rows
R1 page evidence = 249 rows
R2 initial navigation delta = 835 rows
R2 recursive new URL identities = 405
R2 page evidence = 579 rows
CURRENT NON-RESIDUAL UNIQUE NORMALIZED URL UNIVERSE = 1612
R2 URL-LEVEL OPEN UNRESOLVED = 0
```

R2 also emitted 416 page-level child-link enumeration residual flags.

Main Chat QA determined that the 416 flags are diagnostic history produced by an over-strict job-specific recursive rule. They are **not** 416 mandatory page revisits.

Current method authority:

- `docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md`;
- `docs/seo/serp/competitors/M4B_PAGE_SURFACE_FRONTIER_METHOD_CORRECTION_2026-09-18.md`;
- current KW-002 Step07 bounded URL-discovery model.

Canonical closure uses bounded discovery channels, not the complete transitive internal-link graph.

## 2. Frozen upstream authority

Mandatory:

- `M4B1_R2_MAIN_CHAT_MERGED_QA_2026-09-18.md`;
- R1 scope/url/page/entity/candidate files;
- R2 source/url/page/entity/candidate/reconciliation files;
- both Opera navigation-evidence JSONs;
- accepted M4A registry/page anchors;
- current M4 Level2.

Frozen identities:

```text
R1_SCOPE_BLOB = 3a0af7e2745d46d14634760b1e464a85c590b4c7
R1_URL_BLOB = a9b3f1bf9878e6008d82994e512c4e3fdb3c5165
R1_PAGE_BLOB = b24772cbd3b9d54b9ff300510f362ca7459cc883

R2_URL_OVERLAY_BLOB = 90d6dd1d483a8e6c78bcbab1033c39466b7714bb
R2_PAGE_OVERLAY_BLOB = c7b0a8774ed83088a00ea79dabc8f0d48a2db050
R2_ENTITY_CURRENT_BLOB = 860a1eca42054bb3b04a1c307da879ecf27d97ac
R2_FRONTIER_RECONCILIATION_BLOB = af9e801cdf3af66700fd122371a2187de748df5f

R2_MAIN_CHAT_QA_BLOB = dee0ef305301f2d81855fc72595654844b48a04a
FRONTIER_METHOD_CORRECTION_BLOB = 37aa4f3320ba54806d41a3c3c8d19892827d3d82
CURRENT_M4_LEVEL2_BLOB = 1f35455b9527235f69a77b18060f1dd7274d7c6b
```

Work must HOLD on material authority drift.

## 3. Exact execution unit

Exactly the same 45 accepted M4B1 registry entities.

Do not add competitors.

R3 is a **discovery-channel audit and delta closure**, not a page-crawl restart.

For each of the 45 entities, terminally account for these channels:

```text
ANCHORS
PRIMARY_NAV_TAXONOMY
BREADCRUMB_OR_LOCAL_SUBTREE
SCOPED_SITEMAP
PAGINATION_OR_LOAD_MORE
NEW_ELIGIBLE_URL_DELTA
```

Allowed channel states:

- `COMPLETE`;
- `NOT_APPLICABLE`;
- `NOT_FOUND`;
- `ACCESS_BLOCKED`;
- `UNSCOPABLE_WITH_REASON`;
- `HOLD`.

A blocking `HOLD` prevents PASS.

## 4. Anchor and navigation reuse

### Anchors

All 100 accepted M4A anchors are already accounted by R1/R2.
Do not reacquire them.

### Primary navigation/taxonomy

Reuse:
- R1 entities where `browser_navigation_enumerated=true`;
- Main Chat Opera navigation evidence A/B for the 23 entities that R1 could not enumerate.

Do not repeat sitewide navigation on every page.

If the frozen navigation evidence is insufficient to determine current relevant taxonomy, perform a narrow current public navigation check for that entity only.

## 5. Breadcrumb/local subtree channel

For `EVIDENCE_ANCHORED_RELEVANT_SUBTREE` entities, verify that the accepted anchors/current inspected pages expose enough breadcrumb/local taxonomy evidence to define the relevant subtree.

Open a prior page only when needed to resolve the subtree boundary.

Do not expand from body recommendations, unrelated recent-post widgets, footer-wide corporate links or arbitrary contextual links.

For `THEME_SCOPED_PUBLIC_TAXONOMY`, a separate breadcrumb crawl is not required when the primary public taxonomy already defines the relevant theme; record `NOT_APPLICABLE` with basis.

## 6. Scoped sitemap channel

For every entity:

1. inspect public `robots.txt` where available for sitemap declarations;
2. inspect declared sitemap/sitemap-index URLs;
3. if none is declared, a conventional public sitemap location may be checked;
4. scope sitemap entries to the frozen authorized host/path/theme before admitting them;
5. for broad sites, do not import unrelated whole-site URLs merely because a global sitemap exists;
6. record sitemap channel terminal state and evidence basis.

Valid examples:

- `COMPLETE`: all in-scope sitemap entries reconciled;
- `NOT_FOUND`: no public sitemap after bounded checks;
- `ACCESS_BLOCKED`: public sitemap exists but normal access is blocked;
- `UNSCOPABLE_WITH_REASON`: a general sitemap cannot be deterministically mapped to the frozen relevant subtree without importing unrelated site surface.

`UNSCOPABLE_WITH_REASON` is not permission to sample. It requires a plain boundary reason and relies on the completed navigation/local-subtree channels.

## 7. Pagination / load-more channel

For each in-scope public collection/category/blog/help/taxonomy surface in the current authority:

- detect sequential pagination, explicit next/prev, page-number URLs or stable public load-more URLs;
- enumerate all pages required for the bounded collection;
- if no pagination/load-more exists, record `NOT_APPLICABLE`;
- if rendered load-more exists but exhaustive public enumeration cannot be established, record `HOLD` or `ACCESS_BLOCKED` as evidence supports.

Do not treat arbitrary related-post links as pagination.

## 8. Current URL-universe comparison

The frozen current non-residual normalized universe contains exactly `1612` identities:

```text
372 R1
+ 835 initial navigation delta
+ 405 recursive R2
= 1612
```

Every URL discovered by the R3 canonical channels must be compared against that universe.

Allowed results:

- `ALREADY_CURRENT`;
- `NEW_IN_SCOPE`;
- `NEW_OUT_OF_SCOPE`;
- `DUPLICATE_CANONICAL`;
- `FACET_OR_SORT_VARIANT`;
- `NON_HTML`;
- inaccessible/error terminal state.

Every genuinely new in-scope URL must itself reach a terminal state and, if inspected, receive structured page evidence and candidate provenance.

## 9. What R3 must NOT do

Do not:

- re-open all 416 R2 child-link diagnostic pages;
- recompute the complete internal-link graph;
- repeat all 579 R2 page captures;
- repeat all 249 R1 page captures;
- follow every content-body link;
- expand external domains;
- add competitor entities;
- login or bypass auth/CAPTCHA/paywalls;
- run Search, Wordstat or Alice providers;
- decide final cluster/page/URL/H1/Title/IA;
- perform M4Q ranking-query acquisition in this R3.

M4Q is a separate lane.

## 10. R3 URL overlay

Create `M4B1R3_URL_OVERLAY.tsv`.

Minimum fields:

- `r3_url_id`;
- `registry_id`;
- `entity_name`;
- `source_channel`;
- `discovery_source_url`;
- `raw_url`;
- `normalized_comparison_url`;
- `relation_to_current_1612`;
- `scope_disposition`;
- `redirect_chain`;
- `final_url`;
- `declared_canonical`;
- `terminal_state`;
- `captured_at`;
- `evidence_capture_method`;
- `notes`.

Only R3-discovered URL evidence belongs here.

## 11. R3 page evidence and candidate overlay

For every R3 `INSPECTED` new URL, create structured page evidence using the existing M4B1 schema.

Create candidate rows only for new R3 inspected pages.

Do not duplicate existing R1/R2 candidate provenance unless new page evidence materially adds another occurrence; if it does, preserve the new occurrence provenance.

## 12. Discovery-channel coverage ledger

Create `M4B1R3_DISCOVERY_CHANNEL_COVERAGE.tsv` with exactly 45 rows.

Required fields:

- registry/entity/class/domain/scope policy;
- anchors_status;
- primary_nav_taxonomy_status;
- breadcrumb_local_subtree_status;
- sitemap_status;
- sitemap_basis;
- pagination_status;
- pagination_basis;
- current_1612_urls_for_entity;
- r3_new_url_count;
- r3_new_inspected_count;
- inaccessible_count;
- blocking_hold_count;
- page_surface_completion_state;
- limitation_notes.

Allowed page-surface completion:

- `COMPLETE`;
- `COMPLETE_WITH_INACCESSIBLE_EVIDENCE`;
- `HOLD`.

## 13. Current entity synthesis

Create `M4B1R3_ENTITY_SYNTHESIS_CURRENT.tsv` exactly 45 rows by logically merging:

`R1 + R2 + R3`.

Historical files remain immutable.

## 14. Final frontier reconciliation

Create `M4B1R3_FRONTIER_RECONCILIATION.tsv` exactly 45 rows.

It must state:

- R1 current URL count;
- R2 added URL count;
- R3 discovered URL count;
- current merged unique normalized URL count;
- terminal current URL count;
- channel statuses;
- open URL unresolved count;
- open channel HOLD count;
- completion state.

PASS candidate requires zero open URL unresolved and zero blocking channel HOLD.

The old R2 `416 child-link residual` count may be carried as a diagnostic field but cannot itself set completion false.

## 15. Work trigger

`WORK_TRIGGER = MET`.

Reason:
45 public sites, sitemap indexes, pagination and potentially large scoped sitemap deltas require deterministic full-volume processing. Ordinary chat must not sample.

## 16. Required deliverables — exactly 9

1. `M4B1R3_SOURCE_MANIFEST.md`
2. `M4B1R3_DISCOVERY_CHANNEL_COVERAGE.tsv`
3. `M4B1R3_URL_OVERLAY.tsv`
4. `M4B1R3_PAGE_EVIDENCE_OVERLAY.tsv`
5. `M4B1R3_CANDIDATE_TERMS_OVERLAY.tsv`
6. `M4B1R3_ENTITY_SYNTHESIS_CURRENT.tsv`
7. `M4B1R3_FRONTIER_RECONCILIATION.tsv`
8. `M4B1R3_QA.md`
9. `M4B1R3_RETURN_MANIFEST.json`

Files may contain only headers when a particular R3 delta is legitimately zero.

## 17. Hard QA

```text
LIVE_BRANCH_FETCHED = true
R1_R2_CURRENT_AUTHORITIES_VERIFIED = true
AUTHORIZED_ENTITIES = 45
DISCOVERY_CHANNEL_COVERAGE_ROWS = 45
ANCHOR_CHANNEL_COMPLETE = 45/45
PRIMARY_NAV_TAXONOMY_TERMINAL = 45/45
BREADCRUMB_LOCAL_CHANNEL_TERMINAL = 45/45
SITEMAP_CHANNEL_TERMINAL = 45/45
PAGINATION_CHANNEL_TERMINAL = 45/45
R3_NEW_URL_SILENT_LOSS = 0
ALL_R3_NEW_ELIGIBLE_URLS_TERMINAL = true
ALL_R3_NEW_INSPECTED_HAVE_PAGE_EVIDENCE = true
FINAL_ENTITY_SYNTHESIS_ROWS = 45
FINAL_FRONTIER_RECONCILIATION_ROWS = 45
OPEN_URL_UNRESOLVED = 0
OPEN_BLOCKING_CHANNEL_HOLD = 0
ARBITRARY_SAMPLING = 0
COMPLETE_INTERNAL_LINK_GRAPH_REQUIRED = false
R2_416_DIAGNOSTIC_REPLAY_REQUIRED = false
NEW_COMPETITOR_ENTITIES = 0
SEARCH_PROVIDER_CALLS = 0
WORDSTAT_PROVIDER_CALLS = 0
ALICE_PROVIDER_CALLS = 0
FINAL_PAGE_CLUSTER_IA_DECISIONS = 0
COMPETITOR_CLAIM_AS_OCTOPORT_FACT = 0
COMPETITOR_TOPIC_AS_PROVEN_DEMAND = 0
OPEN_CRITICAL_DEFECTS = 0
```

If a canonical discovery channel remains materially unresolved, return `PARTIAL / RECOVERY_REQUIRED` with exact channel/entity rows.

## 18. Return

One ZIP containing exactly the 9 final deliverables.

Work does not write GitHub.

Owner uploads all 9 unpacked files together to:

`docs/seo/serp/competitors/work_return/M4B1_COVERAGE_CLOSURE_2026-09-18_R3/`

Main Chat performs independent merged R1+R2+R3 QA before M4B1 acceptance.
