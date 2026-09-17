# R01 pre-step research and bounded release — `подключить chatgpt к маркетплейсу`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / post-M2R rebaseline`.  
Status: **PREPARED / PASS CANDIDATE / OWNER-FACING SOURCE DISCLOSURE REQUIRED IN CURRENT CHAT BEFORE FIRST START**.

## 1. Whole-project goal and current cursor

Octoport SEO roadmap remains:

```text
product truth
-> durable Wordstat/Search/competitor/Alice evidence
-> M7 Collection Freeze
-> M8 semantic master
-> clustering
-> Search-vs-Alice reconciliation
-> page ownership/IA
-> page specs
-> technical SEO
-> implementation/live QA
-> measurement
```

Current state after Main Chat return QA:

```text
M0 = PASS
M1 = OPEN / source baseline partial pass
M2 historical B01+B02 = retained with accepted limitation
M2R A01-A19 = correction acquisition complete
M2R Work reconciliation = ACCEPTED WITH MAIN CHAT CORRECTIONS
S01 = CLOSED / 20
S02 = CLOSED / 20
S03 = CLOSED / 20
M3 = IN PROGRESS
M4 = OPEN / preliminary competitor registry only
M5 = NOT STARTED
M6 = BLOCKED
M7 = BLOCKED
M8+ = BLOCKED
```

Current M3 authority:

`M3_QUERY_MATRIX_2026-09-17.md`.

R01 is the first unresolved representative Search query after the M2R rebaseline.

## 2. Product-truth boundary

Canonical mechanism:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

R01 must not rewrite Octoport as a proprietary ChatGPT product or `our AI`.

Searchers may use ChatGPT wording because they want to connect the AI they already use to marketplace data. The purpose of R01 is to determine whether this differentiating mechanism has a coherent live Search surface and what vocabulary/page types Yandex currently associates with it.

Launch remains read/analyze/explain/prepare, not autonomous mutation/write-back.

## 3. Query identity

```text
QUERY_ID = R01
QUERY_TEXT = подключить chatgpt к маркетплейсу
FAMILY = F2
JOB_ID_PLANNED = octoport-serp-r01-20260917
```

## 4. Exact open decision

Does the generic own-AI connection job produce a coherent seller/marketplace SERP around:

- connecting ChatGPT/external AI to seller data;
- Seller API / MCP / app / connector / integration language;
- asking marketplace questions in ordinary language;
- seller analytics/report access from the AI dialogue;
- Wildberries/Ozon generic versus marketplace-specific solutions;
- product/service landings versus guides/tutorials/open-source integrations?

And does the generic query provide enough common mechanism evidence to treat R02/R03 as a paired marketplace-specific follow-up rather than three unrelated categories?

This query does not create a page and does not decide final IA.

## 5. Why current durable evidence is insufficient

Existing evidence says:

- historical `подключить ии к маркетплейсу` was a successful exact-empty Wordstat request, not numeric zero;
- `chatgpt для маркетплейсов` has observed Wordstat demand;
- `chatgpt для ozon` and `chatgpt для wildberries` were tested and have observed counts but little/no lexical expansion;
- S01-S03 show a search-visible AI-agent/API/data category close to the mechanism, but those queries ask for an `agent`, not explicitly for connecting the user's own ChatGPT;
- M2R reconciliation assigns F2 `PARTIAL_BUT_SERP_CAN_RESOLVE`.

Wordstat cannot answer whether Search intent is product/integration/tutorial, which terminology ranks, or whether the user's-own-AI mechanism is visible as a category.

Therefore R01 has distinct information gain and is not a redundant synonym query.

## 6. Applicable anti-regression rules

1. `SEED != FINAL KEYWORD != INTENT != CLUSTER != PAGE`.
2. `QUERY != PAGE`.
3. Search competitor is discovered from actual SERP, not selected business-rival names.
4. Product-label similarity does not establish product fit; inspect underlying user job.
5. Do not treat mutation-heavy competitors as proof Octoport launch supports mutations.
6. One Search result/page does not establish a stable recurring competitor.
7. Pending/deferred state is not failure/zero.
8. Accepted async operation is never blindly resubmitted.
9. Same Search settings as S01-S03 are required for comparable page-type/overlap evidence.
10. Every lifecycle response must be persisted and remote-read back before the next provider action.
11. Current Work return corrected old accounting, but no Work output itself authorizes provider execution without this per-query release.

## 7. Fresh external research — 2026-09-17

### R01-Y1 — Yandex WebSearchAsync current REST contract

Official provider source:

https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search

Current documentation confirms `WebSearchAsync.Search` and request controls including:

- query text;
- search type;
- family mode;
- page;
- typo mode;
- sort mode/order;
- grouping;
- groups per page / docs per group;
- region;
- response format.

