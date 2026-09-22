import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveChatSources } from '@/application/resolveChatSources.js'
import type { ChunkSearchHit } from '@/domain/rag.js'

const hits: ChunkSearchHit[] = [
  { score: 0.9, fileName: 'a.pdf', text: 'a' },
  { score: 0.8, fileName: 'b.pdf', text: 'b' },
  { score: 0.7, fileName: 'c.pdf', text: 'c' },
]

describe('resolveChatSources', () => {
  it('keeps only cited files that were in retrieval hits', () => {
    assert.deepEqual(resolveChatSources(['a.pdf', 'unknown.pdf', 'b.pdf'], hits), [
      { fileName: 'a.pdf' },
      { fileName: 'b.pdf' },
    ])
  })

  it('dedupes and trims cited file names', () => {
    assert.deepEqual(resolveChatSources([' a.pdf ', 'a.pdf'], hits), [
      { fileName: 'a.pdf' },
    ])
  })

  it('returns empty when the model cites nothing', () => {
    assert.deepEqual(resolveChatSources([], hits), [])
  })
})
