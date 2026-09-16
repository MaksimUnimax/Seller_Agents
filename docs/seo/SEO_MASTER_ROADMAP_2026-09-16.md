# Octoport SEO Master Roadmap — from evidence to finished product

Date: 2026-09-16.
Status: `CURRENT EXECUTION AUTHORITY`.
Branch: `seo/wordstat-batch-01-2026-09-16`.

This roadmap supersedes the earlier coarse SEO-S0..S10 plan as the execution authority. The older roadmap remains historical context.

## 0. Goal

Deliver a production-ready organic-search product for **Octoport / Октопорт**:

```text
complete evidence set
-> governed semantic core
-> intent/SERP clusters
-> evidence-backed page architecture
-> page specifications
-> technically correct public site
-> indexed/search-visible pages
-> Yandex Search + Alice AI + Google measurement loop
```

“Finished product” does not mean “a keyword spreadsheet”. It means the public site has the right useful pages, correct technical signals, truthful content, measurable search presence and a repeatable improvement loop.

## 1. Non-negotiable rules

1. `PRODUCT_TRUTH > SEO COPY` — no ranking goal can authorize a false feature/promise.
2. `RAW -> VERIFY -> ANALYZE -> NEXT` for paid/provider evidence.
3. `DEMAND != INTENT` — Wordstat count cannot decide a page.
4. `QUERY != PAGE` — final page ownership requires user-task + SERP evidence.
5. `SEARCH COMPETITOR != BUSINESS RIVAL` — competitors originate from current SERPs.
6. `AMBIGUITY -> HOLD`, not forced KEEP/EXCLUDE.
7. No blind retry of paid/asynchronous provider operations.
8. No fake CREATE pages, doorway pages or thin programmatic SEO.
9. Ordinary Search and Alice AI are separate evidence surfaces with the same quality foundation.
10. SEO research writes only under `docs/seo/**` until a dedicated bounded implementation handoff is accepted.
11. Parallel server/extension work is not touched by this stream.
12. Any upstream truth/method correction explicitly invalidates only dependent downstream authorities.

## 2. Method authorities

Internal:

- `PRODUCT_TRUTH.md`
- `METHODOLOGY.md`
- `EXTERNAL_METHOD_RESEARCH_2026-09-16.md`
- `KW002_METHOD_AUDIT_2026-09-16.md`
- Wordstat B01/B02 raw + analysis + synthesis
- live SERP/Alice evidence produced by this roadmap

External method basis:

- official Yandex ЭПОС / Alice / Webmaster / technical recommendations;
- Google Search Essentials / SoftwareApplication structured data;
- SERP-intent and SERP-overlap clustering corroboration from current industry methodology.

## 3. Stage map

| Stage | Name | Current state | Exit artifact/gate |
|---|---|---|---|
| M0 | Governance + product truth | `PASS` | frozen truth/source/evidence rules |
| M1 | Current-site + measurement baseline | `OPEN` | baseline audit + analytics/indexability inventory |
| M2 | Demand acquisition | `B01+B02 PASS / GAP REOPEN CONDITIONAL` | Wordstat evidence sufficient for current vocabulary families |
| M3 | Ordinary Yandex SERP collection | `IN PROGRESS` | representative query matrix captured durably |
| M4 | Search-competitor + landing corpus | `OPEN` | recurring competitors/pages + page-pattern extraction |
| M5 | Alice AI / generative-search evidence | `OPEN` | representative answers/sources/follow-ups captured |
| M6 | Incremental gap acquisition | `BLOCKED ON M3-M5` | new lexical/topic gaps either measured or explicitly closed |
| M7 | Collection freeze | `BLOCKED` | `EVIDENCE_COLLECTION_COMPLETE` gate |
| M8 | Normalize + relevance/intent master | `BLOCKED` | governed semantic universe |
| M9 | SERP-overlap clustering | `BLOCKED` | cluster authority + split/merge/cannibalization decisions |
| M10 | Search-vs-Alice reconciliation | `BLOCKED` | page/source requirements reconciled |
| M11 | Page ownership + information architecture | `BLOCKED` | final target-page map / URLs / Page Jobs |
| M12 | Page specs + content system | `BLOCKED` | page-by-page SEO/content specifications |
| M13 | Technical SEO specification | `OPEN FOR READ-ONLY AUDIT / IMPLEMENTATION BLOCKED` | technical handoff and acceptance matrix |
| M14 | Production implementation | `BLOCKED` | bounded site patch only |
| M15 | Pre-deploy/live QA | `BLOCKED` | crawl/index/schema/content/performance gates PASS |
| M16 | Launch + indexing | `BLOCKED` | production URLs verified/submitted/discovered |
| M17 | Measurement + iteration | `BLOCKED` | Webmaster/GSC/Alice/analytics loop active |
| M18 | Finished-product acceptance | `BLOCKED` | all launch acceptance criteria satisfied |

