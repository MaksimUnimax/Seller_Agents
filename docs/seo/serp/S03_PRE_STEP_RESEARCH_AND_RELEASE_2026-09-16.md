# S03 pre-step research and bounded release — `ии агент для wildberries`

Date: 2026-09-16.
Stage: `M3 — Ordinary Yandex SERP collection`.
Status: **PREPARED / OWNER-FACING SOURCE DISCLOSURE REQUIRED IN CURRENT CHAT / SUBMIT BLOCKED UNTIL THAT DISCLOSURE IS DELIVERED**.

## 1. Whole project goal and roadmap position

Octoport SEO goal:

```text
product truth
-> complete durable evidence
-> M7 Collection Freeze
-> Work full-volume semantic master
-> clustering
-> Search-vs-Alice reconciliation
-> page ownership/IA
-> page specs
-> technical SEO
-> implementation
-> live/indexing QA
-> measurement
```

Current cursor:

```text
M0 product truth = PASS
M1 source/site baseline = PARTIAL / OPEN for live measurement surfaces
M2 Wordstat = PASS WITH HISTORICAL PERSISTENCE LIMITATION DOCUMENTED
M3 ordinary Yandex SERP = IN PROGRESS
S01 generic AI-agents = CLOSED / 20
S02 Ozon-specific AI-agent = CLOSED / 20
S03 Wildberries-specific AI-agent = local job created only; provider submit NOT executed
M4 competitors = preliminary registry started
M5 Alice = NOT STARTED
M6 gaps = BLOCKED
M7 freeze = BLOCKED
M8+ final semantics/pages = BLOCKED
```

## 2. Current step goal

Query: `ии агент для wildberries`.
Wordstat context: observed `20` in B02.

Open decision:

Does Wildberries-specific AI-agent wording produce a materially marketplace-specific seller/agent/API/data SERP comparable to or different from S02 Ozon, and does it provide evidence for a distinct WB page job versus one generic AI-agent page?

This step does not create `/wildberries`, does not finalize a cluster, and does not prove a commercial promise.

## 3. Why current evidence is insufficient

S01 proves a generic marketplace AI-agent category.
S02 shows strong Ozon seller-side/API/data/agent intent and dedicated Ozon pages.

But Ozon evidence cannot establish Wildberries symmetry. Without S03 we cannot know whether Yandex currently rewards:

- WB-specific product/landing pages;
- generic dual-marketplace agent pages;
- informational/how-to pages;
- card/content generation pages;
- official marketplace surfaces;
- other page classes.

Therefore S03 has distinct information gain.

## 4. Relevant prior failures / anti-regression

Applicable controls:

1. `SEED != FINAL KEYWORD/CLUSTER/PAGE`.
2. `BUSINESS RIVAL != SEARCH COMPETITOR`.
3. lexical Ozon/Wildberries difference does not automatically mean two pages.
4. one SERP appearance does not establish a stable recurring competitor.
5. provider success is not durable project evidence until persistence/readback/export validation.
6. async pending/no-due is not zero/failure and cannot justify resubmit.
7. current query must keep the same Search settings as S02 for meaningful paired comparison.
8. S03 local `start` was issued prematurely before this per-query release; this concrete incident is recorded as `OSEO-F01`. No provider request occurred. `submitN` remains blocked until this release and owner disclosure pass.

## 5. Fresh external research — checked 2026-09-16

### YS-S03-01 — Yandex Webmaster: query selection and market analysis

Source: Yandex Webmaster / OFFICIAL_YANDEX  
URL: https://yandex.ru/support/webmaster/ru/service/queries-selection

Supports:

- Yandex clusters queries that are close in meaning or user intent;
- market analysis exposes popular sites and pages for selected queries;
- demand, clicks and competition are separate indicators.

Project application:

S03 must be interpreted by user intent and page/result types, not only by phrase spelling. Popular/recurring sites and pages are search-competitor evidence.

Boundary: Webmaster clustering does not itself decide Octoport page ownership and does not prove that Ozon/WB must split.

### YS-S03-02 — Yandex Search API: WebSearchAsync.Search

Source: Yandex AI Studio / OFFICIAL_PROVIDER  
URL: https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search

Supports current async request fields including query text, search type, page, family/typo modes, sort/group settings, max passages, region, localization and response format.

Project application:

Reuse the same S02 parameters for S03 so cross-marketplace comparison is not confounded by request-setting changes.

Boundary: provider request schema does not prove Bridge implementation and does not define analytical sufficiency of top-20.

### YS-S03-03 — Yandex deferred search lifecycle

