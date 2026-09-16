# SA-HEALTH-B8-PROCESS-R1-20260916-01

Roadmap: P8.4 / B8 non-live final-readiness recovery.

Purpose: deterministically classify the two executor-reported ~13-day-old implementation command chains as stale/orphaned or ambiguous. Terminate them ONLY if every safety condition below passes, then continue the already-designed canonical B8 task unchanged.

This is NOT an architecture investigation. The architect has already chosen the decision procedure. Execute it exactly and do not invent alternate cleanup methods.

## Canonical refs

Repository: MaksimUnimax/runtime-fixtures
Worktree: /root/runtime-fixtures
Branch: feature/server-health-h3-p8-4
Required local/remote Health head: 697eea7adc337e1f11def16818829c2e443efb15
Required tree: 40552ecc3475a183b6b14dfffcee77d033e743b6
Required parent: bf3c27a817c7e4698f539ff5cacc1db73c833710
Main snapshot: bc718cc5c677ad0eb4598e7de3ad766473ff0847
Architect control branch: docs/architect-autowork-handoff-2026-09-15
Canonical B8 task: docs/development/architect-autowork/tasks/HEALTH_B8_NONLIVE_FINAL_READINESS_2026-09-16.md

The previous B8 attempt stopped before any file change, live call, commit or push. Product remote remains exactly the accepted B6 head above.

## Phase 1 — protect the current executor

Before touching any process:

1. Record the current executor shell PID.
2. Walk its PPID chain to PID 1 and record the exact current-executor ancestry set.
3. Record the current executor PGID and SID.
4. Do NOT inspect or print process environments (`/proc/*/environ` is forbidden).
5. Do NOT record secrets or full environment values.

This ancestry set is immutable protection: no PID, parent, process group or session containing any current-executor ancestor may be terminated.

## Phase 2 — snapshot the reported stale chains

Take a bounded process snapshot containing only:

- PID;
- PPID;
- PGID;
- SID;
- process start time;
- elapsed seconds;
- state;
- command line;
- resolved cwd from `/proc/<pid>/cwd` when readable.

Do not dump environment variables, file contents or credentials.

The previous terminal reports exactly TWO unrelated long-running implementation command chains involving `pnpm install` and repository validation commands and running for about 13 days.

Identify candidate chains by process ancestry/process-group membership, not by broad `pkill`/name matching.

There must be exactly TWO candidate stale groups/chains. If there are zero, one, more than two, or process topology is ambiguous: STOP and report the sanitized snapshot. Kill nothing.

## Phase 3 — mandatory stale/orphan classification

A candidate chain may be terminated ONLY if ALL conditions below are true:

1. Every process in the candidate process group/session subset being terminated has elapsed time >= 604800 seconds (7 days). The executor reported ~13 days, so this threshold is deliberately conservative.
2. No PID in the candidate chain is in the current-executor ancestry set.
3. Candidate PGID and SID do not equal the current executor PGID/SID.
4. No ancestor of the candidate chain up to PID 1 is the current executor or its active Codex/Business Bridge task process.
5. No candidate group member is an active `codex`, Business Bridge task worker, `git`, `ssh`, `docker`, `postgres`, browser, or deployment/release process. Old shell/pnpm/corepack/node-based package/validation subprocesses are allowed only when they are clearly members of the same stale command chain.
6. Every process selected for termination belongs to one of the two reported old package/validation chains; do not include unrelated daemons or services sharing the host.
7. The candidate chain is not holding a Git repository lock. Check relevant repo/worktree `.git` lock state without deleting locks. If an index/ref/config/shallow/packed-refs lock exists and ownership is unclear: STOP and kill nothing.
8. `/root/runtime-fixtures` remains clean and at exact HEAD 697eea7adc337e1f11def16818829c2e443efb15 before termination.
9. Remote Health remains exact 697eea7adc337e1f11def16818829c2e443efb15.
10. No process in the candidate group started within the last 7 days. Any younger member makes that entire candidate group ambiguous and non-terminable.

If either one of the two chains fails ANY criterion, STOP and report both chains. Do not terminate either chain partially.

## Phase 4 — exact termination procedure

Only if BOTH chains pass all criteria:

1. Record the exact verified PGIDs and member PIDs.
2. Send SIGTERM only to the two exact verified stale process groups, never by name/pattern and never to the current executor group.
3. Wait up to 5 seconds.
4. Re-snapshot only those exact PGIDs/PIDs.
5. If stale members remain, send SIGKILL only to the remaining verified member PIDs/PGIDs of those same two groups.
6. Re-snapshot and require all stale-chain PIDs are gone.
7. Confirm no current-executor PID/ancestor was affected.
8. Confirm no new sibling/descendant process from those stale chains respawned.

Forbidden:

- `pkill`;
- `killall`;
- wildcard/pattern killing;
- terminating all `pnpm` or all `node` processes;
- reboot/service restart;
- killing Business Bridge/Codex/current executor;
- deleting lockfiles to force progress;
- reset/rebase/stash/cherry-pick/force operations.

## Phase 5 — repository integrity after cleanup

After successful termination require:

- local HEAD exactly 697eea7adc337e1f11def16818829c2e443efb15;
- remote Health exactly same SHA;
- tree exactly 40552ecc3475a183b6b14dfffcee77d033e743b6;
- worktree/index clean;
- no unexpected repository file modifications;
- no relevant Git lockfiles left by the terminated stale chains.

If termination leaves dirty state or a lock, STOP and report. Do not repair by reset/clean/lock deletion.

## Phase 6 — execute canonical B8 unchanged

Only after Phases 1-5 pass, read IN FULL and execute:

docs/development/architect-autowork/tasks/HEALTH_B8_NONLIVE_FINAL_READINESS_2026-09-16.md

from the architect control branch.

All canonical B8 requirements remain unchanged:

- evidence-only;
- FR-01..FR-11;
- zero production/test/package/workflow/migration changes;
- zero live ChatGPT/provider/marketplace/customer-session calls;
- B7 stays BLOCKED_EXTERNAL_PREREQUISITE;
- B8 may only conclude non-live PASS / blocked by B7 live;
- P8.4 remains NOT_ACCEPTED;
- P8.5 remains NOT_STARTED;
- only the three canonical B8 evidence paths may change.

Do not rerun the full green B6 test cycle.

## Terminal report additions

In addition to every canonical B8 terminal requirement, report:

- current executor PID/PGID/SID and ancestor PID set, without environment values;
- sanitized metadata for each of the two candidate stale chains: root PID, PPID, PGID, SID, start time, elapsed seconds, state, cwd, bounded command summary;
- pass/fail for stale criteria 1-10 for each chain;
- exact PGIDs/PIDs terminated;
- TERM result, survivor list after 5 seconds, any KILL result;
- proof current executor ancestry remained alive;
- proof no stale chain respawned;
- repo HEAD/tree/status before and after cleanup;
- explicit zero pkill/killall/pattern kill/reboot/service restart/lock deletion/reset/rebase/stash/cherry-pick/force.

If the stale-process criteria are ambiguous, STOP after that report and do not start canonical B8.

Do not self-accept B8 or P8.4. Do not start B7 or P8.5. STOP after terminal report.