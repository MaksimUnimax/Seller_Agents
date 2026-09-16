# Wordstat Batch 02 — targeted product-fit expansion

Дата подготовки: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `READY_NOT_STARTED`.

## Goal

Expand only product-adjacent vocabulary observed in Batch 01. Avoid spending the pass on the already-proven broad content/card-generation noise.

## Raw evidence rule

For every B02 response, persist the **entire received `WORDSTAT_RESULT_V1` envelope** verbatim/structurally complete under `wordstat/raw/` before any analysis. Do not replace provider evidence with a status line, extracted table, or summary.

If `result` is empty, preserve `result: {}` exactly and do not call it zero demand.

## Calls

All calls use:

- method: `getTop`;
- `numPhrases`: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

| Call | Phrase | Why this phrase |
|---|---|---|
| B02-01 | `ии агенты для маркетплейсов` | observed at 134 inside B01 broad root; closest category wording to product model |
| B02-02 | `ии для работы с маркетплейсами` | observed at 39; direct task-oriented wording |
| B02-03 | `ии для продаж на маркетплейсах` | observed at 23; sales/use-case wording |
| B02-04 | `ии для аналитики маркетплейсов` | observed at 15; narrower than broad analytics-with-AI seed |
| B02-05 | `ии ассистент для маркетплейсов` | observed at 13; assistant vocabulary aligns with product positioning |
| B02-06 | `нейросети для менеджеров маркетплейсов` | observed at 19; role-oriented demand hypothesis |
| B02-07 | `ии агент для озон` | observed at 40; strongest product-fit Ozon child phrase in B01 |
| B02-08 | `ии ассистент для озон` | observed at 10; Ozon assistant wording |
| B02-09 | `ии агент для wildberries` | observed at 20; product-fit WB child phrase |
| B02-10 | `сервис аналитика продаж на маркетплейсах` | observed at 39; commercial analytics wording |
| B02-11 | `сервис для аналитики продаж на маркетплейсах` | observed at 19; close variant to test expansion structure |
| B02-12 | `сервис внутренней аналитики маркетплейсов` | observed at 19; potentially closest analytics framing to seller-owned data |
| B02-13 | `нейросеть помощь для маркетплейсов` | observed at 517 but intent unclear; needs decomposition |
| B02-14 | `какой ии для маркетплейсов` | observed at 128; comparison/recommendation informational intent |
| B02-15 | `ии агент для селлера` | controlled seller-role variant derived from observed agent + seller/helper vocabulary |

## Decision gates after B02

Do not create final page architecture merely from counts. After B02:

1. normalize and deduplicate returned vocabulary;
2. separate product-fit from card/content-generation noise;
3. identify commercial vs informational vs marketplace-specific intent;
4. choose priority clusters for SERP verification;
5. only after SERP evidence assign target page roles and page specs.

## Isolation rule

This is documentation/evidence work only. Do not modify server/runtime/site implementation from this SEO stream and do not merge into moving `main` without a fresh overlap check.
