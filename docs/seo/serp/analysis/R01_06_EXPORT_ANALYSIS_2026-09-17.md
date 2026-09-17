# R01 full SERP analysis — `подключить chatgpt к маркетплейсу`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / post-M2R rebaseline`.  
Status: **CLOSED / SUCCESS WITH 20 RESULTS / MIXED_CONNECTION_SERP / F2 GENERIC MECHANISM CONFIRMED / R02-R03 PAIRED CHECK STILL REQUIRED**.

## 1. Evidence authority and integrity

Source attachment:

`search-octoport-serp-r01-20260917-r5-0-0.json`

Durable persistence authority:

`../raw/R01_06_EXPORT_MANIFEST_2026-09-17.md`.

Provider identity:

```text
job_id = octoport-serp-r01-20260917
operation_id = sprsmko0p531abn82fmk
revision = 5
query = подключить chatgpt к маркетплейсу
result_rows = 20
validation.document_count = 20
validation.usable_for_url_comparison = true
missing_url_ranks = []
unsafe_url_ranks = []
has_more = false
all_job_items_in_this_file = true
```

All 20 normalized rows were reviewed. No sampling was used.

This analysis is based on the captured Yandex URL/title/snippet/modtime evidence. It does not silently upgrade snippets into full-page feature claims. Full competitor-page capture belongs to M4.

## 2. R01 decision question

R01 was released to answer whether a seller-side job phrased as connecting the user's own ChatGPT to a marketplace produces a coherent live Search surface around connection/integration/data access, or collapses into generic ChatGPT tutorials/content generation.

Allowed pre-step outcome classes included:

`COHERENT_OWN_LLM_CONNECTION_SERP | MIXED_CONNECTION_SERP | MOSTLY_GENERIC_TUTORIAL | MOSTLY_AGENT_CATEGORY | HOLD`.

Observed result:

**`MIXED_CONNECTION_SERP`**.

The important asymmetry is that the head of the SERP is strongly connection-led while the full top-20 is mixed.

## 3. Rank-by-rank classification

Primary class is deliberately non-overlapping so the aggregate accounts to 20/20.

| Rank | Domain | Observed result job | Primary class | F2 relevance |
|---:|---|---|---|---|
| 1 | `api-master.ru` | connect ChatGPT to Ozon/WB using marketplace API token / Actions | DIRECT_TARGET_CONNECTION | very high |
| 2 | `jafo.ru` | connect Claude/ChatGPT directly to WB/Ozon seller cabinets instead of repeated Excel uploads | DIRECT_TARGET_CONNECTION | very high |
| 3 | `tochka.com` | ChatGPT writes marketplace product-card descriptions | CARD_CONTENT_GENERATION | low/boundary |
| 4 | `sdvg.vc` | ChatGPT/OpenAI connection to Bitrix24 | ADJACENT_INTEGRATION_MECHANISM | mechanism-only, non-marketplace |
| 5 | `chat-gpt-openai.ru` | generic ChatGPT for marketplaces assistant page | GENERAL_MARKETPLACE_CHATGPT | medium |
| 6 | `mpstats.io` | generic how to use ChatGPT/neural nets for marketplaces | GENERAL_MARKETPLACE_CHATGPT | medium |
| 7 | `seller.ozon.ru` | official Ozon neural-network article centered on product-card/content work | CARD_CONTENT_GENERATION | low/boundary |
| 8 | `vc.ru` | Avito connected to ChatGPT through MCP for structured public listing data | ADJACENT_INTEGRATION_MECHANISM | high mechanism evidence, wrong marketplace/task |
| 9 | `apimonster.ru` | Avito + OpenAI/ChatGPT API/no-code integration | ADJACENT_INTEGRATION_MECHANISM | medium mechanism evidence, wrong marketplace |
| 10 | `marketprovider.ru` | ChatGPT integrated with PIM/product information system for marketplace content/data workflow | ADJACENT_INTEGRATION_MECHANISM | medium mechanism evidence |
| 11 | `mpstats.io` | ChatGPT for marketplace product photos/cards | CARD_CONTENT_GENERATION | low/boundary |
| 12 | `vc.ru` | ChatGPT as helper for WB supplies/marketplace seller tasks when given context | GENERAL_MARKETPLACE_CHATGPT | medium |
| 13 | `ppc.world` | getting products into ChatGPT/AI recommendation/search surfaces | NOISE_OTHER_INTENT | none for seller-data connection |
| 14 | `qmedia.by` | ChatGPT for marketplace product-card creation | CARD_CONTENT_GENERATION | low/boundary |
| 15 | `habr.com` | buying ChatGPT Plus subscription via marketplace `ggsel` | NOISE_OTHER_INTENT | lexical collision |
| 16 | `youtube.com` | product-card/infographic creation in ChatGPT | CARD_CONTENT_GENERATION | low/boundary |
| 17 | `pikabu.ru` | ChatGPT for descriptions/images/product cards | CARD_CONTENT_GENERATION | low/boundary |
| 18 | `vc.ru` | product-card creation with ChatGPT | CARD_CONTENT_GENERATION | low/boundary |
| 19 | `youtube.com` | ChatGPT for seller analysis using uploaded sales data/files and seller tasks | GENERAL_MARKETPLACE_CHATGPT | medium; manual-data mode |
| 20 | `chatlabs.ru` | broad marketplace bots: text, stocks, prices, reviews, bids and other automation | BROAD_AUTOMATION_BOTS | boundary / mutation contamination |

