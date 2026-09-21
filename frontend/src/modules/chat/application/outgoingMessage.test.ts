import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  canSendOutgoingMessage,
  chatErrorMessage,
  isStaleChatRequest,
  resolveOutgoingMessage,
} from './outgoingMessage.ts'

describe('resolveOutgoingMessage', () => {
  it('uses override text when provided', () => {
    assert.equal(resolveOutgoingMessage('  prompt  ', 'draft'), 'prompt')
  })

  it('falls back to draft and trims', () => {
    assert.equal(resolveOutgoingMessage(undefined, '  hi  '), 'hi')
  })

  it('returns null for blank input', () => {
    assert.equal(resolveOutgoingMessage(undefined, '   '), null)
    assert.equal(resolveOutgoingMessage('', ''), null)
  })
})

describe('canSendOutgoingMessage', () => {
  it('blocks empty text and loading state', () => {
    assert.equal(canSendOutgoingMessage(null, false), false)
    assert.equal(canSendOutgoingMessage('hi', true), false)
    assert.equal(canSendOutgoingMessage('hi', false), true)
  })
})

describe('isStaleChatRequest', () => {
  it('detects superseded in-flight requests', () => {
    assert.equal(isStaleChatRequest(2, 1), true)
    assert.equal(isStaleChatRequest(2, 2), false)
  })
})

describe('chatErrorMessage', () => {
  it('uses Error.message when available', () => {
    assert.equal(chatErrorMessage(new Error('Network down')), 'Network down')
  })

  it('falls back for unknown errors', () => {
    assert.equal(chatErrorMessage('oops'), 'Something went wrong')
  })
})
