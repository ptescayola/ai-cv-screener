import type { ChatMessage, ChatRole } from '@/modules/chat/model/chat'

export function createMessage(
  role: ChatRole,
  content: string,
  sources?: string[],
  error = false,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    sources,
    createdAt: Date.now(),
    ...(error ? { error: true } : {}),
  }
}
