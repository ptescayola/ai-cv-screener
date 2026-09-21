import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { cvDownloadUrl } from './cvDownloadUrl.ts'

describe('cvDownloadUrl', () => {
  it('builds a proxied download path with encoding', () => {
    assert.equal(
      cvDownloadUrl('jane doe.pdf'),
      '/api/cvs/jane%20doe.pdf',
    )
  })
})
