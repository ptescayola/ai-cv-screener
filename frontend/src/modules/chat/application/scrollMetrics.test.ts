import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
  distanceFromBottom,
  isNearChatBottom,
} from '@/modules/chat/application/scrollMetrics'

describe('scrollMetrics', () => {
  it('computes distance from the bottom', () => {
    assert.equal(distanceFromBottom(1000, 800, 200), 0)
    assert.equal(distanceFromBottom(1000, 700, 200), 100)
  })

  it('treats the viewport as pinned within the threshold', () => {
    assert.equal(
      isNearChatBottom(1000, 736, 200, CHAT_SCROLL_BOTTOM_THRESHOLD_PX),
      true,
    )
    assert.equal(
      isNearChatBottom(1000, 700, 200, CHAT_SCROLL_BOTTOM_THRESHOLD_PX),
      false,
    )
  })
})
