import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  LEGACY_STORAGE_KEYS,
  SITE_STORAGE_KEYS,
} from '../src/lib/site-storage.keys.mjs'
import {
  DEFAULT_NEUTRAL,
  DEFAULT_PRIMARY,
  DEFAULT_RADIUS,
  NEUTRAL_THEMES,
  PRIMARY_THEMES,
  RADIUS_OPTIONS,
} from './color-themes.data.mjs'
import { GENERATED_LOGO_PATHS, GENERATED_LOGO_STROKE } from './generated-logo.data.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'src/scripts/theme-init.inline.js')

const primaryIds = PRIMARY_THEMES.map(theme => theme.id)
const neutralIds = NEUTRAL_THEMES.map(theme => theme.id)
const radiusIds = RADIUS_OPTIONS.map(option => option.id)

const script = `;(function () {
  // 存储键见 src/lib/site-storage.keys.mjs（由 scripts/generate-theme-init.mjs 生成）
  const KEYS = ${JSON.stringify(SITE_STORAGE_KEYS)}
  const LEGACY = ${JSON.stringify(LEGACY_STORAGE_KEYS)}
  const DEFAULT_PRIMARY = ${JSON.stringify(DEFAULT_PRIMARY)}
  const DEFAULT_NEUTRAL = ${JSON.stringify(DEFAULT_NEUTRAL)}
  const DEFAULT_RADIUS = ${JSON.stringify(DEFAULT_RADIUS)}

  const primaryIds = ${JSON.stringify(primaryIds)}
  const neutralIds = ${JSON.stringify(neutralIds)}
  const radiusIds = ${JSON.stringify(radiusIds)}

  function migrateKey(nextKey, legacyKeys) {
    if (localStorage.getItem(nextKey) != null)
      return
    for (let i = 0; i < legacyKeys.length; i++) {
      const legacyKey = legacyKeys[i]
      const value = localStorage.getItem(legacyKey)
      if (value === null)
        continue
      localStorage.setItem(nextKey, value)
      if (legacyKey !== nextKey)
        localStorage.removeItem(legacyKey)
      return
    }
  }

  function parsePrimary(stored) {
    if (stored && primaryIds.includes(stored))
      return stored
    return DEFAULT_PRIMARY
  }

  function parseNeutral(stored) {
    if (stored && neutralIds.includes(stored))
      return stored
    return DEFAULT_NEUTRAL
  }

  function parseRadius(stored) {
    if (stored && radiusIds.includes(stored))
      return stored
    return DEFAULT_RADIUS
  }

  function applyCustomizer() {
    migrateKey(KEYS.primary, [KEYS.primary, LEGACY.primary, LEGACY.primaryLegacy])
    migrateKey(KEYS.neutral, [KEYS.neutral, LEGACY.neutral])
    migrateKey(KEYS.radius, [KEYS.radius, LEGACY.radius])

    const root = document.documentElement
    const primary = parsePrimary(localStorage.getItem(KEYS.primary))
    const neutral = parseNeutral(localStorage.getItem(KEYS.neutral))
    const radius = parseRadius(localStorage.getItem(KEYS.radius))

    root.dataset.colorPrimary = primary
    root.dataset.colorNeutral = neutral
    root.dataset.radius = radius
    root.dataset.colorTheme = primary
  }

  function parseColorMode(stored) {
    if (stored === 'dark' || stored === 'light' || stored === 'system')
      return stored
    return 'system'
  }

  function applyTheme() {
    migrateKey(KEYS.colorMode, [KEYS.colorMode, LEGACY.colorMode])

    const stored = localStorage.getItem(KEYS.colorMode)
    const pref = parseColorMode(stored)
    if (stored !== pref)
      localStorage.setItem(KEYS.colorMode, pref)

    const theme
      = pref === 'system'
        ? matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : pref
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  function syncFromStorage() {
    applyCustomizer()
    applyTheme()
    syncFavicon()
  }

  var logoPaths = ${JSON.stringify(GENERATED_LOGO_PATHS)}
  var logoStroke = ${JSON.stringify(GENERATED_LOGO_STROKE)}

  function buildGeneratedLogoSvg(strokeColor) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="logo">' +
      logoPaths.map(function (d) {
        return '<path d="' + d + '" fill="none" stroke="' + strokeColor + '" stroke-width="' + logoStroke.width + '" stroke-linecap="' + logoStroke.linecap + '" stroke-linejoin="' + logoStroke.linejoin + '" />'
      }).join('') +
      '</svg>'
  }

  var primaryColorProbe = null
  var faviconRetryCount = 0
  var MAX_FAVICON_RETRIES = 40

  function isPrimaryCssReady() {
    return Boolean(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())
  }

  function resolvePrimaryColor() {
    if (!isPrimaryCssReady())
      return ''
    if (!primaryColorProbe) {
      primaryColorProbe = document.createElement('span')
      primaryColorProbe.style.display = 'none'
      primaryColorProbe.style.color = 'var(--primary)'
      document.documentElement.appendChild(primaryColorProbe)
    }
    var color = getComputedStyle(primaryColorProbe).color.trim()
    return color && color !== 'rgba(0, 0, 0, 0)' ? color : ''
  }

  function applyFaviconHref(href) {
    var links = document.querySelectorAll('link[rel~="icon"]')
    if (links.length === 0) {
      var link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      link.dataset.generatedFavicon = ''
      link.href = href
      document.head.appendChild(link)
      return
    }
    for (var i = 0; i < links.length; i++) {
      var iconLink = links[i]
      iconLink.type = 'image/svg+xml'
      iconLink.dataset.generatedFavicon = ''
      if (iconLink.href !== href)
        iconLink.href = href
    }
  }

  function syncFavicon() {
    var color = resolvePrimaryColor()
    if (!color) {
      if (faviconRetryCount < MAX_FAVICON_RETRIES) {
        faviconRetryCount++
        requestAnimationFrame(syncFavicon)
      }
      return
    }
    faviconRetryCount = 0
    applyFaviconHref('data:image/svg+xml,' + encodeURIComponent(buildGeneratedLogoSvg(color)))
  }

  const THEME_STORAGE_KEYS = new Set([
    KEYS.colorMode,
    KEYS.primary,
    KEYS.neutral,
    KEYS.radius,
    LEGACY.colorMode,
    LEGACY.primary,
    LEGACY.neutral,
    LEGACY.radius,
    LEGACY.primaryLegacy,
  ])

  function isThemeStorageKey(key) {
    return key != null && THEME_STORAGE_KEYS.has(key)
  }

  applyCustomizer()
  applyTheme()
  setTimeout(syncFromStorage, 0)
  window.addEventListener('load', syncFavicon)

  window.addEventListener('storage', (event) => {
    if (!isThemeStorageKey(event.key))
      return
    syncFromStorage()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible')
      syncFromStorage()
  })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted)
      syncFromStorage()
  })

  document.addEventListener('astro:page-load', syncFromStorage)
})()
`

writeFileSync(outPath, script)
console.log('Generated src/scripts/theme-init.inline.js')
