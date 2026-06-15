import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { PinyinAlphabetTone } from './flypy-alphabet-data'

export type FlypyKeyVariant = 'layout' | 'mnemonic' | 'radical'

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

export const flypyFallbackImgClass = cn(
  'block w-full rounded-[calc(var(--radius,0.25rem)+0.1rem)] sm:hidden',
)

export const flypyInteractiveClass = cn('hidden sm:block')

export const flypyBoardClass = cn('@container flex w-full flex-col gap-[var(--flypy-gap)]')

export const flypyRowBaseClass = cn(
  'm-0 flex w-full min-h-[var(--flypy-unit)] items-stretch gap-[var(--flypy-gap)]',
)

export const FLYPY_ROW_CLASS = [
  flypyRowBaseClass,
  cn(
    flypyRowBaseClass,
    'ps-[calc(var(--flypy-unit)*0.5+var(--flypy-gap)*0.5)]',
  ),
  cn(
    flypyRowBaseClass,
    'ps-[calc(var(--flypy-unit)*1.5+var(--flypy-gap)*1.5)]',
  ),
] as const

/** 键帽统一尺寸（键帽与右下角印章共用） */
export const flypyKeySizeClass = cn(
  'h-[var(--flypy-unit)] min-h-[var(--flypy-unit)] max-h-[var(--flypy-unit)]',
  'w-[var(--flypy-unit)] min-w-0',
)

/** 三张键盘图共用的键帽外壳 */
export const flypyKeyBaseClass = cn(
  flypyKeySizeClass,
  'box-border m-0 flex flex-none flex-col items-stretch justify-start gap-0 overflow-hidden',
  'p-[var(--flypy-key-pad)]',
  'rounded-[calc(var(--radius,0.25rem)+0.1rem)]',
  'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_36%,transparent)]',
  'bg-[color-mix(in_oklab,var(--sl-color-bg,var(--background))_90%,var(--sl-color-gray-6,var(--muted)))]',
  'text-(--sl-color-text,var(--foreground)) leading-[1.1]',
  'shadow-[inset_0_1px_0_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_10%,transparent),0_1px_2px_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_7%,transparent)]',
)

const flypyKeyDefaultTextClass = 'text-[clamp(0.58rem,2.65cqi,0.74rem)]'
const flypyKeyRadicalTextClass = 'text-[clamp(0.54rem,2.35cqi,0.68rem)]'

const flypyKeyVariantClass: Record<FlypyKeyVariant, string> = {
  layout: flypyKeyDefaultTextClass,
  mnemonic: flypyKeyDefaultTextClass,
  radical: flypyKeyRadicalTextClass,
}

export function flypyKeyClass(variant: FlypyKeyVariant = 'layout', className?: string) {
  return cn(flypyKeyBaseClass, flypyKeyVariantClass[variant], className)
}

/** 键帽内部下方内容区（韵母、字根行等）共用布局 */
export const flypyKeyBodyBaseClass = cn(
  'm-0 flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-0 overflow-hidden',
)

export const flypyKeyHeadClass = cn(
  'm-0 flex shrink-0 items-start justify-between gap-[0.08rem] leading-none',
)

export const flypyKeyLetterClass = cn(
  'shrink-0 text-[clamp(0.92rem,4.2cqi,1.2rem)] font-bold leading-none',
)

export const flypyInitialTextClass =
  'text-[light-dark(#dc2626,#f87171)]'

export const flypyFinalTextClass =
  'text-[light-dark(#2563eb,#60a5fa)]'

export const flypyFinalAltTextClass =
  'text-[light-dark(#16a34a,#4ade80)]'

export const flypyKeyInitialClass = cn(
  'shrink-0 text-[clamp(0.68rem,2.8cqi,0.84rem)] font-semibold leading-none',
  flypyInitialTextClass,
)

export const flypyKeyAltClass = cn(
  'shrink-0 text-[clamp(0.64rem,2.65cqi,0.8rem)] font-semibold leading-none',
  flypyInitialTextClass,
)

