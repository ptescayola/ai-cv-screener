export type StoredChunkMetadata = {
  fileName: string
  text: string
} & Record<string, string | number | boolean>

export type IngestSummary = {
  pdfCount: number
  chunkCount: number
}

export type ChunkSearchHit = {
  score: number
  fileName: string
  text: string
}
