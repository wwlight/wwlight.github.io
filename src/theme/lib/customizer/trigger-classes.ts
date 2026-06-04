/**
 * 功能：定制器触发按钮、Popover、色块的 Tailwind 类名。
 * 触发器 / Popover 容器用 customizer-ui.css token；Panel 选项见 surface.ts。
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
    'theme-r-lg inline-flex h-9 min-w-[7.25rem] cursor-pointer items-center gap-2 border px-2.5 py-0.5 text-xs shadow-sm transition-colors',
    'border-(--theme-ui-trigger-border) bg-(--theme-ui-trigger-bg) text-(--theme-ui-trigger-text)',
    variant === 'starlight'
      ? 'hover:bg-(--sl-color-gray-6) hover:text-(--sl-color-white)'
      : 'hover:bg-accent/50',
    className,
  )
}

export function themeCustomizerTriggerLabelClass() {
  return 'w-[7ch] shrink-0 truncate text-center'
}

export function themeOverlaySurfaceClass(className?: string) {
  return cn(
    'border-(--theme-ui-popover-border) bg-(--theme-ui-popover-bg) text-(--theme-ui-popover-text)',
    className,
  )
}

export function themeCustomizerPopoverClass(className?: string) {
  return cn(
    'theme-customizer-popover app-scrollbar theme-r-lg z-100 w-[19.5rem] select-none border p-3 shadow-lg',
    themeOverlaySurfaceClass(),
    className,
  )
}
