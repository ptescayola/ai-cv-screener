import { LocalIndex } from 'vectra'
import type { ChunkSearchHit, StoredChunkMetadata } from '../domain/rag.js'
import { env } from '../config/env.js'

function openIndex(): LocalIndex<StoredChunkMetadata> {
  return new LocalIndex<StoredChunkMetadata>(env.vectorIndexDir)
}

export async function rebuildVectorIndex(
  items: Array<{ id: string; vector: number[]; metadata: StoredChunkMetadata }>,
): Promise<number> {
  const index = openIndex()

  if (await index.isIndexCreated()) {
    await index.deleteIndex()
  }

  await index.createIndex({
    version: 1,
    metadata_config: { indexed: ['fileName'] },
  })

  if (items.length > 0) {
    await index.batchInsertItems(items)
  }

  return items.length
}

export async function searchSimilarChunks(
  queryVector: number[],
  queryText: string,
  topK: number,
): Promise<ChunkSearchHit[]> {
  const index = openIndex()

  if (!(await index.isIndexCreated())) {
    throw new Error(
      `Vector index not found at ${env.vectorIndexDir}. Run ingest:cvs first.`,
    )
  }

  const results = await index.queryItems(queryVector, queryText, topK)

  return results.map((result) => ({
    score: result.score,
    fileName: result.item.metadata.fileName,
    text: result.item.metadata.text,
  }))
}
