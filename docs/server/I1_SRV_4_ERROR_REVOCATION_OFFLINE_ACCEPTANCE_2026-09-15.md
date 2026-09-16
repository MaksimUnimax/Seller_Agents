# I1-SRV.4 Error / Revocation / Offline Semantics

Status: `I1-SRV.4 ACCEPTED on main5d7c8853 / PR6`

The original candidate wording and evidence below are preserved as historical
record. It does not reopen I1-SRV.4 implementation; the consolidated
I1-SRV.5 reference acceptance is recorded separately.

Repository: `MaksimUnimax/Seller_Agents`
Base main SHA: `bc0cd0088ca50ba06021ea602a46bdd90de91378`
Branch: `feature/server-i1-error-offline-semantics`
Candidate SHA: recorded by the final execution report after this evidence commit

## Scope and decisions

This step closes the server-owned stable error and reference offline policy
contract. It does not start I1-SRV.5, S1.2, D3/store sync, Health/P8, or
extension runtime work. The existing `error.code`, `error.message`, and
`error.correlationId` envelope remains unchanged. No public `ApiErrorCodeV1`
was added, removed, or renamed.

The stable action classes are: retry the same operation later; poll device
authorization; attempt one token refresh; reauthenticate; stop for account
action; update the extension; reject the browser; use signed bootstrap state;
use a verified cache for an eligible transient/transport fallback; or fail
closed with no offline fallback.

## Complete error/client-action gap map

`EXISTING_EXACT` means the public result and action are already exact;
`EXISTING_GENERIC_BUT_CORRECT` means the server intentionally avoids a
security-sensitive oracle while the client action is deterministic;
`SIGNED_BOOTSTRAP_STATE_NOT_HTTP_ERROR` is a successful signed response.

| Condition | Authority | HTTP / public result | Classification; action; cache | Invalidate local auth/cache? |
|---|---|---|---|---|
| Device auth invalid | device-auth input/hash | 401 `DEVICE_AUTH_INVALID` | exact; reauthorize; no | no |
| Pending | device-auth state | 409 `DEVICE_AUTH_PENDING`, positive `Retry-After` | exact; poll | no |
| Denied / expired / already exchanged | terminal device-auth state | 409 `DEVICE_AUTH_CLOSED` | generic but correct; stop and reauthorize; no | no |
| Rate limited / device limit | rate/admission authority | 429 `DEVICE_AUTH_RATE_LIMITED` / 409 `DEVICE_LIMIT_REACHED` | exact; retry later / account action; no | no |
| Access malformed, bad signature, expired, wrong issuer, audience, algorithm | EdDSA verifier | 401 `UNAUTHORIZED` | generic but correct; one bounded refresh, then reauth; no cache bypass | on terminal recovery |
| Access session/device/account mismatch or durable revoke/forbid | active session-device-account-user join | 401 `UNAUTHORIZED` | generic but correct; reauth; no cache bypass | yes, terminal marker |
| Refresh invalid / expired / device revoked / account forbidden / session invalid | refresh lineage + durable join | 401 `AUTH_REFRESH_INVALID` | generic but correct; clear auth and reauthorize; no | yes |
| Refresh idempotent replay | atomic refresh lineage | 200 rotated response, replay flag internal | exact; accept one deterministic replacement | no |
| Refresh reuse/replay outside window | atomic lineage, session compromise | 401 `AUTH_REFRESH_INVALID` (internal `EXTENSION_AUTH_REUSE`) | generic but correct; clear auth and reauthorize; no | yes |
| Refresh rate / service unavailable | refresh limiter / service | 429 `AUTH_RATE_LIMITED` / 503 `SERVICE_UNAVAILABLE` | exact; retry later; no cached bootstrap operation is implied | no |
| Bootstrap device mismatch | authenticated subject vs request | 403 `DEVICE_MISMATCH` | exact; stop and inspect client binding; no | yes |
| Bootstrap no bearer / invalid bearer / forbidden account/device/session | access pre-handler durable join | 401 `UNAUTHORIZED` | generic but correct; refresh once only for 401, otherwise reauth; no bypass | yes on terminal result |
| Bootstrap policy/config failure | policy catalog, compatibility, feature/rollout source | 503 `BOOTSTRAP_UNAVAILABLE` | transient/invariant inability to issue trustworthy signed state; cache eligible only when matching verified cache exists | no |
| Bootstrap signer unavailable/key mismatch | server signing authority | 503 `BOOTSTRAP_UNAVAILABLE` | transient/invariant; matching verified cache may be used | no |
| Update required / recommended | signed compatibility state | 200 signed `UPDATE_REQUIRED` / `UPDATE_RECOMMENDED` | signed state; update required stops, recommended remains usable; no stale bypass of required state | no |
| Unsupported browser / maintenance | signed compatibility state | 200 signed state | signed state; reject/update; no stale bypass | no |
| Access basis NONE / beta not admitted | signed access state | 200 signed `accessBasis=NONE` | signed state; no entitled feature/capability | no |
| Beta admission closed/capacity | OTP admission authority | 403 `BETA_CLOSED` / `BETA_CAPACITY_REACHED` | exact onboarding action; existing accounts are not reclassified by this result | no |
| Commercial access ended | commercial access resolver | signed `accessBasis=NONE` when bootstrap can be issued, otherwise 503 only for inability/invariant | signed normal state; account action; no grace extension | no |
| Network unreachable / DNS / timeout | client transport | no HTTP response/code | client-only; transport fallback if eligible verified cache | no |

