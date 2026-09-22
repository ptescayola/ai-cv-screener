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

export async function generateCvChatAnswer(
  question: string,
  chunks: ChunkSearchHit[],
): Promise<string> {
  return runChatAgent(cvChatAgent, { question, chunks })
}

export { embedTexts }
