import { useCallback, useRef, useState } from 'react'
import {
  canSendOutgoingMessage,
  chatErrorMessage,
  isStaleChatRequest,
  resolveOutgoingMessage,
} from '@/modules/chat/application/outgoingMessage'
import { fetchChatAnswer } from '@/modules/chat/infrastructure/chatClient'
import { createMessage } from '@/modules/chat/model/createMessage'
import type { ChatMessage } from '@/modules/chat/model/chat'

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
      const text = resolveOutgoingMessage(overrideText, draft)
      if (!canSendOutgoingMessage(text, isLoading)) {
        return
      }

      const requestId = activeRequestRef.current + 1
      activeRequestRef.current = requestId

      setDraft('')
      setMessages((current) => [...current, createMessage('user', text!)])
      setIsLoading(true)

      try {
        const { answer, sources } = await fetchChatAnswer(text!)
        if (isStaleChatRequest(activeRequestRef.current, requestId)) {
          return
        }
        setMessages((current) => [
          ...current,
          createMessage('assistant', answer, sources),
        ])
      } catch (error) {
        if (isStaleChatRequest(activeRequestRef.current, requestId)) {
          return
        }
        setMessages((current) => [
          ...current,
          createMessage('assistant', chatErrorMessage(error)),
        ])
      } finally {
        if (!isStaleChatRequest(activeRequestRef.current, requestId)) {
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
