import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { chatThreadKey } from '@/modules/chat/application/chatThreadKey'
import type { ChatMessage } from '@/modules/chat/model/chat'

function message(id: string): ChatMessage {
  return {
    id,
    role: 'user',
    content: 'x',
    createdAt: 0,
  }
}

describe('chatThreadKey', () => {
  it('changes when messages or loading state change', () => {
    const empty = chatThreadKey([], false)
    const withOne = chatThreadKey([message('a')], false)
    const loading = chatThreadKey([message('a')], true)

    assert.notEqual(empty, withOne)
    assert.notEqual(withOne, loading)
    assert.equal(withOne, '1:a:0')
    assert.equal(loading, '1:a:1')
  })

  it('uses none when the thread is empty', () => {
    assert.equal(chatThreadKey([], false), '0:none:0')
  })
})
