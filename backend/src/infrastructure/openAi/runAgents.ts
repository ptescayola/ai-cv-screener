import OpenAI from 'openai'
import type { LlmChatAgent, LlmImageAgent } from '@/domain/agents/types.js'
import { env } from '@/config/env.js'
import { downloadImage } from '@/utils/image.js'

const client = new OpenAI({ apiKey: env.openAiApiKey })

export async function runChatAgent<TInput>(
  agent: LlmChatAgent<TInput>,
  input: TInput,
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: env.openAiTextModel,
    temperature: agent.temperature,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: agent.buildUserMessage(input) },
    ],
  })

  const content = completion.choices[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('OpenAI returned an empty chat response')
  }

  return content
}

export async function runImageAgent<TInput>(
  agent: LlmImageAgent<TInput>,
  input: TInput,
): Promise<Buffer> {
  const image = await client.images.generate({
    model: env.openAiImageModel,
    prompt: agent.buildPrompt(input),
    size: env.openAiImageSize as OpenAI.Images.ImageGenerateParams['size'],
    quality: env.openAiImageQuality as OpenAI.Images.ImageGenerateParams['quality'],
  })

  const first = image.data?.[0]
  if (first?.b64_json) {
    return Buffer.from(first.b64_json, 'base64')
  }

  if (first?.url) {
    return downloadImage(first.url)
  }

  throw new Error('OpenAI returned no image data')
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return []
  }

  const response = await client.embeddings.create({
    model: env.openAiEmbeddingModel,
    input: texts,
  })

  return [...response.data]
    .sort((left, right) => left.index - right.index)
    .map((item) => item.embedding)
}
