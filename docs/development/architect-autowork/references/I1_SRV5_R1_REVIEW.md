# I1-SRV.5 R1 architect review — 2026-09-16

Verdict: REWORK_REQUIRED on 832b135f129154dae2a1ce726528fdb353e92292.
Signing-fixture correction conforms to the selected design. The remaining required correction is integration-suite isolation plus the explicitly requested factual full-SHA correction.

## Candidate and scope
Branch feature/server-i1-srv5-acceptance-2026-09-16; draft PR8 reused/unmerged.
Base main 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c.
Implementation39478f0b4e28dd875111ce28670396531a8efc4d -> final832b135f129154dae2a1ce726528fdb353e92292; tree53238b426990508d20cf277b8ffb9797861d2f54.
Remote ref, PR head, ancestry and seven changed paths independently read.
PR merge4571212c3bed15c3a982561c77b41e8cea905212 has main/candidate parents and candidate-identical tree.

## R1 source review
playwright.config.ts generates both pairs only outside a Playwright worker, leaves worker public JSON unchanged, rejects absent public JSON, and conditionally supplies the private ring to API env.
i1-reference-acceptance.spec.ts independently checks worker identity, absent private env and equality of the preselected public trust with the disposable DB public metadata. The trust map is not derived from DB. Original lifecycle assertions unchanged.
Executor reports actual RED/GREEN, focused2/2, config1/1 and E2E88/88. These local execution reports are distinct from independent source review and remote CI.

## Remaining integration defect: concrete cause
R1 evidence explicitly records pnpm test:integration FAIL,1507 passed/20 skipped, duplicate fixed ai_adapters PK during health-persistence beforeAll. This report is not relabeled PASS.
Read packages/server/db/src/health-persistence.integration.test.ts:
- IDS.adapter00000000-0000-4000-8000-000000000001;
- beforeAll calls runtime.ready then INSERT fixture-ai; no reset or migrations;
- afterAll only closes runtime.
Read packages/server/db/src/adapter-registry.integration.test.ts:
- A has the same UUID;
- its test inserts chatgpt with that UUID;
- tests preserve that adapter; afterAll closes runtime without deleting it.
Read packages/server/db/src/index.ts: runtime.ready only SELECT1.
Read tests/integration/server/vitest.config.ts: fileParallelism false, no cross-suite cleanup.
Therefore the ordered pair adapter-registry -> health-persistence necessarily meets an occupied primary key; health-persistence also depends on an earlier suite having installed its schema. This is a deterministic source-level order dependency, not an alleged production Health defect. The exact predecessor of the executor's original local failure is not logged in the supplied README and is not asserted here.
No independent PostgreSQL execution was performed in the architect workspace (no postgres/initdb/psql binaries). R2 prescribes an exact real-DB RED/GREEN reproducer, not a speculative investigation.
Architect correction: before health fixture inserts, reset public and drizzle schemas in the task-owned test DB and run canonical migrations, matching neighboring integration suite setup. Preserve IDs, all20 tests, constraints and intra-suite history. No ON CONFLICT/retries/skips/order forcing.
The separate Health/P8.4 B5 blocker is h3-health-persistence on its own branch/machine_key constraint; it remains NOT ACCEPTED and is not closed by this test setup repair.

## Documentation
The requested full-SHA repair was not applied: several allowlisted documents and the terminal still contain39-character5d7c8853cc69dd95bc6e713cac3fb2aa0a63383. Actual Git base ends83c. R2 gives a readback/length check.
The synchronization paragraph duplicates the refresh/revoke fragment. Correct while updating its factual acceptance paragraph; no general editorial work.

## CI
Push35046791468/job104638266285 and PR35046795347/job104638309700 had both passed integration and were building at latest read. This proves a favorable clean execution order, not isolation under the specifically failing sequence. No rerun requested.
Documentation35046795316/job104638241825 SUCCESS.
No final server status or failed CI log is invented; the current local FAIL is supported by committed evidence and the selected order failure by source.
Snapshot: I1_SRV5_R1_CI.json.

## Next and queues
One SA-I1-SRV5-R2-20260916-01 prepared for final submission; previous R1 terminal complete. No new task launch claimed before delivery.
C1 at56c81a3521c02502b65fd713aec890e5a30f038d remains accepted, PR7 unmerged.
C2 preparation established that client and current server changed-path sets from common ancestorbc0cd0088ca50ba06021ea602a46bdd90de91378 are disjoint; client is not descended from current main. After SRV5 acceptance use explicit normal merge of accepted heads into a single integration candidate, preserving history. No C2 task was issued and no branch was merged.
Health/P8.4 B5 remains open; B6–B8 queued; general beta B1/B2 distinct.
