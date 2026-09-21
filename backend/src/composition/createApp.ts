import cors from 'cors'
import express from 'express'
import { chatRouter } from '../api/routes/chat.route.js'
import { cvsRouter } from '../api/routes/cvs.route.js'
import { errorMiddleware } from '../api/middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/chat', chatRouter)
  app.use('/cvs', cvsRouter)

  app.use(errorMiddleware)

  return app
}
