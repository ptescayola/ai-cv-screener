import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'
import { type AxiosResponse } from 'axios'
import { api } from '@/modules/chat/infrastructure/apiClient'
import { fetchChatAnswer } from '@/modules/chat/infrastructure/chatClient'

describe('fetchChatAnswer', () => {
  afterEach(() => {
    mock.restoreAll()
  })

  it('posts the message and maps sources to file names', async () => {
    const postMock = mock.method(api, 'post', async (url, body) => {
      assert.equal(url, '/chat')
      assert.deepEqual(body, { message: 'Who knows TS?' })

      return {
        data: {
          answer: 'Jane Doe',
          sources: [{ fileName: 'jane-doe-abc.pdf' }],
        },
      } as AxiosResponse
    })

    const result = await fetchChatAnswer('Who knows TS?')

    assert.deepEqual(result, {
      answer: 'Jane Doe',
      sources: ['jane-doe-abc.pdf'],
    })
    assert.equal(postMock.mock.callCount(), 1)
  })

  it('throws the server error message when the request fails', async () => {
    mock.method(api, 'post', async () => {
      throw new Error('Index unavailable')
    })

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
    mock.method(api, 'post', async () => ({
      data: { error: 'nope' },
    }))

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
