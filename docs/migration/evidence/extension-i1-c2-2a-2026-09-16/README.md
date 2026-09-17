# C2.2-A verified cached-bootstrap acquisition evidence

Task: `SA-I1-C2-2A-20260916-01`  
Status: `ACCEPTED / REMOTE VERIFIED`  
Branch target: `integration/i1-c1-srv5-2026-09-16`  
Exact start: `4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1`  
Start tree: `14e8e61d86b955b8a8f22b0c9e24f255654e92f7`  
Parent/code: `6dc770ec30fe7c7165f4c14ff8b6356cd55937d6`  
Candidate code commits: `7f4be0caa93dd3380b31822da572feb97e47fbc2`, `a553d1f80769528544ee1c90d1305edb51d9d71f`. Evidence/docs commits: `49df2ebd6f12188920476f916b1130bc889bb4f6`, `5fe77ff98a37257507dc77c6d9ffc4c120086c9c`, plus the later R1–R4 evidence chain.

The candidate adds private transport provenance, sequence-fenced shared online bootstrap, exact signed cache re-verification, and one existing-record/mutation-queue grace checkpoint. It returns verified configuration only. Existing raw bootstrap and Work-facing methods remain online/fresh-only; no capability/profile execution, offline Work grant, provider replay, server change, or domain migration is included.

## Focused result

`tooling/checks/extension_i1.py` ran `client-offline-policy.mjs` once on each composed route. Both source and extracted routes were `PASS` in the local run with Node `v22.22.2`; the full I1 composition completed `100` gate processes. The suite covers A–H with G ownership ordering included, real Ed25519 envelopes, transport and audited-503 eligibility, response/error matrix, refresh boundaries, expiry/grace boundaries, storage denial/recovery, account-only and AI context, later raw replacement and later 403 fencing. No live provider calls or IDB/catalog mutations were used.

## Historical initial gate ledger

The table below is preserved as the original local candidate receipt and must not be read as the final acceptance state. R4 below closes the historical `UNKNOWN` rows with exact-tree remote evidence.

| Gate | Historical result | Scope |
|---|---|---|
| Focused source/extracted | PASS | `client-offline-policy.mjs`, source and package |
| Existing I1/client/core suites | PASS | local extension composition |
| Browser verifier | PASS | Chromium 151.0.7922.34; signed snapshot valid and tamper rejected |
| Native source/extracted | UNKNOWN | not run in the original workspace |
| Installed-local API/portal/PostgreSQL | UNKNOWN | not run in the original workspace |
| `docs:check` | PASS | original local documentation gate |
| `bridge:guard` | PASS | original local bridge boundary guard |
| `openapi:check` | UNKNOWN | unchanged server gate not run in the original workspace |
| Remote CI | UNKNOWN | no authenticated current-task run was available in the original workspace |

## A–H

`A PASS` exact-start compatibility behavior and candidate cache result; `B PASS` classification controls; `C PASS` refresh/401 boundary; `D PASS` time/grace and fresh-only guard controls; `E PASS` storage failure/recovery; `F PASS` exact context/account-only controls; `G PASS` later raw replacement and later 403 ownership fences; `H PASS` online-only renewal boundary and zero provider replay. The initial wording is historical candidate evidence; architect acceptance is recorded in R4.

## Historical package receipts

The original workspace did not independently download a C2.2-A CI package. The historical C2.1 R3 default-development artifact receipt remains separate: artifact `10433241137`, ZIP `1822450` bytes, SHA-256 `ceede563a4869184f26d161875ce6ca39f12c37245ee49c2917302d3a4ea4e59`, 39/39 byte parity. The historical executor-reported local ZIP `1823235` bytes / SHA-256 `03ed7c22618cbb9b49c83e0c2b6a4735b314c0a30480258550b02492cc8dab65` is not transferred to that default archive. R4 records the exact-tree C2.2-A remote package and installed-local receipts.

