import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseCvProfile } from './cvProfileParser.js'

describe('parseCvProfile', () => {
  it('parses valid JSON profile', () => {
    const profile = parseCvProfile(
      JSON.stringify({ fullName: 'Ada Lovelace', headline: 'Engineer' }),
    )

    assert.equal(profile.fullName, 'Ada Lovelace')
    assert.equal(profile.headline, 'Engineer')
  })

  it('rejects profile missing required fields', () => {
    assert.throws(
      () => parseCvProfile(JSON.stringify({ fullName: 'Ada Lovelace' })),
      /invalid CV profile payload/,
    )
  })
})
