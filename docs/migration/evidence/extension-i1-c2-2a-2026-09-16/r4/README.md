# C2.2-A architect acceptance / exact-tree remote readback — 2026-09-17

Status: `ACCEPTED / REMOTE VERIFIED`.

## Authority

- Repository: `MaksimUnimax/runtime-fixtures`.
- Branch: `integration/i1-c1-srv5-2026-09-16`.
- Canonical `main`: `bc718cc5c677ad0eb4598e7de3ad766473ff0847`.
- Pre-acceptance integration head: `5d93bccac163c8728a8d7a3b1d4b9f23ea16b680`.
- Exact tested tree: `531033ac08f001dd55427c4ae969a6c4b5d6b861`.
- First parent: `076af64efbcdfdc67aec8713969c31c276a90b2d`.
- Second parent/current main: `bc718cc5c677ad0eb4598e7de3ad766473ff0847`.
- PR #9 GitHub virtual merge checkout: `5d908524db63610163770e3400c3426d7baa8177`.
- The virtual merge checkout has the exact same tree `531033ac08f001dd55427c4ae969a6c4b5d6b861`; CI therefore exercised byte-identical repository content.

The synchronization removed the stale `docs/README.md` conflict by taking the current `main` version unchanged. No force-push, rebase, reset or public-document rewrite was used.

## Bounded acceptance scope

C2.2-A accepts only:

- online-first verified cached-bootstrap configuration acquisition;
- exact signed cache re-verification using the packaged trust bundle;
- exact environment/session/account/AI cache binding;
- durable effective-time and offline-grace classification/checkpoint behavior;
- endpoint-bound transport/HTTP provenance;
- generation/device/session/account/bootstrap-attempt obsolescence fences.

It does **not** accept or enable:

- offline Work;
- capability/profile execution;
- joint offline command/result completion;
- provider replay;
- scheduler integration;
- real email delivery;
- preprod/production;
- live marketplace/AI/provider acceptance;
- full I1 or full D2;
- D3;
- deployment or release.

The production Work path remains online/fresh-only. The application runtime calls the regular online `bootstrap()` through `ensureForIdentity()` before Work; `bootstrapWithPolicy()` is not wired into Work dispatch.

## Focused policy evidence

R3 remains historical evidence and was not rewritten.

Exact current policy results:

- source: `37/37 PASS`;
- extracted package: `37/37 PASS`;
- groups Q1–Q7: all PASS on both routes;
- destructive retention negative control: `EXPECTED_FAIL` while normal control remains PASS;
- live provider calls: `0`;
- provider replay: `0`;
- offline Work: `false`.

The cases include 401/403 boundaries, audited bootstrap 503 eligibility, transport provenance, malformed/oversized responses, unknown key/signature failure, compatibility failures, server-time regression, expiry/grace boundaries, clock rollback, storage failure/recovery, account replacement, held-cache races, final public-return fencing, renewal retention, provider replay prevention and no-offline-Work retention.

## Exact-tree CI

- Documentation CI run `35182768504`: SUCCESS.
- Extension I1-C1 client run `35182768475`: SUCCESS.
- Server CI PR run `35182768483`: SUCCESS, including lint, format, typecheck, unit, PostgreSQL integration, migrations, OpenAPI check, bridge guard, build and browser E2E.
- Server CI push run `35182765846`: SUCCESS on the same branch head/tree.
- Extension CI run `35182768462`: SUCCESS, including Ozon/WB preserved baselines, WB browser fixture, common core source/package and native Chromium application fixture.

All 7 exact-head workflow runs completed successfully; failed exact-head workflow count: `0`.

## Exact-tree artifact readback

Extension I1 artifact:

- artifact id `10481101652`;
- artifact digest `sha256:a149542e5a5bc08db99e2a7ef751dd4b4c4e333974ec4967dc79afc0e1f9d61a`;
- full I1 checker: `100/100 PASS`;
- browser verifier: PASS on Chromium `151.0.7922.34`;
- valid signed snapshot accepted; tamper rejected.

Installed-local artifact:

- artifact id `10480663290`;
- artifact digest `sha256:12d343d9735bcff80299aef17969b4a1ccd9dc40f1725d6bf7ea04fd655c2ffc`;
- installed local API/portal/PostgreSQL acceptance: PASS;
- two distinct fixture accounts, device/session tuples and authorization ids;
- device start `2`, exchange `2`, bootstrap `2`;
- logout 204 `1`, logout cleared state;
- beta state unchanged;
- live provider calls `0`;
- development OTP is fixture-only and is not real email-delivery evidence.

Deterministic development package:

- `SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`;
- `1,834,654` bytes;
- SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`;
- runtime `39` files;
- extracted package `39` files;
- ZIP `39` files;
- runtime↔extracted names exact, byte mismatches `0`;
- ZIP↔extracted names exact, byte mismatches `0`.

This independently closes the historical R3 `UNKNOWN` entries for native source/extracted execution, installed-local API/portal/PostgreSQL acceptance and current-task remote artifact readback.

## Manual testing

No owner/manual test is required for this bounded C2.2-A acceptance. Every criterion in this step is covered by deterministic source/package/native/installed-local/remote evidence.

Real email, preprod, live provider and broader installed/live-product acceptance are separate future roadmap scopes. They are not hidden manual residues of C2.2-A.

## Verdict

`ACCEPTED / REMOTE VERIFIED`.

C2.2-A is accepted only for the bounded configuration-acquisition scope above. No merge to `main`, deployment or release is claimed by this receipt.
