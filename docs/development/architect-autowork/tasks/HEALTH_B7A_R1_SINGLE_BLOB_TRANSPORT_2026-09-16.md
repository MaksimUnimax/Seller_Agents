# SA-HEALTH-B7A-R1-SINGLE-BLOB-TRANSPORT-20260916-01

Roadmap: P8.4 / B7A publication recovery.

Transport-only task. No implementation/test/history change.

The previous binary bundle and full text-manifest handoff attempts were locally created by the executor but Business Bridge surfaced only executor-local `/root/...` paths to the architect. Those paths are not readable by the architect session. Therefore transport is reduced to one exact Git blob per terminal report so the payload is small enough to remain inline.

Repository: MaksimUnimax/runtime-fixtures
Worktree: /root/runtime-fixtures
Branch: feature/server-health-h3-p8-4
Existing local candidate: 256f7f7458921bb5b8ec6f9243467be8ebfadb7c
Candidate tree: 9b31f846f83e101bab8d0b1b1c945e2497428573
Parent/current remote: 592b51da31ab5ecfd0e4d4b3e981897849731614

This first transport task exports ONLY:

apps/health-runner/src/dedicated-health-session.ts

Read content directly from the candidate Git object, not from a mutable working-tree buffer.

Pre-gate:
- branch/head/tree/parent exactly as above;
- worktree/index clean;
- remote Health still exact parent;
- the target path exists in candidate;
- no edits/tests/commits/pushes.

Record the target blob SHA-1, exact byte count, SHA-256, and RFC4648 base64 of the exact blob bytes.

Terminal payload MUST be inline, not a file/link/attachment. Do not create an output file. Do not return `/root/...` paths. Do not use Markdown/code fencing.

Format:

B7A_R1_SINGLE_BLOB_V1_BEGIN
PATH=apps/health-runner/src/dedicated-health-session.ts
CANDIDATE_SHA=256f7f7458921bb5b8ec6f9243467be8ebfadb7c
GIT_BLOB=<40-char sha1>
BYTES=<integer>
SHA256=<64 lowercase hex>
CHUNKS=<integer>
CHUNK_0001=<base64 chars only, <=6000 chars>
CHUNK_0002=<base64 chars only, <=6000 chars>
...
B7A_R1_SINGLE_BLOB_V1_END

Before reporting, concatenate all chunk values, base64-decode, verify SHA-256 equals SHA256 and `git hash-object --stdin` equals GIT_BLOB.

Zero file edits/new commits/test reruns/push attempts/live calls.

STOP after B7A_R1_SINGLE_BLOB_V1_END.
