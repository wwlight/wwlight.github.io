/**
 * 功能：书签/管理端 React 主题触发器（Popover + 面板）。
 */
import { Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeCustomizerPanel } from '@/theme/components/customizer/Panel'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  getDocumentPrimaryThemeId,
  PRIMARY_THEMES,
  subscribeSiteThemeStorage,
  syncSiteThemeFromStorage,
  themeCustomizerPopoverClass,
  themeCustomizerSwatchClass,
  themeCustomizerTriggerButtonClass,
  themeCustomizerTriggerLabelClass,
  type ThemeSurface,
} from '@/theme'

interface ThemeCustomizerTriggerProps {
  variant?: ThemeSurface
  className?: string
}

export function ThemeCustomizerTrigger({
  variant = 'bookmarks',
  className,
}: ThemeCustomizerTriggerProps) {
  const [open, setOpen] = useState(false)
  const [primaryId, setPrimaryId] = useState(getDocumentPrimaryThemeId)

  useEffect(() => {
    syncSiteThemeFromStorage()

    return subscribeSiteThemeStorage(() => {
      setPrimaryId(getDocumentPrimaryThemeId())
    })
  }, [])

  const selected = PRIMARY_THEMES.find(theme => theme.id === primaryId) ?? PRIMARY_THEMES[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={themeCustomizerTriggerButtonClass(variant, className)}
          aria-label="主题设置"
          data-theme-customizer-trigger
          data-theme-surface={variant}
        >
          <span
            className={themeCustomizerSwatchClass()}
            data-part="swatch"
            aria-hidden
          />
          <span className={themeCustomizerTriggerLabelClass()}>{selected.label}</span>
          <Settings2 className="size-3.5 shrink-0 opacity-60" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className={themeCustomizerPopoverClass()}
        data-theme-surface={variant}
      >
        <ThemeCustomizerPanel
          variant={variant}
          open={open}
          onUpdated={() => setPrimaryId(getDocumentPrimaryThemeId())}
        />
      </PopoverContent>
    </Popover>
  )
}
