# Octoport SEO — M4A canonical ChatGPT Work prompt

Date: 2026-09-18
WORK_ID: OCTOPORT_SEO_M4A_REGISTRY_2026-09-18_W0
Status: READY FOR OWNER RELAY / NOT EXECUTED

CONTINUE THE EXISTING OCTOPORT SEO PROGRAM.

THIS IS NOT A NEW PROJECT.

ROADMAP STAGE:
M4 — SEARCH COMPETITOR + LANDING CORPUS

BOUNDED SUBSTEP:
M4A — FULL-VOLUME RECURRING COMPETITOR REGISTRY FROM ACCEPTED M3

QUALITY > COST > SPEED.

## FIRST ACTION — BASE FRESHNESS

Fetch the current remote branch:
seo/wordstat-batch-01-2026-09-16

Record its live HEAD.

Read in full before analysis:
- docs/seo/EXECUTION_RULES.md
- docs/seo/QUALITY_FIRST_RESOURCE_RULE.md
- docs/seo/WORK_HANDOFF_RULE.md
- docs/seo/STAGE_GATES_M0_M7.md
- docs/seo/PRODUCT_TRUTH.md
- docs/seo/SEO_MASTER_ROADMAP_2026-09-16.md
- docs/seo/serp/competitors/M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18.md
- docs/seo/serp/competitors/M4_PROGRESS.md
- docs/seo/serp/M3_QUERY_MATRIX_2026-09-16.md
- docs/seo/serp/SERP_PROGRESS.md
- docs/seo/serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md

If these authorities are missing, contradictory, or superseded at the live HEAD, STOP/HOLD and report the exact authority problem.

## TASK IDENTITY

Build the complete M4A search-competitor registry from the accepted M3 organic corpus.

Do NOT start from a business-rival list.
Do NOT use remembered brands.
Do NOT browse vendor pages yet.

Accepted authority:
S01-S03 + R01-R12, with R04R1 replacing the unreliable original R04.

Expected:
15 authority queries × 20 accepted organic rows = 300 occurrence rows.

The original R04 must contribute zero accepted rows.

## COMPLETE INPUT SET

