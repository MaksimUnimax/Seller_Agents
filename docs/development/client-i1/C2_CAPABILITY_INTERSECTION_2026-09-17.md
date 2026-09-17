# C2.2-D2 — read-only packaged/signed capability intersection

Status: `IMPLEMENTED_CANDIDATE / ACCEPTANCE_PENDING`.

## Purpose

C2.2-B exposes already verified signed Bootstrap V2 metadata without execution authority. C2.2-C defines the immutable package-local adapter-presence authority, also without execution authority. C2.2-D1 defines the explicit server-owned Seller Agents permission vocabulary:

- `source.ozon`;
- `source.wildberries`;
- `ai.chatgpt`;
- `ai.alice`.

D2 is the first bounded intersection of those accepted authorities. It is intentionally still read-only and non-executing.

## Reviewed binding table

`SellerAgentsCapabilityIntersection` packages exactly four explicit bindings:

| packaged local capability | signed server entitlement |
| --- | --- |
| `marketplace.ozon.adapter` | `source.ozon` |
| `marketplace.wildberries.adapter` | `source.wildberries` |
| `ai.chatgpt.web.adapter` | `ai.chatgpt` |
| `ai.alice.web.adapter` | `ai.alice` |

No binding is inferred from string equality, prefixes, marketplace names, AI names, signed feature keys or any unknown server entitlement.

The D1 permission definitions are BOOLEAN/CAPABILITY permissions. D2 therefore accepts a reviewed signed permission only when the exact bound entitlement key is present with the literal boolean value `true`.

## Fail-closed rule

For every reviewed binding, `permissionSatisfied` is true only when both conditions hold:

1. the exact packaged-local capability is present in `SellerAgentsPackagedCapabilities` and remains a non-executing packaged row;
2. the exact bound key in verified `signedEntitlements` is present and equals boolean `true`.

The following all deny:

- missing signed permission;
- explicit signed `false`;
- local packaged capability absent;
- an unknown signed entitlement;
- a signed key that merely resembles a local capability id;
- a matching-looking entry in `signedFeatures` without the reviewed entitlement;
- a reviewed entitlement carrying a non-BOOLEAN value.

A non-BOOLEAN value for one of the four reviewed keys is treated as a semantic contract violation and rejects the whole intersection with `CAPABILITY_PERMISSION_METADATA_INVALID`.

A remote allow can therefore never manufacture a local capability. Signed denial or absence wins.

## Implementation boundary

`packages/control-client/src/capability-intersection.js` is loaded after the accepted packaged capability and signed metadata layers.

It captures the already frozen `SellerAgentsPackagedCapabilities` and `SellerAgentsControlClient.getVerifiedBootstrapMetadata()` authorities and publishes a separate frozen global `SellerAgentsCapabilityIntersection` with:

- `snapshot()` — the immutable reviewed binding table;
- `hasBinding(capabilityId)` — strict local binding lookup;
- `describeBinding(capabilityId)` — the exact reviewed binding or `null`;
- `getVerified(options)` — obtains already verified signed metadata through the accepted B path and returns the detached frozen intersection projection.

The projection carries source/freshness/config/access-basis provenance and always has `executionAuthority: false`.

D2 reads only `signedEntitlements` for permission. `signedFeatures` are deliberately not a fallback permission source.

## Important current-state consequence

D1 did not seed entitlement definitions in PostgreSQL, mutate plans or grant accounts these permissions. D2 therefore does not assume that current signed snapshots already contain the four keys. Until the server commercial/beta configuration explicitly emits them, missing keys simply deny in the D2 projection.

This is intentional fail-closed behavior, not a reason to infer permissions from legacy/product/provider keys.

## Explicit non-goals

C2.2-D2 does **not**:

- change `SellerAgentsControlClient.canWork()`;
- change Work Start/Resume or application readiness;
- authorize command discovery, validation, dispatch, replay or provider calls;
- authorize delivery, recovery, quota, file, attachment or scheduler behavior;
- grant offline Work or stale-cache Work;
- convert stale-but-grace-eligible metadata into execution authority;
- mutate `SellerAgentsPackagedCapabilities` or its accepted empty `signedPermissionBindings` field;
- consume signed `features` as permission;
- seed DB entitlement definitions, mutate plans or grant accounts;
- change Bootstrap/OpenAPI/contracts/schema/migrations;
- change AI profile resolution or Health policy;
- close full C2, I1, D2 product integration, D3/S2, S1.2, beta, release or deployment.

## Acceptance gate

The focused source/extracted-package test must prove:

1. exactly the four reviewed bindings exist and unknown/local-looking ids are not inferred;
2. explicit signed boolean `true` plus packaged presence satisfies the read-only intersection while `executionAuthority` remains false;
3. missing and explicit false permissions deny, and signed features cannot substitute;
4. unknown signed entitlements and local-capability-looking remote keys cannot manufacture permission;
5. non-BOOLEAN values on reviewed permission keys fail the intersection closed;
6. API/manifest/bindings/global slot are immutable and no executable control-client method is patched in.

The full Extension I1 regression must run against both composed source and extracted package, including the preserved Ozon/WB/browser baselines. Documentation CI and path-triggered Extension CI must pass. No server runtime, contract, migration, DB or OpenAPI file is changed by D2, so Server CI must not be artificially triggered by meaningless server-file edits.

## Next boundary after acceptance

Acceptance of D2 will prove only the explicit read-only permission intersection. A later architect step may decide where that verified result participates in execution authority, but it must separately preserve all existing account/session generation, compatibility, profile, Health, online/offline freshness and Work state-machine gates.

Do not wire D2 directly into Work, provider dispatch or offline completion as part of this step.
