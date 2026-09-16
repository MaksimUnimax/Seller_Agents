# I1 synchronization architect review — 2026-09-16

Task SA-I1-SYNC-20260916-01.
Candidate 1ff322b3dd2b68c4f02e5390850cd2f1b9548186; tree f944feef7fb5cf7631df51d20fc70b2692ee907f; parent b8cd19ccfe9b7a1b92b9fa3376f94dccceb2c3ed.
Merge 9d3407bc248e935860c5d7d3a50536c6a08d92f4; tree e834d3af55bb102e0378218dff731dd15b124d02.
First parent086ae20c2858849ec13b1ab67c2f7661259022c3; second56c81a3521c02502b65fd713aec890e5a30f038d.
Canonical main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged.
Branch integration/i1-c1-srv5-2026-09-16.

## Independent source and package proof
Fetched five complete nontruncated Git trees: common ancestor, server, client, merge, final. Recomputed provenance independently: client54, server19, overlap0, unchanged ancestor922; zero merge blob/mode mismatches. Final follow-up changes exactly the eight allowed docs paths; no implementation changes.
Verified merge parents and follow-up commit lineage. Created draft PR9 after confirming no existing PR for that head; executor's401 was not an architect access blocker. PR9 virtual mergefd3949e26ae10dfbd40d7527e2981b607a4b5837 has main/candidate parents and candidate-identical tree.
Downloaded Actions artifact10428733930 from exact candidate PR checkout and independently compared every default-development ZIP file to runtime and extracted:39/39, zero mismatches. ZIP1801114bytes, SHA2562f364316986187db50251dc4708317ca612ce51dd7106138106f64239605ba43, matching executor receipt.
The separate local ephemeral-key browser ZIP was not downloaded; its f29f48518f114353349a495fea7087007e7dad12be4cde0cc0d0e6e5bd078a67 hash remains reported evidence. Native CI verifies its own separately generated fixture package.

## Evidence precision
runtime-blobs.json mislabels990 as non-documentation paths. It is the all-file inventory excluding the five existing allowlisted documentation paths; actual tracked blobs outside docs/ are759, all unchanged. The source-preservation criterion independently passes. Correct that one label with the next factual evidence update; no runtime acceptance is inferred from the erroneous count.
docs/STATUS.md retains old REAL_ACCOUNT_AUTH_NOT_CONNECTED wording alongside bounded C1 acceptance. Read it as historical/canonical-main scope; the accepted development candidate has installed-local account authentication, not live email/preprod. Do not use the stale headline to reopen accepted C1 or claim production readiness.

## Remote checks
Server push35052294338/job104655147186 SUCCESS; log checkout1ff322b3, integration39files/1527 including health20, E2E88 including both reference tests.
PR Server35052418502/job104655465041 and Extension35052418514/WB-browser104655465480 remain under active monitoring at this checkpoint.
PR Extension I1 run35052418530: client104655465372 SUCCESS; installed-local104655465207 SUCCESS. Exact virtual-merge checkout independently read. Installed log confirms real local API/portal/PG, two distinct accounts/devices/authorizations, same worker, logout clear, development OTP, Chromium151.0.7922.34, zero live calls.
PR Extension35052418514: core104655465517, Ozon104655465635, WB-nodes104655465586 and native104655465353 SUCCESS. Native source/extracted logs include actual popup, Work prompt, text and binary delivery/IDB, Finish and UI checks; synthetic provider and AI.
Documentation35052418500/job104655466012 SUCCESS.
See I1_SYNC_CI.json for final readback when completed.

## Current decision
WAITING_REQUIRED_REMOTE_GATES at this checkpoint; no implementation rework identified for the prescribed synchronization scope. Active architect cycle continues; no duplicate task or workflow rerun.
Acceptance, when all required gates complete, is bounded to the combined source/package/native/installed-local development candidate. It is not C2/full I1, live-provider, email, preprod, merge, release or Health acceptance.

## Next architect-designed step
C2.1 cache context/time before offline grace and profile consumption. Exact source-VM probe on verified Git blobs reproduced expiry rollback reauthorization and changed origin/browser cache acceptance. This is explicitly deferred C2 scope, not a synchronization regression. Probe uses real Ed25519 verification and synthetic clock/storage, not installed/live evidence.
See I1_C2_1_DESIGN.md and tasks/I1_C2_1_2026-09-16.md. No next prompt has been submitted at this checkpoint.
Health/P8.4 B5 stays NOT ACCEPTED; B6–B8 queued; S1.2/D3 deferred.
