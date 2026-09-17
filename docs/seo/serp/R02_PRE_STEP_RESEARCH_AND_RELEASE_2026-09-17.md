# R02 pre-step research and bounded release — `chatgpt для ozon`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / post-R01 F2 generic-mechanism closure`.  
Status: **PREPARED / PASS CANDIDATE / OWNER-FACING SOURCE DISCLOSURE REQUIRED BEFORE FIRST START**.

## 1. Current cursor

Current accepted M3 evidence state:

```text
M2R = ACCEPTED WITH MAIN CHAT CORRECTIONS
S01 = CLOSED / 20
S02 = CLOSED / 20
S03 = CLOSED / 20
R01 = CLOSED / 20
R01_GENERIC_F2_MECHANISM = CONFIRMED
R01_PRIMARY_SERP_CLASS = MIXED_CONNECTION_SERP
R01_EXACT_TARGET_HEAD = STRONG
R01_WHOLE_SERP_CONTAMINATION = MATERIAL
R02 = NEXT CANDIDATE
R03 = BLOCKED BEHIND R02
M7 = BLOCKED
M8 = BLOCKED
```

Current query authority: `M3_QUERY_MATRIX_2026-09-17.md`.

## 2. Product-truth boundary

Canonical mechanism:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

R02 must not rewrite Octoport as an Ozon-native AI, proprietary Octoport LLM or autonomous Ozon operator.

Launch remains read/analyze/explain/prepare. Ranking pages that promise card/price/bid/order mutations are market evidence only and cannot widen Octoport launch claims.

## 3. Query identity

```text
QUERY_ID = R02
QUERY_TEXT = chatgpt для ozon
FAMILY = F2
JOB_ID_PLANNED = octoport-serp-r02-20260917
RELATION = Ozon-specific control against generic R01; paired with R03 Wildberries
```

## 4. Exact open decision

When the marketplace is named explicitly as Ozon, does current Yandex Search resolve `chatgpt для ozon` primarily toward:

- direct connection of ChatGPT/external AI to Ozon seller data/cabinet/API;
- marketplace-specific AI-agent/integration products;
- generic ChatGPT advice/prompts for Ozon sellers;
- product-card/content generation;
- manual file/Excel analysis;
- seller analytics/report access;
- unrelated buyer/general ChatGPT noise?

And, compared with generic R01, does Ozon naming materially sharpen the F2 search surface enough to support marketplace-specific depth in later clustering/page-ownership work?

This query does not create a page or route.

## 5. Why R01 does not close R02

R01 `подключить chatgpt к маркетплейсу` closed with 20/20 reviewed rows:

```text
DIRECT_TARGET_CONNECTION = 2/20
ADJACENT_INTEGRATION_MECHANISM = 4/20
GENERAL_MARKETPLACE_CHATGPT = 4/20
CARD_CONTENT_GENERATION = 7/20
BROAD_AUTOMATION_BOTS = 1/20
NOISE_OTHER_INTENT = 2/20
```

The direct target pages occupy ranks 1-2 and direct+adjacent integration mechanisms occupy 6/10 of the first ten positions, but the whole top-20 remains materially mixed.

Thus R01 proves that generic own-AI connection is search-real but does not show whether `Ozon` naming sharpens intent toward seller data/API/integration or toward generic Ozon ChatGPT use.

## 6. Why prior S02 does not make R02 redundant

S02 `ии агент для озон` is F1/category wording, not F2/own-AI wording.

Accepted S02 evidence is strongly Ozon-specific and seller/API/data oriented. The S02-vs-S03 paired analysis found 11/20 clearly marketplace-specific results in each SERP while retaining a shared dual-marketplace core.

R02 asks a different question: whether the user's existing ChatGPT is itself the search anchor and what Ozon-specific job users expect from it.

Therefore:

```text
R02_REDUNDANT_WITH_S02 = NO
R02_REDUNDANT_WITH_R01 = NO
R02_INFORMATION_GAIN = HIGH
```

## 7. Fresh external research — 2026-09-17

### R02-Y1 — current Yandex WebSearchAsync contract

Official source:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Current docs confirm the asynchronous search request supports the exact comparison controls already used by S01-S03/R01: query text, search type, family mode, page, typo mode, relevance sort/order, flat grouping, groups per page, docs per group, region, localization and response format.

