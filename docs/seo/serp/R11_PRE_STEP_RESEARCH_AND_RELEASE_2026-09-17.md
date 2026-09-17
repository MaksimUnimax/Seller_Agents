# R11 — query-specific research and release

Date: 2026-09-17  
Stage: M3 / ordinary Yandex SERP  
Query ID: `R11`  
Query: `как работать в кабинете wildberries продавцу`  
Job ID: `octoport-serp-r11-20260917`

Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**

## 1. Objective

Resolve the broad seller-cabinet intent that remains after the narrower R07 card-filling workflow was closed. R11 must measure what Yandex actually treats as the dominant user task behind the phrase: general WB Partners usage, seller onboarding/registration, specific cabinet workflows, training/service demand, software-assistant demand, or buyer/non-seller collision.

This pass does NOT decide final page ownership, final IA, URL, H1, Title or Semantic Master membership.

## 2. Fresh official research — 2026-09-17

### 2.1 Wildberries Seller Help — seller portal main page

Source: `https://seller.wildberries.ru/instructions/ru/ru/material/sellers-site-main-page`

Current official seller-help navigation explicitly separates multiple portal jobs, including:
- how to start working on Wildberries;
- preparation before registration;
- registration of a new seller in WB Partners;
- first sale;
- the seller portal main page;
- Profile;
- Tariffs;
- notifications;
- News;
- card transfer;
- supply workflows and other seller operations.

Implication: `работать в кабинете` is an umbrella operational phrase, not a single product-card workflow.

### 2.2 Wildberries seller portal

Source: `https://seller.wildberries.ru/about-portal/ru/ru`

The current official portal presents seller work as a multi-stage business environment: start/registration, product placement, logistics and sales models, promotion, seller analytics, search-query analytics, niche analysis, finance-related business controls, support and learning materials.

Implication: the live SERP may legitimately mix onboarding, navigation, analytics and specific operational instructions. That mix must be measured rather than normalized away.

## 3. Relation to already closed evidence

`R07 как заполнить карточку товара wildberries` is CLOSED and narrow: its SERP was dominated by operational product-card filling guidance.

Therefore:

```text
R11_REDUNDANT_WITH_R07 = NO
R11_INFORMATION_GAIN = HIGH
R11_EXPECTED_INTENT = BROAD_SELLER_PORTAL_USE / OPERATIONAL_GUIDANCE
```

R09/R10 also cover narrower WB analytics tasks and do not replace R11.

## 4. Questions the live SERP must resolve

1. Does Yandex primarily interpret the query as general seller-portal usage/how-to?
2. How much of the SERP is actually onboarding/registration for a new seller?
3. How much collapses into specific cabinet workflows instead of broad navigation/use?
4. Is there material course/school/agency contamination?
5. Is software/assistant intent visible at all?
6. Is there any buyer-account/non-seller collision?
7. Is the broad query saturated by one result type or fragmented across several task types?

## 5. Result coding plan

Primary classes:

- `OFFICIAL_WB_SELLER_PORTAL_OR_HELP`
- `SELLER_PORTAL_GENERAL_HOW_TO_GUIDE`
- `SELLER_ONBOARDING_OR_REGISTRATION_GUIDE`
- `SPECIFIC_CABINET_WORKFLOW_GUIDE`
- `COURSE_SCHOOL_OR_TRAINING`
- `AGENCY_OR_MANAGED_SERVICE`
- `SOFTWARE_TOOL_OR_ASSISTANT_FOR_SELLERS`
- `BUYER_ACCOUNT_OR_NON_SELLER_COLLISION`
- `NOISE_OTHER_INTENT`

Evidence-driven additional classes are allowed if the complete top-20 requires them. No quotas.

For every result later record at minimum:
- rank;
- URL/domain;
- title/snippet and full text when needed;
- page type;
- actor;
- seller vs buyer orientation;
- task scope;
- concrete workflow/topic;
- commercial intent;
- relation to Octoport capability;
- Octoport fit / boundary note.

## 6. Product boundary

Octoport is a browser bridge between the user's selected LLM and permitted Ozon/WB data/tools. R11 SERP evidence may reveal seller expectations but MUST NOT create unsupported product capability.

In particular, R11 must not be used to claim that Octoport:
- replaces the whole WB seller cabinet;
- autonomously performs every portal workflow;
- edits cards/prices/bids or other business state unless that capability is separately proven and released;
- provides every marketplace function shown in WB Partners.

Launch truth remains primarily read/analyze/explain/diagnose/recommend/report-oriented.

## 7. Stop rule

Process the complete bounded top-20, no sampling/truncation. Quantify the dominant task/page types and explicitly measure general portal guidance vs onboarding vs specific workflows vs courses/services/software vs buyer/noise.

Do not add another R11 Search query unless the complete top-20 leaves a named unresolved decision that materially blocks M3 closure.

Final page ownership remains deferred to M9/M11.

## 8. Release decision

```text
R11_REDUNDANT_WITH_R07 = NO
R11_INFORMATION_GAIN = HIGH
R11_BUYER_ACCOUNT_COLLISION = UNRESOLVED_UNTIL_LIVE_SERP
R11_COURSE_SERVICE_CONTAMINATION = UNRESOLVED_UNTIL_LIVE_SERP
R11_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R11_RELEASE = LOCAL START ONLY
R11_SECOND_START = FORBIDDEN AFTER ACCEPTED START
R11_SUBMIT = NOT RELEASED UNTIL START ENVELOPE IS DURABLY PERSISTED + READ BACK
```
