import { createRandomCvBlueprint } from '@/domain/cvBlueprint.js'
import type { GeneratedCv } from '@/domain/cvProfile.js'
import { env } from '@/config/env.js'
import { saveCvPdf } from '@/infrastructure/fsCvStorage.js'
import {
  generateCvPhoto,
  generateCvProfile,
} from '@/infrastructure/openAiClient.js'
import { renderCvPdf } from '@/infrastructure/pdfCvRender.js'

export async function generateCv(): Promise<GeneratedCv> {
  const blueprint = createRandomCvBlueprint()
  const profile = await generateCvProfile(blueprint)
  const photo = await generateCvPhoto(profile)
  const pdf = await renderCvPdf(profile, photo)

  return saveCvPdf(pdf, profile, env.cvOutputDir)
}
