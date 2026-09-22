import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '@/api/errors/httpError.js'

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[backend]', error)

  const status = error instanceof HttpError ? error.statusCode : 500
  const message =
    error instanceof Error ? error.message : 'Unexpected server error'

  res.status(status).json({ error: message })
}
