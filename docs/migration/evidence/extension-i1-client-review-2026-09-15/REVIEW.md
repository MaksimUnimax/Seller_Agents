# I1-C1 independent architect review

Date: 2026-09-15.
Verdict: **REWORK_REQUIRED — NOT ACCEPTED**.
Reviewed candidate: `2a98057646af52eee0f654997b3f60f6322dfb04`.
Base: `bc0cd0088ca50ba06021ea602a46bdd90de91378`.
Draft PR: https://github.com/MaksimUnimax/Seller_Agents/pull/7

The reported remote head is correct. Its 22-file diff contains no server source changes. The clean state of the executor's private working directory was reported by the executor and was not independently observable. No implementation changes were made by this review; the architect created the missing draft PR and produced independent diagnostic evidence.

## Findings reproduced on unmodified published modules

`reproduce.mjs` runs the actual `config.js`, `crypto.js`, and `client.js` under Node VM with controlled API responses, asynchronous barriers, and ephemeral Ed25519 keys. It does not contact any production, marketplace, email, or external API. These are targeted source-level reproductions, not installed-browser acceptance.

| ID | Severity | Reproduction and consequence | Source |
| --- | --- | --- | --- |
| F1 | P1 | Hold the device-start POST, cancel activation, then release its successful response. The cancelled attempt is persisted again, a portal tab opens, and token exchange starts. The start continuation has no attempt/generation fence. | `packages/control-client/src/client.js`, `startActivation` |
| F2 | P1 | Start with a valid current signed authority; return `401 UNAUTHORIZED` to bootstrap. `authenticated` and `workAllowed` remain true; no invalidation is emitted. A known current-session denial leaves the previous authorization usable. | `client.js`, `bootstrap`, `publicStatus`, `canWork` |
| F3 | P1 | Hold account A refresh; reset and complete actual client activation/bootstrap for B; then return `AUTH_REFRESH_INVALID` to A's old refresh. The catch branch clears B's new credentials/authority. The failure continuation does not verify its captured generation. | `client.js`, `refresh` |
| F4 | P1 | Give the client a signed snapshot with `ai.detected.family=chatgpt`; call `ensureForIdentity` for Alice. The cached ChatGPT snapshot is returned and Work remains allowed. Separately, the existing fixtures use empty profile content/compatibility and an arbitrary content hash; these are accepted by the Work gate. | `client.js`, `ensureForIdentity`, `canWork`; `crypto.js`, `ai`; `worker-harness.mjs` |
| F5 | P1 | Two successful bootstraps for the same account/device/session both emit the authority-change callback. The runtime unconditionally wires that callback to `saInvalidateAuthority`, which finishes all active bindings. The reproduction verifies the callback; the full Work consequence follows from the inspected runtime consumer. | `client.js`, `notify`, `bootstrap`; `apps/extension/src/application/runtime.js`, `saInvalidateAuthority` |
| F6 | P2 | A correctly signed envelope whose encoded payload is 35,882 characters passes the browser verifier. The accepted V2 envelope schema caps this field at 32,768. Request-body reading is also unbounded. | `crypto.js`, `verifyBootstrapV2`; `client.js`, `request`; `packages/contracts/src/index.ts` |
| F7 | P1 | Run the published `makeWorker` twice with the same backing storage and a minimal loader for the actual client modules. The first authenticates; the second reports `STORED_AUTHORITY_INVALID_SIGNATURE` because the harness regenerated the key without re-signing/replacing the persisted envelope. Recovery tests therefore begin from an unintended invalid-auth state. | `tests/regression/extension-core/worker-harness.mjs` |
| F8 | P2 | A signed payload containing feature identifier `1flag` is rejected as `INVALID_PAYLOAD_SCHEMA`. The accepted machine-identifier schema allows this identifier. Client regex and bounds diverge from the server contract. | `crypto.js`, `MACHINE`, `machine`; `packages/shared/src/index.ts` |

Other confirmed source findings:

- `popup.html` places the account-switch button inside `#auth`; `render()` hides this whole section after authentication. The account-switch button is therefore inaccessible after a successful login. The shared confirmation dialog is outside `#catalog`; no hidden-confirmation defect is asserted. This was established from DOM structure and visibility code, not a completed native UI run.
- `restore()` is not a one-time worker initialization. It re-reads and re-verifies persisted state on ordinary getters after each completed restore flight. Mutation writes are not serialized by one auth-state owner. This creates additional stale-read/write risks and unnecessary repeated cryptography in command guards; the corrective design must address the entire state boundary rather than only three catch branches.
- Activation polling discards a pending attempt for errors other than `DEVICE_AUTH_PENDING`, including transient exchange failures. A lost exchange response must retain its logical attempt and exchange idempotency until the retry/expiry policy decides otherwise.
- `canWork()` does not bind authorization to the requested AI/profile context, and `ensureForIdentity()` maps every nonempty AI id to ChatGPT on the request path. A successful outer signature is insufficient permission to execute with an unrelated or unvalidated adapter profile.
- Some prior precise recovery/context assertions were widened to accept unrelated error codes. Combined with F7, these allow a test to pass for an auth failure before the recovery condition it was meant to exercise. Restore the intended preconditions and prove the intended failure boundary.
- The new I1 checker replaces the original complete composed Ozon route with syntax checks and a narrower list; it also invokes the source `crypto.js` path on both its claimed source/package verifier passes. Preserve the accepted composed baseline/attachment/IDB gates and test the actual packaged verifier.

