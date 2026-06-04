/** 主题系统公共 API — 模块外优先 `import { … } from '@/theme'` */
export * from './lib/color-mode/color-mode'
export * from './lib/customizer/options'
export * from './lib/customizer/state'
export * from './lib/customizer/trigger-classes'
export * from './lib/customizer/surface'
export * from './lib/site/sync'
export { SITE_THEME_DATA_ATTRIBUTES } from './lib/site/data-attributes'

export { ThemeProvider, useTheme } from './components/color-mode/Provider'
