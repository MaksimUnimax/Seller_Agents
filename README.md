# Runtime Fixtures

TypeScript workspace for runtime integration fixtures, contract validation, browser regression testing, and supporting service scaffolds.

## Scope

This repository groups executable applications, shared packages, integration fixtures, automated checks, deployment scaffolds, and engineering evidence used to validate interactions between components.

The top-level documentation is intentionally implementation-focused. Component-specific behavior and historical evidence live next to the relevant code or under `docs/`.

## Layout

| Path | Purpose |
|---|---|
| `apps/` | executable application surfaces and runtime entry points |
| `packages/` | shared libraries, contracts, adapters, and service modules |
| `tests/` | integration, regression, and end-to-end checks |
| `tooling/` | build, validation, packaging, and repository tooling |
| `infra/` | deployment and environment scaffolding |
| `docs/` | technical notes, implementation evidence, and maintenance records |
| `.github/` | repository automation and CI definitions |

## Working in the repository

Use the root package scripts and the workflow relevant to the component being changed. Keep changes bounded to the requested subsystem, preserve existing regression coverage, and verify the exact remote revision before integration work.

Repository maintenance rules are in `AGENTS.md`. The technical documentation index is in `docs/README.md`.

## Validation

Different areas have separate validation routes. A successful documentation, packaging, or fixture check proves only that bounded check; it does not imply unrelated runtime or deployment acceptance.
