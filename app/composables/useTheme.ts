import { defu } from 'defu'
import { useLocalStorage } from '@vueuse/core'
import { themeIcons, cssVariableDefaults } from '../utils/theme'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

// 字体切换时等待字体就绪的上限（ms）。正常情况字体就绪即切（秒级）；该值仅在缓存未命中
// 或分包现场生成等极端情况下兜底，避免切换永久卡住。
const FONT_SWITCH_TIMEOUT = 30000

// 默认字体静态引入，保证首屏有 @font-face（其余字体按需动态加载）
import '../assets/fonts/LXGWWenKai-Regular.ttf?subsets'
const STATIC_FAMILIES = new Set(['LXGW WenKai'])

// family -> 动态 import（不用 import.meta.glob：glob 会进 SSR 静态依赖，首屏注入所有字体 css）
const familyLoader = new Map<string, () => Promise<any>>()
{
  const defs: Array<[string, () => Promise<any>]> = [
    ['LXGW WenKai', () => import('../assets/fonts/LXGWWenKai-Regular.ttf?subsets')],
    ['LXGW WenKai Light', () => import('../assets/fonts/LXGWWenKai-Light.ttf?subsets')],
    ['LXGW WenKai Medium', () => import('../assets/fonts/LXGWWenKai-Medium.ttf?subsets')],
    ['ZCOOL KuaiLe', () => import('../assets/fonts/ZCOOLKuaiLe-Regular.ttf?subsets')],
    ['Fira Code', () => import('../assets/fonts/FiraCode.ttf?subsets')],
    ['KingHwa_OldSong', () => import('../assets/fonts/KingHwa_OldSong.ttf?subsets')],
    ['Huiwen-mincho', () => import('../assets/fonts/Huiwen-mincho.ttf?subsets')],
    ['STDongGuanTi', () => import('../assets/fonts/STDongGuanTi.ttf?subsets')],
    ['STDongGuanTi Bld', () => import('../assets/fonts/STDongGuanTi-Bld.ttf?subsets')],
    ['STDongGuanTi Light', () => import('../assets/fonts/STDongGuanTi-Light.ttf?subsets')],
    ['LXGW Bright', () => import('../assets/fonts/LXGWBright-Regular.ttf?subsets')],
    ['LXGW Bright Light', () => import('../assets/fonts/LXGWBright-Light.ttf?subsets')],
    ['LXGW Bright Medium', () => import('../assets/fonts/LXGWBright-Medium.ttf?subsets')]
  ]
  for (const [fam, loader] of defs) familyLoader.set(fam, loader)
}

function readLocalStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const SAFE_NAME = /^[\w -]{1,50}$/
const SAFE_HEX = /^#[0-9a-f]{3,8}$/i
const SAFE_CSS_VAR_KEY = /^--[\w-]+$/
const SAFE_CSS_VAR_VALUE = /^(?:var\(--[\w-]+\)|#[0-9a-f]{3,8}|[a-z]+)$/i

function sanitizeCustomColors(input: Record<string, any>): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  for (const [name, shades] of Object.entries(input)) {
    if (!SAFE_NAME.test(name) || typeof shades !== 'object' || !shades) continue
    const safeShades: Record<string, string> = {}
    for (const [shade, hex] of Object.entries(shades as Record<string, unknown>)) {
      if (/^\d{2,3}$/.test(shade) && typeof hex === 'string' && SAFE_HEX.test(hex)) {
        safeShades[shade] = hex
      }
    }
    if (Object.keys(safeShades).length) result[name] = safeShades
  }
  return result
}

