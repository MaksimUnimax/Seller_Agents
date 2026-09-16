# S02 vs S03 paired SERP comparison — Ozon vs Wildberries

Date: 2026-09-16.
Stage: `M3 — Ordinary Yandex SERP collection`.
Status: **COMPLETE PAIRED ANALYSIS / 40 OF 40 ROWS REVIEWED**.

Inputs:

- S02 `ии агент для озон` — 20 normalized rows, source SHA-256 `b67eaba22dc8b3a949ecddbcf87646ede7141ff5d2cf660d875084c88a3b3bf2`;
- S03 `ии агент для wildberries` — 20 normalized rows, source SHA-256 `006c9ca553d20ef210e19ea60ecd2ad7b2d4bae258b8587d8b9062886442ecd3`.

Both use identical request settings: Search RU, region 225, page 0, 20 flat groups, one doc per group, moderate family mode, typo correction off, relevance descending.

No sampling was used. All 40 normalized results were reviewed.

## 1. Exact overlap

Shared exact URLs: **6**.

| URL | S02 rank | S03 rank |
|---|---:|---:|
| `https://jafo.ru/` | 1 | 5 |
| `https://vc.ru/ai/3124090-podklyuchenie-ii-agenta-k-wildberries-i-ozon` | 2 | 3 |
| `https://berkuz.ru/` | 3 | 4 |
| `https://marketaut.ru/` | 14 | 8 |
| `https://itgalaxy.company/ai-agent-wildberries-ozon/` | 18 | 19 |
| `https://softrest.ru/blog/ii-agent-marketpleysov-tseny-ostatki` | 19 | 18 |

Exact-URL Jaccard over the two top-20 sets: `6 / 34 = 17.65%`.

Top-5 exact overlap is materially stronger: **3 shared URLs** — JAFO home, VC dual-marketplace connection article, Berkuz home.

## 2. Domain overlap

S02 unique domains: **17**.
S03 unique domains: **18**.
Shared domains: **8**.
Union domains: **27**.
Domain Jaccard: `8 / 27 = 29.63%`.

Shared domains:

- `jafo.ru`;
- `vc.ru`;
- `berkuz.ru`;
- `superintellect.ru`;
- `intly.ru`;
- `marketaut.ru`;
- `itgalaxy.company`;
- `softrest.ru`.

The first-page top-10 domain overlap is 4 domains: Berkuz, JAFO, SuperIntellect, VC.

## 3. Marketplace-specific vs dual/generic result orientation

Analyst coding based on URL/title/snippet and page scope:

### S02 Ozon

- clearly Ozon-specific: **11/20**;
- dual Ozon+WB: **7/20**;
- generic marketplace: **2/20**.

### S03 Wildberries

- clearly WB-specific: **11/20**;
- dual Ozon+WB: **6/20**;
- generic marketplace: **2/20**;
- broader multi-marketplace: **1/20**.

Therefore both SERPs contain a large marketplace-specific layer while retaining a recurring shared dual-marketplace core.

## 4. Paired site behavior

Several domains demonstrate both patterns at once: a shared generic/dual page plus separate marketplace-specific pages.

### JAFO

- shared home ranks S02 #1 / S03 #5;
- Ozon-specific blog ranks S02 #6;
- WB-specific blog ranks S03 #17.

### SuperIntellect

- Ozon-specific guide ranks S02 #8;
- second Ozon page ranks S02 #11;
- WB-specific guide ranks S03 #6;
- WB integration page ranks S03 #11.

### Intly

- dedicated Ozon integration page ranks S02 #9;
- dedicated WB integration page ranks S03 #16.

This is direct SERP evidence that Yandex can rank marketplace-specific pages from the same domain while also ranking generic dual-marketplace pages from other domains.

It does **not** prove Octoport must copy that information architecture.

## 5. Intent and task vocabulary

Both SERPs are seller-side and operational rather than dominated by generic AI content creation.

Repeated across both:

- seller cabinet / Seller API / official API;
- prices;
- stocks/остатки;
- reviews/questions;
- analytics/financial metrics;
- advertising;
- cards/catalog;
- ordinary-language chat/dialog;
- connect/integrate marketplace data to AI;
- automation/actions.

S03 has especially strong WB operational vocabulary: advertising bids, DRR, margins, FBS, prices, campaigns, official WB API, P&L, supply/stock tasks.

S02 carries more Ozon-native terminology: FBO/FBS, Ozon Performance, Client-ID/Api-Key, transactions/returns, Ozon Seller API.

