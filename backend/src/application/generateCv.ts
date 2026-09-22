import { createRandomCvBlueprint } from '@/domain/cvBlueprint.js'
import type { CvGenerationBlueprint } from '@/domain/cvBlueprint.js'
import type { CvProfile, GeneratedCv } from '@/domain/cvProfile.js'
import { env } from '@/config/env.js'
import { saveCvPdf } from '@/infrastructure/fsCvStorage.js'
import {
  generateCvPhoto,
  generateCvProfile,
} from '@/infrastructure/openAiClient.js'
import { renderCvPdf } from '@/infrastructure/pdfCvRender.js'

export type GenerateCvDeps = {
  createBlueprint: () => CvGenerationBlueprint
  generateProfile: (blueprint: CvGenerationBlueprint) => Promise<CvProfile>
  generatePhoto: (profile: CvProfile) => Promise<Buffer>
  renderPdf: (profile: CvProfile, photo: Buffer) => Promise<Buffer>
  savePdf: (
    pdf: Buffer,
    profile: CvProfile,
    outputDir: string,
  ) => Promise<GeneratedCv>
  outputDir: string
}

export function createDefaultGenerateCvDeps(): GenerateCvDeps {
  return {
    createBlueprint: createRandomCvBlueprint,
    generateProfile: generateCvProfile,
    generatePhoto: generateCvPhoto,
    renderPdf: renderCvPdf,
    savePdf: saveCvPdf,
    outputDir: env.cvOutputDir,
  }
}

export async function generateCv(
  deps: GenerateCvDeps = createDefaultGenerateCvDeps(),
): Promise<GeneratedCv> {
  const blueprint = deps.createBlueprint()
  const profile = await deps.generateProfile(blueprint)
  const photo = await deps.generatePhoto(profile)
  const pdf = await deps.renderPdf(profile, photo)

  return deps.savePdf(pdf, profile, deps.outputDir)
}
