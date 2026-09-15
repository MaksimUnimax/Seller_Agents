# I1-SRV.3 Bootstrap Trust / Public Signing-Key Handoff / Safe Rotation

Date: 2026-09-15  
Status: `I1-SRV.3 IMPLEMENTED CANDIDATE / OWNER_ARCHITECT_REVIEW_PENDING`

## Scope and exact base

- Repository: `MaksimUnimax/Seller_Agents`
- Canonical branch fetched: `main`
- Exact base main SHA: `52f46680396d30b60fc95733dd30963c69bb5c89`
- Task branch: `feature/server-i1-bootstrap-trust`
- Branch created from: `52f46680396d30b60fc95733dd30963c69bb5c89`
- Main movement during task: none; the fetched `origin/main` remained at the exact base SHA.
- Previous accepted authority reused: I1-SRV.0, I1-SRV.1, and I1-SRV.2; no prior I1-SRV.3 branch or implementation existed at task start.

No extension runtime, Health/Stream B, store sync/D3, S1.2, I1-SRV.4, or I1-SRV.5 work was started.

## Trust gap map

| Item | Initial classification | Result |
| --- | --- | --- |
| SIGNING_ALGORITHM | EXISTING_AND_CORRECT | Ed25519 is retained. |
| CANONICAL_SERIALIZATION | EXISTING_AND_CORRECT | Recursive sorted-key canonical JSON is retained. |
| SIGNATURE_INPUT_RULE | EXISTING_AND_CORRECT | Existing domain/key-id/raw-payload rule is retained. |
| SIGNATURE_ENCODING | EXISTING_AND_CORRECT | Unpadded base64url is retained. |
| KEY_ID | EXISTING_AND_CORRECT | Stable machine identifier selects the exact key. |
| PUBLIC_KEY_FORMAT | EXISTING_AND_CORRECT | Ed25519 SPKI DER is retained. |
| PUBLIC_KEY_ENCODING | EXISTING_BUT_INCOMPLETE | Added explicit trust-bundle base64 encoding contract. |
| PUBLIC_KEY_FINGERPRINT | EXISTING_AND_CORRECT | SHA-256 over SPKI DER is retained and rechecked. |
| TRUSTED_KEY_RING | EXISTING_AND_CORRECT | Client trust remains packaged/pinned and lookup is exact by `keyId`. |
| ACTIVE_KEY_SELECTION | EXISTING_AND_CORRECT | Config-release authority selects the server key; issuance requires ACTIVE. |
| CONFIG_TO_KEY_BINDING | EXISTING_AND_CORRECT | Release `signingKeyId` and actual envelope key ID are checked. |
| ROTATION_OVERLAP | EXISTING_BUT_INCOMPLETE | Added machine-readable active/retired public handoff with overlap eligibility. |
| RETIREMENT | EXISTING_AND_CORRECT | Selectable-key retirement guard is retained. |
| REVOCATION | EXISTING_AND_CORRECT | Revocation remains terminal and emergency-safe. |
| UNKNOWN_KEY | EXISTING_AND_CORRECT | Unknown key IDs fail closed. |
| ROLLBACK | TEST_GAP | Added explicit policy/evidence: rollback is valid only to a still-ACTIVE prior key before retirement. |
| PUBLIC_HANDOFF_ARTIFACT | MISSING | Added schema, deterministic builder, and public-only export command. |
| PRIVATE_KEY_BOUNDARY | EXISTING_AND_CORRECT | Private keys remain API secret configuration only. |

No second signing system or second trust source was introduced.

## Signed bootstrap contract

Both accepted wire versions use:

- Algorithm: Ed25519.
- Canonical serialization: schema-validated JSON; recursively sort plain-object keys by code-unit order, preserve array order, encode UTF-8, and allow only null, booleans, strings, safe integers excluding `-0`, arrays, and ordinary objects.
- Signed bytes: `UTF-8("product-control-plane/bootstrap-snapshot/v1\\0") || UTF-8(keyId) || 0x00 || canonicalPayloadBytes`.
- Payload relation: the envelope `payload` is the exact canonical payload bytes encoded as unpadded base64url; the signature is over the decoded bytes, not over the base64url text.
- Envelope fields: `envelopeVersion`, `algorithm`, `keyId`, `payload`, and `signature` are strict schema fields. The version is checked by the V1/V2 schema and is not accepted as a substitute for payload validation.
- Signature encoding: unpadded base64url.
- Key ID: a lowercase stable machine identifier; it is included in the signed input and selects exactly one already-trusted public key.
- V1: `control_plane_v1` / `bootstrap_snapshot_v1` / `bootstrap_envelope_v1`.
- V2: `control_plane_v2` / `bootstrap_snapshot_v2` / `bootstrap_envelope_v2`, including the signed Seller Agents `account.id`.

V1 and V2 verification are separate strict paths. V1 rejects V2 envelopes and V2 rejects V1 envelopes. Payload, account identity, signature, wrong-key, unknown-key, malformed-envelope, and algorithm failures remain fail-closed.

## Public trust handoff

The machine-readable contract is [bootstrap-trust-bundle-v1.schema.json](bootstrap-trust-bundle-v1.schema.json). The server-side exporter is `pnpm config:trust-export`, implemented by `tooling/server/export-config-trust-bundle.ts`.

The deterministic artifact has:

- `trustBundleVersion: bootstrap_trust_bundle_v1`;
- bundle algorithm `Ed25519`;
- public key format `spki_der` and encoding `base64`;
- fingerprint algorithm `sha256` and encoding `lowercase_hex`;
- keys sorted deterministically by `keyId`;
- per key: `keyId`, public SPKI-DER base64, `fingerprintSha256`, lifecycle, and trust eligibility.

