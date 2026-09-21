import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { chatThreadKey } from '../modules/chat/application/chatThreadKey'
import { isNearChatBottom } from '../modules/chat/application/scrollMetrics'
import type { ChatMessage } from '../modules/chat/model/chat'

function isNearBottom(element: HTMLElement): boolean {
  return isNearChatBottom(
    element.scrollHeight,
    element.scrollTop,
    element.clientHeight,
  )
}

function scrollToBottom(element: HTMLElement, smooth: boolean) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
  })
}

export function useChatScroll(
  messages: ChatMessage[],
  isLoading: boolean,
  draft: string,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinnedToBottomRef = useRef(true)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const key = chatThreadKey(messages, isLoading)

  const jumpToLatest = useCallback(() => {
    const node = containerRef.current
    if (!node) {
      return
    }
    pinnedToBottomRef.current = true
    scrollToBottom(node, true)
    setShowJumpToLatest(false)
  }, [])

  const handleScroll = useCallback(() => {
    const node = containerRef.current
    if (!node || draft.trim()) {
      return
    }

    const atBottom = isNearBottom(node)
    pinnedToBottomRef.current = atBottom
    setShowJumpToLatest(!atBottom)
  }, [draft])

  useLayoutEffect(() => {
    const node = containerRef.current
    if (!node || messages.length === 0) {
      pinnedToBottomRef.current = true
      setShowJumpToLatest(false)
      return
    }

    if (draft.trim()) {
      scrollToBottom(node, false)
      return
    }

    if (!pinnedToBottomRef.current) {
      setShowJumpToLatest(true)
      return
    }

    scrollToBottom(node, false)
  }, [key, draft, messages.length])

  return {
    containerRef,
    showJumpToLatest,
    handleScroll,
    jumpToLatest,
  }
}
