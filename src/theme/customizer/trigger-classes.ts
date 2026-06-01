/**
 * 功能：定制器触发按钮、Popover、色块圆点的 Tailwind 类名。
 * 问题：starlight / bookmarks 两套表面色硬编码，未共用 design token。
 */
import { cn } from '@/lib/utils'

export const THEME_CUSTOMIZER_TRIGGER_SELECTOR = '[data-theme-customizer-trigger]'

export type ThemeSurface = 'bookmarks' | 'starlight'

export function themeCustomizerSwatchClass() {
  return 'size-2.5 shrink-0 rounded-full'
}

export function themeCustomizerTriggerButtonClass(
  variant: ThemeSurface,
  className?: string,
) {
  return cn(
    'theme-r-lg inline-flex h-9 min-w-[7.25rem] cursor-pointer items-center gap-2 px-2.5 py-0.5 border shadow-sm text-xs transition-colors',
    variant === 'starlight'
      ? 'border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] text-[var(--sl-color-gray-2)] hover:bg-[var(--sl-color-gray-6)] hover:text-[var(--sl-color-white)]'
      : 'border-border bg-card text-foreground hover:bg-accent/50',
    className,
  )
}

export function themeCustomizerTriggerLabelClass() {
  return 'w-[7ch] shrink-0 truncate text-center'
}

export function themeCustomizerPopoverClass(variant: ThemeSurface) {
  return cn(
    'theme-customizer-popover app-scrollbar theme-r-lg z-[100] w-[19.5rem] p-3',
    variant === 'starlight'
      ? 'border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] text-[var(--sl-color-text)] shadow-lg'
      : 'border-border bg-popover text-popover-foreground',
  )
}
