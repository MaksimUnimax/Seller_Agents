# R04-R1 full export analysis — `аналитика маркетплейсов для селлеров`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F3+F9 analytics boundary`.  
Job: `octoport-serp-r04r1-20260917`.  
Operation: `sprqtqegnppne4lqbf2t`.  
Revision: `5`.  
Status: **PASS / ALL 20 RESULTS REVIEWED / R04 CLOSED FOR CURRENT M3 PASS**.

Raw/export authority: `../raw/R04R1_07_EXPORT_MANIFEST_2026-09-17.md`.

## 1. Export QA

```text
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
SOURCE_SHA256 = 0eac21c35e6b7c349790b5513776217575a23138f75efd7965cb6b332ce9e961
EXPORT_PERSISTENCE = PASS / 7 LOSSLESS VERIFIED CHUNKS
```

No result was sampled or omitted. Classification uses title, snippet and, where needed, the full normalized/raw XML text from the accepted export.

## 2. Classification rules

Primary non-overlapping class is assigned by the result page's dominant observable analytics/data proposition:

- `SELLER_OWNED_INTERNAL_ANALYTICS` — seller's own cabinet/store/order/finance/ad/stock/unit-economics data;
- `EXTERNAL_MARKET_INTELLIGENCE` — market-wide/other-products/competitors/niches/demand intelligence;
- `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS` — same product surface materially combines own seller data with external market/competitor/niche data;
- `ANALYTICS_SERVICE_OR_CONSULTING` — service/consulting-led analytics proposition where data ownership is not the primary observable distinction;
- `ANALYTICS_EDUCATION_OR_PROFESSION` — course/job/profession-led intent;
- `GENERIC_SELLER_ANALYTICS_CONTENT` — editorial/comparison/informational content rather than a direct analytics product;
- `NOISE_OTHER_INTENT` — unrelated intent.

`Octoport fit = DIRECT` means the observable job is materially addressable by seller-authorized marketplace data in the launch product model. `BOUNDARY` means the result materially expects unsupported external market/niche/competitor intelligence. `ADJACENT` means useful category context but not a direct launch-product analytics surface.

## 3. All-20 result coding

| Rank | Domain / surface | Primary class | Evidence boundary | Octoport fit |
|---:|---|---|---|---|
| 1 | mayak.bz | `EXTERNAL_MARKET_INTELLIGENCE` | orders/revenue/stocks of **any products** on WB/Ozon | BOUNDARY |
| 2 | sellerden.ru / SellerFox | `EXTERNAL_MARKET_INTELLIGENCE` | export text explicitly describes SellerFox as external marketplace analytics; niche/sales market signals | BOUNDARY |
| 3 | tbank.ru / Seller analytics help | `SELLER_OWNED_INTERNAL_ANALYTICS` | seller sees own sales analytics in personal cabinet/app | DIRECT |
| 4 | sellerstats.ru | `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS` | export explicitly distinguishes external analytics over almost all marketplace products and internal API analytics | BOUNDARY+DIRECT MIX |
| 5 | mpboost.pro | `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS` | own-product statistics plus niches/competitors | BOUNDARY+DIRECT MIX |
| 6 | sellmonitor.com | `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS` | niches/competitor strategy plus internal analytics/supply planning | BOUNDARY+DIRECT MIX |
| 7 | limescope.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | sales, expenses, ads, stock, profit across the seller's cabinets | DIRECT |
| 8 | mpfact.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | store analytics/reports and seller operational decisions on replenishment/cards | DIRECT |
| 9 | mpstats.io/instruments/analytics | `EXTERNAL_MARKET_INTELLIGENCE` | demand, competitors, brands, categories, product niches | BOUNDARY |
| 10 | sellper.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | reports, finance, API integrations, profit/loss of seller operation | DIRECT |
| 11 | finance.ozon.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | seller sales statistics, product metrics, redemption and margin | DIRECT |
| 12 | restata.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | seller profit, commissions, logistics, tax, cost dashboard | DIRECT |
| 13 | marketguru.io | `ANALYTICS_SERVICE_OR_CONSULTING` | commercial ecosystem surface explicitly combines analytics, automation, consulting/services; finance analytics present but internal/external ownership is not explicit enough for stronger coding | ADJACENT |
| 14 | truestats.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | financial digitization and actual seller earnings after marketplace deductions | DIRECT |
| 15 | yoolip.ai | `SELLER_OWNED_INTERNAL_ANALYTICS` | Ozon seller sales/ad metrics, CPC/CPO, unit economics | DIRECT |
| 16 | sberbank.ru | `GENERIC_SELLER_ANALYTICS_CONTENT` | editorial/top-offers page describing analytics services and seller operations | ADJACENT |
| 17 | torgstat.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | business digitization, sales management and financial accounting | DIRECT |
| 18 | seller24.ru | `SELLER_OWNED_INTERNAL_ANALYTICS` | explicitly calls itself internal marketplace analytics; ads/unit economics by seller product | DIRECT |
| 19 | mpstats.io | `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS` | broad platform; export exposes external demand/prices/competitor strategies plus seller-cabinet tooling | BOUNDARY+DIRECT MIX |
| 20 | mpstats.io/chrome-plugin | `EXTERNAL_MARKET_INTELLIGENCE` | marketplace/card inspection browser plugin; external product/card checks | BOUNDARY |

