import type { FormEvent, KeyboardEvent } from 'react'
import type { ChatMessage } from '../modules/chat/model/chat'
import './Chat.css'

interface ChatProps {
  messages: ChatMessage[]
  draft: string
  isLoading: boolean
  onDraftChange: (value: string) => void
  onSend: () => void
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <li className={`chat-message chat-message--${message.role}`}>
      <span className="chat-message__label">
        {message.role === 'user' ? 'You' : 'Assistant'}
      </span>
      <p className="chat-message__content">{message.content}</p>
      {message.sources && message.sources.length > 0 ? (
        <p className="chat-message__sources">
          Sources: {message.sources.join(', ')}
        </p>
      ) : null}
    </li>
  )
}

export function Chat({
  messages,
  draft,
  isLoading,
  onDraftChange,
  onSend,
}: ChatProps) {
  const canSend = draft.trim().length > 0 && !isLoading

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canSend) {
      onSend()
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (canSend) {
        onSend()
      }
    }
  }

  return (
    <section className="chat" aria-label="CV screening chat">
      <div className="chat__messages" role="log" aria-live="polite">
        {messages.length === 0 && !isLoading ? (
          <p className="chat__empty">
            Ask a question about the CVs in your dataset, for example skills,
            experience, or location.
          </p>
        ) : (
          <ul className="chat__message-list">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading ? (
              <li className="chat-message chat-message--assistant chat-message--loading">
                <span className="chat-message__label">Assistant</span>
                <p className="chat-message__content">Thinking…</p>
              </li>
            ) : null}
          </ul>
        )}
      </div>

      <form className="chat__composer" onSubmit={handleSubmit}>
        <label className="chat__label" htmlFor="chat-input">
          Your question
        </label>
        <textarea
          id="chat-input"
          className="chat__input"
          rows={2}
          placeholder="Who has experience with TypeScript?"
          value={draft}
          disabled={isLoading}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="chat__actions">
          <span className="chat__hint">Enter to send · Shift+Enter for new line</span>
          <button type="submit" className="chat__send" disabled={!canSend}>
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  )
}
