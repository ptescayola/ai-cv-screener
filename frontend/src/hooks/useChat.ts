import { useCallback, useRef, useState } from 'react'
import { fetchChatAnswer } from '../modules/chat/infrastructure/chatClient'
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
    createdAt: Date.now(),
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const activeRequestRef = useRef(0)

  const resetChat = useCallback(() => {
    activeRequestRef.current += 1
    setMessages([])
    setDraft('')
    setIsLoading(false)
  }, [])

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? draft).trim()
      if (!text || isLoading) {
        return
      }

      const requestId = activeRequestRef.current + 1
      activeRequestRef.current = requestId

      setDraft('')
      setMessages((current) => [...current, createMessage('user', text)])
      setIsLoading(true)

      try {
        const { answer, sources } = await fetchChatAnswer(text)
        if (activeRequestRef.current !== requestId) {
          return
        }
        setMessages((current) => [
          ...current,
          createMessage('assistant', answer, sources),
        ])
      } catch (error) {
        if (activeRequestRef.current !== requestId) {
          return
        }
        const message =
          error instanceof Error ? error.message : 'Something went wrong'
        setMessages((current) => [
          ...current,
          createMessage('assistant', message),
        ])
      } finally {
        if (activeRequestRef.current === requestId) {
          setIsLoading(false)
        }
      }
    },
    [draft, isLoading],
  )

  return {
    messages,
    draft,
    setDraft,
    sendMessage,
    resetChat,
    isLoading,
  }
}
