# Octoport SEO Master Roadmap — evidence to finished product

Date: 2026-09-16.
Status: **CURRENT EXECUTION AUTHORITY**.
Branch: `seo/wordstat-batch-01-2026-09-16`.

This roadmap supersedes the earlier coarse `SEO_ROADMAP.md`.

Mandatory companion authorities:

- `EXECUTION_RULES.md`;
- `WORK_HANDOFF_RULE.md`;
- `STAGE_GATES_M0_M7.md`;
- `PRODUCT_TRUTH.md`;
- `EXTERNAL_METHOD_RESEARCH_2026-09-16.md`;
- `KW002_METHOD_AUDIT_2026-09-16.md`.

No stage may bypass those rules.

## End goal

Deliver a complete production-ready organic-search product for **Octoport / Октопорт**:

```text
truthful product scope
-> durable demand/search/competitor/Alice evidence
-> governed semantic core
-> intent/SERP clusters
-> evidence-backed page architecture
-> page specs/content system
-> technically correct public site
-> live/indexed pages
-> Yandex Search + Alice AI + Google measurement loop
```

The final product is not a keyword spreadsheet. It is a correctly structured, useful, technically sound, measurable public site whose promises match the real product.

## Global execution order

```text
COLLECT COMPLETE NEEDED EVIDENCE
-> M7 COLLECTION FREEZE
-> HAND LARGE FROZEN CROSS-SOURCE DATA TO CHATGPT WORK
-> MAIN CHAT RETURN QA / ACCEPTANCE
-> SEMANTIC MASTER
-> CLUSTERING
-> SEARCH-vs-ALICE RECONCILIATION
-> PAGE OWNERSHIP / IA
-> PAGE SPECS
-> TECHNICAL SEO SPEC
-> BOUNDED SITE IMPLEMENTATION
-> LIVE QA / INDEXING
-> MEASUREMENT / ITERATION
```

Owner instruction is explicit: first collect and durably save the evidence needed for correct semantics/landings/optimization; only after M7 design final semantic architecture.

## Large-data operating model

```text
MAIN CHAT
= architect/controller
= evidence collection and provider-command author
= durable persistence/readback
= exact Work prompt author
= Work-return QA and acceptance

CHATGPT WORK
= complete large-data analysis/systematization/transformation
= full-volume joins/dedup/reconciliation/clustering/artifact generation
= no independent method mutation
```

When the Work trigger in `WORK_HANDOFF_RULE.md` fires, sampling/first-N/truncation as a substitute is forbidden.

Expected Work points:

- `W1` after M7: complete cross-source semantic master;
- `W2` M9: full SERP-overlap/task clustering if matrix size/complexity requires it;
- `W3` M11/M12: query→page/coverage matrix if large;
- `W4` final large workbook/report/artifact package if needed;
- earlier Work may trigger in M3–M5 if the complete corpus becomes unsafe to analyze here without sampling.

## Global hard rules

1. `PRODUCT_TRUTH > SEO COPY`.
2. `FULL RESPONSE/EXPORT -> DURABLE PERSIST -> REMOTE READBACK -> ANALYZE -> NEXT PROVIDER ACTION`.
3. No blind retry of paid/asynchronous provider actions.
4. `DEMAND != INTENT`.
5. `SEED != FINAL KEYWORD/INTENT/CLUSTER/PAGE`.
6. `QUERY != PAGE`.
7. `SEARCH COMPETITOR != BUSINESS RIVAL`.
8. `AMBIGUITY -> HOLD`.
9. Mechanical accounting QA never replaces semantic QA.
10. Ordinary Search baseline remains independently recoverable before Alice reconciliation.
11. No fake CREATE/thin/doorway pages.
12. Fresh external method/provider research before each major stage.
13. Every major stage gets hard-gate QA + ten-dimension quality scoring.
14. Later evidence/authority correction may invalidate affected downstream PASS states.
15. SEO stream changes only `docs/seo/**` until explicit implementation handoff.
16. `CHAT != DURABLE STORAGE`: every accepted roadmap/rule/evidence/analysis/progress change must be written to the active GitHub branch and remote-readback; chat-only state is not accepted project state.

