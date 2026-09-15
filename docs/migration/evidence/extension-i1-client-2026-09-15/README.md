# I1-C1 client evidence

This directory contains secret-free review evidence. No access/refresh token, OTP/device code, private signing key, raw store data or browser profile is stored here.

The F1–F8 table and exact-head mapping are in `requirement-mapping.json`. The final deterministic package receipt and source/extracted readback are recorded in `package-receipt.json`.

R4 evidence is in [`r4/`](r4/). The R4 client, composed common-core, verifier, native Chromium, and documentation gates pass locally on Node `v24.20.0`; the installed API/portal/PostgreSQL gate is wired but locally blocked before application startup by an unavailable fresh loopback PostgreSQL endpoint. No installed acceptance or remote all-green claim is made. Development OTP `424242` is test-only and does not prove real email delivery.

R1–R3 evidence remains preserved in [`r2/`](r2/) and [`r3/`](r3/). The R4 candidate retains extension version `0.2.4`, pinned Node24/pnpm/Python dependencies, and the source/extracted package parity receipt.

No server implementation, HTTP/OpenAPI, migration, global STATUS/ROADMAP, Health/P8 or Stream B file is part of this candidate.

Remaining scope is explicitly open: full I1/C2 policy and durable offline behavior, I1-SRV.5, D3 logout, S1.2, Health/P8, real email delivery, preprod/production, live marketplace/AI and release/deployment.
