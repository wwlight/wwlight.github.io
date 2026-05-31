import themeOptionsManifest from './theme-options.json'

export type PrimaryThemeId = (typeof themeOptionsManifest.primaryThemes)[number]['id']
export type NeutralThemeId = (typeof themeOptionsManifest.neutralThemes)[number]['id']
export type RadiusOptionId = (typeof themeOptionsManifest.radiusOptions)[number]['id']

export interface PrimaryThemeOption {
  id: PrimaryThemeId
  label: string
  swatch: string
}

export interface NeutralThemeOption {
  id: NeutralThemeId
  label: string
  swatch: string
}

export interface RadiusOption {
  id: RadiusOptionId
  label: string
  value: string
}

export const DEFAULT_PRIMARY = themeOptionsManifest.defaultPrimary as PrimaryThemeId
export const DEFAULT_NEUTRAL = themeOptionsManifest.defaultNeutral as NeutralThemeId
export const DEFAULT_RADIUS = themeOptionsManifest.defaultRadius as RadiusOptionId
export const DEFAULT_COLOR_MODE = themeOptionsManifest.defaultColorMode as 'light' | 'dark' | 'system'

export const PRIMARY_THEMES = themeOptionsManifest.primaryThemes as PrimaryThemeOption[]
export const NEUTRAL_THEMES = themeOptionsManifest.neutralThemes as NeutralThemeOption[]
export const RADIUS_OPTIONS = themeOptionsManifest.radiusOptions as RadiusOption[]

export const PRIMARY_THEME_IDS = PRIMARY_THEMES.map((theme) => theme.id)
export const NEUTRAL_THEME_IDS = NEUTRAL_THEMES.map((theme) => theme.id)
export const RADIUS_OPTION_IDS = RADIUS_OPTIONS.map((option) => option.id)

export function isPrimaryThemeId(value: string): value is PrimaryThemeId {
  return PRIMARY_THEME_IDS.includes(value as PrimaryThemeId)
}

export function isNeutralThemeId(value: string): value is NeutralThemeId {
  return NEUTRAL_THEME_IDS.includes(value as NeutralThemeId)
}

export function isRadiusOptionId(value: string): value is RadiusOptionId {
  return RADIUS_OPTION_IDS.includes(value as RadiusOptionId)
}

/** @deprecated Use PRIMARY_THEMES */
export const COLOR_THEMES = PRIMARY_THEMES
export const DEFAULT_COLOR_THEME = DEFAULT_PRIMARY
export type ColorThemeId = PrimaryThemeId
export const COLOR_THEME_IDS = PRIMARY_THEME_IDS
export function isColorThemeId(value: string): value is ColorThemeId {
  return isPrimaryThemeId(value)
}
