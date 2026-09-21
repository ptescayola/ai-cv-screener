export function resolveOutgoingMessage(
  overrideText: string | undefined,
  draft: string,
): string | null {
  const text = (overrideText ?? draft).trim()
  return text || null
}

export function canSendOutgoingMessage(
  text: string | null,
  isLoading: boolean,
): boolean {
  return text !== null && !isLoading
}

export function chatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

export function isStaleChatRequest(
  activeRequestId: number,
  requestId: number,
): boolean {
  return activeRequestId !== requestId
}
