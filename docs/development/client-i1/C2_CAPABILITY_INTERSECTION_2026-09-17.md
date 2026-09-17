# C2.2-D2 — read-only packaged/signed capability intersection

Status: `ACCEPTED / REMOTE VERIFIED / MERGED INTO INTEGRATION`.

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

The projection carries source/freshness/config/access-basis provenance and always has `executionAuthority: false`. The result object, `capabilities` array and every result row are deeply frozen.

D2 reads only `signedEntitlements` for permission. `signedFeatures` are deliberately not a fallback permission source.

## Important current-state consequence

D1 did not seed entitlement definitions in PostgreSQL, mutate plans or grant accounts these permissions. D2 therefore does not assume that current signed snapshots already contain the four keys. Until a separately accepted server policy explicitly emits them, missing keys simply deny in the D2 projection.

The current server beta-access authority resolves only `BETA | NONE`; it does not define capability entitlements. Current Bootstrap code signs commercial entitlements only when commercial access is independently eligible, so a beta-only account currently receives an empty signed entitlement map. That fact is now an explicit dependency for the next bounded server step rather than a reason to infer permission from beta status, legacy feature keys or provider-specific entitlement names.

This is intentional fail-closed behavior.

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

## Acceptance result

Exact tested implementation head:

`860b4799eb5bf627e14bfbc7bcfff53a241a2800`

tree:

`305d326add8f04a9bb28dbbaee99abefbfdbe466`

The exact diff from accepted D1 integration base `66140093650dae057b4bb9017d49f48faeb7c5db` contains only five paths:

- `apps/extension/composition.json`;
- `packages/control-client/src/capability-intersection.js`;
- `tests/regression/extension-core/client-i1/client-capability-intersection.mjs`;
- `tooling/checks/extension_i1.py`;
- this design/acceptance document.

Focused source/extracted-package coverage proves:

1. exactly the four reviewed bindings exist and unknown/local-looking ids are not inferred;
2. explicit signed boolean `true` plus packaged presence satisfies the read-only intersection while `executionAuthority` remains false;
3. the computed result object, `capabilities` array and every row are deeply frozen and reject mutation;
4. missing and explicit false permissions deny, and signed features cannot substitute;
5. unknown signed entitlements and local-capability-looking remote keys cannot manufacture permission;
6. non-BOOLEAN values on reviewed permission keys fail the intersection closed;
7. API/manifest/bindings/global slot are immutable and no executable control-client method is patched in.

Remote exact-head evidence:

- Extension I1-C1 push run `35207407249`: `SUCCESS`;
- full I1 checker: `106` gate processes, `PASS` on composed source and extracted package;
- focused `i1-capability-intersection`: `PASS` on source and extracted package;
- browser verifier: `PASS`, Chromium `151.0.7922.34`, valid signed snapshot accepted and tamper rejected;
- installed-local API / portal / PostgreSQL acceptance: `PASS`;
- Documentation CI PR run `35207411644`: `SUCCESS`;
- Extension CI push run `35207407386`: `SUCCESS`;
- Extension CI PR run `35207411652`: `SUCCESS`;
- both Extension CI runs include successful Ozon, WB Node, common-core/native Chromium and WB-browser baselines;
- Extension I1 artifact `10490995106`: `1,075,133` bytes, SHA-256 `5091b770282efb509ec8862cf1a435f67c4e0405739dfec4f42d879caebfde30`;
- installed-local artifact `10491235005`: `517` bytes, SHA-256 `aa12b47919735082b1868e18bf3415595b2a830db95b4870ee3e87a4307bab45`;
- live provider calls remain `0` in bounded development acceptance.

PR #21 was merged normally into `integration/i1-c1-srv5-2026-09-16` at merge commit:

`a2c9cdbd48914f6abf1e40221de4b64f1e5e76a7`

The merge commit tree is the exact tested tree `305d326add8f04a9bb28dbbaee99abefbfdbe466`; therefore the accepted implementation bytes are preserved exactly by the merge.

Full receipt: `docs/migration/evidence/extension-i1-c2-2d2-2026-09-17/r1/README.md`.

## Next boundary after acceptance

D2 proves only the explicit read-only permission intersection. It must **not** be wired directly into Work or offline completion yet.

The next capability-related dependency is server-side: define an explicit reviewed Seller Agents capability-permission policy for the currently authorized access bases and then emit that policy through the already signed Bootstrap entitlement map without inventing permissions from access status, feature names or local capability ids.

The current beta-access model contains no per-capability policy and beta-only Bootstrap currently signs `entitlements: {}`. Therefore a separate bounded server policy/emission step must precede any execution gate. That step must preserve fail-closed behavior for `NONE`, malformed policy and unknown permissions, keep commercial plan entitlements authoritative for commercial access, and explicitly resolve the beta/commercial-overlap rule before changing runtime execution authority.

Only after the server can legitimately sign the reviewed permission set and that emission is independently accepted may a later step decide where D2 participates in executable Work authority while preserving account/session generation, compatibility, AI profile, Health, freshness and Work state-machine gates.
