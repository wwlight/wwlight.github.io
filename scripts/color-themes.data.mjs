/** @typedef {{ primary: string, primaryForeground: string, ring: string }} PrimaryTokens */

/** @typedef {{ id: string, label: string, accent: string, swatch: string }} PrimaryThemeDefinition */

/** @typedef {{ id: string, label: string, scale: string, swatch: string }} NeutralThemeDefinition */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TAILWIND_THEME_CSS = readFileSync(join(ROOT, 'node_modules/tailwindcss/theme.css'), 'utf8')

/** Nuxt UI primary: Tailwind 500 (light) / 400 (dark) — https://ui.nuxt.com/docs/getting-started/theme/css-variables */
const CHROMA_PRIMARY_SCALES = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

const NEUTRAL_BUILTIN_SCALES = ['slate', 'gray', 'zinc', 'neutral', 'stone']

/** 独立 oklch 色阶：由 Tailwind 内置 scale 的 L/chroma 曲线推导，固定 hue */
const NEUTRAL_CUSTOM_SCALES = ['taupe', 'mauve', 'mist', 'olive']

/** @type {Record<string, { base: string, hue: number, chromaScale: number, chromaMin?: number }>} */
const CUSTOM_NEUTRAL_SCALE_CONFIG = {
  taupe: { base: 'stone', hue: 42, chromaScale: 1.35, chromaMin: 0.005 },
  mauve: { base: 'zinc', hue: 300, chromaScale: 1.45, chromaMin: 0.007 },
  mist: { base: 'slate', hue: 215, chromaScale: 0.55, chromaMin: 0.003 },
  olive: { base: 'neutral', hue: 136, chromaScale: 0.72, chromaMin: 0.004 },
}

const ACCENT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const GRAY_STEPS = ACCENT_STEPS