# M0 — Governance + product truth

Already accepted baseline:

- brand: Octoport / Октопорт;
- public domain: `https://octoport.ru/`;
- read-only launch scope;
- chosen external LLM/web AI connected through browser extension;
- Ozon + Wildberries;
- marketplace keys local for ordinary operation;
- no server archive of raw business reports/chat history;
- closed free beta preparation, not public-production availability;
- no unsupported mutation promises.

Exit: `PASS`.

# M1 — Current-site + measurement baseline

## Collect

Read-only inventory of current public/source surface:

- existing URLs;
- Title/H1/description/canonical;
- visible product claims;
- robots/sitemap/favicon/status codes where live surface is accessible;
- indexability;
- internal links/navigation;
- static-vs-JS indexable content;
- Schema.org state;
- Yandex Webmaster ownership/readiness;
- Google Search Console ownership/readiness;
- Metrika/approved conversion measurement state;
- current indexed pages / branded visibility if any.

## Current known source baseline

Current homepage already has canonical, title/description, static semantic HTML and product-truth-safe beta copy, but it is a single-page product surface and has no evidence-backed landing family yet.

## Exit

`CURRENT_SITE_BASELINE_*.md` with no implementation changes.

# M2 — Demand acquisition

## Completed

Wordstat Batch 01 and Batch 02 are complete and persisted.

Key confirmed demand families include:

- generic AI-agent category;
- Ozon-specific agent wording;
- Wildberries-specific agent wording;
- task/work/sales/analytics wording;
- analytics-service ambiguity;
- comparison/discovery wording;
- content-generation noise controls.

## Reopen rule

Do **not** launch another broad Wordstat batch by default.

Reopen Wordstat only if M3-M5 discovers a genuinely new product-fit lexical/topic family not already answered by durable evidence. Every reopen requires:

```text
named information gap
+ proof existing evidence does not answer it
+ exact query/operator/depth purpose
+ full persistence/readback
```

# M3 — Ordinary Yandex SERP collection

## Purpose

Build current intent/page-type/search-competitor evidence before final semantic decisions.

## Capture format

For each selected query:

- exact query;
- region/search parameters;
- request/job/operation IDs;
- full export provenance;
- top ranked URLs/domains/titles/snippets;
- result type classification;
- dominant content type/format/angle;
- marketplace specificity;
- operational/data vs content-generation intent;
- external analytics vs seller-owned data distinction;
- recurring domains/pages;
- ambiguity notes.

## Representative query matrix

The matrix is deliberately broader than the first seven queries but remains bounded by information gain.

### A. Core category / agent language

- `ии агенты для маркетплейсов` — S01 collected;
- `ии агент для маркетплейсов`;
- `ии ассистент для маркетплейсов`;
- `ии для маркетплейсов` — broad control;
- `нейросеть для маркетплейсов` — broad content-generation control.

### B. Ozon-specific

- `ии агент для озон`;
- `ии ассистент для озон`;
- `ии для озон`;
- `chatgpt для ozon`;
- `подключить ии к ozon` or the strongest observed equivalent after preliminary SERP evidence.

### C. Wildberries-specific

- `ии агент для wildberries`;
- `ии для wildberries`;
- `ии для вайлдберриз` if it produces materially different spelling/result behavior;
- `chatgpt для wildberries`;
- `подключить ии к wildberries` or evidence-backed equivalent.

### D. Work/task/analytics

- `ии для работы с маркетплейсами`;
- `ии для продаж на маркетплейсах`;
- `ии для аналитики маркетплейсов`;
- `сервис аналитика продаж на маркетплейсах`;
- `сервис внутренней аналитики маркетплейсов`.

### E. Discovery/comparison/persona