There is no `NETWORK_UNAVAILABLE` server code. `DEVICE_FORBIDDEN` remains the
existing portal/device-management forbidden result and `ACCOUNT_FORBIDDEN`
remains the existing account-scoped portal result; extension bearer failures
remain deliberately generic `UNAUTHORIZED`.

## Bootstrap unavailable audit

`BootstrapService` sources were classified as follows:

- policy resolver `NO_CONFIG_RELEASE`, invalid config/compatibility/feature or
  rollout source: transient/invariant inability to issue a trustworthy signed
  snapshot;
- commercial `ACCOUNT_NOT_FOUND` or `CORRUPTED`: unreachable through a valid
  authenticated subject in normal operation, and fail closed as 503 if the
  invariant is encountered;
- AI resolution failure: transient/invariant inability to issue a coherent
  signed snapshot;
- signer failure, signing-key mismatch, and invalid commercial deadline: the
  server cannot issue a trustworthy valid response and returns 503.

Normal policy denial is not represented by fake 503: compatibility and access
states are carried in a successful signed bootstrap (`UPDATE_REQUIRED`,
`UNSUPPORTED_BROWSER`, `MAINTENANCE`, and `accessBasis=NONE`). Therefore the
existing `BOOTSTRAP_UNAVAILABLE` 503 is the audited transient/invariant class
and is cache-fallback eligible only when a verified matching cache exists.

## Revocation and durable authority

Access authentication rechecks active session, device, account, creating user,
and binding consistency on every request. Device revoke durably revokes the
device and active sessions; refresh rotation requires active durable joins and
cannot mint descendants after device, account, user, or session denial.
Bootstrap is behind the same bearer authority. A revoked device therefore
fails access, refresh, and bootstrap online; another device/account remains
independent. The public generic mappings are intentional: exposing whether a
credential is expired, forged, or attached to a forbidden durable subject is
not necessary for the safe client action and would create an oracle.

## Offline reference semantics

The executable primitive is
`evaluateCachedBootstrapEligibility` in
`packages/server/simulated-extension-client/src/offline-policy.ts`. It consumes
the existing strict verification result; it does not duplicate cryptographic
verification or implement a network client. The cache adapter adds a
device/session-scoped terminal marker and records exact acquisition context.

### State and time

- `FRESH`: verified, context-matching, `now < expiresAt`.
- `STALE_BUT_OFFLINE_GRACE_ELIGIBLE`: verified and matching, with
  `expiresAt <= now < offlineGraceUntil`, and only an eligible transport or
  audited transient fallback trigger.
- `EXPIRED`: `now >= offlineGraceUntil`; local extension is impossible.
- `UNTRUSTED`: verification did not succeed, including malformed/unknown-key/
  bad-signature results; fail closed.
- `CONTEXT_MISMATCH`: contract, extension version, browser family/version, or
  other locally bound request context differs; fail closed.
- `TERMINALLY_INVALIDATED`: this device/session observed an online terminal
  auth/revocation/forbidden response; stale cache cannot bypass it.

Both boundaries are half-open: `now == expiresAt` is no longer fresh and
`now == offlineGraceUntil` is unusable. Signed timestamps are never mutated.
The existing `lastObservedWallTimeHighWatermark` cache metadata is the
persisted effective-time high-watermark (the legacy field name is retained for
the v1 reference record). Effective time is the maximum of trusted server
time, that durable floor, current wall time, and valid same-runtime monotonic
progression. Every accepted cached/offline decision advances and persists the
floor before returning `ALLOW`; an expiry observation is persisted too, so a
restart cannot reclaim consumed grace. A cache-state persistence failure fails
closed for cached authorization. A valid live verified response remains
usable when its optional cache write fails.

