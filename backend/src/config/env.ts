import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const backendDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

dotenv.config({ path: path.join(backendDir, '.env') })

function fromBackend(relativePath: string): string {
  return path.resolve(backendDir, relativePath)
}

export const env = {
  port: Number(process.env.PORT),
  openAiApiKey: process.env.OPENAI_API_KEY!,
  openAiTextModel: process.env.OPENAI_TEXT_MODEL!,
  openAiImageModel: process.env.OPENAI_IMAGE_MODEL!,
  openAiImageQuality: process.env.OPENAI_IMAGE_QUALITY!,
  openAiImageSize: process.env.OPENAI_IMAGE_SIZE!,
  cvOutputDir: fromBackend(process.env.CV_OUTPUT_DIR!),
  cvGenerationCount: Number(process.env.CV_GENERATION_COUNT),
}
