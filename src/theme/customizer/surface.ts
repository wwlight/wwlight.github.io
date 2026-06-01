/**
 * 功能：定制器面板内选项按钮的选中/默认样式（按 Starlight / 书签表面区分）。
 */
import { cn } from '@/lib/utils'
import type { ThemeSurface } from '@/theme/customizer/trigger-classes'

export function optionButtonClass(surface: ThemeSurface, selected: boolean) {
  if (surface === 'starlight') {
    return selected
      ? 'border-[var(--sl-color-accent)] bg-[var(--sl-color-accent-low)] text-[var(--sl-color-text)]'
      : 'border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] text-[var(--sl-color-text)] hover:bg-[var(--sl-color-gray-6)]'
  }

  return selected
    ? 'border-primary bg-primary/10 text-foreground'
    : 'border-border bg-background text-foreground hover:bg-accent/50'
}

export function sectionTitleClass(surface: ThemeSurface) {
  return cn(
    'text-sm font-medium',
    surface === 'starlight' ? 'text-[var(--sl-color-text)]' : 'text-foreground',
  )
}

export function panelFooterBorderClass(surface: ThemeSurface) {
  return surface === 'starlight' ? 'border-[var(--sl-color-gray-5)]' : 'border-border'
}
