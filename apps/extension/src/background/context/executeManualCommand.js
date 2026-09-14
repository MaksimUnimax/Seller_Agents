async function executeManualCommand(
  commandText,
  conversationKey,
  sender,
  manualRequestId,
) {
  const key = normalizeConversationKey(conversationKey);
  const senderTabId = Number(sender?.tab?.id || 0);
  if (!Number.isInteger(senderTabId) || senderTabId <= 0) {
    throw Object.assign(
      new Error(
        "Ручная Ozon-команда должна приходить из content script поддерживаемого AI.",
      ),
      { code: "MANUAL_SENDER_TAB_MISSING" },
    );
  }
  const requestToken = String(manualRequestId || "").trim();
  if (!requestToken)
    throw Object.assign(new Error("Manual request ID отсутствует."), {
      code: "MANUAL_REQUEST_ID_MISSING",
    });
  const liveIdentity = await assertTabConversation(senderTabId, key);
  const binding = await strictBindingForIdentity(liveIdentity);
  const manualAutoSend = (await getSettings()).autoSend !== false;
  const workSession = await workSessionFor(key);

  let entries;
  let sourceStage = "command_discovery";
  if (workSession.state !== OzonWorkSessionModel.STATES.ACTIVE_VISIBLE) {
    sourceStage = "work_session_gate";
    entries = [
      batchErrorEntry(
        Object.assign(
          new Error(
            "Work-session этого AI-диалога не находится в состоянии active_visible. Ozon API request не выполнен.",
          ),
          { code: "WORK_SESSION_NOT_VISIBLE" },
        ),
        sourceStage,
        OzonContract.textFingerprint(commandText),
      ),
    ];
  } else if (!(await getManualMode(key))) {
    sourceStage = "manual_gate";
    entries = [
      batchErrorEntry(
        Object.assign(
          new Error(
            "Кнопка Ozon выключена для этого AI-диалога. API-запрос не выполнен.",
          ),
          { code: "MANUAL_MODE_OFF" },
        ),
        sourceStage,
        OzonContract.textFingerprint(commandText),
      ),
    ];
  } else {
    const run = await getAutoRun(key);
    if (run && !BridgeAutorunModel.canEnableManualMode(run.status)) {
      sourceStage = "manual_gate";
      entries = [
        batchErrorEntry(
          Object.assign(
            new Error("Авторежим активен. Ручной API-вызов не выполнен."),
            { code: "AUTO_MODE_ACTIVE" },
          ),
          sourceStage,
          OzonContract.textFingerprint(commandText),
        ),
      ];
    } else {
      try {
        entries = discoverBatchEntries(commandText);
      } catch (error) {
        entries = [
          batchErrorEntry(
            error,
            "command_discovery",
            OzonContract.textFingerprint(commandText),
          ),
        ];
      }
      if (!entries.length) {
        entries = [
          batchErrorEntry(
            Object.assign(
              new Error("В тексте не найдено ни одной OZON_API_V1 команды."),
              { code: "NO_OZON_COMMANDS" },
            ),
            "command_discovery",
            OzonContract.textFingerprint(commandText),
          ),
        ];
      }
    }
  }

  const executionContext = await captureBatchContext(
    key,
    commandText,
    requestToken,
  );
  const operationId = `ozmanual-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  let duplicateOperation = null;
  const operation = await mutateManualOperation(key, (current) => {
    if (current?.manual_request_id === requestToken) {
      duplicateOperation = current;
      return current;
    }
    if (manualOperationActive(current)) return current;
    return {
      operation_id: operationId,
      manual_request_id: requestToken,
      conversation_key: key,
      origin: liveIdentity.origin,
      conversation_id: liveIdentity.conversation_id,
      binding_snapshot: bindingSnapshot(binding),
      execution_context: executionContext,
      tab_id: senderTabId,
      status: MANUAL_OPERATION_STATUSES.REQUESTING,
      operation: null,
      last_operation: null,
      command_summary: `${entries.length} queued OZON_API_V1 item(s)`,
      request_id: null,
      request_worker_session_id: null,
      delivery_id: null,
      outgoing_text: null,
      auto_send: manualAutoSend,
      report_prefix_applied: false,
      delivery_confirmed: false,
      delivery: null,
      batch: {
        phase: "collecting",
        source: "manual_copy",
        entries,
        next_index: 0,
        request_state: "idle",
        request_worker_session_id: null,
        planning_state: "pending",
        capability_resolution: null,
        query_planning_state: "pending",
        query_plan: null,
        quota_wait: null,
        request_quota: null,
        created_at: now,
      },
      created_at: now,
      completed_at: null,
      last_error: null,
    };
  });
  if (duplicateOperation) {
    throw Object.assign(
      new Error(
        "Эта ручная операция уже принята. Повторный API-вызов запрещён.",
      ),
      {
        code: "MANUAL_REQUEST_DUPLICATE",
        operation_id: duplicateOperation.operation_id,
      },
    );
  }
  if (!operation || operation.operation_id !== operationId) {
    throw Object.assign(
      new Error("Bridge уже выполняет или доставляет ручной Ozon batch."),
      { code: "MANUAL_OPERATION_ACTIVE" },
    );
  }
  await diagnostic("MANUAL_BATCH_ACCEPTED", {
    operation_id: operationId,
    manual_request_id: requestToken,
    conversation_id: liveIdentity.conversation_id,
    tab_id: senderTabId,
    item_count: entries.length,
    command_count: entries.filter((entry) => entry.kind === "command").length,
    pre_execution_error_count: entries.filter(
      (entry) => entry.kind !== "command",
    ).length,
    source_stage: sourceStage,
  });
  launchBatchProcessor("manual", key, operationId, "manual_admission");
  return {
    ok: true,
    accepted: true,
    manual_operation_id: operationId,
    manual_request_id: requestToken,
    item_count: entries.length,
    command_count: entries.filter((entry) => entry.kind === "command").length,
    pre_execution_error_count: entries.filter(
      (entry) => entry.kind !== "command",
    ).length,
  };
}
