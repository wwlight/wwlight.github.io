import {
  FLYPY_SHENGMU_GROUPS,
  FLYPY_YUNMU_GROUPS,
  FLYPY_ZHENGTIRENDU_SYLLABLES,
} from './flypy-pinyin-meta'

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

const FLYPY_PINYIN_HANZI: Record<string, string> = {
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

const FLYPY_INITIAL_GROUP_COLORS = [
  'initial-0',
  'initial-1',
  'initial-2',
  'initial-3',
  'initial-4',
  'initial-5',
  'initial-6',
  'initial-7',
] as const

const FLYPY_FINAL_GROUP_COLORS = ['final-0', 'final-1', 'final-2', 'final-3', 'final-4'] as const

function buildItems(pinyins: readonly string[]): PinyinAlphabetItem[] {
  return pinyins.map((pinyin) => ({
    pinyin,
    hanzi: FLYPY_PINYIN_HANZI[pinyin],
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
    const groupColor = colors[index % colors.length]
    const groupKey = `${tone}:${category}`

    return tokens.map((pinyin) => ({
      pinyin,
      hanzi: FLYPY_PINYIN_HANZI[pinyin],
      category,
      groupKey,
      groupColor,
    }))
  })
}

/** 对照悟空拼音字母表；声母/韵母按发音部位与韵母分类，以字色区分 */
export const FLYPY_PINYIN_ALPHABET: PinyinAlphabetSection[] = [
  {
    title: '声母',
    tone: 'initial',
    items: buildGroupedItems('initial', FLYPY_SHENGMU_GROUPS, FLYPY_INITIAL_GROUP_COLORS),
  },
  {
    title: '韵母',
    tone: 'final',
    items: buildGroupedItems('final', FLYPY_YUNMU_GROUPS, FLYPY_FINAL_GROUP_COLORS),
  },
  {
    title: '整体认读音节',
    tone: 'syllable',
    items: buildItems(FLYPY_ZHENGTIRENDU_SYLLABLES),
  },
]
