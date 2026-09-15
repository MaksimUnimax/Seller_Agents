# I1-C1 client status

Status: development candidate implementation complete in the assigned client branch. This is not a release, beta acceptance, full I1, D3 logout, or preprod evidence.

Base: `bc0cd0088ca50ba06021ea602a46bdd90de91378` (fresh `origin/main` at start). Initial assigned head: `ba7ca3185dd3e3141af505697642e07b49d6e864`. Implementation head: `b00fc7c3cc2fe14f9833fa48947e95b5a8a755ca`; evidence/publication head: `eb665f504659db29b73219472875a1cfd3f72c17`.

## Implemented

- Added a browser-only privileged control client for device authorization, portal URL construction, pending polling, stable exchange idempotency, refresh singleflight and rotation markers.
- Added strict browser WebCrypto Ed25519 verification for bootstrap V2: packaged trust bundle, SPKI/fingerprint checks, canonical UTF-8 JSON, duplicate/extra-field rejection, exact signed bytes and V2-only account binding.
- Connected the catalog and work guards to the verified signed `account.id`; legacy global development credentials remain isolated and are not migrated into a real account.
- Added popup login/pending-code UI without exposing tokens or `deviceCode`, local authority reset, generation invalidation, source/package deterministic composition and an I1-specific CI workflow.

## Requirement mapping

| Requirement/scenario | Client evidence |
| --- | --- |
| SA-AUTH-01, A13 | `SA_AUTH_START`, portal `/activate?authorizationId=…`, private pending state and no secret in popup state |
| SA-SHOP-01/04, SA-DATA-02, A20/A30 | account-scoped catalog port and async guards; A→B isolation is covered by catalog regression and authority invalidation |
| SA-WORK-01/02/03, A31 | signed authority and local work/session guards; existing Ozon/WB no-replay/Finish/context assertions remain green |
| SA-SYNC-01/02, SA-QUOTA-01, A32 | local session generation and existing queue/quota guards; control requests are not added to ordinary marketplace dispatch |
| D-14/D-17/D-25/D-36/D-37 | packaged origins/trust input, one auth lifecycle, strict V2 verifier, privileged storage, no server imports |

## Verification

The I1 checker passed source and extracted package gates (84 processes), including syntax, Ozon/WB application/context regressions, worker lifecycle, refresh singleflight, strict verifier fixtures and deterministic ZIP/readback. The native Chromium gate is present in CI but did not complete in this local environment: system Chrome 147 headless extension startup hung with the host filesystem at 100%; this is not recorded as PASS.

An own disposable PostgreSQL tmpfs container was migrated, and own API/portal processes used ports `43100`/`43101`. The real local smoke reached OTP login (fixed local test delivery `424242`), portal account selection/approval, device exchange and signed `bootstrap_envelope_v2`. OTP delivery is synthetic local evidence only; it does not prove email delivery or preprod readiness. The extension-installed browser flow still needs the CI/native gate with the server harness wired to its packaged public trust bundle.

Commands:

```text
python tooling/build/extension_composed.py --output build/i1-client-package
SA_NODE_BIN=/path/to/node24/bin/node python tooling/checks/extension_i1.py --output build/i1-client-check
python tests/regression/extension-core/client-i1/browser_verifier.py --runtime build/i1-client-check/package/runtime --output build/i1-client-browser
```

Environment used locally: Node `v24.21.0`, pnpm `10.34.5`, Python `3.10.12`, Chromium native gate not completed. Package receipt from the final implementation build: `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`, SHA-256 `93a27674aa610b4ca3275ab6691cf3ff035b213d02c62b8a17375878c6c96ea0`.

## Open dependencies and handoff

I1-SRV.4 offline/error/clock policy and I1-SRV.5 final server handoff were not accepted in the inspected main and are not invented here. C2 must reconcile their final contracts, consume signed Work policy/profile semantics, and repeat installed online acceptance with the server-exported public trust bundle. Full logout retain/delete, backup/relay/store sync, live marketplace/AI, email delivery, preprod, all-browser support and browser-store release remain open.

Proposed common-document update after synchronization:

> I1-C1 client implementation is available as a LOCAL DEVELOPMENT candidate: browser device activation, signed bootstrap V2 account binding, privileged token lifecycle and account-scoped catalog/work invalidation are implemented. Acceptance remains open for native installed online flow against the final I1-SRV.4/.5 handoff, signed Work policy/autonomy, real email delivery, preprod and release controls. This does not close full I1, D3, S1.2, Health/H3/P8 or marketplace/browser-store acceptance.