# M0 — Governance + product truth

Status: **PASS**.

Freeze brand/domain, current capabilities, Ozon/Wildberries scope, read-only launch promise, chosen external LLM model, credential/storage truth, beta/public availability, unsupported actions, evidence authorities and parallel-work isolation.

Output: `PRODUCT_TRUTH.md` and current authority chain.

Reopen only after explicit product/source change.

# M1 — Current-site + measurement baseline

Status: **OPEN / SOURCE BASELINE PARTIAL PASS**.

Collect read-only:

- current source/live URLs;
- Title/H1/meta/canonical;
- visible claims;
- robots/sitemap;
- links/navigation;
- rendering/indexable content;
- structured data;
- HTTP/redirect/indexability state;
- Yandex Webmaster readiness/ownership;
- Google Search Console readiness/ownership;
- Metrika/approved conversion measurement;
- indexed/branded visibility baseline when available.

Existing source authority: `technical/CURRENT_SITE_BASELINE_2026-09-16.md`.

No site edits in M1.

# M2 — Demand acquisition / Wordstat

Status: **PASS WITH EXPLICIT HISTORICAL PERSISTENCE LIMITATION**.

Completed:

- B01 broad Wordstat discovery;
- B02 targeted product-fit expansion;
- strict retrospective seed/depth/persistence audit under transferred KW-002 gates.

Authority: `wordstat/M2_WORDSTAT_RETRO_GATE_AUDIT_2026-09-16.md`.

Historical limitation:

- B01-01..14 retain durable factual result body + request/provenance but are structured transcriptions, not exact complete top-level bridge envelopes;
- B01-15 is full-envelope evidence;
- B02-01..15 were executed under the strict full-envelope + readback process.

Current decision:

```text
KNOWN CURRENT SEMANTIC BODY LOSS = 0 identified
REPLAY B01-01..14 FOR WRAPPER FORM ONLY = NOT AUTHORIZED
```

New Wordstat acquisition is allowed only for a named evidence gap discovered later and requires a fresh information-gain/depth/persistence contract.

# M3 — Ordinary Yandex SERP collection

Status: **CLOSED FOR PRIMARY ORGANIC ACQUISITION / CONTROL DEBT OPEN UNTIL M6**.

Authorities:

- `serp/M3_QUERY_MATRIX_2026-09-16.md`;
- `serp/M3_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-16.md`;
- `serp/SERP_PROGRESS.md`;
- `serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md`.

Completed authority set:

- S01–S03 accepted;
- R01–R12 accepted;
- the original unreliable R04 transport run is not authority; clean rerun R04R1 is authority;
- R12 was the final query and M3 primary acquisition closed at commit `8eba5e3371f029812bd480076b0570af317e960b`.

What M3 did correctly:

- representative queries came from prior demand/product evidence rather than an arbitrary keyword list;
- one bounded Search lifecycle was completed and durably persisted before releasing the next provider action;
- accepted runs used a consistent organic baseline: Russian search, region `225` (Russia), page 0, top-20, flat grouping, relevance sort;
- every accepted query was analyzed result-by-result rather than assigning intent from wording alone;
- mixed intent was preserved as evidence instead of forced into one label;
- unreliable transport evidence was rerun cleanly instead of being silently accepted;
- raw/export provenance, hashes and remote readback were treated as acceptance requirements;
- no final URL/H1/Title/page architecture was derived prematurely from M3 alone.

## M3 retrospective — what was insufficient

M3 is valid as an **organic-intent acquisition pass**, but its old Definition of Done was too narrow to call it a fully controlled SERP study.

1. **Primary evidence was XML/organic-oriented rather than full SERP representation.**
   Yandex Search API documentation states that XML contains search results without additional SERP elements, while HTML can also include ads, quick answers and other elements. Therefore M3 captured the organic ranking layer well, but did not systematically capture the complete search-result environment.

