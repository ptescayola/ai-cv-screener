import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { chunkText, extractJsonPayload, parseCvProfile } from '@/utils/text.js'

describe('extractJsonPayload', () => {
  it('returns plain JSON unchanged', () => {
    assert.equal(extractJsonPayload('{"a":1}'), '{"a":1}')
  })

  it('strips markdown json fences', () => {
    const raw = '```json\n{"fullName":"Ada"}\n```'
    assert.equal(extractJsonPayload(raw), '{"fullName":"Ada"}')
  })
})

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

describe('chunkText', () => {
  it('returns empty for blank input', () => {
    assert.deepEqual(chunkText('   \n\t', 50, 10), [])
  })

  it('keeps short text as a single chunk', () => {
    assert.deepEqual(chunkText('Hello world', 100, 20), ['Hello world'])
  })

  it('splits long text with overlap', () => {
    const words = Array.from({ length: 40 }, (_, index) => `word${index}`)
    const text = words.join(' ')
    const chunks = chunkText(text, 80, 20)

    assert.ok(chunks.length >= 2)
    assert.ok(chunks.every((chunk) => chunk.length <= 80))
    assert.equal(chunks[0]?.includes('word0'), true)
    assert.equal(chunks.at(-1)?.includes('word39'), true)
  })
})