## 6. Content-generation contamination

S02 contains at least three clearly content-generation-heavy results:

- seller.ozon.ru neural-network article focused on product-card creation;
- neiro-card.ai card/image-generation product;
- Klerk card-generation roundup.

S03 contains content/card capabilities inside some broader agent pages, but no equally clear pure card-generation page dominates the top-20. Its result set is cleaner around seller operations/automation/data tasks.

This supports treating agent vocabulary as materially different from broad `ии/нейросеть для маркетплейсов` content-generation roots observed in Wordstat.

## 7. Octoport-mechanic relevance

Strongly relevant mechanics appear on both marketplace SERPs:

- SuperIntellect Ozon/WB pages: seller data exposed to an AI agent, questions in ordinary language, answers in chat;
- VC dual-marketplace article: connection to seller cabinet/API, reporting/data access;
- MarketAut: connect a store to external LLMs such as ChatGPT/Claude/Gemini, though it promises mutation-heavy actions;
- Tablichki in S03: WB+Ozon data transformed into AI answers about profit/DRR/pricing.

This confirms a real search-visible mechanism close to Octoport's core model: marketplace data/API -> AI/dialog -> seller answer.

Boundary: many ranked competitors promise write actions, autonomous ad/price/card changes or other mutation-heavy automation. Octoport launch scope is read-only, so their action promises must not be copied into product claims.

## 8. Ozon-only and WB-only discovery

### Ozon-only notable domains/pages

- `samreshuuu.ru`;
- `ainsider.ru`;
- `asibiont.com`;
- `promto.ai`;
- `neiro.kimmeriets.ru`;
- official `seller.ozon.ru`;
- `neiro-card.ai`;
- `klerk.ru`.

### WB-only notable domains/pages

- `ai007.io`;
- `zinaida.pro`;
- `tulpari.ru`;
- `sam-x.ru`;
- `tablichki.tech`;
- `agentiq.ru`;
- `selleru.ai`;
- `habr.com` current multi-market integration article;
- YouTube seller-agent video.

The marketplace-specific long tails are therefore materially different even though the leading category core overlaps.

## 9. Split/merge implication

Pre-step allowed values: `SUPPORT_SPLIT | SUPPORT_MERGE | MIXED | HOLD`.

**Current paired result: `MIXED`.**

Why not `SUPPORT_MERGE`:

- 11/20 results in each SERP are marketplace-specific;
- marketplace-specific pages from JAFO, SuperIntellect and Intly rank independently;
- Ozon and WB long-tail competitors/tasks differ materially.

Why not `SUPPORT_SPLIT`:

- 6 exact URLs recur across both top-20 sets;
- 3 of 5 top results are shared exact URLs;
- 8 domains recur across both;
- strong generic dual-marketplace product pages rank for both queries.

Therefore the evidence currently supports a shared category core **plus** meaningful marketplace-specific intent, but does not yet determine final Octoport page ownership/IA.

Per owner rule, no final route/page design is allowed before broader evidence collection and M7 Collection Freeze.

## 10. Information gained / what changed

S03 materially changed our evidence state:

1. Wildberries-specific agent intent is real and not merely inherited from Ozon.
2. WB top-20 is strongly operational/commercial and cleaner than broad content-generation roots.
3. A stable shared category core exists across Ozon and WB.
4. Marketplace-specific long tails are also substantial.
5. Search-visible products already use both architectures: generic dual-marketplace pages and marketplace-specific pages.
6. Final split/merge remains unresolved by design and must be challenged by later M3/M4/M5 evidence.

## 11. Quality score of the paired analysis

- complete-row coverage: 10/10;
- provenance/parameter comparability: 10/10;
- exact URL/domain overlap accounting: 10/10;
- marketplace-specific classification: 9/10 — analyst-coded from title/snippet/page scope;
- intent/task analysis: 9.5/10;
- noise/adversarial check: 9.5/10;
- product-truth boundaries: 10/10;
- split/merge claim restraint: 10/10;
- reproducibility: 10/10;
- downstream readiness: 9/10 — broader M3/M4/M5 still intentionally open.

**Total: 96/100 = 9.6/10.**

## 12. Next gate

S03 evidence can be closed after normalized authority readback and competitor-registry update.

No S04 Bridge command may be issued until S04 receives its own fresh external research, owner-facing analysis, source-to-method trace, information-gain contract, Work-trigger evaluation, quality score and durable release/readback.