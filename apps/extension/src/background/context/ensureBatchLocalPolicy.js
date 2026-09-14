async function ensureBatchLocalPolicy({
  ownerKind,
  ownerId,
  getOwner,
  mutateOwner,
  ownerMatches,
  isCollecting,
  failOwner,
  executionContext = null,
}) {
  let owner = await getOwner();
  if (!owner || !ownerMatches(owner))
    return { ok: false, code: "BATCH_OWNER_NOT_ACTIVE" };
  if (!isCollecting(owner) || !owner.batch)
    return { ok: true, code: "BATCH_NOT_COLLECTING", owner };
  if (owner.batch.policy_state === "complete")
    return { ok: true, code: "BATCH_POLICY_READY", owner };
  if (
    Math.max(0, Number(owner.batch.next_index || 0)) !== 0 ||
    (owner.batch.entries || []).some(
      (entry) => entry?.status === "requesting" || entry?.status === "complete",
    )
  ) {
    await failOwner(
      "BATCH_POLICY_MIGRATION_UNSAFE",
      "Batch уже начал исполнение до применения personal-data policy; новые provider requests запрещены.",
    );
    return { ok: false, code: "BATCH_POLICY_MIGRATION_UNSAFE" };
  }
  const settings = await (executionContext
    ? executionContext.settings()
    : getSettings());
  const personalDataEnabled = settings.personalDataEnabled === true;
  const nextEntries = (owner.batch.entries || []).map((entry) => {
    if (!entry || entry.kind !== "command" || !entry.command) return entry;
    if (
      !commandRequiresPersonalDataPolicy(entry.command) ||
      personalDataEnabled
    )
      return entry;
    return {
      ...entry,
      kind: "policy_error",
      status: "pending",
      error: {
        code: "OPERATION_DISABLED_BY_USER",
        message:
          "Операция может передать личные данные в AI-чат. Чтобы выполнить запрос, включите «Показывать личные данные» в настройках Ozon Bridge, затем явно запустите новую команду.",
        policy: "personal_data_setting_required",
      },
      execution_command: null,
      planning: null,
    };
  });
  let stored = false;
  owner = await mutateOwner((current) => {
    if (
      !current ||
      !ownerMatches(current) ||
      !isCollecting(current) ||
      !current.batch ||
      current.batch.policy_state === "complete"
    )
      return current;
    if (
      Math.max(0, Number(current.batch.next_index || 0)) !== 0 ||
      current.batch.request_state !== "idle"
    )
      return current;
    stored = true;
    return {
      ...current,
      batch: {
        ...current.batch,
        entries: nextEntries,
        policy_state: "complete",
        policy_personal_data_enabled: personalDataEnabled,
        policy_completed_at: new Date().toISOString(),
      },
    };
  });
  if (!stored) {
    await failOwner(
      "BATCH_POLICY_STORE_RACE",
      "Personal-data policy не удалось сохранить до provider execution; business requests запрещены.",
    );
    return { ok: false, code: "BATCH_POLICY_STORE_RACE" };
  }
  const blockedCount = nextEntries.filter(
    (entry) => entry?.kind === "policy_error",
  ).length;
  if (blockedCount)
    await diagnostic(
      "PERSONAL_DATA_POLICY_BLOCKED",
      {
        owner_kind: ownerKind,
        owner_id: ownerId,
        blocked_count: blockedCount,
        external_request_executed: false,
      },
      { level: "warning" },
    );
  return { ok: true, code: "BATCH_POLICY_READY", owner };
}
