export function stripPdfExtension(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '')
}

const MARKDOWN_BULLET_LINE = /^[-*]\s+/

export function parseMarkdownBulletList(content: string): string[] | null {
  const lines = content
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2 || !lines.every((line) => MARKDOWN_BULLET_LINE.test(line))) {
    return null
  }

  return lines.map((line) => line.replace(MARKDOWN_BULLET_LINE, ''))
}

export function stripLeadingBulletPrefix(content: string): string {
  return content.replace(/^-\s+/, '')
}

export function parseStringListAnswer(content: string): string[] | null {
  const trimmed = content.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(trimmed)
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      !parsed.every((item) => typeof item === 'string' && item.trim().length > 0)
    ) {
      return null
    }

    return parsed.map((item) => item.trim())
  } catch {
    return null
  }
}
