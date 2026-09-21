import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import './ChatTextarea.css'

const MAX_HEIGHT_PX = 168

export interface ChatTextareaProps {
  id: string
  value: string
  placeholder?: string
  disabled?: boolean
  inputRef?: RefObject<HTMLTextAreaElement | null>
  onChange: (value: string) => void
  onEnterSubmit?: () => void
}

function resizeTextarea(element: HTMLTextAreaElement) {
  element.style.height = 'auto'
  const scrollHeight = element.scrollHeight
  const nextHeight = Math.min(scrollHeight, MAX_HEIGHT_PX)
  element.style.height = `${nextHeight}px`
  element.style.overflowY = scrollHeight > MAX_HEIGHT_PX ? 'auto' : 'hidden'
}

export function ChatTextarea({
  id,
  value,
  placeholder,
  disabled = false,
  inputRef,
  onChange,
  onEnterSubmit,
}: ChatTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function setTextareaRef(element: HTMLTextAreaElement | null) {
    textareaRef.current = element
    if (inputRef) {
      inputRef.current = element
    }
  }

  useLayoutEffect(() => {
    const element = textareaRef.current
    if (element) {
      resizeTextarea(element)
    }
  }, [value])

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onEnterSubmit?.()
    }
  }

  return (
    <textarea
      ref={setTextareaRef}
      id={id}
      className="chat-textarea"
      rows={1}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
