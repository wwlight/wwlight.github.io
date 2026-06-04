/**
 * 功能：定制器面板 section 标题 / 页脚与选项小块样式（双表面共用选项块 token）。
 */
import { cn } from '@/lib/utils'
import type { ThemeSurface } from './trigger-classes'

export function optionButtonClass(selected: boolean) {
  if (selected) {
    return 'border-primary bg-primary/10 text-foreground'
  }

  return 'border-border bg-background text-foreground hover:bg-accent/50'
}

export function sectionTitleClass(surface: ThemeSurface) {
  return cn(
    'text-sm font-medium',
    surface === 'starlight' ? 'text-(--sl-color-text)' : 'text-foreground',
  )
}

export function panelFooterBorderClass(surface: ThemeSurface) {
  return surface === 'starlight' ? 'border-(--sl-color-gray-5)' : 'border-border'
}
