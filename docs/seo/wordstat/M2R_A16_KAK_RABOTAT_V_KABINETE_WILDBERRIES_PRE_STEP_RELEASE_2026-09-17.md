# M2R-A16 pre-step research and query release — `как работать в кабинете wildberries`

Date: 2026-09-17.
Stage: `M2R — procedural seller-cabinet help / knowledge discovery (F8)`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A14 `помощник селлера`: CLOSED / mixed human-vs-software intent.
- A15 `ии ассистент селлера`: CLOSED / totalCount 2 / exact AI-helper category wording is live but very small and non-expansive.
- Historical M2 already tested obvious own-AI/helper seeds including `chatgpt для ozon`, `chatgpt для wildberries`, `ии помощник селлера`, `подключить ии к маркетплейсу`, `ии агент для селлера`, `ии для wildberries`, `ии для озон`, `как использовать ии для маркетплейсов`; do not rerun them.
- F2/F4 remain relevant product/intent families but near-synonym Wordstat chasing is stopped.
- F8 procedural cabinet help / knowledge was marked absent/major gap in the corrected coverage audit.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A16`

`QUERY_TEXT = как работать в кабинете wildberries`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Discover the natural search language around **how sellers operate the Wildberries seller cabinet / WB Partners**, independent of AI-product terminology.

Need to discover whether users naturally search for:

- how to use the seller cabinet / WB Partners;
- where specific sections/functions are;
- product-card operations;
- orders / supplies / FBO/FBS procedures;
- returns / cancellations / claims;
- finance / payments / reports;
- analytics / promotion sections;
- users/roles/access/API/integrations;
- support/help-center questions;
- seller registration/onboarding;
- buyer-account/login confusion;
- course/manager-training content;
- outdated portal naming/instructions.

## 4. Why this query follows A15

A14-A15 show that searching for the helper product/category label is a poor way to discover the underlying daily-work tasks:

- broad helper language is mixed with human hiring;
- exact AI-assistant language is tiny/non-expansive;
- historical AI/connection seeds are already tested.

The next information gap is therefore not another assistant synonym, but the **procedural job itself**: seller questions about how to perform actions and navigate the marketplace cabinet.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract supports last-30-days phrase-containing/similar-query discovery with `numPhrases` up to 2000.

Method consequence: use the cabinet-work phrase as broad procedural discovery; persist the complete provider response before semantic interpretation.

### Wildberries official current seller-help surface

Source:

https://seller.wildberries.ru/instructions/ru/ru/material/sellers-site-main-page

The current WB seller help surface contains procedural sections for seller work including:

- how to start working on Wildberries;
- preparation and registration;
- safe work with WB Partners data;
- sales models and first sale;
- electronic document flow;
- profit calculator;
- portal/service communication and cooperation conditions.

Additional current help-center navigation includes acquaintance with the seller portal and the main seller-portal page.

Source:

https://seller.wildberries.ru/instructions/ru/by/material/for-reference

### Wildberries official `Помощник` procedural-help model

Source:

https://seller.wildberries.ru/instructions/ka/ru/material/wbot-analytics-in-the-app

Updated 16.06.2026. `Помощник` can answer questions about work on the WB Partners portal, and its AI chat forms answers from available seller reports and help-center materials.

This directly validates procedural cabinet-help as a real seller job, independently of whether users search for the product label `ИИ ассистент`.

### Current market-language evidence

https://uniseller.io/blog/kak-rabotat-v-kabinete-wildberries-seller/

Published 21.05.2026 and updated 15.09.2026. Uses the exact current language `Как работать в кабинете Wildberries` and explains the seller portal / seller.wildberries.ru.

https://sheer.ru/wb-seller-lichnyy-kabinet/

Published 24.08.2026. Current guide uses `WB Seller личный кабинет: как войти и пользоваться` and maps the current seller-cabinet terminology.

https://selsup.ru/blog/kabinet-prodavtsa-wildberries/

Published 24.08.2026 and updated 15.09.2026. Uses `Личный кабинет продавца Wildberries` and current WB Partners navigation/roles/access language.

https://mpmgr.ru/blog/beginners/lichnyj-kabinetc-prodavtsa-na-wildberries

Published 20.04.2026. Uses `Личный кабинет продавца Wildberries — полный обзор интерфейса`, including sections, statistics, product management and account settings.

These pages establish live current search/market language; they are not product-truth authorities for Octoport.

## 6. Source -> method trace

| Question | Source | A16 use | Boundary |
|---|---|---|---|
| Can GetTop expose cabinet-help variants? | Yandex Wordstat.GetTop | max-depth procedural discovery | demand/language only, not page proof |
| Are procedural portal questions a real current seller job? | WB official seller help + `Помощник` | retain cabinet-mechanics/help branches | WB help content does not imply a Seller API knowledge endpoint |
| Is `как работать в кабинете Wildberries` live current language? | Uniseller / SHEER / Selsup / MP Manager 2026 | justify exact query and likely child tasks | market/editorial language != final page authority |

## 7. Information-gain contract

A16 must add information beyond A14/A15 by:

1. discovering procedural seller-cabinet language rather than helper-product labels;
2. identifying concrete daily seller tasks/questions;
3. detecting product-card, order, supply, returns, finance, analytics, ads, role/access and integration subjobs;
4. separating seller-cabinet intent from buyer-account/login intent;
5. detecting registration/onboarding vs ongoing-operation language;
6. identifying help-center/support/manual/course intent;
7. deciding whether a paired Ozon cabinet-help probe is needed;
8. determining whether F8 needs further Wordstat acquisition or is better resolved later through SERP/help-center corpus evidence.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- SELLER_CABINET_CORE;
- REGISTRATION_ONBOARDING;
- NAVIGATION_SECTIONS;
- PRODUCT_CARD_OPERATIONS;
- ORDERS_SUPPLIES_FBO_FBS;
- RETURNS_CANCELLATIONS_CLAIMS;
- FINANCE_PAYMENTS_REPORTS;
- ANALYTICS_PROMOTION;
- USERS_ROLES_ACCESS;
- API_INTEGRATION;
- SUPPORT_HELP_CENTER;
- PROCEDURAL_KNOWLEDGE;
- BUYER_ACCOUNT_LOGIN_NOISE;
- COURSE_MANAGER_EDUCATION;
- OUTDATED_PORTAL_LANGUAGE;
- NOISE;
- HOLD.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert totalCount-only into zero. A weak exact root would not erase the procedural job proven by current official seller-help surfaces; it would mean users search mechanics through more specific task phrases.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `как работать в кабинете wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- if the root exposes rich seller mechanics, expand only subjobs that answer named gaps;
- if navigation/registration dominates, retain it as onboarding evidence but do not inflate Octoport's core with buyer/login traffic;
- release an Ozon procedural probe only when it has incremental information value;
- do not claim marketplace help-center materials are available through Seller API unless separately proven;
- no page decision from raw counts.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A16_KAK_RABOTAT_V_KABINETE_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for this single bounded Wordstat call.

After A16 plus at least one additional remaining major family (product-card operations or search/niche analytics), proactive Work reconciliation should be strongly considered for full-volume cross-family deduplication, intent classification, boundary QA and discovery-gap analysis. Resource economy is not a reason to defer it.

## 13. Downstream decision

A16 does not create a page. It measures real procedural seller-cabinet demand and determines whether cabinet-help/knowledge is a useful acquisition family and what representative SERP/help-center evidence is required later.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A14/A15 | 10.0 |
| Historical anti-duplication discipline | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB procedural support | 10.0 |
| Current 2026 market-language support | 10.0 |
| Seller-vs-buyer intent boundary | 10.0 |
| Product-truth / KB-API boundary | 10.0 |
| Outcome/failure contract | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A16_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A16 = 0
QUERY = как работать в кабинете wildberries
```
