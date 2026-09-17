# R03 pre-step research and bounded release — `chatgpt для wildberries`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F2 paired marketplace check after R02 closure`.  
Status: **PREPARED / PASS CANDIDATE / OWNER-FACING SOURCE DISCLOSURE REQUIRED BEFORE FIRST START**.

## 1. Current cursor

Accepted evidence state:

```text
M2R = ACCEPTED WITH MAIN CHAT CORRECTIONS
S01 = CLOSED / 20
S02 = CLOSED / 20
S03 = CLOSED / 20
R01 = CLOSED / 20
R02 = CLOSED / 20
R01_GENERIC_F2_MECHANISM = CONFIRMED
R01_PRIMARY_SERP_CLASS = MIXED_CONNECTION_SERP
R02_PRIMARY_SERP_CLASS = MIXED_OZON_CHATGPT_SERP_WITH_STRONG_CONNECTION_HEAD
R02_OZON_SHARPEN_VS_R01 = YES
R02_FINAL_PAGE_OWNERSHIP = UNRESOLVED_BY_DESIGN
R03 = NEXT CANDIDATE
M7 = BLOCKED
M8 = BLOCKED
```

Current M3 authority: `M3_QUERY_MATRIX_2026-09-17.md`.

R03 is explicitly paired with R02 and compared with R01. The accepted matrix says its open decision is Wildberries-specific own-AI intent and difference from Ozon.

## 2. Product-truth boundary

Canonical Octoport mechanism remains:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

R03 must not rewrite Octoport as a Wildberries-native AI, proprietary Octoport LLM, or autonomous mutation agent.

Launch remains read/analyze/explain/prepare. Search results or competitor pages that promise price/card/bid/order mutations are market evidence only and cannot widen Octoport launch claims.

## 3. Query identity

```text
QUERY_ID = R03
QUERY_TEXT = chatgpt для wildberries
FAMILY = F2
JOB_ID_PLANNED = octoport-serp-r03-20260917
RELATION = Wildberries-specific paired control against R02; compared with generic R01
```

## 4. Exact open decision

When Wildberries is named explicitly, does current Yandex Search resolve `chatgpt для wildberries` primarily toward:

- direct connection of ChatGPT/external AI to Wildberries seller data/cabinet/API/token;
- Wildberries-specific MCP/connector/integration products;
- Wildberries-specific AI-agent products;
- manual Excel/report analysis in ChatGPT;
- generic prompts/help for WB sellers;
- product-card/content generation;
- unrelated buyer/subscription/payment noise?

And, compared with R02 `chatgpt для ozon`, is F2 approximately symmetric across Ozon/Wildberries or does one marketplace create a materially different mechanism/page-type mix?

This query does not create a page, route or final cluster.

## 5. Why R03 remains necessary after R02

R02 closed with:

```text
DIRECT_OZON_CHATGPT_CONNECTION = 4/20
OZON_INTEGRATION_OR_AGENT = 2/20
MANUAL_DATA_ANALYSIS = 2/20
GENERIC_CHATGPT_FOR_OZON_SELLER = 2/20
OZON_CARD_CONTENT_GENERATION = 7/20
BROAD_AUTOMATION_BOUNDARY = 1/20
NOISE_OTHER_INTENT = 2/20
```

R02 head was strongly sharpened:

```text
TOP_3_DIRECT_CONNECTION = 3/3
TOP_10_DIRECT_CONNECTION_OR_OZON_INTEGRATION = 6/10
TOP_10_MANUAL_ANALYSIS = 2/10
TOP_10_CARD_CONTENT = 1/10
```

But R02 was not Ozon-only:

```text
CLEARLY_OZON_SPECIFIC_SELLER_RELEVANT = 6/20
DUAL_WB_OZON_SELLER_RELEVANT = 10/20
BROADER_MULTI_MARKETPLACE = 2/20
LEXICAL_NOISE = 2/20
```

Therefore R02 cannot answer whether the large dual-marketplace core is symmetric when Wildberries becomes the query anchor.

Historical F1 S02/S03 evidence also cannot substitute for R03: the agent-category pair was marketplace-specific on both sides (`11/20` clearly Ozon-specific and `11/20` clearly WB-specific) but F1 agent wording is not equivalent to F2 own-ChatGPT wording.

```text
R03_REDUNDANT_WITH_R02 = NO
R03_REDUNDANT_WITH_HISTORICAL_S03 = NO
R03_INFORMATION_GAIN = HIGH_PAIRED
```

## 6. Fresh external research — 2026-09-17

### R03-Y1 — current Yandex WebSearchAsync request contract

Official Yandex AI Studio source:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Current documentation confirms the asynchronous Search request controls needed for comparability: query, search type, family mode, page, typo mode, sorting, grouping, groups per page and docs per group.

Method use: preserve exactly the same first-page RU / region 225 / flat top-20 / one doc per group / moderate / typo-off / relevance-desc settings used by S01-S03, R01 and R02. Only query/job identity changes.

