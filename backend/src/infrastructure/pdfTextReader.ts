import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const require = createRequire(import.meta.url)

const standardFontDataUrl = `${path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts',
)}${path.sep}`

function pageText(items: unknown[]): string {
  const parts: string[] = []

  for (const item of items) {
    if (
      item &&
      typeof item === 'object' &&
      'str' in item &&
      typeof item.str === 'string' &&
      item.str
    ) {
      parts.push(item.str)
    }
  }

  return parts.join(' ')
}

export async function extractPdfEmbeddedText(filePath: string): Promise<string> {
  const bytes = new Uint8Array(await readFile(filePath))
  const document = await getDocument({
    data: bytes,
    standardFontDataUrl,
    useSystemFonts: true,
  }).promise

  const pageTexts: string[] = []

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    pageTexts.push(pageText(content.items))
  }

  await document.destroy()

  return pageTexts.join('\n\n')
}