- `какой ии для маркетплейсов`;
- `лучшие нейросети для маркетплейсов` or current observed equivalent;
- `ии для селлера` / `ии помощник селлера` selected by evidence;
- `нейросети для менеджеров маркетплейсов` when needed to resolve training/tool intent.

### F. Integration / natural-language-to-data model

Seeded from product mechanics and S01 competitor language; exact probes are released only after checking that they add information beyond A-E:

- connect marketplace/store data to AI;
- connect ChatGPT/another external LLM to Ozon/WB;
- AI agent directly connected to seller/store data;
- marketplace API + AI/agent wording.

### G. Noise/control queries

Only enough controls to prove exclusion boundaries:

- card/infographic generation root;
- `нейросеть помощь для маркетплейсов` if needed;
- training/course contamination control.

## Stop condition

M3 stops when additional representative queries no longer materially change:

- intent classes;
- dominant page types;
- recurring competitor set;
- marketplace split decisions;
- candidate page jobs;
- new lexical families.

Not by arbitrary query count.

# M4 — Search competitor + landing corpus

## Registry

Build from domains/pages recurring across M3, not from a prewritten competitor list.

S01 already exposed candidate domains such as Berkuz, ILAI, MPSTATS Connect AI, KT-Team, OpenClaw, JVO, Selsup, MarketAut, JAFO, SuperIntellect, ClawWow, MPMGR, Uniseller and others.

## For recurring/relevant pages collect

- URL + rank/query lineage;
- page type: product/landing/article/comparison/tool/docs;
- title/H1/category naming;
- promise/benefit framing;
- marketplace and LLM coverage;
- feature/task vocabulary;
- read-only vs mutation/automation framing;
- trust/proof: demos, screenshots, cases, company identity, reviews, integrations;
- CTA and availability/pricing framing;
- FAQ/subtopic coverage;
- freshness/author/expertise signals;
- structured data where observable;
- internal links / content hub relationships;
- product-truth overlap and gaps.

## Output

`serp/competitors/REGISTRY.*` + bounded page notes/snapshots.

No competitor copy is reused verbatim as Octoport content.

# M5 — Alice AI / generative-search evidence

## Why

Alice sources are selected from strong search pages but source composition and answer structure differ from ordinary SERPs. We need evidence about what subquestions/entities/pages Alice uses in this category.

## Query set

Derived from the final M3 representative set, emphasizing:

- `что такое ии агент для маркетплейса`;
- `какой ии использовать для маркетплейсов`;
- AI agent for Ozon;
- AI agent for Wildberries;
- how to connect AI/ChatGPT to Ozon/WB;
- AI for marketplace analytics / seller data;
- comparison/choice questions;
- security/data/API questions if they appear in Search/competitor/Alice fan-out.

## Capture

For each controlled case:

- exact prompt/query and date;
- answer text/structure where provider permits;
- cited source URLs/domains/pages;
- subquestions/follow-up decomposition;
- product vs article/source mix;
- repeated entities/categories;
- whether Octoport-like mechanism is described;
- contradictions/missing topics;
- variability note.

Because Alice answers are non-deterministic, core category and marketplace cases receive repeat snapshots where useful. We do not treat a single source omission as a permanent ranking fact.

## Post-launch authority

When data exists, Yandex Webmaster `Видимость сайта в Алисе AI` becomes the longitudinal authority for:

- Share of Voice;
- example queries/pages;
- neighboring/competitive source sites;
- trend changes.

# M6 — Incremental gap acquisition

After M3-M5, create one gap register:

- new market terminology from competitors;
- new user jobs from SERPs;
- new Alice fan-out questions;
- unexplained Ozon/WB asymmetry;
- unresolved analytics/integration meanings.

Each gap closes by one of:

- existing evidence reuse;
- targeted Wordstat;
- targeted Search;
- targeted Alice/AI-search;
- product owner fact;
- explicit HOLD.

No recursive “related keyword” collection without a named decision need.

# M7 — Collection Freeze Gate

Final analysis/site architecture does not start until:

```text
WORDSTAT_BASELINE_COMPLETE = true
REPRESENTATIVE_SERP_MATRIX_COMPLETE = true
SEARCH_COMPETITOR_REGISTRY_STABLE = true
RELEVANT_COMPETITOR_PAGE_CORPUS_CAPTURED = true
ALICE_CORE_CASES_CAPTURED = true
OPEN_HIGH_VALUE_ACQUISITION_GAPS = 0
PROVIDER_OUTCOME_UNKNOWN = 0
RAW/NORMALIZED EVIDENCE REQUIRED FOR ANALYSIS IS DURABLE = true
```

