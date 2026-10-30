import type { PinyinAlphabetTone } from './flypy-alphabet-data'
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

export const FLYPY_GROUP_CLASS: Record<string, string> = {
  'initial-0': 'text-red-600 dark:text-red-400',
  'initial-1': 'text-orange-600 dark:text-orange-400',
  'initial-2': 'text-yellow-600 dark:text-yellow-400',
  'initial-3': 'text-lime-600 dark:text-lime-400',
  'initial-4': 'text-success',
  'initial-5': 'text-teal-600 dark:text-teal-400',
  'initial-6': 'text-blue-600 dark:text-blue-400',
  'initial-7': 'text-violet-600 dark:text-violet-400',
  'final-0': 'text-sky-600 dark:text-sky-400',
  'final-1': 'text-indigo-600 dark:text-indigo-400',
  'final-2': 'text-purple-600 dark:text-purple-400',
  'final-3': 'text-blue-700 dark:text-blue-400',
  'final-4': 'text-cyan-600 dark:text-cyan-400',
}

export const FLYPY_SECTION_ACCENT: Record<PinyinAlphabetTone, string> = {
  initial: 'border-red-600 dark:border-red-400',
  final: 'border-blue-600 dark:border-blue-400',
  syllable: 'border-success',
}

export const FLYPY_SECTION_TITLE: Record<PinyinAlphabetTone, string> = {
  initial: 'text-red-600 dark:text-red-400',
  final: 'text-blue-600 dark:text-blue-400',
  syllable: 'text-success',
}
