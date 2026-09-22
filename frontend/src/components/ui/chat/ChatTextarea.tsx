import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { Textarea } from '@/components/ui/Textarea'

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

const chatTextareaClassName =
  'min-h-[2.5rem] max-h-[10.5rem] resize-none overflow-y-hidden border-border bg-background px-3 py-2 text-xs leading-normal text-foreground placeholder:text-muted-foreground focus-visible:border-border focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 disabled:opacity-70'

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
    <Textarea
      ref={setTextareaRef}
      id={id}
      className={chatTextareaClassName}
      rows={1}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
