/** @typedef {{ primary: string, primaryForeground: string, ring: string }} ShadcnTokens */

/** @typedef {{ id: string, label: string, accent: string, swatch: string, special?: 'black' }} PrimaryThemeDefinition */

/** @typedef {{ id: string, label: string, scale: string, swatch: string, preset?: string }} NeutralThemeDefinition */

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

function primaryLabel(id) {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

/** @type {PrimaryThemeDefinition[]} */
export const PRIMARY_THEMES = [
  {
    id: 'black',
    label: 'Black',
    accent: 'zinc',
    // Panel 预览：var(--theme-primary-swatch-black)，见 styles/customizer-trigger.css（非 var(--primary)，未选中时 primary 仍是别的色）
    swatch: 'var(--theme-primary-swatch-black)',
    special: 'black',
  },
  ...CHROMA_PRIMARY_SCALES.map(scale => ({
    id: scale,
    label: primaryLabel(scale),
    accent: scale,
    swatch: `var(--color-${scale}-500)`,
  })),
]

/** @type {NeutralThemeDefinition[]} */
export const NEUTRAL_THEMES = [
  { id: 'slate', label: 'Slate', scale: 'slate', preset: 'slate', swatch: 'hsl(215 16% 47%)' },
  { id: 'gray', label: 'Gray', scale: 'gray', preset: 'gray', swatch: 'hsl(220 9% 46%)' },
  { id: 'zinc', label: 'Zinc', scale: 'zinc', preset: 'zinc', swatch: 'hsl(240 5% 64%)' },
  { id: 'neutral', label: 'Neutral', scale: 'neutral', preset: 'neutral', swatch: 'hsl(0 0% 45%)' },
  { id: 'stone', label: 'Stone', scale: 'stone', preset: 'stone', swatch: 'hsl(25 5% 45%)' },
  { id: 'taupe', label: 'Taupe', scale: 'stone', preset: 'stone', swatch: 'hsl(30 6% 42%)' },
  { id: 'mauve', label: 'Mauve', scale: 'gray', preset: 'gray', swatch: 'hsl(270 5% 48%)' },
  { id: 'mist', label: 'Mist', scale: 'slate', preset: 'slate', swatch: 'hsl(210 12% 55%)' },
  { id: 'olive', label: 'Olive', scale: 'neutral', preset: 'neutral', swatch: 'hsl(80 6% 42%)' },
]

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

/** shadcn 表面语义色（与 primary / ring 分离，供书签页 shadcn 组件使用） */
const SHADCN_NEUTRAL_PRESETS = {
  slate: {
    light: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
    },
    dark: {
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      cardForeground: '210 40% 98%',
      popover: '222.2 84% 4.9%',
      popoverForeground: '210 40% 98%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
    },
  },
  gray: {
    light: {
      background: '0 0% 100%',
      foreground: '224 71.4% 4.1%',
      card: '0 0% 100%',
      cardForeground: '224 71.4% 4.1%',
      popover: '0 0% 100%',
      popoverForeground: '224 71.4% 4.1%',
      secondary: '220 14.3% 95.9%',
      secondaryForeground: '220.9 39.3% 11%',
      muted: '220 14.3% 95.9%',
      mutedForeground: '220 8.9% 46.1%',
      accent: '220 14.3% 95.9%',
      accentForeground: '220.9 39.3% 11%',
      border: '220 13% 91%',
      input: '220 13% 91%',
    },
    dark: {
      background: '224 71.4% 4.1%',
      foreground: '210 20% 98%',
      card: '224 71.4% 4.1%',
      cardForeground: '210 20% 98%',
      popover: '224 71.4% 4.1%',
      popoverForeground: '210 20% 98%',
      secondary: '215 27.9% 16.9%',
      secondaryForeground: '210 20% 98%',
      muted: '215 27.9% 16.9%',
      mutedForeground: '217.9 10.6% 64.9%',
      accent: '215 27.9% 16.9%',
      accentForeground: '210 20% 98%',
      border: '215 27.9% 16.9%',
      input: '215 27.9% 16.9%',
    },
  },
  zinc: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      card: '240 10% 3.9%',
      cardForeground: '0 0% 98%',
      popover: '240 10% 3.9%',
      popoverForeground: '0 0% 98%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '240 3.7% 15.9%',
      mutedForeground: '240 5% 64.9%',
      accent: '240 3.7% 15.9%',
      accentForeground: '0 0% 98%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
    },
  },
  neutral: {
    light: {
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '0 0% 3.9%',
      secondary: '0 0% 96.1%',
      secondaryForeground: '0 0% 9%',
      muted: '0 0% 96.1%',
      mutedForeground: '0 0% 45.1%',
      accent: '0 0% 96.1%',
      accentForeground: '0 0% 9%',
      border: '0 0% 89.8%',
      input: '0 0% 89.8%',
    },
    dark: {
      background: '0 0% 3.9%',
      foreground: '0 0% 98%',
      card: '0 0% 3.9%',
      cardForeground: '0 0% 98%',
      popover: '0 0% 3.9%',
      popoverForeground: '0 0% 98%',
      secondary: '0 0% 14.9%',
      secondaryForeground: '0 0% 98%',
      muted: '0 0% 14.9%',
      mutedForeground: '0 0% 63.9%',
      accent: '0 0% 14.9%',
      accentForeground: '0 0% 98%',
      border: '0 0% 14.9%',
      input: '0 0% 14.9%',
    },
  },
  stone: {
    light: {
      background: '0 0% 100%',
      foreground: '20 14.3% 4.1%',
      card: '0 0% 100%',
      cardForeground: '20 14.3% 4.1%',
      popover: '0 0% 100%',
      popoverForeground: '20 14.3% 4.1%',
      secondary: '60 4.8% 95.9%',
      secondaryForeground: '24 9.8% 10%',
      muted: '60 4.8% 95.9%',
      mutedForeground: '25 5.3% 44.7%',
      accent: '60 4.8% 95.9%',
      accentForeground: '24 9.8% 10%',
      border: '20 5.9% 90%',
      input: '20 5.9% 90%',
    },
    dark: {
      background: '20 14.3% 4.1%',
      foreground: '60 9.1% 97.8%',
      card: '20 14.3% 4.1%',
      cardForeground: '60 9.1% 97.8%',
      popover: '20 14.3% 4.1%',
      popoverForeground: '60 9.1% 97.8%',
      secondary: '12 6.5% 15.1%',
      secondaryForeground: '60 9.1% 97.8%',
      muted: '12 6.5% 15.1%',
      mutedForeground: '24 5.4% 63.9%',
      accent: '12 6.5% 15.1%',
      accentForeground: '60 9.1% 97.8%',
      border: '12 6.5% 15.1%',
      input: '12 6.5% 15.1%',
    },
  },
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

