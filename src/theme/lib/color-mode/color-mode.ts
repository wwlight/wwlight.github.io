/**
 * 明暗模式偏好、解析、`data-theme` 写入。切换动画见 view-transition.css。
 */
import {
  SITE_STORAGE_KEYS,
  migrateAllLegacyStorageKeys,
} from '@/lib/site-storage'
import { syncSiteFavicon } from '@/lib/generated-logo'

/** 明暗切换圆形揭示动画参数。直接写常量，避免读 CSS 变量后被构建压缩成 `.4s` 导致 parseFloat 误判。 */
const VT_DURATION = 400
const VT_EASING = 'ease-in-out'

export type ResolvedTheme = 'dark' | 'light'
export type ThemePreference = ResolvedTheme | 'system'

const THEME_PREFERENCES: ThemePreference[] = ['dark', 'light', 'system']

function parseThemePreference(stored: string | null): ThemePreference {
  if (stored === 'dark' || stored === 'light' || stored === 'system')
    return stored
  return 'system'
}

function persistThemePreference(stored: string | null, preference: ThemePreference) {
  if (typeof localStorage === 'undefined')
    return
  if (stored !== preference)
    localStorage.setItem(THEME_STORAGE_KEY, preference)
}

export const THEME_STORAGE_KEY = SITE_STORAGE_KEYS.colorMode

/** 长页已滚动时固定 body，避免 root 快照只覆盖视口导致揭示动画错位 */
function lockDocumentScroll(): () => void {
  const scrollY = window.scrollY
  if (scrollY <= 0)
    return () => {}

  const { body } = document
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'

  return () => {
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, scrollY)
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'system'
  migrateAllLegacyStorageKeys()
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  const preference = parseThemePreference(stored)
  persistThemePreference(stored, preference)
  return preference
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return getSystemTheme()
  return preference
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'dark'
  const root = document.documentElement
  if (root.classList.contains('dark') || root.dataset.theme === 'dark') return 'dark'
  if (root.classList.contains('light') || root.dataset.theme === 'light') return 'light'
  return resolveTheme(getStoredThemePreference())
}

export function syncStoredTheme() {
  applyThemePreference(getStoredThemePreference())
}

export function applyResolvedTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  syncSiteFavicon()
}

export function applyThemePreference(preference: ThemePreference) {
  applyResolvedTheme(resolveTheme(preference))
}

export function storeThemePreference(preference: ThemePreference) {
  if (typeof localStorage === 'undefined') return
  if (!THEME_PREFERENCES.includes(preference))
    return
  localStorage.setItem(THEME_STORAGE_KEY, preference)
}

export function setThemePreference(preference: ThemePreference) {
  storeThemePreference(preference)
  applyThemePreference(preference)
}

export async function setThemePreferenceWithTransition(
  preference: ThemePreference,
  event: { clientX: number, clientY: number },
) {
  storeThemePreference(preference)
  await setThemeWithTransition(resolveTheme(preference), event)
}

export async function setThemeWithTransition(
  next: ResolvedTheme,
  event: { clientX: number, clientY: number },
) {
  const canTransition
    = typeof document !== 'undefined'
      && 'startViewTransition' in document
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!canTransition || getResolvedTheme() === next) {
    applyResolvedTheme(next)
    return
  }

  const { clientX: x, clientY: y } = event
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const root = document.documentElement
  root.classList.add('theme-transitioning')
  const unlockScroll = lockDocumentScroll()

  let clipAnimation: Animation | null = null

  try {
    const transition = document.startViewTransition(() => applyResolvedTheme(next))
    await transition.ready

    const pseudo = next === 'dark'
      ? '::view-transition-old(root)'
      : '::view-transition-new(root)'

    const fromClip = next === 'dark'
      ? `circle(${endRadius}px at ${x}px ${y}px)`
      : `circle(0px at ${x}px ${y}px)`
    const toClip = next === 'dark'
      ? `circle(0px at ${x}px ${y}px)`
      : `circle(${endRadius}px at ${x}px ${y}px)`

    clipAnimation = document.documentElement.animate(
      { clipPath: [fromClip, toClip] },
      { duration: VT_DURATION, easing: VT_EASING, fill: 'both', pseudoElement: pseudo },
    )

    await transition.finished
  }
  catch {
    applyResolvedTheme(next)
  }
  finally {
    clipAnimation?.cancel()
    root.classList.remove('theme-transitioning')
    unlockScroll()
  }
}
