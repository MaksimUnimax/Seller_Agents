# R12 — query-specific research and release

Date: 2026-09-17  
Stage: M3 / ordinary Yandex SERP  
Query ID: `R12`  
Query: `какой ии выбрать для маркетплейсов`  
Job ID: `octoport-serp-r12-20260917`

Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**

## 1. Objective

Measure the live Yandex intent behind selecting AI for marketplace seller work. R12 must distinguish generic LLM/model comparison from marketplace-native AI, specialized seller AI/tools, task-specific content/analytics/review tools, education/prompt guidance and generic AI noise.

This is not a request to pick a winner. It does not decide final page ownership, IA, URL, H1, Title or Semantic Master membership.

## 2. Fresh research — 2026-09-17

### 2.1 Wildberries native AI exists

Official source: `https://seller.wildberries.ru/instructions/ka/ru/material/wbot-analytics-in-the-app`

Current Wildberries `Помощник` is an automated seller service that can provide analytics on the seller's own products and includes a chat with AI using seller data and Wildberries reference materials. Availability/features depend on platform and subscription.

Official card/content sources:
- `https://seller.wildberries.ru/instructions/material/A-927`
- `https://seller.wildberries.ru/instructions/ru/ru/subcategory/how-to-improve-item-card`
- `https://seller.wildberries.ru/instructions/ru/ru/material/A-561`

Wildberries also exposes task-specific neural features such as product-description generation, AI answers to reviews/questions and neural photo/content tooling.

Conclusion: `MARKETPLACE_NATIVE_AI = CONFIRMED` for WB, with several task scopes rather than one universal seller AI product.

### 2.2 Yandex Market native AI exists

Official source: `https://www.yandex.ru/support/marketplace/ru/tools/ai-assistant`

`Маркет AI` is an AI assistant inside the seller cabinet. Current official help says it can answer seller questions, analyze sales/account data, suggest improvements and prepare product descriptions. The description workflow can operate on selected products and the seller can review/edit generated content before applying it.

Conclusion: `MARKETPLACE_NATIVE_AI = CONFIRMED` for Yandex Market and includes both data/analytics and content tasks.

### 2.3 Generic LLMs and specialized marketplace AI coexist

Editorial research source: `https://practicum.yandex.ru/blog/neyroseti-dlya-raboty-s-marketpleysami/`

Yandex Practicum's marketplace-AI overview separates seller tasks such as text/card content, images, review analysis/answers and other workflows. It names generic LLMs such as ChatGPT and GigaChat as alternatives for text/review tasks and also describes specialized services. Its selection guidance is task-first and includes budget, availability, marketplace compatibility and automation/integration.

Implication: the live query can reasonably resolve to several product classes. We must measure which class Yandex actually ranks rather than collapsing everything into `ИИ для маркетплейсов`.

### 2.4 Ozon bounded official check

A bounded current search of official Ozon seller surfaces was performed for seller AI/neural-assistant/card-generation terms. A current official Ozon seller-AI product equivalent to the WB/Yandex examples was **not confirmed in this pass**.

This is explicitly:

```text
OZON_NATIVE_SELLER_AI = NOT CONFIRMED IN BOUNDED PRE-STEP
```

It is NOT evidence that no Ozon AI capability exists.

## 3. Relation to already closed M3 evidence

- S01-S03 tested the `AI agent for marketplaces/Ozon/WB` category.
- R06 tested `помощник селлера маркетплейсов`.
- R07 tested a narrow operational card workflow.
- R11 tested broad WB seller-cabinet education/onboarding.

R12 is different: it asks for **selection/comparison of AI itself**. It can expose generic model comparison, native marketplace AI, specialized seller AI or task-specific tools even when the earlier agent/helper queries did not.

```text
R12_REDUNDANT_WITH_S01_S03_R06 = NO
R12_INFORMATION_GAIN = HIGH
R12_EXPECTED_INTENT = AI_TOOL_SELECTION / COMPARISON FOR MARKETPLACE SELLERS
```

## 4. Questions the live SERP must resolve

1. Does Yandex interpret the query as choosing a generic LLM/model or choosing specialized marketplace software?
2. How visible are native marketplace AI assistants?
3. Is the SERP dominated by task-specific content/card generators rather than broad seller assistants?
4. Is analytics/review/recommendation AI materially represented?
5. How much is education/prompt/course content rather than product selection?
6. Is there generic AI-comparison noise with no marketplace seller orientation?
7. Do pages claim direct marketplace integration, and if so for which platforms/tasks?

## 5. Result coding plan

Primary classes:

- `GENERIC_LLM_COMPARISON_OR_SELECTION`
- `MARKETPLACE_NATIVE_AI`
- `SPECIALIZED_MARKETPLACE_AI_OR_SELLER_TOOL`
- `CONTENT_CARD_GENERATION_AI`
- `ANALYTICS_AI_OR_SELLER_ASSISTANT`
- `REVIEW_RESPONSE_OR_CUSTOMER_COMMS_AI`
- `PROMPT_GUIDE_OR_EDUCATION`
- `COURSE_OR_TRAINING`
- `GENERIC_AI_NO_MARKETPLACE`
- `NOISE_OTHER_INTENT`

Evidence-driven additional classes are allowed when the complete top-20 requires them. No quotas.

For every result later record at minimum: rank, URL/domain, title/snippet/full text when needed, page type, product/service actor, marketplace scope, AI class, seller task, integration claim, commercial intent, relation to Octoport and product-boundary note.

## 6. Product boundary

Octoport is **not an AI model**. The user stays in a supported web AI/LLM and Octoport bridges that selected model to permitted Ozon/WB data/tools, returning results into the same dialogue.

SERP evidence MUST NOT be used to claim that Octoport:
- is its own LLM/AI;
- supports every named LLM or browser;
- replaces marketplace-native AI assistants;
- provides every specialized content/image/review/analytics capability shown in the SERP;
- performs unsupported business-state writes at launch;
- provides MPSTATS-like external market intelligence without separate capability proof.

R12 may reveal a strong user need to choose an AI, but product positioning remains `choose your LLM -> connect permitted marketplace data/tools through Octoport`, not `Octoport is the best AI`.

## 7. Stop rule

Process complete bounded top-20, no sampling/truncation. Quantify the dominant AI/product classes and seller tasks. Explicitly distinguish generic LLM selection, marketplace-native AI, specialized seller tools, task-specific generators/analytics and education/noise.

Do not add another R12 Search query unless the complete top-20 leaves a named unresolved decision that materially blocks M3 closure.

## 8. Release decision

```text
R12_REDUNDANT_WITH_S01_S03_R06 = NO
R12_INFORMATION_GAIN = HIGH
R12_EXPECTED_INTENT = AI_TOOL_SELECTION / COMPARISON FOR MARKETPLACE SELLERS
R12_WB_NATIVE_AI = CONFIRMED
R12_YANDEX_MARKET_NATIVE_AI = CONFIRMED
R12_OZON_NATIVE_AI = NOT CONFIRMED IN BOUNDED PRE-STEP
R12_GENERIC_LLM_AND_SPECIALIZED_AI_MIX = UNRESOLVED_UNTIL_LIVE_SERP
R12_PRODUCT_BOUNDARY = OCTOPORT_IS_NOT_THE_AI
R12_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R12_RELEASE = LOCAL START ONLY
R12_SECOND_START = FORBIDDEN AFTER ACCEPTED START
R12_SUBMIT = NOT RELEASED UNTIL START ENVELOPE IS DURABLY PERSISTED + READ BACK
```
