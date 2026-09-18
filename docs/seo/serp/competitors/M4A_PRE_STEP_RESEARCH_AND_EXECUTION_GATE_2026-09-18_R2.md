# Octoport SEO — M4A R2 pre-step research and execution gate

Date: 2026-09-18
Status: **HOLD / RELEASE SUSPENDED / R06 AUTHORITY INPUT INTEGRITY FAILURE**
WORK_ID: OCTOPORT_SEO_M4A_HARDENED_2026-09-18_R2
Stage: M4 — Search competitor + landing corpus
Substep: M4A — hardened current-search competitor derivation from accepted M3
Preparation base HEAD: 2612c3268de5d8fd30221057e10ad552f15bd37d

This file supersedes the earlier M4A preparation for execution purposes. The earlier file and prompt remain historical / DO NOT EXECUTE.

## 1. Goal

Use the complete accepted M3 organic corpus to finish the missing hardened Step06 analytical layer and derive the only competitor authority allowed to feed M4B.

Expected accepted corpus:

15 authority queries × 20 organic results = 300 occurrences.

No new Search/Wordstat/Alice/provider acquisition occurs in M4A.

M4A answers:
- what result/page roles dominate each accepted query at Top3, Top10 and ranks 11-20;
- where collision/uncertainty exists;
- which URLs/domains recur, with explicit metric granularity;
- how similar every query pair is at Top10 by exact URL and domain;
- which material entities form the curated Search-competitor registry;
- which accepted ranking URLs are anchor candidates for M4B.

M4A does NOT:
- browse current competitor pages;
- prove demand from competitor content;
- decide final clusters/pages/URLs/H1/Title/IA;
- run provider calls.

## 2. Main Chat two-level gate — PASS

LIVE HEAD at preparation start:
2612c3268de5d8fd30221057e10ad552f15bd37d

Level1 read:
- docs/seo/LEVEL1/README.md
- docs/seo/EXECUTION_RULES.md
- docs/seo/QUALITY_FIRST_RESOURCE_RULE.md
- docs/seo/WORK_HANDOFF_RULE.md

Level2 read:
- docs/seo/LEVEL2/README.md
- docs/seo/LEVEL2/OCTOPORT_STEP_RULES_INDEX.md
- docs/seo/LEVEL2/OCTOPORT_KW002_RULE_TRANSFER_AUDIT_2026-09-18.md
- docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md
- docs/seo/LEVEL2/OCTOPORT_M0_M3_COMPLETED_STAGE_KW002_RETRO_AUDIT_2026-09-18.md

Current work/evidence read:
- docs/seo/evidence/M0_SCOPE_SOURCE_RETRO_CONSOLIDATION_2026-09-18.md
- docs/seo/SEO_MASTER_ROADMAP_2026-09-16.md
- docs/seo/serp/M3_QUERY_MATRIX_2026-09-16.md
- docs/seo/serp/SERP_PROGRESS.md
- docs/seo/serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md
- docs/seo/work/M2R_RECONCILIATION_MAIN_CHAT_RETURN_QA_2026-09-17.md
- current M4 progress / historical failed preparation state

Failure history read:
- rule-memory / two-level authority failure;
- Work-governance duplication lesson transferred from KW-002;
- M2R Work return defects QAF-01/02/03;
- hardened KW-002 Step06 lessons;
- M3 incomplete historical DoD.

R0 dependency:
M0_SCOPE_SOURCE_RETRO_CONSOLIDATION = PASS
M0 current score = 9.7/10.

## 3. Fresh external method research — 2026-09-18

### Yandex Webmaster — query selection and market analysis
https://yandex.ru/support/webmaster/ru/service/queries-selection

Current supported claims:
- Yandex exposes popular sites and popular pages for selected queries;
- query clustering is based on closeness of meaning or user intent;
- region and device may be selected;
- popular-site/page data is an averaged market-analysis surface, not the same thing as the project's live M3 snapshot.

Project application:
Search-competitor derivation must stay query/page evidence-driven and preserve the exact live M3 query/rank/URL lineage.

### Yandex Webmaster — Search quality
https://yandex.ru/support/webmaster/ru/search-quality