See historical `results.json` for the original local ledger. R4 is the current acceptance authority; no merge, deploy or release is claimed.

## R1 correction addendum

The initial receipt above was written before the independent review and its broad A–H summary was incomplete: the published test did not prove endpoint-bound audited 503 eligibility or the denial-write obsolescence race. The historical wording is preserved rather than rewritten.

The corrected source/extracted receipt and explicit case ledger are in `r1/README.md` and `r1/results.json`. No historical result JSON was changed.

## R2 factual reconciliation

The historical R1 receipt above is preserved. R2 is the tests/evidence-only continuation from exact start `90f3f5ab4787d1ed4b782bff4f97181dd9fe3772`, tree `835ce56a1fd235196f7010936817485bf7347eb5`, and parent/code `65596c5f1b5189c60de64d72a80773d43f1a203f`. It adds only the allowlisted policy test, deterministic worker-harness hook, and append-only/current R2 evidence.

The stable per-case ledger, source/extracted results, gate provenance, package receipt, remote-CI status, and production byte-identity comparison are recorded in `r2/README.md` and `r2/results.json`. The older root and R1 result JSON files remain unchanged.

## R3 factual correction addendum

R2 retention proof was invalid: `Q3-A` wrote the fixture artifact again before each retention assertion, and its seed did not carry explicit `created_at_ms`/`expires_at_ms`. The R3 case puts the stable artifact once, uses readonly gets thereafter, keeps the artifact inside its TTL, checks the IDB write count, and records a disposable destructive-clear negative control separately. Production cleanup remains unchanged.

R2 `Q4-D` was a legitimate correctly signed online account replacement. It was a positive authority-processing case, not evidence that a valid server replacement should be rejected; R3 names it accordingly and adds the separate held-cache obsolescence case for the stale account-A fallback.

R2 `Q5-B` used cloned-object reference inequality, which did not prove preservation of exact durable B state. R3 captures durable AUTH after B success/403 and compares the complete record after A settles. R3 also expands Q5-C to compare the signed B payload/envelope and committed credentials, generation, and clock or the exact denied state.

The historical R2 `results.json` and R2 ledger remain unchanged. Current R3 source/extracted assertions and gate/package provenance are in `r3/README.md` and `r3/results.json`.

## R4 architect acceptance / exact-tree remote readback

Current acceptance authority is `r4/README.md` and `r4/results.json`.

C2.2-A is `ACCEPTED / REMOTE VERIFIED` on exact tested tree `531033ac08f001dd55427c4ae969a6c4b5d6b861` from integration head `5d93bccac163c8728a8d7a3b1d4b9f23ea16b680`, synchronized with canonical `main` `bc718cc5c677ad0eb4598e7de3ad766473ff0847` without force-push/rebase/reset. GitHub's PR virtual merge checkout `5d908524db63610163770e3400c3426d7baa8177` has the same tree.

Final exact-tree status:
- focused policy source `37/37 PASS`, extracted `37/37 PASS`, Q1–Q7 all PASS;
- all 7 exact-head workflow runs SUCCESS, failed workflows `0`;
- Server CI passes lint, format, typecheck, unit, PostgreSQL integration, migrations, OpenAPI, bridge guard, build and browser E2E;
- Extension CI passes common core, Ozon/WB baselines including WB browser fixtures, and native Chromium application coverage;
- Extension I1 checker `100/100 PASS`;
- installed-local API/portal/PostgreSQL acceptance PASS;
- deterministic development ZIP `1,834,654` bytes, SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`, 39/39 runtime/extracted/ZIP parity, zero byte mismatches;
- live provider calls `0`, provider replay `0`, offline Work `false`.

No owner/manual test is required for this bounded step. Real email, preprod, live provider and broader installed/live-product acceptance are later roadmap scopes, not hidden C2.2-A manual residues.

C2.2-A acceptance does not accept offline Work, profile/capability execution, joint offline command/result behavior, scheduler integration, S1.2, D3, full I1/D2, deployment or release.
