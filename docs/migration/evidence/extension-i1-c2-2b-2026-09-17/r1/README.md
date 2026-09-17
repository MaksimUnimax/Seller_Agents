# C2.2-B architect acceptance / exact-tree remote readback — 2026-09-17

Status: `ACCEPTED / REMOTE VERIFIED`.

## Authority

- Repository: `MaksimUnimax/runtime-fixtures`.
- Source branch: `feature/extension-i1-c2-2b-signed-metadata-2026-09-17`.
- Accepted base branch: `integration/i1-c1-srv5-2026-09-16`.
- Base head: `8b162d97a37aa10566d82dd3184c2bfe3a9cca98`.
- Exact tested implementation head: `8a5d9e6ca611d69512ad28fc00684c63bdc87324`.
- Exact tested implementation tree: `1fb11a510d6dd314a0647c5348e56d1a26bc007e`.
- Post-acceptance documentation head before merge: `76c883878cc32a34aab71dbf4e9eaf2909227484`.
- PR #18 merged into `integration/i1-c1-srv5-2026-09-16` at merge commit `c6fc2363f25e02e5ff7ce548164df7a37b94bcf8`, tree `ea1ad3b3267053b75e3fb377f2cd636a5b29da40`.

The tested implementation diff from the accepted C2.2-A base changes only six paths:

- `.github/workflows/extension-i1-ci.yml` — broadens the existing I1 push trigger from one obsolete exact feature branch to `feature/extension-i1-*`; jobs and acceptance commands are unchanged;
- `apps/extension/composition.json` — loads the bounded signed-metadata projection after the existing control client;
- `packages/control-client/src/signed-metadata.js` — new read-only projection;
- `tests/regression/extension-core/client-i1/client-signed-metadata.mjs` — focused source/package gate;
- `tooling/checks/extension_i1.py` — registers the focused gate;
- `docs/development/client-i1/C2_SIGNED_METADATA_2026-09-17.md` — bounded scope and authority record.

No server, contract, schema, migration, OpenAPI, application Work, marketplace provider, delivery, recovery, quota, or scheduler execution file changes in the tested implementation tree.

## Bounded acceptance scope

C2.2-B accepts only a read-only projection of already verified signed Bootstrap V2 metadata through `SellerAgentsControlClient.getVerifiedBootstrapMetadata(options)`.

The projection reuses the accepted C2.2-A `bootstrapWithPolicy()` acquisition/verification path and exposes detached, frozen metadata:

- source/freshness classification;
- `configVersion` and `accessBasis`;
- signed top-level `entitlements`;
- signed top-level `features`;
- the already validated signed AI state/profile when resolved;
- `executionAuthority: false` unconditionally.

It does not synthesize `capabilities` or `workAllowed`.

The authority audit established that `ai.profile.contentSha256` is an integrity binding of signed server profile content, not an independent packaged local profile fingerprint. The packaged client also has no canonical local executable capability registry. Therefore signed remote metadata cannot by itself become executable authority.

## Focused evidence

Exact tested implementation head `8a5d9e6ca611d69512ad28fc00684c63bdc87324`:

- focused source signed-metadata gate: `5/5 PASS`;
- focused extracted-package signed-metadata gate: `5/5 PASS`;
- online signed metadata projection: PASS;
- stale-but-offline-grace-eligible cache metadata projection while `canWork() === false`: PASS;
- ChatGPT cached AI context cannot be borrowed as Alice: PASS;
- account-only `UNCONFIGURED` stays account-only and non-authorizing: PASS;
- live provider calls introduced by this step: `0`;
- offline Work enabled by this step: `false`.

The initial candidate test had one non-product failure caused by comparing JSON key insertion order. Canonical signed JSON normalized key order while values were identical. The test was corrected to structural equality; no production logic changed for that correction.

## Exact-tree CI

On the exact tested implementation head/tree:

