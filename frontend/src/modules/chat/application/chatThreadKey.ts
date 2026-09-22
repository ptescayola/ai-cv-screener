import type { ChatMessage } from '@/modules/chat/model/chat'

export function chatThreadKey(
  messages: ChatMessage[],
  isLoading: boolean,
): string {
  const last = messages.at(-1)
  return `${messages.length}:${last?.id ?? 'none'}:${isLoading ? 1 : 0}`
}
