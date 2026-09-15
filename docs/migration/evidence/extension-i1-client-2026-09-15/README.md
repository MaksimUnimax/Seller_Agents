# I1-C1 client evidence

This directory contains secret-free evidence for the client implementation. No access/refresh token, OTP, device code, private signing key, raw store data or browser profile is stored here.

- `requirement-mapping.json` records the client-side requirement/scenario mapping.
- The deterministic package receipt is produced by `tooling/build/extension_composed.py` in each fresh output directory.

Local online server smoke used only resources created by this execution: PostgreSQL 18 tmpfs, API `127.0.0.1:43100`, portal `127.0.0.1:43101`, and fixed OTP delivery `424242`. It proved the server route sequence and V2 envelope, not email delivery, preprod, or installed-browser acceptance. The native worker verifier is therefore kept as an open CI gate until the exact-head workflow artifact is read back.
