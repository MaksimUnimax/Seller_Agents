# I1-SRV.2 Device Authorization / Token / Refresh / Revoke Integration Acceptance

Date: 2026-09-15
Status: `I1-SRV.2 IMPLEMENTED CANDIDATE / OWNER_ARCHITECT_REVIEW_PENDING`

## Scope and base

- Accepted base main SHA: `82761c57b4d5fddc7d55bf1ae715cfbcc61e1948`
- Branch: `feature/server-i1-device-auth-contract`
- Main was fetched before work began; it was at the accepted base and had no conflicting Stream A movement during implementation.
- This candidate reuses the existing Seller Agents portal, device-auth, device-management, extension-auth, bootstrap, and revocation authorities.
- No second authentication, device, session, token, or marketplace credential authority was introduced.

## Lifecycle gap map

The initial audit classified each stage before patching. Existing state-machine and route behavior was retained; only the proven durable-subject query gap and its evidence were completed.

| Stage | Initial classification | Final evidence |
| --- | --- | --- |
| START | `EXISTING_AND_CORRECT` | Existing bounded device authorization start and PostgreSQL persistence |
| AUTHENTICATE | `EXISTING_AND_CORRECT` | Existing portal OTP/session authority |
| APPROVE | `EXISTING_AND_CORRECT` | Existing owner-membership authorization and row-locked transition |
| DENY | `EXISTING_AND_CORRECT` | Existing terminal denial transition and exchange rejection |
| EXPIRE | `EXISTING_AND_CORRECT` | Existing TTL/expiry transition and exchange rejection |
| EXCHANGE | `EXISTING_AND_CORRECT` | Existing row-locked exchange/idempotency/replay behavior |
| ACCESS | `EXISTING_BUT_INCOMPLETE` | Fixed: durable session/device/account binding is now required in identity lookup; PostgreSQL mismatch and claim tests pass |
| REFRESH | `EXISTING_BUT_INCOMPLETE` | Fixed: rotation now requires active, consistently bound device/account/user authority before locking and minting a descendant |
| BOOTSTRAP | `TEST_GAP` | Added real device-exchange-to-V2-bootstrap E2E proof |
| REVOKE | `EXISTING_AND_CORRECT` | Existing atomic device/session revocation and refresh lineage behavior |
| POST_REVOKE_FAILURE | `EXISTING_BUT_INCOMPLETE` | Fixed/proven: access, refresh, and bootstrap fail closed after durable revocation |

## Contract and reused mechanisms

The existing public paths are unchanged:

- `POST /v1/device-authorizations` starts a pending attempt.
- `GET /v1/device-authorizations/{id}` reads bounded status.
- `POST /v1/device-authorizations/{id}/approve` and `/deny` are portal-authenticated, CSRF-protected transitions.
- `POST /v1/device-authorizations/token` exchanges only an approved attempt.
- `POST /v1/auth/otp/request` and `/verify` provide the existing portal OTP/session authority.
- `POST /v1/auth/refresh` performs existing opaque refresh rotation.
- `POST /v1/bootstrap` authenticates the extension bearer and issues the existing V1 or accepted V2 signed bootstrap.
- `POST /v1/devices/{device_id}/revoke` uses existing device/session/token-lineage revocation authority.

Authorization state is the existing `PENDING -> APPROVED -> EXCHANGED` path, with `PENDING -> DENIED` and bounded expiry to `EXPIRED`. `DENIED`, `EXPIRED`, and consumed/exchanged attempts are terminal. Approval and denial use PostgreSQL row locks and one-winner terminal transitions. Exchange uses the existing transaction, idempotency key, replay record, row locks, and durable device/session creation, so retries do not create a second authority.

The device code is high entropy and separately protected from the human-readable code. Stored authorization artifacts remain encrypted/HMAC-protected according to the existing device-auth design; raw codes and tokens are not included in this artifact or logs.

## Account, device, and access-token authority

Portal OTP establishes the existing authenticated portal session. Approval resolves account ownership through the existing active user/account-membership authority. The request `accountId` is only a server-verified selector; it cannot override the authenticated owner or rebind an attempt. Device identity is created and bound by the server during exchange.

Access tokens retain the existing claims:

```text
sub = session ID
did = device ID
aid = account ID
ver = 1
issuer = product-control-plane
audience = product-extension
```

