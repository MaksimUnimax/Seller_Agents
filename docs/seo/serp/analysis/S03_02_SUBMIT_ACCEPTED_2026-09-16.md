# S03-02 analysis — deferred Search submit accepted

Дата: 2026-09-16.
Query: `ии агент для wildberries`.
Job: `octoport-serp-s03-20260916`.
Operation: `spr9s36a5612vaq2a2ma`.

## Observed facts

- `action: submitN`;
- `ok:true`;
- `request_executed:true`;
- `provider_calls:1`;
- `processed:1`;
- `normalized:0`;
- `last.outcome:accepted`;
- accepted operation id: `spr9s36a5612vaq2a2ma`;
- job state: `WAITING:1`;
- requests started: `1`;
- operations accepted: `1`;
- polls started: `0`;
- unresolved: `1`;
- revision: `2`.

## Interpretation

This is a successful provider submission, not a completed SERP result. `normalized:0` means no normalized result item has been collected yet; it must not be interpreted as zero organic results.

The operation identity is now authoritative and must be reused for collection. A second `start` or `submitN` would violate the exactly-once/deferred lifecycle contract while the operation is pending.

The next permissible lifecycle action is `collectN` for the same job after the deferred due-time guard permits polling. If an early collect returns local `NO_DUE_OPERATIONS` with `request_executed:false`, preserve/read back it and wait. If a provider-backed collect succeeds, persist/read back before export.

## Claim boundary

No S03 search-intent, competitor, Wildberries-vs-Ozon split/merge, or page-ownership conclusion is available from this envelope. Those require the exported normalized SERP rows.
