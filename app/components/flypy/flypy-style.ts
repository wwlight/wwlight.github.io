import type { RadicalKind } from './flypy-data'
import type { ShuangpinSvgTone } from './flypy-shuangpin-svg-layout'

export const FLYPY_TONE_CLASS: Record<ShuangpinSvgTone, string> = {
  default: 'text-default',
  initial: 'text-red-600 dark:text-red-400',
  final: 'text-blue-600 dark:text-blue-400',
  'final-green': 'text-success',
  orange: 'text-orange-600 dark:text-orange-400',
  green: 'text-success',
}

export const FLYPY_KIND_CLASS: Record<RadicalKind, string> = {
  phonetic: 'text-default',
  'non-phonetic': 'text-red-600 dark:text-red-400',
  special: 'text-success',
  stroke: 'text-blue-600 dark:text-blue-400',
}
