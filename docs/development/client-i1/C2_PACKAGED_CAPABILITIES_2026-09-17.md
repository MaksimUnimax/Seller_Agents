# C2.2-C packaged local capability authority

Status: `IMPLEMENTATION_CANDIDATE / ACCEPTANCE_PENDING`

Task scope: define the independent local/package side of the server-owned rule `effective capability = packaged local capability AND signed feature/entitlement permission` without yet defining the signed-permission mapping or granting any execution authority.

## Why this is a separate step

C2.2-B proved that Bootstrap V2 signed `features`, `entitlements`, and AI profile metadata can be exposed after the accepted verification/cache policy without becoming executable authority. The server handoff separately requires a local packaged-capability intersection before cached/signed policy can authorize execution.

The current package already contains reviewed Ozon and Wildberries marketplace adapters and local ChatGPT/Alice web adapter identities, but before C2.2-C there is no independent canonical packaged capability registry. Remote feature/entitlement keys are server-owned machine identifiers and are not assumed to have the same namespace or meaning as local package capability ids.

C2.2-C therefore creates only the local half of the future intersection.

## Packaged authority

`packages/control-client/src/packaged-capabilities.js` publishes `SellerAgentsPackagedCapabilities` as an immutable, package-local authority.

Schema: `packaged_capability_manifest_v1`.
Authority marker: `PACKAGED_LOCAL_ONLY`.

The initial reviewed registry contains exactly four adapter-presence capabilities that are already evidenced by the current composed package:

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

It performs no network, storage, auth, bootstrap, cache, clock, provider, or scheduler operation.

## Composition

The module is loaded from the deterministic `worker_prelude` before the control client. Its authority therefore comes from the package bytes selected by the reviewed composition recipe, not from runtime server data.

C2.2-C does not modify the donor runtime, application Work implementation, marketplace providers, signed bootstrap payload, server contracts, database, OpenAPI, or migrations.

## Explicit non-goals

This candidate does **not**:

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

The historical WB `entitlement_policy.js` remains donor/reference evidence and is not promoted to this new control-plane capability authority.

## Focused acceptance gate

`tests/regression/extension-core/client-i1/client-packaged-capabilities.mjs` runs against both composed source and extracted package runtimes and proves:

1. exact registry/schema/authority with the four reviewed packaged adapter-presence facts;
2. strict lookup with no inference for unknown, remote-looking, or malformed ids;
3. the API, manifest, arrays, and rows are frozen inside the extension realm;
4. even a correctly signed bootstrap whose remote keys happen to equal local capability ids remains separate: signed metadata has `executionAuthority: false`, local `signedPermissionBindings` remains empty, and no binding/grant is inferred;
5. local capability lookup performs zero storage/network work after normal control-client initialization.

The focused gate is registered in the full Extension I1 source + extracted-package checker. Existing C1/C2.1/C2.2-A/C2.2-B, common application, Ozon/WB, browser, installed-local, documentation, and packaging gates remain required.

## Acceptance rule and next boundary

C2.2-C may be accepted only after exact-tree source/package/browser/installed-local/remote evidence is green and the final diff confirms that no execution path consumes the new manifest as permission.

After C2.2-C, the next step is still **not automatically offline Work**. A separate bounded design must identify explicit, reviewed server signed-permission keys and define a fail-closed mapping/intersection with this packaged authority. Unknown/missing signed keys must remain unable to activate a local capability, and a signed allow must never manufacture a capability absent from the package.
