const manualOperationRecords =
  globalThis.SellerAgentsLocalOperations.createRecordStore({
    read: (keys) => storageGet(keys),
    write: (values) => storageSet(values),
    namespace: KEYS.MANUAL_OPERATIONS,
  });
