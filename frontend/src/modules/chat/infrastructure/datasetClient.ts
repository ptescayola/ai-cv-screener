import { api } from '@/modules/chat/infrastructure/apiClient'

export type DatasetStatus = {
  ready: boolean
}

export async function fetchDatasetStatus(): Promise<DatasetStatus> {
  try {
    const { data } = await api.get<DatasetStatus>('/dataset/status')
    return typeof data.ready === 'boolean' ? data : { ready: false }
  } catch {
    return { ready: false }
  }
}
