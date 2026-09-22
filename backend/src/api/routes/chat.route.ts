import { Router } from 'express'
import { answerCvQuestion } from '@/application/answerCvQuestion.js'
import { HttpError } from '@/api/errors/httpError.js'

export const chatRouter = Router()

chatRouter.post('/', async (req, res, next) => {
  try {
    const message = req.body?.message

    if (typeof message !== 'string' || !message.trim()) {
      throw new HttpError('message is required', 400)
    }

    const result = await answerCvQuestion(message)
    res.json(result)
  } catch (error) {
    next(error)
  }
})