function shadcnNeutralSurfaceBlock(id, mode, tokens) {
  const selector
    = mode === 'light'
      ? `html[data-color-neutral='${id}']`
      : `html.dark[data-color-neutral='${id}'],\nhtml[data-theme='dark'][data-color-neutral='${id}']`

  return `${selector} {\n${formatSurfaceTokens(tokens)}\n}`
}

const ACCENT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const GRAY_STEPS = ACCENT_STEPS

function accentScale(theme) {
  // Starlight `--color-accent-*`; remapping accent → accent would be circular.
  if (theme.accent === 'accent')
    return null

  return ACCENT_STEPS.map(
    step => `  --color-accent-${step}: var(--color-${theme.accent}-${step});`,
  ).join('\n')
}

function grayScale(theme) {
  // Starlight reads `--color-gray-*`; remapping gray → gray is circular and breaks borders.
  if (theme.scale === 'gray')
    return null

  return GRAY_STEPS.map(
    step => `  --color-gray-${step}: var(--color-${theme.scale}-${step});`,
  ).join('\n')
}

/** Tailwind primary：亮 500 / 暗 400（Nuxt --ui-primary），前景同块设置 */
function tailwindPrimaryTokens(theme) {
  if (theme.special === 'black') {
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

function shadcnPrimaryBlock(themeId, mode, tokens) {
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
    const light = shadcnPrimaryBlock(theme.id, 'light', tokens.light)
    const dark = shadcnPrimaryBlock(theme.id, 'dark', tokens.dark)
    return [...(accent ? [accent] : []), light, dark]
  })

  const neutralBlocks = NEUTRAL_THEMES.flatMap((theme) => {
    const preset = SHADCN_NEUTRAL_PRESETS[theme.preset || theme.id]
    const grayVars = grayScale(theme)
    const gray = grayVars
      ? `html[data-color-neutral='${theme.id}'] {\n${grayVars}\n}`
      : null
    if (!preset)
      return gray ? [gray] : []
    return [
      ...(gray ? [gray] : []),
      shadcnNeutralSurfaceBlock(theme.id, 'light', preset.light),
      shadcnNeutralSurfaceBlock(theme.id, 'dark', preset.dark),
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
