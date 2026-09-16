# Wordstat Batch 02 — execution progress

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `IN_PROGRESS`.

## Persistence rule

For every provider response, the raw evidence file MUST contain the **entire received `WORDSTAT_RESULT_V1` envelope**, including every top-level field and every nested object/array that was returned. A raw file must not be replaced by only a status note, extracted table, shortened payload, or analytical paraphrase.

Required order:

1. save full provider envelope under `wordstat/raw/`;
2. verify the GitHub write;
3. save analysis separately under `wordstat/analysis/`;
4. update this progress file;
5. only then issue the next command.

If `result: {}` is returned, preserve that exact empty object and do not call it zero demand.

## Parallel-development isolation

SEO work remains isolated from parallel server development:

- write only under `docs/seo/**` in this stream;
- do not modify server/runtime/site implementation;
- do not merge into moving `main` without a fresh overlap check.

## Calls

| Call | Seed | Status | totalCount | Request ID | Raw | Analysis |
|---|---|---|---:|---|---|---|
| B02-01 | ии агенты для маркетплейсов | SUCCESS | 134 | `wordstat-b0eb0733-6829-4df8-b57c-4f5d2c6b0662` | `raw/B02_01_2026-09-16.md` | `analysis/B02_01_2026-09-16.md` |
| B02-02 | ии для работы с маркетплейсами | SUCCESS | 39 | `wordstat-b3cd4d29-e472-480b-bef1-a82d6febfb9c` | `raw/B02_02_2026-09-16.md` | `analysis/B02_02_2026-09-16.md` |
| B02-03 | ии для продаж на маркетплейсах | SUCCESS | 23 | `wordstat-0f933523-9845-4cc0-aa04-4ad1efa1c1ea` | `raw/B02_03_2026-09-16.md` | `analysis/B02_03_2026-09-16.md` |
| B02-04 | ии для аналитики маркетплейсов | SUCCESS | 15 | `wordstat-5c073ac7-66cc-4d89-ad24-995b70549326` | `raw/B02_04_2026-09-16.md` | `analysis/B02_04_2026-09-16.md` |
| B02-05 | ии ассистент для маркетплейсов | SUCCESS | 13 | `wordstat-57120cb9-82d5-417a-a541-78a8cdde3ca8` | `raw/B02_05_2026-09-16.md` | `analysis/B02_05_2026-09-16.md` |
| B02-06 | нейросети для менеджеров маркетплейсов | SUCCESS | 19 | `wordstat-03995393-bb9c-4518-8a56-ea923d78a3b9` | `raw/B02_06_2026-09-16.md` | `analysis/B02_06_2026-09-16.md` |
| B02-07 | ии агент для озон | SUCCESS | 40 | `wordstat-a6650845-14a6-48ef-bcf2-b83787463913` | `raw/B02_07_2026-09-16.md` | `analysis/B02_07_2026-09-16.md` |

## Totals

- successful HTTP/provider calls: `7/15`;
- calls with usable `totalCount`: `7/15`;
- successful-empty result calls: `0`;
- provider failures: `0`;
- accumulated estimated cost: `0.14 ₽`;
- current cursor: `B02-08`;
- next seed: `ии ассистент для озон`.
