# I1-C1 / C2 client authority

Status: `C1 ACCEPTED`; `C2.1 ACCEPTED`; `C2.2-A ACCEPTED / REMOTE VERIFIED`; `C2.2-B NOT_STARTED`. These bounded acceptances do not close full I1, C2, D3, Health/P8, S1.2, release or deployment.

Base: `bc0cd0088ca50ba06021ea602a46bdd90de91378`. Accepted C1 head: `56c81a3521c02502b65fd713aec890e5a30f038d` on `feature/extension-i1-client-2026-09-15`. The source branch remains separate, draft and unmerged. C2.1 is accepted on candidate `4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1`. C2.2-A is accepted on exact tested implementation head `5d93bccac163c8728a8d7a3b1d4b9f23ea16b680`, tree `531033ac08f001dd55427c4ae969a6c4b5d6b861`; current acceptance evidence is in `docs/migration/evidence/extension-i1-c2-2a-2026-09-16/r4/`.

R2 was reviewed for the earlier flight-owner, forced-bootstrap-refresh, fail-closed authority, composed signed-out routing, and contractual version-comparison scope. R3 corrects the remaining client authority/response classification and context-ownership paths, and adds meaningful same-worker account, rotation, denial, version, and composed-worker coverage. Polling, activation and refresh owners carry generation and logical identity; restrictive denial replaces in-memory authority before persistence/cleanup and uses removal as a durable fallback. Work permission is checked separately from composed application readiness. Pending transport/status/rate-limit failures remain retryable until the attempt deadline, while terminal denial is not restored as authority after restart.

Bootstrap V2 remains WebCrypto Ed25519 with packaged trust, exact signed bytes and strict envelope/payload checks. Work requires a current account/device/session generation, compatible browser/extension, supported local AI mapping, signed policy and a validated profile fingerprint; unsupported AI/profile fallback is denied. The browser verifier is included in the extracted package and is tested against source/package fixtures, including payload and identifier boundaries.

Account authority and local Work context carry auth generation. Compatible same-session bootstrap does not globally finish Work; authority changes and late callbacks are fenced. Ozon/WB queues, delivery, recovery, attachment/IDB and ordinary local marketplace dispatch remain covered by the preserved composed route. Popup account reset is visible in authenticated and pending states, with pending cancellation available.

C2.1 adds only durable `authority.cacheBinding` context and `state.cacheClock` metadata to `seller_agents_control_auth_v2`. Restore re-verifies the unchanged signed envelope and payload, requires exact packaged origin/contract/version/browser/trust/AI context, and preserves structurally valid credentials for same-origin package mismatch. A nondecreasing effective-time floor combines wall and monotonic time and is persisted through the existing mutation queue before fresh cached Work is allowed; freshness remains half-open (`effectiveNow < expiresAt`). Missing or unsafe metadata fails closed.

C2.2-A adds only online-first verified cached-bootstrap **configuration acquisition** for audited transport/503 conditions. The cached envelope is reverified with packaged trust and exact context binding, and ownership/obsolescence fences prevent stale completion. `bootstrapWithPolicy()` is not wired into Work dispatch. Offline Work, signed profile/capability execution, joint offline command-result behavior and scheduler integration remain outside C2.2-A.

## Verification

The established verification surface includes the full I1 composition checker, shared core checker, focused C2 suites, source/extracted package parity, native Chromium fixture, installed local API/portal/PostgreSQL acceptance, documentation/OpenAPI/bridge guards, Server CI and Extension CI. C2.2-A architect acceptance verified all seven exact-head workflow runs successful with zero failed workflows on tested tree `531033ac08f001dd55427c4ae969a6c4b5d6b861`; focused policy source/extracted are `37/37 PASS` each and Extension I1 is `100/100 PASS`.

The native Chromium fixture uses a per-run ephemeral signing key: only its public trust bundle enters the local package, while the private key stays temporary. Installed-local development uses fixture OTP `424242`; it is not real email-delivery or preprod/production evidence.

## Evidence and handoff

C2.1 evidence is in `docs/migration/evidence/extension-i1-c2-1-2026-09-16/`; its design notes are in `C2_CACHE_TIME_2026-09-16.md`. C2.2-A design/acceptance is in `C2_OFFLINE_POLICY_2026-09-16.md` and `docs/migration/evidence/extension-i1-c2-2a-2026-09-16/r4/`.

C2.2-B is not defined by these acceptances and must receive a separate bounded architect scope before implementation. It must not silently convert verified cached configuration into offline Work/profile/capability/joint command-result authority. Health, S1.2/D3, full I1/D2 and release/deployment remain separate.
