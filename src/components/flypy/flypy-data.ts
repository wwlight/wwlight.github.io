export const FLYPY_PREVIEW_IMAGES = {
  alphabet: '/attachmets/悟空拼音字母表.jpg',
  layout: '/attachmets/小鹤双拼键盘布局.png',
  mnemonic: '/attachmets/小鹤双拼键位口诀.webp',
  radicals: '/attachmets/小鹤音部件字根键位图.png',
} as const

export type FlypyKeyData = {
  key: string
  initial: string
  finals: string
}

export const FLYPY_ROWS: FlypyKeyData[][] = [
  [
    { key: 'Q', initial: 'q', finals: 'iu' },
    { key: 'W', initial: 'w', finals: 'ei' },
    { key: 'E', initial: 'e', finals: 'e' },
    { key: 'R', initial: 'r', finals: 'uan' },
    { key: 'T', initial: 't', finals: 'ue / üe' },
    { key: 'Y', initial: 'y', finals: 'un' },
    { key: 'U', initial: 'sh', finals: 'u' },
    { key: 'I', initial: 'ch', finals: 'i' },
    { key: 'O', initial: 'o', finals: 'uo / o' },
    { key: 'P', initial: 'p', finals: 'ie' },
  ],
  [
    { key: 'A', initial: 'a', finals: 'a' },
    { key: 'S', initial: 's', finals: 'iong / ong' },
    { key: 'D', initial: 'd', finals: 'ai' },
    { key: 'F', initial: 'f', finals: 'en' },
    { key: 'G', initial: 'g', finals: 'eng' },
    { key: 'H', initial: 'h', finals: 'ang' },
    { key: 'J', initial: 'j', finals: 'an' },
    { key: 'K', initial: 'k', finals: 'ing / uai' },
    { key: 'L', initial: 'l', finals: 'iang / uang' },
  ],
  [
    { key: 'Z', initial: 'z', finals: 'ou' },
    { key: 'X', initial: 'x', finals: 'ia / ua' },
    { key: 'C', initial: 'c', finals: 'ao' },
    { key: 'V', initial: 'zh', finals: 'ü / ui' },
    { key: 'B', initial: 'b', finals: 'in' },
    { key: 'N', initial: 'n', finals: 'iao' },
    { key: 'M', initial: 'm', finals: 'ian' },
  ],
]

export type MnemonicCharTone = 'orange' | 'green'
export type MnemonicFinalTone = 'blue' | 'green'

export type FlypyMnemonicKeyData = {
  key: string
  altInitial?: string
  mnemonicChars?: { char: string; tone?: MnemonicCharTone }[]
  finals: { text: string; tone?: MnemonicFinalTone }[]
}

export const FLYPY_MNEMONIC_ROWS: FlypyMnemonicKeyData[][] = [
  [
    { key: 'Q', mnemonicChars: [{ char: '秋' }], finals: [{ text: 'iu' }] },
    { key: 'W', mnemonicChars: [{ char: '闱' }], finals: [{ text: 'ei' }] },
    { key: 'E', finals: [{ text: 'e' }] },
    { key: 'R', mnemonicChars: [{ char: '软' }], finals: [{ text: 'uan' }] },
    {
      key: 'T',
      mnemonicChars: [{ char: '月', tone: 'green' }],
      finals: [{ text: 'ue', tone: 'green' }, { text: 'üe', tone: 'green' }],
    },
    { key: 'Y', mnemonicChars: [{ char: '云' }], finals: [{ text: 'un' }] },
    { key: 'U', altInitial: 'sh', mnemonicChars: [{ char: '梳' }], finals: [{ text: 'u' }] },
    { key: 'I', altInitial: 'ch', mnemonicChars: [{ char: '翅' }], finals: [{ text: 'i' }] },
    { key: 'O', finals: [{ text: 'uo' }, { text: 'o' }] },
    { key: 'P', mnemonicChars: [{ char: '撇' }], finals: [{ text: 'ie' }] },
  ],
  [
    { key: 'A', finals: [{ text: 'a' }] },
    {
      key: 'S',
      mnemonicChars: [{ char: '怂' }, { char: '恿', tone: 'green' }],
      finals: [{ text: 'ong' }, { text: 'iong', tone: 'green' }],
    },
    { key: 'D', mnemonicChars: [{ char: '带' }], finals: [{ text: 'ai' }] },
    { key: 'F', mnemonicChars: [{ char: '粉' }], finals: [{ text: 'en' }] },
    { key: 'G', mnemonicChars: [{ char: '更' }], finals: [{ text: 'eng' }] },
    { key: 'H', mnemonicChars: [{ char: '航' }], finals: [{ text: 'ang' }] },
    {
      key: 'J',
      mnemonicChars: [{ char: '安', tone: 'green' }],
      finals: [{ text: 'an' }],
    },
    {
      key: 'K',
      mnemonicChars: [{ char: '快' }, { char: '迎', tone: 'green' }],
      finals: [{ text: 'uai' }, { text: 'ing', tone: 'green' }],
    },
    {
      key: 'L',
      mnemonicChars: [{ char: '两' }, { char: '王', tone: 'green' }],
      finals: [{ text: 'iang' }, { text: 'uang', tone: 'green' }],
    },
  ],
  [
    { key: 'Z', mnemonicChars: [{ char: '揍' }], finals: [{ text: 'ou' }] },
    {
      key: 'X',
      mnemonicChars: [{ char: '夏' }, { char: '蛙', tone: 'green' }],
      finals: [{ text: 'ia' }, { text: 'ua', tone: 'green' }],
    },
    { key: 'C', mnemonicChars: [{ char: '草' }], finals: [{ text: 'ao' }] },
    {
      key: 'V',
      altInitial: 'zh',
      mnemonicChars: [{ char: '追' }, { char: '鱼', tone: 'green' }],
      finals: [{ text: 'ui' }, { text: 'ü', tone: 'green' }],
    },
    { key: 'B', mnemonicChars: [{ char: '滨' }], finals: [{ text: 'in' }] },
    { key: 'N', mnemonicChars: [{ char: '鸟' }], finals: [{ text: 'iao' }] },
    { key: 'M', mnemonicChars: [{ char: '眠' }], finals: [{ text: 'ian' }] },
  ],
]

