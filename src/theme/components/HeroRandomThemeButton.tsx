/**
 * 功能：Starlight Hero 区「随机主题」按钮（仅随机 Primary/Neutral/Radius，不改 Color Mode）。
 */
import { Shuffle } from 'lucide-react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import { getDocumentThemeCustomizerState, randomThemeCustomizerState } from '@/theme/customizer/state'
import { cn } from '@/lib/utils'

interface HeroRandomThemeButtonProps {
  className?: string
}

const heroLinkButtonClass = cn(
  'hero-action-button',
  'inline-flex h-auto min-h-0 w-auto items-center rounded-full border shadow-none',
  '!gap-[0.5em] px-[1.125rem] py-[0.4375rem]',
  'text-[length:var(--sl-text-sm)] font-normal leading-[1.1875]',
  'md:px-5 md:py-[0.9375rem] md:text-[length:var(--sl-text-base)]',
  '[&_svg]:!size-[1em] [&_svg]:shrink-0',
  'border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] text-[var(--sl-color-white)]',
  'hover:bg-[var(--sl-color-gray-6)] hover:text-[var(--sl-color-white)]',
)

export function HeroRandomThemeButton({ className }: HeroRandomThemeButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(heroLinkButtonClass, className)}
      aria-label="随机主题"
      onClick={() => {
        flushSync(() => {
          randomThemeCustomizerState(getDocumentThemeCustomizerState())
        })
      }}
    >
      随机主题
      <Shuffle aria-hidden strokeWidth={2} />
    </Button>
  )
}
