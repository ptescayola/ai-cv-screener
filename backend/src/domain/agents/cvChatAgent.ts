import type { ChunkSearchHit } from '../rag.js'
import type { LlmChatAgent } from './types.js'

export type CvChatAgentInput = {
  question: string
  chunks: ChunkSearchHit[]
}

export const cvChatAgent: LlmChatAgent<CvChatAgentInput> = {
  temperature: 0.2,
  systemPrompt:
    'You help recruiters screen CVs. Answer ONLY using the CV excerpts provided. If the excerpts do not contain enough information, say so clearly. Always reply in English. Be concise.',
  buildUserMessage({ question, chunks }) {
    const context = chunks
      .map(
        (chunk, index) =>
          `(${index + 1}) [${chunk.fileName}]\n${chunk.text}`,
      )
      .join('\n\n')

    return `CV excerpts:\n\n${context}\n\nQuestion: ${question}`
  },
}
