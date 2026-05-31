import {
  LEGACY_STORAGE_KEYS,
  LEGACY_SITE_THEME_STORAGE_KEYS,
  SITE_STORAGE_KEYS,
  SITE_STORAGE_PREFIX,
  SITE_THEME_STORAGE_KEYS,
  SITE_THEME_STORAGE_PREFIX,
  siteStorageKey,
  siteThemeStorageKey,
} from './site-storage.keys.mjs'

export {
  LEGACY_STORAGE_KEYS,
  LEGACY_SITE_THEME_STORAGE_KEYS,
  SITE_STORAGE_KEYS,
  SITE_STORAGE_PREFIX,
  SITE_THEME_STORAGE_KEYS,
  SITE_THEME_STORAGE_PREFIX,
  siteStorageKey,
  siteThemeStorageKey,
}

const ALL_STORAGE_KEYS = new Set<string>([
  ...Object.values(SITE_STORAGE_KEYS),
  ...Object.values(LEGACY_STORAGE_KEYS),
])

const THEME_STORAGE_KEYS = new Set<string>([
  ...Object.values(SITE_THEME_STORAGE_KEYS),
  ...Object.values(LEGACY_SITE_THEME_STORAGE_KEYS),
])

let legacyStorageMigrated = false

export function isSiteStorageKey(key: string | null): key is string {
  return key !== null && ALL_STORAGE_KEYS.has(key)
}

/** 仅主题相关键（跨标签页 storage 订阅用） */
export function isSiteThemeStorageKey(key: string | null): key is string {
  return key !== null && THEME_STORAGE_KEYS.has(key)
}

/** 若新键无值，从 legacy 键迁移并删除旧键 */
export function migrateLegacyStorageKey(
  nextKey: string,
  legacyKeys: readonly string[],
) {
  if (typeof localStorage === 'undefined')
    return

  if (localStorage.getItem(nextKey) != null)
    return

  for (const legacyKey of legacyKeys) {
    const value = localStorage.getItem(legacyKey)
    if (value === null)
      continue

    localStorage.setItem(nextKey, value)
    if (legacyKey !== nextKey)
      localStorage.removeItem(legacyKey)
    return
  }
}

export function migrateAllLegacyStorageKeys() {
  if (legacyStorageMigrated || typeof localStorage === 'undefined')
    return

  migrateLegacyStorageKey(SITE_STORAGE_KEYS.colorMode, [
    SITE_STORAGE_KEYS.colorMode,
    LEGACY_STORAGE_KEYS.colorMode,
  ])
  migrateLegacyStorageKey(SITE_STORAGE_KEYS.primary, [
    SITE_STORAGE_KEYS.primary,
    LEGACY_STORAGE_KEYS.primary,
    LEGACY_STORAGE_KEYS.primaryLegacy,
  ])
  migrateLegacyStorageKey(SITE_STORAGE_KEYS.neutral, [
    SITE_STORAGE_KEYS.neutral,
    LEGACY_STORAGE_KEYS.neutral,
  ])
  migrateLegacyStorageKey(SITE_STORAGE_KEYS.radius, [
    SITE_STORAGE_KEYS.radius,
    LEGACY_STORAGE_KEYS.radius,
  ])
  migrateLegacyStorageKey(SITE_STORAGE_KEYS.bookmarksAdminDraft, [
    SITE_STORAGE_KEYS.bookmarksAdminDraft,
    LEGACY_STORAGE_KEYS.bookmarksAdminDraft,
  ])

  legacyStorageMigrated = true
}

/** @deprecated 使用 migrateLegacyStorageKey */
export const migrateLegacySiteThemeStorageKey = migrateLegacyStorageKey

/** @deprecated 使用 migrateAllLegacyStorageKeys */
export const migrateAllLegacySiteThemeStorageKeys = migrateAllLegacyStorageKeys
