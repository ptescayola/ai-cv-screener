import { CHAT_PROMPT_SUGGESTIONS } from '../constants/chatPromptSuggestions'
import './ChatPromptSuggestions.css'

type ChatPromptSuggestionsProps = {
  disabled?: boolean
  onSelect: (prompt: string) => void
}

export function ChatPromptSuggestions({
  disabled = false,
  onSelect,
}: ChatPromptSuggestionsProps) {
  return (
    <ul className="chat-prompt-suggestions">
      {CHAT_PROMPT_SUGGESTIONS.map((prompt) => (
        <li key={prompt}>
          <button
            type="button"
            className="chat-prompt-suggestions__button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </button>
        </li>
      ))}
    </ul>
  )
}
