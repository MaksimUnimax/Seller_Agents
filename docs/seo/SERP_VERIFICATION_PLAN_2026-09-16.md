# SEO SERP verification plan — post Wordstat Batch 02

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `READY`.

## Purpose

Validate live search intent for the Wordstat clusters that remain plausible for Octoport before assigning target pages, URLs, H1/Title states, or production copy.

This pass is intentionally bounded. It is not a new broad keyword-discovery round.

## Evidence rules

For every SERP query:

1. persist the complete received provider/search evidence before analysis;
2. record query, region/device context and provider metadata;
3. classify visible result intent from actual SERP evidence, not from the query wording alone;
4. distinguish product/tool pages, educational/course pages, content/card-generation tools, external marketplace analytics, native marketplace analytics, and seller-owned-data workflows;
5. do not infer an Octoport page role from a Wordstat count alone;
6. do not modify production site/runtime/server files in this pass.

## Priority queries

| Order | Query | Verification question |
|---:|---|---|
| 1 | `ии агенты для маркетплейсов` | Does the SERP describe agent-style operational tools, generic AI content tools, or educational material? |
| 2 | `ии агент для озон` | Is there a recognizable Ozon seller-tool/agent intent distinct from card generation? |
| 3 | `ии агент для wildberries` | Is there a recognizable WB seller-tool/agent intent distinct from card generation? |
| 4 | `какой ии для маркетплейсов` | What comparison categories do users actually receive: content generators, analytics, LLMs, agents, courses, or mixed? |
| 5 | `сервис аналитика продаж на маркетплейсах` | Is live intent external market intelligence, seller-account analytics, native MP analytics, or mixed? |
| 6 | `сервис внутренней аналитики маркетплейсов` | Does `внутренняя аналитика` mean native marketplace analytics, seller-owned internal data, or another category? |
| 7 | `ии для работы с маркетплейсами` | How much of the SERP is tooling versus training/education? |

## Control query

After the seven priority queries, optionally inspect:

`нейросеть помощь для маркетплейсов`

Purpose: confirm whether the live SERP is dominated by product-card/infographic generation, matching the Wordstat child vocabulary. This is a control, not a core product-fit candidate.

## Per-query capture matrix

For each priority query, capture at minimum:

- exact query;
- provider/request identifier;
- region/device/search context if supplied;
- visible organic result titles/URLs/snippets available from the provider;
- result-type classification;
- repeated commercial category terms;
- marketplace specificity (generic / Ozon / Wildberries);
- whether seller-owned marketplace data is implied;
- whether the result expects content creation or operational/data work;
- ambiguity/limitations.

## Decision gate after SERP pass

Only after the bounded SERP evidence is complete:

1. combine Wordstat counts with observed intent;
2. normalize/deduplicate query groups;
3. assign each cluster one status: `TARGET_PAGE_CANDIDATE`, `SUPPORTING_SEMANTICS`, `INFORMATIONAL_CONTENT_CANDIDATE`, `EXCLUDE_NOISE`, or `HOLD_AMBIGUOUS`;
4. then draft page-role architecture and page specs;
5. keep production implementation separate until those SEO artifacts are reviewed.

## Isolation rule

SEO stream writes only under `docs/seo/**`. Do not touch server/runtime/site implementation and do not merge into moving `main` without a fresh overlap check.
