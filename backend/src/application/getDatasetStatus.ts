import { isVectorIndexReady } from '@/infrastructure/vectorIndex.js'

export type DatasetStatus = {
  ready: boolean
}

export async function getDatasetStatus(): Promise<DatasetStatus> {
  return { ready: await isVectorIndexReady() }
}