## 4. Aggregate composition

```text
DIRECT_TARGET_CONNECTION = 2/20
ADJACENT_INTEGRATION_MECHANISM = 4/20
GENERAL_MARKETPLACE_CHATGPT = 4/20
CARD_CONTENT_GENERATION = 7/20
BROAD_AUTOMATION_BOTS = 1/20
NOISE_OTHER_INTENT = 2/20
TOTAL = 20/20
```

A second useful view is ranking position rather than only whole-SERP count:

- exact own-AI/marketplace connection occupies **ranks 1 and 2**;
- direct + adjacent integration mechanisms occupy **6 of the top 10**: ranks `1,2,4,8,9,10`;
- most card/content contamination is below the first two results and becomes increasingly common in the body/tail.

Therefore a simple `2/20` exact-target count would materially understate the intent. Yandex gives the most prominent positions to direct connection pages, then broadens the interpretation.

## 5. What R01 proves about F2

### Confirmed

1. **The own-AI connection job is search-real, not an invented product phrase.** The top two results directly address connecting ChatGPT/Claude to Ozon/Wildberries or their seller cabinets/data.
2. **Natural mechanism vocabulary exists.** Captured wording includes `подключить`, `напрямую`, seller cabinet/store, marketplace API/token, Actions, MCP/API/integration and avoiding repeated manual Excel export/upload.
3. **The expected user job is distinguishable from pure card generation.** Card/content pages are numerous, but they do not displace the direct connection pages from the top positions.
4. **Search recognizes both user-facing and technical connection framing.** Direct seller guides coexist with API/MCP/no-code/PIM integration examples.

### Not confirmed by R01

1. No final Octoport page/URL is authorized.
2. R01 does not prove whether one generic F2 page or separate Ozon/WB pages should own demand.
3. Competitor mutation/automation promises do not prove Octoport supports those actions.
4. A competitor saying connection takes a particular number of minutes does not become an Octoport claim.
5. Result snippets do not prove complete feature sets of ranking pages; that is M4 corpus work.

## 6. Relationship to S01-S03 F1 evidence

Accepted F1 evidence already showed a coherent marketplace AI-agent/API/data category. The S02/S03 paired comparison reviewed 40/40 rows and found:

- `11/20` clearly Ozon-specific results for S02;
- `11/20` clearly WB-specific results for S03;
- a recurring dual/generic core;
- only `6` exact shared URLs across the two 20-result sets;
- paired split/merge verdict `MIXED`.

R01 adds a different layer rather than duplicating F1:

