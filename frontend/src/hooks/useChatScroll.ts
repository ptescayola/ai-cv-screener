import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../modules/chat/model/chat'

const BOTTOM_THRESHOLD_PX = 64

function isNearBottom(element: HTMLElement): boolean {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    BOTTOM_THRESHOLD_PX
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

function threadKey(messages: ChatMessage[], isLoading: boolean): string {
  const last = messages.at(-1)
  return `${messages.length}:${last?.id ?? 'none'}:${isLoading ? 1 : 0}`
}

export function useChatScroll(
  messages: ChatMessage[],
  isLoading: boolean,
  draft: string,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinnedToBottomRef = useRef(true)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const key = threadKey(messages, isLoading)

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
