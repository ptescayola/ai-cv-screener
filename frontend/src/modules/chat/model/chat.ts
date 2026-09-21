export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  sources?: string[]
}

export interface CvChatAnswer {
  answer: string
  sources: string[]
}
