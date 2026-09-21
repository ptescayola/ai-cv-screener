import { access } from 'node:fs/promises'
import path from 'node:path'
import { Router } from 'express'
import { env } from '../../config/env.js'
import { HttpError } from '../errors/httpError.js'
import { resolveCvPdfPath } from '../../utils/safePdfFileName.js'

export const cvsRouter = Router()

cvsRouter.get('/:fileName', async (req, res, next) => {
  try {
    const filePath = resolveCvPdfPath(env.cvOutputDir, req.params.fileName)

    try {
      await access(filePath)
    } catch {
      throw new HttpError('CV not found', 404)
    }

    res.download(filePath, path.basename(filePath))
  } catch (error) {
    next(error)
  }
})
