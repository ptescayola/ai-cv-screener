import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ingestCvs, type IngestCvsDeps } from '@/application/ingestCvs.js'

function createDeps(
  overrides: Partial<IngestCvsDeps> = {},
): IngestCvsDeps {
  return {
    outputDir: '/cvs',
    listPdfFiles: async () => ['/cvs/a.pdf'],
    readPdfText: async () => 'Backend engineer with TypeScript experience.',
    embedTexts: async (texts) => texts.map(() => [0.1, 0.2]),
    rebuildIndex: async () => 1,
    ...overrides,
  }
}

describe('ingestCvs', () => {
  it('throws when the output directory has no PDFs', async () => {
    await assert.rejects(
      () =>
        ingestCvs(
          createDeps({
            listPdfFiles: async () => [],
          }),
        ),
      /No PDFs found in \/cvs/,
    )
  })

  it('throws when PDFs contain no extractable text', async () => {
    await assert.rejects(
      () =>
        ingestCvs(
          createDeps({
            readPdfText: async () => '   ',
          }),
        ),
      /No text extracted from PDFs/,
    )
  })

  it('chunks PDFs, embeds text, and rebuilds the index', async () => {
    let embeddedTexts: string[] = []
    let indexedItems: Array<{ id: string; metadata: { fileName: string } }> =
      []

    const summary = await ingestCvs(
      createDeps({
        listPdfFiles: async () => ['/cvs/jane.pdf', '/cvs/john.pdf'],
        readPdfText: async (pdfPath) =>
          pdfPath.endsWith('jane.pdf')
            ? 'Jane knows TypeScript.'
            : 'John knows marketing.',
        embedTexts: async (texts) => {
          embeddedTexts = texts
          return texts.map((_, index) => [index, index + 0.5])
        },
        rebuildIndex: async (items) => {
          indexedItems = items.map((item) => ({
            id: item.id,
            metadata: { fileName: item.metadata.fileName },
          }))
          return items.length
        },
      }),
    )

    assert.deepEqual(summary, { pdfCount: 2, chunkCount: 2 })
    assert.deepEqual(embeddedTexts, [
      'Jane knows TypeScript.',
      'John knows marketing.',
    ])
    assert.deepEqual(indexedItems, [
      { id: 'jane.pdf::0', metadata: { fileName: 'jane.pdf' } },
      { id: 'john.pdf::0', metadata: { fileName: 'john.pdf' } },
    ])
  })
})