Completeness means **all evidence needed to make page/intent decisions**, not every possible phrase on the internet.

# M8 — Semantic master

Create compact governed tables:

- `UNIVERSE`;
- `WORKING`;
- `REVIEW/HOLD`;
- `EXCLUDED`;
- `BRAND_DEFENSE`.

Each row keeps:

- raw + normalized phrase;
- source/provenance;
- Wordstat value(s) without fake aggregation;
- marketplace/entity tags;
- product-fit state;
- user job;
- intent;
- exclusion/review reason;
- representative SERP evidence pointer;
- competitor/Alice evidence pointer where material.

No substring-only automatic semantic verdicts.

# M9 — SERP-overlap clustering

For each candidate cluster:

1. user task similarity;
2. product answer similarity;
3. SERP URL/domain overlap;
4. dominant result type/content type;
5. marketplace-specificity;
6. funnel stage;
7. cannibalization risk.

Output:

- cluster registry;
- representative primary/secondary queries;
- merge/split decision with basis;
- `HOLD` where evidence remains mixed.

# M10 — Search vs Alice reconciliation

For high-value clusters ask:

- does Alice use the same page/source class as ordinary Search?
- what follow-up questions must a page answer to become a useful source?
- does Alice emphasize comparison/explanation while Search emphasizes product landings, or vice versa?
- are additional supporting guides needed without splitting the commercial page intent?

This stage can add **supporting content requirements**, but cannot invent product capabilities.

# M11 — Page ownership + final information architecture

Only now assign physical page roles.

Possible roles, not pre-authorized URLs:

- HOME/category;
- Ozon product/marketplace landing;
- Wildberries product/marketplace landing;
- capability/use-case landing;
- LLM/integration page;
- how-it-works/security/privacy/support;
- comparison/discovery guide;
- educational guide/article;
- brand/about/trust pages;
- `NO_PAGE / COVER_ELSEWHERE / HOLD`.

Each cluster gets exactly one primary owner unless an explicit split is justified.

Physical action:

- `KEEP`;
- `OPTIMIZE`;
- `CREATE`;
- `ROUTE_INTERNAL_LINK`;
- `RECHECK/HOLD`.

No fake CREATE.

# M12 — Page specifications + content system

Every indexable target page receives:

- URL/page role;
- primary query + observed demand;
- secondary queries + their own metrics;
- user task and funnel intent;
- product promise boundary;
- Title target;
- H1 target;
- description guidance;
- opening answer/value proposition;
- required content blocks;
- proof/demo/data requirements;
- trust/entity requirements;
- FAQ only from real evidence;
- `covered_elsewhere` boundary;
- internal links in/out;
- canonical/indexability;
- structured-data eligibility;
- Alice-answerable subquestions where evidence supports them;
- priority HIGH/MEDIUM/LOW with textual basis;
- implementation acceptance tests.

## EPOS gate

Each page must pass:

- **Relevance** — directly solves the observed user task;
- **Expertise** — factual/product/author/company evidence;
- **Usefulness** — materially advances the user's decision/task;
- **Originality** — contains product-specific value/evidence, not rewritten competitors;
- **Substance** — complete but not padded with generic text.

# M13 — Technical SEO specification

Read-only audit may run earlier; implementation waits for page map.

Required technical scope:

- canonical `https://octoport.ru/` origin;
- URL/redirect policy;
- canonical tags;
- robots/indexing rules;
- ensure wanted pages are not blocked from Yandex/Google;
- ensure `YandexAdditionalBot` is not accidentally blocked if Alice visibility is desired;
- XML Sitemap containing only canonical indexable pages;
- crawlable text internal links;
- unique Title/H1/description states;
- correct 200/3xx/404 behavior;
- static/indexable main content or verified rendering;
- mobile usability;
- performance/Core Web Vitals baseline;
- favicon/social metadata;
- `SoftwareApplication` / `WebApplication` Schema.org where truthful and supported;
- Organization/WebSite/other schema only when real data supports it;
- schema validators / rich-result validation;
- no duplicate/thin/service URLs indexed accidentally.

# M14 — Production implementation

