import type { CvGenerationBlueprint } from '@/domain/cvBlueprint.js'
import type { LlmChatAgent } from '@/domain/agents/types.js'

export const cvProfileJsonShape = {
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

export const cvProfileAgent: LlmChatAgent<CvGenerationBlueprint> = {
  temperature: 0.9,
  systemPrompt:
    'You generate realistic but entirely fictional CV profiles for hiring demos. Never use real people or companies. Reply with a single JSON object only, without markdown fences.',
  buildUserMessage(blueprint) {
    return [
      'Create one fake CV profile.',
      `Target role: ${blueprint.role}`,
      `Seniority: ${blueprint.seniority}`,
      `Primary CV language: ${blueprint.language}`,
      `Industry focus: ${blueprint.industry}`,
      'Include 3-5 skills, 2-3 jobs, 1-2 education entries.',
      `Write all CV content in ${blueprint.language}. Set the JSON "language" field to "${blueprint.language}".`,
      'photoDescription must describe a professional headshot for image generation (appearance only, no names).',
      `Use this JSON shape:\n${JSON.stringify(cvProfileJsonShape, null, 2)}`,
    ].join('\n')
  },
}
