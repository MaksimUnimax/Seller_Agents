# M3 revised representative query matrix — 2026-09-17

This is a minimum decision-oriented Search set, not a keyword quota and not page architecture. S01–S03 remain closed existing evidence.

## Query decisions

### S01 — `ии агенты для маркетплейсов`
- Families: `F1,F9`
- State: **COVERED_BY_EXISTING_SERP**
- Unresolved decision: Generic AI-agent category and mixed discovery intent.
- Why current evidence cannot answer it: Already closed; no re-run.
- Expected Search information gain: Existing 20-result evidence.
- What the result could change: Nothing in this pass.
- Contamination/boundary: creative/card noise; proprietary-AI confusion.
- Relation: paired with S02/S03.
- Marketplace-specific pairing required: yes.
- Stop condition: closed.

### S02 — `ии агент для озон`
- Families: `F1`
- State: **COVERED_BY_EXISTING_SERP**
- Unresolved decision: Ozon-specific AI-agent intent.
- Why current evidence cannot answer it: Already closed.
- Expected Search information gain: Existing 20-result evidence.
- What the result could change: Nothing in this pass.
- Contamination/boundary: Ozon-only capability claims.
- Relation: paired with S03.
- Marketplace-specific pairing required: yes.
- Stop condition: closed.

### S03 — `ии агент для wildberries`
- Families: `F1`
- State: **COVERED_BY_EXISTING_SERP**
- Unresolved decision: WB-specific AI-agent intent.
- Why current evidence cannot answer it: Already closed.
- Expected Search information gain: Existing 20-result evidence.
- What the result could change: Nothing in this pass.
- Contamination/boundary: WB-to-Ozon transfer.
- Relation: paired with S02.
- Marketplace-specific pairing required: yes.
- Stop condition: closed.

### R01 — `подключить chatgpt к маркетплейсу`
- Families: `F2`
- State: **RUN**
- Unresolved decision: Whether own-LLM connection has a coherent SERP and what vocabulary it uses.
- Why current evidence cannot answer it: Wordstat connection root was exact-empty; marketplace ChatGPT seeds are count-only.
- Expected Search information gain: Highest: tests the differentiating mechanism.
- What the result could change: May establish/replace bridge-extension language.
- Contamination/boundary: generic integrations and tutorials.
- Relation: control against R02/R03.
- Marketplace-specific pairing required: yes.
- Stop condition: stop when mechanism/page types are clear; split by marketplace only if materially divergent.

### R02 — `chatgpt для ozon`
- Families: `F2`
- State: **RUN**
- Unresolved decision: Ozon-specific own-AI intent and data/API expectation.
- Why current evidence cannot answer it: Wordstat count-only cannot reveal intent/page types.
- Expected Search information gain: High and directly product-aligned.
- What the result could change: Can require Ozon-specific depth or merge with generic F2.
- Contamination/boundary: generic ChatGPT advice; unsupported write actions.
- Relation: paired with R03.
- Marketplace-specific pairing required: yes.
- Stop condition: stop after paired overlap/intent comparison.

### R03 — `chatgpt для wildberries`
- Families: `F2`
- State: **RUN**
- Unresolved decision: WB-specific own-AI intent and difference from Ozon.
- Why current evidence cannot answer it: Wordstat count-only cannot reveal intent/page types.
- Expected Search information gain: High paired information gain.
- What the result could change: Can support shared or split treatment later.
- Contamination/boundary: generic prompts; unsupported capabilities.
- Relation: paired with R02.
- Marketplace-specific pairing required: yes.
- Stop condition: stop after paired overlap/intent comparison.

### R04 — `аналитика маркетплейсов для селлеров`
- Families: `F3,F9`
- State: **RUN**
- Unresolved decision: Whether demand resolves to seller-owned analytics, external market intelligence, services, or profession.
- Why current evidence cannot answer it: Wordstat mixes all four.
- Expected Search information gain: High: anchors largest corrected family.
- What the result could change: Can narrow addressable acquisition language.
- Contamination/boundary: human analyst; training; service brands; external intelligence.
- Relation: control for R05.
- Marketplace-specific pairing required: no.
- Stop condition: stop when dominant intents and recurring page types stabilize.

### R05 — `отчеты для селлеров маркетплейсов`
- Families: `F3`
- State: **RUN**
- Unresolved decision: Whether report intent is operational seller data rather than accounting/statutory.
- Why current evidence cannot answer it: Wordstat exposes both but not SERP dominance.
- Expected Search information gain: High boundary value.
- What the result could change: Can separate reporting from broad analytics.
- Contamination/boundary: accounting, 1C, statutory reporting.
- Relation: paired/control with R04.
- Marketplace-specific pairing required: no.
- Stop condition: stop after report-source and page-type decision.

