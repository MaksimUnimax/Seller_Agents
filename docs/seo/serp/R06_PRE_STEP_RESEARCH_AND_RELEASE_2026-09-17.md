# R06 pre-step research and bounded release — `помощник селлера маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F4 helper-intent boundary`.  
Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**.

## 1. Current cursor

```text
M2R = ACCEPTED
S01-S03 = CLOSED
R01-R05 = CLOSED
NEXT_CANDIDATE = R06
M7 = BLOCKED
M8 = BLOCKED
```

Matrix authority: `M3_QUERY_MATRIX_2026-09-17.md`.

## 2. Query identity

```text
QUERY_ID = R06
QUERY_TEXT = помощник селлера маркетплейсов
FAMILY = F4
JOB_ID_PLANNED = octoport-serp-r06-20260917
RELATION = control against F1 agent/assistant evidence
```

## 3. Exact open decision

What does current Yandex Search mean by the broad phrase `помощник селлера маркетплейсов`?

The live result set must separate at least:

1. a human seller assistant/employee role;
2. a human marketplace manager/agency/outsourcing service;
3. a general seller software helper/tool;
4. an AI seller copilot/assistant/agent;
5. a narrow automation utility branded as a seller helper;
6. support/community/legal/help service;
7. generic educational/helper content;
8. unrelated noise.

The decision is not whether the phrase exists. M2R/Wordstat already showed mixed helper demand and tiny AI-qualified exact wording. The decision is which user/job/page type dominates current Search and whether broad `помощник селлера` language is safe for Octoport acquisition.

## 4. Why durable evidence is insufficient

F1 evidence already proves an AI-agent category and F2 proves own-LLM connection intent. Neither tells us what an unqualified `помощник селлера` means to Search users.

If current Search is dominated by vacancies, job descriptions, manager services or outsourcing, Octoport must not adopt generic helper language as if it were naturally software-first. If software/AI products are a major coherent class, the phrase remains usable with scope boundaries.

```text
R06_REDUNDANT_WITH_F1 = NO
R06_INFORMATION_GAIN = HIGH
```

## 5. Fresh external/provider research — 2026-09-17

### R06-Y1 — current Yandex deferred Search lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Current documentation says an asynchronous request returns an Operation object; the caller must save its `id`, wait for execution, and retrieve the same operation later. It explicitly notes execution may take from five minutes to a few hours.

Method use: preserve the same accepted manual/deferred lifecycle, one submit, durable operation identity, bounded collects, revision-pinned export.

### R06-Y2 — current WebSearchAsync request contract

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Current REST reference still returns an Operation and supports the same search/group/sort parameter family used by prior accepted M3 queries.

Method use: preserve RU / region 225 / page 0 / flat top-20 comparability.

### R06-H1 — `assistant/helper` is current human-role language

Current 2026 seller-operations source:

`https://legendbms.ru/blog/dolzhnostnaya-instrukciya-assistenta-sellera`

Published 2026-08-20, it explicitly frames `ассистент селлера` as a human job/role with duties and a job-description template, including the natural hiring phrase `нужен помощник на маркетплейс`.

Method use: vacancies/job descriptions/hiring/employee-duty pages must be coded as human-role intent, not software merely because they use `помощник/ассистент`.

### R06-S1 — `помощник селлера` is also current AI/software language

Current seller-AI product surface:

`https://sally-seller.ru/`

The current site identifies itself as `Салли — помощник селлера`, connects Wildberries/Ozon seller data and presents seller finance, sales, advertising and stock analysis through a software assistant surface.

Method use: direct software/AI helper products form a distinct class from human employment/service intent.

Boundary: Search evidence does not authorize copying another product's data storage, background processing or feature set.

### R06-S2 — current narrow software tools also use `помощник продавца`

Current Chrome Web Store surface:

`https://chromewebstore.google.com/detail/помощник-продавца-анализ/mljjmnhhhelhgecmaobakebaggekdjii`

The listing calls itself `Помощник продавца` but is a narrow rating-analysis calculator for Ozon/Wildberries, showing that helper vocabulary can represent a specialized utility rather than a broad AI copilot.

Method use: separate narrow utilities from general helper/coplilot surfaces.

### R06-S3 — AI helper vocabulary is not limited to analytics

Current seller-assistant examples:

- `https://www.snaplit.ru/` — AI seller helper centered on review-response automation;
- `https://ilai.io/` — seller tool suite describing a digital AI assistant alongside reports, SEO, ads and automation;
- `https://apps.apple.com/tr/app/сит-помощник-селлера/id6759723772` — `помощник селлера` app combining professional support with an AI consultant.

