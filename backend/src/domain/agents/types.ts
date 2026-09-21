export type LlmChatAgent<TInput> = {
  temperature: number
  systemPrompt: string
  buildUserMessage(input: TInput): string
}

export type LlmImageAgent<TInput> = {
  buildPrompt(input: TInput): string
}
