# Octoport SEO Master Roadmap — evidence to finished product

Date: 2026-09-16.
Status: **CURRENT EXECUTION AUTHORITY**.
Branch: `seo/wordstat-batch-01-2026-09-16`.

This roadmap supersedes the earlier coarse SEO-S0..S10 plan.

Mandatory companion process authorities:

- `EXECUTION_RULES.md`;
- `WORK_HANDOFF_RULE.md`;
- `STAGE_GATES_M0_M7.md`;
- `PRODUCT_TRUTH.md`;
- `EXTERNAL_METHOD_RESEARCH_2026-09-16.md`;
- `KW002_METHOD_AUDIT_2026-09-16.md`.

No roadmap stage may bypass those rules.

## 0. End goal

Deliver a complete production-ready organic-search product for **Octoport / Октопорт**:

```text
truthful product scope
-> durable search evidence
-> governed semantic core
-> intent/SERP clusters
-> evidence-backed page architecture
-> page specs/content system
-> technically correct public site
-> live/indexed pages
-> Yandex Search + Alice AI + Google measurement loop
```

The final product is not a keyword spreadsheet. It is a correctly structured, useful, technically sound, measurable website whose public promises match the real product.

## 1. Global execution order

```text
COLLECT COMPLETE NEEDED EVIDENCE
-> M7 COLLECTION FREEZE
-> HAND LARGE CROSS-SOURCE DATA TO CHATGPT WORK
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

Owner instruction is explicit: **first collect and durably save the evidence needed for correct SEO/semantics/landings/optimization; then analyze and design the final architecture.**

## 2. Large-data operating model

```text
MAIN CHAT
= collects evidence, controls method, writes provider commands, persists/readbacks evidence, writes Work prompts, QA's Work return

