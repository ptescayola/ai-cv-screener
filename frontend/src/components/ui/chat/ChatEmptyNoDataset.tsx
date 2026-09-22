import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyChatIcon } from '@/components/ui/chat/EmptyChatIcon'
import { GENERATE_CVS_COMMAND } from '@/constants/generateCvsCommand'

export function ChatEmptyNoDataset() {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current != null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(GENERATE_CVS_COMMAND)
      setCopied(true)
      if (copiedTimeoutRef.current != null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false)
        copiedTimeoutRef.current = null
      }, 3000)
    } catch {
      setCopied(false)
    }
  }, [])

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-6 text-center">
      <EmptyChatIcon className="opacity-[0.92]" />
      <div className="flex max-w-md flex-col gap-3">
        <p className="m-0 text-[0.9375rem] leading-normal text-muted-foreground">
          There are no CVs in the dataset yet. Generate PDFs and build the vector
          index from the repository root:
        </p>
        <div className="flex items-stretch gap-2 rounded-lg border border-border bg-muted/40 p-1 pl-3 text-left">
          <pre className="m-0 flex min-w-0 flex-1 items-center overflow-x-auto py-2 font-mono text-[0.8125rem] leading-none text-foreground">
            <code>{GENERATE_CVS_COMMAND}</code>
          </pre>
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="my-1 shrink-0 self-center"
            title={copied ? 'Copied!' : 'Copy command'}
            onClick={() => {
              void handleCopy()
            }}
          >
            {copied ? (
              <span className="font-semibold whitespace-nowrap">Copied!</span>
            ) : (
              <ClipboardDocumentIcon />
            )}
          </Button>
        </div>
        <p className="m-0 text-xs text-muted-foreground">
          Requires <code className="font-mono">OPENAI_API_KEY</code> in{' '}
          <code className="font-mono">.env</code>.
        </p>
        <p className="m-0 text-xs text-muted-foreground">
          This page refreshes automatically when the index is ready.
        </p>
      </div>
    </div>
  )
}
