import type { CvProfile } from '../domain/cvProfile.js'
import { extractJsonPayload } from './json.js'

export function parseCvProfile(raw: string): CvProfile {
  const parsed = JSON.parse(extractJsonPayload(raw)) as CvProfile

  if (!parsed.fullName || !parsed.headline) {
    throw new Error('OpenAI returned an invalid CV profile payload')
  }

  return parsed
}
