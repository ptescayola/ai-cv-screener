import type { ChatMessage, ChatRole } from '@/modules/chat/model/chat'

export function createMessage(
  role: ChatRole,
  content: string,
  sources?: string[],
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    sources,
    createdAt: Date.now(),
  }
}
