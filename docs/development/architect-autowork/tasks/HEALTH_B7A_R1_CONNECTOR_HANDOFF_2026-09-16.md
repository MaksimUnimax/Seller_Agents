# SA-HEALTH-B7A-R1-CONNECTOR-HANDOFF-20260916-01

Roadmap: P8.4 / B7A publication recovery after capability-provenance correction.

This is a transport/export task only. Do not modify or reimplement the correction and do not rerun tests merely because publication failed.

Repository: MaksimUnimax/runtime-fixtures
Worktree: /root/runtime-fixtures
Branch: feature/server-health-h3-p8-4
Required remote parent/base: 592b51da31ab5ecfd0e4d4b3e981897849731614
Required existing local candidate: 256f7f7458921bb5b8ec6f9243467be8ebfadb7c
Expected candidate tree: 9b31f846f83e101bab8d0b1b1c945e2497428573
Expected candidate parent: 592b51da31ab5ecfd0e4d4b3e981897849731614

Architect independently confirmed GitHub does not know commit 256f7f7... and remote Health still points to 592b51d..., so update_ref cannot publish the local object. HTTPS and SSH-over-443 publication already failed from the executor environment. We will therefore export exact local Git objects for connector-side transport rematerialization.

## First gate

Fetch origin and require:

- current branch exactly feature/server-health-h3-p8-4;
- local HEAD exactly 256f7f7458921bb5b8ec6f9243467be8ebfadb7c;
- local tree exactly 9b31f846f83e101bab8d0b1b1c945e2497428573;
- direct parent exactly 592b51da31ab5ecfd0e4d4b3e981897849731614;
- worktree/index clean;
- remote Health exactly 592b51da31ab5ecfd0e4d4b3e981897849731614;
- base is an ancestor of candidate;
- diff base..candidate contains exactly the existing eight B7A allowlisted paths and no other path.

If any fact differs, STOP and report. Do not reset/rebase/stash/cherry-pick/amend/force/recreate anything.

## Export exact Git bundle

Create a temporary Git bundle containing the existing local candidate objects relative to its remote parent, without touching the worktree. Use the exact candidate ref and exclude its parent so the bundle carries the correction commit/tree/blob objects required to reconstruct the candidate.

Verify the bundle with `git bundle verify`.

Record:

- bundle byte size;
- SHA-256 of the bundle bytes;
- candidate commit/tree/parent/message;
- exact changed-path name-status/stat;
- `git diff --check` for 592b51d... -> 256f7f7....

Then base64-encode the bundle as one continuous canonical base64 byte stream and split only for terminal transport into numbered chunks of at most 8000 ASCII characters each.

Terminal format must contain these plain markers exactly, with no Markdown code fence:

B7A_R1_BUNDLE_V1_BEGIN
BUNDLE_SHA256=<lowercase hex>
BUNDLE_BYTES=<integer>
CANDIDATE_SHA=256f7f7458921bb5b8ec6f9243467be8ebfadb7c
CANDIDATE_TREE=9b31f846f83e101bab8d0b1b1c945e2497428573
CANDIDATE_PARENT=592b51da31ab5ecfd0e4d4b3e981897849731614
CHUNKS=<integer>
CHUNK_0001=<base64 characters only>
CHUNK_0002=<base64 characters only>
...
B7A_R1_BUNDLE_V1_END

Do not abbreviate the base64, replace sections with ellipses, wrap it in prose, or omit any chunk. The architect must be able to concatenate CHUNK values byte-for-byte, base64-decode and verify the SHA-256.

The bundle contains repository source/evidence already intended for publication. It MUST NOT contain any ignored/local auth/session/config/state file because the candidate diff is limited to the eight allowlisted source/test/evidence paths. Verify that before output.

## No execution changes

Do NOT:

- edit files;
- create a new commit;
- amend the candidate;
- rerun unit/integration/E2E/full-cycle tests;
- retry HTTPS/SSH publication;
- create branch/PR;
- merge main;
- deploy/release;
- make live provider/customer-session calls.

Temporary bundle creation/removal outside the worktree is allowed. Remove the temporary bundle file after computing/printing the payload; preserve the local Git candidate/worktree exactly.

## Terminal report

Before the bundle markers, return concise facts:

- task ID;
- worktree/branch;
- local candidate/tree/parent;
- remote Health head;
- clean worktree;
- exact eight changed paths and stat;
- diff-check result;
- bundle verify result;
- zero file edits/new commits/test reruns/push attempts/live calls;
- local candidate remains preserved.

Then output the complete marker-delimited bundle payload exactly as specified and STOP.

Do not self-accept R1. Do not start live B7 or P8.5.