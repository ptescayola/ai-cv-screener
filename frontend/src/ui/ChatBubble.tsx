import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState } from 'react'
import avatarHuman from '@/assets/avatar-human.png'
import avatarRobot from '@/assets/avatar-robot.png'
import type { ChatRole } from '@/modules/chat/model/chat'
import { formatMessageTime } from '@/utils/date'
import { LightMarkdown } from '@/ui/LightMarkdown'
import { SkeletonChatReply } from '@/ui/Skeleton'
import { SourceChips } from '@/ui/SourceChips'
import './ChatBubble.css'

export interface ChatBubbleProps {
  role: ChatRole
  content?: string
  sources?: string[]
  loading?: boolean
  createdAt?: number
}

const ROLE_LABEL: Record<ChatRole, string> = {
  user: 'You',
  assistant: 'Assistant',
}

function avatarForRole(role: ChatRole): string {
  return role === 'user' ? avatarHuman : avatarRobot
}

export function ChatBubble({
  role,
  content,
  sources,
  loading = false,
  createdAt,
}: ChatBubbleProps) {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<number | null>(null)
  const canCopy =
    role === 'assistant' && !loading && Boolean(content?.trim())

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current != null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (!content) {
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      if (copiedTimeoutRef.current != null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false)
        copiedTimeoutRef.current = null
      }, 3000)
    } catch {
      setCopied(false)
    }
  }, [content])

  return (
    <li
      className={`chat-bubble chat-bubble--${role}${loading ? ' chat-bubble--loading' : ''}`}
    >
      <div className="chat-bubble__row">
        <img
          className="chat-bubble__avatar"
          src={avatarForRole(role)}
          alt=""
          aria-hidden="true"
        />
        <div className="chat-bubble__body">
          <div className="chat-bubble__panel">
            <span className="sr-only">{ROLE_LABEL[role]}</span>
            {canCopy ? (
              <button
                type="button"
                className="chat-bubble__copy"
                aria-label={copied ? 'Answer copied' : 'Copy answer'}
                title={copied ? 'Copied!' : 'Copy answer'}
                onClick={() => {
                  void handleCopy()
                }}
              >
                {copied ? (
                  <span className="chat-bubble__copy-label">Copied!</span>
                ) : (
                  <ClipboardDocumentIcon aria-hidden="true" />
                )}
              </button>
            ) : null}
            {loading ? (
              <>
                <span className="sr-only">Assistant is preparing an answer</span>
                <SkeletonChatReply />
              </>
            ) : role === 'assistant' ? (
              <>
                <LightMarkdown
                  content={content ?? ''}
                  className="chat-bubble__content"
                />
                {sources && sources.length > 0 ? (
                  <SourceChips sources={sources} />
                ) : null}
              </>
            ) : (
              <p className="chat-bubble__content">{content}</p>
            )}
          </div>
          {createdAt != null ? (
            <time
              className="chat-bubble__time"
              dateTime={new Date(createdAt).toISOString()}
            >
              {formatMessageTime(createdAt)}
            </time>
          ) : null}
        </div>
      </div>
    </li>
  )
}
