# Wordstat Batch 01 — execution progress

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `IN_PROGRESS`.

## Persistence rule

Owner rule: every provider result is persisted to repository immediately after receipt. Analysis and the next provider command are allowed only after the raw evidence write succeeds. Chat history is never treated as the only copy of a result.

For every call:

1. save full received result/provenance under `wordstat/raw/`;
2. verify successful GitHub write;
3. save analytical interpretation separately under `wordstat/analysis/`;
4. update progress/cursor;
5. only then issue the next command.

## Parallel-development isolation

Owner reminder: server development is running in parallel and SEO work must not interfere with it.

Until a separate synchronization/review step:

- this working branch writes only under `docs/seo/**`;
- do not edit `apps/api`, `apps/portal`, `apps/admin`, `apps/worker`, `packages/server`, migrations, shared auth/contracts, extension runtime, or site runtime from the SEO stream;
- do not merge the SEO working branch into `main` blindly while parallel server/site work is moving;
- before any later PR/merge, re-check current remote `main`, inspect overlap, and resolve only documentation-level conflicts deliberately;
- Wordstat collection itself requires no server/runtime code changes.

## Calls

| Call | Seed | Status | totalCount | Request ID | Raw | Analysis |
|---|---|---|---:|---|---|---|
| B01-01 | ии для маркетплейсов | SUCCESS | 3381 | `wordstat-ee0583c8-f745-4c22-9212-cee56c5c444d` | `raw/B01_01_2026-09-16.md` | recorded in WORKLOG |
| B01-02 | нейросеть для маркетплейсов | SUCCESS | 3451 | `wordstat-a162cb60-3be5-4014-a203-de28cb0983da` | `raw/B01_02_2026-09-16.md` | recorded in WORKLOG |
| B01-03 | ии помощник селлера | SUCCESS | 20 | `wordstat-d3c54d70-cb22-42ec-a825-0e766803f0d9` | `raw/B01_03_2026-09-16.md` | `analysis/B01_03_2026-09-16.md` |
| B01-04 | аналитика маркетплейсов с ии | SUCCESS | 13 | `wordstat-d883fee5-3a1e-404e-884f-d50e890ee58e` | `raw/B01_04_2026-09-16.md` | `analysis/B01_04_2026-09-16.md` |
| B01-05 | ии для ozon | SUCCESS | 128 | `wordstat-fbd8e2dc-a426-4e95-9b20-51bdd31e07c7` | `raw/B01_05_2026-09-16.md` | `analysis/B01_05_2026-09-16.md` |
| B01-06 | ии для озон | SUCCESS | 972 | `wordstat-101b03ff-b998-457c-b9c0-d1a78c68d62c` | `raw/B01_06_2026-09-16.md` | `analysis/B01_06_2026-09-16.md` |
| B01-07 | ии для wildberries | SUCCESS | 225 | `wordstat-06614787-cd5e-4b68-a155-69c03ff700c2` | `raw/B01_07_2026-09-16.md` | `analysis/B01_07_2026-09-16.md` |
| B01-08 | ии для вайлдберриз | SUCCESS | 76 | `wordstat-a3e5829b-d04d-4061-9c66-96e1197f80af` | `raw/B01_08_2026-09-16.md` | `analysis/B01_08_2026-09-16.md` |
| B01-09 | chatgpt для маркетплейсов | SUCCESS | 67 | `wordstat-d76dd883-9acd-4ed7-b693-7a847722fb13` | `raw/B01_09_2026-09-16.md` | `analysis/B01_09_2026-09-16.md` |
| B01-10 | chatgpt для ozon | SUCCESS | 9 | `wordstat-4b69ad8c-a098-4551-a4f9-8d9873fe7136` | `raw/B01_10_2026-09-16.md` | `analysis/B01_10_2026-09-16.md` |
| B01-11 | chatgpt для wildberries | SUCCESS | 10 | `wordstat-9cf53937-17d9-4047-a37e-0b43deeb2b73` | `raw/B01_11_2026-09-16.md` | `analysis/B01_11_2026-09-16.md` |
| B01-12 | ии анализ продаж маркетплейсов | SUCCESS_EMPTY_RESULT | n/a | `wordstat-7fe638ab-f79b-461f-b54c-44230336238c` | `raw/B01_12_2026-09-16.md` | `analysis/B01_12_2026-09-16.md` |
| B01-13 | подключить ии к маркетплейсу | SUCCESS_EMPTY_RESULT | n/a | `wordstat-294bc81e-a90b-4f44-b68c-411407470a9c` | `raw/B01_13_2026-09-16.md` | `analysis/B01_13_2026-09-16.md` |
| B01-14 | сервис аналитики маркетплейсов | SUCCESS | 756 | `wordstat-8220c941-f1f0-4fd3-a052-0b16ca1cb447` | `raw/B01_14_2026-09-16.md` | `analysis/B01_14_2026-09-16.md` |

## Totals

- successful HTTP/provider calls: `14/15`;
- calls with usable `totalCount`: `12/15`;
- successful-empty result calls: `2`;
- provider failures: `0`;
- accumulated estimated cost: `0.28 ₽`;
- current cursor: `B01-15`;
- next seed: `как использовать ии для маркетплейсов`.
