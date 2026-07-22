import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { PinyinAlphabetTone } from './flypy-alphabet-data'

type FlypyBoardCssVars = {
  '--flypy-gap': string
  '--flypy-unit': string
  '--flypy-key-pad': string
}

export const flypyBoardStyle: CSSProperties & FlypyBoardCssVars = {
  '--flypy-gap': 'clamp(0.18rem, 0.85cqi, 0.34rem)',
  '--flypy-unit': 'calc((100cqi - 9 * var(--flypy-gap)) / 10)',
  '--flypy-key-pad': 'clamp(0.24rem, 0.95cqi, 0.38rem)',
}

export function flypyFigureClass(className?: string) {
  return cn(
    'my-5 w-full overflow-visible rounded-[calc(var(--radius,0.25rem)+0.25rem)]',
    'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_48%,transparent)]',
    'bg-[color-mix(in_oklab,var(--sl-color-gray-6,var(--muted))_72%,transparent)]',
    'p-[0.85rem] max-sm:p-[0.65rem]',
    className,
  )
}

/** 字母表卡片与键位图共用的键帽尺寸 */
export const flypyKeySizeClass = cn(
  'h-[var(--flypy-unit)] min-h-[var(--flypy-unit)] max-h-[var(--flypy-unit)]',
  'w-[var(--flypy-unit)] min-w-0',
)

export const flypyInitialTextClass =
  'text-[light-dark(#dc2626,#f87171)]'

export const flypyFinalTextClass =
  'text-[light-dark(#2563eb,#60a5fa)]'

export const flypyFinalAltTextClass =
  'text-[light-dark(#16a34a,#4ade80)]'

export const flypyRadicalKindClass = {
  phonetic: 'text-(--sl-color-text,var(--foreground))',
  'non-phonetic': 'text-[light-dark(#dc2626,#f87171)]',
  special: 'text-[light-dark(#16a34a,#4ade80)]',
  stroke: 'text-[light-dark(#2563eb,#60a5fa)]',
} as const

/** 双拼布局 / 口诀 SVG 文字色 */
export const flypyShuangpinToneClass = {
  default: 'text-(--sl-color-text,var(--foreground))',
  initial: flypyInitialTextClass,
  final: flypyFinalTextClass,
  'final-green': flypyFinalAltTextClass,
  orange: 'text-[color-mix(in_oklab,var(--primary)_42%,#ea580c)]',
  green: 'text-[color-mix(in_oklab,var(--primary)_22%,#16a34a)]',
} as const

export const flypySvgBoardClass = cn(
  'flypy-svg-type block h-auto w-full overflow-visible',
)

export const flypySvgKeyFill
  = 'color-mix(in oklab, var(--sl-color-bg, var(--background)) 90%, var(--sl-color-gray-6, var(--muted)))'

export const flypySvgKeyStroke
  = 'color-mix(in oklab, var(--sl-color-gray-5, var(--border)) 36%, transparent)'

export const flypySvgBrandFoClass = cn(
  'box-border h-full w-full overflow-visible',
  '[&>*]:h-full! [&>*]:w-full! [&>*]:min-h-0! [&>*]:max-h-none!',
  '[&_button]:text-[length:0.95rem] [&_button]:leading-[1.15]',
)

export const flypySvgDownloadBtnClass = cn(
  'grid h-full w-full cursor-pointer appearance-none place-items-center border p-0',
  'rounded-[calc(var(--radius,0.25rem)+0.1rem)]',
  'border-[color-mix(in_oklab,var(--primary)_70%,transparent)]',
  'bg-(--primary) text-(--primary-foreground,var(--sl-color-white))',
  'font-[inherit] text-center text-[clamp(0.6rem,2.4cqi,0.76rem)] font-bold leading-[1.1] tracking-[0.06em]',
  'shadow-[inset_0_1px_0_color-mix(in_oklab,white_18%,transparent),0_1px_2px_color-mix(in_oklab,var(--primary)_35%,transparent)]',
)

