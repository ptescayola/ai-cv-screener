import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseGenerationCount } from '@/utils/number.js'

export const backendDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

export const repoRoot = path.resolve(backendDir, '..')

dotenv.config({ path: path.join(repoRoot, '.env') })

function fromBackend(relativePath: string): string {
  return path.resolve(backendDir, relativePath)
}

export const env = {
  port: Number(process.env.PORT),
  openAiApiKey: process.env.OPENAI_API_KEY!,
  openAiTextModel: process.env.OPENAI_TEXT_MODEL!,
  openAiEmbeddingModel:
    process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
  openAiImageModel: process.env.OPENAI_IMAGE_MODEL!,
  openAiImageQuality: process.env.OPENAI_IMAGE_QUALITY!,
  openAiImageSize: process.env.OPENAI_IMAGE_SIZE!,
  cvOutputDir: fromBackend(process.env.CV_OUTPUT_DIR ?? './data/cvs'),
  cvGenerationCount: parseGenerationCount(process.env.CV_GENERATION_COUNT, 10),
  vectorIndexDir: fromBackend(
    process.env.VECTOR_INDEX_DIR ?? './data/vector-index',
  ),
}
