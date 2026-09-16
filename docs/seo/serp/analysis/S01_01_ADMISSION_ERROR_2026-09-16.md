# SERP analysis — S01-01 local admission failure

Дата: 2026-09-16.
Query: `ии агенты для маркетплейсов`.
Evidence: `../raw/S01_01_ADMISSION_ERROR_2026-09-16.md`.

## Observed facts

- bridge: `yandex-marketing-bridge`;
- runtime version: `0.1.8`;
- response type: `YMB_ERROR_V1`;
- current service reported by bridge: `wordstat`;
- stage: `MANUAL_ADMISSION`;
- code: `SERVICE_NOT_ACTIVE`;
- message: `Deferred Search доступен только при активном сервисе Search.`;
- recoverable: `true`;
- request executed: `false`;
- automatic retry: `false`.

## Interpretation

This is a local bridge admission failure, not Yandex Search provider evidence. The intended Search request was rejected before provider execution because the extension's active service remained Wordstat.

The failed attempt therefore:

- does not count as a Search provider call;
- does not contribute SERP evidence for `ии агенты для маркетплейсов`;
- does not consume the planned provider-request budget;
- should not be automatically retried while the active service is still Wordstat.

## Recovery

Deferred Search remains under the bridge's Search service. Active-service checks are intentionally preserved; the bridge does not automatically switch Wordstat → Search.

Required recovery sequence:

1. manually select `Search` as the active service in the Yandex Marketing Bridge extension;
2. keep Manual mode / existing credential context unchanged;
3. repeat the same `SEARCH_ASYNC_BATCH_API_V1` `start` command for job `octoport-serp-s01-20260916`;
4. persist and verify the returned bridge envelope before any `submitN` action.

No page-routing or SERP-intent conclusion can be drawn from this error.
