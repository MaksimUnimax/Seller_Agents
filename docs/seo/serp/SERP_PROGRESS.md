# SEO SERP collection — execution progress

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `S02_WAITING__EARLY_COLLECT_GUARDED`.
Master authority: `../SEO_MASTER_ROADMAP_2026-09-16.md`.

## Evidence rule

For every bridge/provider response:

1. save the complete received lifecycle envelope under `serp/raw/`;
2. verify the GitHub write by reading it back;
3. save lifecycle/query analysis separately under `serp/analysis/`;
4. preserve the exported normalized SERP authority with source hash/provenance under `serp/exports/`;
5. update progress;
6. only then release the next provider action/query.

Local admission errors, local `start`, and local due-time guards with `request_executed:false` do not count as provider calls.

## Isolation

- write only under `docs/seo/**`;
- do not touch server/runtime/site implementation;
- do not merge into moving `main` without a fresh overlap check.

## S01 — `ии агенты для маркетплейсов`

Status: `CLOSED / 20 NORMALIZED RESULTS`.

- job id: `octoport-serp-s01-20260916`;
- operation id: `sprjotiech5gn23a4tq3`;
- collect revision: `5`;
- normalized result rows: `20`;
- all successful: `true`;
- normalized authority: `exports/S01_ИИ_АГЕНТЫ_ДЛЯ_МАРКЕТПЛЕЙСОВ_NORMALIZED_2026-09-16.json`;
- source attachment hash-pinned; no model-byte reconstruction.

S01 establishes a real marketplace AI-agent SERP layer, but final page ownership remains blocked until M7.

## S02 — `ии агент для озон`

Purpose: test whether Ozon-specific wording has distinct commercial/product intent, recurring Ozon-specific competitors/pages, and materially different page types versus generic S01.

### Lifecycle

| Attempt | Stage | Status | Provider request executed | Evidence |
|---|---|---|---|---|
| S02-01 | `start` | `START_ACCEPTED_PENDING` | `false` | `raw/S02_01_START_2026-09-16.md` |
| S02-02 | `submitN` | `ACCEPTED_WAITING` | `true` | `raw/S02_02_SUBMIT_2026-09-16.md` |
| S02-03 | `collectN` | `NO_DUE_OPERATIONS` | `false` | `raw/S02_03_COLLECT_NOT_DUE_2026-09-16.md` |

### Current state

- job id: `octoport-serp-s02-20260916`;
- accepted operation id: `sproisueh6ivih75sbu9`;
- control: `RUNNING`;
- total items: `1`;
- `PENDING:0`;
- `WAITING:1`;
- requests started: `1`;
- operations accepted: `1`;
- polls started: `0`;
- unresolved: `1`;
- all successful: `false`;
- revision: `2`;
- provider submissions for S02: `1`;
- provider-backed collects for S02: `0`;
- local not-due collect guards for S02: `1`.

### Interpretation of S02-03

`S02-03` was local-only:

- `request_executed:false`;
- `provider_calls:0`;
- `last.code:NO_DUE_OPERATIONS`.

It is not a failed provider request, not a zero-result observation and not permission to resubmit. `normalized:0` means no result was collected in this local guard step; it does not mean Yandex returned zero SERP rows.

### Next allowed action

After more waiting, exactly one:

`SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-s02-20260916","count":1}`

Do not issue another `start` or `submitN` for S02. If another local `NO_DUE_OPERATIONS` appears, preserve/read back it and wait again. If provider-backed collection succeeds, preserve/read back before export.

## Current totals

- completed/exported M3 queries: `1`;
- active M3 queries: `1`;
- successful provider submissions: `2` total (`S01` + `S02`);
- successful provider-backed collects: `1` total (`S01`);
- local admission failures: `2`;
- local not-due guards: `2` total (`S01` + `S02`);
- provider failures: `0`;
- current master stage: `M3 Ordinary Yandex SERP collection`;
- next action: same S02 `collectN count=1` later; no resubmit.

## Bridge/UI observation

The S01 popup could show `Нет локального deferred Search job` while command lifecycle retained and later successfully collected the job. Lifecycle/export evidence remains authority while that UI bug is repaired separately.
