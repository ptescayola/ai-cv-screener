type ChatResponseBody = {
  answer: string
  sources: Array<{ fileName: string }>
}

export async function fetchChatAnswer(
  message: string,
): Promise<{ answer: string; sources: string[] }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const body = (await response.json().catch(() => null)) as
    | ChatResponseBody
    | { error?: string }
    | null

  if (!response.ok) {
    const errorMessage =
      body && 'error' in body && body.error
        ? body.error
        : 'Chat request failed'
    throw new Error(errorMessage)
  }

  if (!body || !('answer' in body)) {
    throw new Error('Chat response was invalid')
  }

  return {
    answer: body.answer,
    sources: body.sources.map((source) => source.fileName),
  }
}
