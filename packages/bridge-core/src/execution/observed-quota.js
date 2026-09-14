(() => {
  "use strict";
  // Only observed Retry-After deadlines. Provider-specific intervals are NOT inferred.
  function create({ read, write, namespace, now = () => Date.now() }) {
    if (typeof read !== "function" || typeof write !== "function" || !namespace)
      throw new TypeError("Quota storage ports and namespace are required");
    const queue = globalThis.SellerAgentsLocalOperations.createWriteQueue();
    function key(scope) {
      if (!/^[a-f0-9]{64}$/.test(scope)) throw new Error("INVALID_QUOTA_SCOPE");
      return `${namespace}:${scope}`;
    }
    async function get(scope) {
      const name = key(scope), record = (await read(name))[name];
      if (record != null && (!Number.isFinite(record.next_allowed_at) || record.next_allowed_at < 0))
        throw Object.assign(new Error("Quota state is invalid"), { code: "QUOTA_STATE_INVALID" });
      return record?.next_allowed_at || 0;
    }
    async function prepare(scope) {
      const deadline = await get(scope);
      return { required: deadline > now(), allowed: deadline <= now(),
        quota: { scope, next_allowed_at: deadline, source: "provider_retry_after" } };
    }
    async function observe(scope, value) {
      const text = String(value ?? "").trim();
      if (!text) return;
      const at = /^\d+(?:\.\d+)?$/.test(text) ? now() + Number(text) * 1000 : Date.parse(text);
      if (!Number.isFinite(at) || at < now() || !Number.isFinite(new Date(at).getTime())) return;
      return queue.run(async () => {
        const next_allowed_at = Math.max(await get(scope), at);
        await write({ [key(scope)]: { next_allowed_at } });
        if ((await get(scope)) < next_allowed_at)
          throw Object.assign(new Error("Quota write did not persist"), { code: "QUOTA_STORAGE_FAILED" });
      });
    }
    return Object.freeze({ prepare, observe });
  }
  globalThis.SellerAgentsObservedQuota = Object.freeze({ create });
})();
