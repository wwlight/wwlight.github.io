export const FLYPY_SHENGMU_GROUPS = [
  { place: '双唇音', initials: ['b', 'p', 'm'] },
  { place: '唇齿音', initials: ['f'] },
  { place: '舌尖前音', initials: ['z', 'c', 's'] },
  { place: '舌尖中音', initials: ['d', 't', 'n', 'l'] },
  { place: '舌尖后音', initials: ['zh', 'ch', 'sh', 'r'] },
  { place: '舌面音', initials: ['j', 'q', 'x'] },
  { place: '舌根音', initials: ['g', 'k', 'h'] },
  { place: '半元音', initials: ['y', 'w'] },
] as const

export const FLYPY_YUNMU_GROUPS = [
  { category: '单韵母', finals: ['a', 'o', 'e', 'i', 'u', 'ü'] },
  { category: '复韵母', finals: ['ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe'] },
  { category: '特殊韵母', finals: ['er'] },
  { category: '前鼻韵母', finals: ['an', 'en', 'in', 'un', 'ün'] },
  { category: '后鼻韵母', finals: ['ang', 'eng', 'ing', 'ong'] },
] as const

export const FLYPY_ZHENGTIRENDU =
  'zhi、chi、shi、ri、zi、ci、si、yi、wu、yu、ye、yue、yuan、yin、yun、ying'

export const FLYPY_ZHENGTIRENDU_SYLLABLES = [
  'zhi',
  'chi',
  'shi',
  'ri',
  'zi',
  'ci',
  'si',
  'yi',
  'wu',
  'yu',
  'ye',
  'yue',
  'yuan',
  'yin',
  'yun',
  'ying',
] as const
