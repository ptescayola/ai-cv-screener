import {
  ClipboardDocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState } from 'react'
import avatarHuman from '@/assets/avatar-human.png'
import avatarRobot from '@/assets/avatar-robot.png'
import type { ChatRole } from '@/modules/chat/model/chat'
import { cvDownloadUrl } from '@/modules/chat/infrastructure/cvDownloadUrl'
import { formatMessageTime } from '@/utils/date'
import { stripPdfExtension } from '@/utils/string'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChatMessageContent } from '@/components/ui/chat/ChatMessageContent'
import { Skeleton } from '@/components/ui/Skeleton'

export interface ChatBubbleProps {
  role: ChatRole
  content?: string
  sources?: string[]
  loading?: boolean
  error?: boolean
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
  error = false,
  createdAt,
}: ChatBubbleProps) {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<number | null>(null)
  const canCopy =
    role === 'assistant' && !loading && !error && Boolean(content?.trim())

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
      className={cn(
        'max-w-[min(100%,30rem)] list-none',
        role === 'user' && 'self-end',
        role === 'assistant' && 'self-start',
      )}
    >
      <div
        className={cn(
          'flex items-end gap-2',
          role === 'user' && 'flex-row-reverse',
        )}
      >
        <img
          className={cn(
            'mb-[1.15rem] size-7 shrink-0 rounded-full object-cover motion-safe:animate-chat-avatar-in',
            role === 'user' ? 'origin-left' : 'origin-right',
          )}
          src={avatarForRole(role)}
          alt=""
        />
        <div
          className={cn(
            'flex min-w-0 flex-col gap-1',
            role === 'user' ? 'items-end' : 'flex-1',
          )}
        >
          <div
            className={cn(
              'relative flex flex-col gap-2 rounded-xl px-4 py-3 motion-safe:animate-chat-bubble-in',
              role === 'user' && 'bg-chat-user text-white',
              role === 'assistant' &&
                !error &&
                'border border-border bg-card text-foreground pr-18',
              role === 'assistant' &&
                error &&
                'border border-destructive/35 bg-destructive/10 text-destructive',
              loading && 'min-w-44',
            )}
          >
            <span className="sr-only">{ROLE_LABEL[role]}</span>
            {canCopy ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="absolute top-[0.35rem] right-[0.35rem] z-1 opacity-75 hover:opacity-100"
                title={copied ? 'Copied!' : 'Copy answer'}
                onClick={() => {
                  void handleCopy()
                }}
              >
                {copied ? (
                  <span className="font-semibold whitespace-nowrap">Copied!</span>
                ) : (
                  <ClipboardDocumentIcon />
                )}
              </Button>
            ) : null}
            {loading ? (
              <>
                <span className="sr-only">Assistant is preparing an answer</span>
                <div className="flex w-full min-w-36 flex-col gap-2">
                  <Skeleton className="h-2.25 w-full rounded-full" />
                  <Skeleton className="h-2.25 w-[78%] rounded-full" />
                  <Skeleton className="h-2.25 w-[52%] rounded-full" />
                </div>
              </>
            ) : (
              <>
                <ChatMessageContent content={content ?? ''} />
                {role === 'assistant' && sources && sources.length > 0 ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-[0.625rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                      Sources
                    </span>
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {sources.map((fileName) => (
                        <li key={fileName} className="max-w-full min-w-0">
                          <Badge
                            render={
                              <a
                                href={cvDownloadUrl(fileName)}
                                download={fileName}
                                title={fileName}
                              >
                                <DocumentTextIcon data-icon="inline-start" />
                                <span className="min-w-0 truncate">
                                  {stripPdfExtension(fileName)}
                                </span>
                              </a>
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
          {createdAt != null ? (
            <time
              className={cn(
                'w-full px-1 text-[0.6875rem] text-muted-foreground',
                role === 'user' ? 'self-start text-left' : 'text-right',
              )}
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
