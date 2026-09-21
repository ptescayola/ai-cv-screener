import type { CSSProperties } from 'react'
import emptyChatSrc from '../assets/empty-chat.png'
import './EmptyChatIcon.css'

type EmptyChatIconProps = {
  className?: string
  title?: string
}

export function EmptyChatIcon({
  className,
  title = 'No messages yet',
}: EmptyChatIconProps) {
  const classes = ['empty-chat-icon', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      role="img"
      aria-label={title}
      style={
        {
          '--empty-chat-mask': `url(${emptyChatSrc})`,
        } as CSSProperties
      }
    />
  )
}
