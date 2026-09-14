# I1-SRV.0 contract and dependency audit

Date: 2026-09-14
Base: `74cd829b7e7134ad22c808b178cf3a239a8a71a6`
Branch: `feature/server-i1-auth-bootstrap`

## Scope and version decision

The audit covered the current `packages/contracts`, `apps/api`, server auth,
device, bootstrap, access, compatibility, remote-config, database, email, and
simulated-client packages, plus the server integration/E2E fixtures and the
D2.4 handoff requirements. No extension runtime or Health path is an authority
for this change.

**Decision: `ADDITIVE_CONTROL_PLANE_V1`.** The existing public route,
`control_plane_v1` request, `bootstrap_envelope_v1` envelope, signing domain,
and `bootstrap_snapshot_v1` semantics remain unchanged. The only payload
evolution is the required `account.id` sibling of the existing `account.status`.
The account object remains strict, so current consumers must use the canonical
schema and reject unknown fields. The repository has no connected production
extension consumer yet (`REAL_ACCOUNT_AUTH_NOT_CONNECTED`); every current
simulated/reference and test consumer validates through
`BootstrapSnapshotPayloadV1Schema` and was updated together. Existing
control-plane config releases and policy rows remain valid because their
contract/version identifiers and meanings do not change. A future deployed
consumer migration must still update its schema before receiving this
candidate; no compatibility shim or second version is introduced here.

## Dependency map

| Area | Current authority and finding | Classification |
|---|---|---|
| Device authorization create | `packages/server/device-auth` generates high-entropy device/user codes, encrypts start secrets, enforces expiry, idempotency, rate limits, and pending/approved/denied transitions; API wiring is in `apps/api/src/device-authorization-routes.ts`. | `EXISTS_AND_REUSED` |
| Poll/approve/deny/exchange | Portal approval/denial and single-use exchange are implemented by `device-auth` + `device-management` repositories/routes. Exchange creates the durable device/session and returns access/refresh credentials. | `EXISTS_AND_REUSED` |
| Authenticated subject | `packages/server/db/src/extension-auth-repository.ts` joins active session, device, account, and creating user. `ExtensionAuthService.authenticateAccess` re-reads this authority on every request and compares token device/account claims. | `EXISTS_AND_REUSED` |
| Access-token claims | Ed25519 JWT (`product-extension` audience) carries only `sub=sessionId`, `did=deviceId`, `aid=accountId`, version, issue/expiry; verification checks issuer, audience, key id, algorithm, and active DB subject. | `EXISTS_AND_REUSED` |
| Refresh claims/binding/rotation/reuse | Refresh tokens are opaque 32-byte values; only HMAC hashes are stored. PostgreSQL rotation atomically consumes the old row, creates the replacement, supports same-key replay, and marks the session compromised on reuse. | `EXISTS_AND_REUSED` |
| Bootstrap request | `BootstrapRequestV1Schema` is strict and contains contract/client/browser/device/config/optional detected AI fields. It has no trusted `accountId`; route re-validates the body and compares only `deviceId` with the bearer subject. | `EXISTS_AND_REUSED` |
| Bootstrap signed payload | `BootstrapService.issue` resolves policy, commercial access, beta access, AI, compatibility, entitlements, and timing, then validates `BootstrapSnapshotPayloadV1Schema` and signs via the existing signer. This candidate adds `account: { id: subject.accountId, status: "ACTIVE" }`. | `GAP_FOR_I1_SRV_1` |
| Signing/canonical serialization | `signBootstrapSnapshot` validates the payload, canonicalizes recursively with sorted object keys, signs domain + key id + canonical bytes using Ed25519, and `verifyBootstrapEnvelope` verifies signature, schema, and canonical bytes. | `EXISTS_AND_REUSED` |
| Contract-version policy | `control_plane_v1`, `bootstrap_snapshot_v1`, and `bootstrap_envelope_v1` are the current frozen identifiers. The additive decision above keeps all three identifiers and policy/catalog rows unchanged. | `EXISTS_AND_REUSED` |
| Compatibility behavior | `packages/server/compatibility` and `remote-config` resolve explicit supported/update-required/unsupported-browser states from published policy; no guessing or silent version fallback occurs. | `EXISTS_AND_REUSED` |
| Revocation/forbidden enforcement | Access authentication and refresh lookup require active session, device, account, and user. Device revoke revokes the device and session/refresh authority. Bootstrap runs only after bearer authentication and fails on device mismatch or unavailable policy/access. | `EXISTS_AND_REUSED` |
| `offlineGraceUntil` | Bootstrap defaults to a 15-minute snapshot plus 24-hour grace. Commercial access clamps both expiry and grace to the commercial deadline; beta/NONE do not use a commercial deadline. Simulated client enforces signed cache freshness and does not extend grace locally. | `EXISTS_AND_REUSED` |
| Stable errors | API and bootstrap map invalid auth, device mismatch, unavailable bootstrap, rate limits, subscription/access, and compatibility failures to existing `ApiErrorCodeV1` envelopes. No new error mapping is needed for account identity. | `EXISTS_AND_REUSED` |
| Simulated/reference client | `packages/server/simulated-extension-client` performs device activation, refresh, bearer bootstrap, envelope/key verification, strict payload validation, AI binding, and offline cache policy. It has no store or marketplace credential authority. | `EXISTS_AND_REUSED` |
| Bootstrap consumers and strictness | Server signer/verifier, simulated client/cache, integration fixtures, and E2E verification consume the canonical schema. The envelope transports payload bytes, so strict payload parsing occurs at verification. Current consumers were updated with the required account UUID. | `EXISTS_AND_REUSED` |
| OpenAPI source of truth | `apps/api/src/openapi.ts` builds the artifact from route schemas; `packages/contracts/openapi/openapi.json` is generated, not hand-edited. The envelope schema is unchanged, so the generated artifact has no semantic diff for this inner signed payload field. | `EXISTS_AND_REUSED` |
| D2.4 handoff | D2.4 keeps account/store UUIDs and credentials local to the extension; server I1 owns Seller Agents account identity and auth. No extension runtime, local catalog, marketplace API, or store-sync path is changed. | `EXISTS_AND_REUSED` |

