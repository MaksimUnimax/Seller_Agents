# Octoport SEO — M2R full-volume reconciliation pre-handoff manifest

Date: 2026-09-17.
Status: **FROZEN / READY FOR WORK HANDOFF**.

## 1. WORK_ID

`OCTOPORT_SEO_M2R_RECON_2026-09-17_W0`

This is an **early reconciliation Work pass before resuming M3 Search**. It is **not** M7 Collection Freeze, **not** M8 Semantic Master, **not** clustering, and **not** page architecture.

## 2. ROADMAP_STAGE

`M2R POST-CORRECTION RECONCILIATION -> M3 REBASELINE INPUT`

Current roadmap state:

- M0 product truth/governance: PASS;
- M1: open / source baseline partial pass;
- historical M2 B01+B02: retained with accepted persistence limitation;
- M2R A01-A19: targeted correction acquisition complete enough for reconciliation;
- M3 Search: S01-S03 retained valid; old S04+ release order paused pending corrected-family rebaseline;
- M4/M5 not complete;
- M7 Collection Freeze remains BLOCKED;
- M8+ remain BLOCKED.

## 3. WHY WORK REQUIRED

Triggered under `WORK_HANDOFF_RULE.md` and `QUALITY_FIRST_RESOURCE_RULE.md` by expected quality gain, not by a hard row threshold.

The corpus now combines:

- 30 historical Wordstat calls (B01+B02);
- historical direct/association/seed accounting;
- M2R A01-A19 correction passes;
- multiple `totalCount-only`, non-expansive and full-row result shapes;
- source/capability boundaries for Ozon/Wildberries;
- contamination classes that must remain explicit;
- retained M3 S01-S03 SERP evidence and the rebaselined F1-F10 matrix.

A full-volume independent pass is preferred over ordinary-chat incremental synthesis because exact deduplication, lineage, family coverage and adversarial boundary QA should be checked together without sampling, first-N truncation or silent row loss.

## 4. CURRENT REMOTE BRANCH / HEAD

Repository: `MaksimUnimax/runtime-fixtures`

Branch: `seo/wordstat-batch-01-2026-09-16`

Frozen live HEAD at manifest creation:

`5dc772191d264be30f3858bfe2dffe0059cb5af8`

Commit message:

`Analyze M2R A19 and close targeted Wordstat correction acquisition`

Work MUST fetch the current remote branch before execution and record the actual live HEAD. If it differs from the frozen SHA, Work must inspect changed `docs/seo/**` paths and revalidate all governing inputs before continuing.

## 5. AUTHORITATIVE GOVERNING INPUTS

Mandatory read-in-full authorities:

- `docs/seo/PRODUCT_TRUTH.md`
- `docs/seo/QUALITY_FIRST_RESOURCE_RULE.md`
- `docs/seo/WORK_HANDOFF_RULE.md`
- `docs/seo/SEO_MASTER_ROADMAP_2026-09-16.md`
- `docs/seo/research/PRODUCT_AUDIENCE_API_AND_KNOWLEDGE_BOUNDARIES_2026-09-16.md`
- `docs/seo/wordstat/M2_WORDSTAT_RETRO_GATE_AUDIT_2026-09-16.md`
- `docs/seo/wordstat/M2_WORDSTAT_VOLUME_ACCOUNTING_2026-09-16.md`
- `docs/seo/wordstat/BATCH_01_SYNTHESIS_2026-09-16.md`
- `docs/seo/wordstat/BATCH_02_SYNTHESIS_2026-09-16.md`
- `docs/seo/wordstat/M2R_TASK_FAMILY_COVERAGE_AUDIT_2026-09-16.md`
- `docs/seo/serp/M3_QUERY_MATRIX_2026-09-16.md`
- current `docs/seo/serp/SERP_PROGRESS.md` if present.

Product truth precedence is absolute: **Octoport is not the AI employee and not a proprietary LLM. It is the browser bridge/control layer that turns the user's chosen supported AI into a marketplace employee/helper by giving that same AI governed access to supported Ozon/Wildberries data/tools.**

## 6. ALLOWED INPUT FILES / SOURCES

Work may read, in full, current files on the branch under these scopes:

### Wordstat evidence

- `docs/seo/wordstat/raw/B01_*.md`
- `docs/seo/wordstat/raw/B02_*.md`
- all `docs/seo/wordstat/raw/M2R_A01_*` through `M2R_A19_*`
- all `docs/seo/wordstat/analysis/M2R_A01_*` through `M2R_A19_*`
- all M2R query-specific pre-step/release files under `docs/seo/wordstat/` for A01-A19;
- historical Wordstat syntheses/accounting/audits listed above.

### Current SERP evidence for rebaseline only

- `docs/seo/serp/**` current evidence needed to understand S01-S03, current query matrix, progress and already accepted Search observations.

Work may use retained S01-S03 to avoid recommending redundant Search queries and to preserve already-proven AI-agent/Ozon/WB intent. Work must NOT treat incomplete M3 material as a finished competitor corpus.

### Product/source-boundary evidence

