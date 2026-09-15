# I1-C1 client evidence

This directory contains secret-free review evidence. No access/refresh token, OTP/device code, private signing key, raw store data or browser profile is stored here.

The F1–F8 table and exact-head mapping are in `requirement-mapping.json`. The final deterministic package receipt and source/extracted readback are recorded in `package-receipt.json`.

Local verification passed the extension I1 checker (source and extracted package, 88 gate processes) and the preserved composed extension-core route (111 processes). Native Chromium source/extracted application fixtures passed with a per-run ephemeral trust key and synthetic provider responses. The installed local API/portal/PostgreSQL harness is reproducible in `tests/regression/extension-core/client-i1/installed_local_integration.py` and is wired into `.github/workflows/extension-i1-ci.yml`; it uses development OTP `424242`, which does not prove real email delivery. Neither local installed acceptance nor development OTP proves preprod/production readiness.

The assigned base is `bc0cd0088ca50ba06021ea602a46bdd90de91378`; the final published head is filled in the mapping after the implementation and evidence commits. No server implementation, HTTP/OpenAPI, migration, global STATUS/ROADMAP, Health/P8 or Stream B file is part of this candidate.

Remaining scope is explicitly open: full I1/C2 policy and durable offline behavior, I1-SRV.5, D3 logout, S1.2, Health/P8, real email delivery, preprod/production, live marketplace/AI and release/deployment.