## I1-SRV.1 result and invariants

`BootstrapSubject.accountId` is the sole source for the new signed identity.
`BootstrapRequestV1` has no trusted account selector, and strict parsing rejects
an injected `accountId`. The ID is validated as a UUID inside the signed
payload schema, canonicalized into the signed bytes, and therefore any account
identity tampering fails the existing cryptographic verification path. Device
ID remains an authenticated comparison input and is not added to the signed
payload. No marketplace/store identifier, credential, migration, table, or
second auth namespace was introduced.

Focused tests cover subject binding, same-account/different-device stability,
different-account separation, request override rejection, signed account
identity tampering, canonical signing, signer key-id consistency, and existing
BETA/COMMERCIAL/NONE timing and access behavior. Existing integration/E2E
fixtures continue to exercise revocation, compatibility, offline grace, and
strict consumers.

## Validation evidence

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`,
  `pnpm openapi:check`, `pnpm bridge:guard`, `pnpm build`, and `pnpm docs:check`:
  PASS.
- `pnpm db:migrate`: PASS on a disposable loopback PostgreSQL database.
- `pnpm test:integration`: 1,520 tests passed and one unrelated timing-sensitive
  P7.2 lock-race assertion failed on the first clean run; the focused P7.2
  suite then passed 10/10 on the same database. A prior reused database run
  also exposed only a disposable-data primary-key collision.
- Focused bootstrap E2E: 16/18 passed, including the new request-supplied
  account rejection and signed identity assertions. Two existing P3.6 cache
  expectations reported `UPDATE_REQUIRED`/`UNSUPPORTED_BROWSER` instead of
  `READY`; no account-identity assertion failed. The full 86-test E2E process
  was terminated by the execution environment while progressing through its
  matrix.

## Deferred or out-of-scope work

- `I1-SRV.2`: end-to-end device/auth server contract hardening and any newly
  discovered cross-layer contract gaps.
- `I1-SRV.3`, `I1-SRV.4`, `I1-SRV.5`: not started.
- `S1.2`: real email provider, credentials, and preproduction are deferred.
- Extension runtime integration, store synchronization, marketplace proxying,
  Health/P8.4 H3, and migrations are out of scope.