The same-runtime monotonic anchor detects monotonic rollback while it exists;
it is not durable across process restart. The persisted effective-time floor is
the restart protection. This is an honest client policy, not protection against
a hostile machine owner tampering with browser storage or the system clock, and
it does not claim hardware-level anti-rollback.

### Trust, context, and capability

Offline use first requires the packaged exact key-id lookup and existing strict
Ed25519 V1/V2 verification, then strict schema/time/context checks. Runtime key
fetch and TOFU are forbidden. The effective local capability is the
intersection of the locally packaged capability set with signed feature or
entitlement permission. A remote signed capability absent from the packaged
set cannot activate; a local capability cannot override signed denial.

### Triggers and limitations

DNS/no network/connection refusal/timeout/TLS failure before a valid response
is client transport state, never a server error. It may use an eligible cache.
The audited bootstrap 503 may use a verified matching cache; a 503 without one
remains an HTTP error. 401/403, terminal device-auth responses, signed
compatibility blocks, and 200 verification failures never use stale fallback.

While truly offline, a client cannot learn a later server-side revoke. The
last verified signed policy governs only within its signed grace and local
capability/context limits. Once a terminal online signal is observed, the
marker prevents stale bypass. Cache invalidation does not delete local
marketplace data, and ordinary marketplace execution has no server roundtrip.

Beta has precedence `BETA > COMMERCIAL > NONE`. Commercial
`offlineGraceUntil` is clamped to the effective commercial deadline only when
`accessBasis=COMMERCIAL`; an effective BETA account is not clamped by a
commercial deadline. No unlimited grace is introduced.

## Public-code and OpenAPI decisions

- Public codes reused: `SERVICE_UNAVAILABLE`, `AUTH_REFRESH_INVALID`,
  `DEVICE_AUTH_RATE_LIMITED`, `DEVICE_AUTH_INVALID`, `DEVICE_AUTH_FORBIDDEN`,
  `DEVICE_AUTH_STATE_CONFLICT`, `DEVICE_AUTH_IDEMPOTENCY_CONFLICT`,
  `DEVICE_AUTH_CLOSED`, `DEVICE_AUTH_PENDING`, `DEVICE_LIMIT_REACHED`,
  `DEVICE_FORBIDDEN`, `DEVICE_NOT_FOUND`, `UNAUTHORIZED`, `DEVICE_MISMATCH`,
  `BOOTSTRAP_UNAVAILABLE`, `SUBSCRIPTION_REQUIRED`, `ACCOUNT_FORBIDDEN`,
  `BETA_CLOSED`, and `BETA_CAPACITY_REACHED`.
- Public codes added: none. Existing generic codes already produce the same
  safe client action; no expiration/reuse/revocation oracle is justified.
- Public codes removed: none.
- HTTP status/OpenAPI changes: none. `OPENAPI_CHANGED=NO`; the primitive's
  internal policy reasons are not a second HTTP protocol.
- Breaking change: no.
- Database schema/migration: unchanged; no migration created or required.

## Tests and boundaries

Focused I1-SRV.4 tests are in
`packages/server/simulated-extension-client/src/offline-policy.test.ts` and
the updated `policy.test.ts`. They cover strict trust/V1/V2/account tamper,
all time boundaries, rollback, context, local capability intersection,
transport/503 triggers, terminal invalidation, refresh credential clearing,
and cache behavior.

Existing server authority tests remain required and cover the public/device
and durable matrix: `apps/api/src/device-authorization-routes.test.ts`,
`apps/api/src/refresh-routes.test.ts`,
`tests/integration/server/p2-3-device-authorization.integration.test.ts`,
`p2-4-token-core.integration.test.ts`,
`p2-5-device-management.integration.test.ts`,
`p3-4-bootstrap.integration.test.ts`, and
`tests/e2e/server/activation.spec.ts` / `bootstrap.spec.ts`. They cover
pending/terminal exchange, rate/limit/service outcomes, malformed and signed
claim failures, expiry/issuer/audience/algorithm verification, durable
revocation/forbidden account/session behavior, atomic rotation/replay/reuse,
bootstrap signer/config/compatibility/access-basis states, and commercial
deadline precedence/clamping.

The terminal invalidation store operation is required to durably write a
device/session-scoped marker. If that marker write fails, the client attempts
durable cache removal; if either succeeds, a restarted client has no stale
cache authority. The in-memory reference marker is covered by restart tests.

The following remain untouched: Health and `apps/health-runner/**`, extension
runtime/UI/storage, marketplace execution and credentials, bridge-core,
store sync/D3, S1.2, and I1-SRV.5. `D2.4 DEVELOPMENT_APPLICATION_VERIFIED`
and `REAL_ACCOUNT_AUTH_NOT_CONNECTED` are preserved. I1-SRV.5 is not started.
