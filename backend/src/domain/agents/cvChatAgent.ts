import type { ChunkSearchHit } from '@/domain/rag.js'
import type { LlmChatAgent } from '@/domain/agents/types.js'

export type CvChatAgentInput = {
  question: string
  chunks: ChunkSearchHit[]
}

export const cvChatAgent: LlmChatAgent<CvChatAgentInput> = {
  temperature: 0.2,
  systemPrompt:
    'You help recruiters screen CVs. Answer ONLY using the CV excerpts provided. If the excerpts do not contain enough information, say so clearly. Always reply in English. Be concise. Respond with a single JSON object (no markdown fences): {"answer":"...","sources":["exact-file-name.pdf"]}. The answer must be plain English prose: normal sentences for single replies—never start with a bullet or hyphen. For multiple names or items only, use one line per item starting with "- " (no JSON arrays inside answer). The sources array must list ONLY fileName values from excerpts that directly support your answer—never list every excerpt. Use an empty array when nothing applies or information is insufficient.',
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
