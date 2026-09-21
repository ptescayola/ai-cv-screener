import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, type SubmitEvent } from 'react'
import { useChatScroll } from '../hooks/useChatScroll'
import type { ChatMessage } from '../modules/chat/model/chat'
import { ChatBubble } from '../ui/ChatBubble'
import { ChatPromptSuggestions } from '../ui/ChatPromptSuggestions'
import { ChatTextarea } from '../ui/ChatTextarea'
import { EmptyChatIcon } from '../ui/EmptyChatIcon'
import './Chat.css'

interface ChatProps {
  messages: ChatMessage[]
  draft: string
  isLoading: boolean
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
}: ChatProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const { containerRef, showJumpToLatest, handleScroll, jumpToLatest } =
    useChatScroll(messages, isLoading, draft)

  useEffect(() => {
    if (!isLoading) {
      composerRef.current?.focus()
    }
  }, [isLoading])

  const canSend = draft.trim().length > 0 && !isLoading
  const isEmpty = messages.length === 0 && !isLoading

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canSend) {
      onSend()
    }
  }

  return (
    <section className="chat" aria-label="CV screening chat">
      {messages.length > 0 ? (
        <div className="chat__toolbar">
          <button
            type="button"
            className="chat__reset"
            onClick={onReset}
          >
            <ArrowPathIcon className="chat__reset-icon" aria-hidden="true" />
            New chat
          </button>
        </div>
      ) : null}

      <div className="chat__messages-wrap">
        <div
          ref={containerRef}
          className="chat__messages scroll-area"
          role="log"
          aria-live="polite"
          onScroll={handleScroll}
        >
          {isEmpty ? (
            <div className="chat__empty">
              <EmptyChatIcon className="chat__empty-icon" />
              <p className="chat__empty-text">
                Ask about the CVs in the dataset, or try a suggestion:
              </p>
              <ChatPromptSuggestions
                disabled={isLoading}
                onSelect={(prompt) => onSend(prompt)}
              />
            </div>
          ) : (
            <ul className="chat__message-list">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
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
          <button
            type="button"
            className="chat__jump-latest"
            onClick={jumpToLatest}
          >
            View latest message ↓
          </button>
        ) : null}
      </div>

      <form className="chat__composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Your question
        </label>
        <ChatTextarea
          id="chat-input"
          inputRef={composerRef}
          placeholder="Who has experience with TypeScript?"
          value={draft}
          disabled={isLoading}
          onChange={onDraftChange}
          onEnterSubmit={() => {
            if (canSend) {
              onSend()
            }
          }}
        />
        <div className="chat__actions">
          <span className="chat__hint">
            Enter to send · Shift+Enter for new line
          </span>
          <button type="submit" className="chat__send" disabled={!canSend}>
            <PaperAirplaneIcon className="chat__send-icon" aria-hidden="true" />
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  )
}
