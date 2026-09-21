import { Fragment, type ReactNode } from 'react'
import './LightMarkdown.css'

type LightMarkdownProps = {
  content: string
  className?: string
}

const BULLET_LIST_RE = /^[-*]\s+/
const ORDERED_LIST_RE = /^\d+\.\s+/

function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const boldPattern = /\*\*(.+?)\*\*/g
  let lastIndex = 0

  for (const match of text.matchAll(boldPattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index))
    }
    parts.push(
      <strong key={`${index}-${match[1]}`}>{match[1]}</strong>,
    )
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''

    if (line.trim() === '') {
      index += 1
      continue
    }

    if (BULLET_LIST_RE.test(line)) {
      const items: string[] = []
      while (index < lines.length && BULLET_LIST_RE.test(lines[index] ?? '')) {
        items.push((lines[index] ?? '').replace(BULLET_LIST_RE, ''))
        index += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (ORDERED_LIST_RE.test(line)) {
      const items: string[] = []
      while (index < lines.length && ORDERED_LIST_RE.test(lines[index] ?? '')) {
        items.push((lines[index] ?? '').replace(ORDERED_LIST_RE, ''))
        index += 1
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length) {
      const paragraphLine = lines[index] ?? ''
      if (
        paragraphLine.trim() === '' ||
        BULLET_LIST_RE.test(paragraphLine) ||
        ORDERED_LIST_RE.test(paragraphLine)
      ) {
        break
      }
      paragraphLines.push(paragraphLine)
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') })
  }

  return blocks
}

export function LightMarkdown({ content, className }: LightMarkdownProps) {
  const blocks = parseBlocks(content)
  const classes = ['light-markdown', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {blocks.map((block, blockIndex) => {
        if (block.type === 'ul') {
          return (
            <ul key={blockIndex} className="light-markdown__list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ol') {
          return (
            <ol key={blockIndex} className="light-markdown__list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ol>
          )
        }

        return (
          <p key={blockIndex} className="light-markdown__paragraph">
            {block.text.split('\n').map((line, lineIndex, allLines) => (
              <Fragment key={lineIndex}>
                {parseInline(line)}
                {lineIndex < allLines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
