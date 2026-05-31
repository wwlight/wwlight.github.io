/**
 * 全站 localStorage 存储契约：主题、管理端草稿等共用前缀与迁移逻辑。
 * 键名定义见 site-storage.keys.mjs；html data 属性见 site-theme.ts。
 */
import { syncStoredThemeCustomizerState } from '@/lib/color-theme'
import { syncStoredTheme } from '@/lib/theme'
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

/** 写入 document.documentElement 的对外 data 属性（与 theme-init.inline.js 一致） */
export const SITE_THEME_DATA_ATTRIBUTES = {
  colorMode: 'data-theme',
  primary: 'data-color-primary',
  neutral: 'data-color-neutral',
  radius: 'data-radius',
  /** @deprecated 兼容旧选择器 */
  primaryLegacy: 'data-color-theme',
} as const

export function syncSiteThemeFromStorage() {
  syncStoredTheme()
  syncStoredThemeCustomizerState()
  syncSiteFavicon()
}

export { isSiteThemeStorageKey }

/** 其他标签页修改主题时同步 DOM；同一批 storage 事件合并为一次 sync */
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
