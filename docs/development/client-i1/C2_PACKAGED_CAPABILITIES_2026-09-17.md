# C2.2-C packaged local capability authority

Status: `ACCEPTED / REMOTE VERIFIED`

Task scope: define the independent local/package side of the server-owned rule `effective capability = packaged local capability AND signed feature/entitlement permission` without yet defining the signed-permission mapping or granting any execution authority.

## Why this is a separate step

C2.2-B proved that Bootstrap V2 signed `features`, `entitlements`, and AI profile metadata can be exposed after the accepted verification/cache policy without becoming executable authority. The server handoff separately requires a local packaged-capability intersection before cached/signed policy can authorize execution.

The current package already contains reviewed Ozon and Wildberries marketplace adapters and local ChatGPT/Alice web adapter identities, but before C2.2-C there was no independent canonical packaged capability registry. Remote feature/entitlement keys are server-owned machine identifiers and are not assumed to have the same namespace or meaning as local package capability ids.

C2.2-C therefore creates only the local half of the future intersection.

## Packaged authority

`packages/control-client/src/packaged-capabilities.js` publishes `SellerAgentsPackagedCapabilities` as an immutable, package-local authority.

Schema: `packaged_capability_manifest_v1`.
Authority marker: `PACKAGED_LOCAL_ONLY`.

The accepted registry contains exactly four adapter-presence capabilities already evidenced by the current composed package:

- `marketplace.ozon.adapter` — the Ozon marketplace adapter is packaged;
- `marketplace.wildberries.adapter` — the Wildberries marketplace adapter is packaged;
- `ai.chatgpt.web.adapter` — the ChatGPT web adapter identity is packaged;
- `ai.alice.web.adapter` — the Alice web adapter identity is packaged.

Every row has `packaged: true` and `executionAuthority: false`.
The manifest itself has `executionAuthority: false`.
`signedPermissionBindings` is deliberately the empty array.

These ids are a local package namespace. They are not server `features` keys, not entitlement keys, not operation allowlists, and not a claim that a current account/session may execute Work.

The public API is intentionally small and pure:

- `snapshot()` returns the frozen packaged manifest;
- `has(id)` answers only whether a reviewed local capability id is packaged;
- `describe(id)` returns only the frozen local row or `null`.

The API object, manifest, arrays and rows are frozen. The global authority slot is published as non-writable and non-configurable. It performs no network, storage, auth, bootstrap, cache, clock, provider, or scheduler operation.

## Composition

The module is loaded from the deterministic `worker_prelude` before the control client. Its authority therefore comes from the package bytes selected by the reviewed composition recipe, not from runtime server data.

C2.2-C does not modify the donor runtime, application Work implementation, marketplace providers, signed bootstrap payload, server contracts, database, OpenAPI, or migrations.

## Explicit non-goals

This acceptance does **not**:

- bind a signed feature or entitlement key to any local capability id;
- compute `effective capability`;
- change `SellerAgentsControlClient.canWork()`;
- change Work Start/Resume, command discovery, command validation, dispatch, delivery, recovery, quota, file handling, or scheduler behavior;
- grant offline Work or stale-cache Work;
- add automatic provider retry/replay/polling/pagination;
- create an independent packaged AI-profile fingerprint registry;
- reinterpret provider-specific entitlement machinery as Seller Agents control-plane authority;
- add Amazon/other marketplace or other AI support;
- change server/contracts/schema/migrations/OpenAPI;
- close full C2, I1, D2, D3/S2, S1.2, beta, release, deployment, or live-provider acceptance.

The historical WB `entitlement_policy.js` remains donor/reference evidence and is not promoted to this control-plane capability authority.

## Focused acceptance gate

`tests/regression/extension-core/client-i1/client-packaged-capabilities.mjs` runs against both composed source and extracted package runtimes and proves:

1. exact registry/schema/authority with the four reviewed packaged adapter-presence facts;
2. strict lookup with no inference for unknown, remote-looking, or malformed ids;
3. the API, manifest, arrays and rows are frozen, and the global authority slot cannot be replaced;
4. even a correctly signed bootstrap whose remote keys happen to equal local capability ids remains separate: signed metadata has `executionAuthority: false`, local `signedPermissionBindings` remains empty, and no binding/grant is inferred;
5. local capability lookup performs zero storage/network work after normal control-client initialization.

Exact tested implementation head: `a1d0a9dc83daf80536f58bf56d498206da8a1eb3`, tree `1f7a54c0ac0c1c95b680071f7036f084715bac4c`.

Remote exact-tree evidence:

- focused packaged-capability gate: `5/5 PASS` on source and `5/5 PASS` on extracted package;
- full Extension I1 checker: `104/104 PASS`;
- Extension I1 run `35190621200`: SUCCESS, including browser verifier and installed-local API/portal/PostgreSQL acceptance;
- Documentation run `35190625142`: SUCCESS;
- Extension CI push run `35190621221`: SUCCESS, including common core, Ozon, WB Node, native Chromium application fixture and WB browser baseline;
- Extension CI PR run `35190625256`: SUCCESS with the same preserved baseline groups;
- browser verifier: Chromium `151.0.7922.34`, valid signed snapshot accepted and tamper rejected;
- installed-local: PASS, two distinct accounts/device-session/authorization tuples, logout cleanup PASS, beta state unchanged, live provider calls `0`;
- deterministic package: `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`, `1,839,269` bytes, SHA-256 `61e992cc28323c68bb2f448d88bb2d9ecc7ce2e0f1c9ced5de82b4ac2d123057`, runtime/extracted/ZIP `39/39/39` with zero byte mismatches;
- packaged authority source input: `2,072` bytes, SHA-256 `17783d63479ab5282b0414fd83bfcecbb8d0ed86f272c5e2f2005a081466e927`.

Server CI was not artificially re-triggered because the exact C2.2-C diff contains no server, contract, schema, migration, OpenAPI, or server-document path. Accepted server authority remains unchanged; the exact implementation head still passed installed-local API/portal/PostgreSQL integration.

The final implementation diff from the accepted C2.2-B integration base `27d1b1a1ec1fac15d284d20a42a27f95e1514924` contains only five paths: composition, the new packaged authority, its focused test, I1 test registration, and this design/acceptance document. No Work/application/provider/server execution file changed.

Full receipt: `docs/migration/evidence/extension-i1-c2-2c-2026-09-17/r1/`.

## Acceptance rule and next boundary

C2.2-C is accepted only for independent packaged-local capability presence authority. It does not grant execution.

The next step is still **not automatically offline Work**. A separate bounded design must identify explicit, reviewed server signed-permission keys and define a fail-closed mapping/intersection with this packaged authority. Unknown/missing signed keys must remain unable to activate a local capability, a signed allow must never manufacture a capability absent from the package, and signed denial must win. Prefer keeping that next step read-only/non-executing until its own acceptance is complete.
