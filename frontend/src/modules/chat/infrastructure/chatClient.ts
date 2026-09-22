import { api } from '@/modules/chat/infrastructure/apiClient'

type ChatResponseBody = {
  answer: string
  sources: Array<{ fileName: string }>
}

export async function fetchChatAnswer(
  message: string,
): Promise<{ answer: string; sources: string[] }> {
  const { data } = await api.post<ChatResponseBody>('/chat', { message })

  if (!data || typeof data.answer !== 'string') {
    throw new Error('Chat response was invalid')
  }

  return {
    answer: data.answer,
    sources: data.sources.map((source) => source.fileName),
  }
}