Boundary: provider documentation does not prove Bridge implementation behavior.

### R03-Y2 — current deferred operation lifecycle

Official Yandex AI Studio source:

`https://aistudio.yandex.ru/en/docs/search-api/operations/web-search`

Current documentation confirms deferred search returns an Operation ID, which must be retained and polled until completion; `done:true` with a response indicates successful completion.

Method use: exactly-once submit, preserve accepted operation identity, bounded collect, no blind resubmission, and never interpret pending/not-due as zero demand.

### R03-WB1 — official WB API token integration model

Official Wildberries developer source, updated 2026-04-03:

`https://dev.wildberries.ru/knowledge-base/articles/019d49a0-f9f7-79a4-b5ee-df5dabe9cff4`

Wildberries explicitly documents API-token integration as a standard way to connect third-party services or seller-owned systems to a Wildberries store. The seller creates a token in WB Partners and chooses data categories/access permissions.

Method use: when R03 pages mention WB token/API access, treat that as a capability-shaped mechanism grounded in the official marketplace integration model rather than as invented competitor jargon.

Boundary: official WB token support does not prove a native ChatGPT integration or any particular Octoport feature.

### R03-WB2 — official Wildberries read-only and category permissions

Official WB API documentation:

`https://dev.wildberries.ru/docs/openapi/api-information`

and current authorization guidance:

`https://dev.wildberries.ru/knowledge-base/articles/019d49a1-0d73-71e9-be3e-b2c44567470c/sistema-avtorizatsii-wb-api`

Current WB documentation confirms:

- token access is divided by API categories;
- categories include Content, Analytics, Marketplace, Statistics, Promotion and others;
- token access level can be `Read Only` or `Read and Write`;
- API access is sent through an Authorization token;
- permissions should be limited to necessary categories.

Method use: code read-only/data-access wording separately from mutation/automation promises and retain category-specific vocabulary where it appears.

Product boundary: Octoport launch remains read-only regardless of broader WB API mutation capability.

### R03-M1 — current market language: own ChatGPT/Claude connected directly to WB/Ozon

Current 2026 market page:

`https://jafo.ru/blog/podklyuchit-claude-chatgpt-k-wildberries-ozon`

Published 2026-09-06. It explicitly contrasts repeated Excel uploads with connecting a user's existing Claude/ChatGPT directly to Wildberries/Ozon seller cabinets and current store data.

Method use: preserve `connect own assistant`, seller cabinet, token/API, current orders/stocks/reviews/advertising and manual-export-vs-direct-connection language as F2 result dimensions.

Boundary: JAFO mutation/automation claims are competitor claims only and do not widen Octoport launch scope.

### R03-M2 — current MCP/connector terminology

Current JAFO MCP page:

`https://jafo.ru/product/mcp`

The page currently uses explicit external-assistant connector/MCP wording for Claude/ChatGPT and marketplace cabinets, and describes Wildberries token setup alongside read-only versus action permissions.

Method use: retain MCP/connector terminology if it appears in live Search.

Boundary: competitor implementation, pricing, supported clients and mutation features are not Octoport authority.

## 7. Source -> method trace

| Question | Evidence | R03 method use | Boundary |
|---|---|---|---|
| What Search request shape remains current? | Yandex WebSearchAsync docs | preserve R01/R02 comparison settings | provider docs != Bridge proof |
| How should async completion be treated? | Yandex deferred lifecycle docs | exactly-once operation handling | pending/not-due != zero |
| Is third-party access to WB store data an official mechanism? | official WB token docs | distinguish real API/token integration from vague AI marketing | does not prove native ChatGPT connector |
| Can read-only be distinguished from mutation? | official WB authorization/category docs | explicit read-only vs write boundary | Octoport remains read-only at launch |
| Is own-ChatGPT-to-WB current market language? | current JAFO 2026 pages | retain connector/MCP/direct-store-data vocabulary | competitor claims != product truth |
| Why paired R03 now? | accepted R02 analysis + M3 matrix | measure Ozon/WB F2 symmetry/asymmetry | no final page decision |

## 8. Full-result coding plan

For every normalized organic result capture/classify:

```text
rank
url/domain/title/snippet/modtime
page type = product/landing/integration/docs/guide/article/video/official/noise
marketplace scope = WB-specific / dual / generic / other-marketplace
AI scope = ChatGPT-specific / external-LLM / proprietary-agent / generic-AI
mechanism = direct API/token / MCP / connector/app / manual file-upload / prompts-only / unknown
seller-data scope = orders/stocks/finance/ads/reports/cards/reviews/search/etc
read-only/data-answering vs mutation/automation promise
direct connection vs generic use/content generation
recurrence versus R01/R02/S03
new vocabulary/gap signal
Octoport-fit boundary
```

Planned primary result classes:

