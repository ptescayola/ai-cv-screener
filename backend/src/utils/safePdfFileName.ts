import path from 'node:path'
import { HttpError } from '@/api/errors/httpError.js'

export function resolveCvPdfPath(
  directory: string,
  fileName: string,
): string {
  const base = path.basename(fileName)

  if (base !== fileName || !/^[\w-]+\.pdf$/i.test(base)) {
    throw new HttpError('Invalid file name', 400)
  }

  const root = path.resolve(directory)
  const resolved = path.resolve(root, base)

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new HttpError('Invalid file path', 400)
  }

  return resolved
}
