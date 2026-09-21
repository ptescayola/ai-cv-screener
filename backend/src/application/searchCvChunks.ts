import type { ChunkSearchHit } from '../domain/rag.js'
import { embedTexts } from '../infrastructure/openAiClient.js'
import { searchSimilarChunks } from '../infrastructure/vectorIndex.js'

export async function searchCvChunks(
  query: string,
  topK = 5,
): Promise<ChunkSearchHit[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const [queryVector] = await embedTexts([trimmed])
  if (!queryVector) {
    throw new Error('OpenAI returned no embedding for the query')
  }

  return searchSimilarChunks(queryVector, trimmed, topK)
}
