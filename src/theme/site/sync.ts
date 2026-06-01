/**
 * 功能：从 localStorage 一次性同步明暗 + 配色到 DOM；跨标签 storage 订阅。
 * 存储键定义仍在 @/lib/site-storage（全站前缀与迁移）。
 */
import { syncStoredThemeCustomizerState } from '@/theme/customizer/state'
import { syncStoredTheme } from '@/theme/color-mode/color-mode'
import { isSiteThemeStorageKey } from '@/lib/site-storage'
import { syncSiteFavicon } from '@/lib/generated-logo'

export {
  LEGACY_STORAGE_KEYS,
  LEGACY_SITE_THEME_STORAGE_KEYS,
  SITE_STORAGE_KEYS,
  SITE_STORAGE_PREFIX,
  SITE_THEME_STORAGE_KEYS,
  SITE_THEME_STORAGE_PREFIX,
  isSiteStorageKey,
  migrateAllLegacyStorageKeys,
  migrateLegacyStorageKey,
  siteStorageKey,
  siteThemeStorageKey,
} from '@/lib/site-storage'

export { SITE_THEME_DATA_ATTRIBUTES } from '@/theme/site/data-attributes'

export function syncSiteThemeFromStorage() {
  syncStoredTheme()
  syncStoredThemeCustomizerState()
  syncSiteFavicon()
}

export { isSiteThemeStorageKey }

export function subscribeSiteThemeStorage(onChange: () => void): () => void {
  if (typeof window === 'undefined')
    return () => {}

  let pending = false

  const onStorage = (event: StorageEvent) => {
    if (!isSiteThemeStorageKey(event.key))
      return

    if (pending)
      return

    pending = true
    queueMicrotask(() => {
      pending = false
      syncSiteThemeFromStorage()
      onChange()
    })
  }

  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
