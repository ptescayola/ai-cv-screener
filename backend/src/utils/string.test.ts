import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { slugify } from './string.js'

describe('slugify', () => {
  it('normalizes names for filenames', () => {
    assert.equal(slugify('Lucien Dubois'), 'lucien-dubois')
  })

  it('truncates long values', () => {
    assert.equal(slugify('a'.repeat(50)).length, 40)
  })
})
