import path from 'node:path'
import type { IngestSummary, StoredChunkMetadata } from '@/domain/rag.js'
import { env } from '@/config/env.js'
import { listCvPdfFiles } from '@/infrastructure/fsCvStorage.js'
import { extractPdfEmbeddedText } from '@/infrastructure/pdfTextReader.js'
import { embedTexts } from '@/infrastructure/openAiClient.js'
import { rebuildVectorIndex } from '@/infrastructure/vectorIndex.js'
import { chunkText } from '@/utils/text.js'

export async function ingestCvs(): Promise<IngestSummary> {
  const pdfPaths = await listCvPdfFiles(env.cvOutputDir)

  if (pdfPaths.length === 0) {
    throw new Error(
      `No PDFs found in ${env.cvOutputDir}. Run npm run generate:cvs first.`,
    )
  }

  const rows: Array<{ id: string; metadata: StoredChunkMetadata }> = []

  for (const pdfPath of pdfPaths) {
    const fileName = path.basename(pdfPath)
    const documentText = await extractPdfEmbeddedText(pdfPath)

    for (const [chunkIndex, text] of chunkText(documentText).entries()) {
      rows.push({
        id: `${fileName}::${chunkIndex}`,
        metadata: { fileName, text },
      })
    }
  }

  if (rows.length === 0) {
    throw new Error('No text extracted from PDFs.')
  }

  const vectors = await embedTexts(rows.map((row) => row.metadata.text))

  const items = rows.map((row, index) => ({
    id: row.id,
    vector: vectors[index]!,
    metadata: row.metadata,
  }))

  const chunkCount = await rebuildVectorIndex(items)

  return { pdfCount: pdfPaths.length, chunkCount }
}
