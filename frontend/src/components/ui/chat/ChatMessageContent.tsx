import {
  parseMarkdownBulletList,
  parseStringListAnswer,
  stripLeadingBulletPrefix,
} from '@/utils/string'

type ChatMessageContentProps = {
  content: string
}

function MessageList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-disc space-y-1 pl-4 text-[0.8125rem] leading-[1.55] marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  const jsonList = parseStringListAnswer(content)
  if (jsonList) {
    return <MessageList items={jsonList} />
  }

  const markdownList = parseMarkdownBulletList(content)
  if (markdownList) {
    return <MessageList items={markdownList} />
  }

  return (
    <p className="m-0 text-[0.8125rem] leading-[1.55] whitespace-pre-wrap">
      {stripLeadingBulletPrefix(content)}
    </p>
  )
}
