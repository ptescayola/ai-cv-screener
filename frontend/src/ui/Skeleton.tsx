import './Skeleton.css'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  const classes = ['skeleton', className].filter(Boolean).join(' ')
  return <span className={classes} aria-hidden="true" />
}

export function SkeletonChatReply() {
  return (
    <div className="skeleton-chat-reply" aria-hidden="true">
      <Skeleton className="skeleton-chat-reply__line" />
      <Skeleton className="skeleton-chat-reply__line skeleton-chat-reply__line--medium" />
      <Skeleton className="skeleton-chat-reply__line skeleton-chat-reply__line--short" />
    </div>
  )
}
