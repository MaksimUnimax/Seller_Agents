async function getManualOperation(conversationKey) {
  return manualOperationRecords.get(normalizeConversationKey(conversationKey));
}