Method use: preserve the same RU / region 225 / page 0 / flat top-20 / one doc per group / moderate / typo-off / relevance-desc settings. Only query/job identity changes.

Boundary: provider schema is not Bridge implementation proof.

### R02-Y2 — current deferred operation lifecycle

Official source:

`https://aistudio.yandex.ru/en/docs/search-api/operations/web-search`

Current docs confirm deferred search returns an operation object and the response becomes available when execution is complete.

Method use: exactly-once submit, retain operation identity, bounded collect, no blind resubmission, pending is not zero/failure.

### R02-M1 — current Ozon+ChatGPT connection language

Current page:

`https://api-master.ru/blog/how-to-connect-chatgpt-to-ozon-wb`

The current 2026 page explicitly frames Ozon/WB marketplace API data -> prepared API/analytics layer -> ChatGPT Actions/MCP -> seller questions over real store data. It names Ozon orders, postings, transactions, advertising and stock/history examples.

Method use: retain direct-connection/API/Actions/MCP/data-analysis buckets when coding R02.

Boundary: its data architecture, storage model and mutation actions are competitor claims, not Octoport truth.

### R02-M2 — current marketplace-specific Ozon connector language

Current JAFO MCP page:

`https://jafo.ru/product/mcp`

The page currently gives marketplace-specific setup for Ozon under Seller API and names `Client-Id` + `Api-Key`; Performance access is presented separately/optionally for advertising visibility. It frames external clients/assistants as working through the connected marketplace account.

Method use: preserve Ozon-specific Seller API/credential/data-access/integration wording as a result-coding dimension.

Boundary: JAFO capability scope does not establish Octoport capability parity.

### R02-M3 — current generic/Ozon ChatGPT contamination control

Current Ozon seller communication visible through Ozon Marketplace's official Telegram surface discusses using ChatGPT prompts for seller business tasks, including product-card/marketing examples, without implying direct seller-data connection.

Source:

`https://t.me/s/ozonmarketplace/2365`

Method use: distinguish `ChatGPT used by an Ozon seller` from `ChatGPT connected to Ozon seller data/API`.

Boundary: official educational use of ChatGPT does not prove an official Ozon-to-ChatGPT connector.

## 8. Source -> method trace

| Question | Evidence | R02 use | Boundary |
|---|---|---|---|
| Is current Yandex async request shape stable? | Yandex WebSearchAsync docs | preserve S01-R01 request controls | docs != Bridge proof |
| How is deferred completion represented? | Yandex async lifecycle docs | exactly-once operation handling | pending != zero/failure |
| Is Ozon-to-external-AI connection current market language? | API Master + JAFO current pages | code direct API/MCP/Actions/connector results separately | competitor claims != Octoport truth |
| Is generic ChatGPT-for-Ozon content also current? | official Ozon seller communication | contamination/control bucket | no native connector inference |
| Why not infer from R01? | R01 closed 20-row analysis | test whether explicit Ozon sharpens the surface | R01 query != R02 query |
| Why not infer from S02? | S02/S03 accepted F1 analysis | separate `agent` category from own-ChatGPT framing | F1 != F2 |

## 9. Full-result coding plan

For every normalized organic result capture/classify:

```text
rank
url/domain/title/snippet/modtime
page type = product/landing/integration/docs/guide/article/video/official/noise
marketplace scope = Ozon-specific / dual / generic / other-marketplace
AI scope = ChatGPT-specific / external-LLM / proprietary-agent / generic-AI
mechanism = direct API / MCP / Actions / connector/app / manual file-upload / prompts-only / unknown
seller-data scope = orders/stocks/finance/ads/reports/cards/reviews/etc
seller-owned data vs external-market intelligence
read-only/data-answering vs mutation/automation promise
direct connection vs generic use/content generation
recurrence versus R01/S02/S03
new vocabulary/gap signal
Octoport-fit boundary
```

Primary non-overlapping result classes planned:

- `DIRECT_OZON_CHATGPT_CONNECTION`;
- `OZON_AI_AGENT_OR_INTEGRATION`;
- `GENERIC_CHATGPT_FOR_OZON_SELLER`;
- `OZON_CARD_CONTENT_GENERATION`;
- `MANUAL_DATA_ANALYSIS`;
- `ADJACENT_OR_OTHER_MARKETPLACE`;
- `MUTATION_AUTOMATION_BOUNDARY`;
- `NOISE_OTHER_INTENT`.

