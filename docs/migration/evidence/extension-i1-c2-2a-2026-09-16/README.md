# C2.2-A verified cached-bootstrap acquisition evidence

Task: `SA-I1-C2-2A-20260916-01`  
Status: `IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`  
Branch target: `integration/i1-c1-srv5-2026-09-16`  
Exact start: `4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1`  
Start tree: `14e8e61d86b955b8a8f22b0c9e24f255654e92f7`  
Parent/code: `6dc770ec30fe7c7165f4c14ff8b6356cd55937d6`  
Candidate code commit: `7f4be0caa93dd3380b31822da572feb97e47fbc2`. Evidence/docs commit: this evidence commit, identified by the terminal.

The candidate adds private transport provenance, sequence-fenced shared online bootstrap, exact signed cache re-verification, and one existing-record/mutation-queue grace checkpoint. It returns verified configuration only. Existing raw bootstrap and Work-facing methods remain online/fresh-only; no capability/profile execution, offline Work grant, provider replay, server change, or domain migration is included.

## Focused result

`tooling/checks/extension_i1.py` ran `client-offline-policy.mjs` once on each composed route. Both source and extracted routes were `PASS` in the local run with Node `v22.22.2`; the full I1 composition completed `100` gate processes. The suite covers A–H with G ownership ordering included, real Ed25519 envelopes, transport and audited-503 eligibility, response/error matrix, refresh boundaries, expiry/grace boundaries, storage denial/recovery, account-only and AI context, later raw replacement and later 403 fencing. No live provider calls or IDB/catalog mutations were used.

## Gate ledger

| Gate | Result | Scope |
|---|---|---|
| Focused source/extracted | PASS | `client-offline-policy.mjs`, source and package |
| Existing I1/client/core suites | PASS | local extension composition |
| Browser verifier | PASS | Chromium 151.0.7922.34; signed snapshot valid and tamper rejected |
| Native source/extracted | UNKNOWN | not run in this workspace |
| Installed-local API/portal/PostgreSQL | UNKNOWN | not run in this workspace |
| `docs:check` | PASS | 468 files, 245 Markdown files, 364 relative links |
| `bridge:guard` | PASS | local bridge boundary guard |
| `openapi:check` | UNKNOWN | unchanged server gate not run |
| Remote CI | UNKNOWN | no authenticated current-task run available |

## A–H

`A PASS` exact-start compatibility behavior and candidate cache result; `B PASS` classification controls; `C PASS` refresh/401 boundary; `D PASS` time/grace and fresh-only guard controls; `E PASS` storage failure/recovery; `F PASS` exact context/account-only controls; `G PASS` later raw replacement and later 403 ownership fences; `H PASS` online-only renewal boundary and zero provider replay. This is a candidate test result, not architect acceptance.

## Package receipts

No C2.2-A CI package was independently downloaded in this workspace. The historical C2.1 R3 default-development artifact receipt remains separate: artifact `10433241137`, ZIP `1822450` bytes, SHA-256 `ceede563a4869184f26d161875ce6ca39f12c37245ee49c2917302d3a4ea4e59`, 39/39 byte parity. The historical executor-reported local ZIP `1823235` bytes / SHA-256 `03ed7c22618cbb9b49c83e0c2b6a4735b314c0a30480258550b02492cc8dab65` is not transferred to that default archive. C2.2-A default-development and ephemeral-key native receipts are `UNKNOWN` until a package-producing gate supplies them.

See `results.json` for the machine-readable local ledger. Architect review is required; no merge, deploy or release is claimed.