function sanitizeCSSVariables(input: { light?: Record<string, any>, dark?: Record<string, any> }): { light: Record<string, string>, dark: Record<string, string> } {
  const clean = (vars?: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(vars || {})) {
      if (SAFE_CSS_VAR_KEY.test(key) && typeof value === 'string' && SAFE_CSS_VAR_VALUE.test(value)) {
        result[key] = value
      }
    }
    return result
  }
  return { light: clean(input.light), dark: clean(input.dark) }
}

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()

  const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')

  const aiThemeExtras = useState<Record<string, any>>('nuxt-ui-ai-theme', () => readLocalStorage('nuxt-ui-ai-theme', {}))
  const customColorsData = useState<Record<string, Record<string, string>>>('nuxt-ui-custom-colors', () => readLocalStorage('nuxt-ui-custom-colors', {}))
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>('nuxt-ui-css-variables', () => readLocalStorage('nuxt-ui-css-variables', {}))
  const _radius = useLocalStorage('nuxt-ui-radius', 0.25)
  const _font = useLocalStorage('nuxt-ui-font', 'LXGW WenKai')
  const _weight = useLocalStorage('nuxt-ui-font-weight', 'LXGW WenKai')
  const _iconSet = useLocalStorage('nuxt-ui-icons', 'lucide')
  const _blackAsPrimary = useLocalStorage('nuxt-ui-black-as-primary', false)

  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      window.localStorage.setItem('nuxt-ui-neutral', appConfig.ui.colors.neutral)
    }
  })

  const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
  const primaryColors = Object.keys(omit(colors, colorsToOmit as any))
  const primary = computed({
    get() {
      return appConfig.ui.colors.primary
    },
    set(option) {
      appConfig.ui.colors.primary = option
      window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.colors.primary)
      setBlackAsPrimary(false)
    }
  })

  const radiuses = [0, 0.125, 0.25, 0.375, 0.5]
  const radius = computed({
    get() {
      return _radius.value
    },
    set(option) {
      _radius.value = option
    }
  })

  const fonts = [
    {
      label: 'LXGW WenKai', value: 'LXGW WenKai',
      weights: [
        { label: 'Regular', value: 'LXGW WenKai' },
        { label: 'Light', value: 'LXGW WenKai Light' },
        { label: 'Medium', value: 'LXGW WenKai Medium' }
      ]
    },
    {
      label: 'LXGW WK Bright', value: 'LXGW Bright',
      weights: [
        { label: 'Regular', value: 'LXGW Bright' },
        { label: 'Light', value: 'LXGW Bright Light' },
        { label: 'Medium', value: 'LXGW Bright Medium' }
      ]
    },
    { label: '京華老宋体', value: 'KingHwa_OldSong' },
    { label: '汇文明朝体', value: 'Huiwen-mincho' },
    {
      label: '上图东观体', value: 'STDongGuanTi',
      weights: [
        { label: 'Regular', value: 'STDongGuanTi' },
        { label: 'Bold', value: 'STDongGuanTi Bld' },
        { label: 'Light', value: 'STDongGuanTi Light' }
      ]
    },
    { label: 'ZCOOL KuaiLe', value: 'ZCOOL KuaiLe' },
    { label: 'Fira Code', value: 'Fira Code' }
  ]
  // 已加载的 family 避免重复；默认字体已静态引入
  const loadedFonts = new Set<string>(STATIC_FAMILIES)
  async function ensureFont(family: string | undefined) {
    if (!family || loadedFonts.has(family)) return
    const loader = familyLoader.get(family)
    if (!loader) return
    loadedFonts.add(family)
    try {
      await loader()
    } catch (e) {
      // 单字体失败不影响整体
    }
  }
  // 当前选中字体的字重列表（带字重才有，value 即实际 CSS family 名）；无字重的字体为空
  const currentFont = computed(() => fonts.find(f => f.value === _font.value))
  const fontWeights = computed(() => currentFont.value?.weights ?? [])
  const weight = computed({
    get() {
      return _weight.value
    },
    set(option) {
      _weight.value = option
    }
  })
  // 按选中字重解析实际 family（value 即 CSS family 名）
  const resolveFontFamily = (name: string) => {
    const f = fonts.find(x => x.value === name)
    if (f?.weights?.length && f.weights.some(w => w.value === _weight.value)) return _weight.value
    return name
  }

  const font = computed({
    get() {
      return _font.value
    },
    set(option) {
      if (option === _font.value) return
      _font.value = option
      // 切换字体时同步字重：带字重默认选第一个，无字重则清空
      const f = fonts.find(x => x.value === option)
      if (f?.weights?.length) {
        _weight.value = f.weights[0]!.value
      } else {
        _weight.value = ''
      }
      // 生效切族统一由 pendingFamily 的 watch 触发
    }
  })

  // 用户选中的目标 family（跟随 _font/_weight，切字族或字重都会变化）
  const pendingFamily = computed(() => resolveFontFamily(_font.value))
  // 当前生效 family；切换时才加载对应分包
  const applyFamily = ref(pendingFamily.value)

  // 直接改 #nuxt-ui-font 的 style 内容，绕过 unhead 更新链路，保证运行时即时生效
  function writeFontStyle(family: string) {
    applyFamily.value = family
    if (!import.meta.client) return
    const el = document.getElementById('nuxt-ui-font')
    const css = `:root { --font-sans: '${family}', sans-serif; }`
    if (el) el.textContent = css
  }

  // 字体（分包 @font-face 注入 + woff2 下载）就绪后再切换；超时仅兜底防挂死
  async function applyFont(family: string) {
    if (family === applyFamily.value && loadedFonts.has(family)) return
    const ready = (async () => {
      await ensureFont(family)
      if (import.meta.client && 'fonts' in document) {
        await Promise.all([
          document.fonts.load(`16px '${family}'`, '中文字体测试样例').catch(() => undefined),
          document.fonts.load(`16px '${family}'`, 'Latin sample 0123').catch(() => undefined),
        ])
      }
    })()
    await Promise.race([ready, new Promise<void>(resolve => setTimeout(resolve, FONT_SWITCH_TIMEOUT))])
    writeFontStyle(family)
  }

  watch(applyFamily, (f) => { void ensureFont(f) }, { immediate: true })
  watch(pendingFamily, (f) => { if (f !== applyFamily.value) void applyFont(f) }, { immediate: true })

  const icons = [{
    label: 'Lucide',
    icon: 'i-lucide-feather',
    value: 'lucide'
  }, {
    label: 'Phosphor',
    icon: 'i-ph-phosphor-logo',
    value: 'phosphor'
  }, {
    label: 'Tabler',
    icon: 'i-tabler-brand-tabler',
    value: 'tabler'
  }]
  const icon = computed({
    get() {
      return _iconSet.value
    },
    set(option) {
      _iconSet.value = option
      appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
    }
  })

  const modes = computed((): { label: 'light' | 'dark' | 'system', icon: string }[] => [
    { label: 'light', icon: appConfig.ui.icons.light },
    { label: 'dark', icon: appConfig.ui.icons.dark },
    { label: 'system', icon: appConfig.ui.icons.system }
  ])
  const mode = computed({
    get() {
      return colorMode.value
    },
    set(option) {
      colorMode.preference = option
    }
  })

  const blackAsPrimary = computed(() => _blackAsPrimary.value)

  function setBlackAsPrimary(value: boolean) {
    _blackAsPrimary.value = value
  }

  const hasCustomColors = computed(() => Object.keys(customColorsData.value).length > 0)
  const hasCSSVariables = computed(() => Object.keys(cssVariablesData.value.light || {}).length > 0 || Object.keys(cssVariablesData.value.dark || {}).length > 0)

  const radiusStyle = computed(() => `:root { --ui-radius: ${_radius.value}rem; }`)
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => `:root { --font-sans: '${applyFamily.value}', sans-serif; }`)
  const customColorsStyle = computed(() => {
    const entries = Object.entries(customColorsData.value)
    if (!entries.length) return ''
    const vars = entries.flatMap(([name, shades]) =>
      Object.entries(shades).map(([shade, hex]) => `--color-${name}-${shade}: ${hex};`)
    )
    return `:root { ${vars.join(' ')} }`
  })
  const cssVariablesStyle = computed(() => {
    const data = cssVariablesData.value
    const parts: string[] = []
    if (Object.keys(data.light || {}).length) {
      const full = { ...cssVariableDefaults.light, ...data.light }
      parts.push(`.light { ${Object.entries(full).map(([k, v]) => `${k}: ${v};`).join(' ')} }`)
    }
    if (Object.keys(data.dark || {}).length) {
      const full = { ...cssVariableDefaults.dark, ...data.dark }
      parts.push(`.dark { ${Object.entries(full).map(([k, v]) => `${k}: ${v};`).join(' ')} }`)
    }
    return parts.join(' ')
  })

  const link = computed(() => [])

  const style = [
    { innerHTML: radiusStyle, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: fontStyle, id: 'nuxt-ui-font', tagPriority: -2 },
    { innerHTML: customColorsStyle, id: 'chat-custom-colors', tagPriority: -2 },
    { innerHTML: cssVariablesStyle, id: 'chat-css-variables', tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return _radius.value !== 0.25
      || _blackAsPrimary.value
      || _font.value !== 'LXGW WenKai'
      || hasCustomColors.value
      || hasCSSVariables.value
  })

  const hasConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || _iconSet.value !== 'lucide'
      || !!aiThemeExtras.value.colors
      || !!aiThemeExtras.value.ui
  })

  function exportCSS(): string {
    const lines = [
      '@import "tailwindcss";',
      '@import "@nuxt/ui";'
    ]

    lines.push('', '@theme {', `  --font-sans: '${applyFamily.value}', sans-serif;`, '}')

    const colorLines: string[] = []
    for (const [name, shades] of Object.entries(customColorsData.value)) {
      for (const [shade, hex] of Object.entries(shades)) {
        colorLines.push(`  --color-${name}-${shade}: ${hex};`)
      }
    }

    if (colorLines.length) {
      lines.push('', '@theme static {', ...colorLines, '}')
    }

    const lightOverrides = Object.entries(cssVariablesData.value.light || {}).filter(([key, val]) => val !== cssVariableDefaults.light[key as keyof typeof cssVariableDefaults.light])
    const darkOverrides = Object.entries(cssVariablesData.value.dark || {}).filter(([key, val]) => val !== cssVariableDefaults.dark[key as keyof typeof cssVariableDefaults.dark])

    const rootLines: string[] = []
    if (_radius.value !== 0.25) {
      rootLines.push(`  --ui-radius: ${_radius.value}rem;`)
    }
    if (_blackAsPrimary.value) {
      rootLines.push('  --ui-primary: black;')
    }

    if (rootLines.length) {
      lines.push('', ':root {', ...rootLines, '}')
    }

    if (lightOverrides.length) {
      lines.push('', ':root, .light {', ...lightOverrides.map(([key, val]) => `  ${key}: ${val};`), '}')
    }

    const darkLines: string[] = []
    if (_blackAsPrimary.value) {
      darkLines.push('  --ui-primary: white;')
    }
    if (darkOverrides.length) {
      darkLines.push(...darkOverrides.map(([key, val]) => `  ${key}: ${val};`))
    }

    if (darkLines.length) {
      lines.push('', '.dark {', ...darkLines, '}')
    }

    return lines.join('\n')
  }

  function exportConfig(): string {
    const config: Record<string, any> = {}

    const defaultColors: Record<string, string> = { primary: 'green', neutral: 'slate', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const colorEntries = Object.entries(defaultColors).filter(([key, def]) => (appConfig.ui.colors as any)[key] !== def)
    if (colorEntries.length) {
      config.ui = { colors: Object.fromEntries(colorEntries.map(([key]) => [key, (appConfig.ui.colors as any)[key]])) }
    }

    if (_iconSet.value !== 'lucide') {
      const iconMapping = themeIcons[_iconSet.value as keyof typeof themeIcons]
      config.ui = config.ui || {}
      config.ui.icons = iconMapping
    }

    const extras = aiThemeExtras.value
    if (extras.ui) {
      config.ui = config.ui || {}
      Object.assign(config.ui, extras.ui)
    }

    const configString = JSON.stringify(config, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    return `export default defineAppConfig(${configString})`
  }

  function injectCustomColors(customColors: Record<string, Record<string, string>>) {
    const merged = { ...customColorsData.value, ...customColors }
    customColorsData.value = merged
    window.localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(merged))
  }

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const merged = {
      light: { ...cssVariablesData.value.light, ...cssVariables.light },
      dark: { ...cssVariablesData.value.dark, ...cssVariables.dark }
    }
    cssVariablesData.value = merged
    window.localStorage.setItem('nuxt-ui-css-variables', JSON.stringify(merged))
  }

  function applyThemeSettings(settings: Record<string, any>) {
    if (settings.customColors && typeof settings.customColors === 'object') {
      const safeCustomColors = sanitizeCustomColors(settings.customColors)
      if (Object.keys(safeCustomColors).length) injectCustomColors(safeCustomColors)
    }

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(sanitizeCSSVariables(settings.cssVariables))
    }

    if (settings.primary && SAFE_NAME.test(settings.primary)) primary.value = settings.primary
    if (settings.neutral && neutralColors.includes(settings.neutral)) neutral.value = settings.neutral
    if (settings.radius !== undefined && Number.isFinite(Number(settings.radius))) radius.value = Number(settings.radius)
    if (settings.font && SAFE_NAME.test(settings.font)) font.value = settings.font
    if (settings.icons && settings.icons in themeIcons) icon.value = settings.icons
    if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(!!settings.blackAsPrimary)

    const colorKeys = ['secondary', 'success', 'info', 'warning', 'error'] as const
    const savedExtras: Record<string, any> = { ...aiThemeExtras.value }

    for (const color of colorKeys) {
      if (settings[color] && SAFE_NAME.test(settings[color])) {
        (appConfig.ui.colors as any)[color] = settings[color]
        savedExtras.colors = savedExtras.colors || {}
        savedExtras.colors[color] = settings[color]
      }
    }

    if (settings.ui) {
      savedExtras.ui = savedExtras.ui || {}
      for (const [key, value] of Object.entries(settings.ui)) {
        if (key === 'colors' || key === '__proto__' || key === 'constructor' || key === 'prototype') continue

        const merged = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {}, savedExtras.ui[key] || {})
        ;(appConfig.ui as any)[key] = merged
        savedExtras.ui[key] = merged
      }
    }

    aiThemeExtras.value = savedExtras
    window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))
  }

  function resetTheme() {
    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem('nuxt-ui-primary')

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem('nuxt-ui-neutral')

    _radius.value = 0.25
    _font.value = 'LXGW WenKai'
    _weight.value = 'LXGW WenKai'
    _iconSet.value = 'lucide'
    appConfig.ui.icons = themeIcons.lucide as any
    _blackAsPrimary.value = false

    const defaultColors: Record<string, string> = { secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const extras = aiThemeExtras.value
    if (extras.colors) {
      for (const key of Object.keys(extras.colors)) {
        (appConfig.ui.colors as any)[key] = defaultColors[key] || (appConfig.ui.colors as any)[key]
      }
    }
    if (extras.ui) {
      for (const key of Object.keys(extras.ui)) {
        if (key === 'colors' || key === 'icons') continue
        (appConfig.ui as any)[key] = undefined
      }
    }
    window.localStorage.removeItem('nuxt-ui-ai-theme')
    window.localStorage.removeItem('nuxt-ui-custom-colors')
    window.localStorage.removeItem('nuxt-ui-css-variables')
    aiThemeExtras.value = {}
    customColorsData.value = {}
    cssVariablesData.value = {}

    if (import.meta.client) {
      document.getElementById('chat-css-variables')?.replaceChildren()
      document.getElementById('chat-custom-colors')?.replaceChildren()
    }
  }

  return {
    color,
    style,
    link,
    neutralColors,
    neutral,
    primaryColors,
    primary,
    blackAsPrimary,
    setBlackAsPrimary,
    radiuses,
    radius,
    fonts,
    font,
    fontWeights,
    weight,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasConfigChanges,
    configLabel: computed(() => 'app.config.ts'),
    exportCSS,
    exportConfig,
    applyThemeSettings,
    resetTheme
  }
}
