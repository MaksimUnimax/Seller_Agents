# C2.2-C architect acceptance / exact-tree remote readback — 2026-09-17

Status: `ACCEPTED / REMOTE VERIFIED`.

## Authority

- Repository: `MaksimUnimax/runtime-fixtures`.
- Source branch: `feature/extension-i1-c2-2c-packaged-capabilities-2026-09-17`.
- Accepted base branch: `integration/i1-c1-srv5-2026-09-16`.
- Base head: `27d1b1a1ec1fac15d284d20a42a27f95e1514924`.
- Exact tested implementation head: `a1d0a9dc83daf80536f58bf56d498206da8a1eb3`.
- Exact tested implementation tree: `1f7a54c0ac0c1c95b680071f7036f084715bac4c`.
- Draft integration PR during implementation: #19.

The exact implementation diff from the accepted C2.2-B integration base contains only five paths:

- `apps/extension/composition.json` — packages the local authority before the existing control client;
- `packages/control-client/src/packaged-capabilities.js` — immutable package-local capability-presence authority;
- `tests/regression/extension-core/client-i1/client-packaged-capabilities.mjs` — focused source/package gate;
- `tooling/checks/extension_i1.py` — registers the focused gate;
- `docs/development/client-i1/C2_PACKAGED_CAPABILITIES_2026-09-17.md` — bounded scope and authority record.

No server, contract, schema, migration, OpenAPI, application Work, marketplace provider, delivery, recovery, quota, file-handling, or scheduler execution path changed.

## Bounded accepted scope

C2.2-C creates the independent local/package side required by the server-owned rule `effective capability = packaged local capability AND signed feature/entitlement permission`.

The accepted authority is `SellerAgentsPackagedCapabilities`, schema `packaged_capability_manifest_v1`, marker `PACKAGED_LOCAL_ONLY`. It records exactly four already-packaged adapter-presence facts:

- `marketplace.ozon.adapter`;
- `marketplace.wildberries.adapter`;
- `ai.chatgpt.web.adapter`;
- `ai.alice.web.adapter`.

Every row has `packaged: true` and `executionAuthority: false`. The manifest also has `executionAuthority: false` and `signedPermissionBindings: []`.

The local ids form their own namespace. They are not server feature keys, entitlement keys, operation allowlists, or Work grants. The API, manifest, arrays and rows are frozen, and the global authority property is non-writable/non-configurable. Lookup is pure local package data and performs no network/storage work.

## Focused evidence

Exact tested implementation head `a1d0a9dc83daf80536f58bf56d498206da8a1eb3` / tree `1f7a54c0ac0c1c95b680071f7036f084715bac4c`:

- focused source packaged-capability gate: `5/5 PASS`;
- focused extracted-package gate: `5/5 PASS`;
- reviewed packaged capabilities: `4`;
- signed permission bindings: `0`;
- execution authority: `false`;
- unknown/malformed ids fail closed;
- global authority replacement rejected;
- correctly signed remote keys identical to local ids remain metadata only and do not infer a binding;
- local authority lookup introduces zero storage/network I/O;
- live provider calls introduced by this step: `0`;
- offline Work enabled by this step: `false`.

A preliminary green implementation existed before the global authority slot was hardened. Before acceptance, the global publication was strengthened to non-writable/non-configurable and the focused gate was extended to prove the authority cannot be replaced. All acceptance claims are therefore pinned to the later exact implementation head above, not the preliminary iteration.

## Exact-tree CI

On the exact tested implementation head/tree:

- Documentation CI run `35190625142`: SUCCESS.
- Extension I1-C1 client run `35190621200`: SUCCESS.
- Extension CI push run `35190621221`: SUCCESS.
- Extension CI PR run `35190625256`: SUCCESS.

Extension I1 includes:

- full checker: `104/104 PASS`;
- focused packaged capability test on both source and extracted package;
- browser verifier: PASS on Chromium `151.0.7922.34`;
- valid signed snapshot accepted and tamper rejected;
- installed-local API/portal/PostgreSQL acceptance: PASS.

Extension CI includes successful common core source/package, Ozon preserved baseline, WB Node baseline, WB browser baseline, and native Chromium common application fixture on both push and PR runs.

Server CI was intentionally not forced: the exact C2.2-C implementation diff contains no path covered by the server workflow. Accepted server/contracts authority is unchanged from the accepted base. Exact-head installed-local acceptance still exercises the local API/portal/PostgreSQL integration. No meaningless server-file touch was added merely to trigger a path-filtered workflow.

## Artifact readback

Extension I1 artifact:

- artifact id `10483534436`;
- name `extension-i1-a1d0a9dc83daf80536f58bf56d498206da8a1eb3`;
- artifact digest `sha256:94c2a3258eb9d274ede315ea5df5574eac12cd661372252db1f82abfaa421f22`;
- artifact size `1,071,324` bytes.

Installed-local artifact:

- artifact id `10483293247`;
- name `extension-installed-local-a1d0a9dc83daf80536f58bf56d498206da8a1eb3`;
- artifact digest `sha256:92998818c8c3a62cc70378f7272e23c45a216b1bf0385d21f506a756748134d3`;
- artifact size `517` bytes;
- distinct accounts/device-sessions/authorization ids: PASS;
- device start `2`, exchange `2`, bootstrap `2`;
- OTP request `2`, OTP verify `2`, logout 204 `1`;
- logout cleanup: PASS;
- beta state unchanged: PASS;
- live provider calls: `0`;
- fixed development OTP is fixture-only and is not real email-delivery evidence.

Deterministic development package:

- `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`;
- `1,839,269` bytes;
- SHA-256 `61e992cc28323c68bb2f448d88bb2d9ecc7ce2e0f1c9ced5de82b4ac2d123057`;
- runtime/extracted/ZIP files: `39/39/39`;
- source↔extracted byte parity: PASS;
- ZIP↔extracted byte parity: PASS;
- byte mismatches: `0`.

Packaged authority composition input:

- `packages/control-client/src/packaged-capabilities.js`;
- `2,072` bytes;
- SHA-256 `17783d63479ab5282b0414fd83bfcecbb8d0ed86f272c5e2f2005a081466e927`.

## Explicitly not accepted

C2.2-C does not accept or enable:

- signed feature/entitlement → local capability bindings;
- effective capability computation;
- offline or stale-cache Work;
- changes to `SellerAgentsControlClient.canWork()`;
- Work Start/Resume or command execution changes;
- Ozon/WB provider dispatch/replay, delivery, recovery, quota, file, or scheduler changes;
- an independent packaged AI-profile fingerprint registry;
- provider-specific entitlement policy as control-plane authority;
- real email delivery;
- preprod/production;
- live marketplace/AI/provider acceptance;
- full C2, I1, or D2;
- D3/S2;
- beta, deployment, or release.

## Manual testing

No owner/manual test is required for this bounded packaged-authority acceptance. Its acceptance criteria are deterministic package/source properties and are covered by source/package/browser/installed-local/remote evidence. Real email, preprod, live providers, and broader installed/live-product acceptance remain separate later gates.

## Verdict and next boundary

`ACCEPTED / REMOTE VERIFIED` for independent packaged-local capability presence authority only.

The next capability-related step must separately identify explicit reviewed signed server permission keys and define a fail-closed mapping/intersection with this local authority. Unknown or missing signed keys must not activate a local capability; signed allow must never manufacture an absent packaged capability; signed denial must win. Prefer proving that effective-capability result as a non-executing/read-only authority before wiring it to Work.