2. **Device sensitivity was not an explicit acceptance control.**
   The provider supports `userAgent` for device/browser-oriented search results, and Yandex Webmaster analysis also exposes device selection. M3 did not require a desktop/mobile sensitivity sample.

3. **Regional sensitivity was not tested beyond the Russia baseline.**
   Region `225` is a sensible nationwide baseline for Octoport, but the stage did not require a bounded comparison against at least one material regional context for ambiguous/high-value queries.

4. **Temporal stability was not tested.**
   Each authority query is effectively one accepted snapshot. This is adequate for baseline evidence but insufficient to prove that mixed or high-value intent composition is stable rather than a transient SERP state.

5. **A complete cross-query URL/domain overlap control was not produced before closure.**
   Full clustering correctly remains a later stage, but a QA overlap matrix should have been produced earlier as a sanity check on query-family similarity and hidden duplication.

## Why M3 was allowed to close with those gaps

This was not caused by missing raw organic evidence. The cause was an **incomplete stage acceptance design**:

1. M3 was framed primarily as `organic intent + result/page type + competitor discovery`.
2. The working Yandex Marketing Bridge pipeline exposed reproducible normalized XML/organic results and strong lifecycle/persistence guarantees, so execution optimized around the reliable transport already available.
3. The pre-step gate heavily validated exactly-once lifecycle, top-20 completeness, persistence, hashes, readback and information gain.
4. The gate did **not** explicitly require `FULL_SERP_REPRESENTATION`, device sensitivity, regional sensitivity, temporal repeat controls, or a cross-query overlap QA artifact.
5. Because those dimensions were absent from the old Definition of Done, M3 could legitimately pass its own internal gate while still being narrower than a complete SERP-method standard.
6. Cross-query overlap was deliberately deferred toward later clustering; that was reasonable for final page decisions, but too aggressive for acquisition QA because it removed an early control that could reveal query-family equivalence or divergence.
7. The methodology review performed after closure surfaced this mismatch. Therefore the correct response is **not** to discard M3 or blindly replay all queries, but to preserve valid organic evidence and close only the missing controls in M6 before Collection Freeze.

## Correct M3 Definition of Done for future runs

A future equivalent SERP stage must define before the first provider call:

- whether the objective is `ORGANIC_ONLY` or `FULL_SERP`; organic-only evidence must never be described as complete SERP evidence;
- exact search type, region, result depth, sort/grouping and timestamp;
- full-SERP HTML capture for representative/high-value queries when SERP features matter;
- device/browser context and a bounded mobile/desktop sensitivity plan where supported;
- geography baseline plus bounded regional sensitivity where geography can change results;
- temporal repeat policy for ambiguous/high-value/mixed-intent queries;
- result-by-result intent/page-type classification;
- raw + normalized + analysis persistence in GitHub with remote readback;
- cross-query URL/domain overlap QA before stage closure, while final clustering/page ownership still remains post-freeze;
- an explicit decision on what observed instability would trigger targeted additional collection.

Method references used for this correction:

- Yandex Search API text search / result formats: https://aistudio.yandex.ru/ru/docs/search-api/concepts/web-search
- Yandex Webmaster query/market analysis, clustering, region and device controls: https://www.yandex.ru/support/webmaster/en/service/queries-selection
- Yandex Webmaster site regionality: https://www.yandex.ru/support/webmaster/en/site-geography/site-region
- Ahrefs SERP-overlap clustering industry corroboration: https://ahrefs.com/blog/keyword-clustering/

M3 remains closed for the primary organic corpus. Its control debt is a mandatory M6 dependency and blocks M7.

# M4 — Search competitor + landing corpus

Status: **OPEN**.

Build the recurring competitor registry from M3, not from preselected business rivals.

For materially recurring/relevant ranking pages preserve URL/query/rank lineage and collect:

- page type/intent;
- Title/H1/category language;
- marketplace/LLM specificity;
- tasks/capabilities/promises;
- read-only vs mutation/automation framing;
- proof/trust/cases/screenshots/integrations;
- pricing/beta/availability where public;
- CTA;
- FAQ/subtopics;
- author/freshness/expertise signals;
- internal-link/content-hub patterns;
- observable structured-data/content architecture;
- gaps/overlap against Octoport truth.

Competitor content is evidence, not copy source. Large corpus -> Work, not sampling.

# M5 — Alice AI / generative-search evidence

Status: **OPEN / NOT STARTED**.

Select cases from M3/M4 while preserving Search-only baseline. Likely families include category definition/choice, Ozon, Wildberries, connection of AI/ChatGPT to store data, marketplace analytics/seller data, comparison, and security/API questions discovered by Search/competitors.

For every case preserve:

- exact prompt/query/date;
- allowed answer evidence;
- cited source URLs/pages/domains;
- follow-up/subquestion decomposition;
- product/article/source mix;
- repeated entities/category language;
- gaps/contradictions;
- variability/repeat snapshots when material.

Alice is not a deterministic ranking list. After launch, Yandex Webmaster Alice visibility/Share of Voice becomes longitudinal evidence when available.

# M6 — Incremental gap acquisition

Status: **BLOCKED ON M4–M5 / M3 CONTROL PATCH MANDATORY BEFORE M7**.

Create one explicit gap register. Every gap closes by existing evidence reuse, targeted Wordstat, targeted Search, targeted Alice, owner/product fact, or HOLD.

Every new provider candidate requires:

```text
exact open question
why existing evidence is insufficient
expected information gain
positive / valid-zero / failure / unknown meaning
request/depth/cost/stop contract
persistence/readback path
downstream decision using it
```

No recursive “related query” collection without decision value.

## Mandatory return to M3: SERP control patch

M6 MUST return to M3 before Collection Freeze.

This return is required **because M3's original acceptance gate validated organic top-20 intent evidence and durable transport, but did not validate the completeness and stability of the surrounding SERP representation**. Specifically, the old gate omitted full HTML/SERP-feature coverage, device sensitivity, regional sensitivity, temporal repeats and a complete cross-query overlap QA artifact. The organic evidence itself is retained; the missing controls are what must be closed.

The patch is bounded and evidence-driven, not a blind replay of all M3 queries.

Required M3 control work in M6:

1. Select a small documented subset of the most decision-sensitive M3 queries (mixed intent, high business value, or likely to affect page ownership). Selection must be justified after M4/M5 evidence is visible.
2. Capture **full-SERP HTML** for that subset using Yandex Search API or another authorized Yandex surface capable of preserving the additional SERP elements; classify ads, quick answers and other material SERP features separately from organic rows.
3. Run a **device/browser sensitivity** control for the subset where the authorized provider supports meaningful device differentiation; if the selected transport cannot produce a distinct mobile/desktop context, record the limitation rather than fabricating equivalence.
4. Run a **regional sensitivity** control using the Russia baseline plus at least one justified comparison region for the subset where regionality may change interpretation.
5. Repeat a smaller set of ambiguous/high-value queries at a later timestamp before M7 to test **temporal stability**.
6. Build a **complete cross-query URL/domain overlap matrix** from the already persisted M3 organic corpus. This is acquisition QA only; final clustering/page ownership remains M9/M11.
7. Record whether each control result is `NO MATERIAL CHANGE | ENRICH | REOPEN TARGETED GAP | HOLD`.
8. Persist raw/control evidence, analysis and hashes in GitHub and remote-readback them before accepting closure.

Required closure artifact:

`serp/M3_RETROSPECTIVE_AND_CONTROL_CLOSURE.md`

It must explain:

- what the old M3 proved;
- what it did not prove;
- why the old DoD was incomplete;
- exact control queries and why they were selected;
- full-SERP/device/region/time findings;
- overlap findings;
- whether any material intent/page-type conclusion changed;
- any targeted new acquisition required;
- final `M3_CONTROL_DEBT = CLOSED | HOLD`.