### R06 — `помощник селлера маркетплейсов`
- Families: `F4`
- State: **RUN**
- Unresolved decision: Human employee/service versus software/AI helper intent.
- Why current evidence cannot answer it: Wordstat cannot disambiguate this lexical collision.
- Expected Search information gain: High.
- What the result could change: Can validate or demote helper entrance.
- Contamination/boundary: vacancies, hiring, human manager services.
- Relation: control against F1 evidence.
- Marketplace-specific pairing required: no.
- Stop condition: stop once dominant human/software split is measurable.

### R07 — `как заполнить карточку товара wildberries`
- Families: `F5,F8`
- State: **RUN**
- Unresolved decision: Operational card workflow intent versus generators and generic education.
- Why current evidence cannot answer it: Seed is totalCount-only; historical rows are creative-heavy.
- Expected Search information gain: High.
- What the result could change: Can preserve operational job without claiming editing.
- Contamination/boundary: image/infographic generators; courses; mutation scope.
- Relation: paired conceptually with R10.
- Marketplace-specific pairing required: yes.
- Stop condition: stop after operational-vs-creative and source expectation are clear.

### R08 — `аналитика рекламы маркетплейсов`
- Families: `F6`
- State: **RUN**
- Unresolved decision: Analytics/diagnostics intent versus agency and automation tools.
- Why current evidence cannot answer it: Wordstat rows are sparse and cannot show page types.
- Expected Search information gain: High.
- What the result could change: Can define advertising-analysis acquisition boundary.
- Contamination/boundary: autobidders, agencies, bid automation.
- Relation: control; marketplace pair held unless divergence appears.
- Marketplace-specific pairing required: no.
- Stop condition: stop if generic SERP resolves boundary; otherwise release one Ozon/WB pair.

### R09 — `поисковые запросы wildberries для продавца`
- Families: `F7`
- State: **RUN**
- Unresolved decision: Seller search-report task versus buyer search/navigation.
- Why current evidence cannot answer it: Wordstat and source evidence establish task, not SERP intent mix.
- Expected Search information gain: High and capability-confirmed.
- What the result could change: Can validate task entrance and exact seller framing.
- Contamination/boundary: buyer search; SEO tools; niche overclaim.
- Relation: control against R10.
- Marketplace-specific pairing required: yes.
- Stop condition: stop when seller-side intent and result types are clear.

### R10 — `анализ ниш wildberries для продавца`
- Families: `F7`
- State: **RUN**
- Unresolved decision: Native niche-report demand and whether users expect external intelligence.
- Why current evidence cannot answer it: Wordstat observes demand but full API access is unproven.
- Expected Search information gain: High boundary value.
- What the result could change: Can retain demand while setting HOLD on addressability.
- Contamination/boundary: MPStats-like external intelligence; unsupported API claims.
- Relation: paired/control with R09.
- Marketplace-specific pairing required: yes.
- Stop condition: stop after expected data/source boundary is clear.

### R11 — `как работать в кабинете wildberries продавцу`
- Families: `F8`
- State: **RUN**
- Unresolved decision: Procedural seller-help intent and preferred authority/source.
- Why current evidence cannot answer it: Seed is totalCount-only; help knowledge is separate from API.
- Expected Search information gain: Medium-high.
- What the result could change: Can establish conversational help job.
- Contamination/boundary: buyer login; courses; official help navigation.
- Relation: control for R07.
- Marketplace-specific pairing required: yes.
- Stop condition: stop once seller procedural intent and source types stabilize.

### R12 — `какой ии выбрать для маркетплейсов`
- Families: `F9`
- State: **RUN**
- Unresolved decision: Composition of comparison/discovery SERP after corrected product model.
- Why current evidence cannot answer it: Wordstat shows demand but not whether results are agents, analytics, or creative tools.
- Expected Search information gain: Medium-high.
- What the result could change: Can define comparison entrance and contamination mix.
- Contamination/boundary: creative generators; generic LLM lists.
- Relation: related to S01, not redundant because selection intent differs.
- Marketplace-specific pairing required: no.
- Stop condition: stop when category composition is classifiable.

## Candidates held or not needed

- `аналитика рекламы wildberries` / `аналитика рекламы ozon` — **HOLD**; run only if R08 leaves a named marketplace divergence unresolved.
- `анализ ниш ozon` — **HOLD**; capability/source proof is insufficient and Search cannot repair that fact.
- Broad `ии для маркетплейсов` and `нейросеть для маркетплейсов` — **NOT_NEEDED** now; contamination is already established.
- Additional F1 singular/plural synonyms — **NOT_NEEDED**; S01–S03 already cover the category decision.

## RECOMMENDED M3 EXECUTION ORDER

1. R01, then paired R02/R03 (product mechanism and marketplace split).
2. R04, then R05 (analytics/report source and contamination).
3. R06 (helper human/software collision).
4. R08 (advertising boundary; conditionally release marketplace pair only if needed).
5. R09, then R10 (confirmed search-report task versus bounded niche task).
6. R07, then R11 (operational card and procedural help).
7. R12 (comparison composition after the task categories are understood).

After each result, Main Chat should apply the existing query-specific release/persistence/analysis gate and stop expanding when the named decision reaches saturation.
