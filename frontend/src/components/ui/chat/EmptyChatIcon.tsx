import type { CSSProperties } from 'react'
import emptyChatSrc from '@/assets/empty-chat.png'
import './EmptyChatIcon.css'

type EmptyChatIconProps = {
  className?: string
}

export function EmptyChatIcon({ className }: EmptyChatIconProps) {
  const classes = ['empty-chat-icon', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={
        {
          '--empty-chat-mask': `url(${emptyChatSrc})`,
        } as CSSProperties
      }
    />
  )
}
