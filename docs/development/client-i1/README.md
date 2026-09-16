# I1-C1 client candidate

Status: `C1 ACCEPTED` at `56c81a3521c02502b65fd713aec890e5a30f038d` for the bounded source/package/native and installed-local development scope. This acceptance does not close I1, C2, I1-SRV.5, D3, Health/P8, S1.2, release or deployment.

Base: `bc0cd0088ca50ba06021ea602a46bdd90de91378`. Accepted C1 head: `56c81a3521c02502b65fd713aec890e5a30f038d` on `feature/extension-i1-client-2026-09-15`. The source branch remains separate, draft and unmerged.

R2 was reviewed for the earlier flight-owner, forced-bootstrap-refresh, fail-closed authority, composed signed-out routing, and contractual version-comparison scope. R3 corrects the remaining client authority/response classification and context-ownership paths, and adds meaningful same-worker account, rotation, denial, version, and composed-worker coverage. Polling, activation and refresh owners carry generation and logical identity; restrictive denial replaces in-memory authority before persistence/cleanup and uses removal as a durable fallback. Work permission is checked separately from composed application readiness. Pending transport/status/rate-limit failures remain retryable until the attempt deadline, while terminal denial is not restored as authority after restart.

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

Secret-free results, the F1–F8 mapping, package receipt/hash and exact commands are in `docs/migration/evidence/extension-i1-client-2026-09-15/`. No server implementation, OpenAPI, migration, global STATUS/ROADMAP, Health/P8 or Stream B file was changed by the accepted client candidate. The accepted files are imported into the separate synchronization candidate only; the client source branch and PR7 remain unchanged, draft and unmerged. No release or deployment is performed.