Method use: distinguish AI/software helper, narrow automation and support/community surfaces rather than merging all non-human results.

## 6. Source -> method trace

| Question | Evidence | R06 use | Boundary |
|---|---|---|---|
| Current async provider lifecycle? | Yandex official docs | same accepted deferred top-20 method | provider docs != Bridge capability |
| Is helper language a human-role term now? | current seller assistant job-description surface | human employee/hiring class | not software intent |
| Is helper language a software/AI term now? | Sally + current AI/helper products | AI/software classes | product claims remain source-specific |
| Can `helper` mean a narrow utility? | Chrome Web Store seller-helper tool | specialized-tool class | narrow utility != broad copilot |
| Why Search now? | M2R + F1/F2 closure | measure live dominance and collision | no page decision yet |

## 7. Full-result coding plan

Every normalized organic result will be reviewed with:

```text
rank
url/domain/title/snippet/full export text when needed
page type = vacancy/job-description/service/agency/product/tool/app/extension/article/community/support/noise
actor = human employee / human service provider / software / AI / unclear
marketplace scope = WB / Ozon / multi / generic
helper job = operational / analytics / content / reviews / ads / support / management / hiring / other
data boundary = seller-authorized own data / external intelligence / generic knowledge / none / unclear
commercial intent = hire / outsource / subscribe / install / learn / support
Octoport fit = direct / adjacent / boundary / noise
```

Primary classes:

- `HUMAN_SELLER_ASSISTANT_EMPLOYEE`;
- `HUMAN_MARKETPLACE_MANAGER_OR_OUTSOURCING`;
- `AI_SELLER_COPILOT_OR_AGENT`;
- `GENERAL_SELLER_SOFTWARE_HELPER`;
- `SPECIALIZED_SELLER_AUTOMATION_UTILITY`;
- `SELLER_SUPPORT_COMMUNITY_OR_LEGAL_HELP`;
- `GENERIC_SELLER_HELP_CONTENT`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; these classes are not quotas. New evidence-driven classes may be added rather than forcing mismatched rows.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export complete top-20; classify every row; measure human-role/service versus AI/software/helper intent and page types; decide whether broad helper language is usable and what modifier/scope is required.

### VALID ZERO

Weakens only this exact formulation. It does not erase accepted F1 agent evidence or other seller-assistance demand.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry. Ambiguous provider execution requires separate reconciliation/release before any new paid attempt.

## 9. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = помощник селлера маркетплейсов
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
jobId = octoport-serp-r06-20260917
```

## 10. Current Bridge capability

Rechecked immediately before release:

```text
REPO = MaksimUnimax/Yandex_direct
BRANCH = hotfix/ymb-017-qualification-fix-2026-09-16
HEAD = 469a69b628ef00e79718996cfd7bbb0291edddec
```

The same current implementation has already completed R04-R1 and R05 through accepted deferred operation, bounded no-due guards, provider-backed terminal collect and revision-pinned full export.

Bridge capability and provider documentation remain separate proofs.

## 11. Persistence / conflict gates

```text
RAW_LIFECYCLE_PATH_PREFIX = docs/seo/serp/raw/R06_*
ANALYSIS_PATH_PREFIX = docs/seo/serp/analysis/R06_*
FULL_EXPORT_PERSISTENCE = REQUIRED BEFORE SEMANTIC ANALYSIS
REMOTE_READBACK = REQUIRED BEFORE EVERY NEXT PROVIDER ACTION
WORK_TRIGGER_FOR_ONE_TOP20 = NOT MET
R06_EXISTING_DURABLE_START_ARTIFACT = NONE (404 CHECKED)
```

One top-20 query is safe for full Main Chat review; sampling is forbidden.

## 12. Release gate

```text
R05 = CLOSED / PERSISTED / READBACK
R06_INFORMATION_GAIN = HIGH
FRESH_YANDEX_PROVIDER_RESEARCH = PASS
FRESH_HUMAN_HELPER_LANGUAGE_RESEARCH = PASS
FRESH_AI_SOFTWARE_HELPER_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
CURRENT_BRIDGE_HEAD = VERIFIED
EXISTING_JOB_CONFLICT = NONE
WORK_TRIGGER = NOT MET
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

This artifact releases **only one local start**. It does not release `submitN`.

## 13. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r06-20260917","queries":["помощник селлера маркетплейсов"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local-only creation with one `PENDING` item. Actual returned envelope is authority.
