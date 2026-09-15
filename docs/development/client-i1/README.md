# I1-C1 client candidate

Status: R2 implementation candidate prepared for architect review. This work does not accept or close I1, C2, I1-SRV.4, I1-SRV.5, D3, Health/P8, S1.2, release or deployment.

Base: `bc0cd0088ca50ba06021ea602a46bdd90de91378`. R2 assigned starting head: `9e80e8ad531f079b38bf03b9e29f171c87c477c0`. Final head is recorded in the R2 evidence after publication.

R2 closes the reviewed flight-owner, forced-bootstrap-refresh, fail-closed authority, composed signed-out routing, and contractual version-comparison defects. Polling, activation and refresh owners carry generation and logical identity; restrictive denial replaces in-memory authority before persistence/cleanup and uses removal as a durable fallback. Work permission is checked separately from composed application readiness. Pending transport/status/rate-limit failures remain retryable until the attempt deadline, while terminal denial is not restored as authority after restart.

Bootstrap V2 remains WebCrypto Ed25519 with packaged trust, exact signed bytes and strict envelope/payload checks. Work requires a current account/device/session generation, compatible browser/extension, supported local AI mapping, signed policy and a validated profile fingerprint; unsupported AI/profile fallback is denied. The browser verifier is included in the extracted package and is tested against source/package fixtures, including payload and identifier boundaries.

Account authority and local Work context carry auth generation. Compatible same-session bootstrap does not globally finish Work; authority changes and late callbacks are fenced. Ozon/WB queues, delivery, recovery, attachment/IDB and ordinary local marketplace dispatch remain covered by the preserved composed route. Popup account reset is visible in authenticated and pending states, with pending cancellation available.

## Verification

The final local runs use Node `v24.20.0` and pnpm `10.34.5`:

```text
SA_NODE_BIN=/root/.nvm/versions/node/v24.20.0/bin/node python3 tooling/checks/extension_i1.py --output <fresh-output>
PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH python3 tooling/checks/extension_core.py --output <fresh-output>
PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH corepack pnpm docs:check
PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH corepack pnpm bridge:guard
PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH corepack pnpm openapi:check
```

The I1 checker preserves source and extracted-package gates and the full composed route; it includes lifecycle, race, verifier, context, Ozon/WB, recovery and package readback assertions. The native Chromium fixture uses a per-run ephemeral signing key: only its public trust bundle enters the local package, while the private key stays in a temporary file. A separate CI job runs installed local API/portal/PostgreSQL acceptance with the server test harness, development OTP `424242`, device approval, exchange, browser V2 verification, catalog and second-account isolation. Development OTP is not real email delivery evidence; local installed acceptance is not preprod/production evidence.

## Evidence and handoff

Secret-free results, the F1–F8 mapping, package receipt/hash and exact commands are in `docs/migration/evidence/extension-i1-client-2026-09-15/`. No server implementation, OpenAPI, migration, global STATUS/ROADMAP, Health/P8 or Stream B file is changed by this client candidate. The draft PR remains open for review; no merge, release or deployment is performed.
