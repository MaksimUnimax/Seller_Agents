# SA-HEALTH-B7A-R1-TEXT-MANIFEST-HANDOFF-20260916-01

Roadmap: P8.4 / B7A publication recovery.

This is transport/export only. The existing local R1 candidate remains 256f7f7458921bb5b8ec6f9243467be8ebfadb7c, tree 9b31f846f83e101bab8d0b1b1c945e2497428573, parent 592b51da31ab5ecfd0e4d4b3e981897849731614. Remote Health remains the parent. The binary bundle export exists only on the executor host and is not available to the architect session, so this task transports the exact eight final UTF-8 file blobs as textual base64.

Do not modify files, rerun tests, create commits, amend, reset, rebase, stash, cherry-pick, push, create a branch/PR, deploy, release or make live calls.

## Gate

Require current branch feature/server-health-h3-p8-4, clean worktree/index, local HEAD exact candidate, tree exact expected tree, parent exact expected parent, remote Health exact parent, and candidate diff exactly these eight paths:

- apps/health-runner/src/dedicated-health-session.ts
- apps/health-runner/src/dedicated-health-session.test.ts
- apps/health-runner/src/browser-driver.ts
- apps/health-runner/src/index.ts
- tests/e2e/server/health-dedicated-session.spec.ts
- docs/server/B7A_DEDICATED_HEALTH_SESSION_PROVISIONING_2026-09-16.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/README.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/results.json

## Manifest

For each of the eight paths, read the exact blob from local candidate 256f7f7... with Git object plumbing, not from an edited worktree buffer. Record the Git blob SHA (`git rev-parse <candidate>:<path>`), byte size, and SHA-256 of exact file bytes. Base64-encode each exact blob with no line wrapping.

Output one manifest, split each file base64 into numbered chunks of at most 6000 ASCII characters. Each chunk value must be one physical line, base64 only.

Required markers:

B7A_R1_TEXT_MANIFEST_V1_BEGIN
CANDIDATE_SHA=256f7f7458921bb5b8ec6f9243467be8ebfadb7c
CANDIDATE_TREE=9b31f846f83e101bab8d0b1b1c945e2497428573
CANDIDATE_PARENT=592b51da31ab5ecfd0e4d4b3e981897849731614
FILES=8

For each file N from 1 through 8:
FILE_N_PATH=<exact path>
FILE_N_GIT_BLOB=<40-char sha1>
FILE_N_BYTES=<integer>
FILE_N_SHA256=<lowercase hex>
FILE_N_CHUNKS=<integer>
FILE_N_CHUNK_0001=<base64 only>
...
FILE_N_END

After all eight:
MANIFEST_SHA256=<sha256 of a canonical manifest index consisting only of the FILE_N_PATH, FILE_N_GIT_BLOB, FILE_N_BYTES and FILE_N_SHA256 lines in file-number order, each terminated by LF>
B7A_R1_TEXT_MANIFEST_V1_END

Do not omit, abbreviate, ellipsize, wrap or replace any chunk with a link/path. The complete payload must be present directly in the terminal report. Do not use Markdown code fences around the payload.

Before the payload, report concise gate facts, exact changed-path stat, git diff --check, zero changes/actions, and confirmation that all eight local blob SHAs were computed from the candidate commit object.

STOP after the end marker. Do not self-accept R1 or start B7/P8.5.