import type { LlmImageAgent } from './types.js'

export const cvPhotoAgent: LlmImageAgent<string> = {
  buildPrompt(photoDescription) {
    return [
      'Professional corporate headshot portrait for a CV.',
      photoDescription,
      'Neutral background, realistic lighting, business attire, no text, no watermark.',
    ].join(' ')
  },
}