Source: Yandex AI Studio / OFFICIAL_PROVIDER  
URL: https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search

Supports:

- deferred search returns an Operation id;
- processing may take from about five minutes to hours;
- the Operation id must be preserved for later result retrieval.

Project application:

Exactly-once submit; preserve operation id; collect existing operation later; never interpret pending as failure/zero; no blind resubmit.

### YS-S03-04 — Yandex Search API quotas and limits

Source: Yandex AI Studio / OFFICIAL_PROVIDER  
URL: https://aistudio.yandex.ru/ru/docs/search-api/concepts/limits

Supports current limits including up to 250 returned results, deferred minimum processing time of 5 minutes and maximum result retention of 12 hours.

Project application:

Our 20-result first-page surface is deliberately a bounded discovery sample for intent/competitor comparison, not full SERP coverage. Early collect guards are expected; result retrieval must occur inside retention.

### YS-S03-05 — Yandex Search API pricing

Source: Yandex AI Studio / OFFICIAL_PROVIDER  
URL: https://aistudio.yandex.ru/en/docs/search-api/pricing

Supports billing per request and current RUB deferred example `30.5 RUB / 1000` daytime; internal server/authentication errors are not billed.

Project application:

Keep `maxRequests=1` and `maxCostRub=0.0305` for the single deferred submission. Cost limits protect against accidental duplicate provider execution; they do not determine evidence quality.

### IP-S03-01 — Semrush keyword clustering

Source: Semrush / INDUSTRY_PRACTICE  
URL: https://www.semrush.com/blog/keyword-clustering/

Supports grouping by common search intent and inspecting the kinds of pages search engines rank for related queries.

Project application:

Compare S02 and S03 page types and URL/domain overlap before any Ozon/WB split/merge decision.

Boundary: this is general industry practice, not an official Yandex threshold. No universal shared-URL cutoff is adopted.

### IP-S03-02 — Ahrefs Traffic Share competitor discovery

Source: Ahrefs / INDUSTRY_PRACTICE  
URL: https://help.ahrefs.com/en/articles/2073915-how-can-i-find-new-competitor-websites-using-the-traffic-share-reports

Supports finding search competitors/pages from an arbitrary keyword set and target country by observing which domains/pages rank for those keywords.

Project application:

Maintain the competitor registry from actual representative SERPs rather than owner-selected business-rival names.

Boundary: Ahrefs uses its own database/traffic estimates; for Octoport the actual Yandex exports remain primary current SERP evidence.

## 6. Source -> method trace

| Method element | Source/evidence | Action | Claim boundary |
|---|---|---|---|
| interpret by intent, not lexical match | Yandex Webmaster | classify S03 result/page types and user task | no automatic page split |
| same Search parameters for paired comparison | Yandex WebSearchAsync schema + project method | keep S02 settings unchanged | top-20 remains bounded |
| async exactly-once lifecycle | Yandex deferred docs + Bridge S01/S02 evidence | one submit, preserve operation id, due collect | pending != failure |
| top-20 discovery boundary | provider max + project heuristic | analyze ranks 1..20 consistently | not full SERP coverage |
| search-competitor discovery | Yandex popular sites/pages + Ahrefs corroboration | record recurring domains/pages | business competitor != SEO competitor |
| split/merge challenge | Yandex intent clustering + Semrush SERP/intent practice | compare S02 vs S03 URL/domain/page-type overlap | no magic overlap threshold |

## 7. S03 analysis plan

For every S03 result capture/classify:

```text
rank
URL/domain/title/snippet
page type: product/landing/integration/article/guide/comparison/official/noise
WB-only vs WB+Ozon vs generic
seller-owned data/API implication
read-only/data-answering vs mutation/automation promise
agent/assistant vocabulary
content-generation/card contamination
recurrence vs S01/S02
exact-URL overlap vs domain overlap
new terminology/gap signal
```

Paired comparison S02 vs S03 must report:

```text
shared exact URLs
shared domains
Ozon-only recurring pages/domains
WB-only recurring pages/domains
page-type mix differences
seller/API/data language differences
content-generation noise differences
preliminary split/merge implication = SUPPORT_SPLIT | SUPPORT_MERGE | MIXED | HOLD
```

The implication remains preliminary until broader M3/M4/M5 and M7.

## 8. Information-gain / outcome contract

### SUCCESS_WITH_RESULTS

Persist/export all normalized rows and compare against S02. Can strengthen, weaken or keep HOLD on marketplace-specific page-job hypothesis.

### SUCCESS_WITH_ZERO_RESULTS

Bounded zero only for this exact query/settings/snapshot. It would weaken evidence for this exact wording but would not prove no WB AI-agent demand or eliminate a WB page.

