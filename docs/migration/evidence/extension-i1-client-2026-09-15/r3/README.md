# I1-C1 R3 evidence

Task `SA-I1-C1-R3-20260915-01`. This is one implementation candidate for architect review; PR #7 remains draft and unmerged.

The required starting feature head and tree were verified before work as `0b2a1776ff484d2410b3a43d338ec5548e73f019` and `3a83601109f7cb643e06d923b1da36691f9b0014`. The two independent starting-head RED probes were reproduced: oversized 2xx bootstrap retained Work, and signed `UNCONFIGURED` account-only bootstrap was rejected. R3 is GREEN on the corresponding source and extracted tests.

Local candidate head/tree after implementation are `20091e9131bb7cb9c0893cbf0f0fa6205de6546d` and `cd70d52d48bda6b3f061669f3e565bf8338c456a`.

R3 separates verified account authority from operational Work, preserves strict signature/schema/profile/fingerprint checks, classifies bounded response failures by HTTP status, invalidates oversized 2xx/401/403 authority responses, and fences bootstrap/refresh/activation owners by generation, attempt, device, session, and rotation identity. Account-only authority restores authenticated with `workAllowed:false`; requested `UNCONFIGURED` remains denied.

The common-core v0.2.4 full-worker candidate uses `makeWorker`, privileged `SA_STORE_SAVE`, real `SA_WORK_START`, and the existing start/ack/identity handshake. It retains the ten donor cases and behavioral assertions, uses fresh closed workers, and leaves the frozen donor and RED routes unchanged. R2 evidence is referenced from `../r2/`; that directory has no tracked `README.md`.

Local prescribed results: extension-I1 source/extracted PASS (92 processes), common-core source/extracted PASS (111), native Chromium application source/extracted PASS, verifier source/extracted PASS, docs/bridge/OpenAPI PASS. Installed local API/portal/PostgreSQL is locally BLOCKED because a fresh PostgreSQL 18 container failed `initdb` with `No space left on device`; the container was removed and no shared container was touched. Remote results are recorded after publication in the terminal report and workflow links.

No server, schema, OpenAPI, migration, Health/P8, I1-SRV.5, C2/offline, D3, S1.2, release, deployment, live marketplace, or live AI change is included.
