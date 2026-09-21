import { generateCv } from '../application/generateCv.js'
import { env } from '../config/env.js'
import { parseGenerationCount } from '../utils/parseGenerationCount.js'

async function main(): Promise<void> {
  const count = parseGenerationCount(process.argv[2], env.cvGenerationCount)

  console.log(`Generating ${count} CV(s) into ${env.cvOutputDir}`)

  for (let index = 1; index <= count; index += 1) {
    console.log(`[${index}/${count}] Generating…`)

    const generated = await generateCv()

    console.log(
      `[${index}/${count}] Saved ${generated.fileName} (${generated.profile.fullName})`,
    )
  }

  console.log('CV generation complete.')
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`CV generation failed: ${message}`)
  process.exitCode = 1
})
