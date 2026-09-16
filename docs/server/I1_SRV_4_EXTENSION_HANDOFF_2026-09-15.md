# I1-SRV.4 server-owned extension handoff

Status: `I1-SRV.4 ACCEPTED on main5d7c8853 / PR6`

The original candidate wording is preserved as historical handoff context.
I1-SRV.5 consolidates the server/reference lifecycle proof without changing
this V1 client-policy boundary.

This is a reference contract for the later browser client. It does not add a
second protocol, browser storage implementation, marketplace execution, or
server-side marketplace credentials.

## Online control-plane behavior

- Device authorization exchange returns `409 DEVICE_AUTH_PENDING` while
  pending and the client polls after the positive `Retry-After` value.
- `DEVICE_AUTH_CLOSED` is the stable terminal exchange result for denied,
  expired, and already-exchanged requests. `DEVICE_AUTH_INVALID` is `401` for
  malformed/unknown authorization input; rate limiting is `429`; device limit
  is `409 DEVICE_LIMIT_REACHED`; access/subscription denial is
  `403 SUBSCRIPTION_REQUIRED`.
- Bootstrap `401 UNAUTHORIZED` covers missing, malformed, invalid, expired,
  wrongly issued/audienced/signed, or durably unauthorized access tokens. The
  client attempts one bounded refresh, retries bootstrap once after success,
  and otherwise clears extension auth and requires fresh device authorization.
- Refresh `401 AUTH_REFRESH_INVALID` covers invalid, expired, revoked,
  forbidden, stale, and detected-reuse refresh credentials. The client clears
  current auth and requires fresh device/account authorization. A same-key
  retry inside the accepted replay window returns the one rotated result.
- A revoked device, suspended/forbidden account, or revoked/forbidden session
  fails closed online for access, refresh, and bootstrap. It does not affect an
  unrelated device or account.

## Cached bootstrap behavior

Cached use requires, in order: strict V1/V2 envelope parsing; exact lookup in
the separately packaged trusted key ring; Ed25519 verification; strict payload
schema validation; time validation; exact cached/current context match; local
packaged-capability intersection; and no locally observed terminal auth,
revocation, or forbidden state. Unknown keys, bad signatures, malformed
payloads, and trust-ring changes fail closed. Runtime key download and TOFU
cannot establish trust.

The cache records contract version, extension version, browser family/version,
device, and session context. A context change is restrictive: it requires a
new online verified bootstrap. Effective capability is always local packaged
capability AND signed feature/entitlement permission; remote config cannot
activate an absent local capability or override a signed denial.

Use the signed times with half-open boundaries:

- `now < expiresAt`: `FRESH`.
- `expiresAt <= now < offlineGraceUntil`: stale but eligible only for an
  explicitly eligible offline/transient fallback.
- `now >= offlineGraceUntil`: `EXPIRED`; the client cannot extend it.

Only a client transport failure (DNS/no network/connect/TLS/timeout before a
valid HTTP response) or the audited transient bootstrap `503
BOOTSTRAP_UNAVAILABLE` may invoke the cache fallback. `401`, `403`, update
required, unsupported browser, maintenance, terminal device-auth results,
successful incompatible signed policy, and verification failures must not be
bypassed by stale cache. A `503` with no matching eligible cache remains an
HTTP server result.

Once an online terminal auth/revocation/forbidden result is observed, the
device/session cache is marked `TERMINALLY_INVALIDATED` and cannot be used as
a bypass. True offline operation cannot discover a later server-side revoke;
the last verified signed policy is the only authority until grace ends or a
terminal result is observed.

The existing `lastObservedWallTimeHighWatermark` cache metadata is the
persisted effective-time high-watermark. After a cached/offline authorization
decision is eligible, the candidate effective time is persisted before
returning `ALLOW`; persistence failure fails closed. Repeated accepted uses can
only advance the floor. A process restart therefore reloads the later floor,
and rolling the wall clock back cannot reclaim consumed grace. An observation at
or beyond `offlineGraceUntil` is persisted as well, so restart remains expired.
Signed deadlines and the signed envelope bytes are never rewritten.

The same-runtime monotonic anchor detects rollback while that runtime exists;
it is not durable across restart. The persisted effective-time floor provides
the restart floor. Browser storage and a machine owner's clock remain outside
the cryptographic guarantee; this is not hardware-level anti-rollback.

Terminal online invalidation uses a required durable device/session marker. If
marker persistence fails, durable cache removal is attempted; the reference
tests prove the restarted client fails closed when the cache cannot be
preserved.

Ordinary marketplace commands remain local and require no server roundtrip.
Server outage does not delete local marketplace data.
