# M3 — representative Yandex SERP query matrix

Date: 2026-09-17.  
Status: **CURRENT / MAIN CHAT ACCEPTED AFTER M2R WORK RETURN QA**.  
Authority: `../PRODUCT_TRUTH.md`, `../QUALITY_FIRST_RESOURCE_RULE.md`, `../work/M2R_RECONCILIATION_MAIN_CHAT_RETURN_QA_2026-09-17.md`.

This matrix supersedes the old S04+ release order. It does not create pages, URLs or final semantic clusters. Every new Search query still requires its own fresh query-specific research/release gate, durable provider lifecycle evidence and readback before the next provider action.

Work return accounting correction: the matrix contains **15 entries total = 3 existing/covered + 12 RUN candidates**. The original Work output manifest incorrectly reported `12 total / 9 RUN / 3 existing`.

## Existing accepted Search evidence

### S01 — `ии агенты для маркетплейсов`
- Family: `F1`
- State: **COVERED_BY_EXISTING_SERP**
- Evidence: accepted current top-20.
- Decision already resolved: a real marketplace AI-agent SERP/category exists; not only creative-card generation.
- Relation: generic control for S02/S03.
- Stop: closed.

### S02 — `ии агент для озон`
- Family: `F1`
- State: **COVERED_BY_EXISTING_SERP**
- Evidence: accepted current top-20.
- Decision already resolved: Ozon-specific seller/API/data/agent intent exists.
- Relation: paired with S03.
- Stop: closed.

### S03 — `ии агент для wildberries`
- Family: `F1`
- State: **COVERED_BY_EXISTING_SERP**
- Evidence: accepted current top-20 plus S02-vs-S03 comparison.
- Decision already resolved: WB-specific intent exists; generic core overlaps with marketplace-specific depth.
- Relation: paired with S02.
- Stop: closed.

## New representative Search candidates

### R01 — `подключить chatgpt к маркетплейсу`
- Family: `F2`
- State: **RUN**
- Open decision: whether own-LLM connection has a coherent live SERP and what vocabulary/page types it uses.
- Why current evidence is insufficient: historical `подключить ии к маркетплейсу` was a successful exact-empty Wordstat result; ChatGPT marketplace phrases have observed demand but Wordstat cannot resolve Search intent.
- Expected information gain: very high; tests the product's differentiating mechanism directly.
- What Search could change: establish natural bridge/integration/extension language or show that this mechanism is expressed through other categories.
- Boundary: generic tutorials/integrations; unsupported mutation claims.
- Relation: generic control for R02/R03.
- Marketplace pair: yes, conditionally through R02/R03.
- Stop: once mechanism language and dominant page types are clear; split only if marketplace-specific evidence materially diverges.

### R02 — `chatgpt для ozon`
- Family: `F2`
- State: **RUN**
- Open decision: Ozon-specific own-AI intent and expected data/API access.
- Why insufficient now: Wordstat count does not resolve page type or user expectation.
- Expected gain: high.
- What could change: shared generic F2 treatment versus Ozon-specific depth.
- Boundary: generic ChatGPT advice; unsupported write actions.
- Relation: paired with R03; compared with R01.
- Marketplace pair: yes.
- Stop: after paired R02/R03 overlap + intent comparison.

### R03 — `chatgpt для wildberries`
- Family: `F2`
- State: **RUN**
- Open decision: WB-specific own-AI intent and difference from Ozon.
- Why insufficient now: Wordstat count does not resolve page type or expectation.
- Expected gain: high paired information gain.
- What could change: shared or split later treatment.
- Boundary: generic prompts; unsupported capabilities.
- Relation: paired with R02; compared with R01.
- Marketplace pair: yes.
- Stop: after paired R02/R03 overlap + intent comparison.

### R04 — `аналитика маркетплейсов для селлеров`
- Families: `F3`, `F9`
- State: **RUN**
- Open decision: whether live intent resolves to seller-owned analytics, external market intelligence, service discovery or human profession/training.
- Why insufficient now: Wordstat exposes all of these but cannot establish SERP dominance/page types.
- Expected gain: high; anchors the largest corrected family.
- What could change: narrow addressable acquisition language and competitor set.
- Boundary: human analyst/training; service brands; unsupported external intelligence.
- Relation: control/paired conceptually with R05.
- Marketplace pair: not initially.
- Stop: when dominant intent/page types and recurring competitors stabilize.

### R05 — `отчеты для селлеров маркетплейсов`
- Family: `F3`
- State: **RUN**
- Open decision: whether report intent is operational seller data rather than accounting/statutory reporting.
- Why insufficient now: Wordstat report roots are heavily contaminated by 1C/accounting/tax language.
- Expected gain: high boundary value.
- What could change: separate seller-report acquisition from accounting demand or show they merge in Search.
- Boundary: accounting, 1C, commissioner/statutory reporting.
- Relation: control against R04.
- Marketplace pair: not initially.
- Stop: when report source/user job and result page types are clear.

### R06 — `помощник селлера маркетплейсов`
- Family: `F4`
- State: **RUN**
- Open decision: human employee/service versus software/AI-helper intent.
- Why insufficient now: `помощник селлера` Wordstat is mixed and AI-qualified exact wording is tiny.
- Expected gain: high disambiguation value.
- What could change: validate, narrow or demote helper-language acquisition.
- Boundary: vacancies, hiring, human manager services.
- Relation: control against F1 agent/assistant evidence.
- Marketplace pair: no unless Search creates a named split question.
- Stop: once dominant human/software split is measurable.

