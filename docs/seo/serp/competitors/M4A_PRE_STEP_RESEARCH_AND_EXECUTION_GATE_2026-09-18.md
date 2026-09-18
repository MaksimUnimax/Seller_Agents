# Octoport SEO — M4A pre-step research and execution gate

Date: 2026-09-18
Status: SUPERSEDED / NOT EXECUTABLE / REPREPARATION REQUIRED
Stage: M4 — Search competitor + landing corpus
Substep: M4A — full-volume recurring competitor registry from accepted M3
Preparation base HEAD: 0da33edf5abe7aff519ade0880920d5d2c2ebf93

## 0. Two-level authority supersession

This preparation was authored before explicit LEVEL 1 / LEVEL 2 authority was restored in Octoport. It is history only and MUST NOT be executed.

A new M4A preparation must be authored from live HEAD after reading docs/seo/LEVEL1/README.md and docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md, recording the read gate, persisting it, and remote-readback.

## 1. Goal-first restoration

Whole SEO goal:
product truth -> demand -> ordinary Yandex Search -> search competitors/current landing pages -> Alice -> gap closure -> M7 Collection Freeze -> semantic master -> clustering -> page ownership -> page specs -> technical SEO -> implementation -> live QA -> measurement.

Current state:
- M0 PASS.
- M1 partial/open.
- M2/M2R accepted.
- M3 primary organic acquisition closed.
- M3 control debt remains open until M6.
- M4 is current.
- M5 not started.
- M7 blocked.

M4A problem:
M3 produced accepted ranking occurrences, but a search-competitor registry has not yet been derived from the complete corpus. Starting from remembered brands or a business-rival shortlist would violate SEARCH COMPETITOR != BUSINESS RIVAL and create selection bias.

M4A exact output:
complete accepted M3 occurrence ledger -> normalized URL/domain recurrence -> search-competitor/native/editorial/noise classification -> proposed exact M4B page-candidate manifest.

M4A does NOT crawl competitor sites yet and does NOT decide final pages, URLs, H1, Title or IA.

## 2. Current repository authorities restored

Read before preparation:
- docs/seo/EXECUTION_RULES.md
- docs/seo/QUALITY_FIRST_RESOURCE_RULE.md
- docs/seo/WORK_HANDOFF_RULE.md
- docs/seo/STAGE_GATES_M0_M7.md
- docs/seo/PRODUCT_TRUTH.md
- docs/seo/SEO_MASTER_ROADMAP_2026-09-16.md
- docs/seo/serp/M3_QUERY_MATRIX_2026-09-16.md
- docs/seo/serp/SERP_PROGRESS.md
- docs/seo/serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md

Key current blob identities checked before preparation:
- EXECUTION_RULES.md: b2ec30d2cc66817e7fc43cb23848450ca956d6b8
- WORK_HANDOFF_RULE.md: 71a031e74b921dade5998beb842fb3afcc4478e7
- STAGE_GATES_M0_M7.md: a4d59451f98ae6ee9ea64b0b39291b56910d4592
- PRODUCT_TRUTH.md: 6a469d5743142d3e476afa5d2cda653fd411ecb8
- M3_QUERY_MATRIX: 16c3c22019d514402f164e0505be48d608acf156
- SERP_PROGRESS: 721fd650575a6765564f14bf165f9c675b8270ac
- M3 retrospective: 60a1b6de5c660733a0d2ea4d25d7fc56d84c5b99

Hard process:
~~~text
CHAT != STORAGE
FULL INPUT -> FULL ANALYSIS
QUALITY-RISK LARGE/CROSS-FILE TASK -> WORK
WORK OUTPUT != ACCEPTED AUTHORITY
RETURN -> GITHUB STAGING -> REMOTE READBACK -> MAIN CHAT QA -> ACCEPT | REWORK | HOLD
~~~

## 3. Fresh external method research — checked 2026-09-18

### M4-METHOD-01 — Yandex Webmaster market analysis
Official:
https://yandex.ru/support/webmaster/en/service/queries-selection

Supports:
- query clusters are based on similarity in meaning/user intent;
- market analysis exposes popular sites and popular pages for selected queries;
- site/page popularity and rankings there are averaged over the prior month;
- region and device can be selected.

Project application:
- competitor discovery must be query/page evidence-driven;
- current live M3 SERP lineage remains separate snapshot authority;
- monthly Webmaster market data must not silently replace live M3 rank/query/URL lineage;
- M4 keeps exact query/rank/URL provenance.

### M4-METHOD-02 — Yandex Search quality / Proxima
Official:
https://yandex.ru/support/webmaster/ru/search-quality

Supports:
- relevance to the query;
- likelihood of solving the user task;
- quality, usefulness and originality;
- useful vs intrusive balance;
- credibility/authority signals where material.

Project application:
M4B later must extract not just keywords but the user task solved, proof/trust, useful product evidence and how a page substantiates its promise.

### M4-METHOD-03 — Yandex EPOS
Official:
https://yandex.ru/support/webmaster/ru/epos

Current quality framing:
- expertise;
- usefulness;
- originality;
- meaningful completeness/content density.

Project application:
future competitor-page extraction records expertise/proof, useful task coverage, differentiated value and topic completeness. These are observations, not permission to copy text.

### M4-METHOD-04 — Yandex low-value content
Official:
https://yandex.ru/support/webmaster/ru/threat/useless-content

Current guidance treats copied/rewritten/automatically generated low-value content without added value as problematic.

Project rule:
COMPETITOR CONTENT = EVIDENCE, NOT COPY SOURCE.

### M4-METHOD-05 — secondary industry corroboration
Ahrefs page-level competitive analysis:
https://ahrefs.com/blog/keyword-competitive-analysis/