## 4. Aggregate intent/data mix

```text
SELLER_OWNED_INTERNAL_ANALYTICS = 10/20 = 50%
EXTERNAL_MARKET_INTELLIGENCE = 4/20 = 20%
MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS = 4/20 = 20%
ANALYTICS_SERVICE_OR_CONSULTING = 1/20 = 5%
GENERIC_SELLER_ANALYTICS_CONTENT = 1/20 = 5%
ANALYTICS_EDUCATION_OR_PROFESSION = 0/20
NOISE_OTHER_INTENT = 0/20
```

The top 10 are even more boundary-sensitive:

```text
TOP10_INTERNAL = 4/10
TOP10_EXTERNAL = 3/10
TOP10_MIXED = 3/10
```

Thus seller-owned/internal analytics is the largest class across the full top 20, but the upper SERP is not cleanly internal: external-only + mixed surfaces occupy 6/10 of the top 10.

## 5. Page-type and market-scope shape

Observed page type mix:

```text
DIRECT COMMERCIAL PRODUCT/LANDING/PLATFORM SURFACE = 18/20
PRODUCT HELP/DOCUMENTATION = 1/20 (T-Bank)
EDITORIAL/COMPARISON CONTENT = 1/20 (Sber)
COURSE/JOB/PROFESSION = 0/20
```

Marketplace scope is overwhelmingly multi-marketplace/generic seller analytics. Only Yoolip is clearly Ozon-only in this top 20; the rest address WB+Ozon, several marketplaces, or the generic marketplace-seller category.

This is therefore a strong software/service-discovery SERP, not a human-analyst/profession SERP.

## 6. Search-competitor observation

`mpstats.io` appears on three distinct ranked URLs (#9, #19, #20), spanning analytics product, platform homepage and browser plugin. It is the only repeatedly represented domain in this top 20.

This makes MPSTATS a recurring **Search surface** for this query. It does not automatically make it the only business rival or authorize copying its external-intelligence feature set.

## 7. Product implication

R04 establishes two facts simultaneously:

1. seller-owned operational/financial analytics is unquestionably a major live Search intent and is directly compatible with Octoport's seller-authorized-data model;
2. broad unqualified `аналитика маркетплейсов` also carries a strong expectation of external market/niche/competitor intelligence that Octoport must not imply unless separately supported by product authority.

Therefore broad analytics acquisition language is usable only with a clear scope boundary such as seller's own stores/accounts/data, reports, finances, ads, stock, sales and operational metrics. The project must not silently inherit promises such as market-wide competitor sales, niche selection, market demand or competitor strategies from the ranking SaaS category.

## 8. R04 verdict

```text
R04_VERDICT = MIXED_SELLER_ANALYTICS_SERP_INTERNAL_PLURALITY_WITH_STRONG_EXTERNAL_MIXED_COMPETITION
R04_INTERNAL = 10/20
R04_EXTERNAL_ONLY = 4/20
R04_MIXED_INTERNAL_EXTERNAL = 4/20
R04_SERVICE_CONSULTING = 1/20
R04_EDITORIAL = 1/20
R04_EDUCATION_PROFESSION = 0/20
R04_NOISE = 0/20
R04_TOP10_INTERNAL = 4/10
R04_TOP10_EXTERNAL_OR_MIXED = 6/10
R04_MORE_SEARCH_NOW = NO
R04_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R04_PAGE_OWNERSHIP_DECISION = DEFERRED TO M9/M11
R04 = CLOSED FOR CURRENT M3 PASS
```

This is a representative first-page observation, not proof that every analytics query has the same composition.

## 9. R05 consequence

R04 does **not** make R05 redundant. `отчеты для селлеров маркетплейсов` has a different named boundary: operational seller reports versus accounting/1C/tax/statutory reporting contamination. R04 answers the broad analytics data-ownership question; it does not resolve that report-specific ambiguity.

```text
R05_INFORMATION_GAIN = STILL HIGH
R05 = NEXT CANDIDATE
R05_REQUIRES_OWN_QUERY_SPECIFIC_PRE_STEP = true
```

No R05 Bridge command may be released until R04 closure/progress is persisted/read back and the R05 pre-step/release itself passes remote readback.
