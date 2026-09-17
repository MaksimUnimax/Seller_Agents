# R11 export analysis — complete top-20

Date: 2026-09-17  
Stage: `M3 — Ordinary Yandex SERP collection`  
Query: `как работать в кабинете wildberries продавцу`  
Job: `octoport-serp-r11-20260917`  
Revision: `5`

## Acceptance

The attached export was processed as one complete bounded unit, 20/20. No sampling, truncation, quota-based coding or summarize-before-analysis was used.

```text
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
```

## Rank-by-rank coding

| Rank | Domain | Primary class | Octoport fit / boundary |
|---:|---|---|---|
| 1 | seller.wildberries.ru | OFFICIAL_WB_SELLER_PORTAL_OR_HELP | official seller-help / broad seller work reference; Octoport may explain and use permitted data/tools but does not replace WB Partners |
| 2 | skillbox.ru | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 3 | secrets.tbank.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 4 | selsup.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 5 | wbstat.pro | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 6 | tochka.com | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 7 | blog.promopult.ru | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 8 | tochka.com | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 9 | mpstats.io | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 10 | www.rbc.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 11 | litestat.io | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 12 | seller.wildberries.ru | OFFICIAL_WB_SELLER_PORTAL_OR_HELP | official seller-help / broad seller work reference; Octoport may explain and use permitted data/tools but does not replace WB Partners |
| 13 | www.moysklad.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 14 | alfabank.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 15 | www.insales.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 16 | sellermoon.ru | SELLER_PORTAL_GENERAL_HOW_TO_GUIDE | broad cabinet/navigation/workflow education; partially addressable by explain/analyze/report assistance, not whole-cabinet replacement |
| 17 | www.garant.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 18 | skillbox.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 19 | t-j.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |
| 20 | www.mtsbank.ru | SELLER_ONBOARDING_OR_REGISTRATION_GUIDE | seller acquisition/onboarding/registration; mostly outside Octoport core after account exists |

## Counts

```text
OFFICIAL_WB_SELLER_PORTAL_OR_HELP = 2/20
SELLER_PORTAL_GENERAL_HOW_TO_GUIDE = 8/20
SELLER_ONBOARDING_OR_REGISTRATION_GUIDE = 10/20
SPECIFIC_CABINET_WORKFLOW_GUIDE = 0/20
COURSE_SCHOOL_OR_TRAINING = 0/20
AGENCY_OR_MANAGED_SERVICE = 0/20
SOFTWARE_TOOL_OR_ASSISTANT_FOR_SELLERS = 0/20 as primary result intent
BUYER_ACCOUNT_OR_NON_SELLER_COLLISION = 0/20
NOISE_OTHER_INTENT = 0/20
SELLER_RELEVANCE = 20/20
```

Secondary observation: ranks 4, 5, 9, 11 and 16 are published by seller-software/analytics vendors (`selsup`, `wbstat`, `mpstats`, `litestat`, `sellermoon`), but the ranking pages themselves are educational cabinet/onboarding guides rather than direct software-tool landing intent.

## Interpretation

R11 is a broad seller-education umbrella query. The live SERP splits almost exactly between:
- onboarding / becoming a seller / registration: 10/20;
- broad WB Seller / cabinet usage and navigation: 8/20;
- official WB seller-help/reference: 2/20.

This is materially different from closed R07, whose top-20 was dominated by the narrow operational task of filling a product card. R11 does not collapse to R07 and does not reveal a distinct direct-software-assistant intent.

There is no meaningful buyer-account collision, agency/service demand, or course landing-page contamination in this bounded result set.

## Product boundary

The evidence supports user demand for explanations of seller-cabinet work and for broad operational guidance. It does NOT justify claiming that Octoport:
- replaces WB Partners;
- performs registration/onboarding;
- autonomously executes every cabinet workflow;
- edits cards, prices, bids or other business state at launch.

Octoport remains a browser bridge that can help the user's selected LLM read/analyze/explain/diagnose/recommend and prepare supported reports/data-backed guidance through permitted marketplace tools.

## M3 decision

```text
R11_REDUNDANT_WITH_R07 = NO
R11_INTENT = BROAD_SELLER_EDUCATION / ONBOARDING + CABINET_USAGE
R11_ONBOARDING_OR_REGISTRATION_SHARE = 10/20
R11_GENERAL_CABINET_OR_OFFICIAL_HELP_SHARE = 10/20
R11_DIRECT_SOFTWARE_ASSISTANT_INTENT = 0/20
R11_BUYER_COLLISION = 0/20
R11_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R11_MORE_SEARCH_NOW = NO
R11_PAGE_OWNERSHIP_DECISION = DEFERRED_TO M9/M11
R11 = CLOSED FOR CURRENT M3 AFTER DURABLE READBACK
NEXT_CANDIDATE = R12
R12_QUERY = какой ии выбрать для маркетплейсов
```

## M4 carry-forward seeds

Software-adjacent publishers visible in R11 and worth carrying to the later competitor/landing corpus layer, without treating this SERP as proof of direct product competition:
- MPSTATS
- SELLER MOON
- Selsup
- WBStat
- LiteStat

Official WB remains a product-truth/reference source rather than an Octoport competitor.
