import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createMessage } from './createMessage.ts'

describe('createMessage', () => {
  it('builds a user message with id and timestamp', () => {
    const message = createMessage('user', 'Hello')

    assert.equal(message.role, 'user')
    assert.equal(message.content, 'Hello')
    assert.match(message.id, /^[0-9a-f-]{36}$/i)
    assert.ok(message.createdAt > 0)
    assert.equal(message.sources, undefined)
  })

  it('includes sources on assistant replies', () => {
    const message = createMessage('assistant', 'Answer', ['a.pdf', 'b.pdf'])

    assert.equal(message.role, 'assistant')
    assert.deepEqual(message.sources, ['a.pdf', 'b.pdf'])
  })
})
