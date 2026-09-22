import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatMessageTime } from '@/utils/date'

function expectedLocalTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

describe('formatMessageTime', () => {
  it('formats a timestamp as local hours and minutes', () => {
    const timestamp = new Date(2024, 5, 15, 14, 30, 0).getTime()
    assert.equal(formatMessageTime(timestamp), expectedLocalTime(timestamp))
  })

  it('pads single-digit minutes when the locale uses two digits', () => {
    const timestamp = new Date(2024, 0, 1, 9, 5, 0).getTime()
    assert.equal(formatMessageTime(timestamp), expectedLocalTime(timestamp))
  })
})
