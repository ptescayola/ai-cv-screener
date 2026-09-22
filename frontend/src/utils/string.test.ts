import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  parseMarkdownBulletList,
  parseStringListAnswer,
  stripLeadingBulletPrefix,
  stripPdfExtension,
} from '@/utils/string'

describe('stripPdfExtension', () => {
  it('removes a trailing .pdf extension', () => {
    assert.equal(stripPdfExtension('jane-doe-a1b2c3d4.pdf'), 'jane-doe-a1b2c3d4')
  })

  it('is case-insensitive for the extension', () => {
    assert.equal(stripPdfExtension('cv.PDF'), 'cv')
  })

  it('leaves names without .pdf unchanged', () => {
    assert.equal(stripPdfExtension('readme'), 'readme')
  })
})

describe('parseStringListAnswer', () => {
  it('parses a JSON array of names', () => {
    assert.deepEqual(
      parseStringListAnswer('["Alex Johnson", "Alexandra Bennett"]'),
      ['Alex Johnson', 'Alexandra Bennett'],
    )
  })

  it('returns null for plain prose', () => {
    assert.equal(parseStringListAnswer('Alex Johnson and Jane Doe.'), null)
  })

  it('returns null for non-string arrays', () => {
    assert.equal(parseStringListAnswer('[1, 2, 3]'), null)
  })
})

describe('parseMarkdownBulletList', () => {
  it('parses multi-line markdown bullets', () => {
    assert.deepEqual(
      parseMarkdownBulletList('- Ada Lovelace\n- Alan Turing'),
      ['Ada Lovelace', 'Alan Turing'],
    )
  })

  it('returns null for a single bullet line', () => {
    assert.equal(parseMarkdownBulletList('- Hello there'), null)
  })
})

describe('stripLeadingBulletPrefix', () => {
  it('removes a leading hyphen bullet', () => {
    assert.equal(
      stripLeadingBulletPrefix('- Hello! How can I assist you today?'),
      'Hello! How can I assist you today?',
    )
  })
})
