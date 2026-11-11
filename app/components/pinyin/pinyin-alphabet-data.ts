export type PinyinAlphabetTone = 'initial' | 'final' | 'syllable'

export type PinyinAlphabetItem = {
  pinyin: string
  hanzi: string
  category?: string
  groupKey?: string
  groupColor?: string
}

export type PinyinAlphabetSection = {
  title: string
  tone: PinyinAlphabetTone
  items: PinyinAlphabetItem[]
}

const PINYIN_SHENGMU_GROUPS = [
  { place: '双唇音', initials: ['b', 'p', 'm'] },
  { place: '唇齿音', initials: ['f'] },
  { place: '舌尖前音', initials: ['z', 'c', 's'] },
  { place: '舌尖中音', initials: ['d', 't', 'n', 'l'] },
  { place: '舌尖后音', initials: ['zh', 'ch', 'sh', 'r'] },
  { place: '舌面音', initials: ['j', 'q', 'x'] },
  { place: '舌根音', initials: ['g', 'k', 'h'] },
  { place: '半元音', initials: ['y', 'w'] },
] as const

const PINYIN_YUNMU_GROUPS = [
  { category: '单韵母', finals: ['a', 'o', 'e', 'i', 'u', 'ü'] },
  { category: '复韵母', finals: ['ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe'] },
  { category: '特殊韵母', finals: ['er'] },
  { category: '前鼻韵母', finals: ['an', 'en', 'in', 'un', 'ün'] },
  { category: '后鼻韵母', finals: ['ang', 'eng', 'ing', 'ong'] },
] as const

const PINYIN_ZHENGTIRENDU_SYLLABLES = [
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

const PINYIN_HANZI: Record<string, string> = {
  b: '播',
  p: '泼',
  m: '摸',
  f: '佛',
  d: '得',
  t: '特',
  n: '讷',
  l: '勒',
  g: '哥',
  k: '科',
  h: '喝',
  j: '鸡',
  q: '气',
  x: '西',
  zh: '织',
  ch: '吃',
  sh: '狮',
  r: '日',
  z: '字',
  c: '词',
  s: '思',
  y: '衣',
  w: '乌',
  a: '啊',
  o: '喔',
  e: '鹅',
  i: '衣',
  u: '乌',
  ü: '迂',
  ai: '哀',
  ei: '欸',
  ui: '威',
  ao: '奥',
  ou: '欧',
  iu: '优',
  ie: '耶',
  üe: '约',
  er: '耳',
  an: '安',
  en: '恩',
  in: '因',
  un: '温',
  ün: '晕',
  ang: '昂',
  eng: '亨',
  ing: '英',
  ong: '翁',
  zhi: '织',
  chi: '吃',
  shi: '狮',
  ri: '日',
  zi: '字',
  ci: '词',
  si: '思',
  yi: '衣',
  wu: '乌',
  yu: '迂',
  ye: '耶',
  yue: '约',
  yuan: '渊',
  yin: '因',
  yun: '晕',
  ying: '鹰',
}

const PINYIN_INITIAL_GROUP_COLORS = [
  'text-red-600 dark:text-red-400',
  'text-orange-600 dark:text-orange-400',
  'text-yellow-600 dark:text-yellow-400',
  'text-lime-600 dark:text-lime-400',
  'text-success',
  'text-teal-600 dark:text-teal-400',
  'text-blue-600 dark:text-blue-400',
  'text-violet-600 dark:text-violet-400',
] as const

const PINYIN_FINAL_GROUP_COLORS = [
  'text-sky-600 dark:text-sky-400',
  'text-indigo-600 dark:text-indigo-400',
  'text-purple-600 dark:text-purple-400',
  'text-blue-700 dark:text-blue-400',
  'text-cyan-600 dark:text-cyan-400',
] as const

function hanziOf(pinyin: string): string {
  return PINYIN_HANZI[pinyin] ?? pinyin
}

function buildItems(pinyins: readonly string[]): PinyinAlphabetItem[] {
  return pinyins.map((pinyin) => ({
    pinyin,
    hanzi: hanziOf(pinyin),
  }))
}

function buildGroupedItems(
  tone: PinyinAlphabetTone,
  groups: readonly {
    place?: string
    category?: string
    initials?: readonly string[]
    finals?: readonly string[]
  }[],
  colors: readonly string[],
): PinyinAlphabetItem[] {
  return groups.flatMap((group, index) => {
    const tokens = group.initials ?? group.finals ?? []
    const category = group.place ?? group.category ?? ''
    const groupColor = colors[index % colors.length] ?? colors[0]!
    const groupKey = `${tone}:${category}`

    return tokens.map((pinyin) => ({
      pinyin,
      hanzi: hanziOf(pinyin),
      category,
      groupKey,
      groupColor,
    }))
  })
}

/** 对照悟空拼音字母表；声母/韵母按发音部位与韵母分类，以字色区分 */
export const PINYIN_ALPHABET: PinyinAlphabetSection[] = [
  {
    title: '声母',
    tone: 'initial',
    items: buildGroupedItems('initial', PINYIN_SHENGMU_GROUPS, PINYIN_INITIAL_GROUP_COLORS),
  },
  {
    title: '韵母',
    tone: 'final',
    items: buildGroupedItems('final', PINYIN_YUNMU_GROUPS, PINYIN_FINAL_GROUP_COLORS),
  },
  {
    title: '整体认读音节',
    tone: 'syllable',
    items: buildItems(PINYIN_ZHENGTIRENDU_SYLLABLES),
  },
]
