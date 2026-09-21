import { useCallback, useState } from 'react'
import { askCvQuestion } from '../modules/chat/application/askCvQuestion'
import type { ChatMessage } from '../modules/chat/model/chat'

function createMessage(
  role: ChatMessage['role'],
  content: string,
  sources?: string[],
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    sources,
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async () => {
    const text = draft.trim()
    if (!text || isLoading) {
      return
    }

    setDraft('')
    setMessages((current) => [...current, createMessage('user', text)])
    setIsLoading(true)

    try {
      const { answer, sources } = await askCvQuestion(text)
      setMessages((current) => [
        ...current,
        createMessage('assistant', answer, sources),
      ])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      setMessages((current) => [
        ...current,
        createMessage('assistant', message),
      ])
    } finally {
      setIsLoading(false)
    }
  }, [draft, isLoading])

  return {
    messages,
    draft,
    setDraft,
    sendMessage,
    isLoading,
  }
}