If controls show no material new intent, do not expand the corpus merely to increase volume. If they reveal a material gap, acquire only the evidence needed to resolve that named decision.

M6 cannot pass while `M3_CONTROL_DEBT != CLOSED`.

# M7 — Collection Freeze

Status: **BLOCKED**.

Final semantic/page architecture cannot begin until:

```text
PRODUCT_SCOPE_CURRENT = PASS
M1 BASELINE SUFFICIENT FOR IMPLEMENTATION = PASS
M2 WORDSTAT RETRO GATE = PASS WITH ACCEPTED LIMITATION
REPRESENTATIVE SERP MATRIX = COMPLETE FOR DECISIONS
M3_CONTROL_DEBT = CLOSED
M3_FULL_SERP / DEVICE / REGION / TEMPORAL CONTROLS = ACCEPTED OR EXPLICIT HOLD
M3_CROSS_QUERY_OVERLAP_QA = PASS
SEARCH COMPETITOR REGISTRY = STABLE ENOUGH
RELEVANT COMPETITOR CORPUS = CAPTURED
ALICE CORE CASES = CAPTURED
OPEN HIGH-VALUE ACQUISITION GAPS = 0
OUTCOME_UNKNOWN PROVIDER ACTIONS = 0
DOWNSTREAM-REQUIRED EVIDENCE DURABLE/READBACK = PASS
WORK W1 PRE-HANDOFF MANIFEST = READY
```

Only then set `EVIDENCE_COLLECTION_COMPLETE = true` and release M8.

# M8 — Full semantic master

Status: **BLOCKED UNTIL M7**.

Default large-data execution: **ChatGPT Work W1** under an exact Main Chat prompt.

Inputs: all authorized Wordstat, Search, competitor, Alice and product-truth evidence.

Outputs:

- `UNIVERSE`;
- `WORKING`;
- `REVIEW/HOLD`;
- `EXCLUDED`;
- `BRAND_DEFENSE`;
- raw→normalized→decision lineage;
- reason-code accounting;
- known-failure regressions;
- independent semantic QA.

Rules: no substring-only destructive verdict, no frequency-only decision, no silent row loss, uncertainty remains explicit.

Main Chat performs return QA before M9.

# M9 — SERP + user-task clustering

Status: **BLOCKED**.

Combine user task, product answer, current SERP URL/domain overlap, dominant page/content type, marketplace specificity, funnel stage and cannibalization risk.

Use Work W2 when full overlap/cluster matrix requires large-data processing.

Output: cluster authority + explicit merge/split/HOLD rationale.

# M10 — Search vs Alice reconciliation

Status: **BLOCKED**.

For high-value clusters classify Alice effect as `CHANGE | ENRICH | DE-RISK | NO-CHANGE | HOLD`.

Determine whether the same commercial page needs richer explanatory/source-ready coverage, a supporting guide, clearer entity/API/security material, or no structural change.

No AI-specific page merely to manufacture AI value.

# M11 — Page ownership + information architecture

Status: **BLOCKED**.

Assign one primary page owner per cluster unless evidence justifies a split.

Possible roles: HOME/category, Ozon, Wildberries, capability/use-case, LLM/integration, how-it-works/security/privacy/support, comparison/discovery guide, educational guide/article, brand/about/trust, or `NO_PAGE / COVER_ELSEWHERE / HOLD`.

Physical action: `KEEP | OPTIMIZE | CREATE | ROUTE_INTERNAL_LINK | RECHECK/HOLD`.

No fake CREATE.

# M12 — Page specs + content system

Status: **BLOCKED**.

Each target page receives:

- URL/page role;
- primary query + observed demand;
- secondary queries + individual metrics;
- intent/user job;
- product promise boundary;
- own coverage / `covered_elsewhere`;
- H1/Title/description target state;
- page angle/content type;
- required semantic blocks;
- product proof/trust/demos;
- evidence-based FAQ only;
- internal links in/out;
- canonical/indexing;
- schema eligibility;
- Alice/source-readiness requirements;
- SEO priority + basis;
- implementation state.

