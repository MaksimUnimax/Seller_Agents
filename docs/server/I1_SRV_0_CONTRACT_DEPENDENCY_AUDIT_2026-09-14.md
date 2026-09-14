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

**Decision: `VERSIONED_CONTROL_PLANE_V2`.** The existing public route and
`control_plane_v1` / `bootstrap_snapshot_v1` / `bootstrap_envelope_v1` semantics
remain unchanged. The required `account.id` sibling of `account.status` is
therefore emitted only for the explicit v2 request and signed with the v2
snapshot/envelope tags. Both versions are accepted by the route and selected
against their own published config/policy rows. The account object remains
strict in both schemas. There is no connected production extension consumer
yet (`REAL_ACCOUNT_AUTH_NOT_CONNECTED`), so v2 is available for the planned
consumer migration without making existing v1 clients reject their payload.

## Dependency map

| Area | Current authority and finding | Classification |
|---|---|---|
| Device authorization create | `packages/server/device-auth` generates high-entropy device/user codes, encrypts start secrets, enforces expiry, idempotency, rate limits, and pending/approved/denied transitions; API wiring is in `apps/api/src/device-authorization-routes.ts`. | `EXISTS_AND_REUSED` |
| Poll/approve/deny/exchange | Portal approval/denial and single-use exchange are implemented by `device-auth` + `device-management` repositories/routes. Exchange creates the durable device/session and returns access/refresh credentials. | `EXISTS_AND_REUSED` |
| Authenticated subject | `packages/server/db/src/extension-auth-repository.ts` joins active session, device, account, and creating user. `ExtensionAuthService.authenticateAccess` re-reads this authority on every request and compares token device/account claims. | `EXISTS_AND_REUSED` |
| Access-token claims | Ed25519 JWT (`product-extension` audience) carries only `sub=sessionId`, `did=deviceId`, `aid=accountId`, version, issue/expiry; verification checks issuer, audience, key id, algorithm, and active DB subject. | `EXISTS_AND_REUSED` |
| Refresh claims/binding/rotation/reuse | Refresh tokens are opaque 32-byte values; only HMAC hashes are stored. PostgreSQL rotation atomically consumes the old row, creates the replacement, supports same-key replay, and marks the session compromised on reuse. | `EXISTS_AND_REUSED` |
| Bootstrap request | `BootstrapRequestV1Schema` is strict and contains contract/client/browser/device/config/optional detected AI fields. It has no trusted `accountId`; route re-validates the body and compares only `deviceId` with the bearer subject. | `EXISTS_AND_REUSED` |
| Bootstrap signed payload | `BootstrapService.issue` preserves the v1 payload; `issueV2` validates/signs `BootstrapSnapshotPayloadV2Schema` and adds `account: { id: subject.accountId, status: "ACTIVE" }`. | `GAP_FOR_I1_SRV_1` |
| Signing/canonical serialization | `signBootstrapSnapshot` validates the payload, canonicalizes recursively with sorted object keys, signs domain + key id + canonical bytes using Ed25519, and `verifyBootstrapEnvelope` verifies signature, schema, and canonical bytes. | `EXISTS_AND_REUSED` |
| Contract-version policy | v1 identifiers and rows remain valid; v2 identifiers are explicit and are resolved through the same catalog/publication authority with no fallback from v2 to v1. | `EXISTS_AND_REUSED` |
| Compatibility behavior | `packages/server/compatibility` and `remote-config` resolve explicit supported/update-required/unsupported-browser states from published policy; no guessing or silent version fallback occurs. | `EXISTS_AND_REUSED` |
| Revocation/forbidden enforcement | Access authentication and refresh lookup require active session, device, account, and user. Device revoke revokes the device and session/refresh authority. Bootstrap runs only after bearer authentication and fails on device mismatch or unavailable policy/access. | `EXISTS_AND_REUSED` |
| `offlineGraceUntil` | Bootstrap defaults to a 15-minute snapshot plus 24-hour grace. Commercial access clamps both expiry and grace to the commercial deadline; beta/NONE do not use a commercial deadline. Simulated client enforces signed cache freshness and does not extend grace locally. | `EXISTS_AND_REUSED` |
| Stable errors | API and bootstrap map invalid auth, device mismatch, unavailable bootstrap, rate limits, subscription/access, and compatibility failures to existing `ApiErrorCodeV1` envelopes. No new error mapping is needed for account identity. | `EXISTS_AND_REUSED` |
| Simulated/reference client | `packages/server/simulated-extension-client` performs device activation, refresh, bearer bootstrap, envelope/key verification, strict payload validation, AI binding, and offline cache policy. It has no store or marketplace credential authority. | `EXISTS_AND_REUSED` |
| Bootstrap consumers and strictness | v1 consumers continue to parse the old strict schema; v2 signer/verifier and tests parse the new strict schema. The envelope transports payload bytes, so strict payload parsing occurs at verification. | `EXISTS_AND_REUSED` |
| OpenAPI source of truth | `apps/api/src/openapi.ts` builds the artifact from route schemas; `packages/contracts/openapi/openapi.json` is generated, not hand-edited. The generated artifact now records the v1/v2 request and response union. | `EXISTS_AND_REUSED` |
| D2.4 handoff | D2.4 keeps account/store UUIDs and credentials local to the extension; server I1 owns Seller Agents account identity and auth. No extension runtime, local catalog, marketplace API, or store-sync path is changed. | `EXISTS_AND_REUSED` |