export const flypyKeyTopRightClass = cn(
  'inline-flex min-w-0 flex-1 items-start justify-end gap-[0.04rem] overflow-hidden leading-none',
)

export function flypyMnemonicCharClass(green?: boolean) {
  return cn(
    'shrink-0 text-[clamp(0.56rem,2.25cqi,0.72rem)] font-semibold leading-none',
    green
      ? 'text-[color-mix(in_oklab,var(--primary)_22%,#16a34a)]'
      : 'text-[color-mix(in_oklab,var(--primary)_42%,#ea580c)]',
  )
}

export function flypyKeyCornerClass(kind: keyof typeof flypyRadicalKindClass) {
  return cn(
    'shrink-0 text-right text-[clamp(0.5rem,2.05cqi,0.64rem)] font-semibold leading-none',
    flypyRadicalKindClass[kind],
  )
}

export function flypyFinalsClass() {
  return cn(
    flypyKeyBodyBaseClass,
    'text-center text-[clamp(0.74rem,3.15cqi,0.96rem)] font-semibold leading-[1.28]',
  )
}

export function flypyFinalLineClass(green?: boolean) {
  return cn(
    'm-0 block w-full overflow-hidden p-0 text-center text-[1em] leading-[1.28] text-ellipsis whitespace-nowrap',
    green ? flypyFinalAltTextClass : flypyFinalTextClass,
  )
}

export const flypyRadicalLinesClass = cn(
  flypyKeyBodyBaseClass,
  'text-[clamp(0.62rem,2.85cqi,0.82rem)] font-semibold',
)

export const flypyRadicalLineClass = cn(
  'm-0 flex w-full flex-nowrap items-center justify-center gap-0 overflow-hidden p-0 text-center leading-[1.28]',
)

export function flypyRadicalLineSpanClass(multi: boolean) {
  return cn(
    'shrink-0 text-center leading-[1.28]',
    multi
      ? 'overflow-visible whitespace-nowrap'
      : 'max-w-full overflow-hidden text-ellipsis whitespace-nowrap',
  )
}

export const flypyRadicalKindClass = {
  phonetic: 'text-(--sl-color-text,var(--foreground))',
  'non-phonetic': 'text-[light-dark(#dc2626,#f87171)]',
  special: 'text-[light-dark(#16a34a,#4ade80)]',
  stroke: 'text-[light-dark(#2563eb,#60a5fa)]',
} as const

export function flypyRadicalSegmentClass(
  multi: boolean,
  kind: keyof typeof flypyRadicalKindClass,
) {
  return cn(flypyRadicalLineSpanClass(multi), flypyRadicalKindClass[kind])
}

export const flypyBrandWrapClass = cn(
  'group relative m-0 box-border flex-none',
  flypyKeySizeClass,
)

export const flypyBrandButtonClass = cn(
  'grid h-full w-full cursor-help appearance-none place-items-center border p-0',
  'rounded-[calc(var(--radius,0.25rem)+0.1rem)]',
  'border-[color-mix(in_oklab,var(--primary)_70%,transparent)]',
  'bg-(--primary) text-(--primary-foreground,var(--sl-color-white))',
  'font-[inherit] text-center text-[clamp(0.6rem,2.4cqi,0.76rem)] font-bold leading-[1.1] tracking-[0.06em]',
  'shadow-[inset_0_1px_0_color-mix(in_oklab,white_18%,transparent),0_1px_2px_color-mix(in_oklab,var(--primary)_35%,transparent)]',
)

export const flypyBrandPreviewClass = cn(
  'pointer-events-none invisible absolute right-0 bottom-[calc(100%+0.55rem)] z-8 opacity-0',
  'w-[min(28rem,calc(100cqi*2.4))] rounded-[calc(var(--radius,0.25rem)+0.15rem)]',
  'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_48%,transparent)] bg-(--sl-color-bg,var(--background)) p-[0.35rem]',
  'shadow-[0_10px_28px_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_16%,transparent),0_2px_8px_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_8%,transparent)]',
  'transition-[opacity,visibility] duration-[180ms] ease-out',
  '[@media(hover:hover)_and_(pointer:fine)]:group-hover:visible [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100',
  '[@media(hover:hover)_and_(pointer:fine)]:group-focus-within:visible [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100',
)

