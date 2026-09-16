# I1-SRV.5 Reference Acceptance and Evidence Matrix

Date: 2026-09-16
Status: `I1-SRV.5 IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Scope and exact authority

- Repository: `MaksimUnimax/Seller_Agents`
- Verified base: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383`
- Candidate branch: `feature/server-i1-srv5-acceptance-2026-09-16`
- Allowed implementation files: the Playwright fixture correction and new
  reference E2E consistency test; no
  production, shared fixture, workflow, dependency, migration, contract, or
  extension runtime code changed.
- The scenario is server/reference plus browser portal acceptance. It is not
  installed-extension, marketplace, email-delivery, or offline-V2 acceptance.

The new scenario is
`tests/e2e/server/i1-reference-acceptance.spec.ts` —
`I1-SRV.5 reference activation, V2 bootstrap, rotation, continuity, and revoke`.
It resets before the test, uses `activateExtensionClient(page)`, seeds one
V2 release, verifies the signed response with the packaged K1 public key from
`CONFIG_SIGNING_PUBLIC_KEY_RING_JSON`, checks tamper and unknown-key failures,
checks strict request/device negatives, rotates once, verifies V2 identity
continuity, then revokes through the existing portal and asserts bootstrap and
refresh fail closed. No private key, credential, token, cookie, auth code,
raw envelope, or browser trace is printed or persisted.

The added worker regression covers/asserts that `TEST_WORKER_INDEX` selects an
empty worker pair list, `CONFIG_SIGNING_KEY_RING_JSON` is absent in the worker,
and the inherited K1 public key equals the disposable database's
`public_key_spki_der` metadata. The database comparison does not populate the
trust map used by the lifecycle scenario.

The existing `SimulatedExtensionClient` remains on its V1 policy path. The
new test intentionally uses direct V2 HTTP requests for the server/reference
assertions and does not retrofit V2/offline behavior into that client.

## Acceptance matrix

| Criterion | Exact existing/new test file and test name | Actual execution result | Evidence level |
| --- | --- | --- | --- |
| Integrated V2 activation → account bootstrap → rotation → V2 identity continuity → revoke | `tests/e2e/server/i1-reference-acceptance.spec.ts` — `I1-SRV.5 reference activation, V2 bootstrap, rotation, continuity, and revoke` | Focused lifecycle passed `2/2`; full server E2E passed `88/88` with the task-owned PostgreSQL/API/portal harness. | Local reference acceptance; architect review remains pending |
| Runner/worker signing-fixture consistency | `tests/e2e/server/i1-reference-acceptance.spec.ts` — `I1-SRV.5 worker preserves runner public trust without private signing material` | RED on reviewed `b0d93e36b2c7f37a4758ea4b33dbfa9cf2c688bb`: equality `false`; GREEN after correction: `1/1` passed. | Local regression |
| Pending, deny, device limit, rotation, revoke | `tests/e2e/server/activation.spec.ts` — `portal approval activates and refreshes a simulated extension`; `denial closes authorization without devices, sessions, or refresh credentials`; `limit reached authorization recovers after portal revocation`; `packages/server/simulated-extension-client/src/index.test.ts` — `keeps codes out of the verification URL`; `tests/integration/server/p2-3-device-authorization.integration.test.ts` — T2 terminal/approval and limit suites; `p2-4-token-core.integration.test.ts` — T2-C/D and T2-H; `p2-5-device-management.integration.test.ts` — E/F and G | Existing evidence retained from accepted server history; current full E2E passed. | Historical accepted server evidence on `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383` / PR6 |
| V1 compatibility and V2 signed identity/tamper | `tests/e2e/server/bootstrap.spec.ts` — `bootstrap returns a cryptographically verified strict snapshot`; `a real device exchange obtains a signed V2 bootstrap bound to its account`; `tests/integration/server/p3-4-bootstrap.integration.test.ts` — `returns a verified complete signed snapshot`, `rejects mismatched device before resolution`, `fails closed when config key differs from signer` | Existing evidence retained; current unit and full E2E gates passed. | Historical integrated evidence plus current local PASS |
| Exact packaged trust, unknown key, and rotation | `tests/e2e/server/bootstrap.spec.ts` — `packaged K1-only client verifies a K1 bootstrap`; `overlap client verifies a bootstrap signed by newly active K2`; `old K1-only client rejects a K2 bootstrap as UNKNOWN_SIGNING_KEY`; `revoking the currently selected K1 makes the next bootstrap fail closed`; `tests/integration/server/p3-5-signing-key-lifecycle.integration.test.ts` — `signs both sides of a real PostgreSQL two-key bootstrap rollout`, `exports registry public material deterministically and excludes revoked keys` | Existing I1-SRV.3 trust evidence retained; current remote-config unit and integration tests passed. | Historical I1-SRV.3 acceptance on `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383` / PR6 plus current local PASS |
| Signed compatibility denial; eligible transport/503 fallback; half-open expiry/grace; persisted time floor/restart; terminal invalidation/storage failure | `packages/server/simulated-extension-client/src/policy.test.ts` — `uses a previously verified cache for an audited transient bootstrap 503`; `preserves the advanced floor across restart and wall-clock rollback`; `keeps a cache expired after restart when the durable floor reaches grace end`; `fails closed when advancing the offline floor cannot be persisted`; `packages/server/simulated-extension-client/src/offline-policy.test.ts` — `preserves strict V1/V2 and signed account identity verification`; `allows only network transport and audited transient server triggers` | Current `pnpm test` passed the simulated-client suites: policy 36 tests and offline-policy 11 tests. | Unit/reference evidence only. The simulated policy path is V1; direct V2 verifier tests do not establish V2 cached browser behavior. |

