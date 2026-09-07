import sources from '../../modules/font-subset/sources.json'

export const DEFAULT_SANS_FAMILY = 'LXGW WenKai'
export const CRITICAL_FONT_FAMILIES = [DEFAULT_SANS_FAMILY, 'Fira Code'] as const

export const FONT_FACE_HREF: Record<string, string> = Object.fromEntries(
  (sources as { family: string, dir: string }[]).map(s => [s.family, `/font-subset/${s.dir}/family.css`])
)

const fontFaceCssPending = new Map<string, Promise<void>>()

export function fontFaceHref(family: string): string | undefined {
  return FONT_FACE_HREF[family]
}

export function criticalFontLinks() {
  return CRITICAL_FONT_FAMILIES.flatMap((name) => {
    const href = fontFaceHref(name)
    return href ? [{ rel: 'stylesheet' as const, href, key: `font-subset-${name}` }] : []
  })
}

export function ensureFontFaceCss(family: string): Promise<void> {
  const href = fontFaceHref(family)
  if (!href || !import.meta.client) return Promise.resolve()
  if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return Promise.resolve()
  const inflight = fontFaceCssPending.get(href)
  if (inflight) return inflight
  const pending = new Promise<void>((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  }).finally(() => {
    fontFaceCssPending.delete(href)
  })
  fontFaceCssPending.set(href, pending)
  return pending
}
