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

Status: **IN PROGRESS**.

Authorities:

- `serp/M3_QUERY_MATRIX_2026-09-16.md`;
- `serp/M3_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-16.md`;
- `serp/SERP_PROGRESS.md`.

Purpose:

- determine current intent/result/page types;
- find recurring search competitors;
- test Ozon/WB split;
- resolve category/agent/assistant/task/analytics/integration ambiguity;
- expose genuinely new lexical gaps.

### Current S01

Query: `ии агенты для маркетплейсов`.

Closed facts:

- deferred lifecycle completed;
- provider operation collected successfully;
- 20 normalized SERP rows;
- source attachment `search-octoport-serp-s01-20260916-r5-0-0.json` hash-pinned (`SHA-256 6a669f140e0b1b0f4e697195d3eed74b44cab8139151970a7c1d3471c04566c6`);
- complete normalized top-20 SEO authority persisted under `serp/exports/`;
- exact-byte attachment remains original conversation/file evidence; if exact-byte Git publication becomes necessary, use native file/owner relay and remote readback — never giant model/base64 transport;
- S01 demonstrates a real marketplace AI-agent SERP with product/service landings, integrations and informational/comparison sources, not only card-generation content.

### Current execution shape

Until the current YMB popup/state and batch-semantics repairs are independently accepted:

```text
ONE QUERY JOB
-> local start
-> persist/readback
-> exact one submitN
-> persist/readback operation identity
-> due collectN
-> persist/readback
-> export
-> persist/hash/readback required evidence
-> close query
-> release next
```

M3 stops by information saturation, not query count.

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

Status: **BLOCKED ON M3–M5**.

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

# M7 — Collection Freeze

Status: **BLOCKED**.

Final semantic/page architecture cannot begin until:

```text
PRODUCT_SCOPE_CURRENT = PASS
M1 BASELINE SUFFICIENT FOR IMPLEMENTATION = PASS
M2 WORDSTAT RETRO GATE = PASS WITH ACCEPTED LIMITATION
REPRESENTATIVE SERP MATRIX = COMPLETE FOR DECISIONS
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
M3 = IN PROGRESS / S01 CLOSED / S02 RELEASED FOR LOCAL START
M4 = OPEN
M5 = NOT STARTED
M6 = BLOCKED ON M3-M5
M7 = BLOCKED
M8+ = BLOCKED UNTIL COLLECTION FREEZE
```

## Next physical sequence

1. execute S02 `ии агент для озон` as one bounded Deferred Search job;
2. persist/readback every lifecycle response before the next action;
3. continue M3 matrix while information gain remains;
4. build recurring M4 competitor registry/corpus as multiple query families accumulate;
5. select/collect M5 Alice cases;
6. close M6 gaps;
7. freeze M7;
8. write exact W1 prompt and hand the complete frozen evidence corpus to ChatGPT Work;
9. Main Chat QA/accepts Work semantic master;
10. proceed M9–M18.