Final coding will follow evidence rather than forcing every planned class to occur.

## 10. Paired comparison contract

R02 must be compared with:

- R01 generic F2 control immediately after R02;
- S02 F1 Ozon agent evidence for category-vs-own-AI distinction;
- R03 only after R03 itself is collected and closed.

R02 alone cannot finalize generic-vs-marketplace page ownership. After R03, calculate exact URL/domain overlap and marketplace-specific orientation using the same method as S02/S03.

## 11. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export all normalized rows; classify all rows; compare with R01/S02; decide whether R03 still has information gain (expected yes unless R02 creates an explicit stop reason).

### VALID ZERO

Weakens this exact `chatgpt для ozon` formulation only. It does not erase F2 or accepted Ozon AI-agent/category evidence. Preserve zero and evaluate R03 separately under its own evidence.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. Do not retry or create a second job blindly.

## 12. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = chatgpt для ozon
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
jobId = octoport-serp-r02-20260917
```

Same first-page bounded comparison surface as S01-S03/R01. No full-Search completeness claim.

## 13. Bridge capability — repository evidence, not provider docs

Accepted S01-S03/R01 Bridge evidence establishes:

```text
start = local job creation; expected request_executed:false/provider_calls:0
submitN count=1 = one provider submission when accepted
accepted operation identity persists
collectN may locally return NO_DUE_OPERATIONS without provider call
later provider-backed collect retrieves the same operation
exportPage is revision-bound
```

The exact one-query `start` schema is inherited from accepted R01 with only jobId/query changed.

## 14. Persistence contract

Planned lifecycle paths:

- `raw/R02_01_START_2026-09-17.md`;
- `analysis/R02_01_START_2026-09-17.md`;
- sequential submit/collect/export evidence after each gate;
- final raw export persisted losslessly with exact source hash/size and remote readback;
- final semantic analysis only after export persistence/readback PASS.

Every Bridge lifecycle response must be persisted and remote-read back before another provider action.

## 15. Work trigger

One bounded top-20 Search query remains safe for Main Chat full-row analysis.

```text
WORK_TRIGGER_FOR_R02 = NOT MET
```

Cross-query full-volume Work remains a later option when M3/M4/M5 corpus volume warrants it.

## 16. Hard gates

```text
M2R_MAIN_CHAT_RETURN_QA = PASS
CURRENT_M3_MATRIX = PASS
R01 = CLOSED
R01_FULL_RAW_PERSISTENCE = PASS
R01_FULL_20_ROW_ANALYSIS = PASS
R02_INFORMATION_GAIN = HIGH
FRESH_EXTERNAL_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
PROVIDER_CONTRACT = PASS
BRIDGE_CAPABILITY_RECONCILED = PASS
PERSISTENCE_CONTRACT = PASS
WORK_TRIGGER_EVALUATED = PASS
NO_PROVIDER_CALL_BEFORE_RELEASE = true
OWNER_FACING_SOURCE_DISCLOSURE = REQUIRED BEFORE FIRST START
```

This pre-step does not itself authorize submit/collect/export or R03.

## 17. Planned first action after disclosure

Exactly one local start may be activated after owner-facing source/method disclosure:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r02-20260917","queries":["chatgpt для ozon"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected from accepted Bridge behavior: local start only, `request_executed:false`, `provider_calls:0`, one `PENDING` item. The actual returned envelope remains authority.

## 18. Quality score

| Criterion | /10 |
|---|---:|
| Current cursor/authority | 10 |
| R01/S02 non-redundancy proof | 10 |
| Query-specific information gain | 10 |
| Fresh Yandex method research | 10 |
| Fresh Ozon-market language research | 10 |
| Product-truth restraint | 10 |
| Provider/Bridge separation | 10 |
| Full-result coding plan | 10 |
| Persistence/failure contract | 10 |
| Paired downstream decision value | 10 |

`QUALITY_TOTAL = 100/100`.

## 19. Plain-language conclusion

R01 proved that users/search engines recognize the job of connecting an existing ChatGPT/external AI to marketplace data, but generic wording is noisy. S02 proved that naming Ozon strongly sharpens the AI-agent category. R02 is therefore the necessary test of whether **own-ChatGPT + Ozon** also sharpens toward real seller-data/API/integration intent, or instead collapses into prompts/cards/general advice. That decision cannot be inferred safely from either R01 or S02 alone.
