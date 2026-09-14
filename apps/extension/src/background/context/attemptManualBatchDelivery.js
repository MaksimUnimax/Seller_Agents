function attemptManualBatchDelivery(conversationKey, operationId) {
  const key = normalizeConversationKey(conversationKey);
  return singleFlight(
    deliveryAttemptRequests,
    `manual:${String(operationId || "")}`,
    async () => {
      const operation = await getManualOperation(key);
      if (
        !operation ||
        operation.operation_id !== operationId ||
        operation.status !== MANUAL_OPERATION_STATUSES.DELIVERING ||
        operation.delivery?.mode !== "batch_watch_v1"
      ) {
        return { ok: false, code: "MANUAL_BATCH_NOT_DELIVERING" };
      }
      await assertManualBatchContext(key, operationId);
      let recoveryType = null;
      if (
        operation.delivery.phase === BridgeAutorunModel.DELIVERY_PHASES.CLAIMED
      )
        recoveryType = "deliver_claimed";
      else if (
        operation.delivery.phase === BridgeAutorunModel.DELIVERY_PHASES.INSERTED
      )
        recoveryType = "watch_delivery";
      else if (
        operation.delivery.phase ===
        BridgeAutorunModel.DELIVERY_PHASES.INSERT_COMMITTED
      )
        return { ok: false, code: "DELIVERY_INSERT_OUTCOME_UNKNOWN_NO_RETRY" };
      if (!recoveryType)
        return { ok: false, code: "MANUAL_BATCH_DELIVERY_NOT_ACTIONABLE" };
      const recovery = manualBatchRecoveryPayload(operation, recoveryType);
      const push = await tabMessage(Number(operation.tab_id), {
        type: "OZ_BATCH_DELIVERY_AVAILABLE",
        recovery,
      });
      await diagnostic(
        "DELIVERY_PUSH_RESPONSE",
        {
          owner_kind: "manual",
          owner_id: operationId,
          delivery_id: operation.delivery.delivery_id,
          delivery_mode: "batch_watch_v1",
          phase: operation.delivery.phase,
          recovery_type: recoveryType,
          ok: push?.ok === true,
          code: push?.code || null,
        },
        { level: push?.ok === true ? "info" : "warning" },
      );
      return push;
    },
  ).catch(async (error) => {
    if (!error?.execution_context_error) throw error;
    const current = await getManualOperation(key);
    if (current?.operation_id === operationId && manualOperationActive(current))
      await failManualBatch(key, operationId, error.code, error.message);
    return { ok: false, code: error.code };
  });
}
