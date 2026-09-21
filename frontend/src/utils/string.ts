export function stripPdfExtension(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '')
}
