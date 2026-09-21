import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { extractJsonPayload } from './json.js'

describe('extractJsonPayload', () => {
  it('returns plain JSON unchanged', () => {
    assert.equal(extractJsonPayload('{"a":1}'), '{"a":1}')
  })

  it('strips markdown json fences', () => {
    const raw = '```json\n{"fullName":"Ada"}\n```'
    assert.equal(extractJsonPayload(raw), '{"fullName":"Ada"}')
  })
})