Supported workflow idea:
competing pages, not just domains, can reveal expected subtopics and coverage gaps.

Boundary:
this is secondary workflow corroboration only. It does not authorize a competitor or replace Yandex/Octoport evidence.

## 4. Source -> method -> execution trace

Method element: search competitor discovery.
Source: Yandex market analysis + project Gate 6C.
Supported claim: useful market analysis examines popular sites/pages for relevant queries.
Application: derive registry from complete accepted M3 occurrences.
Executable action: full occurrence ledger and recurrence registry.
Failure policy: if authority rows do not reconcile, HOLD.
Claim boundary: recurrence does not equal business rivalry or final page ownership.

Method element: page-level analysis.
Source: Yandex quality/EPOS + secondary Ahrefs page-level workflow.
Supported claim: useful pages solve user tasks and coverage/proof matters.
Application: M4B later collects exact landing URLs and page-level task/proof/content fields.
Executable action now: produce exact page-candidate manifest.
Failure policy: ambiguous identity -> HOLD.
Claim boundary: competitor wording is not copy authority.

## 5. Accepted M3 authority universe

Exactly 15 authority queries:
- S01: ии агенты для маркетплейсов
- S02: ии агент для озон
- S03: ии агент для wildberries
- R01: подключить chatgpt к маркетплейсу
- R02: chatgpt для ozon
- R03: chatgpt для wildberries
- R04R1: аналитика маркетплейсов для селлеров
- R05: отчеты для селлеров маркетплейсов
- R06: помощник селлера маркетплейсов
- R07: как заполнить карточку товара wildberries
- R08: аналитика рекламы маркетплейсов
- R09: поисковые запросы wildberries для продавца
- R10: анализ ниш wildberries для продавца
- R11: как работать в кабинете wildberries продавцу
- R12: какой ии выбрать для маркетплейсов

Expected accounting:
~~~text
AUTHORITY_QUERIES = 15
ROWS_PER_QUERY = 20
EXPECTED_OCCURRENCES = 300
ORIGINAL_R04_AUTHORITY = false
R04R1_AUTHORITY = true
~~~

If this cannot be reconciled from repository evidence: STOP/HOLD. Do not repair with web search or assumptions.

## 6. Work trigger

WORK_TRIGGER = MET.

Reason:
- 15 accepted query files × 20 rows = 300 occurrence rows;
- M4A requires cross-file URL/domain normalization, recurrence, query-family coverage and lineage;
- manual first-N or remembered-brand analysis creates omission/selection-bias risk;
- project Work rules explicitly prefer full-volume treatment when cross-file competitor analysis improves auditability.

No provider/web acquisition is required in M4A. Work processes already durable evidence.

## 7. Hard boundaries

Forbidden in M4A:
- remembered/preselected competitor list as input authority;
- current vendor/competitor web browsing;
- Search/Wordstat/Alice/provider calls;
- adding brands absent from accepted M3 evidence;
- final URL/H1/Title/page-ownership/IA decisions;
- copying competitor wording;
- silently dropping duplicate occurrences;
- treating Ozon/Wildberries/Yandex native surfaces automatically as third-party competitors.

Any prior chat shortlist, including named brands previously mentioned in chat, is hypothesis only. If a brand appears in M4A it must be because accepted M3 evidence supports it.

## 8. M4A required outputs

Work must return:
- M4A_SOURCE_MANIFEST.md
- M4A_SERP_OCCURRENCES.tsv
- M4A_COMPETITOR_REGISTRY.tsv
- M4A_PAGE_CANDIDATES.tsv
- M4A_REGISTRY_ANALYSIS.md
- M4A_QA.md
- M4A_RETURN_MANIFEST.json

Occurrence ledger: one row per accepted SERP occurrence before analytical deduplication.

Minimum occurrence fields:
authority_query_id, query_text, query_family, rank, raw_url, normalized_url, host, registrable_domain, title, snippet_or_description if available, source_export_path, source_analysis_path if applicable, source revision/hash identity if available, authority_status, notes.

Registry minimum fields:
registry_id, entity_name/HOLD, registrable_domain, entity_type, occurrence_count, distinct_query_count, distinct_query_family_count, authority_query_ids, best_rank, median_rank, distinct_ranking_urls, marketplace_scope_observed, observed_page_types, candidate_class, m4b_priority, selection_rationale, source_occurrence_ids.

Allowed candidate classes:
- RECURRING_PRODUCT_VENDOR
- RELEVANT_ONE_OFF_PRODUCT_VENDOR
- NATIVE_MARKETPLACE_BASELINE
- EDITORIAL_OR_PUBLISHER
- SERVICE_OR_AGENCY
- AGGREGATOR_DIRECTORY
- OTHER_RELEVANT_CONTEXT
- IRRELEVANT_NOISE
- HOLD

M4B page candidate minimum fields:
page_candidate_id, registry_id, entity_name, ranking_url, normalized_url, authority_query_ids, ranks, query_families, candidate_class, why_collect_in_M4B, collection_priority, expected_information_gain, native_baseline_flag, hold_reason.

## 9. Hard QA

PASS-candidate minimum:
~~~text
LIVE_BRANCH_FETCHED = true
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
~~~

Work does not self-accept. Main Chat performs return QA.

## 10. Release state

M4A_PREPARED = false
M4A_WORK_STARTED = false
M4A_ACCEPTED = false
M4B_ALLOWED = false

Next physical action:
Main Chat re-prepares M4A from live HEAD under explicit LEVEL 1 + M4 LEVEL 2. Owner must NOT relay the superseded prompt.
