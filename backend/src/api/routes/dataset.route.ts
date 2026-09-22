import { Router } from 'express'
import { getDatasetStatus } from '@/application/getDatasetStatus.js'

export const datasetRouter = Router()

datasetRouter.get('/status', async (_req, res, next) => {
  try {
    const status = await getDatasetStatus()
    res.json(status)
  } catch (error) {
    next(error)
  }
})