### R07 — `как заполнить карточку товара wildberries`
- Families: `F5`, `F8`
- State: **RUN**
- Open decision: operational card workflow intent versus creative generators and generic education.
- Why insufficient now: exact operational seed is totalCount-only while historical card volume is dominated by images/infographics.
- Expected gain: high.
- What could change: preserve operational card job without claiming launch write-back/editing.
- Boundary: image/infographic generators; courses; mutation scope.
- Relation: paired/control with **R11**. R10 is a separate F7 niche-analysis query and is not the card-help pair.
- Marketplace pair: WB first because current operational/source evidence is strongest there; Ozon only if a later distinct decision appears.
- Stop: when operational-vs-creative intent and source expectations are clear.

### R08 — `аналитика рекламы маркетплейсов`
- Family: `F6`
- State: **RUN**
- Open decision: analytics/diagnostics intent versus agencies and bid-automation tools.
- Why insufficient now: Wordstat ad roots are live but sparse/non-expansive and cannot show page types.
- Expected gain: high boundary value.
- What could change: define the advertising-analysis acquisition boundary and whether marketplace-specific Search is needed.
- Boundary: autobidders, agencies, continuous bid automation.
- Relation: generic control; WB/Ozon pair remains conditional.
- Marketplace pair: not initially.
- Stop: if generic SERP resolves the boundary; otherwise release only the marketplace-specific control needed for the unresolved divergence.

### R09 — `поисковые запросы wildberries для продавца`
- Family: `F7`
- State: **RUN**
- Open decision: seller search-report intent versus buyer search/navigation.
- Why insufficient now: Wordstat and official source evidence establish the task/capability but not SERP intent mix.
- Expected gain: high and capability-confirmed.
- What could change: validate seller search-analytics acquisition language and result types.
- Boundary: buyer search/navigation; SEO tools; niche overclaim.
- Relation: control against R10.
- Marketplace pair: WB-specific; Ozon already has separate accepted capability evidence and needs Search only if a later decision requires it.
- Stop: when seller-side intent and dominant result types are clear.

### R10 — `анализ ниш wildberries для продавца`
- Family: `F7`
- State: **RUN**
- Open decision: native niche-analysis demand and whether users expect broader external market intelligence.
- Why insufficient now: Wordstat observes exact demand; native WB report is confirmed; full API availability remains unproven.
- Expected gain: high boundary value.
- What could change: retain demand while constraining addressability or expose external-intelligence SERP dominance.
- Boundary: MPStats-like external intelligence; unsupported API claims.
- Relation: paired/control with R09.
- Marketplace pair: WB only for now; `анализ ниш ozon` remains HOLD pending capability evidence.
- Stop: when expected data/source boundary is clear.

### R11 — `как работать в кабинете wildberries продавцу`
- Family: `F8`
- State: **RUN**
- Open decision: procedural seller-help intent and preferred authority/source type.
- Why insufficient now: umbrella Wordstat root is totalCount-only; help-center knowledge remains separate from Seller API.
- Expected gain: medium-high.
- What could change: validate the procedural/conversational helper job and source expectations.
- Boundary: buyer login/navigation; courses; official help navigation.
- Relation: paired/control with R07.
- Marketplace pair: WB first; Ozon only if later evidence creates a named unresolved split.
- Stop: when seller procedural intent and source/page types stabilize.

### R12 — `какой ии выбрать для маркетплейсов`
- Family: `F9`
- State: **RUN**
- Open decision: composition of comparison/discovery SERP after corrected product model.
- Why insufficient now: Wordstat proves comparison demand but not whether results are agents, analytics, creative tools or general LLM advice.
- Expected gain: medium-high.
- What could change: define the comparison entrance and contamination mix.
- Boundary: creative generators; generic LLM lists; affiliate/listicle noise.
- Relation: related to S01 but not redundant because selection/comparison intent differs.
- Marketplace pair: no.
- Stop: when category composition and recurring result/page types are classifiable.

## HOLD / NOT NEEDED candidates

- `аналитика рекламы wildberries` / `аналитика рекламы ozon` — **HOLD**; release only if R08 leaves a specific marketplace divergence unresolved.
- `анализ ниш ozon` — **HOLD**; current capability/source proof is insufficient and Search cannot repair missing product authority.
- broad `ии для маркетплейсов` / `нейросеть для маркетплейсов` — **NOT_NEEDED** now; contamination is already established.
- additional F1 singular/plural assistant/agent synonyms — **NOT_NEEDED**; S01-S03 already cover the category decision.

## Recommended execution order

1. **R01**, then paired **R02/R03** — own-AI mechanism and marketplace split.
2. **R04**, then **R05** — analytics/report page types and accounting/external-intelligence boundary.
3. **R06** — human-vs-software helper collision.
4. **R08** — advertising analysis boundary; marketplace pair only if R08 leaves a named divergence.
5. **R09**, then **R10** — confirmed search-report task versus bounded niche task.
6. **R07**, then **R11** — operational card work and procedural seller help.
7. **R12** — comparison composition after task-category evidence is better understood.

After every Search result, Main Chat must apply the existing sequence:

`query-specific fresh research/release -> provider lifecycle -> durable persistence/readback -> full result analysis -> decision -> next provider action`.

Stop expanding when the named decision reaches information saturation. No fixed query quota.

## Current gate

```text
M2R_RECONCILIATION = ACCEPTED
S01_S03 = CLOSED / EXISTING EVIDENCE
NEXT_CANDIDATE = R01
R01_PROVIDER_ACTION = NOT YET RELEASED
R01_REQUIRES_QUERY_SPECIFIC_PRE_STEP = true
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
```
