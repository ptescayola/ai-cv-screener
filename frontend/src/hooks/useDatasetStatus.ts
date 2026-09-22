import { useEffect, useState } from 'react'
import { fetchDatasetStatus } from '@/modules/chat/infrastructure/datasetClient'

export function useDatasetStatus() {
  const [ready, setReady] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    void fetchDatasetStatus().then((status) => {
      if (!cancelled) {
        setReady(status.ready)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (ready !== false) {
      return
    }

    const intervalId = window.setInterval(() => {
      void fetchDatasetStatus().then((status) => {
        setReady(status.ready)
      })
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [ready])

  return { datasetReady: ready }
}