The existing EdDSA verification validates issuer, audience, algorithm, key id, type, signature, and expiry. It then re-reads active durable session, device, account, and creating-user authority. This candidate adds the missing `device.account_id = session.account_id` consistency requirement to access identity lookup, refresh authorization, and refresh rotation. Signed claim mismatches, unknown sessions, forbidden durable subjects, and revoked devices therefore fail closed.

## Refresh semantics

Refresh credentials remain opaque high-entropy values; only the existing HMAC-derived token hash is persisted. Rotation is atomic under PostgreSQL row locking. The consumed parent records its generation, replacement, request idempotency, and replay/reuse state. The accepted same-request retry returns the deterministic replacement; conflicting or reused parent handling follows the existing security response and cannot fork a second valid lineage.

Before refresh rotation, the locked query now requires consistently bound active session/device/account/user authority. Device revocation, account suspension, user suspension, or session revocation therefore cannot mint a new descendant. Real PostgreSQL tests cover valid rotation, concurrent same-request rotation, replay/reuse, wrong binding, forbidden subjects, and refresh after device revoke.

## V2 bootstrap linkage

The new server E2E test performs a real portal-authenticated device authorization approval and token exchange, then calls `POST /v1/bootstrap` with the exchanged access token and `contractVersion=control_plane_v2`. It verifies the EdDSA signature and strict V2 envelope, and verifies:

- `account.id` equals the durable authenticated Seller Agents account UUID;
- V2 contract, snapshot, and envelope identifiers are present;
- request-supplied `accountId` is rejected as an unknown strict request field;
- changing the signed account payload makes verification fail;
- signed `deviceId` remains absent;
- V1 fixture behavior remains covered by the existing bootstrap suite;
- V2 uses version-scoped ordinary-latest CONFIG_RELEASE selection.

Existing beta/commercial policy tests remain active. BETA remains independent of the commercial max-active-device rule and reports BETA; COMMERCIAL behavior and expiry clamping remain unchanged; BETA+COMMERCIAL precedence remains accepted; NONE remains truthful. Device authorization does not create a new account or consume beta admission capacity.

## PostgreSQL evidence

The canonical integration configuration runs files serially against real PostgreSQL because the suites intentionally share and truncate a database. The relevant evidence includes:

- approval/denial race: one terminal transition wins;
- exchange and duplicate/replay behavior: one durable device/session authority;
- refresh rotation: concurrent requests produce one valid descendant lineage and preserve accepted idempotent retry behavior;
- claim/database binding, forbidden account/user/session, and revoked-device refresh failures;
- durable revocation leaves unrelated active device authority unaffected where policy requires.

No arbitrary sleeps, retry-until-green logic, mock-only transaction proof, or in-memory durable security lock was added.

## Public contract and migration decision

- Public endpoints and payload contracts: unchanged.
- OpenAPI: unchanged; no regeneration was required.
- Control-plane V1 compatibility: preserved.
- Signed V2 account identity semantics accepted in I1-SRV.1: preserved.
- Database migration: none. Existing schema already stores the authorization terminal/idempotency state, device/session bindings, refresh generations, consumed/replacement lineage, and revocation state. The missing invariant is enforceable by query joins and transaction boundaries; no migration is required.

## Verification and boundaries

Final local verification on this exact worktree head:

- `pnpm install --frozen-lockfile`: PASS (dependencies already installed from the frozen lockfile).
- `pnpm lint`: PASS.
- `pnpm format:check`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS; workspace unit suites and bridge guard.
- `pnpm test:integration`: PASS; 39 files, 1,526 tests, real PostgreSQL.
- `pnpm db:migrate`: PASS against both local integration databases.
- `pnpm openapi:check`: PASS; no contract change.
- `pnpm bridge:guard`: PASS.
- `pnpm build`: PASS for API, worker, health-runner, portal, and admin.
- `pnpm docs:check`: PASS; 411 files, 221 Markdown files, 346 relative links.
- `pnpm test:e2e`: PASS; 86/86 server Playwright tests with Chromium and real PostgreSQL.

No tests were skipped, weakened, deleted, or made retry-dependent.

The following remain explicitly not started: `I1-SRV.3`, `I1-SRV.4`, `I1-SRV.5`, `S1.2`, D3/store sync, Stream B Health/P8 work, extension runtime/storage/UI work, marketplace adapters/execution, and marketplace credential handling. Private signing keys remain server-only; signing functions are used only through the existing server issuance and verification paths required by this candidate.
