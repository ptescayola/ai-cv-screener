import OpenAI from 'openai'
import type { CvGenerationBlueprint } from '../domain/cvBlueprint.js'
import type { CvProfile } from '../domain/cvProfile.js'
import { env } from '../config/env.js'
import { downloadImage } from '../utils/image.js'
import { parseCvProfile } from '../utils/text.js'

const client = new OpenAI({ apiKey: env.openAiApiKey })

const CV_PROFILE_SHAPE = {
  fullName: 'string',
  headline: 'string',
  email: 'string',
  phone: 'string',
  location: 'string',
  language: 'string',
  seniority: 'string',
  summary: 'string',
  skills: ['string'],
  experience: [
    {
      company: 'string',
      role: 'string',
      period: 'string',
      highlights: ['string'],
    },
  ],
  education: [
    {
      institution: 'string',
      degree: 'string',
      period: 'string',
    },
  ],
  photoDescription: 'string',
} as const

export async function generateCvProfile(
  blueprint: CvGenerationBlueprint,
): Promise<CvProfile> {
  const completion = await client.chat.completions.create({
    model: env.openAiTextModel,
    temperature: 0.9,
    messages: [
      {
        role: 'system',
        content:
          'You generate realistic but entirely fictional CV profiles for hiring demos. Never use real people or companies. Reply with a single JSON object only, without markdown fences.',
      },
      {
        role: 'user',
        content: [
          'Create one fake CV profile.',
          `Target role: ${blueprint.role}`,
          `Seniority: ${blueprint.seniority}`,
          `Primary CV language: ${blueprint.language}`,
          `Industry focus: ${blueprint.industry}`,
          'Include 3-5 skills, 2-3 jobs, 1-2 education entries.',
          'Write the CV content in the requested language.',
          'photoDescription must describe a professional headshot for image generation (appearance only, no names).',
          `Use this JSON shape:\n${JSON.stringify(CV_PROFILE_SHAPE, null, 2)}`,
        ].join('\n'),
      },
    ],
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI returned an empty CV text response')
  }

  return parseCvProfile(content)
}

export async function generateCvPhoto(profile: CvProfile): Promise<Buffer> {
  const image = await client.images.generate({
    model: env.openAiImageModel,
    prompt: [
      'Professional corporate headshot portrait for a CV.',
      profile.photoDescription,
      'Neutral background, realistic lighting, business attire, no text, no watermark.',
    ].join(' '),
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
