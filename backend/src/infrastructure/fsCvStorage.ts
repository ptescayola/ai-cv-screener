import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { CvProfile, GeneratedCv } from '@/domain/cvProfile.js'
import { slugify } from '@/utils/string.js'

export async function listCvPdfFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })

  return entries
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'),
    )
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

export async function saveCvPdf(
  pdf: Buffer,
  profile: CvProfile,
  outputDir: string,
): Promise<GeneratedCv> {
  await mkdir(outputDir, { recursive: true })

  const id = randomUUID()
  const fileName = `${slugify(profile.fullName)}-${id.slice(0, 8)}.pdf`
  const filePath = path.join(outputDir, fileName)

  await writeFile(filePath, pdf)

  return {
    id,
    fileName,
    filePath,
    profile,
    createdAt: new Date().toISOString(),
  }
}
