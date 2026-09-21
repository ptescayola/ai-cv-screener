export const CHAT_SCROLL_BOTTOM_THRESHOLD_PX = 64

export function distanceFromBottom(
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
): number {
  return scrollHeight - scrollTop - clientHeight
}

export function isNearChatBottom(
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
  threshold = CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
): boolean {
  return distanceFromBottom(scrollHeight, scrollTop, clientHeight) <= threshold
}
