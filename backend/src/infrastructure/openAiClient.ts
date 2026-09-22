import type { CvGenerationBlueprint } from '@/domain/cvBlueprint.js'
import type { CvProfile } from '@/domain/cvProfile.js'
import type { ChunkSearchHit } from '@/domain/rag.js'
import {
  cvChatAgent,
  cvPhotoAgent,
  cvProfileAgent,
} from '@/domain/agents/index.js'
import { parseCvProfile } from '@/utils/text.js'
import {
  embedTexts,
  runChatAgent,
  runImageAgent,
} from '@/infrastructure/openAi/runAgents.js'

export async function generateCvProfile(
  blueprint: CvGenerationBlueprint,
): Promise<CvProfile> {
  const content = await runChatAgent(cvProfileAgent, blueprint)
  return parseCvProfile(content)
}

export async function generateCvPhoto(profile: CvProfile): Promise<Buffer> {
  return runImageAgent(cvPhotoAgent, profile.photoDescription)
}

export type CvChatModelResult = {
  answer: string
  citedFileNames: string[]
}

export async function generateCvChatAnswer(
  question: string,
  chunks: ChunkSearchHit[],
): Promise<CvChatModelResult> {
  const content = await runChatAgent(cvChatAgent, { question, chunks })
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('Chat model returned invalid JSON')
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Chat model returned invalid JSON')
  }

  const record = parsed as { answer?: unknown; sources?: unknown }
  const answer =
    typeof record.answer === 'string' ? record.answer.trim() : ''
  if (!answer) {
    throw new Error('Chat model returned an empty answer')
  }

  const citedFileNames = Array.isArray(record.sources)
    ? record.sources.filter(
        (item): item is string => typeof item === 'string',
      )
    : []

  return { answer, citedFileNames }
}

export { embedTexts }
