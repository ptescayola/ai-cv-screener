import cors from 'cors'
import express from 'express'
import { errorMiddleware } from '../api/middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use(errorMiddleware)

  return app
}