Project use: preserve the same RU / region 225 / first-page / flat top-20 / moderate / typo-off / relevance settings already used for S01-S03.

Boundary: provider schema does not prove Bridge implementation behavior.

### R01-Y2 — Yandex deferred text-search lifecycle

Official provider source:

https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search

Current documentation confirms deferred/asynchronous text search via Yandex Search API and an operation-based lifecycle.

Project use: exactly-once submit, preserve the accepted operation identity, collect the same operation later, and never convert pending into zero demand.

Boundary: Bridge local start/submit/collect/export behavior is proven separately from actual repository evidence.

### R01-Y3 — Yandex Search API pricing

Official provider source:

https://aistudio.yandex.ru/en/docs/search-api/pricing

Current RUB example remains `₽30.5 / 1000` daytime deferred requests, or `₽0.0305` per request. Internal server/authentication errors are not billed.

Project use: `maxRequests=1` and `maxCostRub=0.0305` continue to protect exactly-one-submit execution. Cost is an operational guard, not a quality criterion.

### R01-M1 — current marketplace wording: ChatGPT connected to seller store

Current product documentation:

https://docs.marketaut.ru/2-quick-start/quick_start/

The current guide explicitly describes connecting a Wildberries store to ChatGPT, adding the marketplace API token, connecting the ChatGPT application, and then asking the AI questions about products in the seller store.

Project use: proves that `connect store -> ChatGPT -> seller questions` is live market/product language, not an invented Octoport SEO phrase.

Boundary: MarketAut capabilities and mutation scope do not become Octoport product truth.

### R01-M2 — current seller-market language: connect AI agent to marketplace data

Current 2026 article:

https://mpmgr.ru/blog/trends/mcp-ii-agenty-dlya-sellerov

Published 2026-08-05. It explicitly frames MCP as connecting external AI agents to Wildberries/Ozon/Yandex Market data and contrasts this with manually copying seller-cabinet data into ChatGPT/Claude.

Project use: supports `connection/integration/MCP/data access` vocabulary and the user job behind R01.

Boundary: its product architecture and supported actions are competitor/market evidence, not Octoport authority.

### R01-M3 — current open-source mechanism language

Current repository:

https://github.com/ilyautov/marketplaces-mcp-ru

The project describes connecting an AI assistant directly to seller accounts and retrieving sales/orders/stocks/prices/finance/reviews through marketplace APIs.

Project use: confirms a live technical/product category around external AI assistants connected to marketplace Seller APIs.

Boundary: open-source tooling is mechanism/category evidence, not evidence of Octoport feature parity.

### R01-O1 — current ChatGPT external-tool connection model

Official OpenAI source:

https://help.openai.com/ru-ru/articles/11487775

Current OpenAI help documents apps that connect ChatGPT to external tools/data and states that custom apps can be built using MCP.

Project use: supports the generic concept that users can connect ChatGPT to external data/tools; this helps interpret Search wording but does not prove any marketplace integration exists natively in ChatGPT.

Boundary: no claim that Ozon/WB are native ChatGPT connectors is made.

## 8. Source -> method trace

| Question | Evidence | R01 method use | Boundary |
|---|---|---|---|
| What exact Search request shape is current? | Yandex WebSearchAsync REST | reuse S01-S03 request settings | provider docs != Bridge proof |
| How should deferred lifecycle be treated? | Yandex deferred docs | exactly-once operation lifecycle | pending != failure/zero |
| What cost guard applies? | current Yandex pricing | one request, `0.0305 RUB` cap | cost does not determine evidence sufficiency |
| Is ChatGPT-to-marketplace connection live language? | MarketAut current docs | justify exact Search query and product/integration page-type buckets | competitor claims != Octoport truth |
| Is external-AI-to-seller-data integration a current category? | MP Manager 2026 + marketplaces-mcp-ru | retain MCP/API/connector/integration vocabulary | no feature-parity inference |
| Is external data/tool connection a current ChatGPT mechanism generally? | OpenAI current apps help | interpret connection/app/MCP results | no native WB/Ozon connector claim |

## 9. R01 full-result analysis plan

For every normalized organic result capture/classify:

```text
rank
url/domain/title/snippet
page type = product/landing/integration/docs/guide/article/open-source/comparison/official/noise
marketplace scope = generic / WB / Ozon / dual / multi
AI scope = ChatGPT-specific / external-LLM / proprietary-agent / generic-AI
mechanism language = API / MCP / connector / plugin/app / extension / browser automation / manual upload / unknown
seller-data tasks = analytics/reports/stocks/orders/finance/ads/cards/reviews/etc
read-only/data-answering vs mutation/automation promise
product/service vs tutorial intent
recurrence versus S01-S03 domains/pages
new lexical gap signal
Octoport-fit boundary
```