Every target page must pass product truth + Yandex EPOS usefulness/expertise/originality/completeness gate.

# M13 — Technical SEO specification

Status: **READ-ONLY AUDIT ALLOWED / IMPLEMENTATION BLOCKED**.

Specify canonical origin, HTTP/redirect behavior, robots, sitemap, YandexAdditionalBot policy, crawlable links/no orphans, indexable primary content, unique Title/H1 boundaries, duplicate canonicalization, mobile/performance, Open Graph, truthful SoftwareApplication/WebApplication schema and Yandex+Google compatibility.

# M14 — Bounded production implementation

Status: **BLOCKED**.

Only after M11–M13 acceptance. Refresh current main and parallel site/server work before patch. Handoff exact files/URLs, page specs, technical requirements, internal links, indexing/canonical states, tests and do-not-change boundary.

# M15 — Source/pre-deploy/live QA

Status: **BLOCKED**.

Verify page/spec parity, Title/H1/meta/canonical, HTTP/redirects, robots/sitemap, rendering, crawlable links, schema truthfulness, mobile/performance and absence of duplicate/thin/orphan target pages.

# M16 — Launch + indexing verification

Status: **BLOCKED**.

Verify canonical URLs live, robots/sitemap live, Webmaster/GSC ownership, index/discovery state, crawl/coverage errors and brand/non-brand baseline.

# M17 — Measurement + controlled iteration

Status: **BLOCKED**.

Track Yandex queries/impressions/clicks/pages, Webmaster market/query data, Alice Share of Voice/source examples when available, Google Search Console, approved product conversions, and bounded recurring SERP controls.

Material optimization records hypothesis → change → measured result.

# M18 — Finished-product acceptance

Status: **BLOCKED**.

Initial SEO product is complete when:

```text
M0-M13 AUTHORITIES PASS
PRIORITY PAGE IMPLEMENTATION PASS
LIVE TECHNICAL QA PASS
INDEXING/MEASUREMENT SURFACES READY
NO CRITICAL PRODUCT-TRUTH DEFECT
NO CRITICAL CRAWL/INDEXABILITY DEFECT
NO OPEN HIGH-VALUE SEMANTIC/PAGE-OWNERSHIP GAP FOR LAUNCH
OWNER-FACING FINAL PACKAGE COMPLETE
MEASUREMENT/REOPEN LOOP DOCUMENTED
```

“Finished” means the launch SEO product and measurement/reopen loop are complete, not that search demand can never change.

## Current cursor

```text
M0 = PASS
M1 = OPEN / SOURCE BASELINE PARTIAL PASS
M2 = PASS WITH EXPLICIT HISTORICAL PERSISTENCE LIMITATION / NO REPLAY REQUIRED
M3 = CLOSED FOR PRIMARY ORGANIC ACQUISITION / CONTROL DEBT OPEN UNTIL M6
M4 = CURRENT / SEARCH COMPETITOR + LANDING CORPUS
M5 = NOT STARTED
M6 = BLOCKED ON M4-M5 / M3 CONTROL PATCH MANDATORY BEFORE M7
M7 = BLOCKED
M8+ = BLOCKED UNTIL COLLECTION FREEZE
```

## Next physical sequence

1. execute M4 Search competitor + landing corpus from the accepted M3 candidate set;
2. persist/readback every M4 evidence artifact in GitHub;
3. select and collect M5 Alice/generative-search cases;
4. enter M6 gap closure;
5. execute the mandatory M3 control patch in M6 and close `M3_CONTROL_DEBT`;
6. close any other named M6 gaps;
7. freeze M7 only after the M3 control blocker and all other gates pass;
8. write exact W1 prompt and hand the complete frozen evidence corpus to ChatGPT Work;
9. Main Chat QA/accepts Work semantic master;
10. proceed M9–M18.
