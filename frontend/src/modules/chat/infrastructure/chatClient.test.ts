import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'
import { fetchChatAnswer } from './chatClient.ts'

function jsonResponse(
  init: ResponseInit & { body: unknown },
): Response {
  const { body, ...responseInit } = init
  return Response.json(body, responseInit)
}

describe('fetchChatAnswer', () => {
  afterEach(() => {
    mock.restoreAll()
  })

  it('posts the message and maps sources to file names', async () => {
    const fetchMock = mock.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      assert.equal(input, '/api/chat')
      assert.equal(init?.method, 'POST')
      assert.equal(
        init?.headers &&
          (init.headers as Record<string, string>)['Content-Type'],
        'application/json',
      )
      assert.deepEqual(JSON.parse(String(init?.body)), { message: 'Who knows TS?' })

      return jsonResponse({
        status: 200,
        body: {
          answer: 'Jane Doe',
          sources: [{ fileName: 'jane-doe-abc.pdf' }],
        },
      })
    })
    mock.method(globalThis, 'fetch', fetchMock)

    const result = await fetchChatAnswer('Who knows TS?')

    assert.deepEqual(result, {
      answer: 'Jane Doe',
      sources: ['jane-doe-abc.pdf'],
    })
    assert.equal(fetchMock.mock.callCount(), 1)
  })

  it('throws the server error message when the request fails', async () => {
    mock.method(globalThis, 'fetch', async () =>
      jsonResponse({ status: 503, body: { error: 'Index unavailable' } }),
    )

    await assert.rejects(
      () => fetchChatAnswer('test'),
      (error: unknown) => {
        assert.ok(error instanceof Error)
        assert.equal(error.message, 'Index unavailable')
        return true
      },
    )
  })

  it('throws when the response body is not a chat payload', async () => {
    mock.method(globalThis, 'fetch', async () =>
      jsonResponse({ status: 200, body: { error: 'nope' } }),
    )

    await assert.rejects(
      () => fetchChatAnswer('test'),
      (error: unknown) => {
        assert.ok(error instanceof Error)
        assert.equal(error.message, 'Chat response was invalid')
        return true
      },
    )
  })
})