- `DIRECT_WB_CHATGPT_CONNECTION`;
- `WB_INTEGRATION_OR_AGENT`;
- `MANUAL_DATA_ANALYSIS`;
- `GENERIC_CHATGPT_FOR_WB_SELLER`;
- `WB_CARD_CONTENT_GENERATION`;
- `BROAD_AUTOMATION_BOUNDARY`;
- `NOISE_OTHER_INTENT`.

Final coding follows evidence; categories are not quotas.

## 9. Paired comparison contract after R03

After R03 closes, compare R02 and R03 using the same controls:

```text
exact URL overlap + Jaccard
domain overlap + Jaccard
top-5/top-10 overlap
marketplace-specific vs dual/generic orientation
connection/integration share
manual-analysis share
card/content contamination
lexical noise
recurring Search surfaces
Ozon-only and WB-only mechanism vocabulary
```

Paired outcome vocabulary:

`F2_SYMMETRIC_SHARED_CORE | F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH | F2_MATERIALLY_ASYMMETRIC | HOLD`.

This paired verdict still does not create pages. Final ownership remains blocked until collection freeze and clustering.

## 10. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export all normalized rows, analyze all 20, run R02↔R03 paired comparison, record the F2 paired verdict, then decide whether F2 is information-saturated enough to move to R04.

### VALID ZERO

Weakens this exact Wildberries formulation only. It does not erase F2, accepted generic R01 evidence, historical WB agent evidence, or official WB API capability. Preserve zero and compare cautiously with R02.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry or second job.

## 11. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = chatgpt для wildberries
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
jobId = octoport-serp-r03-20260917
```

This is the same bounded first-page top-20 comparison surface used by R01/R02. It is not a claim of full Search coverage.

## 12. Bridge capability — repository evidence, separate from provider docs

Accepted S01-S03/R01/R02 evidence establishes:

```text
start = local job creation; request_executed:false/provider_calls:0 in accepted pattern
submitN count=1 = exactly one provider submission when accepted
accepted operation identity persists
collectN may return local NO_DUE_OPERATIONS without provider call
later provider-backed collect retrieves the same operation
exportPage is revision-bound
```

R03 will inherit the exact accepted one-query start schema with only query/job identity changed.

## 13. Persistence contract

Planned paths begin with:

- `raw/R03_01_START_2026-09-17.md`;
- `analysis/R03_01_START_2026-09-17.md`;
- sequential submit/collect evidence after each gate;
- final export persisted losslessly with exact source size/hash and remote part-SHA readback if required;
- full semantic analysis only after raw export persistence/readback PASS;
- paired R02↔R03 comparison after R03 closure.

Every lifecycle response must be persisted/read back before the next provider action.

## 14. Work trigger

R03 is one bounded top-20 query and is safe for complete Main Chat analysis.

```text
WORK_TRIGGER_FOR_R03 = NOT MET
```

No sampling is allowed; all returned rows will be analyzed.

## 15. Existing-job conflict check

Immediately before this pre-step, repository readback for:

`docs/seo/serp/raw/R03_01_START_2026-09-17.md`

returned `404 Not Found`.

```text
R03_EXISTING_DURABLE_START_ARTIFACT = NONE
```

This does not itself prove Bridge local state; the first actual start response remains authoritative.

## 16. Hard gates

```text
M2R_MAIN_CHAT_RETURN_QA = PASS
CURRENT_M3_MATRIX = PASS
R01 = CLOSED
R02 = CLOSED / FULL RAW PERSISTENCE + REMOTE READBACK + FULL 20-ROW ANALYSIS PASS
R03_INFORMATION_GAIN = HIGH_PAIRED
FRESH_YANDEX_METHOD_RESEARCH = PASS
FRESH_OFFICIAL_WB_API_RESEARCH = PASS
CURRENT_MARKET_LANGUAGE_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
PROVIDER_CONTRACT = PASS
BRIDGE_CAPABILITY_RECONCILED = PASS
PERSISTENCE_CONTRACT = PASS
WORK_TRIGGER_EVALUATED = PASS
R03_EXISTING_DURABLE_START_ARTIFACT = NONE
NO_PROVIDER_CALL_BEFORE_RELEASE = true
OWNER_FACING_SOURCE_DISCLOSURE = REQUIRED BEFORE FIRST START
```

This artifact alone does not authorize submit/collect/export.

## 17. Planned first action after disclosure

Exactly one local start may be activated only after owner-facing source/method disclosure:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r03-20260917","queries":["chatgpt для wildberries"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted Bridge behavior: local start only, no provider call, one PENDING item. Actual returned envelope remains authority.

## 18. Plain-language conclusion

R02 proved that naming Ozon sharpens own-ChatGPT intent toward real connector/integration and seller-data use, but the SERP still has a large shared WB+Ozon core. Official Wildberries documentation independently proves a current third-party API/token/read-only integration model. R03 is therefore the necessary paired Search test: does `chatgpt для wildberries` show the same own-assistant connection structure, or a materially different WB-specific mix? Only after that pair is measured can F2 ordinary-Search collection be considered for saturation and movement to R04.
