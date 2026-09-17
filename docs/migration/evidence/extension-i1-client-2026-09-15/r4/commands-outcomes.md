# R4 commands and outcomes

All JavaScript gates used pinned Node `v24.20.0`; extension version remained `0.2.4`.

| Command / scope | Outcome |
|---|---|
| `SA_NODE_BIN=/root/.nvm/versions/node/v24.20.0/bin/node python3 tooling/checks/extension_i1.py --output <fresh>/output` | PASS; source/extracted, 94 gate processes; R4 client and verifier included |
| `PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH python3 tooling/checks/extension_core.py --output <fresh>/output` | PASS; source/extracted, 111 gate processes; restored 0.2.3 adaptation and composed 0.2.4 route |
| `python3 tests/regression/extension-core/client-i1/browser_verifier.py` source/extracted | PASS; Chromium `151.0.7922.34`, valid signature and tamper rejection |
| `python3 tests/regression/extension-core/browser_application.py` source/extracted | PASS; native restart setup retained, zero live provider calls |
| `PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH pnpm docs:check` | PASS; 437 files, 228 Markdown files, 348 relative links |
| `PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH pnpm bridge:guard` | PASS |
| `PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH pnpm openapi:check` | PASS |
| `PRODUCT_CONTROL_PLANE_E2E=1 DATABASE_URL=postgres://...@127.0.0.1:45493/seller_agents_i1_client python3 tests/regression/extension-core/client-i1/installed_local_integration.py --output <fresh>/output` | BLOCKED before app startup; `pnpm db:migrate` exit 1, `ECONNREFUSED 127.0.0.1:45493`; no shared container was pruned/killed |

The installed failure artifact is bounded to stage/status/allowlisted code and counts. The prescribed remote gate is [job 104382641739](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34969687336/job/104382641739); remote status/checkouts were not independently readable because the unauthenticated private-repository API endpoint returned HTTP 404. Full applicable Extension CI, both I1 jobs, WB browsers, and Documentation CI must be read by the architect/CI before acceptance.
