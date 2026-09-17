# packages/control-client

Privileged browser client for device activation, token rotation, signed bootstrap V2 and account authority. Tokens, refresh markers, deviceCode and session metadata stay in trusted extension storage; ordinary marketplace batches never call the control plane.

The checked-in composition is explicitly LOCAL DEVELOPMENT and uses packaged loopback origins/trust input. It is a development candidate, not a production or preprod configuration. The client does not import Node/server code, read server environment, or trust runtime-fetched keys.

The account port is derived only from a verified V2 payload. V1 is not a catalog fallback. Authority generations invalidate pending work, late bootstrap/refresh results and account-scoped catalog operations.

Границы: [архитектура](../../docs/architecture/OVERVIEW.md), [размещение](../../docs/architecture/REPOSITORY.md), [текущий статус](../../docs/STATUS.md).
