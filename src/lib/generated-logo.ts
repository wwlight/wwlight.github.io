import { buildGeneratedLogoSvg } from '../../scripts/generated-logo.data.mjs'

export { buildGeneratedLogoSvg }

/** 含 Starlight 默认的 shortcut icon 与自定义 icon */
const FAVICON_LINK_SELECTOR = 'link[rel~="icon"]'
const MAX_FAVICON_RETRIES = 40

let primaryColorProbe: HTMLSpanElement | undefined
let faviconRetryCount = 0

function isPrimaryCssReady() {
  return Boolean(
    getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
  )
}

/** 解析 --primary 为 rgb/rgba（favicon data URI 无法使用 var()） */
export function getGeneratedLogoColor(): string {
  if (typeof document === 'undefined' || !isPrimaryCssReady())
    return ''

  if (!primaryColorProbe) {
    primaryColorProbe = document.createElement('span')
    primaryColorProbe.style.display = 'none'
    primaryColorProbe.style.color = 'var(--primary)'
    document.documentElement.appendChild(primaryColorProbe)
  }

  const color = getComputedStyle(primaryColorProbe).color.trim()
  return color && color !== 'rgba(0, 0, 0, 0)' ? color : ''
}

function applyFaviconHref(href: string) {
  const links = document.querySelectorAll<HTMLLinkElement>(FAVICON_LINK_SELECTOR)
  if (links.length === 0) {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.dataset.generatedFavicon = ''
    link.href = href
    document.head.appendChild(link)
    return
  }

  for (const link of links) {
    link.type = 'image/svg+xml'
    link.dataset.generatedFavicon = ''
    if (link.href !== href)
      link.href = href
  }
}

/** favicon 为独立资源，无法继承页面 currentColor，按 --primary 写入 data URI */
export function syncSiteFavicon() {
  if (typeof document === 'undefined')
    return

  const color = getGeneratedLogoColor()
  if (!color) {
    if (faviconRetryCount < MAX_FAVICON_RETRIES) {
      faviconRetryCount++
      requestAnimationFrame(() => syncSiteFavicon())
    }
    return
  }

  faviconRetryCount = 0
  applyFaviconHref(`data:image/svg+xml,${encodeURIComponent(buildGeneratedLogoSvg(color))}`)
}
