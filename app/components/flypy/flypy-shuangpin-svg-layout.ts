import type {
  FlypyKeyData,
  FlypyMnemonicKeyData,
  MnemonicCharTone,
  MnemonicFinalTone,
} from './flypy-data'
import {
  FLYPY_MNEMONIC_ROWS,
  FLYPY_ROWS,
} from './flypy-data'
import {
  FLYPY_SVG_GAP,
  FLYPY_SVG_PAD,
  FLYPY_SVG_UNIT,
  FLYPY_SVG_WIDTH,
} from './flypy-radical-svg-layout'

export { FLYPY_SVG_RADIUS } from './flypy-radical-svg-layout'

const ROW_INDENT = [0, 0.5, 1.5] as const

export type ShuangpinSvgTone = 'default' | 'initial' | 'final' | 'final-green' | 'orange' | 'green'

export type ShuangpinSvgText = {
  text: string
  x: number
  y: number
  size: number
  tone: ShuangpinSvgTone
  anchor?: 'start' | 'middle' | 'end'
}

export type ShuangpinSvgBrand = {
  x: number
  y: number
  size: number
}

export type ShuangpinSvgKey = {
  key: string
  x: number
  y: number
  size: number
  letter: ShuangpinSvgText
  topRight: ShuangpinSvgText[]
  finals: ShuangpinSvgText[]
}

export type ShuangpinSvgLayout = {
  width: number
  height: number
  viewBox: string
  keys: ShuangpinSvgKey[]
  brand: ShuangpinSvgBrand
}

function estimateTextWidth(text: string, fontSize: number): number {
  let w = 0
  for (const ch of text) {
    // 拉丁略偏宽估，避免右缘贴键边
    w += /[\u4e00-\u9fff]/.test(ch) ? fontSize : fontSize * 0.72
  }
  return w
}

function layoutTopRight(
  items: { text: string, tone: ShuangpinSvgTone, size: number }[],
  keyX: number,
  keySize: number,
  pad: number,
  y: number,
): ShuangpinSvgText[] {
  const gap = keySize * 0.03
  // 右缘对齐到内边距内侧，避免宽度估算误差导致贴边
  let cursor = keyX + keySize - pad
  const out: ShuangpinSvgText[] = []
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]!
    out.unshift({
      text: item.text,
      x: cursor,
      y,
      size: item.size,
      tone: item.tone,
      anchor: 'end',
    })
    cursor -= estimateTextWidth(item.text, item.size) + gap
  }
  return out
}

function layoutFinals(
  lines: { text: string, tone: ShuangpinSvgTone }[],
  keyX: number,
  keyY: number,
  keySize: number,
  pad: number,
  bodyTop: number,
  finalSize: number,
): ShuangpinSvgText[] {
  const lineH = finalSize * 1.28
  const totalH = lines.length * lineH
  const bodyBottom = keyY + keySize - pad
  const startY = bodyTop + (bodyBottom - bodyTop - totalH) / 2 + finalSize * 0.85
  const cx = keyX + keySize / 2
  return lines.map((line, i) => ({
    text: line.text,
    x: cx,
    y: startY + i * lineH,
    size: finalSize,
    tone: line.tone,
    anchor: 'middle' as const,
  }))
}

function layoutLayoutKey(item: FlypyKeyData, x: number, y: number): ShuangpinSvgKey {
  const size = FLYPY_SVG_UNIT
  const pad = FLYPY_SVG_PAD
  const letterSize = size * 0.22
  const initialSize = size * 0.23
  const finalSize = size * 0.22
  const letterY = y + pad + letterSize * 0.85
  const bodyTop = y + pad + Math.max(letterSize, initialSize) * 1.2

  const topRight = layoutTopRight(
    [{ text: item.initial, tone: 'initial', size: initialSize }],
    x,
    size,
    pad,
    letterY,
  )

  const finals = layoutFinals(
    item.finals.split(' / ').map(text => ({ text, tone: 'final' as const })),
    x,
    y,
    size,
    pad,
    bodyTop,
    finalSize,
  )

  return {
    key: item.key,
    x,
    y,
    size,
    letter: {
      text: item.key,
      x: x + pad,
      y: letterY,
      size: letterSize,
      tone: 'default',
      anchor: 'start',
    },
    topRight,
    finals,
  }
}

function charTone(tone?: MnemonicCharTone): ShuangpinSvgTone {
  return tone === 'green' ? 'green' : 'orange'
}

function finalTone(tone?: MnemonicFinalTone): ShuangpinSvgTone {
  return tone === 'green' ? 'final-green' : 'final'
}

function layoutMnemonicKey(item: FlypyMnemonicKeyData, x: number, y: number): ShuangpinSvgKey {
  const size = FLYPY_SVG_UNIT
  const pad = FLYPY_SVG_PAD
  const letterSize = size * 0.22
  const altSize = size * 0.22
  const charSize = size * 0.175
  const finalSize = size * 0.22
  const letterY = y + pad + letterSize * 0.85
  const bodyTop = y + pad + Math.max(letterSize, altSize, charSize) * 1.2

  const topItems: { text: string, tone: ShuangpinSvgTone, size: number }[] = []
  if (item.altInitial)
    topItems.push({ text: item.altInitial, tone: 'initial', size: altSize })
  for (const ch of item.mnemonicChars ?? [])
    topItems.push({ text: ch.char, tone: charTone(ch.tone), size: charSize })

  const topRight = layoutTopRight(topItems, x, size, pad, letterY)
  const finals = layoutFinals(
    item.finals.map(f => ({ text: f.text, tone: finalTone(f.tone) })),
    x,
    y,
    size,
    pad,
    bodyTop,
    finalSize,
  )

  return {
    key: item.key,
    x,
    y,
    size,
    letter: {
      text: item.key,
      x: x + pad,
      y: letterY,
      size: letterSize,
      tone: 'default',
      anchor: 'start',
    },
    topRight,
    finals,
  }
}

function buildBoardKeys<T>(
  rows: T[][],
  layoutKey: (item: T, x: number, y: number) => ShuangpinSvgKey,
): ShuangpinSvgLayout {
  const keys: ShuangpinSvgKey[] = []
  let brand: ShuangpinSvgBrand = { x: 0, y: 0, size: FLYPY_SVG_UNIT }

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]!
    const indent = ROW_INDENT[rowIndex]! * (FLYPY_SVG_UNIT + FLYPY_SVG_GAP)
    const y = rowIndex * (FLYPY_SVG_UNIT + FLYPY_SVG_GAP)

    row.forEach((item, i) => {
      const x = indent + i * (FLYPY_SVG_UNIT + FLYPY_SVG_GAP)
      keys.push(layoutKey(item, x, y))
    })

    if (rowIndex === 2) {
      const x = indent + row.length * (FLYPY_SVG_UNIT + FLYPY_SVG_GAP)
      brand = { x, y, size: FLYPY_SVG_UNIT }
    }
  }

  const height = 3 * FLYPY_SVG_UNIT + 2 * FLYPY_SVG_GAP
  return {
    width: FLYPY_SVG_WIDTH,
    height,
    viewBox: `0 0 ${FLYPY_SVG_WIDTH} ${height}`,
    keys,
    brand,
  }
}

export function buildLayoutSvgLayout(): ShuangpinSvgLayout {
  return buildBoardKeys(FLYPY_ROWS, layoutLayoutKey)
}

export function buildMnemonicSvgLayout(): ShuangpinSvgLayout {
  return buildBoardKeys(FLYPY_MNEMONIC_ROWS, layoutMnemonicKey)
}
