import { resolveChatSources } from '@/application/resolveChatSources.js'
import { searchCvChunks } from '@/application/searchCvChunks.js'
import type { CvChatAnswer } from '@/domain/chat.js'
import { generateCvChatAnswer } from '@/infrastructure/openAiClient.js'
import { isVectorIndexReady } from '@/infrastructure/vectorIndex.js'

const RETRIEVAL_TOP_K = 5

const NO_DATASET_ANSWER =
  'No CV data is indexed yet. From the repository root run: npm run generate:cvs'

export async function answerCvQuestion(question: string): Promise<CvChatAnswer> {
  if (!(await isVectorIndexReady())) {
    return { answer: NO_DATASET_ANSWER, sources: [] }
  }

  const hits = await searchCvChunks(question, RETRIEVAL_TOP_K)

  if (hits.length === 0) {
    return { answer: NO_DATASET_ANSWER, sources: [] }
  }

  const { answer, citedFileNames } = await generateCvChatAnswer(question, hits)
  const sources = resolveChatSources(citedFileNames, hits)

  return { answer, sources }
}
