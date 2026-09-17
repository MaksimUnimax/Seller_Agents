# M2R-A14 pre-step research and query release — `помощник селлера`

Date: 2026-09-17.
Stage: `M2R — daily seller work/help discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee itself. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A01 broad analytics: CLOSED / high information gain.
- A03-A05 reports: CLOSED / generic report wording saturated enough and accounting-heavy.
- A06-A09 finance/profit: CLOSED / concrete seller jobs represented.
- A10-A13 advertising: CLOSED / Wordstat discovery saturated enough; category/metric roots live but non-expansive; later SERP verification required.
- Owner-corrected family `F4 daily marketplace work/help` remains weakly represented.
- `F2 own-LLM connection`, `F5 card operations`, `F7 search/niche`, `F8 knowledge/help` also remain open after F4.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A14`

`QUERY_TEXT = помощник селлера`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Discover how users express the need for **ongoing help with seller work / marketplace cabinet tasks** without forcing the terms `ИИ`, `аналитика`, `агент` or a specific marketplace.

The exact phrase is intentionally broad because it may split into several distinct intents:

- software / AI seller helper;
- human assistant / vacancy / hiring;
- marketplace manager helper;
- operational cabinet help;
- analytics/report helper;
- product-card/content helper;
- advertising helper;
- training/course/how-to help;
- seller support/help-center intent;
- unrelated noise.

The goal is not to assume that `помощник селлера` belongs to Octoport. The goal is to measure its real intent composition.

## 4. Why this family matters

The owner's corrected product map explicitly includes people who need broader help working with a marketplace cabinet. Octoport's value proposition is not limited to a named analytics category: the user's chosen AI can become a working helper for seller tasks when authorized marketplace data/tools and current procedural knowledge are available.

Existing M2/M3 evidence is strong for `AI agent` language but weak for ordinary day-to-day helper language. Therefore a non-AI helper seed has orthogonal information value.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract supports last-30-days phrase-containing/similar-query discovery and up to 2000 returned phrases.

Method consequence: use the broad helper phrase as intent-discovery evidence only; persist full provider output before classification.

### Wildberries official/current helper language

Source:

https://seller.wildberries.ru/instructions/ru/ru/material/wbot-analytics-in-the-app

Current Wildberries seller help calls its service `Помощник`. The current service can:

- answer questions about product indicators/analytics;
- answer questions about working with the WB Partners seller portal;
- provide an AI chat in free form;
- form answers from available analytical reports and help-center materials;
- provide product data and monitoring scenarios.

This is direct evidence that `helper/assistant for seller work` is a real product/job concept, not an invented SEO category.

### Current market AI-helper language

Source:

https://www.cnews.ru/news/line/2026-02-11_insales_zapustila_ii-analitika

Published 11.02.2026. inSales describes an AI analyst/helper for marketplace sellers that answers questions about sales, advertising and profit using seller-cabinet data across Wildberries/Ozon/Yandex Market.

Source:

https://sberbusiness.live/publications/nejroseti-dlya-marketplejsov-podborka

Published 09.06.2026. Current seller-market content frames AI tools as helpers for many marketplace tasks, from cards to analytics.

### Human-role ambiguity — critical boundary

Current 2026 pages also use the same lexical family for hiring people:

- https://www.fl.ru/projects/5506151/nujen-biznes---assistent-dlya-sellera-wb.html — human business assistant for WB seller operations;
- https://legendbms.ru/blog/assistent-sellera-obyazannosti — human `ассистент селлера` handling daily operational routine;
- https://legendbms.ru/blog/assistent-sellera-kak-nanyat-i-gde-iskat — hiring a human assistant for cards, supplies, reviews and cabinet work.

This ambiguity is exactly why A14 must be measured instead of assuming commercial software intent.

## 6. Source -> method trace

| Question | Source | A14 use | Boundary |
|---|---|---|---|
| Can GetTop discover helper-language variants? | Yandex Wordstat.GetTop | max-depth broad helper discovery | demand/language only, not page proof |
| Is `Помощник` a real current seller-product concept? | WB official current helper docs | retain software/AI/cabinet-help branches | WB product != Octoport product claim |
| Is AI helper language live in the marketplace market? | inSales/CNews, SberBusiness 2026 | justify tool/AI-helper buckets | market/editorial language != final target-page authority |
| Is the same language used for human hiring? | current FL.ru / Legend BMS | explicit contamination/control bucket | job-seeker/hiring demand must not inflate Octoport core |

## 7. Information-gain contract

A14 must add information by:

1. measuring the ordinary non-AI helper phrase family;
2. separating human-hiring intent from software/AI-helper intent;
3. discovering concrete daily seller tasks attached to helper language;
4. detecting analytics/report/card/advertising/support subjobs;
5. identifying cabinet-help / procedural-question language;
6. detecting course/training/support-center noise;
7. determining whether a later `ии помощник селлера` probe is needed to isolate software intent;
8. determining whether daily seller work/help deserves later representative SERP verification.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Review every direct row and materially useful association into provisional buckets:

- SOFTWARE_AI_HELPER;
- HUMAN_ASSISTANT_HIRING;
- MARKETPLACE_MANAGER_ROLE;
- DAILY_CABINET_OPERATIONS;
- ANALYTICS_REPORT_HELP;
- PRODUCT_CARD_CONTENT_HELP;
- ADVERTISING_HELP;
- PROCEDURAL_KNOWLEDGE_HELP;
- SUPPORT_HELP_CENTER;
- COURSE_EDUCATION;
- SERVICE_AGENCY;
- MARKETPLACE_SPECIFIC;
- NOISE;
- HOLD.

Human-role/hiring rows are real demand but must not be counted as Octoport core merely because the word `помощник` matches the product metaphor.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert to zero. A weak root would increase the value of evidence-backed alternatives such as `ии помощник селлера` or concrete cabinet-help phrases.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `помощник селлера`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- if human hiring dominates, do not discard the family; pivot to a software/AI-qualified helper query only if it answers the named software-intent gap;
- if software/helper tasks are materially present, expand only concrete subjobs that add information;
- do not infer page count from phrase count;
- later SERP verification must determine whether helper language deserves a commercial Octoport landing or only supporting semantics.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A14_POMOSHNIK_SELLERA_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

The accumulated M2R corpus is already substantial. After F4 and at least one of F2/F5/F7/F8 are collected, proactive Work reconciliation should be strongly considered for full-volume cross-family deduplication, semantic QA, boundary checks and discovery-gap analysis. Resource economy is not a reason to defer it.

## 13. Downstream decision

A14 does not create a page. It measures the daily seller-help language and the critical human-vs-software intent split, then determines whether a more qualified helper query is needed.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-helper support | 10.0 |
| Current AI-helper market support | 10.0 |
| Human-role ambiguity control | 10.0 |
| Product-truth alignment | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A14_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A14 = 0
QUERY = помощник селлера
```