export const flypyAlphabetOuterWrapClass = cn('not-content my-5')

export const flypyAlphabetWrapClass = cn('space-y-4')

export function flypyAlphabetSectionClass(tone: PinyinAlphabetTone) {
  return cn(
    'overflow-hidden rounded-[calc(var(--radius,0.25rem)+0.12rem)]',
    'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_48%,transparent)]',
    'bg-[color-mix(in_oklab,var(--sl-color-bg,var(--background))_92%,var(--sl-color-gray-6,var(--muted)))]',
    'p-3 sm:p-4',
    tone === 'initial' &&
      'shadow-[inset_3px_0_0_color-mix(in_oklab,#dc2626_55%,transparent)]',
    tone === 'final' &&
      'shadow-[inset_3px_0_0_color-mix(in_oklab,#2563eb_55%,transparent)]',
    tone === 'syllable' &&
      'shadow-[inset_3px_0_0_color-mix(in_oklab,#16a34a_55%,transparent)]',
  )
}

export function flypyAlphabetSectionTitleClass(tone: PinyinAlphabetTone) {
  return cn(
    'mb-3 text-[0.95rem] font-semibold',
    tone === 'initial' && flypyInitialTextClass,
    tone === 'final' && flypyFinalTextClass,
    tone === 'syllable' && flypyFinalAltTextClass,
  )
}

export const flypyAlphabetGridClass = cn(
  '@container flex w-full flex-wrap gap-[var(--flypy-gap)]',
)

export function flypyAlphabetCardClass(options?: { active?: boolean, dimmed?: boolean }) {
  return cn(
    flypyKeySizeClass,
    'relative box-border flex flex-none min-w-0 cursor-default flex-col overflow-visible',
    'rounded-[calc(var(--radius,0.25rem)+0.1rem)]',
    'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_36%,transparent)]',
    'bg-[color-mix(in_oklab,var(--sl-color-bg,var(--background))_90%,var(--sl-color-gray-6,var(--muted)))]',
    'p-[var(--flypy-key-pad)] leading-none',
    'transition-[border-color,opacity] duration-200 ease-out',
    options?.dimmed && 'opacity-35',
    options?.active &&
      'z-[1] border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_65%,transparent)]',
  )
}

export const flypyAlphabetCardHeadClass = cn(
  'm-0 flex w-full shrink-0 items-start justify-end pe-[0.14rem] pt-[0.12rem] leading-none',
)

export const flypyAlphabetCardBodyClass = cn('flex min-h-0 flex-1 flex-col overflow-hidden')

export const flypyAlphabetCardPinyinWrapClass = cn(
  'flex min-h-0 flex-1 items-center justify-center',
)

export function flypyAlphabetCardPinyinClass(
  tone: PinyinAlphabetTone,
  groupColor?: string,
) {
  return cn(
    'text-center font-semibold',
    tone === 'initial' && 'text-[clamp(0.88rem,4.4cqi,1.14rem)]',
    tone === 'final' && 'text-[clamp(0.8rem,4cqi,1.04rem)]',
    tone === 'syllable' && 'text-[clamp(0.72rem,3.6cqi,0.94rem)]',
    groupColor ??
      (tone === 'initial'
        ? flypyInitialTextClass
        : tone === 'final'
          ? flypyFinalTextClass
          : flypyFinalAltTextClass),
  )
}

export const flypyAlphabetCardFooterClass = cn(
  'relative flex min-h-[clamp(0.62rem,2.4cqi,0.78rem)] shrink-0 items-end justify-center',
)

export const flypyAlphabetCardHanziClass = cn(
  'text-center text-[clamp(0.54rem,2.35cqi,0.68rem)] leading-none text-(--sl-color-gray-3,var(--muted-foreground))',
)

export const flypyAlphabetCardCategoryClass = cn(
  'text-right text-[10px] font-medium leading-none whitespace-nowrap opacity-70',
)
