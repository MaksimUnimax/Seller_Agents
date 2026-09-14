# S1.1 Remote Acceptance — post-merge authority closeout — 2026-09-14

`TECHNICAL_ID = PRODUCT-CONTROL-PLANE-S1_1-POST-MERGE-AUTHORITY-CLOSEOUT-2026-09-14`

## Canonical publication identity

The S1.1 implementation was merged by PR #1, `S1.1: free beta access and atomic admission`.

- `CANONICAL_BRANCH = main`
- `MERGE_COMMIT = d0b54aa5e659932d3fa2d996b572e06aadfffe62`
- `MERGE_TREE = a6ba0ed862ef781327bdd5b92b775db9e2b45042`
- `MERGE_PARENTS = 17f0cd451f7c06dec3413d55c148561c804d1faa, 7f9c988e4b93278cef9790a0a18625a57aba132e`
- `ACCEPTED_S1_1_SOURCE_HEAD = 7f9c988e4b93278cef9790a0a18625a57aba132e`
- `A8R_RECONCILIATION_MERGE = 6f7e9dcbd2cb5e9882433ad5ebc638268325c2cc`

The canonical `main` verification immediately before this closeout resolved to
`d0b54aa5e659932d3fa2d996b572e06aadfffe62`. No later canonical commit was
present when this record was prepared.

## Exact-head CI authority

Fresh exact-head CI for the accepted S1.1 source head passed:

| Workflow | Run | Head | Result |
|---|---:|---|---|
| [Server CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34859549564) | `34859549564` | `7f9c988e4b93278cef9790a0a18625a57aba132e` | `SUCCESS` |
| [Documentation CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34859549865) | `34859549865` | `7f9c988e4b93278cef9790a0a18625a57aba132e` | `SUCCESS` |
| [Extension CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34859549555) | `34859549555` | `7f9c988e4b93278cef9790a0a18625a57aba132e` | `SUCCESS` |

The merge commit is the canonical product tree. The exact-head runs above are
the recorded acceptance evidence for the accepted S1.1 source head; the
docs-only closeout does not alter the S1.1 product tree.

## Accepted S1.1 behavior

S1.1 is `DONE / REMOTE ACCEPTED` for the Seller Agents repository. The accepted
scope is:

- explicit `accessBasis = BETA`, with no fake checkout, paid-trial timer, or
  commercial installation quota;
- new beta admission decided in one PostgreSQL transaction, including OTP
  verification, normalized-email uniqueness, capacity/admitted accounting, and
  the concurrent last-slot rule;
- existing-account login, additional device installation, and reinstall remain
  available when the admission mode is `CLOSED`, `PAUSED`, or exhausted;
- initial admission state `CLOSED`, with owner and beta-operator mutations for
  opening, pausing, closing, and adding or setting capacity;
- requestId replay protection, optimistic revision checks, the `capacity >=
  admitted` invariant, permission checks, and append-only audit evidence;
- bootstrap/API/admin wiring and PostgreSQL schema/tests required by the
  accepted implementation.

Focused acceptance scenarios cover the initial closed state, idempotent admin
commands, requestId conflicts, stale revisions, concurrent mutations, audit
rollback, permission revocation, no-secret audit metadata, explicit BETA
bootstrap access, and real-PostgreSQL admission behavior.

## Boundaries and next authority

- `S1.2 real email delivery/preprod = NOT STARTED`.
- `I1 real extension account authorization = NEXT FUTURE SERVER WORK`.
- `REAL_EXTENSION_ACCOUNT_AUTH = NOT CONNECTED`.
- `H3 browser actions, P8.4, P8.5, and P8.6 = NOT STARTED BY S1.1`.
- `DEPLOYMENT = NOT_STARTED`.
- `PRODUCTION_EMAIL = NOT_USED`.
- `LIVE_PROVIDER_CALLS = 0`.

This is an acceptance documentation closeout. It introduces no source,
database, wire-contract, extension, deployment, or production change.