Implementation occurs in a separately synchronized bounded site task/branch after M11-M13 acceptance.

Each implementation handoff contains:

- exact files/URLs;
- exact page specs;
- content/proof assets;
- technical changes;
- internal links;
- what not to change;
- source tests;
- live acceptance checks.

SEO stream does not edit server/extension contracts.

# M15 — Pre-deploy and live QA

Before accepting each page family:

- content matches product truth/page spec;
- no unsupported claims;
- semantic HTML/H1/Title correct;
- links/canonicals correct;
- robots/indexability correct;
- sitemap correct;
- schema validates and matches visible content;
- mobile/rendering works;
- no accidental duplicate/cannibalizing page;
- HTTP codes/redirects correct;
- performance has no blocking regression;
- actual production URL readback matches source intent.

# M16 — Launch + indexing

After production deployment:

- verify live canonical/robots/sitemap;
- add/verify Yandex Webmaster and Google Search Console;
- submit/refresh sitemap where useful;
- inspect priority URLs;
- record indexation baseline;
- record first branded/non-branded visibility baseline;
- do not treat immediate absence from results as proof of failure.

# M17 — Measurement + iteration

## Yandex

- query impressions/clicks/CTR/position;
- landing-page performance;
- query-selection/market-analysis discoveries;
- index/crawl diagnostics;
- Alice AI Share of Voice and source examples when available.

## Google

- Search Console queries/pages/indexing;
- rich-result/schema issues;
- Core Web Vitals/technical diagnostics where material.

## Product analytics

Only approved privacy-safe metrics:

- organic landing visits;
- beta/signup/activation CTA conversions when the flow exists;
- funnel by page role;
- meaningful product conversion, not vanity dwell-time targets.

## Reopen triggers

Reopen semantic/page decisions when:

- a new lexical family gains material impressions;
- SERP intent changes;
- Alice source patterns expose a coverage gap;
- product truth/launch capabilities change;
- cannibalization appears;
- competitor/category language materially shifts.

# M18 — Finished-product acceptance

Octoport SEO/product-search work reaches initial `READY` only when:

```text
EVIDENCE_COLLECTION_COMPLETE = true
SEMANTIC_MASTER_ACCEPTED = true
INTENT_CLUSTERING_ACCEPTED = true
PAGE_OWNERSHIP_ACCEPTED = true
ALL_PRIORITY_PAGE_SPECS_ACCEPTED = true
TECHNICAL_SEO_IMPLEMENTED_AND_VERIFIED = true
PRIORITY_PAGES_DEPLOYED = true
YANDEX_WEBMASTER_CONNECTED = true
GOOGLE_SEARCH_CONSOLE_CONNECTED = true
INDEXATION_BASELINE_RECORDED = true
ALICE_MEASUREMENT_PATH_READY = true
NO_CRITICAL_PRODUCT_TRUTH_VIOLATION = true
NO_CRITICAL_INDEXABILITY/CANONICAL/ROBOTS_DEFECT = true
MEASUREMENT_LOOP_DOCUMENTED = true
```

This is the end of the initial build, not the end of SEO forever.

## 4. Current execution cursor

As of 2026-09-16:

- M0: PASS;
- M2: B01+B02 PASS, no broad Wordstat reopen authorized;
- M3: started;
- S01 `ии агенты для маркетплейсов`: provider lifecycle PASS, 20 normalized Yandex results captured and persisted as normalized authority;
- S01 strongly confirms that marketplace AI agents are a real search category containing product landings, integrations, services and educational/comparison pages, not merely card-generation noise;
- M4: registry can start from S01 but must wait for more M3 queries before declaring stable competitors;
- M5: not started;
- M7 collection freeze: not reached;
- M8+ final semantics/pages: deliberately blocked.

## 5. Immediate next work sequence

Do not redesign the site yet.

Execute in this order:

1. finish M1 read-only current-site/measurement baseline;
2. continue M3 representative ordinary Yandex SERP collection;
3. continuously build M4 recurring search-competitor registry, but no final competitor conclusions until enough query families are captured;
4. select and collect M5 Alice AI cases;
5. run M6 only for genuine evidence gaps discovered in M3-M5;
6. reach M7 Collection Freeze;
7. only then build the semantic master, clusters, page ownership and implementation specs.

This sequence is now the canonical Octoport SEO roadmap.
