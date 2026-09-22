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

  const answer = await generateCvChatAnswer(question, hits)
  const sources = [...new Set(hits.map((hit) => hit.fileName))].map(
    (fileName) => ({ fileName }),
  )

  return { answer, sources }
}
