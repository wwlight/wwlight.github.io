export type IpaAccent = 'rp' | 'ga'

export type IpaPhone = {
  id: string
  rp: string
  ga: string
  word: string
  gloss: string
}

export function ipaSymbol(phone: IpaPhone, accent: IpaAccent) {
  return accent === 'ga' ? phone.ga : phone.rp
}

export function ipaDiffers(phone: IpaPhone) {
  return phone.rp !== phone.ga
}

export type IpaKind = 'plosive' | 'affricate' | 'fricative' | 'nasal' | 'approximant'

const IPA_KIND: Record<string, IpaKind> = {
  p: 'plosive',
  b: 'plosive',
  t: 'plosive',
  d: 'plosive',
  k: 'plosive',
  g: 'plosive',
  tsh: 'affricate',
  dzh: 'affricate',
  tr: 'affricate',
  dr: 'affricate',
  ts: 'affricate',
  dz: 'affricate',
  f: 'fricative',
  v: 'fricative',
  theta: 'fricative',
  eth: 'fricative',
  s: 'fricative',
  z: 'fricative',
  esh: 'fricative',
  ezh: 'fricative',
  h: 'fricative',
  m: 'nasal',
  n: 'nasal',
  ng: 'nasal',
  l: 'approximant',
  r: 'approximant',
  w: 'approximant',
  j: 'approximant',
}

export function ipaKind(phone: IpaPhone) {
  return IPA_KIND[phone.id]
}

/** 单元音：上合下开，左展右圆。Underhill 音位表。 */
export const IPA_MONOPHTHONGS: IpaPhone[][] = [
  [
    { id: 'i-long', rp: 'iː', ga: 'iː', word: 'see', gloss: '看见' },
    { id: 'i-short', rp: 'ɪ', ga: 'ɪ', word: 'sit', gloss: '坐' },
    { id: 'u-short', rp: 'ʊ', ga: 'ʊ', word: 'book', gloss: '书' },
    { id: 'u-long', rp: 'uː', ga: 'uː', word: 'food', gloss: '食物' },
  ],
  [
    { id: 'e', rp: 'e', ga: 'ɛ', word: 'bed', gloss: '床' },
    { id: 'schwa', rp: 'ə', ga: 'ə', word: 'about', gloss: '关于' },
    { id: 'er-long', rp: 'ɜː', ga: 'ɝ', word: 'bird', gloss: '鸟' },
    { id: 'o-long', rp: 'ɔː', ga: 'ɔː', word: 'thought', gloss: '想法' },
  ],
  [
    { id: 'ae', rp: 'æ', ga: 'æ', word: 'cat', gloss: '猫' },
    { id: 'wedge', rp: 'ʌ', ga: 'ʌ', word: 'cup', gloss: '杯子' },
    { id: 'a-long', rp: 'ɑː', ga: 'ɑ', word: 'palm', gloss: '手掌' },
    { id: 'o-short', rp: 'ɒ', ga: 'ɑ', word: 'hot', gloss: '热' },
  ],
]

/** 双元音。收尾带 r 的三个，美音改成元音加 r。 */
export const IPA_DIPHTHONGS: (IpaPhone | null)[][] = [
  [
    { id: 'ei', rp: 'eɪ', ga: 'eɪ', word: 'day', gloss: '天' },
    { id: 'oi', rp: 'ɔɪ', ga: 'ɔɪ', word: 'boy', gloss: '男孩' },
    { id: 'ai', rp: 'aɪ', ga: 'aɪ', word: 'my', gloss: '我的' },
  ],
  [
    { id: 'ou', rp: 'əʊ', ga: 'oʊ', word: 'go', gloss: '走' },
    { id: 'au', rp: 'aʊ', ga: 'aʊ', word: 'now', gloss: '现在' },
    null,
  ],
  [
    { id: 'ia', rp: 'ɪə', ga: 'ɪr', word: 'near', gloss: '近' },
    { id: 'ea', rp: 'eə', ga: 'ɛr', word: 'hair', gloss: '头发' },
    { id: 'ua', rp: 'ʊə', ga: 'ʊr', word: 'tour', gloss: '旅行' },
  ],
]

/**
 * 辅音。前两行上为清、下为浊。
 * 鼻音和近音按同一列对齐。
 */
export const IPA_CONSONANTS: (IpaPhone | null)[][] = [
  [
    { id: 'p', rp: 'p', ga: 'p', word: 'pen', gloss: '笔' },
    { id: 'b', rp: 'b', ga: 'b', word: 'bag', gloss: '包' },
    { id: 't', rp: 't', ga: 't', word: 'tea', gloss: '茶' },
    { id: 'd', rp: 'd', ga: 'd', word: 'desk', gloss: '书桌' },
    { id: 'tsh', rp: 'tʃ', ga: 'tʃ', word: 'chair', gloss: '椅子' },
    { id: 'dzh', rp: 'dʒ', ga: 'dʒ', word: 'job', gloss: '工作' },
    { id: 'k', rp: 'k', ga: 'k', word: 'key', gloss: '钥匙' },
    { id: 'g', rp: 'g', ga: 'g', word: 'get', gloss: '得到' },
  ],
  [
    { id: 'f', rp: 'f', ga: 'f', word: 'fan', gloss: '扇子' },
    { id: 'v', rp: 'v', ga: 'v', word: 'van', gloss: '货车' },
    { id: 'theta', rp: 'θ', ga: 'θ', word: 'think', gloss: '想' },
    { id: 'eth', rp: 'ð', ga: 'ð', word: 'this', gloss: '这个' },
    { id: 's', rp: 's', ga: 's', word: 'sun', gloss: '太阳' },
    { id: 'z', rp: 'z', ga: 'z', word: 'zoo', gloss: '动物园' },
    { id: 'esh', rp: 'ʃ', ga: 'ʃ', word: 'she', gloss: '她' },
    { id: 'ezh', rp: 'ʒ', ga: 'ʒ', word: 'vision', gloss: '视野' },
  ],
  [
    { id: 'm', rp: 'm', ga: 'm', word: 'map', gloss: '地图' },
    null,
    { id: 'n', rp: 'n', ga: 'n', word: 'name', gloss: '名字' },
    null,
    null,
    null,
    { id: 'ng', rp: 'ŋ', ga: 'ŋ', word: 'sing', gloss: '唱歌' },
    null,
  ],
  [
    { id: 'h', rp: 'h', ga: 'h', word: 'hat', gloss: '帽子' },
    null,
    { id: 'l', rp: 'l', ga: 'l', word: 'leg', gloss: '腿' },
    null,
    { id: 'r', rp: 'r', ga: 'r', word: 'red', gloss: '红色' },
    null,
    { id: 'w', rp: 'w', ga: 'w', word: 'we', gloss: '我们' },
    { id: 'j', rp: 'j', ga: 'j', word: 'yes', gloss: '是' },
  ],
]

/** 国内教材在 24 个辅音之外单列的四个，凑成 48 个音标。 */
export const IPA_CLUSTERS: IpaPhone[] = [
  { id: 'tr', rp: 'tr', ga: 'tr', word: 'tree', gloss: '树' },
  { id: 'dr', rp: 'dr', ga: 'dr', word: 'dress', gloss: '连衣裙' },
  { id: 'ts', rp: 'ts', ga: 'ts', word: 'cats', gloss: '猫' },
  { id: 'dz', rp: 'dz', ga: 'dz', word: 'cards', gloss: '卡片' },
]
