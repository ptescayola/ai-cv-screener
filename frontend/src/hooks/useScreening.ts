import { useCallback, useState } from 'react'
import type { Candidate, ScreeningResult, ScreeningStatus } from '../types'

export function useScreening() {
  const [status, setStatus] = useState<ScreeningStatus>('idle')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [results, setResults] = useState<ScreeningResult[]>([])

  const reset = useCallback(() => {
    setStatus('idle')
    setCandidates([])
    setResults([])
  }, [])

  return { status, candidates, results, reset }
}
