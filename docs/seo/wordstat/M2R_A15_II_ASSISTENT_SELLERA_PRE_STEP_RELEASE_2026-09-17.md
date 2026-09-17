# M2R-A15 pre-step research and query release — `ии ассистент селлера`

Date: 2026-09-17.
Stage: `M2R — AI/software seller-helper intent isolation`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A14 `помощник селлера`: CLOSED / totalCount 73 / mixed human-vs-software intent.
- A14 direct rows include explicit hiring (`помощник селлера вакансии` = 13) and a named software/support product (`СИТ — помощник селлера` = 6).
- A14 associations include broad AI-helper language (`ai ассистент` = 5351; `ии ассистент для бизнеса` = 474) but not seller-specific enough to count directly.
- F4 daily seller work/help remains open because broad helper language is mixed.
- F2 own-AI / AI-tool demand also remains open and partially overlaps this step.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A15`

`QUERY_TEXT = ии ассистент селлера`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Isolate the **software/AI helper** portion of seller-assistant demand from the human-hiring ambiguity measured in A14.

Need to discover whether users naturally search for:

- AI assistant for seller work;
- AI analyst/helper for marketplace cabinet data;
- sales/profit/advertising/report help;
- card/content help;
- procedural/knowledge help;
- Wildberries/Ozon-specific AI assistants;
- proprietary assistant products/brands;
- AI agents/MCP/LLM connection language;
- courses/prompts/generic AI noise;
- human assistant/hiring leakage despite the AI qualifier.

## 4. Why this query follows A14

A14 proved the unqualified helper root is mixed:

- `помощник селлера` = 73;
- `помощник селлера вакансии` = 13;
- `сит помощник селлера` = 6 and externally verified as a current app/service with AI consultant/support.

Therefore a software/AI-qualified query has direct information value: it tests whether seller-helper language survives after human hiring is filtered out.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract supports last-30-days phrase-containing/similar-query discovery and up to 2000 returned phrases.

Method consequence: use `ии ассистент селлера` as a seller-specific software-intent probe; persist the full provider response before interpretation.

### Current exact seller-AI-assistant language

CNews, 23.01.2026:

https://www.cnews.ru/news/line/2026-01-23_tochka_bank_zapustil_ii-assistenta

`Точка Банк` launched an `ИИ-Ассистент селлера` for Wildberries sellers. The described job includes reducing manual Excel analytics, producing a profit/loss-style report and recommendations.

InfoSell current product surface:

https://infosell.tech/dashboard/assistant

Uses the wording `AI-ассистент для селлера WB и Ozon` and describes marketplace analytics, AI recommendations/tasks, AI chat and card analysis.

MP Manager, 05.08.2026:

https://mpmgr.ru/blog/trends/mcp-ii-agenty-dlya-sellerov

Uses `ИИ-ассистент для селлера` in a model where Claude/Codex/OpenCode can be connected to Wildberries/Ozon/Yandex Market data via MCP. This is especially relevant because it demonstrates current market language close to the owner's corrected Octoport mechanism: external/user-selected AI connected to marketplace data rather than a proprietary model being the whole product.

ComNews, 01.07.2026:

https://www.comnews.ru/digital-economy/content/246125/2026-w27/1012/analitika-dlya-sellerov-marketpleysakh-stala-umnee

Describes an AI helper that collects seller-cabinet information and answers questions across sales, advertising and profit.

Additional current seller-helper products:

- https://snaplit.ru/
- https://selleru.ai/wildberries
- https://sally-seller.ru/

These establish live product/category language; they do not define Octoport's product truth.

## 6. Critical product-truth boundary

Searchers may expect a proprietary AI assistant. Octoport is different:

`user-selected AI -> Octoport -> authorized marketplace data/tools -> same AI performs seller work`.

Therefore:

- proprietary AI-assistant products are competitors/adjacent category evidence;
- the query can still represent relevant demand because it expresses the desired job/outcome;
- do not rewrite Octoport as `our AI assistant` or claim that Octoport itself is the AI;
- later SERP/page messaging must explain the mechanism difference clearly.

## 7. Source -> method trace

| Question | Source | A15 use | Boundary |
|---|---|---|---|
| Can GetTop isolate AI-helper phrase variants? | Yandex Wordstat.GetTop | max-depth seller-AI-assistant discovery | demand/language only, not page proof |
| Is the exact `ИИ-Ассистент селлера` language live? | CNews/Tochka 2026 | justify exact query | third-party product != Octoport truth |
| Are seller AI assistants used for analytics/cards/tasks? | InfoSell / ComNews | retain task buckets | competitor capabilities != Octoport claims |
| Is user-selected/external AI connected to marketplace data a live pattern? | MP Manager 2026 | validate adjacent mechanism language | do not assume its architecture/claims equal Octoport |

## 8. Information-gain contract

A15 must add information beyond A14 by:

1. isolating software/AI intent from human hiring;
2. discovering seller tasks attached to AI-assistant wording;
3. detecting analytics/report/profit/ad/card/knowledge subjobs;
4. identifying marketplace-specific Ozon/WB variants;
5. detecting AI-agent/MCP/external-LLM connection language;
6. identifying proprietary assistant brands/tools;
7. measuring whether human-hiring leakage persists after the AI qualifier;
8. deciding whether F4 daily seller work/help is represented well enough or needs a separate cabinet-help/procedural query.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- AI_SELLER_ASSISTANT_CORE;
- USER_SELECTED_AI_CONNECTION;
- AI_AGENT_MCP_LLM;
- ANALYTICS_REPORT_HELP;
- SALES_PROFIT_HELP;
- ADVERTISING_HELP;
- PRODUCT_CARD_CONTENT_HELP;
- PROCEDURAL_KNOWLEDGE_HELP;
- MARKETPLACE_SPECIFIC;
- BRAND_PRODUCT_NAV;
- HUMAN_HIRING_LEAKAGE;
- COURSE_PROMPT_EDUCATION;
- GENERIC_AI_NOISE;
- HOLD.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert totalCount-only to zero. A weak exact root would mean the market uses alternative wording such as `ии помощник`, `ии аналитик`, `ии агент` or marketplace-specific names; it would not erase the seller-helper task.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 10. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `ии ассистент селлера`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the quality-first owner rule. Cost is not a decision gate.

## 11. Stop / reopen

After full persistence/readback/analysis:

- if A15 produces meaningful software/helper language, classify concrete seller-task branches and avoid redundant AI-assistant synonyms;
- if A15 is weak/non-expansive, do not chase synonyms blindly; select the next query from a named unresolved gap, likely procedural cabinet help or own-LLM connection;
- no page decision from raw counts;
- later SERP verification must determine whether `ИИ ассистент селлера` is a commercial acquisition entrance and how to explain Octoport's mechanism difference.

## 12. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A15_II_ASSISTENT_SELLERA_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 13. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

The accumulated M2R corpus is substantial across analytics, reports, finance, advertising and helper language. After A15 plus one or two remaining corrected-product families, proactive Work reconciliation should be triggered if it materially improves full-volume deduplication, intent classification, boundary QA and discovery-gap checks. Resource economy is not a reason to defer it.

## 14. Downstream decision

A15 does not create a page. It isolates the AI/software seller-helper intent and determines whether daily-work/help and own-AI connection need separate further acquisition before collection freeze.

## 15. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A14 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current exact market-language support | 10.0 |
| Human-vs-software separation | 10.0 |
| Product-truth alignment | 10.0 |
| Proprietary-AI vs Octoport distinction | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 16. Release verdict

```text
M2R_A15_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A15 = 0
QUERY = ии ассистент селлера
```