Primary decision after R01:

`COHERENT_OWN_LLM_CONNECTION_SERP | MIXED_CONNECTION_SERP | MOSTLY_GENERIC_TUTORIAL | MOSTLY_AGENT_CATEGORY | HOLD`.

No final page decision is allowed.

## 10. Information-gain / outcome contract

### SUCCESS_WITH_RESULTS

Persist/export all normalized rows. Determine page-type/mechanism mix and overlap with S01-S03. Use the result to decide whether R02/R03 remain required as a paired marketplace-specific check and which vocabulary to preserve for later clustering.

### SUCCESS_WITH_ZERO_RESULTS

A valid zero weakens this exact generic formulation only. It does not erase F2 or invalidate marketplace-specific ChatGPT phrases. R02/R03 remain separately decidable because they have historical observed demand.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / INCOMPLETE / UNKNOWN

No semantic conclusion. Preserve exact failure truth and stop. No blind retry.

## 11. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = подключить chatgpt к маркетплейсу
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
jobId = octoport-serp-r01-20260917
```

Result boundary: first-page top-20 normalized organic surface for representative intent/page-type/competitor analysis. It is not full Search coverage.

## 12. Bridge capability — separate from provider docs

Accepted repository evidence from S01-S03 establishes the current workflow:

```text
start -> local-only job creation, request_executed:false/provider_calls:0
submitN count=1 -> exactly one provider submission when accepted
accepted operation identity persists
collectN before due may be a local guard
later provider-backed collect retrieves the same operation
exportPage is revision-bound
```

The exact one-query local-start shape used by accepted S01/S03 is retained. R01 will use the same start schema and same Search parameters with only jobId/query/date changed.

No R01 job exists in current durable project evidence yet; the first allowed Bridge action is a local `start` after owner-facing disclosure of this release.

## 13. Persistence contract

Planned evidence paths:

- local start raw: `docs/seo/serp/raw/R01_01_START_2026-09-17.md`;
- start analysis/progress: `docs/seo/serp/analysis/R01_01_START_2026-09-17.md` and current progress update as needed;
- later submit/collect/export files use sequential R01 IDs and exact envelopes;
- final normalized export authority: `docs/seo/serp/exports/R01_PODKLYUCHIT_CHATGPT_K_MARKETPLEYSU_NORMALIZED_2026-09-17.json`.

Every lifecycle envelope must be persisted and remote-read back before the next action.

## 14. Work trigger

R01 is one bounded Search query with an expected top-20 normalized result set.

```text
WORK_TRIGGER_FOR_R01_PROVIDER_ORCHESTRATION = NOT MET
```

Main Chat can completely analyze R01. Re-evaluate Work only when cross-query/competitor corpus size makes full-volume comparison unsafe without truncation.

## 15. Hard gates

```text
M2R_MAIN_CHAT_RETURN_QA = PASS
CURRENT_M3_MATRIX = PASS
S01_S03_CURRENT_PROGRESS = PASS
FRESH_EXTERNAL_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
INFORMATION_GAIN_CONTRACT = PASS
CURRENT_PROVIDER_CONTRACT = PASS
BRIDGE_CAPABILITY_SEPARATELY_RECONCILED = PASS
WORK_TRIGGER_EVALUATED = PASS
R01_JOB_ID_UNIQUE_IN_CURRENT_EVIDENCE = PASS
NO_PROVIDER_CALL_BEFORE_RELEASE = true
OWNER_FACING_SOURCE_DISCLOSURE = REQUIRED IN CURRENT CHAT BEFORE FIRST START
```

No `submitN`, `collectN`, export, retry or next query is released by this artifact.

After local `start` response:

`complete envelope -> persist -> remote readback -> analyze -> only then decide submitN`.

## 16. Quality score

| Criterion | /10 |
|---|---:|
| Goal/output clarity | 10.0 |
| Post-M2R authority alignment | 10.0 |
| Fresh official provider research | 10.0 |
| Current market-language evidence | 10.0 |
| Product-truth discipline | 10.0 |
| Information-gain justification | 10.0 |
| Outcome/failure contract | 10.0 |
| Provider/Bridge separation | 10.0 |
| Persistence/reproducibility | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`  
`QUALITY_SCORE = 10.0/10`.

## 17. Plain-language conclusion

We already know Yandex has a real AI-agent category for marketplaces and marketplace-specific Ozon/WB variants. R01 asks a different question: when a seller wants to keep using ChatGPT and connect it to marketplace data, what does Yandex currently show — products/integrations, MCP/API guides, generic tutorials, or the same agent category?

That answer is needed before deciding how F2 should be represented in later Search/competitor/Alice work. The query is released for one local start only after the source/method disclosure is delivered to the owner in the current chat.
