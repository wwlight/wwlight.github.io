import { buildGeneratedLogoSvg } from '../utils/generated-logo'

const FAVICON_LINK_SELECTOR = 'link[rel~="icon"]'
const MAX_FAVICON_RETRIES = 40

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  let primaryColorProbe: HTMLSpanElement | undefined
  let faviconRetryCount = 0

  function isPrimaryCssReady() {
    return Boolean(
      getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()
    )
  }

  function getGeneratedLogoColor() {
    if (!isPrimaryCssReady()) return ''

    if (!primaryColorProbe) {
      primaryColorProbe = document.createElement('span')
      primaryColorProbe.style.display = 'none'
      primaryColorProbe.style.color = 'var(--ui-primary)'
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
      if (link.href !== href) link.href = href
    }
  }

  function syncSiteFavicon() {
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

  const appConfig = useAppConfig()
  const colorMode = useColorMode()

  onNuxtReady(() => {
    syncSiteFavicon()
    watch(
      [() => appConfig.ui.colors.primary, () => colorMode.value],
      () => {
        faviconRetryCount = 0
        requestAnimationFrame(() => syncSiteFavicon())
      }
    )
  })
})
