# C2.1 selected design — 2026-09-16

Base1ff322b3dd2b68c4f02e5390850cd2f1b9548186, integration/i1-c1-srv5-2026-09-16.
References read: existing control client/verifier/config; application Work guards and authority callback; composition; source/package checker; worker/native fixture; I1-SRV.4 handoff and reference cache/time implementation; original C1 scope explicitly deferring offline/cache/clock/profile criteria.

Independent source probe:
{
  "changedBrowser": true,
  "changedOrigin": true,
  "expired": false,
  "hashes": {
    "client.js": "a7c6afdbde242f08ae39c39059c094588e468968",
    "config.js": "7c0a8019703929bc201995ed9e38e7c1706a459b",
    "crypto.js": "c1fbb7671bb363e4ca6210e9243ac58b1a304561"
  },
  "initial": true,
  "rollback": true,
  "scope": "independent source VM, real Ed25519 verifier, synthetic clock/storage, no installed/live claim"
}

The exact source blob hashes match Git after byte readback. Reproduction: obtain client.js/config.js/crypto.js from packages/control-client/src at the pinned base into one directory, put the saved probe.mjs and seed.mjs beside them, run node probe.mjs. seed.mjs is the fixture-generation prefix of the repository worker harness, cut before runtime loading; keys are generated per execution and never written as evidence.

Decision: implement context binding and session-scoped monotonic/durable effective time in the existing auth record before enabling offline grace. Keep Work FRESH-only. This closes a concrete prerequisite, not a placeholder module. Signature and profile checks stay strict; future C2.2 will consume the retained verified stale record under the accepted network/503-only fallback policy and finish signed-profile/joint command behavior.

Exact algorithms, allowed files, tests, storage-failure limits, migration behavior and publication are specified in the prepared task. Origin mismatch never forwards saved tokens. Legacy unknown ownership requires fresh authorization. Browser/trust/version mismatch requires new verified online authority. Time floors cannot decrease across same-session bootstrap, cached decisions or restart. Every positive Work decision waits for successful floor persistence. Wall rollback cannot reclaim observed expiry; downtime and owner-edited storage remain outside cryptographic guarantees.

This preparation does not submit or start a Codex task. Issue only after synchronization gates are accepted.
