import type { CvProfile } from '@/domain/cvProfile.js'

const DEFAULT_CHUNK_MAX_CHARS = 900
const DEFAULT_CHUNK_OVERLAP = 150

export function extractJsonPayload(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('```')) {
    return trimmed
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

export function chunkText(
  text: string,
  maxChars = DEFAULT_CHUNK_MAX_CHARS,
  overlap = DEFAULT_CHUNK_OVERLAP,
): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return []
  }

  if (normalized.length <= maxChars) {
    return [normalized]
  }

  const chunks: string[] = []
  let start = 0

  while (start < normalized.length) {
    let end = Math.min(start + maxChars, normalized.length)

    if (end < normalized.length) {
      const slice = normalized.slice(start, end)
      const lastSpace = slice.lastIndexOf(' ')
      if (lastSpace > maxChars * 0.5) {
        end = start + lastSpace
      }
    }

    const piece = normalized.slice(start, end).trim()
    if (piece) {
      chunks.push(piece)
    }

    if (end >= normalized.length) {
      break
    }

    start = Math.max(end - overlap, start + 1)
  }

  return chunks
}

export function parseCvProfile(raw: string): CvProfile {
  const parsed = JSON.parse(extractJsonPayload(raw)) as CvProfile

  if (!parsed.fullName || !parsed.headline) {
    throw new Error('OpenAI returned an invalid CV profile payload')
  }

  return parsed
}