export type RadicalKind = 'phonetic' | 'non-phonetic' | 'special' | 'stroke'

export type RadicalSegment = {
  text: string
  kind: RadicalKind
}

export type RadicalKeyData = {
  key: string
  corner?: RadicalSegment
  lines: RadicalSegment[][]
}

export const FLYPY_RADICAL_ROWS: RadicalKeyData[][] = [
  [
    {
      key: 'Q',
      lines: [
        [{ text: '犭求', kind: 'phonetic' }],
        [{ text: '且', kind: 'phonetic' }, { text: '其', kind: 'non-phonetic' }],
      ],
    },
    {
      key: 'W',
      lines: [
        [{ text: '亠文', kind: 'phonetic' }],
        [{ text: '夂攵', kind: 'phonetic' }],
      ],
    },
    {
      key: 'E',
      lines: [
        [{ text: '阝卩', kind: 'phonetic' }],
        [{ text: '见下', kind: 'phonetic' }, { text: '彐山', kind: 'non-phonetic' }],
      ],
    },
    { key: 'R', lines: [[{ text: '亻', kind: 'phonetic' }]] },
    { key: 'T', lines: [[{ text: '田', kind: 'phonetic' }]] },
    {
      key: 'Y',
      lines: [
        [{ text: '讠𧘇', kind: 'phonetic' }],
        [{ text: '⺷⺶羊', kind: 'phonetic' }],
      ],
    },
    {
      key: 'U',
      lines: [
        [{ text: '饣龵𠂇', kind: 'phonetic' }],
        [{ text: '氺石', kind: 'phonetic' }],
      ],
    },
    {
      key: 'I',
      lines: [
        [{ text: '彳亍', kind: 'phonetic' }],
        [{ text: '虫', kind: 'phonetic' }],
      ],
    },
    {
      key: 'O',
      lines: [
        [{ text: '日', kind: 'special' }],
        [{ text: '月目', kind: 'phonetic' }],
      ],
    },
    {
      key: 'P',
      corner: { text: '撇丿', kind: 'stroke' },
      lines: [[{ text: '礻衤', kind: 'non-phonetic' }]],
    },
  ],
  [
    {
      key: 'A',
      corner: { text: '横一', kind: 'stroke' },
      lines: [[{ text: '鱼', kind: 'non-phonetic' }]],
    },
    {
      key: 'S',
      lines: [
        [{ text: '纟厶', kind: 'phonetic' }],
        [{ text: '龴皿', kind: 'phonetic' }],
      ],
    },
    {
      key: 'D',
      corner: { text: '点丶', kind: 'stroke' },
      lines: [
        [{ text: '冫氵', kind: 'phonetic' }],
        [{ text: '⺈刂', kind: 'phonetic' }],
      ],
    },
    {
      key: 'F',
      lines: [
        [{ text: '寿上带上龶', kind: 'phonetic' }],
        [{ text: '扌缶', kind: 'phonetic' }],
      ],
    },
    {
      key: 'G',
      lines: [
        [{ text: '艮良', kind: 'phonetic' }],
        [{ text: '鬼革骨', kind: 'phonetic' }],
      ],
    },
    {
      key: 'H',
      lines: [
        [{ text: '灬虍', kind: 'phonetic' }],
        [{ text: '禾黑', kind: 'phonetic' }],
      ],
    },
    {
      key: 'J',
      lines: [
        [{ text: '钅龹', kind: 'phonetic' }],
        [{ text: '金', kind: 'phonetic' }],
      ],
    },
    {
      key: 'K',
      lines: [
        [{ text: '匚冂凵', kind: 'special' }],
        [{ text: '口', kind: 'special' }, { text: '吕', kind: 'phonetic' }],
      ],
    },
    {
      key: 'L',
      corner: { text: '竖丨', kind: 'stroke' },
      lines: [[{ text: '耂立龙', kind: 'phonetic' }]],
    },
  ],
  [
    {
      key: 'Z',
      lines: [
        [{ text: '辶廴', kind: 'special' }],
        [{ text: '⻊', kind: 'phonetic' }],
      ],
    },
    {
      key: 'X',
      lines: [
        [{ text: '⺍⺌⺗', kind: 'phonetic' }],
        [{ text: '忄', kind: 'phonetic' }, { text: '乂', kind: 'non-phonetic' }],
      ],
    },
    { key: 'C', lines: [[{ text: '艹廾', kind: 'phonetic' }]] },
    {
      key: 'V',
      corner: { text: '折乛', kind: 'stroke' },
      lines: [[{ text: '⺮豸', kind: 'phonetic' }]],
    },
    {
      key: 'B',
      lines: [
        [{ text: '冖宀丷', kind: 'phonetic' }],
        [{ text: '匕疒', kind: 'phonetic' }, { text: '勹', kind: 'special' }],
      ],
    },
    {
      key: 'N',
      corner: { text: '捺乀', kind: 'stroke' },
      lines: [[{ text: '⺧牜', kind: 'phonetic' }]],
    },
    { key: 'M', lines: [[{ text: '朩', kind: 'phonetic' }]] },
  ],
]