function titleCase(id) {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

/** @type {PrimaryThemeDefinition[]} */
export const PRIMARY_THEMES = [
  {
    id: 'black',
    label: 'Black',
    accent: 'zinc',
    // Panel 预览：见 styles/customizer-trigger.css（暗色反转为 white，非固定 zinc-950）
    swatch: 'var(--theme-primary-swatch-black)',
  },
  ...CHROMA_PRIMARY_SCALES.map(scale => ({
    id: scale,
    label: titleCase(scale),
    accent: scale,
    swatch: `var(--color-${scale}-500)`,
  })),
]

/** @type {NeutralThemeDefinition[]} */
export const NEUTRAL_THEMES = [...NEUTRAL_BUILTIN_SCALES, ...NEUTRAL_CUSTOM_SCALES].map(scale => ({
  id: scale,
  label: titleCase(scale),
  scale,
  swatch: `var(--color-${scale}-500)`,
}))

/** @type {{ id: string, label: string, value: string }[]} */
export const RADIUS_OPTIONS = [
  { id: '0', label: '0', value: '0rem' },
  { id: '0.125', label: '0.125', value: '0.125rem' },
  { id: '0.25', label: '0.25', value: '0.25rem' },
  { id: '0.375', label: '0.375', value: '0.375rem' },
  { id: '0.5', label: '0.5', value: '0.5rem' },
]

export const DEFAULT_PRIMARY = 'green'
export const DEFAULT_NEUTRAL = 'slate'
export const DEFAULT_RADIUS = '0.25'
export const DEFAULT_COLOR_MODE = 'system'

/** @param {string} value */
function parseOklch(value) {
  const match = value.match(/oklch\(([0-9.]+%)\s+([0-9.]+)\s+([0-9.]+)\)/)
  if (!match)
    throw new Error(`Invalid oklch: ${value}`)
  return { l: match[1], c: Number.parseFloat(match[2]), h: Number.parseFloat(match[3]) }
}

/** @param {{ l: string, c: number, h: number }} color */
function formatOklch(color) {
  const chroma = Number(color.c.toFixed(3))
  const hue = Number(color.h.toFixed(3))
  return `oklch(${color.l} ${chroma} ${hue})`
}

/** @param {string} name */
function readTailwindScale(name) {
  /** @type {Record<number, { l: string, c: number, h: number }>} */
  const scale = {}
  for (const step of ACCENT_STEPS) {
    const match = TAILWIND_THEME_CSS.match(new RegExp(`--color-${name}-${step}:\\s*([^;]+)`))
    if (!match)
      throw new Error(`Missing Tailwind scale --color-${name}-${step}`)
    scale[step] = parseOklch(match[1].trim())
  }
  return scale
}

/** @param {number} step @param {{ chromaScale: number, chromaMin?: number }} config */
function neutralChromaForStep(step, config) {
  const t = step / 950
  const peak = Math.sin(t * Math.PI) * 0.038 + 0.014
  return Math.max(config.chromaMin ?? 0, peak * config.chromaScale)
}

/** @param {string} name */
function buildCustomNeutralScale(name) {
  const config = CUSTOM_NEUTRAL_SCALE_CONFIG[name]
  const baseScale = readTailwindScale(config.base)
  /** @type {Record<number, string>} */
  const scale = {}

  for (const step of ACCENT_STEPS) {
    const base = baseScale[step]
    const chroma = config.base === 'neutral'
      ? neutralChromaForStep(step, config)
      : Math.max(config.chromaMin ?? 0, base.c * config.chromaScale)

    scale[step] = formatOklch({ l: base.l, c: chroma, h: config.hue })
  }

  return scale
}

/** @returns {string} @theme 块：扩展 taupe / mauve / mist / olive 色阶 */
export function buildNeutralScalesCss() {
  const lines = [
    '/* Generated — src/theme/styles/neutral-scales.css (scripts/generate-color-theme-css.mjs) */',
    '@theme {',
  ]

  for (const name of NEUTRAL_CUSTOM_SCALES) {
    const scale = buildCustomNeutralScale(name)
    for (const step of ACCENT_STEPS)
      lines.push(`  --color-${name}-${step}: ${scale[step]};`)
  }

  lines.push('}', '')
  return lines.join('\n')
}

const SURFACE_VAR_MAP = [
  ['background', '--background'],
  ['foreground', '--foreground'],
  ['card', '--card'],
  ['cardForeground', '--card-foreground'],
  ['popover', '--popover'],
  ['popoverForeground', '--popover-foreground'],
  ['secondary', '--secondary'],
  ['secondaryForeground', '--secondary-foreground'],
  ['muted', '--muted'],
  ['mutedForeground', '--muted-foreground'],
  ['accent', '--accent'],
  ['accentForeground', '--accent-foreground'],
  ['border', '--border'],
  ['input', '--input'],
]

function formatSurfaceTokens(tokens) {
  return SURFACE_VAR_MAP.map(([key, cssVar]) => `  ${cssVar}: ${tokens[key]};`).join('\n')
}

function neutralSurfaceBlock(id, mode, tokens) {
  const selector
    = mode === 'light'
      ? `html[data-color-neutral='${id}']`
      : `html.dark[data-color-neutral='${id}'],\nhtml[data-theme='dark'][data-color-neutral='${id}']`

  return `${selector} {\n${formatSurfaceTokens(tokens)}\n}`
}

/** Tailwind 灰阶 step → shadcn 语义 token（无手写 HSL） */
function tailwindNeutralSurfaceTokens(scale, mode) {
  if (mode === 'light') {
    return {
      background: 'var(--color-white)',
      foreground: `var(--color-${scale}-950)`,
      card: 'var(--color-white)',
      cardForeground: `var(--color-${scale}-950)`,
      popover: 'var(--color-white)',
      popoverForeground: `var(--color-${scale}-950)`,
      secondary: `var(--color-${scale}-100)`,
      secondaryForeground: `var(--color-${scale}-900)`,
      muted: `var(--color-${scale}-100)`,
      mutedForeground: `var(--color-${scale}-500)`,
      accent: `var(--color-${scale}-100)`,
      accentForeground: `var(--color-${scale}-900)`,
      border: `var(--color-${scale}-200)`,
      input: `var(--color-${scale}-200)`,
    }
  }

  return {
    background: `var(--color-${scale}-950)`,
    foreground: `var(--color-${scale}-50)`,
    card: `var(--color-${scale}-900)`,
    cardForeground: `var(--color-${scale}-50)`,
    popover: `var(--color-${scale}-950)`,
    popoverForeground: `var(--color-${scale}-50)`,
    secondary: `var(--color-${scale}-800)`,
    secondaryForeground: `var(--color-${scale}-50)`,
    muted: `var(--color-${scale}-800)`,
    mutedForeground: `var(--color-${scale}-400)`,
    accent: `var(--color-${scale}-800)`,
    accentForeground: `var(--color-${scale}-50)`,
    border: `var(--color-${scale}-700)`,
    input: `var(--color-${scale}-700)`,
  }
}

function accentScale(theme) {
  if (theme.accent === 'accent')
    return null

  return ACCENT_STEPS.map(
    step => `  --color-accent-${step}: var(--color-${theme.accent}-${step});`,
  ).join('\n')
}

function grayScale(theme) {
  if (theme.scale === 'gray')
    return null

  return GRAY_STEPS.map(
    step => `  --color-gray-${step}: var(--color-${theme.scale}-${step});`,
  ).join('\n')
}

/** Tailwind primary：亮 500 / 暗 400；black 用 zinc-950 / white */
function tailwindPrimaryTokens(theme) {
  if (theme.id === 'black') {
    return {
      light: {
        primary: 'var(--color-zinc-950)',
        primaryForeground: 'var(--color-white)',
        ring: 'var(--color-zinc-950)',
      },
      dark: {
        primary: 'var(--color-white)',
        primaryForeground: 'var(--color-zinc-950)',
        ring: 'var(--color-zinc-300)',
      },
    }
  }

  const scale = theme.accent

  return {
    light: {
      primary: `var(--color-${scale}-500)`,
      primaryForeground: 'var(--color-white)',
      ring: `var(--color-${scale}-500)`,
    },
    dark: {
      primary: `var(--color-${scale}-400)`,
      primaryForeground: `var(--color-${scale}-950)`,
      ring: `var(--color-${scale}-400)`,
    },
  }
}

function formatPrimaryCssVars(tokens) {
  return [
    `  --primary: ${tokens.primary};`,
    `  --primary-foreground: ${tokens.primaryForeground};`,
    `  --ring: ${tokens.ring};`,
  ].join('\n')
}

function primaryBlock(themeId, mode, tokens) {
  const selector
    = mode === 'light'
      ? `html[data-color-primary='${themeId}']`
      : `html.dark[data-color-primary='${themeId}'],\nhtml[data-theme='dark'][data-color-primary='${themeId}']`

  return `${selector} {\n${formatPrimaryCssVars(tokens)}\n}`
}

/** @param {string} css */
export function validateColorThemesCss(css) {
  /** @type {string[]} */
  const issues = []

  for (const [, left, right] of css.matchAll(/(--color-[a-z]+-\d+):\s*var\((--color-[a-z]+-\d+)\)/g)) {
    if (left === right)
      issues.push(`Circular CSS variable: ${left}`)
  }

  for (const theme of NEUTRAL_THEMES) {
    if (theme.scale === 'gray' && grayScale(theme))
      issues.push(`Neutral "${theme.id}" must not remap gray → gray`)
  }

  for (const theme of PRIMARY_THEMES) {
    if (theme.accent === 'accent' && accentScale(theme))
      issues.push(`Primary "${theme.id}" must not remap accent → accent`)
  }

  if (issues.length)
    throw new Error(`color-tokens.css validation failed:\n${issues.join('\n')}`)
}

/** @param {string} value */
function cssContentLiteral(value) {
  return JSON.stringify(value).slice(1, -1)
}

/** @returns {string} Fallback trigger label from html[data-color-primary] (no JS timing) */
function buildThemeTriggerFallbackLabelBlock() {
  const defaultTheme = PRIMARY_THEMES.find(theme => theme.id === DEFAULT_PRIMARY)
  const defaultLabel = defaultTheme?.label ?? 'Green'

  return [
    '/* Theme trigger label — driven by html[data-color-primary] */',
    `[data-theme-customizer-trigger] [data-part='label']:empty::after {`,
    `  content: '${cssContentLiteral(defaultLabel)}';`,
    '}',
    ...PRIMARY_THEMES.map(
      theme => `html[data-color-primary='${theme.id}'] [data-theme-customizer-trigger] [data-part='label']:empty::after {
  content: '${cssContentLiteral(theme.label)}';
}`,
    ),
  ].join('\n')
}

/** @returns {string} CSS for theme customizer variables */
export function buildColorThemesCss() {
  const primaryBlocks = PRIMARY_THEMES.flatMap((theme) => {
    const tokens = tailwindPrimaryTokens(theme)
    const accentVars = accentScale(theme)
    const accent = accentVars
      ? `html[data-color-primary='${theme.id}'] {\n${accentVars}\n}`
      : null
    const light = primaryBlock(theme.id, 'light', tokens.light)
    const dark = primaryBlock(theme.id, 'dark', tokens.dark)
    return [...(accent ? [accent] : []), light, dark]
  })

  const neutralBlocks = NEUTRAL_THEMES.flatMap((theme) => {
    const grayVars = grayScale(theme)
    const gray = grayVars
      ? `html[data-color-neutral='${theme.id}'] {\n${grayVars}\n}`
      : null
    return [
      ...(gray ? [gray] : []),
      neutralSurfaceBlock(theme.id, 'light', tailwindNeutralSurfaceTokens(theme.scale, 'light')),
      neutralSurfaceBlock(theme.id, 'dark', tailwindNeutralSurfaceTokens(theme.scale, 'dark')),
    ]
  })

  const radiusBlocks = RADIUS_OPTIONS.map(
    option => `html[data-radius='${option.id}'] {\n  --radius: ${option.value};\n}`,
  )

  return `/* Generated — src/theme/styles/color-tokens.css (scripts/generate-color-theme-css.mjs) */\n\n${[
    ...primaryBlocks,
    ...neutralBlocks,
    ...radiusBlocks,
    buildThemeTriggerFallbackLabelBlock(),
  ].join('\n\n')}\n`
}

/** @returns {string} JSON manifest for UI pickers */
export function buildColorThemesJson() {
  return `${JSON.stringify(
    {
      defaultPrimary: DEFAULT_PRIMARY,
      defaultNeutral: DEFAULT_NEUTRAL,
      defaultRadius: DEFAULT_RADIUS,
      defaultColorMode: DEFAULT_COLOR_MODE,
      primaryThemes: PRIMARY_THEMES.map(({ id, label, swatch }) => ({ id, label, swatch })),
      neutralThemes: NEUTRAL_THEMES.map(({ id, label, swatch }) => ({ id, label, swatch })),
      radiusOptions: RADIUS_OPTIONS,
    },
    null,
    2,
  )}\n`
}

/** @deprecated Use PRIMARY_THEMES */
export const COLOR_THEMES = PRIMARY_THEMES
export const DEFAULT_COLOR_THEME = DEFAULT_PRIMARY
