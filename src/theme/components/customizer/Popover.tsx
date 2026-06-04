/**
 * 功能：Starlight 文档站主题 Popover（锚定静态 TriggerButton，避免 hydration 错位）。
 */
import { useEffect, useRef, useState, type RefObject } from 'react'
import { ThemeCustomizerPanel } from '@/theme/components/customizer/Panel'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import {
  syncSiteThemeFromStorage,
  THEME_CUSTOMIZER_TRIGGER_SELECTOR,
  themeCustomizerPopoverClass,
  type ThemeSurface,
} from '@/theme'

interface ThemeCustomizerPopoverProps {
  variant?: ThemeSurface
}

function isThemeCustomizerTrigger(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(THEME_CUSTOMIZER_TRIGGER_SELECTOR))
}

/** Radix virtualRef 要 RefObject<Measurable>（current 不含 null）；React ref 允许 null，边界处断言。 */
type VirtualAnchorRef = RefObject<{ getBoundingClientRect(): DOMRect }>

export function ThemeCustomizerPopover({ variant = 'starlight' }: ThemeCustomizerPopoverProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLElement | null>(null)
  const virtualAnchorRef = anchorRef as VirtualAnchorRef

  useEffect(() => {
    syncSiteThemeFromStorage()

    const onClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      anchorRef.current = event.currentTarget as HTMLElement
      setOpen(prev => !prev)
    }

    const triggers = document.querySelectorAll<HTMLElement>(THEME_CUSTOMIZER_TRIGGER_SELECTOR)
    triggers.forEach(trigger => {
      trigger.addEventListener('click', onClick)
    })

    return () => {
      triggers.forEach(trigger => {
        trigger.removeEventListener('click', onClick)
      })
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(THEME_CUSTOMIZER_TRIGGER_SELECTOR).forEach((trigger) => {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor virtualRef={virtualAnchorRef} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className={themeCustomizerPopoverClass()}
        data-theme-surface={variant}
        onPointerDownOutside={(event) => {
          if (isThemeCustomizerTrigger(event.target))
            event.preventDefault()
        }}
        onFocusOutside={(event) => {
          if (isThemeCustomizerTrigger(event.target))
            event.preventDefault()
        }}
      >
        <ThemeCustomizerPanel variant={variant} open={open} />
      </PopoverContent>
    </Popover>
  )
}
