# C2.2-D1 — server-owned capability permission vocabulary

Status: `IMPLEMENTED_CANDIDATE / ACCEPTANCE_PENDING`.

## Purpose

C2.2-B exposed already verified signed Bootstrap V2 metadata without execution authority. C2.2-C created an independent package-local registry of four packaged adapter-presence facts, also without execution authority.

The next intersection cannot safely guess that a remote feature or entitlement key has the same meaning as a local packaged capability id. The existing server implementation has generic entitlement and feature machinery, but before this step it did not define a canonical Seller Agents product permission vocabulary for Ozon, Wildberries, ChatGPT and Alice.

Normative server documentation already used `source.ozon`, `ai.chatgpt` and `ai.alice` as entitlement examples. `source.wildberries` was not previously defined; C2.2-D1 introduces it explicitly to complete the already accepted unified Ozon/Wildberries product model. This is a new reviewed server key, not a claim that it existed historically.

## Authority introduced by this step

`@product/entitlements/seller-agents-capability-permissions` defines exactly four stable account permission keys:

- `source.ozon`;
- `source.wildberries`;
- `ai.chatgpt`;
- `ai.alice`.

Every definition is:

- `BOOLEAN`;
- security classification `CAPABILITY`;
- `executionAuthority: false`.

The registry is immutable and validates every key through the existing entitlement-key schema.

These keys are server-owned product permission names. They are deliberately distinct from the package-local capability ids created by C2.2-C:

- `marketplace.ozon.adapter`;
- `marketplace.wildberries.adapter`;
- `ai.chatgpt.web.adapter`;
- `ai.alice.web.adapter`.

C2.2-D1 defines no mapping between the two namespaces.

## Explicit non-goals

This step does not:

- insert entitlement definitions into a database or mutate any plan;
- grant any account an entitlement;
- define signed entitlement -> packaged capability mapping;
- consume `features` as permission;
- compute effective capability;
- change bootstrap payloads, contracts, schema, migrations or OpenAPI;
- change `SellerAgentsControlClient.canWork()`;
- change Work Start/Resume, command validation, provider dispatch, replay, delivery, recovery, quota, file or scheduler behavior;
- enable offline or stale-cache Work;
- change AI profile resolution or Health policy;
- claim that `ozon.analytics`, `ozon.performance`, `feature.guided_commands` or `device.max_active` are adapter-presence permissions.

## Acceptance gate

The focused package test must prove:

1. exactly the four reviewed keys exist;
2. every definition is a valid `BOOLEAN/CAPABILITY` entitlement and has no execution authority;
3. packaged-local capability ids and operation-level/product keys are not silently accepted as these permissions;
4. only exact reviewed permission keys are recognized;
5. the exported definition registry is immutable.

Full server unit/type/lint/format/integration/migration/OpenAPI/bridge/build/E2E regression remains required before acceptance. No manual test is required for this non-interactive server vocabulary step.

## Next boundary after acceptance

A separate C2.2-D2 step may define a read-only, fail-closed mapping/intersection between these explicit signed entitlement keys and the C2.2-C packaged-local capability registry. D2 must still grant no execution authority. Missing/unknown signed permission denies, explicit false denies, and a remote allow can never manufacture a local capability absent from the package. Remote feature/health policy remains an additional separate gate before any execution integration.