export const FLYPY_SMALL_CHARS: { key: string; chars: string }[] = [
  { key: 'a', chars: '凹' },
  { key: 'b', chars: '百白八卜匕卞不巴本必丙半办' },
  { key: 'c', chars: '寸才匆册' },
  { key: 'd', chars: '大丁刀歹习东丹电氏' },
  { key: 'e', chars: '二耳儿而' },
  { key: 'f', chars: '非方飞夫凡甫弗乏丰' },
  { key: 'g', chars: '广弓戈工瓜干个甘丐果更夬' },
  { key: 'h', chars: '禾户互乎火' },
  { key: 'i', chars: '川厂车长叉尺丑臣成垂斥串产出' },
  { key: 'j', chars: '巾几九斤久巨己井及夹甲臼韭戋柬击' },
  { key: 'k', chars: '口开亏' },
  { key: 'l', chars: '了力乐来良两里吏耒卵丽' },
  { key: 'm', chars: '木毛米门马皿末灭母民么面' },
  { key: 'n', chars: '廿女牛鸟乃内农年' },
  { key: 'p', chars: '片平爿' },
  { key: 'q', chars: '七千犬丘曲且气乞' },
  { key: 'r', chars: '人入冉壬刃' },
  { key: 's', chars: '三巳肃' },
  { key: 't', chars: '土天太屯' },
  { key: 'u', chars: '十尸士手身水上少术失生世申史升事书束勺戊豕氏矢' },
  { key: 'v', chars: '止爪主舟之正丈中专朱州重乍' },
  { key: 'w', chars: '王瓦五无万午卫亡未乌韦勿为戊戌我丸兀' },
  { key: 'x', chars: '小西心血下夕乡成习' },
  { key: 'y', chars: '又酉已于义与天玉牙丫永尤也业由央亚严用幺禺臾尹禹吏弋聿雨曳' },
  { key: 'z', chars: '再自子' },
]

/** 小字字根拼音标注：易混读音 + 生僻字 */
export const FLYPY_SMALL_CHAR_PINYIN: Record<string, string> = {
  '卞': 'biàn',
  '甫': 'fǔ',
  '弗': 'fú',
  '丐': 'gài',
  '夬': 'guài',
  '臼': 'jiù',
  '戋': 'jiān',
  '耒': 'lěi',
  '皿': 'mǐn',
  '廿': 'niàn',
  '爿': 'pán',
  '冉': 'rǎn',
  '巳': 'sì',
  '矢': 'shǐ',
  '豕': 'shǐ',
  '戊': 'wù',
  '戌': 'xū',
  '乍': 'zhà',
  '兀': 'wù',
  '禺': 'yú',
  '臾': 'yú',
  '弋': 'yì',
  '聿': 'yù',
  '曳': 'yè',
}
