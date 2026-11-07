/** Built-in theme presets aligned with Nuxt UI docs Theme Studio (sans fonts / exotic icon packs). */

export type ThemeIconPack = 'lucide' | 'phosphor' | 'tabler'

export interface ThemePreset {
  id: string
  name: string
  icon: string
  description?: string
  blackAsPrimary?: boolean
  radius: number
  /** Mapped to lucide / phosphor / tabler */
  icons: ThemeIconPack
  colors: {
    primary?: string
    neutral?: string
    secondary?: string
    success?: string
    info?: string
    warning?: string
    error?: string
  }
  /** Custom color ramps injected as --color-{name}-{shade} */
  palettes?: Record<string, Record<string, string>>
}

const ICON_PACK_ALIASES: Record<string, ThemeIconPack> = {
  lucide: 'lucide',
  phosphor: 'phosphor',
  tabler: 'tabler',
  bootstrap: 'lucide',
  iconoir: 'lucide',
  remix: 'lucide',
  material: 'lucide',
  heroicons: 'lucide',
}

export function resolveIconPack(name?: string): ThemeIconPack {
  return ICON_PACK_ALIASES[name || 'lucide'] || 'lucide'
}

export const PRESET_ICONS = {
  default: 'i-simple-icons-nuxt',
  mono: 'i-lucide-contrast',
  cobalt: 'i-lucide-gem',
  sky: 'i-lucide-cloud-sun',
  mint: 'i-lucide-leaf',
  iris: 'i-lucide-flower',
  crimson: 'i-lucide-clapperboard',
  coral: 'i-lucide-shell',
  sunset: 'i-lucide-sunset',
  carbon: 'i-lucide-zap',
  bubblegum: 'i-lucide-candy',
  parchment: 'i-lucide-scroll-text',
} as const

/**
 * Preset chip: icon tinted with primary, on a soft primary gradient
 * (matches ui.nuxt.com ThemeStudioPresetPicker).
 */
export function themeChipStyle(
  preset: ThemePreset,
  known?: Record<string, { light: string; dark: string }>,
) {
  const tint = (color: string, from: number, to: number) =>
    `linear-gradient(135deg, color-mix(in oklab, ${color} ${from}%, transparent), color-mix(in oklab, ${color} ${to}%, transparent))`

  if (preset.blackAsPrimary) {
    return {
      '--chip-bg-light': tint('black', 10, 20),
      '--chip-bg-dark': tint('white', 12, 24),
      '--chip-icon-light': 'black',
      '--chip-icon-dark': 'white',
    }
  }

  const primary = preset.colors.primary || 'green'
  const ramp = preset.palettes?.[primary]
  const knownChip = known?.[primary]
  const light = ramp?.['500'] || knownChip?.light || `var(--color-${primary}-500)`
  const dark = ramp?.['400'] || knownChip?.dark || `var(--color-${primary}-400)`

  return {
    '--chip-bg-light': tint(light, 10, 20),
    '--chip-bg-dark': tint(dark, 12, 24),
    '--chip-icon-light': light,
    '--chip-icon-dark': dark,
  }
}

