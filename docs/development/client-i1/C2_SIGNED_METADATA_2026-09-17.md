# C2.2-B signed bootstrap metadata projection

Status: `ACCEPTED / REMOTE VERIFIED`

Task scope: expose already verified Bootstrap V2 metadata to later client consumers without turning that metadata into Work, dispatch, replay, provider, scheduler, or local-capability authority.

## Authority finding

The current control client verifies the signed Bootstrap V2 envelope with the packaged Ed25519 trust ring, validates the account/device/browser/extension context, validates the resolved AI profile shape, and recomputes `ai.profile.contentSha256` over the signed profile content and compatibility object.

That fingerprint is an integrity binding inside the signed server profile. It is not a comparison against an independently packaged local profile fingerprint. The checked-in packaged client configuration contains origins, extension/contract versions, and the trust bundle, but no canonical local AI-profile fingerprint registry and no packaged feature/capability registry.

The server bootstrap contract exposes separate top-level `entitlements` and `features` maps. Server policy resolves `features` to booleans, while the server-owned I1-SRV.4 handoff requires effective executable capability to remain the intersection of a packaged local capability and signed feature/entitlement permission. Remote signed metadata therefore cannot activate a local capability that is not independently present.

C2.2-B does not invent that missing local authority.

## Implementation boundary

`packages/control-client/src/signed-metadata.js` wraps the already accepted `SellerAgentsControlClient.bootstrapWithPolicy()` path and adds `getVerifiedBootstrapMetadata(options)` to the public privileged client object.

The method inherits C2.2-A's exact acquisition and verification path. It does not perform its own network request, signature verification, cache eligibility decision, clock calculation, persistence, refresh, or auth transition.

The returned projection is a detached frozen object with:

- `metadataVersion = signed_bootstrap_metadata_v1`;
- `source = ONLINE | CACHE`;
- `freshness = FRESH | STALE_BUT_OFFLINE_GRACE_ELIGIBLE`;
- `executionAuthority = false` always;
- signed `configVersion` and `accessBasis`;
- `signedEntitlements`, copied without client-side execution semantics;
- `signedFeatures`, copied without client-side execution semantics;
- signed AI state; when resolved, the already validated detected identity and profile are copied; account-only `UNCONFIGURED` remains account-only.

No `capabilities` or `workAllowed` field is synthesized by this projection.

The wrapper is loaded immediately after the existing control client in the composed service-worker prelude. It delegates every existing client method unchanged and does not modify the application Work guards.

## Explicit non-goals

This acceptance does **not**:

- grant stale-cache/offline Work;
- alter `authority.workAllowed`, `runtimeLastCheckpointAllowed`, or cache freshness rules;
- wire `bootstrapWithPolicy()` or the metadata projection into Ozon/WB Work Start, Resume, command dispatch, delivery, recovery, quota handling, or scheduler paths;
- interpret any signed feature/entitlement key as an executable local capability;
- create a local capability registry;
- create an independent packaged AI-profile fingerprint authority;
- add server fields, migrations, HTTP routes, OpenAPI changes, or a second trust source;
- change the signed envelope, payload, cache-binding, or cache-clock format;
- authorize provider replay or joint offline command/result completion;
- close full C2, I1, D2, D3/S2, S1.2, beta, deployment, or release.

## Focused acceptance gate

`tests/regression/extension-core/client-i1/client-signed-metadata.mjs` runs against both composed source and extracted package runtimes. It proves:

1. the bounded metadata API is actually packaged;
2. online signed features, entitlements, and resolved profile are projected exactly while `executionAuthority` stays false and no executable `capabilities`/`workAllowed` surface is created;
3. stale-but-grace-eligible verified cache can expose metadata while Work remains denied;
4. cached AI context is exact and a ChatGPT snapshot cannot be borrowed as Alice metadata;
5. account-only signed configuration remains `UNCONFIGURED` and does not fabricate a profile or Work grant.

Exact tested implementation head: `8a5d9e6ca611d69512ad28fc00684c63bdc87324`, tree `1fb11a510d6dd314a0647c5348e56d1a26bc007e`.

Remote evidence on that exact implementation tree:

- focused signed-metadata gate: `5/5 PASS` on source and `5/5 PASS` on extracted package;
- full Extension I1 checker: `102/102 PASS`;
- Extension I1 run `35187262735`: SUCCESS, including browser verifier and installed-local API/portal/PostgreSQL acceptance;
- Documentation run `35187264986`: SUCCESS;
- Extension CI PR run `35187264983`: SUCCESS, including Ozon/WB preserved baselines, WB browser fixture, common core source/package and native Chromium application fixture;
- Extension CI push run `35187262733`: SUCCESS on the same implementation head;
- browser verifier: Chromium `151.0.7922.34`, valid signed snapshot accepted and tamper rejected;
- installed-local: PASS, two distinct fixture accounts/device-session/authorization tuples, logout cleanup PASS, beta state unchanged, live provider calls `0`;
- deterministic package: `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`, `1,837,324` bytes, SHA-256 `5badfd1a67a824ecd160694fdb45ee25fb2dac27386e22ab93145eeaca4b6afa`, source/extracted/ZIP `39/39/39` files with zero byte mismatches.

Server CI was not re-triggered for C2.2-B because the exact diff contains no server, contract, schema, migration, OpenAPI, or server-document change. The accepted base server authority remains unchanged; the exact C2.2-B head still passed installed-local API/portal/PostgreSQL integration. No meaningless server-file touch is introduced only to force a path-filtered workflow.

Full acceptance receipt: `docs/migration/evidence/extension-i1-c2-2b-2026-09-17/r1/`.

## Acceptance rule and next boundary

C2.2-B is accepted only for the signed metadata projection above. The final implementation diff confirms that no Work/application/provider/scheduler execution path acquired a new permission from this layer.

A later step that wants executable capabilities must first define and package an independent local capability authority and then intersect that packaged authority with signed feature/entitlement permission as required by the server handoff. Offline Work remains closed until separately designed, implemented, and accepted.
