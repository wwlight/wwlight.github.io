/**
 * 功能：document.documentElement 上的主题 data 属性名（与 init.inline.js 一致）。
 * 问题：`data-color-theme` 为 legacy，与 `data-color-primary` 重复，待全库清理后删除。
 */
export const SITE_THEME_DATA_ATTRIBUTES = {
  colorMode: 'data-theme',
  primary: 'data-color-primary',
  neutral: 'data-color-neutral',
  radius: 'data-radius',
  primaryLegacy: 'data-color-theme',
} as const
