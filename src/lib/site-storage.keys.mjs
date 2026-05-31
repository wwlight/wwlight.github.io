/** 全站 localStorage 键前缀（改此处即可） */
export const SITE_STORAGE_PREFIX = 'wwlight'

/** @param {string} name */
export function siteStorageKey(name) {
  return `${SITE_STORAGE_PREFIX}:${name}`
}

export const SITE_STORAGE_KEYS = {
  colorMode: siteStorageKey('color-mode'),
  primary: siteStorageKey('color-primary'),
  neutral: siteStorageKey('color-neutral'),
  radius: siteStorageKey('theme-radius'),
  bookmarksAdminDraft: siteStorageKey('bookmarks-admin-draft'),
  bookmarksAdminTransfer: siteStorageKey('bookmarks-admin-transfer'),
  bookmarksAdminTransferDock: siteStorageKey('bookmarks-admin-transfer-dock'),
}

/** @deprecated 使用 SITE_STORAGE_KEYS */
export const SITE_THEME_STORAGE_PREFIX = SITE_STORAGE_PREFIX

/** @deprecated 使用 SITE_STORAGE_KEYS */
export const SITE_THEME_STORAGE_KEYS = {
  colorMode: SITE_STORAGE_KEYS.colorMode,
  primary: SITE_STORAGE_KEYS.primary,
  neutral: SITE_STORAGE_KEYS.neutral,
  radius: SITE_STORAGE_KEYS.radius,
}

/** @deprecated 使用 siteStorageKey */
export function siteThemeStorageKey(name) {
  return siteStorageKey(name)
}

/** 无前缀旧键 — 首次读取时迁移到 SITE_STORAGE_KEYS */
export const LEGACY_STORAGE_KEYS = {
  colorMode: 'starlight-theme',
  primary: 'color-primary',
  neutral: 'color-neutral',
  radius: 'theme-radius',
  primaryLegacy: 'color-theme',
  bookmarksAdminDraft: 'bookmarks-admin-draft',
}

/** @deprecated 使用 LEGACY_STORAGE_KEYS */
export const LEGACY_SITE_THEME_STORAGE_KEYS = {
  colorMode: LEGACY_STORAGE_KEYS.colorMode,
  primary: LEGACY_STORAGE_KEYS.primary,
  neutral: LEGACY_STORAGE_KEYS.neutral,
  radius: LEGACY_STORAGE_KEYS.radius,
  primaryLegacy: LEGACY_STORAGE_KEYS.primaryLegacy,
}