Current supported claim:
Search aims to provide information in a form that lets the user solve the task efficiently; query/content/location and other signals contribute to result selection.

Project application:
M4A classification records page/result roles and user-task fit instead of counting lexical keyword matches only.

### Industry corroboration — Ahrefs keyword clustering
https://ahrefs.com/blog/keyword-clustering/

Supported workflow idea:
similarity of actual search results is evidence of similar intent.

Project application:
M4A computes complete pairwise Top10 exact-URL and domain similarity. It does not use a universal overlap threshold and does not create final pages.

Claim boundary:
exact-URL-vs-domain weighting and the specific Top3/Top10/11-20 hardening are current project/KW-002 validated method controls, not claims attributed to Yandex.

## 4. Frozen authority query set

Exactly these 15 authorities:

| ID | query | family |
|---|---|---|
| S01 | ии агенты для маркетплейсов | F1,F9 |
| S02 | ии агент для озон | F1 |
| S03 | ии агент для wildberries | F1 |
| R01 | подключить chatgpt к маркетплейсу | F2 |
| R02 | chatgpt для ozon | F2 |
| R03 | chatgpt для wildberries | F2 |
| R04R1 | аналитика маркетплейсов для селлеров | F3,F9 |
| R05 | отчеты для селлеров маркетплейсов | F3 |
| R06 | помощник селлера маркетплейсов | F4 |
| R07 | как заполнить карточку товара wildberries | F5,F8 |
| R08 | аналитика рекламы маркетплейсов | F6 |
| R09 | поисковые запросы wildberries для продавца | F7 |
| R10 | анализ ниш wildberries для продавца | F7 |
| R11 | как работать в кабинете wildberries продавцу | F8 |
| R12 | какой ии выбрать для маркетплейсов | F9 |

Original unreliable R04 is excluded from accepted counts and all similarity/recurrence analytics.
R04R1 is the only R04 authority.

Expected:
AUTHORITY_QUERY_COUNT = 15
ROWS_PER_QUERY = 20
TOTAL_OCCURRENCES = 300
UNIQUE_QUERY_PAIRS = 15*14/2 = 105.

## 5. Input discovery contract

The complete accepted authority corpus must be resolved from the current branch under:

