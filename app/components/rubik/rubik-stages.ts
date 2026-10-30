import { invertAlg } from './rubik-engine'

export interface RubikStage {
  id: string
  title: string
  mnemonic: string
  alg: string
  setup: string
  view: 'iso' | 'both'
  note: string
}

const SEXY = "R U R' U'"
const FRURUF = "F R U R' U' F'"
const ANTISUNE = "R' U' R U' R' U2 R"
const UPERM = "R' U R' U' R' U' R' U R U R2"
const APERM = "R' F R' B2 R F' R' B2 R2"
const MID_L = "U' L' U' L U2 R U R' U'"
const MID_R = "U R U R' U2 L' U' L U"
const FIRST_LAYER = "F' U' F U R U R' U'"
const PLL = `${invertAlg(UPERM)} ${invertAlg(APERM)}`

/** 播完后停在 goal（从复原打乱），而不是整颗复原 */
function setupTo(goal: string, alg: string) {
  return `${goal} ${invertAlg(alg)}`.trim()
}

export const RUBIK_STAGES: RubikStage[] = [
  {
    id: 'white-cross',
    title: '拼底层十字',
    mnemonic: '对齐后转 180°',
    alg: 'F2 R2 B2 L2',
    setup: 'F2 R2 B2 L2',
    view: 'both',
    note: '四条白棱都在顶层、白色朝上，侧面已经和中心对齐。每个面转 180° 拧到底。',
  },
  {
    id: 'white-corner',
    title: '拼底层角块',
    mnemonic: '上左下右',
    alg: SEXY,
    setup: setupTo(FIRST_LAYER, SEXY),
    view: 'both',
    note: '白角放到目标槽正上方，反复右手公式，直到角块落入底层。',
  },
  {
    id: 'mid-left',
    title: '中层棱 · 去左边',
    mnemonic: '往右远离 → 上右下左 → 空档移到右手 → 上左下右',
    alg: MID_L,
    setup: setupTo(PLL, MID_L),
    view: 'both',
    note: '顶层棱块对好前面颜色，要去左槽：先往右躲开，左手公式，再把空档转到右手做右手公式。',
  },
  {
    id: 'mid-right',
    title: '中层棱 · 去右边',
    mnemonic: '往左远离 → 上左下右 → 空档移到左手 → 上右下左',
    alg: MID_R,
    setup: setupTo(PLL, MID_R),
    view: 'both',
    note: '和左边对称：棱块往左躲开，右手公式，空档转到左手再做左手公式。',
  },
  {
    id: 'yellow-l',
    title: '顶面十字 · 小拐',
    mnemonic: '前面顺时针，上左下右，前面逆时针',
    alg: FRURUF,
    setup: setupTo(invertAlg(FRURUF), FRURUF),
    view: 'both',
    note: '小拐放在左后（九点方向），做一次变成一字。点的情况先做一次变成小拐。',
  },
  {
    id: 'yellow-line',
    title: '顶面十字 · 一字',
    mnemonic: '前面顺时针，上左下右，前面逆时针',
    alg: FRURUF,
    setup: setupTo(invertAlg(ANTISUNE), FRURUF),
    view: 'both',
    note: '一字横着放（左右有黄），做一次出十字。只要顶面黄棱，侧面先不用管。',
  },
  {
    id: 'yellow-two',
    title: '顶面颜色 · 缺两点',
    mnemonic: '下右上右下右右上',
    alg: ANTISUNE,
    setup: "R2 D' R U2 R' D R U2 R",
    view: 'both',
    note: '十字已成、缺两个黄角。左后方（背面左上）放一块黄色，做小鱼公式变成小鱼。',
  },
  {
    id: 'yellow-four',
    title: '顶面颜色 · 缺四点',
    mnemonic: '下右上右下右右上',
    alg: ANTISUNE,
    setup: "R U R' U R U' R' U R U2 R' U",
    view: 'both',
    note: '四个黄角都不朝上。背面不要出现黄色，做小鱼公式变成小鱼。',
  },
  {
    id: 'yellow-fish',
    title: '顶面颜色 · 小鱼',
    mnemonic: '下右上右下右右上',
    alg: ANTISUNE,
    setup: setupTo(PLL, ANTISUNE),
    view: 'both',
    note: '鱼头放在左上角（左后），做一次顶面全黄。不成再摆一次鱼头。',
  },
  {
    id: 'pll-corners',
    title: '顶层角块对位',
    mnemonic: '上右上，下 180°，下左上，下 180°，右 180°',
    alg: APERM,
    setup: setupTo(invertAlg(UPERM), APERM),
    view: 'both',
    note: '口诀原握法是黄面朝自己、成对的那一组放掌心。这里用黄顶、成对放后面的等价公式。没有成对就先做一次再找。',
  },
  {
    id: 'pll-edges',
    title: '顶层棱块对位',
    mnemonic: '下左下右，下右下左，上左，右 180°',
    alg: UPERM,
    setup: setupTo('', UPERM),
    view: 'both',
    note: '已经还原的那一侧面朝自己，做公式。没有整面还原就任意朝前做一次。',
  },
]

const STAGE_MAP = new Map(RUBIK_STAGES.map(stage => [stage.id, stage]))

export function getRubikStage(id: string | undefined): RubikStage | undefined {
  if (!id)
    return undefined
  return STAGE_MAP.get(id)
}