- `docs/seo/research/**` only where directly relevant to current product/API/knowledge/source boundaries;
- `docs/seo/technical/CURRENT_SITE_BASELINE_2026-09-16.md` only if needed to avoid suggesting current page claims that conflict with known source baseline.

## 7. PROHIBITED INPUTS / ACTIONS

Work must NOT:

- run new Wordstat/Search/Alice/provider calls;
- browse external web as a substitute for the frozen evidence corpus;
- use unlisted external competitor datasets to alter current family verdicts;
- modify product truth or create a new permanent SEO methodology;
- treat counts from overlapping Wordstat roots as additive market size;
- treat `associations[]` as equivalent to direct candidate keywords;
- convert `totalCount-only` responses into zero/empty;
- silently drop rows because they are noisy;
- force ambiguity into KEEP/EXCLUDE when HOLD is required;
- create final page architecture, page counts, URL map, final clusters or semantic master;
- change `M7 COLLECTION FREEZE = BLOCKED`;
- modify any path outside `docs/seo/**`;
- modify production/site/server/extension code;
- commit, push, force-push, open PR, publish to GitHub, or modify the remote branch.

## 8. EXACT EXECUTION GOAL

Perform a **full-volume independent reconciliation of historical M2 + corrected M2R evidence** so Main Chat can safely resume M3 Search using an evidence-backed representative query matrix.

The pass must answer:

1. What exact phrase/evidence universe exists after B01+B02+A01-A19?
2. What is observed vs inferred vs source-derived?
3. Which F1-F10 task families are now STRONG / SUFFICIENT-FOR-SERP / PARTIAL / WEAK / HOLD?
4. Which contamination classes are present and how are they prevented from inflating Octoport demand?
5. Which product/API/source boundaries constrain each family?
6. Which exact representative Yandex Search queries should be executed next in M3, preserving S01-S03 and avoiding redundant Wordstat-style synonym chasing?
7. Are any material Wordstat gaps still open that truly require new acquisition before Search? If yes, identify them as gaps only; do not execute calls.

## 9. REQUIRED OUTPUT FILES

Work must produce all of the following as final task artifacts:

1. `M2R_FULL_VOLUME_RECONCILIATION_2026-09-17.md`
2. `M2R_PHRASE_LINEAGE_LEDGER_2026-09-17.csv`
3. `M2R_FAMILY_COVERAGE_MATRIX_2026-09-17.csv`
4. `M3_REVISED_REPRESENTATIVE_QUERY_MATRIX_2026-09-17.md`
5. `M2R_RECONCILIATION_QA_2026-09-17.md`
6. `M2R_RECONCILIATION_OUTPUT_MANIFEST_2026-09-17.json`

Package those six files into exactly one ZIP:

`octoport-seo-m2r-reconciliation-2026-09-17.zip`

Do not include temporary files, caches, raw repository copies or unrelated files in the ZIP.

## 10. MANDATORY PHRASE-LEDGER FIELDS

`M2R_PHRASE_LINEAGE_LEDGER_2026-09-17.csv` must contain at least:

- `raw_phrase`
- `normalized_phrase_conservative`
- `source_stage`
- `source_query_id`
- `source_file`
- `evidence_type` (`DIRECT_RESULT`, `ASSOCIATION`, `TESTED_SEED`, `TOTALCOUNT_ONLY_SEED`, `EMPTY_SUCCESS_SEED` as applicable)
- `observed_count`
- `seed_total_count`
- `region`
- `device`
- `marketplace_scope`
- `task_family_primary` (`F1`..`F10` or `HOLD`)
- `task_family_secondary`
- `intent_class`
- `fit_class` (`CORE_FIT`, `ADJACENT`, `BOUNDARY`, `NOISE`, `HOLD`)
- `contamination_flags`
- `capability_state` (`CONFIRMED_ADDRESSABLE`, `TASK_CONFIRMED_ACCESS_UNPROVEN`, `NOT_CURRENT_SCOPE`, `UNKNOWN`, etc.)
- `observed_vs_inferred`
- `lineage_notes`
- `reconciliation_reason`

Conservative normalization only. Do not merge strings merely because they look lexically similar if intent/marketplace/source differs.

## 11. F1-F10 FAMILY MODEL

Preserve current family meanings:

- F1 Existing AI-agent/assistant category;
- F2 user's own AI/LLM connection to marketplace data/tools;
- F3 seller-cabinet analytics/reports;
- F4 daily seller work/help;
- F5 operational product-card help;
- F6 advertising analysis/help;
- F7 marketplace/search/niche analytics, source-bounded;
- F8 procedural knowledge/help about cabinet mechanics;
- F9 comparison/discovery of AI/tools;
- F10 broad-noise controls.

Work may recommend revised family coverage states but must not silently redefine the families.

## 12. REQUIRED CONTAMINATION / ADVERSARIAL QA

Explicitly test and report at minimum:

- human assistant / vacancy / hiring contamination;
- human analyst/profession contamination;
- accounting / tax / 1C / statutory-reporting contamination;
- buyer login/order/search/navigation contamination;
- AI image / photo / infographic / creative-card generator contamination;
- real-time bidder / autobidder / continuous bid-management contamination;
- generic `market` / entity / brand navigation noise;
- course / training / educational noise;
- service-brand navigation vs genuine task demand;
- marketplace-specific vs generic-intent leakage;
- Ozon capability inferred incorrectly from WB evidence or vice versa;
- help-center knowledge incorrectly described as coming through Seller API;
- launch read-only/analysis scope incorrectly widened into mutation/editing.

