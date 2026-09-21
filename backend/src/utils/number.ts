const MIN_COUNT = 1
const MAX_COUNT = 30

export function parseGenerationCount(
  raw: string | undefined,
  defaultCount: number,
): number {
  const parsed = Number(raw ?? defaultCount)

  if (!Number.isInteger(parsed) || parsed < MIN_COUNT || parsed > MAX_COUNT) {
    throw new Error(
      `CV count must be an integer between ${MIN_COUNT} and ${MAX_COUNT}`,
    )
  }

  return parsed
}
