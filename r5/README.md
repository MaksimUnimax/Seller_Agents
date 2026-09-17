# I1-C1 R5 evidence

Task `SA-I1-C1-R5-20260915-01`. The required checkout was the clean branch `feature/extension-i1-client-2026-09-15` at base/head `60c3a34bdc1b6a5563fad59e8ac38c78b76e32d3`, tree `243d944b3834f4c88c694f4c3f668ddc80bb7bbf`. PR #7 remains draft and unmerged. The final published head is recorded in the terminal handoff after commit/push.

## Assertions

| R5 assertion | Original mapping | Result and retained controls |
|---|---|---|
| R5-1 popup state without an AI tab | G5 | GREEN in composed source and extracted runtimes. Signed-out, actual pending activation, and authenticated account-only popup states return `ok: true` with neutral identity; pending user code, account, and catalog are preserved. Supported AI identity, supported page without conversation ID/pending Start, popup sender denial, and unsupported Work Start remain covered. Native own-tab popup renders restored account/catalog and keeps Start disabled. |
| R5-2 delivering-owner denial proofs | G3 | GREEN in six real composed fixtures: Ozon/WB × before-insert, before-attachment-commit, and after-insert-before-send. Each uses a real store, Start acknowledgement, delivering owner, nonempty result, real delivery ID, explicit signed-authority bootstrap 403, active cleanup-write failure, and restored Finish without reauthentication. Ordinary denied guards add zero control requests/provider calls; no new delivery advertisement/replay. WB binary attachment META/CHUNK byte equality is proven before the negative checks; denied recovery/descriptors/chunks/attach/click grants are absent and denied artifact requests add zero IDB reads. Legacy credentials are seeded and autorun remains disabled. |
| R5-3 SemVer relations | G4 | GREEN in the signed real-client matrix. Hyphenated labels were clarified; `alpha.2 < alpha.beta` and `alpha < alpha.1` are denied in the forward direction and allowed in reverse, with packaged and signed minimum versions varied. Existing oversized, prerelease/build, owner-race, provider split, zero-failure, `cd4bce38`, and 0.2.3 sender-adaptation controls remain. |

## Checks and outcomes

- Baseline popup regression on exact `60c3a34` after adding R5 cases: RED at `i1-source-application` with `IDENTITY_UNAVAILABLE`; no production fallback was used for the baseline.
- `SA_NODE_BIN=/root/.nvm/versions/node/v22.22.2/bin/node python tooling/checks/extension_i1.py --output r5/extension-i1`: PASS, source/extracted, 96 gate processes.
- `PATH=/root/.nvm/versions/node/v22.22.2/bin:$PATH python tooling/checks/extension_core.py --output r5/extension-core`: PASS, source/extracted, 111 gate processes.
- Native `browser_application.py`: PASS for source and extracted, Chromium `151.0.7922.34`; browser verifier: PASS for source and extracted, valid signature and tamper rejection.
- Installed local API/portal/PostgreSQL: PASS on disposable tmpfs PostgreSQL loopback `127.0.0.1:55464`; `device_start=2`, `exchange=2`, `bootstrap=2`, OTP request/verify `2/2`, logout `204`, same worker, distinct accounts/device-session tuples/authorization IDs, beta unchanged, and zero live provider calls.
- `pnpm docs:check`: PASS (`548` files, `230` markdown files, `351` relative links); `pnpm bridge:guard`: PASS; `pnpm openapi:check`: PASS.

## ZIP receipt

Final deterministic package: `r5/browser-package/SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip`

- SHA-256: `b98b87a176c8bed2a1550e4838ba1c563aae28a938a9d284436fe35e72e62e6e`
- Size: `1,801,899` bytes; receipt file count: `39`.
- Repeat archive: exact byte match (`true`). Source/extracted bytes: exact match (`true`).
- ZIP byte readback: `39/39` entries matched receipt SHA-256 and byte sizes (`true`).
- Development version remains `0.2.4`; no dependency, server, schema, portal, beta policy, or cosmetic production changes were made.

## Limits

The browser and marketplace checks use synthetic fixture AI/provider surfaces and claim no live provider acceptance. The installed OTP is the fixed development fixture `424242`, not email-delivery evidence. The local first attempt recorded a missing nested PNPM executable and later CSP-incompatible bare predicates; the semantically identical arrow predicates and Node 24/Corepack path were corrected, then the clean disposable-DB run passed. Remote CI results are not claimed until the pushed candidate’s normal workflows complete. No old R3 job was rerun.
