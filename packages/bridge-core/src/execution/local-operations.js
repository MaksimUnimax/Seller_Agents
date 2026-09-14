(() => {
  "use strict";

  // Extracted from the accepted worker; one local flight owns a given key.
  // Errors clear the flight but do not execute a replacement operation.
  function singleFlight(map, key, fn) {
    if (map.has(key)) return map.get(key);
    const request = Promise.resolve()
      .then(fn)
      .finally(() => {
        if (map.get(key) === request) map.delete(key);
      });
    map.set(key, request);
    return request;
  }

  function createWriteQueue() {
    let tail = Promise.resolve();
    return Object.freeze({
      run(fn) {
        const next = tail.then(fn, fn);
        tail = next.catch(() => null);
        return next;
      },
    });
  }

  // A queue belongs to the whole storage map, not an individual dialogue.
  // Otherwise concurrent read/modify/write operations can erase each other.
  function createRecordStore({
    read,
    write,
    namespace,
    now = () => new Date().toISOString(),
  }) {
    if (
      typeof read !== "function" ||
      typeof write !== "function" ||
      !namespace
    ) {
      throw new TypeError(
        "Local record storage ports and namespace are required",
      );
    }
    const queue = createWriteQueue();
    async function get(key) {
      const data = await read(namespace);
      return (data[namespace] || {})[key] || null;
    }
    function mutate(key, mutator) {
      return queue.run(async () => {
        const data = await read(namespace);
        const records = { ...(data[namespace] || {}) };
        const next = await mutator(records[key] || null);
        if (next) records[key] = { ...next, updated_at: now() };
        else delete records[key];
        await write({ [namespace]: records });
        return records[key] || null;
      });
    }
    return Object.freeze({ get, mutate, withWrite: queue.run });
  }

  globalThis.SellerAgentsLocalOperations = Object.freeze({
    singleFlight,
    createWriteQueue,
    createRecordStore,
  });
})();