### VALIDATION / PROVIDER / PARSE / INCOMPLETE / UNKNOWN

No semantic conclusion. Preserve failure truth. No blind retry. Reconciliation/release required before follow-up.

## 9. Provider contract

```text
service = Search
mode = Manual / Deferred
query = ии агент для wildberries
searchType = SEARCH_TYPE_RU
region = 225
page = 0
groupsOnPage = 20
docsInGroup = 1
groupMode = GROUP_MODE_FLAT
familyMode = FAMILY_MODE_MODERATE
fixTypoMode = FIX_TYPO_MODE_OFF
sortMode = SORT_MODE_BY_RELEVANCE
sortOrder = SORT_ORDER_DESC
maxRequests = 1
maxCostRub = 0.0305
```

Existing local job: `octoport-serp-s03-20260916`.
Its premature local start is preserved and read back; do not recreate it.

## 10. Bridge capability check

Current installed/runtime evidence is YMB `0.1.8` from Octoport S01/S02:

```text
start -> local-only, provider_calls 0
submitN count=1 -> one provider submit when accepted
accepted operation id persists
collectN before due can be local NO_DUE_OPERATIONS
later provider-backed collect can close same operation
exportPage revision-bound export works
```

Provider docs are not used as proof of those Bridge behaviors; actual S01/S02 bridge evidence is.

## 11. Work trigger

Current S03 acquisition unit is one query with expected top-20 normalized rows.

```text
WORK_TRIGGER_FOR_PROVIDER_ORCHESTRATION = NOT MET
```

Complete paired S02/S03 comparison is still safe in Main Chat. Re-evaluate Work when cross-query/corpus size makes full analysis unsafe; never sample merely for context convenience.

## 12. Hard gates

Before `submitN`:

```text
S03_LOCAL_START_PERSISTED_READBACK = PASS
FRESH_EXTERNAL_RESEARCH = PASS
OWNER_FACING_CLICKABLE_SOURCE_DISCLOSURE = REQUIRED IN CURRENT CHAT
SOURCE_TO_METHOD_TRACE = PASS
INFORMATION_GAIN_CONTRACT = PASS
CURRENT_PROVIDER_CONTRACT_RECHECK = PASS
CURRENT_BRIDGE_CAPABILITY_SEPARATELY_RECONCILED = PASS
WORK_TRIGGER_EVALUATED = PASS
PREMATURE_START_DEFECT_RECORDED = PASS
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

Only after the owner-facing disclosure in chat is delivered may the existing S03 local job proceed to one `submitN`.

## 13. Quality score

Ten criteria, each 0–10:

| Criterion | Score | Reason |
|---|---:|---|
| Goal/output completeness | 10.0 | exact paired WB decision and outputs defined |
| Method/source support | 9.5 | current official Yandex + current industry corroboration; no Yandex-native numeric split threshold exists/used |
| Input evidence/provenance integrity | 9.0 | S01/S02 strong; S03 local start was prematurely released, but no provider call occurred and defect is preserved |
| Coverage/completeness | 9.5 | paired WB check fills a material marketplace gap; broader M3 remains intentionally open |
| Analytical correctness/claim boundaries | 9.5 | explicit no-final-page and bounded-zero boundaries |
| Adversarial QA quality | 9.5 | exact/domain overlap + page-type/noise/API contrast specified |
| Persistence/readback/reproducibility | 10.0 | per-action persistence/readback and export hash/provenance required |
| Owner usability/plain language | 9.5 | explicit problem/result/blocker/next action; owner-facing disclosure still must be delivered in chat |
| Information gain/cost/execution efficiency | 10.0 | distinct unanswered WB question; one bounded provider submission |
| Downstream readiness | 8.5 | cannot be fully ready until S03 result/export exists and paired comparison is executed |

`QUALITY_TOTAL = 94.5 / 100`  
`QUALITY_SCORE = 9.45 / 10`

This is a PASS candidate for **method/release preparation**, but numeric score cannot override the owner-facing source-disclosure hard gate.

## 14. Plain-language conclusion

We already know what Yandex shows for the general AI-agent query and for Ozon. We still do not know whether Wildberries behaves the same way or needs a different page/job. This S03 query exists specifically to answer that comparison, not to collect another keyword for quantity.

The earlier local `start` was issued too soon. It did not contact Yandex or spend money, so we preserve it and stop before the paid submit. After the current source/method analysis is shown to the owner and this release is read back, the existing job can safely continue with exactly one submit. The result will then be saved completely and compared with Ozon before any page decision is made.
