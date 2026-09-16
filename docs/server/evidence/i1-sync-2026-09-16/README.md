# I1 C1 + I1-SRV.5 synchronization evidence

Task: `SA-I1-SYNC-20260916-01`
Date: 2026-09-16
Status: `IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Immutable history and provenance

Repository: `MaksimUnimax/Seller_Agents`
Canonical main: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`
Common ancestor: `bc0cd0088ca50ba06021ea602a46bdd90de91378`
Accepted server: `086ae20c2858849ec13b1ab67c2f7661259022c3`, tree `ea17da20acb01ae3c03a14d5b18128c8040e27e7`
Accepted client: `56c81a3521c02502b65fd713aec890e5a30f038d`, tree `5c14497e239922c3712d0c3be12af7ee59e665f5`
Integration branch: `integration/i1-c1-srv5-2026-09-16`
Merge: `9d3407bc248e935860c5d7d3a50536c6a08d92f4`, tree `e834d3af55bb102e0378218dff731dd15b124d02`
Parents: server first `086ae20c2858849ec13b1ab67c2f7661259022c3`; client second `56c81a3521c02502b65fd713aec890e5a30f038d`.

All three required ancestry checks passed. Relative to the common ancestor,
the client changed 54 paths, the server changed 19 paths, and the intersection
was zero. The merged tree has 54/54 client-only and 19/19 server-only blob/mode
matches; all 922 other tracked paths match the common ancestor. Additions and
deletions were checked explicitly; no deletion occurred and additions retain
their accepted blob/mode. The complete path/blob/mode inventory is in
`runtime-blobs.json`.

## Documentation-only follow-up

After the merge, edits are restricted to the task allowlist: factual status,
roadmap, client/server handoff documents, this evidence directory, and the
two receipts. No implementation, test, workflow, dependency, lockfile,
migration, contract, historical evidence, or architect STATE file is edited.
The final receipt records the post-documentation check that every
non-documentation blob remains byte-identical to the merge tree.

## Local validation ledger

The commands are run once on the combined candidate with Node `24.20.0`, pnpm
`10.34.5`, frozen lockfile, existing Python/browser requirements, and fresh
task-owned disposable databases named with `test`/`e2e`. Sanitized outcomes,
exact counts, skipped/not-run scopes, package parity/readbacks, Chromium
version, and zero-live-provider confirmation are recorded in
`package-receipt.json` and the final commit handoff.

Required boundaries remain explicit: C2 offline/profile/joint command-result
acceptance is pending; Health/P8.4 B5 is NOT ACCEPTED and B6–B8 are queued;
S1.2 real email/preprod, D3, full D2/I1, beta, release, merge and deployment
remain open. PR7 and PR8 remain draft/unmerged. No secrets, private fixture
keys, raw auth envelopes, screenshots, video or traces are retained.
