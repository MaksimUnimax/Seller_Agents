async function finalizeManualBatch(
  conversationKey,
  operationId,
  entries,
  batchSnapshot = null,
) {
  const key = normalizeConversationKey(conversationKey);
  await assertManualBatchContext(key, operationId);
  const combinedReport = formatCombinedBatchReport(entries, batchSnapshot);
  const prefixed = await applyPrefixToReport(key, combinedReport);
  const deliveryId = `manual-delivery-${crypto.randomUUID()}`;
  await assertManualBatchContext(key, operationId);
  let claimed = false;
  const operation = await mutateManualOperation(key, (current) => {
    if (
      !current ||
      current.operation_id !== operationId ||
      current.status !== MANUAL_OPERATION_STATUSES.REQUESTING ||
      !current.batch
    )
      return current;
    const currentEntries = Array.isArray(current.batch.entries)
      ? current.batch.entries
      : [];
    if (
      Math.max(0, Number(current.batch.next_index || 0)) < currentEntries.length
    )
      return current;
    if (currentEntries.some((entry) => entry?.status !== "complete"))
      return current;
    claimed = true;
    const next = BridgeAutorunModel.claimDelivery(current, {
      deliveryId,
      requestId: "",
      outgoingText: prefixed.outgoing_text,
      outgoingHash: "",
      reportPrefixApplied: prefixed.report_prefix_applied === true,
      mode: "batch_watch_v1",
    });
    next.delivery_id = deliveryId;
    next.outgoing_text = prefixed.outgoing_text;
    next.report_prefix_applied = prefixed.report_prefix_applied === true;
    next.request_worker_session_id = null;
    next.batch = {
      ...current.batch,
      phase: "collected",
      request_state: "idle",
      request_worker_session_id: null,
      combined_report_ready: true,
      collected_at: new Date().toISOString(),
    };
    return next;
  });
  if (!claimed) return { ok: false, code: "BATCH_FINALIZE_RACE" };
  await diagnostic("BATCH_COLLECTION_COMPLETED", {
    owner_kind: "manual",
    owner_id: operationId,
    result_count: entries.length,
    delivery_id: deliveryId,
    report_prefix_applied: prefixed.report_prefix_applied === true,
  });
  void attemptManualBatchDelivery(key, operationId);
  return {
    ok: true,
    collected: true,
    result_count: entries.length,
    delivery_id: deliveryId,
    operation,
  };
}
