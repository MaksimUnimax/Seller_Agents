# M4A R3 — canonical ChatGPT Work execution prompt

WORK_ID: OCTOPORT_SEO_M4A_HARDENED_2026-09-18_R3

CONTINUE THE EXISTING OCTOPORT SEO PROGRAM.

THIS IS AN EXECUTION TASK, NOT A NEW PROJECT AND NOT A METHODOLOGY DESIGN TASK.

Execute the released M4A contract from the current branch:
seo/wordstat-batch-01-2026-09-16

## Startup preflight — narrow only

1. Fetch the live remote branch and record the live HEAD.
2. Verify these release files exist:
   - docs/seo/serp/competitors/M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18_R3.md
   - docs/seo/serp/competitors/M4A_EXECUTION_RELEASE_2026-09-18_R3.md
   - docs/seo/serp/competitors/M4A_WORK_PROMPT_2026-09-18_R3.md
3. Verify the frozen authority is still:
   S01,S02,S03,R01,R02,R03,R04R1,R05,R06,R07,R08,R09,R10,R11,R12;
   20 accepted organic rows each;
   300 total accepted occurrences;
   original R04 excluded.
4. Resolve exactly one accepted export/normalized authority and current analysis/provenance for each query from docs/seo/serp/exports/** and docs/seo/serp/analysis/**, using raw only when needed for provenance.
5. For R06 specifically, DO NOT use the superseded historical R06_08 export manifest as current authority. Reconstruct only from:
   - docs/seo/serp/raw/recovery/R06_2026-09-18/R06_10_RECOVERED_EXPORT_MANIFEST_2026-09-18.md
   - its seven recovery chunks
   - docs/seo/serp/raw/recovery/R06_2026-09-18/R06_11_RECOVERY_QA_2026-09-18.md

   Verify standard gzip validation and exactly:
   - source bytes = 73385
   - source SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
   - gzip SHA256 = f764c509f47f0a53a33b90a7c3dc5c8f61d62137da1b339360acb9c844a1b608
   - job/revision/operation = octoport-serp-r06-20260917 / 5 / sprdv3pu6m66t214aidj
   - result_count = 20, ranks 1..20.

   If any R06 recovery check fails, HOLD. Do not repair authority inside Work.
6. If governing M3/M4 authority or any other accepted M3 evidence materially drifted, or authority resolution is ambiguous/missing, STOP and return HOLD/AUTHORITY_DRIFT.
7. Otherwise execute.

Do NOT redo Main Chat Level1/Level2 governance.
Do NOT redo external methodology research.
Do NOT decide whether M4A should exist.
Do NOT produce an owner-facing roadmap report.
The execution contract is already frozen.

## Complete execution unit

Process the COMPLETE accepted M3 corpus.

NO sampling.
NO first-N.
NO truncation.
NO remembered/preselected competitor list.
NO web browsing.
NO provider calls.

Expected:
15 queries
20 rows/query
300 occurrence rows
105 unique unordered query pairs.

## Required analysis

### A. Complete occurrence classification

Materialize one row for every accepted occurrence before dedupe with all mandatory fields/enums from the R3 gate.

Preserve raw query/rank/URL/source lineage.

Rank layers:
TOP3
TOP10_REST
RANK_11_20

### B. Query profiles

Create one profile per query.

Top3 = strength amplifier.
Top10 = primary analytical layer.
11-20 = secondary discovery.

Preserve intent/collision uncertainty.

### C. Pairwise Top10 matrix

Create all 105 unordered pairs.

For every pair calculate separately:
exact URL overlap,
domain overlap,
URL/domain unions,
URL/domain Jaccard,
shared URLs/domains.

Do not auto-cluster and do not use a universal threshold.

### D. Complete domain recurrence universe

Build recurrence from all 300 rows.

Keep metric granularity explicit:
all-depth / Top3 / Top10 / 11-20;
row-level vs query-level;
target-filtered vs unfiltered.

Do not keep stale denominators after classification.

### E. Collision/uncertainty ledger

Preserve ambiguous/collision-heavy evidence.
Do not delete it to make the registry cleaner.

### F. Curated competitor registry

Select a material registry from the COMPLETE recurrence universe plus role/relevance evidence.

SEARCH COMPETITOR != BUSINESS RIVAL.

Native marketplace surfaces are separate baseline class.

A prior chat list of brands is NOT authority.

### G. M4B anchor pages

Create exact ranking-URL anchors for the accepted registry.
These are starting anchors only; M4B later performs bounded public-surface expansion.

## Hard boundaries

No external competitor-page browsing.
No Search.
No Wordstat.
No Alice/GenSearch.
No final semantic clusters.
No page ownership.
No URL/H1/Title/IA.
No competitor topic treated as proven demand.
No source/product claim invented from Search snippets.

## Exactly 11 final deliverables

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

Use the exact field requirements and enums in the R3 gate.

## Required QA

Prove at minimum:

AUTHORITY_QUERY_COUNT = 15
PER_QUERY_ACCEPTED_ROWS = 20 each
TOTAL_OCCURRENCES = 300
RANKS_1_20_COMPLETE_EACH_QUERY = true
ORIGINAL_R04_ACCEPTED_ROWS = 0
R04R1_ACCEPTED_ROWS = 20
ALL_OCCURRENCES_CLASSIFIED = 300
SILENT_ROW_LOSS = 0
PAIRWISE_ROWS = 105
PAIRWISE_UNORDERED_DUPLICATES = 0
EXACT_URL_AND_DOMAIN_OVERLAP_SEPARATE = true
COLLISION_UNCERTAINTY_PRESERVED = true
DOMAIN_RECURRENCE_COMPLETE = true
RECURRENCE_GRANULARITY_EXPLICIT = true
CURATED_REGISTRY_TRACEABLE = true
NO_PRESEEDED_BRAND_AUTHORITY = true
NATIVE_BASELINE_SEPARATED = true
FINAL_CLUSTER_DECISIONS = 0
FINAL_PAGE_OWNERSHIP_DECISIONS = 0
NEW_PROVIDER_CALLS = 0
EXTERNAL_VENDOR_BROWSING = 0
R06_DERIVED_RECOVERY_AUTHORITY = VERIFIED
R06_HISTORICAL_MANIFEST_USED_AS_CURRENT = false
OPEN_CRITICAL_DEFECTS = 0

If a mandatory accounting/authority condition fails:
STATUS = HOLD.
Do not guess or repair with web search.

## Return package

Create ONE ZIP containing exactly the 11 final deliverables and no extras.

Provide the owner one downloadable ZIP.

Do NOT publish to GitHub.

The owner will extract and upload all 11 files together in one action to:
docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R3/

Do not self-accept M4A.
Main Chat performs independent return QA.
