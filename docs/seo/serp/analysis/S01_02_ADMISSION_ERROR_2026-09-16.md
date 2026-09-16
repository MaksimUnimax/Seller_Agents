# SERP analysis — S01-02 repeated local admission failure

Дата: 2026-09-16.
Query: `ии агенты для маркетплейсов`.
Evidence: `../raw/S01_02_ADMISSION_ERROR_2026-09-16.md`.

## Observed facts

The second attempt returned the same local bridge admission error:

- runtime: `yandex-marketing-bridge 0.1.8`;
- reported active service: `wordstat`;
- stage: `MANUAL_ADMISSION`;
- code: `SERVICE_NOT_ACTIVE`;
- recoverable: `true`;
- request executed: `false`;
- automatic retry: `false`.

## Interpretation

The second attempt still did not reach the Yandex Search provider. Therefore it remains non-billable provider-wise and produces no SERP evidence.

The repeated envelope proves only that the bridge still considered Wordstat active at the instant of that attempt. It does not prove anything about the UI state after the user later changed the service selection.

## Next action

The user now reports that the active service has been changed. Repeat the exact same deferred Search `start` once. Do not issue `submitN` until the returned start envelope is persisted and verified.