export const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    icon: PRESET_ICONS.default,
    description: 'The stock theme, everything inherited.',
    radius: 0.25,
    icons: 'lucide',
    colors: { primary: 'green', neutral: 'slate' },
  },
  {
    id: 'mono',
    name: 'Mono',
    icon: PRESET_ICONS.mono,
    description: 'Black on a pure gray neutral, generous radius.',
    blackAsPrimary: true,
    radius: 0.5,
    icons: 'lucide',
    colors: { primary: 'green', neutral: 'neutral' },
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    icon: PRESET_ICONS.cobalt,
    description: 'Utility blue on cool grays, tight corners.',
    radius: 0.125,
    icons: 'lucide',
    colors: {
      primary: 'cobalt',
      secondary: 'cobalt-gray',
      info: 'cyan',
      warning: 'amber',
      neutral: 'cobalt-gray',
    },
    palettes: {
      cobalt: {
        50: 'oklch(95.3% 0.022 260.723)',
        100: 'oklch(90.8% 0.045 258.763)',
        200: 'oklch(81.6% 0.091 257.776)',
        300: 'oklch(72.9% 0.14 258.068)',
        400: 'oklch(64.7% 0.186 258.256)',
        500: 'oklch(57.8% 0.228 260.025)',
        600: 'oklch(49.2% 0.19 259.799)',
        700: 'oklch(40.2% 0.152 259.656)',
        800: 'oklch(30.7% 0.109 258.934)',
        900: 'oklch(20.4% 0.063 257.52)',
        950: 'oklch(14.7% 0.037 249.929)',
      },
      'cobalt-gray': {
        50: 'oklch(99.1% 0 0)',
        100: 'oklch(98.2% 0.002 247.839)',
        200: 'oklch(94.2% 0.005 247.879)',
        300: 'oklch(91.1% 0.007 247.901)',
        400: 'oklch(86.7% 0.011 247.949)',
        500: 'oklch(76.9% 0.015 248.017)',
        600: 'oklch(55.8% 0.016 244.893)',
        700: 'oklch(42.8% 0.015 248.172)',
        800: 'oklch(34.5% 0.013 248.212)',
        900: 'oklch(26.2% 0.009 248.19)',
        950: 'oklch(20.7% 0.008 248.192)',
      },
    },
  },
  {
    id: 'sky',
    name: 'Sky',
    icon: PRESET_ICONS.sky,
    description: 'Sky primary on mist neutrals.',
    radius: 0.75,
    icons: 'lucide',
    colors: { primary: 'sky', neutral: 'mist' },
  },
  {
    id: 'mint',
    name: 'Mint',
    icon: PRESET_ICONS.mint,
    description: 'Teal primary on olive neutrals.',
    radius: 0.75,
    icons: 'lucide',
    colors: { primary: 'teal', neutral: 'olive' },
  },
  {
    id: 'iris',
    name: 'Iris',
    icon: PRESET_ICONS.iris,
    description: 'Violet primary on mauve neutrals.',
    radius: 0.5,
    icons: 'lucide',
    colors: { primary: 'violet', secondary: 'fuchsia', neutral: 'mauve' },
  },
  {
    id: 'crimson',
    name: 'Crimson',
    icon: PRESET_ICONS.crimson,
    description: 'Red primary, sharp corners.',
    radius: 0,
    icons: 'lucide',
    colors: { primary: 'red', neutral: 'neutral' },
  },
  {
    id: 'coral',
    name: 'Coral',
    icon: PRESET_ICONS.coral,
    description: 'Rose primary with phosphor icons.',
    radius: 0.5,
    icons: 'phosphor',
    colors: { primary: 'rose', success: 'teal', neutral: 'stone' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: PRESET_ICONS.sunset,
    description: 'Orange primary on taupe neutrals.',
    radius: 0.625,
    icons: 'tabler',
    colors: { primary: 'orange', secondary: 'yellow', neutral: 'taupe' },
  },
  {
    id: 'carbon',
    name: 'Carbon',
    icon: PRESET_ICONS.carbon,
    description: 'Amber on a warm carbon neutral.',
    radius: 0.5,
    icons: 'tabler',
    colors: { primary: 'amber', secondary: 'yellow', neutral: 'carbon' },
    palettes: {
      carbon: {
        50: 'oklch(98.5% 0.017 447.457)',
        100: 'oklch(95.9% 0.036 438.639)',
        200: 'oklch(92.6% 0.054 428.8)',
        300: 'oklch(87% 0.053 417.734)',
        400: 'oklch(70.5% 0.032 405.184)',
        500: 'oklch(55.3% 0.014 390.836)',
        600: 'oklch(44.7% 0.001 374.343)',
        700: 'oklch(35.9% 0 0)',
        800: 'oklch(28% 0 0)',
        900: 'oklch(20.8% 0 0)',
        950: 'oklch(14.1% 0.005 285.805)',
      },
    },
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    icon: PRESET_ICONS.bubblegum,
    description: 'Pastel pink with mauve-tinted grays.',
    radius: 0.375,
    icons: 'phosphor',
    colors: { primary: 'pink', secondary: 'violet', neutral: 'saturated-mauve' },
    palettes: {
      'saturated-mauve': {
        50: 'oklch(96.1% 0.021 325.68)',
        100: 'oklch(92.4% 0.039 325.829)',
        200: 'oklch(88% 0.057 325.83)',
        300: 'oklch(81.2% 0.073 325.398)',
        400: 'oklch(66.1% 0.084 323.292)',
        500: 'oklch(52.4% 0.079 322.443)',
        600: 'oklch(42.7% 0.064 322.128)',
        700: 'oklch(34.6% 0.048 322.004)',
        800: 'oklch(27.4% 0.034 321.983)',
        900: 'oklch(20.7% 0.02 322.028)',
        950: 'oklch(14.5% 0.008 322.12)',
      },
    },
  },
  {
    id: 'parchment',
    name: 'Parchment',
    icon: PRESET_ICONS.parchment,
    description: 'Warm parchment neutrals with clay primary.',
    radius: 0.375,
    icons: 'lucide',
    colors: { primary: 'clay', neutral: 'parchment' },
    palettes: {
      clay: {
        50: 'oklch(97.4% 0.009 48.308)',
        100: 'oklch(94.2% 0.019 52.207)',
        200: 'oklch(88.5% 0.036 51.142)',
        300: 'oklch(82.1% 0.058 50.392)',
        400: 'oklch(74.1% 0.094 47.255)',
        500: 'oklch(67.2% 0.131 38.798)',
        600: 'oklch(58.9% 0.138 37.63)',
        700: 'oklch(51.4% 0.123 37.45)',
        800: 'oklch(44.4% 0.103 36.916)',
        900: 'oklch(38.8% 0.086 36.46)',
        950: 'oklch(25.9% 0.054 38.197)',
      },
      parchment: {
        50: 'oklch(98% 0.006 100)',
        100: 'oklch(96.5% 0.011 99)',
        200: 'oklch(93.6% 0.014 97.348)',
        300: 'oklch(85.8% 0.018 100)',
        400: 'oklch(72.1% 0.015 102.54)',
        500: 'oklch(57.8% 0.008 88.877)',
        600: 'oklch(43.2% 0.006 91.526)',
        700: 'oklch(38.2% 0.003 84.572)',
        800: 'oklch(29.3% 0.003 106.588)',
        900: 'oklch(21.7% 0.002 106.561)',
        950: 'oklch(14.6% 0 0)',
      },
    },
  },
]

export function getPreset(id: string) {
  return themePresets.find((preset) => preset.id === id)
}

export function palettesToCss(palettes: Record<string, Record<string, string>> = {}) {
  const lines = Object.entries(palettes).flatMap(([name, shades]) =>
    Object.entries(shades).map(([shade, value]) => `  --color-${name}-${shade}: ${value};`),
  )
  return lines.length ? `:root {\n${lines.join('\n')}\n}` : ':root {}'
}
