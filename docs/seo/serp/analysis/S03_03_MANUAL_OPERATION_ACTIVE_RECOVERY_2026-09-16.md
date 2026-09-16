# S03-03 — MANUAL_OPERATION_ACTIVE recovery analysis

Date: 2026-09-16.
Query: `ии агент для wildberries`.
Job: `octoport-serp-s03-20260916`.
Accepted provider operation from S03-02: `spr9s36a5612vaq2a2ma`.

## Observed event

The attempted `collectN` did not reach Yandex Search. The installed runtime returned:

- bridge version: `0.1.9`;
- stage: `MANUAL_ADMISSION`;
- code/message: `MANUAL_OPERATION_ACTIVE`;
- recoverable: `true`;
- request_executed: `false`;
- automatic_retry: `false`;
- provider operation in this error: `null`.

Exact raw authority: `../raw/S03_03_COLLECT_MANUAL_OPERATION_ACTIVE_2026-09-16.md`.

## Interpretation boundary

This event proves only that the Bridge refused this manual command because a manual operation was active at admission time.

It does NOT prove:

- provider failure;
- zero SERP results;
- loss of accepted Search operation `spr9s36a5612vaq2a2ma`;
- permission to resubmit S03;
- permission for automatic retry.

Because `request_executed:false`, this attempt caused no Yandex Search provider call.

## Runtime authority drift

S03 was prepared against accepted YMB `0.1.8` behavior. The current runtime now reports `0.1.9`.

Repository check performed after the error:

- accepted durable Search source branch `hotfix/ymb-durable-search-job-scope-2026-09-16` still reports `VERSION: "0.1.8"` in `extension/src/shared/product.js`;
- repository code search for literal `MANUAL_OPERATION_ACTIVE` and `0.1.9` returned no matching source on the searchable default branches;
- therefore the exact committed source/release authority for installed runtime `0.1.9` is currently unresolved from available repository evidence.

This source-authority gap blocks assumptions about new 0.1.9 behavior, but does not require a new Search submit because the already accepted provider operation identity is durable evidence from S03-02.

## Safe recovery contract

No new `start` or `submitN` is allowed.

The only bounded recovery candidate is the same existing-job collect:

`SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-s03-20260916","count":1}`

It may be attempted once only after the current manual-operation lock is no longer active.

Outcome rules:

- provider-backed `SUCCEEDED`/received -> persist/readback, then export;
- local `NO_DUE_OPERATIONS` -> persist/readback and wait;
- repeated `MANUAL_OPERATION_ACTIVE` -> persist/readback and STOP; do not loop;
- job-not-found / owner-scope / version-specific error -> persist/readback and reconcile 0.1.9 before any further command;
- any uncertain/provider error -> preserve truth; never resubmit the Search operation blindly.

## Current verdict

`S03_SEARCH_OPERATION_RESUBMIT_ALLOWED = false`.

`S03_EXISTING_OPERATION_COLLECT_RETRY_ALLOWED = CONDITIONAL_ON_MANUAL_LOCK_CLEAR`.

`YMB_0_1_9_SOURCE_AUTHORITY = UNRESOLVED`.
