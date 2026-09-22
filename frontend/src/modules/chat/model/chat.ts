export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  sources?: string[]
  createdAt: number
  error?: boolean
}
