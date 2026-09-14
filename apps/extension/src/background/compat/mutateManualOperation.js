async function mutateManualOperation(conversationKey, mutator) {
  return manualOperationRecords.mutate(
    normalizeConversationKey(conversationKey),
    async (current) => saPrunePayload(await mutator(saPrunePayload(current))),
  );
}