export const flypyBrandPreviewImgClass = cn(
  'block w-full rounded-[calc(var(--radius,0.25rem)+0.05rem)]',
)

export const flypyLegendTextClass = cn(
  'mt-[0.85rem] mb-0 text-[0.78rem] leading-normal text-(--sl-color-text,var(--foreground))',
)

export const flypySmallTitleClass = cn(
  'mt-4 mb-2 text-[0.9rem] font-semibold text-(--sl-color-text,var(--foreground))',
)

export const flypySmallListClass = cn(
  'm-0 columns-2 gap-4 p-0 text-[0.86rem] leading-[1.6] list-none md:columns-3',
)

export const flypySmallItemClass = cn(
  'relative mb-[0.3rem] break-inside-avoid ps-[calc(0.9rem+0.3rem)] leading-none',
)

export const flypySmallKeyClass = cn(
  'absolute top-[0.85rem] left-0 flex h-[1em] w-[0.9rem] items-end font-bold leading-none text-(--primary)',
)

export const flypySmallCharsClass = cn(
  'flex min-w-0 flex-wrap leading-none',
)

export const flypySmallCharClass = cn(
  'inline-flex h-[calc(0.85rem+1em)] w-[1.12em] shrink-0 grow-0 basis-[1.12em] flex-col leading-none',
)

export const flypySmallPinyinClass = cn(
  'box-border flex h-[0.85rem] shrink-0 items-end justify-center text-[0.72rem] leading-none font-normal tracking-normal whitespace-nowrap text-(--sl-color-gray-3,var(--muted-foreground))',
)

export const flypySmallHanziClass = cn(
  'box-border flex h-[1em] shrink-0 items-end justify-center text-center leading-none',
)

export const flypyAlphabetOuterWrapClass = cn('not-content my-5')

export const flypyAlphabetWrapClass = cn('space-y-4')

export const flypyAlphabetPreviewWrapClass = cn('group/preview relative')

export const flypyAlphabetPreviewBarClass = cn('mb-2 flex justify-end')

export const flypyAlphabetPreviewTriggerClass = cn(
  'cursor-help appearance-none border-0 bg-transparent p-0',
  'text-[0.78rem] leading-normal text-(--sl-color-gray-3,var(--muted-foreground))',
  'underline decoration-dotted underline-offset-[0.2em]',
  'transition-colors hover:text-(--sl-color-text,var(--foreground))',
)

export const flypyAlphabetPreviewClass = cn(
  'pointer-events-none invisible absolute right-0 top-[calc(100%+0.35rem)] z-8 opacity-0',
  'w-[min(36rem,92vw)] rounded-[calc(var(--radius,0.25rem)+0.15rem)]',
  'border border-[color-mix(in_oklab,var(--sl-color-gray-5,var(--border))_48%,transparent)] bg-(--sl-color-bg,var(--background)) p-[0.35rem]',
  'shadow-[0_10px_28px_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_16%,transparent),0_2px_8px_color-mix(in_oklab,var(--sl-color-text,var(--foreground))_8%,transparent)]',
  'transition-[opacity,visibility] duration-[180ms] ease-out',
  '[@media(hover:hover)_and_(pointer:fine)]:group-hover/preview:visible [@media(hover:hover)_and_(pointer:fine)]:group-hover/preview:opacity-100',
  '[@media(hover:hover)_and_(pointer:fine)]:group-focus-within:visible [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100',
)

export const flypyAlphabetPreviewImgClass = cn(
  'block w-full rounded-[calc(var(--radius,0.25rem)+0.05rem)]',
)

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

export function flypyAlphabetCardClass(options?: { active?: boolean; dimmed?: boolean }) {
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
