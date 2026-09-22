import { resolveChatSources } from '@/application/resolveChatSources.js'
import { searchCvChunks } from '@/application/searchCvChunks.js'
import type { CvChatAnswer } from '@/domain/chat.js'
import { generateCvChatAnswer } from '@/infrastructure/openAiClient.js'

const RETRIEVAL_TOP_K = 5

export async function answerCvQuestion(question: string): Promise<CvChatAnswer> {
  const hits = await searchCvChunks(question, RETRIEVAL_TOP_K)

  if (hits.length === 0) {
    return {
      answer:
        'No CV data is indexed yet. Run npm run generate:cvs (or ingest:cvs) first.',
      sources: [],
    }
  }

  const { answer, citedFileNames } = await generateCvChatAnswer(question, hits)
  const sources = resolveChatSources(citedFileNames, hits)

  return { answer, sources }
}
