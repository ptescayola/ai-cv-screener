import type { CvChatAnswer } from '../model/chat'
import { postChatMessage } from '../infrastructure/chatClient'

export async function askCvQuestion(question: string): Promise<CvChatAnswer> {
  const response = await postChatMessage(question)

  return {
    answer: response.answer,
    sources: response.sources.map((source) => source.fileName),
  }
}