## 13. CLAIM / CAPABILITY BOUNDARIES

Hard constraints:

- WB `Поисковые запросы` public-API availability is confirmed in current official evidence;
- WB `Анализ ниш` current native seller task/report is confirmed, but full public-API availability must NOT be inferred from the search-query API statement;
- Ozon search-query analytics API capability is confirmed by accepted project evidence;
- Ozon full external market/niche coverage is NOT proven;
- WB/Ozon official help-center knowledge is a separate source from seller operational APIs unless a dedicated knowledge API is proven;
- launch scope is read-only/analysis/explanation/preparation, not autonomous write-back/editing/bidding;
- bidder/autobidder demand is boundary evidence, not Octoport core;
- stand-alone card image/infographic generation is not Octoport core;
- Octoport is not `our AI` and not itself the AI employee.

## 14. COUNTING / LINEAGE RULES

Work must preserve:

- direct result count vs seed `totalCount` distinction;
- `totalCount` values are not additive across overlapping roots;
- associations remain evidence but do not inflate direct semantic candidate counts;
- successful `{}` historical results are not zero demand;
- successful totalCount-only results are not empty/zero;
- B01 historical wrapper limitation remains explicit;
- raw occurrence counts, exact unique strings, conservative normalized strings and classification states must be reported separately.

Silent row loss must equal zero.

## 15. REQUIRED M3 REVISED MATRIX LOGIC

The revised representative Search matrix must:

- preserve S01 `ии агенты для маркетплейсов`, S02 `ии агент для озон`, S03 `ии агент для wildberries` as already executed/valid;
- select the minimum representative new Search queries needed to resolve current intent/page-type/competitor ambiguities across corrected families;
- prefer queries with distinct decision value, not many lexical synonyms;
- include exact reason for each query, open decision, family, expected information gain and stop/merge implications;
- mark queries as `RUN`, `HOLD`, `COVERED_BY_EXISTING_SERP`, or `NOT_NEEDED`;
- do not create final pages from the matrix;
- do not rank queries by a simple frequency score alone;
- explicitly include contamination-control Search queries only when they protect a real downstream decision.

## 16. QA / ACCEPTANCE CHECKS

Work must prove:

- all authorized raw B01/B02 and A01-A19 evidence processed at full volume;
- all direct rows accounted for;
- all association rows accounted for;
- all tested seeds accounted for;
- totalCount-only / empty-success cases accounted for;
- no duplicate source row silently discarded;
- no count double-addition across overlapping roots;
- F1-F10 each has an explicit current state and evidence basis;
- every suggested M3 query maps to a named unresolved decision;
- every boundary/exclusion class has adversarial examples checked;
- product/API/source claims comply with current authorities;
- no final page architecture/clusters produced;
- no provider action executed;
- output ZIP contains exactly the required final files.

## 17. STOP CONDITIONS

Stop and report `HOLD` rather than guessing if:

- governing product truth or source-boundary files conflict;
- a required input set cannot be read completely;
- remote authority drift changes governing files during the run;
- a classification requires unavailable Search/competitor/Alice evidence;
- a capability claim cannot be supported by current accepted evidence.

## 18. PUBLICATION POLICY

Work must not commit or push.

Required delivery:

- complete the bounded task;
- run all QA;
- create the single ZIP named above;
- provide a direct downloadable ZIP link;
- report every file inside the ZIP;
- recommend exact repository path for each output file;
- state which outputs are new vs would replace an existing authority;
- state QA result, work completed and what remained out of scope.

Main Chat will perform return QA, remote publication/readback only after owner relay/approval.

## 19. CURRENT METHOD CHECK

Fresh Main Chat method check before handoff confirmed:

- Yandex Wordstat GetTop remains a last-30-days phrase/similar-query source and supports up to 2000 phrases;
- Yandex Webmaster currently describes query clusters as automatic groups of queries similar in meaning or user intent and recommends finding additional/non-obvious formulations plus studying popular sites/pages.

Therefore this reconciliation must prioritize user job, intent, lineage and later SERP decision value over lexical similarity or raw frequency alone.

## 20. MANIFEST VERDICT

```text
WORK_ID = OCTOPORT_SEO_M2R_RECON_2026-09-17_W0
WORK_TRIGGER = PASS / QUALITY-BASED
M2R_WORDSTAT_ACQUISITION = STOPPED AFTER A19
A20_PROVIDER_QUERY = NOT AUTHORIZED
M7_COLLECTION_FREEZE = BLOCKED
FINAL_SEMANTIC_MASTER = NOT AUTHORIZED
FINAL_PAGE_ARCHITECTURE = NOT AUTHORIZED
FULL_VOLUME_RECONCILIATION = AUTHORIZED
OUTPUT_MODE = ZIP HANDOFF / NO GIT PUBLICATION BY WORK
```
