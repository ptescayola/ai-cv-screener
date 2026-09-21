import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseGenerationCount } from './number.js'

describe('parseGenerationCount', () => {
  it('uses CLI arg when provided', () => {
    assert.equal(parseGenerationCount('5', 25), 5)
  })

  it('falls back to default count', () => {
    assert.equal(parseGenerationCount(undefined, 25), 25)
  })

  it('rejects out-of-range values', () => {
    assert.throws(() => parseGenerationCount('0', 25), /between 1 and 30/)
    assert.throws(() => parseGenerationCount('31', 25), /between 1 and 30/)
  })
})
