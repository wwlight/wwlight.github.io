/**
 * 功能：Primary / Neutral / Radius 读写 localStorage 与 html data-*；随机、重置、订阅。
 * 问题：仍同步 legacy `data-color-theme`；favicon 随 primary 变化。
 */
import {
  DEFAULT_NEUTRAL,
  DEFAULT_PRIMARY,
  DEFAULT_RADIUS,
  NEUTRAL_THEME_IDS,
  PRIMARY_THEME_IDS,
  RADIUS_OPTION_IDS,
  type NeutralThemeId,
  type PrimaryThemeId,
  type RadiusOptionId,
  isNeutralThemeId,
  isPrimaryThemeId,
  isRadiusOptionId,
} from './options'
import {
  migrateAllLegacyStorageKeys,
  SITE_STORAGE_KEYS,
} from '@/lib/site-storage'
import { syncSiteFavicon } from '@/lib/generated-logo'

export const COLOR_PRIMARY_STORAGE_KEY = SITE_STORAGE_KEYS.primary
export const COLOR_NEUTRAL_STORAGE_KEY = SITE_STORAGE_KEYS.neutral
export const THEME_RADIUS_STORAGE_KEY = SITE_STORAGE_KEYS.radius

export {
  DEFAULT_NEUTRAL,
  DEFAULT_PRIMARY,
  DEFAULT_RADIUS,
} from './options'

export interface ThemeCustomizerState {
  primary: PrimaryThemeId
  neutral: NeutralThemeId
  radius: RadiusOptionId
}

const SSR_THEME_CUSTOMIZER_SNAPSHOT: ThemeCustomizerState = {
  primary: DEFAULT_PRIMARY,
  neutral: DEFAULT_NEUTRAL,
  radius: DEFAULT_RADIUS,
}

let cachedDocumentSnapshot: ThemeCustomizerState = { ...SSR_THEME_CUSTOMIZER_SNAPSHOT }

const themeCustomizerListeners = new Set<() => void>()

export function subscribeThemeCustomizerState(onStoreChange: () => void) {
  themeCustomizerListeners.add(onStoreChange)
  return () => {
    themeCustomizerListeners.delete(onStoreChange)
  }
}

function emitThemeCustomizerStateChange() {
  for (const listener of themeCustomizerListeners)
    listener()
}

export function applyThemeCustomizerState(state: ThemeCustomizerState) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.colorPrimary = state.primary
  root.dataset.colorNeutral = state.neutral
  root.dataset.radius = state.radius
  root.dataset.colorTheme = state.primary
  if (
    cachedDocumentSnapshot.primary !== state.primary
    || cachedDocumentSnapshot.neutral !== state.neutral
    || cachedDocumentSnapshot.radius !== state.radius
  ) {
    cachedDocumentSnapshot = {
      primary: state.primary,
      neutral: state.neutral,
      radius: state.radius,
    }
  }
  emitThemeCustomizerStateChange()
  syncSiteFavicon()
}

export function getDocumentThemeCustomizerState(): ThemeCustomizerState {
  if (typeof document === 'undefined')
    return SSR_THEME_CUSTOMIZER_SNAPSHOT

  const root = document.documentElement
  const primary = root.dataset.colorPrimary && isPrimaryThemeId(root.dataset.colorPrimary)
    ? root.dataset.colorPrimary
    : DEFAULT_PRIMARY
  const neutral = root.dataset.colorNeutral && isNeutralThemeId(root.dataset.colorNeutral)
    ? root.dataset.colorNeutral
    : DEFAULT_NEUTRAL
  const radius = root.dataset.radius && isRadiusOptionId(root.dataset.radius)
    ? root.dataset.radius
    : DEFAULT_RADIUS

  if (
    cachedDocumentSnapshot.primary === primary
    && cachedDocumentSnapshot.neutral === neutral
    && cachedDocumentSnapshot.radius === radius
  ) {
    return cachedDocumentSnapshot
  }

  cachedDocumentSnapshot = { primary, neutral, radius }
  return cachedDocumentSnapshot
}

export function getServerThemeCustomizerStateSnapshot(): ThemeCustomizerState {
  return SSR_THEME_CUSTOMIZER_SNAPSHOT
}

export function getDocumentPrimaryThemeId(): PrimaryThemeId {
  return getDocumentThemeCustomizerState().primary
}

export function getStoredThemeCustomizerState(): ThemeCustomizerState {
  if (typeof localStorage === 'undefined') {
    return { primary: DEFAULT_PRIMARY, neutral: DEFAULT_NEUTRAL, radius: DEFAULT_RADIUS }
  }

  migrateAllLegacyStorageKeys()

  const primaryRaw = localStorage.getItem(COLOR_PRIMARY_STORAGE_KEY)
  const neutralRaw = localStorage.getItem(COLOR_NEUTRAL_STORAGE_KEY)
  const radiusRaw = localStorage.getItem(THEME_RADIUS_STORAGE_KEY)

  return {
    primary: primaryRaw && isPrimaryThemeId(primaryRaw) ? primaryRaw : DEFAULT_PRIMARY,
    neutral: neutralRaw && isNeutralThemeId(neutralRaw) ? neutralRaw : DEFAULT_NEUTRAL,
    radius: radiusRaw && isRadiusOptionId(radiusRaw) ? radiusRaw : DEFAULT_RADIUS,
  }
}

export function setThemeCustomizerState(partial: Partial<ThemeCustomizerState>) {
  const current = getStoredThemeCustomizerState()
  return writeThemeCustomizerState({ ...current, ...partial })
}

function writeThemeCustomizerState(next: ThemeCustomizerState) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(COLOR_PRIMARY_STORAGE_KEY, next.primary)
    localStorage.setItem(COLOR_NEUTRAL_STORAGE_KEY, next.neutral)
    localStorage.setItem(THEME_RADIUS_STORAGE_KEY, next.radius)
  }

  applyThemeCustomizerState(next)
  return next
}

function pickRandomOption<T extends string>(options: readonly T[], current: T): T {
  if (options.length <= 1)
    return options[0]!

  const alternatives = options.filter(option => option !== current)
  return alternatives[Math.floor(Math.random() * alternatives.length)]!
}

export function randomThemeCustomizerState(
  current: ThemeCustomizerState = getDocumentThemeCustomizerState(),
): ThemeCustomizerState {
  return writeThemeCustomizerState({
    primary: pickRandomOption(PRIMARY_THEME_IDS, current.primary),
    neutral: pickRandomOption(NEUTRAL_THEME_IDS, current.neutral),
    radius: pickRandomOption(RADIUS_OPTION_IDS, current.radius),
  })
}

export function resetThemeCustomizerToDefaults(): ThemeCustomizerState {
  return setThemeCustomizerState({
    primary: DEFAULT_PRIMARY,
    neutral: DEFAULT_NEUTRAL,
    radius: DEFAULT_RADIUS,
  })
}

export function isDefaultThemeCustomizerState(state: ThemeCustomizerState) {
  return state.primary === DEFAULT_PRIMARY
    && state.neutral === DEFAULT_NEUTRAL
    && state.radius === DEFAULT_RADIUS
}

export function syncStoredThemeCustomizerState() {
  applyThemeCustomizerState(getStoredThemeCustomizerState())
}
