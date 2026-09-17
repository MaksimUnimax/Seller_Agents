# Extension I1 C2.2-D2 acceptance receipt — r1

Status: `ACCEPTED / REMOTE VERIFIED / MERGED INTO INTEGRATION`.

## Authority

Repository: `MaksimUnimax/runtime-fixtures`.

Integration branch: `integration/i1-c1-srv5-2026-09-16`.

Accepted D1 base:

`66140093650dae057b4bb9017d49f48faeb7c5db`

Exact tested D2 implementation head:

`860b4799eb5bf627e14bfbc7bcfff53a241a2800`

Exact tested tree:

`305d326add8f04a9bb28dbbaee99abefbfdbe466`

Merged by PR #21 at:

`a2c9cdbd48914f6abf1e40221de4b64f1e5e76a7`

The merge commit has the same tree `305d326add8f04a9bb28dbbaee99abefbfdbe466`, so acceptance is pinned to exactly the merged implementation bytes.

## Accepted scope

D2 adds a read-only, fail-closed intersection between the four accepted package-local adapter-presence facts and the four explicit D1 server-owned permission keys:

| packaged local capability | signed entitlement |
| --- | --- |
| `marketplace.ozon.adapter` | `source.ozon` |
| `marketplace.wildberries.adapter` | `source.wildberries` |
| `ai.chatgpt.web.adapter` | `ai.chatgpt` |
| `ai.alice.web.adapter` | `ai.alice` |

A row is satisfied only when the local capability is packaged and the exact signed entitlement is present as literal boolean `true`. Missing/false denies. `signedFeatures` cannot substitute. Unknown keys cannot infer bindings. A non-BOOLEAN value on one of the reviewed keys fails the whole intersection closed with `CAPABILITY_PERMISSION_METADATA_INVALID`.

The binding manifest, computed result, capability array and result rows are immutable. Every surface remains `executionAuthority: false` and no `workAllowed` field or executable control-client method is introduced.

## Exact diff boundary

The accepted diff from D1 base contains only:

1. `apps/extension/composition.json`;
2. `packages/control-client/src/capability-intersection.js`;
3. `tests/regression/extension-core/client-i1/client-capability-intersection.mjs`;
4. `tooling/checks/extension_i1.py`;
5. `docs/development/client-i1/C2_CAPABILITY_INTERSECTION_2026-09-17.md`.

No Work/application/provider/server runtime/database/plan/contract/schema/migration/OpenAPI file changed in D2.

## Remote verification

Exact-head runs on `860b4799eb5bf627e14bfbc7bcfff53a241a2800`:

- Extension I1-C1 push `35207407249` — `SUCCESS`;
- Documentation CI PR `35207411644` — `SUCCESS`;
- Extension CI push `35207407386` — `SUCCESS`;
- Extension CI PR `35207411652` — `SUCCESS`.

The Extension I1 gate reports `106` gate processes `PASS`, including `i1-capability-intersection` on both composed source and extracted package. Browser verifier passed with Chromium `151.0.7922.34`, accepting the valid signed snapshot and rejecting tampering. Installed-local API / portal / PostgreSQL acceptance passed. Both Extension CI routes preserved successful Ozon, WB Node, common-core/native Chromium and WB-browser baselines.

Artifacts:

- Extension I1 artifact `10490995106`: `1,075,133` bytes; SHA-256 `5091b770282efb509ec8862cf1a435f67c4e0405739dfec4f42d879caebfde30`;
- installed-local artifact `10491235005`: `517` bytes; SHA-256 `aa12b47919735082b1868e18bf3415595b2a830db95b4870ee3e87a4307bab45`.

Live provider calls: `0` for this bounded development acceptance.

## What remains closed

D2 does not authorize:

- `SellerAgentsControlClient.canWork()` changes;
- Work Start/Resume or command execution;
- provider dispatch/replay;
- delivery/recovery/quota/file/scheduler changes;
- stale/offline Work;
- server entitlement seeding or beta/commercial grants;
- Bootstrap/OpenAPI/schema/migration changes;
- full C2/I1/D2, D3/S2, S1.2, beta, deployment or release.

## Discovered next dependency

The current server beta-access authority resolves only `BETA | NONE` and contains no per-capability permission policy. Current Bootstrap signs commercial entitlements only for independently eligible commercial access; a beta-only account therefore currently signs an empty entitlement map.

Consequently D2 correctly denies beta-only capability rows today. The next capability-related step must be a separate server-owned policy/emission step that explicitly defines which reviewed Seller Agents permissions each authorized access basis may sign. It must not infer permissions from beta eligibility, signed feature names or package-local ids. Execution wiring remains later scope.
