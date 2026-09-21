export class HttpError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 500,
  ) {
    super(message)
  }
}