The export reads only `signing_keys` public metadata and append-only lifecycle events. ACTIVE keys are emitted as `SIGNING_AND_VERIFICATION`; RETIRED keys are emitted as `VERIFICATION_OVERLAP`; REGISTERED keys are not yet package-trusted; REVOKED keys are excluded. Fingerprints, Ed25519/SPKI validity, duplicate IDs, and duplicate public material are checked before serialization. The output contains no private-key field or private-key material and contains no generated production key.

Trust establishment is through a separately authenticated software distribution/release authority: the extension release packages or pins this public bundle before runtime. Runtime bootstrap data may use `keyId` to select among that packaged ring, but a bootstrap response, runtime download, database lookup, or server-supplied public key may never establish trust. TOFU and runtime fetch-and-trust are explicitly rejected.

## Rotation and lifecycle policy

1. Register K2 public metadata.
2. Make K2 available in server secret configuration and in the separately authenticated overlap release package.
3. Activate K2 while K1 remains trusted and, where needed, ACTIVE.
4. Publish/select K2 config releases; V1 rollout selection remains `bootstrap.config`, while V2 remains version-scoped ordinary-latest.
5. Keep K1 in the package as `VERIFICATION_OVERLAP` while supported cached-signature verification may still need it.
6. Retire K1 only after the server selectable-release guard proves it is no longer selectable. A later extension release may remove K1 only after the supported verification/cache horizon.

Retirement is planned rotation: a retired key remains representable as verification-only overlap material. Revocation is an emergency terminal state: it is not blocked by current configuration, is not emitted as package trust authority, and prevents new server issuance. Server revocation cannot retroactively make a previously shipped public key mathematically unable to verify an already-correct signature; final offline/cache behavior remains the I1-SRV.4 boundary.

Rollback may select a still-ACTIVE prior key already present in the packaged ring and may publish a new config release whose `signingKeyId` names that key. A RETIRED key is not reactivated by rollback, and a REVOKED key can never be used for rollback. Rollback never obtains trust at runtime and must keep the envelope key ID equal to the selected release key ID.

## Existing authority and binding proof

- `CONFIG_SIGNING_KEY_RING_JSON` remains the bounded API-only private ring; derived SPKI-DER and SHA-256 metadata are bound against the immutable registry.
- The API signer looks up the requested release key, requires its lifecycle to be ACTIVE on every issuance, and signs with that exact configured key.
- Client requests cannot select an arbitrary signing key.
- `config_releases.signing_key_id` is foreign-key bound to the registry and publication requires ACTIVE lifecycle.
- Bootstrap service checks the returned envelope key ID against the selected release `signingKeyId`.
- V1 rollout and V2 ordinary-latest selection remain unchanged from accepted I1-SRV.1 semantics.

## Cached bootstrap interaction

This step does not redesign offline errors or grace semantics. A supported cached signature must continue to verify against an overlap key until policy permits its removal from a later packaged release. Key rotation alone does not invalidate an already-correctly-signed payload. Emergency revocation stops new server signing, while I1-SRV.4 owns the final online/offline and error taxonomy.

## Tests and evidence

Focused remote-config unit tests: 40 passed. Real PostgreSQL P3.5 lifecycle integration: 14 passed, including deterministic registry export, fingerprint/alias safety, active/retired overlap, and revoked exclusion. Existing accepted I1-SRV.2 auth/device tests and V1/V2 bootstrap tests remain in the repository unchanged except for the added V2 coverage.

Required cryptographic cases are covered across the retained tests and new regressions: valid V1/V2, cross-version rejection, payload/account/signature tamper, wrong public key, unknown key ID, malformed envelope, wrong algorithm, canonical bytes, deterministic/different fingerprints, malformed public key, unsupported algorithm, config-to-key binding, arbitrary key-selection rejection, overlap, retirement, revocation, and rollback constraints.

Final local gate results on the candidate worktree:

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm lint`: PASS.
- `pnpm format:check`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS.
- `pnpm test:integration`: PASS, 39 files / 1,527 tests.
- `pnpm db:migrate`: PASS.
- `pnpm openapi:check`: PASS.
- `pnpm bridge:guard`: PASS.
- `pnpm build`: PASS.
- `pnpm docs:check`: PASS, 413 files / 222 Markdown files / 348 relative links.
- `pnpm test:e2e`: PASS, 86 tests including Chromium and existing Health coverage.

The final local checks were run after the last tracked test-fixture correction; no lockfile, generated OpenAPI, migration, or boundary files changed.

## Contract, schema, and boundary decisions

- Server-owned public handoff contract: changed by adding the non-HTTP trust-bundle schema and exporter.
- HTTP/OpenAPI: unchanged; no runtime public-key endpoint was added.
- Database schema: unchanged; no migration was created or required. Existing immutable registry, lifecycle events, config-release foreign key, and selectable-release guard express the invariants safely.
- Control-plane V1: preserved.
- Control-plane V2: preserved.
- Private signing keys: server-only secret configuration; none committed, exported, logged, persisted, or returned.
- Extension consumption/packaging: deferred to the extension architect; no `apps/extension/**` or runtime trust store was changed.

## Roadmap status

- I1-SRV.0: ACCEPTED.
- I1-SRV.1: ACCEPTED.
- I1-SRV.2: ACCEPTED.
- I1-SRV.3: IMPLEMENTED CANDIDATE / OWNER_ARCHITECT_REVIEW_PENDING.
- I1-SRV.4: NOT STARTED.
- I1-SRV.5: NOT STARTED.
- S1.2: NOT STARTED.
- D2.4 `DEVELOPMENT_APPLICATION_VERIFIED` and `REAL_ACCOUNT_AUTH_NOT_CONNECTED` are preserved.
