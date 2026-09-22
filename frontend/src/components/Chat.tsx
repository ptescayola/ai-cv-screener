import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, type SubmitEvent } from 'react'
import { useChatScroll } from '@/hooks/useChatScroll'
import type { ChatMessage } from '@/modules/chat/model/chat'
import { CHAT_PROMPT_SUGGESTIONS } from '@/constants/chatPromptSuggestions'
import { Button } from '@/components/ui/Button'
import { ChatBubble } from '@/components/ui/chat/ChatBubble'
import { ChatTextarea } from '@/components/ui/chat/ChatTextarea'
import { ChatEmptyNoDataset } from '@/components/ui/chat/ChatEmptyNoDataset'
import { EmptyChatIcon } from '@/components/ui/chat/EmptyChatIcon'

interface ChatProps {
  messages: ChatMessage[]
  draft: string
  isLoading: boolean
  datasetReady: boolean | null
  onDraftChange: (value: string) => void
  onSend: (text?: string) => void
  onReset: () => void
}

export function Chat({
  messages,
  draft,
  isLoading,
  onDraftChange,
  onSend,
  onReset,
  datasetReady,
}: ChatProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const { containerRef, showJumpToLatest, handleScroll, jumpToLatest } =
    useChatScroll(messages, isLoading, draft)

  useEffect(() => {
    if (!isLoading) {
      composerRef.current?.focus()
    }
  }, [isLoading])

  const chatEnabled = datasetReady === true
  const canSend = chatEnabled && draft.trim().length > 0 && !isLoading
  const isEmpty = messages.length === 0 && !isLoading

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canSend) {
      onSend()
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
      {messages.length > 0 ? (
        <div className="flex min-h-5 shrink-0 justify-end">
          <Button type="button" variant="ghost" size="xs" onClick={onReset}>
            <ArrowPathIcon />
            New chat
          </Button>
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={containerRef}
          className="scroll-area min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1 motion-safe:scroll-smooth"
          role="log"
          onScroll={handleScroll}
        >
          {isEmpty ? (
            datasetReady === false ? (
              <ChatEmptyNoDataset />
            ) : datasetReady === null ? (
              <div className="flex min-h-full items-center justify-center px-4 py-6">
                <p className="m-0 text-sm text-muted-foreground">
                  Checking dataset…
                </p>
              </div>
            ) : (
              <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-6 text-center">
                <EmptyChatIcon className="opacity-[0.92]" />
                <p className="m-0 max-w-[32ch] text-[0.9375rem] leading-normal text-muted-foreground">
                  Ask about the CVs in the dataset, or try a suggestion:
                </p>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {CHAT_PROMPT_SUGGESTIONS.map((prompt) => (
                    <li key={prompt}>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={isLoading}
                        onClick={() => onSend(prompt)}
                      >
                        {prompt}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ) : (
            <ul className="m-0 flex list-none flex-col gap-6 px-1 pt-2 pb-3">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                  error={message.error}
                  createdAt={message.createdAt}
                />
              ))}
              {isLoading ? (
                <ChatBubble role="assistant" loading />
              ) : null}
            </ul>
          )}
        </div>

        {showJumpToLatest ? (
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="absolute bottom-3 left-1/2 z-5 -translate-x-1/2"
            onClick={jumpToLatest}
          >
            View latest message ↓
          </Button>
        ) : null}
      </div>

      <form
        className="flex shrink-0 flex-col gap-2 border-t border-border pt-3"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="chat-input">
          Your question
        </label>
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <ChatTextarea
              id="chat-input"
              inputRef={composerRef}
              placeholder={
                chatEnabled
                  ? 'Who has experience with TypeScript?'
                  : 'Generate CVs first (see above)'
              }
              value={draft}
              disabled={!chatEnabled || isLoading}
              onChange={onDraftChange}
              onEnterSubmit={() => {
                if (canSend) {
                  onSend()
                }
              }}
            />
          </div>
          <Button
            type="submit"
            size="default"
            className="h-10 min-h-10 w-auto min-w-min shrink-0"
            disabled={!canSend}
          >
            <PaperAirplaneIcon />
            Send
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          Enter to send · Shift+Enter for new line
        </span>
      </form>
    </section>
  )
}