## Independently inspected CI

On exact candidate `2a98057646af52eee0f654997b3f60f6322dfb04`:

- I1 workflow run `34952409514`, job `104326241575`: **FAIL** before tests. `actions/setup-node` requests pnpm caching before pnpm is installed/enabled: `Unable to locate executable file: pnpm`.
- Extension CI run `34952409430`, job `104326241377`, common core: **FAIL**. The unchanged `extension_core.py` still expects development version `0.2.3` while the builder now produces `0.2.4`.
- Same run, job `104326241345`, native application: **FAIL**. The old browser fixture waits for the old account label containing `I1`; it has not been adapted to the actual authenticated candidate. It times out before completing the preserved UI scenario.
- Ozon and WB Node imported-baseline jobs passed; their frozen-baseline success does not close the failing composed/native candidate gates. The overall Extension CI run subsequently completed with failure. PR-triggered I1 run `34952807847` also failed; Documentation CI `34952807863` passed; PR-triggered Extension CI `34952807928` was still in progress at final readback.

The I1 workflow also lacks installation of Python Playwright before running its Python script. Installing the Node Playwright package/browser does not install `playwright.sync_api`. There is no PostgreSQL/API/portal job or complete installed-auth test wired into that workflow.

## Acceptance gaps

The executor's evidence explicitly describes a server-route smoke, not the required installed extension → portal → device approval → extension verifier → account catalog path. The committed browser test only signs a synthetic payload inside a worker and calls the verifier. It does not test login/popup/account switching or real control endpoints. The new lifecycle test exercises concurrent refresh success only; its printed `stable_idempotency: true` does not prove crash/retry with the same logical rotation.

Full installed C1 acceptance is part of C1 and cannot be silently moved to C2. Final offline and broader signed Work profile consumption remain bounded by the accepted server handoff; their deferral does not excuse F1–F4 or permit an unconditional Work allow.

An Actions artifact was located and a download reference obtained, but fetching its bytes in the review environment returned HTTP 403. Consequently the reported ZIP hash `93a27674aa610b4ca3275ab6691cf3ff035b213d02c62b8a17375878c6c96ea0` is not independently verified by this review. No package byte-parity PASS is claimed.

## Server synchronization observed during review

While this review ran, server PR #6 was merged and main advanced to `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`. This is a repository observation, not an architect acceptance of the server changes: `docs/STATUS.md` and the I1-SRV.4 handoff still say `IMPLEMENTED CANDIDATE / OWNER_ARCHITECT_REVIEW_PENDING`, with I1-SRV.5 not started. The handoff now explicitly specifies one bounded refresh and one bootstrap retry after `401 UNAUTHORIZED`, terminal current-session invalidation, and narrowly eligible offline fallback. Read it when correcting C1, but do not declare final offline/C2/I1 acceptance or modify the server streams. The reviewed client head and draft PR head remain `2a98057646af52eee0f654997b3f60f6322dfb04`.

## Architect's corrective design

1. One initialized auth owner per worker, one serialized mutation queue, explicit `commitIfCurrent` fences. Network/crypto work runs outside the mutation lock; every continuation checks captured generation and attempt or device/session identity before modifying state. Persist idempotency before dispatch. Error and cleanup continuations are fenced too.
2. Reset/cancel/revoke invalidate the relevant generation atomically. A failed old request cannot clear a newer account. Transient exchange failures retain the attempt/idempotency. Current-session confirmed denial invalidates operational authority; transport/5xx is not mislabeled as revoke.
3. Separate account/session identity changes from ordinary policy refresh. Same-identity compatible bootstrap must not call Finish globally. Auth generation belongs in local execution/Start/delivery guards so correctness does not rely on best-effort asynchronous cleanup.
4. Operational policy is scoped to device/session/generation plus request contract, extension/browser and exact detected AI. Validate the accepted profile content, compatibility and fingerprint before granting Work, using the existing server validator as behavioral authority. Unknown or unimplemented mapping remains blocked. No control request per ordinary marketplace item/delivery.
5. Match lexical/schema/size limits to the accepted wire contracts and test differential fixtures. Keep Ed25519 domain, canonical bytes, packaged trust and V2-only account authority.
6. Put account-switch/cancel controls and confirmation where they remain visible in their applicable states. Preserve local account data. Do not implement a new full D3 logout product flow.
7. Repair trust continuity in restart fixtures, restore precise assertions, preserve all composed gates, and add real installed-auth integration with isolated PostgreSQL/API/portal resources and a server-exported public bundle packaged before browser launch.
8. Repair both existing and new CI workflows/runners without weakening tests. Run source and extracted-package scenarios; publish exact-head evidence and independently inspect artifacts before claiming acceptance.

The executor implements this design in the existing client branch, updates draft PR #7, and returns for review. Server feature branches/main remain owned by their current streams. No merge is approved.

## Reproduce

Use the reviewed candidate in an isolated checkout and this review's script:

```sh
SA_REVIEW_REPOSITORY=/absolute/path/to/reviewed/checkout node reproduce.mjs
```

The script asserts the bad behavior of the rejected candidate and emits `reproduction-results.json`. It is review evidence, not the replacement acceptance suite: after fixes, translate each case into assertions requiring the correct behavior. Private test keys remain memory-only; only fixed synthetic identifiers and outcomes are saved.