- Documentation CI run `35187264986`: SUCCESS.
- Extension I1-C1 client run `35187262735`: SUCCESS.
- Extension CI PR run `35187264983`: SUCCESS.
- Extension CI push run `35187262733`: SUCCESS.

Extension I1 includes:

- full checker: `102/102 PASS`;
- browser verifier: PASS on Chromium `151.0.7922.34`;
- valid signed snapshot accepted and tamper rejected;
- installed-local API/portal/PostgreSQL acceptance: PASS.

Extension CI includes successful common core source/package, Ozon preserved baseline, WB Node baseline, WB browser baseline, and native Chromium common application fixture.

Server CI was intentionally not forced: the exact C2.2-B implementation diff contains no path covered by the server workflow. Accepted server/contracts authority is unchanged from the accepted base. Exact-head installed-local acceptance still exercises the local API/portal/PostgreSQL integration. No meaningless server-file touch was added merely to trigger a path-filtered workflow.

## Artifact readback

Extension I1 artifact:

- artifact id `10482737502`;
- name `extension-i1-8a5d9e6ca611d69512ad28fc00684c63bdc87324`;
- artifact digest `sha256:6295dedcd9973533ace4d51d087785ac6ba68bd75db574cc79329248f4de5853`;
- artifact size `1,068,730` bytes.

Installed-local artifact:

- artifact id `10482613319`;
- name `extension-installed-local-8a5d9e6ca611d69512ad28fc00684c63bdc87324`;
- artifact digest `sha256:778377994326850ec85d8e3ac9fd2eaf36e97fd184821760c51a0766a77a51cf`;
- artifact size `560` bytes;
- distinct accounts/device-sessions/authorization ids: PASS;
- device start `2`, exchange `2`, bootstrap `2`, logout 204 `1`;
- logout cleanup: PASS;
- beta state unchanged: PASS;
- live provider calls: `0`;
- fixed development OTP is fixture-only and is not real email-delivery evidence.

Deterministic development package:

- `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`;
- `1,837,324` bytes;
- SHA-256 `5badfd1a67a824ecd160694fdb45ee25fb2dac27386e22ab93145eeaca4b6afa`;
- runtime/extracted/ZIP files: `39/39/39`;
- source↔extracted byte parity: PASS;
- ZIP↔extracted byte parity: PASS;
- byte mismatches: `0`.

The new `signed-metadata.js` input is present in the deterministic composition and therefore in the tested service worker/package.

## Post-merge readback

PR #18 was merged normally, without force-push/rebase/reset, into the accepted integration line at `c6fc2363f25e02e5ff7ce548164df7a37b94bcf8`. The merge commit has tree `ea1ad3b3267053b75e3fb377f2cd636a5b29da40` and preserves the exact tested implementation commit in history. The merge does not redefine the exact tested implementation head: all implementation acceptance claims above remain pinned to `8a5d9e6ca611d69512ad28fc00684c63bdc87324` / `1fb11a510d6dd314a0647c5348e56d1a26bc007e`.

## Explicitly not accepted

C2.2-B does not accept or enable:

- offline Work;
- interpretation of remote `features`/`entitlements` as executable local capabilities;
- a local capability registry;
- an independent packaged AI-profile fingerprint authority;
- Work Start/Resume changes;
- Ozon/WB provider dispatch, replay, delivery, recovery, quota, or scheduler changes;
- joint offline command/result completion;
- real email delivery;
- preprod/production;
- live marketplace/AI/provider acceptance;
- full C2, I1, or D2;
- D3/S2;
- beta, deployment, or release.

## Manual testing

No owner/manual test is required for this bounded metadata-projection acceptance. Its criteria are covered by deterministic source/package/browser/installed-local/remote evidence. Real email, preprod, live providers, and broader installed/live-product acceptance remain separate later gates.

## Verdict and next boundary

`ACCEPTED / REMOTE VERIFIED` for the bounded signed metadata projection only.

The next capability-related step must first define an independent packaged local capability authority, then intersect it with signed feature/entitlement permission. C2.2-B itself does not open offline Work or executable capability authority.
