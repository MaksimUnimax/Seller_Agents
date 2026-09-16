# Repository Maintenance Rules

## Entry point

Read `README.md`, `docs/README.md`, and the documentation for the subsystem you are changing. If the task changes a shared contract, read `docs/architecture/CONTRACTS.md` before editing it.

Current maintainer instructions for the active task take priority over historical notes. Existing code is evidence of implementation, not automatic proof that a behavior is still intended.

## Scope discipline

- Work only inside the explicitly requested subsystem.
- Do not start adjacent roadmap work because a preceding step finished.
- Do not redesign shared contracts, authentication/session behavior, migrations, deployment topology, or cross-component interfaces unless the task explicitly includes them.
- Prefer the smallest complete change that fixes the requested behavior.
- Preserve proven behavior outside the affected boundary.
- Do not convert fixture, documentation, package, or simulated checks into claims about installed or live acceptance.

## Parallel work

Multiple branches may be active at the same time.

Before integration or merge work:

1. fetch the current remote `main`;
2. inspect drift since the branch base;
3. avoid files owned by another active stream unless a synchronization boundary was explicitly agreed;
4. do not force-push to erase divergence;
5. keep one clear integration boundary for shared changes.

## Executor boundary

An implementation executor may write or fix code, run prescribed tests, and report factual results inside a bounded task.

It must not independently choose project roadmap, architecture, product scope, repository strategy, or the next stage of work.

## Validation

- Reproduce a concrete defect or requirement before changing behavior when practical.
- Keep source, packaged, browser, database, integration, and deployment evidence distinct.
- A green documentation check proves documentation consistency only.
- A green package build proves package construction only.
- Installed/live acceptance requires the checks defined for that boundary.
- Record exact commit/revision identifiers for accepted evidence.

## Security and data

- Never commit credentials, private keys, production tokens, raw customer data, or private conversation content.
- Do not add sensitive values to fixtures, logs, screenshots, CI artifacts, or documentation.
- Treat destructive server cleanup and broad deletion as separate operations requiring explicit maintainer approval.

## Git safety

- Re-check remote `main` before publishing or merging.
- Do not use force push to bypass another stream's work.
- Keep unrelated formatting or cleanup out of bounded changes.
- Report what changed, what was tested, remaining limitations, and the exact resulting revision.