## I1-SRV.1 result and invariants

`BootstrapSubject.accountId` is the sole source for the v2 signed identity.
`BootstrapRequestV1` and `BootstrapRequestV2` have no trusted account selector,
and strict parsing rejects an injected `accountId`. The ID is validated as a
UUID inside the v2 signed payload schema, canonicalized into the signed bytes,
and therefore any account identity tampering fails cryptographic verification.
Device ID remains an authenticated comparison input and is not added to the
signed payload. No marketplace/store identifier, credential, migration, table,
or second auth namespace was introduced.

Focused tests cover v1 compatibility, v2 subject binding, signed account
identity, canonical signing, signer key-id consistency, and existing
BETA/COMMERCIAL/NONE timing and access behavior. Existing integration/E2E
fixtures continue to exercise revocation, compatibility, offline grace, and
strict v1 consumers.

## Validation evidence

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`,
  `pnpm openapi:check`, `pnpm bridge:guard`, `pnpm build`, and `pnpm docs:check`:
  PASS after regenerating the OpenAPI artifact and its exact-hash acceptance
  fixture.
- `pnpm db:migrate`: PASS on a disposable loopback PostgreSQL database.
- `pnpm test:integration`: 1,520 tests passed on the full matrix; the only
  first-run failure was the P5.7 exact OpenAPI hash, which was updated to the
  regenerated artifact and passed in the focused 80-test P5.7 rerun. The P7.2
  lock-race suite passed 10/10 in the same database.
- `pnpm test:e2e` could not start its web-server matrix because the concurrent
  Stream B checkout occupied the required portal port 3200. No E2E test result
  is claimed for this corrective run; the earlier candidate's focused run had
  16/18 passing with two existing P3.6 cache expectations reporting
  `UPDATE_REQUIRED`/`UNSUPPORTED_BROWSER`, and no account-identity assertion
  failed.

## Deferred or out-of-scope work

- `I1-SRV.2`: end-to-end device/auth server contract hardening and any newly
  discovered cross-layer contract gaps.
- `I1-SRV.3`, `I1-SRV.4`, `I1-SRV.5`: not started.
- `S1.2`: real email provider, credentials, and preproduction are deferred.
- Extension runtime integration, store synchronization, marketplace proxying,
  Health/P8.4 H3, and migrations are out of scope.
