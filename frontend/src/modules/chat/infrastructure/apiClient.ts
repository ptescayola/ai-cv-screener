import axios, { isAxiosError } from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

function messageFromAxiosError(error: unknown): string {
  if (!isAxiosError(error)) {
    return 'Something went wrong'
  }

  const payload = error.response?.data as { error?: string } | undefined
  if (payload?.error) {
    return payload.error
  }

  if (error.response) {
    return `Request failed (${error.response.status})`
  }

  return 'Could not reach the server'
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(new Error(messageFromAxiosError(error), { cause: error })),
)
