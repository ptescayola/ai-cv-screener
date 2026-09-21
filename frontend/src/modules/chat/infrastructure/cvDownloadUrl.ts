export function cvDownloadUrl(fileName: string): string {
  return `/api/cvs/${encodeURIComponent(fileName)}`
}
