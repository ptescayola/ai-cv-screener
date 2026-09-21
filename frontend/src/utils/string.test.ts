import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { stripPdfExtension } from './string.ts'

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