- S01-S03 ask for an `AI agent` category/product;
- R01 asks how to **connect the user's existing ChatGPT/external AI** to a marketplace;
- R01's top positions are dominated by mechanism/how-to connection language;
- R01's overall tail is substantially noisier than the marketplace-specific agent SERPs.

Thus R01 closes the generic-mechanism uncertainty but leaves the marketplace-specific F2 split as a named unresolved decision.

## 7. Why R02 and R03 remain necessary

Current M3 authority defined R01 as the generic control and R02/R03 as the paired marketplace-specific check.

R01 now gives positive information gain for that pair:

1. Generic connection intent exists.
2. Generic wording still has substantial content-generation and adjacent-integration contamination.
3. Prior F1 paired evidence shows that adding `Ozon` or `Wildberries` can materially sharpen seller-side marketplace specificity.
4. We therefore still do not know whether `chatgpt для ozon` and `chatgpt для wildberries` resolve toward:
   - direct store/data connection;
   - broad ChatGPT seller advice;
   - content/card generation;
   - marketplace-specific product/integration pages;
   - materially different Ozon/WB expectations.

That is exactly the decision R02/R03 were designed to resolve.

```text
R02_INFORMATION_GAIN = STILL HIGH
R03_INFORMATION_GAIN = STILL HIGH PAIRED
R02_R03_REDUNDANT_AFTER_R01 = NO
```

## 8. Search-competitor signals for later M4

Do not convert these into business-rival labels yet. They are Search-surface candidates only.

High-priority F2 mechanism pages discovered by R01:

- `api-master.ru/blog/how-to-connect-chatgpt-to-ozon-wb` — rank 1;
- `jafo.ru/blog/podklyuchit-claude-chatgpt-k-wildberries-ozon` — rank 2.

Broader recurring/category surfaces worth carrying into the later competitor registry if they recur in additional queries:

- `jafo.ru`;
- `vc.ru`;
- `mpstats.io`;
- official `seller.ozon.ru`;
- YouTube/Habr only as SERP/content-surface evidence when relevant, not automatically commercial competitors.

M4 must later capture full-page architecture/claims/source lineage before competitive conclusions.

## 9. Product-truth and contamination controls

Observed SERP contamination reinforces existing boundaries:

- card/image/description generation is a separate large adjacent job;
- general ChatGPT advice is broader than Octoport's differentiating mechanism;
- Avito/Bitrix/PIM integrations demonstrate connection vocabulary but not marketplace-product fit;
- broad bots can include price/bid mutation and other actions outside Octoport launch scope;
- AI shopping/recommendation SEO is a different buyer/discovery problem;
- subscription-purchase results are lexical noise.

Octoport authority remains:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

Launch remains read/analyze/explain/prepare. R01 supplies market/search language, not permission to widen the product.

## 10. R01 closure decision

```text
R01_PROVIDER_LIFECYCLE = PASS
R01_EXPORT_INTEGRITY = PASS
R01_FULL_RAW_PERSISTENCE = PASS
R01_REMOTE_READBACK = PASS
R01_FULL_20_ROW_REVIEW = PASS
R01_PRIMARY_SERP_CLASS = MIXED_CONNECTION_SERP
R01_GENERIC_F2_MECHANISM = CONFIRMED
R01_EXACT_TARGET_HEAD = STRONG
R01_WHOLE_SERP_CONTAMINATION = MATERIAL
R01_FINAL_PAGE_OWNERSHIP = UNRESOLVED_BY_DESIGN
R01 = CLOSED
```

No additional R01 Search call is justified now.

## 11. Next action

Proceed to **R02 pre-step only**, not directly to a provider call:

`R02 = chatgpt для ozon`.

R02 still requires its own query-specific research/release artifact, current source-to-method trace, provider/Bridge contract reconciliation, information-gain contract, persistence plan and owner-facing disclosure before its first `start`.

R03 remains blocked until R02 lifecycle/result is durably closed and analyzed, because the pair must remain linear and comparable.

M7 Collection Freeze remains blocked.
