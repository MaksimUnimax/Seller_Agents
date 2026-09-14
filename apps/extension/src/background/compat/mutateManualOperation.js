async function mutateManualOperation(conversationKey, mutator) {
  return manualOperationRecords.mutate(
    normalizeConversationKey(conversationKey),
    mutator,
  );
}
