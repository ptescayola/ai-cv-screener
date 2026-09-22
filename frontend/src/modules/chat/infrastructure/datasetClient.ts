export type DatasetStatus = {
  ready: boolean
}

export async function fetchDatasetStatus(): Promise<DatasetStatus> {
  try {
    const response = await fetch('/api/dataset/status')
    if (!response.ok) {
      return { ready: false }
    }

    const body = (await response.json()) as DatasetStatus
    return typeof body.ready === 'boolean' ? body : { ready: false }
  } catch {
    return { ready: false }
  }
}