- docs/seo/serp/exports/**
- docs/seo/serp/analysis/**
- docs/seo/serp/raw/** only as needed for provenance/authority reconciliation.

For every authority query, Work must resolve exactly one accepted normalized/export authority with 20 ranks and its current accepted analysis/provenance.

If:
- an authority query has no resolvable accepted export;
- more than one candidate is ambiguous;
- rank accounting is not exactly 1..20;
- original R04 contaminates the accepted set;

then STATUS = HOLD and no competitor registry may be released.

Do not search the web to replace missing repository evidence.

## 6. Required hardened occurrence classification

Create one row per accepted occurrence before analytical dedupe.

Mandatory fields:

occurrence_id
authority_query_id
query_text
query_family
rank
rank_bucket
raw_url
normalized_url
host
registrable_domain
title
snippet_or_description
target_relevance
page_type
content_format
market_surface
entity_collision
classification_basis
classification_confidence
source_export_path
source_analysis_path
source_revision_or_hash
authority_status
notes

rank_bucket:
TOP3 | TOP10_REST | RANK_11_20

Allowed target_relevance:
TARGET_RELEVANT | PARTIAL_OR_ADJACENT | NON_TARGET | HOLD

page_type must be extensible. Use a stable type where a recurring real surface exists; do not force materially different recurring surfaces into a misleading OTHER bucket merely because the schema was too small.

market_surface must distinguish at least:
THIRD_PARTY_PRODUCT_VENDOR
NATIVE_MARKETPLACE
EDITORIAL_OR_PUBLISHER
SERVICE_OR_AGENCY
AGGREGATOR_OR_DIRECTORY
OTHER
HOLD

entity_collision:
NONE | PRESENT | UNCERTAIN

Raw/source fields remain immutable evidence. Analytical normalization does not delete occurrence rows.

## 7. Query analytical profiles

One row per authority query.

Mandatory fields include:
authority_query_id
query_text
query_family
top3_target_relevant_count
top10_target_relevant_count
rank11_20_target_relevant_count
top10_page_type_distribution
top10_market_surface_distribution
dominant_top10_page_type
dominant_top10_market_surface
accepted_intent_summary
intent_confidence
collision_or_uncertainty_count
profile_basis
source_limitations

Top3 is a strength amplifier.
Top10 is the primary competitor/intent layer.
11-20 is secondary discovery, not equal first-page strength.

## 8. Complete pairwise Top10 similarity

Create exactly 105 unique unordered query-pair rows.

Mandatory fields:

query_a_id
query_b_id
query_a_family
query_b_family
exact_url_overlap_top10
domain_overlap_top10
url_union_top10
domain_union_top10
url_jaccard_top10
domain_jaccard_top10
shared_urls_top10
shared_domains_top10
relationship_note

Hard boundaries:

- exact URL overlap and domain overlap remain separate;
- domain overlap is competitor-breadth evidence, not page-cluster proof;
- no universal threshold may auto-merge queries;
- no final cluster/page ownership decision in M4A.

## 9. Domain recurrence universe

Build the complete domain recurrence universe from all 300 accepted occurrences.

Mandatory fields:

domain_id
registrable_domain
entity_name_or_hold
all_occurrence_count
distinct_query_count
top3_query_coverage
top10_query_coverage
rank11_20_query_coverage
distinct_ranking_urls
target_relevant_occurrence_count
target_relevant_distinct_query_count
market_surface_distribution
collision_or_uncertainty_exposure
metric_granularity_notes
source_occurrence_ids

Every target-filtered metric must declare whether filtering is row-level or query-level.

Stale denominators after classification are forbidden.

## 10. Collision / uncertainty ledger

Every material collision/uncertainty occurrence or query-level ambiguity must remain visible.

Minimum fields:

collision_id
authority_query_id
occurrence_id_or_query_scope
rank_or_scope
url_or_domain
collision_type
observed_evidence
why_uncertain_or_colliding
classification_effect
downstream_handling

Do not remove collision-heavy evidence merely to make the competitor set cleaner.

## 11. Curated competitor registry

The registry is selected from the COMPLETE recurrence universe plus role/relevance evidence. It is not automatically every observed domain.

Mandatory fields:

registry_id
entity_name_or_hold
registrable_domain
candidate_class
inclusion_basis
all_query_coverage
top3_query_coverage
top10_query_coverage
rank11_20_query_coverage
target_relevant_query_coverage
distinct_ranking_urls
authority_query_ids
query_families
collision_or_uncertainty_exposure
metric_granularity_notes
m4b_priority
selection_rationale
source_occurrence_ids

Allowed candidate_class:

RECURRING_PRODUCT_VENDOR
RELEVANT_ONE_OFF_PRODUCT_VENDOR
NATIVE_MARKETPLACE_BASELINE
EDITORIAL_OR_PUBLISHER
SERVICE_OR_AGENCY
AGGREGATOR_DIRECTORY
OTHER_RELEVANT_CONTEXT
IRRELEVANT_NOISE
HOLD

RECURRING_PRODUCT_VENDOR normally requires recurrence across at least two distinct accepted queries. Edge cases require explicit evidence-based rationale.

Business-rival memory never admits a registry entry.

## 12. M4B anchor page manifest

Create exact ranking-URL anchors for the accepted registry.

Mandatory fields:

page_candidate_id
registry_id
entity_name
ranking_url
normalized_url
authority_query_ids
ranks
rank_buckets
query_families
candidate_class
why_anchor_for_m4b
collection_priority
expected_information_gain
native_baseline_flag
collision_dependency
hold_reason

This is only the starting anchor set for M4B. M4B later builds the bounded public URL frontier under its own full-coverage contract.

## 13. Required deliverables

Work returns exactly 11 final deliverables:

1. M4A_SOURCE_MANIFEST.md
2. M4A_SERP_OCCURRENCES_CLASSIFIED.tsv
3. M4A_QUERY_PROFILES.tsv
4. M4A_PAIRWISE_TOP10_SIMILARITY.tsv
5. M4A_DOMAIN_RECURRENCE.tsv
6. M4A_COLLISION_UNCERTAINTY_LEDGER.tsv
7. M4A_COMPETITOR_REGISTRY.tsv
8. M4A_PAGE_CANDIDATES.tsv
9. M4A_ANALYSIS.md
10. M4A_QA.md
11. M4A_RETURN_MANIFEST.json

## 14. Hard QA

PASS-candidate minimum:

LIVE_BRANCH_FETCHED = true
RELEASE_IDENTITY_VERIFIED = true
AUTHORITY_QUERY_COUNT = 15
PER_QUERY_ACCEPTED_ROWS = 20 each
TOTAL_OCCURRENCES = 300
RANKS_1_20_COMPLETE_EACH_QUERY = true
ORIGINAL_R04_ACCEPTED_ROWS = 0
R04R1_ACCEPTED_ROWS = 20
TOP3_TOP10_11_20_LAYERING = PASS
ALL_OCCURRENCES_CLASSIFIED = 300
SILENT_ROW_LOSS = 0
RAW_URL_LINEAGE_PRESERVED = true
PAIRWISE_ROWS = 105
PAIRWISE_UNORDERED_DUPLICATES = 0
EXACT_URL_AND_DOMAIN_OVERLAP_SEPARATE = true
COLLISION_UNCERTAINTY_PRESERVED = true
DOMAIN_RECURRENCE_COMPLETE = true
RECURRENCE_GRANULARITY_EXPLICIT = true
CURATED_REGISTRY_TRACEABLE = true
NO_PRESEEDED_BRAND_AUTHORITY = true
NATIVE_BASELINE_SEPARATED = true
M4B_PAGE_MANIFEST_EXISTS = true
FINAL_CLUSTER_DECISIONS = 0
FINAL_PAGE_OWNERSHIP_DECISIONS = 0
NEW_PROVIDER_CALLS = 0
EXTERNAL_VENDOR_BROWSING = 0
OPEN_CRITICAL_DEFECTS = 0

If accounting/authority fails:
STATUS = HOLD.

A quality score cannot override a hard failure.

## 15. Work trigger

WORK_TRIGGER = MET.

Reason:
the execution unit is the complete 300-row cross-file corpus plus complete 105-pair matrix, recurrence, collision and registry joins. The owner-locked rule forbids sampling/first-N/truncation to fit ordinary chat.

Main Chat has completed governance/research/release preparation.
Work must NOT redo:
- full Level1 reread;
- fresh external method research;
- owner-facing source disclosure;
- roadmap authorization;
- Main Chat failure-history review.

Work startup is limited to the release/input drift check frozen in the Work prompt.

## 16. Publication / handoff

Work does not self-accept and does not modify the repository.

Work creates ONE ZIP containing exactly the 11 final deliverables.

Owner performs one staging upload of all unpacked final files to:

docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R2/

Main Chat then:
- remote-readbacks all 11 files;
- independently checks counts, 105 pair rows, joins, recurrence, collisions, registry and manifests;
- accepts / reworks / holds;
- only after ACCEPT releases M4B.

## 17. Release state

M0_RETRO_CONSOLIDATION = PASS
M3_PRIMARY_ORGANIC = ACCEPTED
M3_STEP06_ANALYTICAL_HARDENING = CURRENT_M4A_OBJECTIVE
M3_FULL_SERP_DEVICE_REGION_TIME_CONTROL = DEFERRED_TO_M6
M4 = CURRENT
M4A_R2_PREPARED = true
M4A_R2_WORK_STARTED = false
M4A_R2_ACCEPTED = false
M4B_ALLOWED = false


## 18. R2 post-release integrity incident

The Work narrow preflight found that R06 cannot satisfy the frozen exact-authority input gate under its historical manifest.

Authority:
`../raw/R06_09_TRANSPORT_INTEGRITY_INCIDENT_2026-09-18.md`

Therefore:

```text
M4A_R2_WORK_START_ALLOWED = false
M4A_R2 = HOLD
R06_RECOVERY_REQUIRED = true
```

Do not resume this R2 prompt after repair. Main Chat must publish a fresh release revision referencing the accepted recovery authority.