Read the complete accepted-authority evidence under:
- docs/seo/serp/exports/**
- docs/seo/serp/analysis/**
- docs/seo/serp/raw/** only as needed for provenance and authority reconciliation.

Use PRODUCT_TRUTH only to classify overlap/relevance boundaries. Do not turn product facts into search recurrence.

## NON-NEGOTIABLE RULES

- COMPLETE corpus, no sampling.
- No first-N.
- No truncation.
- Preserve every accepted occurrence before analytical deduplication.
- Preserve exact query/rank/raw-URL/source lineage.
- No external web/vendor browsing in M4A.
- No Search calls.
- No Wordstat calls.
- No Alice calls.
- No other provider calls.
- No new brands added from memory or external knowledge.
- Ambiguous entity identity = HOLD.
- Search competitor != business rival.
- One appearance != recurring competitor.
- Recurrence != final page ownership.
- Native Ozon/Wildberries/Yandex marketplace surfaces are a separate native baseline class.
- Editorial/publisher, agency/service, aggregator and noise classes remain distinct.
- Competitor content is evidence, not copy source.
- No final URL/H1/Title/IA/page ownership decisions.

## REQUIRED DELIVERABLES

Produce exactly:
1. M4A_SOURCE_MANIFEST.md
2. M4A_SERP_OCCURRENCES.tsv
3. M4A_COMPETITOR_REGISTRY.tsv
4. M4A_PAGE_CANDIDATES.tsv
5. M4A_REGISTRY_ANALYSIS.md
6. M4A_QA.md
7. M4A_RETURN_MANIFEST.json

## OCCURRENCE LEDGER

M4A_SERP_OCCURRENCES.tsv must have one row per accepted occurrence before analytical deduplication.

Mandatory fields:
authority_query_id
query_text
query_family
rank
raw_url
normalized_url
host
registrable_domain where determinable
title
snippet_or_description if present
source_export_path
source_analysis_path if applicable
source_revision_hash_identity if available
authority_status
notes

Expected total = 300.

Duplicates across queries remain separate occurrence rows.

## REGISTRY

M4A_COMPETITOR_REGISTRY.tsv mandatory fields:
registry_id
entity_name or HOLD
registrable_domain
entity_type
occurrence_count
distinct_query_count
distinct_query_family_count
authority_query_ids
best_rank
median_rank
distinct_ranking_urls
marketplace_scope_observed
observed_page_types
candidate_class
m4b_priority
selection_rationale
source_occurrence_ids

candidate_class must be one of:
RECURRING_PRODUCT_VENDOR
RELEVANT_ONE_OFF_PRODUCT_VENDOR
NATIVE_MARKETPLACE_BASELINE
EDITORIAL_OR_PUBLISHER
SERVICE_OR_AGENCY
AGGREGATOR_DIRECTORY
OTHER_RELEVANT_CONTEXT
IRRELEVANT_NOISE
HOLD

Normally RECURRING_PRODUCT_VENDOR requires recurrence across at least two distinct accepted queries. If an edge case needs different treatment, document it explicitly rather than silently bending the rule.

A one-off may enter M4B only as RELEVANT_ONE_OFF_PRODUCT_VENDOR with explicit material-information rationale.

## M4B PAGE-CANDIDATE MANIFEST

M4A_PAGE_CANDIDATES.tsv mandatory fields:
page_candidate_id
registry_id
entity_name
ranking_url
normalized_url
authority_query_ids
ranks
query_families
candidate_class
why_collect_in_M4B
collection_priority
expected_information_gain
native_baseline_flag
hold_reason

Selection:
- include material recurring product/vendor pages;
- include materially distinct direct product/vendor one-offs only with written rationale;
- keep native marketplace pages separate;
- include editorial/publisher pages only when they materially represent recurring search-language/content-architecture evidence needed downstream;
- do not inflate the corpus just to include every organic result.

## SOURCE MANIFEST

M4A_SOURCE_MANIFEST.md must record:
- Work live start HEAD;
- every input file actually read;
- reconciliation of all 15 authority query identities;
- explicit exclusion of original R04;
- any missing or superseded authority.

## ANALYSIS

M4A_REGISTRY_ANALYSIS.md must explain:
- recurring domains/entities;
- query families each covers;
- third-party vs native vs editorial/service distinctions;
- material one-offs;
- ambiguity/HOLDs;
- why proposed M4B manifest is sufficient to start current landing acquisition;
- what remains unknown;
- explicit statement that final page architecture is not decided.

## QA

M4A_QA.md must prove:
AUTHORITY_QUERY_COUNT = 15
PER_QUERY_ACCEPTED_ROWS = 20 each
TOTAL_AUTHORITY_OCCURRENCES = 300
ORIGINAL_R04_ACCEPTED_ROWS = 0
R04R1_ACCEPTED_ROWS = 20
SILENT_ROW_LOSS = 0
RAW_URL_LINEAGE_PRESERVED = true
ALL_REGISTRY_ENTRIES_TRACEABLE = true
NO_PRESEEDED_BRAND_AUTHORITY = true
NATIVE_BASELINE_SEPARATED = true
M4B_PAGE_MANIFEST_EXISTS = true
FINAL_PAGE_OWNERSHIP_DECISIONS = 0
NEW_PROVIDER_CALLS = 0

If accounting fails, STOP with HOLD.
Do not guess.
Do not browse for replacements.
Do not silently omit rows.

## RETURN MANIFEST

M4A_RETURN_MANIFEST.json must contain:
- all output filenames;
- byte sizes;
- SHA-256 hashes;
- row counts;
- Work start HEAD;
- final status READY_FOR_MAIN_CHAT_QA or HOLD.

## BASE DRIFT BEFORE DELIVERY

Before final packaging, recheck remote branch HEAD.

If the branch advanced:
- classify changed paths;
- determine whether rules, product truth or M3 authority changed;
- if governing authority changed, revalidate or rerun affected outputs;
- never overwrite newer authority with stale assumptions.

## PUBLICATION POLICY

Do NOT publish to GitHub from Work.

Create ONE ZIP containing only the seven final deliverables.

Give the owner one real downloadable ZIP artifact/link.

Owner will extract the ZIP and upload all seven unpacked files together to:
docs/seo/serp/competitors/work_return/M4A_REGISTRY_2026-09-18/

Do not self-accept the step.
Main Chat performs remote readback and independent return QA.
