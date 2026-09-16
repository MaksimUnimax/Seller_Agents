# C2.1 R1 evidence

Task `SA-I1-C2-1-20260916-01`; status `PENDING ARCHITECT REVIEW`.

R1 corrects the preserved candidate’s five proven defects: credentials and cache-clock ownership are validated before any secret-bearing request even when authority is absent; pending attempts carry exact origin/portal/contract provenance; effective time uses a rolling monotonic anchor; checkpoint completion can veto a grant after a held write crosses expiry; and public Work decisions carry the exact signed-authority identity. The prior candidate receipt and `results.json` are preserved unchanged and marked `REWORK_REQUIRED` in the parent evidence README.

Named focused cases actually executed in both source and extracted runtimes:

- `A-rolling-monotonic-and-completion-veto`: 2 cases — `1000 → 2000 → 1500` denial with equal-reading recovery, wall-forward/rollback continuity, restart floor, held-write unresolved promise, and same-call half-open-expiry veto.
- `B-origin-and-same-origin-replacement`: 2 cases — changed API origin clears ownership before bootstrap/forced refresh and starts a fresh activation without old bearer/refresh secrets; same-origin extension replacement retains floors and obtains a new signed authority.
- `C-legacy-and-pending-provenance`: 2 cases — credential-bearing legacy metadata removal requires fresh authorization while catalog data survives; legacy pending context is not polled and a new attempt starts without the old device code.
- `D-wall-rollback-and-restart-floor`: 1 case, included in A’s assertions.
- Prior focused matrix: 11 context dimensions plus the retained expiry, unsafe-clock, server-time, account-only, and reset-race assertions.

The completion-veto distinction is deliberate: the pre-write effective floor is the durable checkpoint; a fresh post-write sample is a veto and runtime high-watermark for the next checkpoint, not a falsely labeled persisted value. Authenticated account state without authority remains `Work=false`.

No live provider calls were made. Offline grace/profile consumption/joint offline acceptance remain C2.2+; Health B5/B6–B8, S1.2/D3, full I1/D2 and beta remain open.
