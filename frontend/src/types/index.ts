export type ScreeningStatus = 'idle' | 'processing' | 'done' | 'error'

export interface Candidate {
  id: string
  name: string
  fileName: string
}

export interface ScreeningResult {
  candidateId: string
  score: number
  summary: string
}
