# SERP analysis — S02 `ии агент для озон`

Дата: 2026-09-16.
Статус: `SERP_OBSERVED / S02 EVIDENCE CLOSED`.

Evidence:

- source attachment: `search-octoport-serp-s02-20260916-r5-0-0.json`;
- source size: `87159` bytes;
- source SHA-256: `b67eaba22dc8b3a949ecddbcf87646ede7141ff5d2cf660d875084c88a3b3bf2`;
- normalized authority: `../exports/S02_ИИ_АГЕНТ_ДЛЯ_ОЗОН_NORMALIZED_2026-09-16.json`;
- job: `octoport-serp-s02-20260916`;
- operation: `sproisueh6ivih75sbu9`;
- revision: `5`;
- result rows: `20`;
- validation: `usable_for_url_comparison:true`, no missing/unsafe URL ranks.

## 1. What S02 was meant to resolve

S02 tests whether Ozon-specific agent wording behaves as a materially distinct search surface rather than merely repeating the generic `ии агенты для маркетплейсов` SERP.

This is evidence for later split/merge and page-ownership decisions; it does not itself authorize an `/ozon` page.

## 2. Dominant observed intent

The top-20 is strongly centered on **AI agent / assistant connected to Ozon seller operations and data**, not on card-generation alone.

Material observed themes include:

- direct Ozon seller-cabinet / Seller API connection;
- natural-language work with store data;
- analytics, orders, inventory, finance and FBO/FBS context;
- seller automation / operational actions;
- reviews/questions handling;
- comparisons between an agent, dashboard/repricer and connectors;
- product/service landings plus explanatory guides.

Obvious card/content-generation contamination still exists, especially ranks `16`, `17` and `20`, but it is not the dominant top-result pattern for this query.

## 3. Page/result types

The SERP contains a mixed but coherent category surface:

- product/service home or use-case landings: e.g. JAFO, Berkuz, SamResh use case, MarketAut;
- marketplace-specific integration/app pages: Intly Ozon, Promto Ozon;
- marketplace-specific product/guides: JAFO Ozon, SuperIntellect Ozon;
- editorial/how-to/integration content: vc.ru, SamResh resource, AInsider, ASI Biont, Airassvet, Softrest;
- official marketplace editorial content: `seller.ozon.ru`;
- card/content-generation control noise: Neiro-card and Klerk list content.

Observed result-type mix means the user task is broader than “find an image/card generator”; it includes choosing/understanding/connecting an AI agent to an Ozon seller workflow.

## 4. S01 ↔ S02 recurrence and overlap

Confirmed recurring domains across both query families:

| Domain | S01 generic rank(s) | S02 Ozon rank(s) | Observation |
|---|---:|---:|---|
| `berkuz.ru` | 1 | 3 | same product home URL appears in both |
| `marketaut.ru` | 15 | 14 | same product home URL appears in both |
| `jafo.ru` | 18 | 1, 6 | home recurs plus dedicated Ozon guide |
| `superintellect.ru` | 19 | 8, 11 | same domain, Ozon-specific pages replace generic guide |

Exact URL overlap identifiable between the two top-20 sets includes at least:

- `https://berkuz.ru/`;
- `https://marketaut.ru/`;
- `https://jafo.ru/`.

The Ozon SERP also introduces dedicated marketplace-specific URLs not present as exact URLs in S01, such as:

- `samreshuuu.ru/resources/kak-podklyuchit-ii-k-ozon`;
- `jafo.ru/blog/ii-agent-dlya-ozon`;
- `superintellect.ru/guides/ozon-ii-agent-dlya-prodavca`;
- `intly.ru/integrations/ozon`;
- `promto.ai/apps/ozon`.

Interpretation: generic category authority clearly carries into the Ozon SERP, but Yandex also rewards Ozon-specific documents. This is **positive provisional evidence for a distinct Ozon Page Job**, not yet a final CREATE decision.

## 5. Product-fit boundary for Octoport

S02 is highly relevant to Octoport because several ranking pages frame the category around exactly the mechanics we need to research further:

- marketplace API connection;
- seller-owned store data;
- dialogue / natural-language interaction;
- reports/analytics/operational data;
- using external AI or an AI agent on top of marketplace data.

However, many ranking competitors promise mutations/actions such as changing prices, cards, bids or posting replies. Octoport launch scope is read-only. Those mutation terms remain **market evidence**, not permitted public Octoport launch promises.

## 6. New vocabulary / M6 candidates exposed by S02

Do not call providers yet. Record as later gap candidates to reconcile after more M3/M4 evidence:

- `подключить ИИ к Ozon` / `подключить ИИ к кабинету Ozon`;
- `Ozon Seller API + ИИ/агент`;
- `ИИ для аналитики продавца Ozon`;
- natural-language questions over Ozon store data;
- FBO/FBS analytics/data wording;
- external-LLM-to-store wording seen in MarketAut-style positioning.

These are hypotheses for later information-gain review, not immediately authorized Wordstat/Search calls.

## 7. Provisional classification

For the current query cluster:

`TARGET_PAGE_CANDIDATE / MARKETPLACE-SPECIFIC COMMERCIAL + EXPLANATORY INTENT — PROVISIONAL`.

Reason:

- product/service results are prominent;
- dedicated Ozon URLs rank materially;
- the user task is seller-side and API/data/operations oriented;
- generic category domains also recur, so final generic-vs-Ozon split still requires Wildberries comparison + broader M3 overlap evidence.

Final page ownership remains blocked until `M7 Collection Freeze` and M9 clustering.

## 8. Next evidence need

Run S03 `ии агент для wildberries` under the same Search settings. That query is the necessary paired control for determining whether marketplace-specific intent is symmetric and whether separate Ozon/WB Page Jobs are warranted.
