export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin)
    if (!['https:', 'http:', 'mailto:'].includes(parsed.protocol)) {
      return '#'
    }
    return parsed.toString()
  } catch {
    return '#'
  }
}
