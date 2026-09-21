import { ingestCvs } from '../application/ingestCvs.js'
import { env } from '../config/env.js'

async function main(): Promise<void> {
  console.log(`Ingesting CVs from ${env.cvOutputDir}…`)

  const { pdfCount, chunkCount } = await ingestCvs()

  console.log(
    `Done: ${pdfCount} PDF(s), ${chunkCount} chunk(s) in ${env.vectorIndexDir}`,
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`Ingest failed: ${message}`)
  process.exitCode = 1
})