CHATGPT WORK
= complete large-data analysis/systematization/transformation/artifact creation under the exact frozen prompt
```

When Work trigger conditions in `WORK_HANDOFF_RULE.md` are met, ordinary chat must not replace full-volume analysis with sampling or first-N rows.

Expected Work stages:

- `W1` after M7: full cross-source semantic master;
- `W2` M9 when complete SERP-overlap/task clustering is large;
- `W3` M11/M12 if query→page/coverage matrices become large;
- additional earlier Work handoff if M3–M5 corpus grows beyond reliable complete ordinary-chat analysis.

## 3. Global hard rules

1. `PRODUCT_TRUTH > SEO COPY`.
2. `RAW/EXPORT -> DURABLE PERSIST -> REMOTE READBACK -> ANALYZE -> NEXT PROVIDER ACTION`.
3. No blind retry of paid/asynchronous provider actions.
4. `DEMAND != INTENT`.
5. `SEED != FINAL KEYWORD/CLUSTER/PAGE`.
6. `QUERY != PAGE`.
7. `SEARCH COMPETITOR != BUSINESS RIVAL`.
8. `AMBIGUITY -> HOLD`.
9. Mechanical accounting QA never replaces semantic QA.
10. Search baseline is preserved before Alice reconciliation.
11. No fake CREATE/thin/doorway pages.
12. SEO stream changes only `docs/seo/**` until explicit implementation handoff.
13. Fresh external method/provider research is required before every major stage.
14. Every major stage receives quality scoring and hard-gate QA per `EXECUTION_RULES.md`.
15. A later authority/evidence correction may invalidate dependent downstream PASS states.

# M0 — Governance + product truth

Status: `PASS`.

Freeze:

- public brand/domain;
- real launch capabilities;
- Ozon/Wildberries boundary;
- read-only launch promise;
- chosen external LLM/web-AI model;
- local credential/data-storage claims;
- beta/public availability truth;
- unsupported mutations/actions;
- allowed evidence sources;
- SEO/server/site isolation boundary.

Output: `PRODUCT_TRUTH.md` + source/method authorities.

Reopen only on explicit product truth change.

# M1 — Current-site + measurement baseline

Status: `OPEN / SOURCE BASELINE PARTIAL PASS`.

Collect read-only current state:

- current public/source URLs;
- Title/H1/meta/canonical;
- visible product claims;
- robots/sitemap;
- internal links/navigation;
- rendering/indexable content;
- structured data;
- live HTTP/redirect/indexability state;
- Yandex Webmaster ownership/readiness;
- Google Search Console ownership/readiness;
- Metrika/approved conversion-measurement state;
- current indexed/branded visibility if any.

Existing source baseline: `technical/CURRENT_SITE_BASELINE_2026-09-16.md`.

No site modifications in M1.

# M2 — Demand acquisition / Wordstat baseline

Status: `B01+B02 EXECUTED / RETROSPECTIVE KW002 GATE AUDIT OPEN`.

Completed factual acquisition:

- Wordstat Batch 01 broad discovery;
- Wordstat Batch 02 targeted product-fit expansion.

Do not launch another broad Wordstat batch by default.

Before M7, mandatory retrospective migration under `STAGE_GATES_M0_M7.md`:

- seed/probe quality audit;
- depth/coverage audit;
- B01 raw-persistence inventory;
- B02/full-envelope verification;
- explicit evidence-limitations register;
- decision whether any limitation actually requires new provider acquisition.

Important: earlier B01 evidence remains useful, but do not claim every pre-B01-15 file is an exact full envelope until verified.

Any new Wordstat acquisition must be named-gap/information-gain driven and pass current provider-depth + raw-persistence gates before execution.

# M3 — Ordinary Yandex SERP collection

Status: `IN PROGRESS`.

Authorities:

- `serp/M3_QUERY_MATRIX_2026-09-16.md`;
- `serp/M3_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-16.md`;
- `serp/SERP_PROGRESS.md`.

Purpose:

- determine real intent/page types;
- discover recurring search competitors;
- test marketplace-specific split;
- resolve category/agent/assistant/task/analytics/integration ambiguity;
- discover new vocabulary only when it changes a decision.

Current S01 `ии агенты для маркетплейсов`:

- deferred Search completed successfully;
- 20 normalized results;
- normalized export authority saved;
- exact source attachment hash-pinned and being durably archived;
- S01 proves that marketplace AI-agent language has a real product/service/integration/information SERP, not only card-generation content.

Execution shape while current YMB popup/state/batch behavior is under repair:

```text
ONE QUERY JOB
-> local start
-> persist/readback
-> exact one submitN
-> persist/readback operation identity
-> due collectN
-> persist/readback
-> local export
-> persist/hash/readback
-> close query
-> release next
```

No burst/batch provider submissions merely for speed.

M3 stops by information saturation, not arbitrary query count.

# M4 — Search competitor + landing corpus

Status: `OPEN`.

Build recurring competitor registry from M3 SERPs.

For materially recurring/relevant ranking pages capture:

- URL/query/rank lineage;
- page type and intent;
- title/H1/category framing;
- marketplace/LLM specificity;
- tasks/capabilities promised;
- read-only vs mutation/automation framing;
- proof/trust/cases/screenshots/integrations;
- pricing/beta/availability framing where public;
- CTA pattern;
- FAQ/subtopics;
- freshness/author/expertise signals;
- internal-link/content-hub pattern;
- observable structured-data/content architecture;
- gaps/overlap against Octoport product truth.

Competitor text is evidence, not copy source.

If the page corpus becomes large enough that full comparison is unsafe here, trigger Work rather than sampling.

# M5 — Alice AI / generative-search evidence

Status: `OPEN / NOT STARTED`.

Preserve ordinary Search baseline first.

Representative cases are selected from M3/M4 and should cover, where evidence warrants:

- what an AI agent for marketplaces is;
- which AI to use for marketplaces;
- Ozon agent;
- Wildberries agent;
- connecting AI/ChatGPT to Ozon/WB/store data;
- AI for marketplace analytics/seller data;
- comparison/choice;
- security/data/API questions surfaced by Search/competitors.

For each case save:

- exact prompt/query/date;
- complete allowed answer evidence;
- cited source URLs/pages/domains;
- follow-up/subquestion decomposition;
- source/page type mix;
- repeated entities/category terms;
- contradictions/gaps;
- variability/repeat-snapshot notes where useful.

Alice is evidence, not a deterministic ranking list.

Post-launch, Yandex Webmaster Alice visibility/Share of Voice becomes the longitudinal measurement authority when available.

# M6 — Incremental gap acquisition

Status: `BLOCKED ON M3–M5 EVIDENCE`.

Create one explicit gap register from Search, competitors and Alice.

Each gap is resolved through exactly one justified route:

- existing evidence reuse;
- targeted Wordstat;
- targeted Search;
- targeted Alice/AI-search;
- owner/product fact;
- HOLD.

Every provider candidate must state:

```text
open question
why existing evidence is insufficient
expected information gain
positive/valid-zero/failure/unknown meaning
request/depth/cost/stop contract
persistence/readback path
what downstream decision uses it
```

No recursive related-query exploration without decision value.

# M7 — Collection Freeze

Status: `BLOCKED`.

This is the hard boundary requested by the owner: final semantic/page architecture does not begin until evidence is sufficient.

Required gate:

```text
PRODUCT_SCOPE_CURRENT = PASS
M1 BASELINE ENOUGH FOR LATER IMPLEMENTATION = PASS
WORDSTAT SEED/DEPTH/PERSISTENCE RETRO AUDIT = PASS OR EXPLICIT ACCEPTED LIMITATION
REPRESENTATIVE SERP MATRIX = COMPLETE FOR DECISIONS
SEARCH COMPETITOR REGISTRY = STABLE ENOUGH
RELEVANT COMPETITOR PAGE CORPUS = CAPTURED
ALICE CORE CASES = CAPTURED
OPEN HIGH-VALUE ACQUISITION GAPS = 0
OUTCOME_UNKNOWN PROVIDER ACTIONS = 0
REQUIRED EVIDENCE DURABLE/READBACK = PASS
WORK W1 PRE-HANDOFF MANIFEST = READY
```

Then set:

`EVIDENCE_COLLECTION_COMPLETE = true`.

# M8 — Full semantic master

Status: `BLOCKED UNTIL M7`.

Default execution: `ChatGPT Work W1` under Main Chat canonical prompt.

Inputs:

- complete authorized Wordstat evidence;
- M3 SERPs;
- M4 competitor corpus;
- M5 Alice evidence;
- product truth;
- exclusion/HOLD boundaries.

Outputs:

- `UNIVERSE`;
- `WORKING`;
- `REVIEW/HOLD`;
- `EXCLUDED`;
- `BRAND_DEFENSE`;
- raw→normalized→decision lineage;
- reason-code accounting;
- independent semantic QA / known-failure regression matrix.

Rules:

- no substring-only destructive verdict;
- no frequency-only KEEP/EXCLUDE;
- no silent row loss;
- all uncertainty explicit.

Main Chat independently QA's Work return before M9.

# M9 — SERP + user-task clustering

Status: `BLOCKED`.

Combine:

- user task;
- product answer similarity;
- ordinary Yandex SERP URL/domain overlap;
- dominant content/page type;
- marketplace specificity;
- funnel stage;
- cannibalization risk.

Use Work W2 if pairwise/full-matrix analysis is large.

Output: cluster authority with explicit merge/split/HOLD rationale.

# M10 — Search vs Alice reconciliation

Status: `BLOCKED`.

For high-value clusters classify Alice effect as:

```text
CHANGE
ENRICH
DE-RISK
NO-CHANGE
HOLD
```

Ask whether Alice needs:

- more complete explanatory blocks on the same commercial page;
- a supporting guide;
- clearer entity/API/security explanation;
- no structural change.

Do not create AI-only pages without evidence.

# M11 — Page ownership + information architecture

Status: `BLOCKED`.

Assign one primary owner per cluster unless a split is explicitly justified.

Possible page roles:

- HOME/category;
- Ozon landing;
- Wildberries landing;
- capability/use-case;
- LLM/integration;
- how-it-works/security/privacy/support;
- comparison/discovery guide;
- educational guide/article;
- brand/about/trust;
- `NO_PAGE / COVER_ELSEWHERE / HOLD`.

Physical action:

```text
KEEP
OPTIMIZE
CREATE
ROUTE_INTERNAL_LINK
RECHECK/HOLD
```

No fake CREATE.

# M12 — Page specs + content system

Status: `BLOCKED`.

Every indexable target page gets:

- URL/page role;
- primary query + observed demand;
- secondary queries + individual observed metrics;
- intent/user job;
- product promise boundary;
- own coverage vs `covered_elsewhere`;
- H1 and Title target state;
- description guidance;
- page angle and expected content type;
- required semantic blocks;
- product proof/demos/trust;
- FAQ only when evidence supports real user need;
- internal links in/out;
- canonical/indexing state;
- schema eligibility;
- Alice/source-readiness requirements;
- SEO priority with explicit basis;
- implementation state.

Every page must pass product-truth + Yandex EPOS usefulness/expertise/originality/completeness gate.

# M13 — Technical SEO specification

Status: `READ-ONLY AUDIT ALLOWED / IMPLEMENTATION BLOCKED`.

Specify/verify:

- canonical origin;
- status codes/redirects;
- robots;
- sitemap;
- `YandexAdditionalBot` policy for Alice visibility;
- crawlable links/no orphans;
- static/indexable primary content;
- unique Title/H1/description boundaries;
- canonical duplicates;
- mobile usability;
- performance/Core Web Vitals;
- Open Graph;
- truthful `SoftwareApplication` / `WebApplication` structured data where eligible;
- no fake ratings/prices/availability;
- Yandex + Google compatibility.

# M14 — Bounded production implementation

Status: `BLOCKED`.

Only after M11–M13 acceptance does SEO issue a bounded site patch/handoff.

The implementation task states:

- exact URLs/files;
- content/page specs;
- technical requirements;
- links/canonical/indexing;
- acceptance tests;
- explicit do-not-change boundary.

Refresh current `main` and parallel site/server work before implementation. No blind merge.

# M15 — Source/pre-deploy/live QA

Status: `BLOCKED`.

Verify source and deployed behavior:

- page content vs spec;
- H1/Title/meta/canonical;
- status codes/redirects;
- robots/sitemap;
- rendering;
- crawlable internal links;
- schema validity/truthfulness;
- mobile/performance baseline;
- no duplicate/thin/orphan target pages.

# M16 — Launch + indexing verification

Status: `BLOCKED`.

Verify production:

- canonical URLs live;
- robots/sitemap live;
- Webmaster/GSC ownership;
- index/discovery state;
- crawl/coverage errors;
- brand/non-brand baseline.

# M17 — Measurement + controlled iteration

Status: `BLOCKED`.

Track:

- Yandex impressions/clicks/queries/pages;
- Webmaster query-selection/market data;
- Alice AI Share of Voice/source examples when available;
- Google Search Console;
- approved product conversion signals;
- selected recurring SERP checks for critical category queries.

Every material optimization should record hypothesis → change → measured evidence.

# M18 — Finished-product acceptance

Status: `BLOCKED`.

Initial SEO product is accepted when:

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

SEO remains measurable and reopenable after launch; “finished” means the launch product and control loop are complete, not that search demand can never change.

## Current cursor

```text
M0 = PASS
M1 = OPEN / SOURCE BASELINE PARTIAL PASS
M2 = B01+B02 EXECUTED / RETRO GATE AUDIT OPEN
M3 = IN PROGRESS / S01 CLOSED / S02 RELEASE PREPARED
M4 = OPEN
M5 = NOT STARTED
M6 = BLOCKED ON M3-M5
M7 = BLOCKED
M8+ = BLOCKED UNTIL COLLECTION FREEZE
```

Next physical execution sequence:

1. finish durability/identity closure of S01 exact export archive;
2. complete `M2_WORDSTAT_RETRO_GATE_AUDIT_2026-09-16.md` without provider replay by default;
3. release S02 `ии агент для озон` under the M3 pre-step gate;
4. continue representative SERP collection with persistence/readback after every lifecycle action;
5. start recurring competitor registry once multiple query families are available;
6. select and collect Alice cases;
7. close gaps and freeze M7;
8. hand the full frozen large evidence set to Work W1.
