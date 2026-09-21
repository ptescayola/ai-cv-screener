import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { saveCvPdf } from './fsCvStorage.js'
import { sampleCvProfile } from '../test/fixtures.js'

describe('saveCvPdf', () => {
  it('writes a PDF file to the output directory', async () => {
    const outputDir = await mkdtemp(path.join(tmpdir(), 'cv-screener-test-'))

    try {
      const pdf = Buffer.from('%PDF-test')
      const saved = await saveCvPdf(pdf, sampleCvProfile, outputDir)

      assert.match(saved.fileName, /^ada-lovelace-.+\.pdf$/)
      assert.deepEqual(await readFile(saved.filePath), pdf)
    } finally {
      await rm(outputDir, { recursive: true, force: true })
    }
  })
})
