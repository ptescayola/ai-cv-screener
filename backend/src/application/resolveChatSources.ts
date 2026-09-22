import type { ChatSource } from '@/domain/chat.js'
import type { ChunkSearchHit } from '@/domain/rag.js'

export function resolveChatSources(
  citedFileNames: string[],
  hits: ChunkSearchHit[],
): ChatSource[] {
  const allowed = new Set(hits.map((hit) => hit.fileName))
  const seen = new Set<string>()
  const sources: ChatSource[] = []

  for (const name of citedFileNames) {
    const fileName = name.trim()
    if (!fileName || !allowed.has(fileName) || seen.has(fileName)) {
      continue
    }
    seen.add(fileName)
    sources.push({ fileName })
  }

  return sources
}