No copied scenario or inflated process count is used as evidence. The matrix
joins the new lifecycle coverage to the already accepted activation, bootstrap,
trust, integration, and reference-policy authorities.

## Historical and synchronized scope

S1.1 and I1-SRV.0–I1-SRV.4 are historically accepted on
`5d7c8853cc69dd95bc6e713cac3fb2aa0a63383` through PR6, with their
original evidence and candidate history preserved. Stale pending wording in
older candidate documents does not reopen their implementation.

C1 was accepted separately on `56c81a3521c02502b65fd713aec890e5a30f038d`
(`feature/extension-i1-client-2026-09-15`; PR7 remains draft/unmerged). Its
verified scope is source/package/native plus installed-local API, portal, and
PostgreSQL acceptance using development OTP and synthetic provider/AI data;
zero live calls were made. The recorded successful remote checks are R5 final
Extension CI runs `34980773590` and `34980778417`, I1 runs `34980773436` and
`34980778468`, and Documentation CI `34980778452`.

This candidate does not declare whole I1/D2 or beta complete. C2/offline/
profile integration remains pending. S1.2/D3 and Health/Stream B remain
outside this synchronization handoff. I1-SRV.5 remains
`IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING` until the architect verdict.

## Verification record

With Node `24.20.0` and pnpm `10.34.5`, the frozen install completed. The
following local gates passed: `pnpm lint`, `pnpm format:check`,
`pnpm typecheck`, `pnpm test`, `pnpm openapi:check`, `pnpm bridge:guard`,
`pnpm build`, the Playwright config regression, the focused new regression,
the two-test reference file, `pnpm db:migrate`, and full `pnpm test:e2e`
(`88/88`). `pnpm test:integration` ran against the task-owned database and
reported `1507 passed / 20 skipped`, then failed in the unrelated
`health-persistence.integration.test.ts` setup on a duplicate fixed
`ai_adapters` primary key. No allowed file was changed for that collision.

The prior local disk-exhaustion outcomes remain historical `BLOCKED` records
from the reviewed candidate; they are not retroactively relabeled PASS. The
architect-selected repair is runner-only fresh K1/K2 generation and
private-ring injection, with workers retaining inherited public JSON. The
focused regression is RED on reviewed `b0d93e3` and GREEN after that repair.
Secret/raw-envelope logging, traces, screenshots, and video remain disabled.

No policy, storage, contract, production, or test-bypass change was made to
turn a blocked database gate into a pass.

## Publication record

- Parent/base: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383`.
- Reviewed pre-repair candidate: `b0d93e36b2c7f37a4758ea4b33dbfa9cf2c688bb`,
  tree `9ebcf18e4d0c24d7058a8b730a7e18a74ff950b6`.
- Prior implementation parent: `3710aeeef82314fff37e914833ca280ad5f56ab7`,
  tree `81be89e3133b774860a7fb1ab35e217bf502e08a`.
- Remote branch: [feature/server-i1-srv5-acceptance-2026-09-16](https://github.com/MaksimUnimax/Seller_Agents/tree/feature/server-i1-srv5-acceptance-2026-09-16).
- Historical publication blocker: PR creation was previously unavailable
  because `gh` was absent and an unauthenticated GitHub REST create-PR request
  returned HTTP 401 `Requires authentication`. PR8 now exists and is reused:
  [draft PR8](https://github.com/MaksimUnimax/Seller_Agents/pull/8).
- Server CI workflow source:
  [server-ci.yml](https://github.com/MaksimUnimax/Seller_Agents/blob/main/.github/workflows/server-ci.yml).
  The required remote Server CI remains a gate on the newly published
  candidate; its exact run status is not claimed in this local record.
- Documentation CI workflow source:
  [documentation.yml](https://github.com/MaksimUnimax/Seller_Agents/blob/main/.github/workflows/documentation.yml).
  The required Documentation CI remains a gate on the newly published
  candidate; its exact run status is not claimed in this local record.

A push is not a merge; the branch is unmerged and PR7 is not modified.
