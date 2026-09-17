# C2.2-D3A — server-owned free-beta capability permission policy

Status: `IMPLEMENTED_CANDIDATE / ACCEPTANCE_PENDING`.

## Why this step exists

C2.2-D1 accepted the four canonical Seller Agents account permission keys and C2.2-D2 accepted a client-side read-only, fail-closed intersection that requires those exact signed entitlement keys.

The post-D2 server audit found a real dependency before execution wiring:

- `beta-access` resolves only `BETA | NONE` and carries no capability map;
- current Bootstrap chooses `accessBasis: BETA` for admitted beta accounts;
- current Bootstrap copies entitlements only from independently eligible commercial access;
- therefore a beta-only account currently receives signed `entitlements: {}`;
- D2 correctly denies all four capability rows for such a snapshot.

The free beta is intended to exercise the current unified launch surface rather than a commercial SKU. This step therefore introduces an explicit server-owned beta product policy for the four already reviewed launch permissions instead of inferring permission from beta status or from local/client names.

This is a new reviewed policy introduced here. It is not a claim that these grants existed historically.

## Accepted candidate policy

`@product/entitlements/seller-agents-beta-capability-policy` defines one immutable policy manifest:

- schema: `seller_agents_beta_capability_policy_v1`;
- access basis: `BETA`;
- authority marker: `SERVER_PRODUCT_POLICY_ONLY`;
- execution authority: `false`;
- exact permissions:
  - `source.ozon = true`;
  - `source.wildberries = true`;
  - `ai.chatgpt = true`;
  - `ai.alice = true`.

Every row is derived only from the accepted D1 permission vocabulary and is required to remain BOOLEAN/CAPABILITY with `executionAuthority: false`.

The policy grants permission to the four packaged launch families for an already admitted free-beta account. It does not select a marketplace/store/dialogue/AI at runtime and it does not make any capability executable by itself.

## Why all four keys are explicit

The current unified product scope contains both marketplace adapters (Ozon and Wildberries) and both selected AI families (ChatGPT and Alice). The free beta is a product-access phase rather than a paid one-marketplace/two-marketplace SKU. D3A therefore makes the beta launch scope explicit as all four reviewed D1 permissions.

Later commercial packaging remains plan/entitlement driven and may differ. D3A does not rewrite commercial plans or pricing.

## Deliberate separation from Bootstrap emission

D3A does **not** change `BootstrapService` and does not make the new policy appear in signed snapshots yet.

That separation is intentional. A later bounded emission step must decide and test all precedence rules at the point where beta policy and commercial entitlement maps can coexist, including the current case where an account may be both beta-eligible and commercial-eligible while `accessBasis` is `BETA`.

D3A therefore proves the product-policy input independently before the signed wire projection consumes it.

## Fail-closed boundaries

The beta policy:

- contains exactly the four D1 keys and no inferred fifth key;
- contains no local packaged-capability ids;
- contains no `feature.*` keys;
- contains no provider-operation entitlements such as `ozon.analytics` / `ozon.performance`;
- contains no device limits such as `device.max_active`;
- cannot be mutated at runtime;
- cannot by itself grant Work, dispatch, offline use, provider access or scheduler authority.

No policy is defined here for `NONE`. Commercial permissions remain resolved by the existing commercial entitlement machinery rather than synthesized by this beta registry.

## Explicit non-goals

This step does not:

- modify `beta-access` admission state or quota semantics;
- alter Bootstrap payloads or signed envelopes;
- merge beta and commercial entitlement maps;
- define beta/commercial precedence in Bootstrap;
- seed `entitlement_definitions` or `plan_entitlements` in PostgreSQL;
- mutate commercial plans, prices or subscriptions;
- change `SellerAgentsControlClient`, D2 intersection behavior or `canWork()`;
- change Work Start/Resume, provider dispatch/replay, delivery/recovery/quota/file/scheduler paths;
- authorize stale/offline Work;
- change contracts, OpenAPI, migrations or Health policy;
- close C2/I1/D2, D3/S2, S1.2, beta, deployment or release.

## Acceptance gate

Focused package tests must prove:

1. the policy covers exactly the four D1 permission keys;
2. every beta policy row is literal `allowed: true` while both the row and manifest remain non-executing;
3. every row is anchored to an accepted BOOLEAN/CAPABILITY D1 definition;
4. no local capability ids, legacy feature keys, provider-operation entitlements or device-limit keys are silently accepted;
5. the manifest, rows, array and materialized permission map are immutable.

Full Server CI and Documentation CI are required because this step changes a server package/export. The diff must contain no Bootstrap runtime, database, migration, contract, OpenAPI, client, Work or provider execution file.

## Next boundary after acceptance

If D3A is accepted, the next bounded step may consume this exact policy in server Bootstrap permission emission.

That emission step must remain non-executing from the extension perspective and must separately prove:

- beta-only admitted account receives exactly the reviewed beta capability keys in the signed entitlement map;
- `NONE` cannot receive beta permissions;
- commercial-only access continues to use the commercial entitlement resolver;
- beta + commercial overlap has one explicit deterministic precedence/merge rule;
- no unknown policy key can enter the signed map;
- signed output still cannot manufacture a missing packaged capability on the client;
- no Work/provider/offline execution path is changed merely by emitting the signed policy.

Only after signed emission and client read-back are accepted should executable Work authority be considered.
