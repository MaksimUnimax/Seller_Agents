# R3 commands and outcomes

All source/package JavaScript gates used Node `v24.20.0`; package version remained `0.2.4`.

| Command / scope | Outcome |
|---|---|
| `SA_NODE_BIN=/root/.nvm/versions/node/v24.20.0/bin/node python3 tooling/checks/extension_i1.py --output <fresh>` | PASS, source/extracted, 92 gate processes; includes client-r2 and client-r3 |
| `PATH=/root/.nvm/versions/node/v24.20.0/bin:$PATH python3 tooling/checks/extension_core.py --output <fresh>` | PASS, source/extracted, 111 gate processes; includes composed full-worker adaptation |
| `python3 tests/regression/extension-core/browser_application.py` source and extracted | PASS, Chromium 151.0.7922.34, zero live provider calls |
| `python3 tests/regression/extension-core/client-i1/browser_verifier.py` source and extracted | PASS, valid signature and tamper rejection |
| `pnpm docs:check` | PASS, 431 files / 226 Markdown files |
| `pnpm bridge:guard` | PASS |
| `pnpm openapi:check` | PASS |
| isolated local `postgres:18.0` + `installed_local_integration.py` | BLOCKED: `initdb: error: could not create directory .../pg_wal: No space left on device`; fresh task container removed |

The first common-core attempt used the shell's Node v12 and failed syntax parsing before tests; rerunning with Node24 passed. No source failure was hidden by that environment correction.
