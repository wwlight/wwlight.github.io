import type {
  GlyphCropId,
  RadicalComponent,
  RadicalKind,
  RadicalKeyData,
  RadicalSegment,
} from './flypy-data'
import {
  FLYPY_RADICAL_ROWS,
  FLYPY_SMALL_CHAR_PINYIN,
  FLYPY_SMALL_CHARS,
} from './flypy-data'

export const FLYPY_SVG_WIDTH = 1000
export const FLYPY_SVG_GAP = 8
export const FLYPY_SVG_UNIT
  = (FLYPY_SVG_WIDTH - 9 * FLYPY_SVG_GAP) / 10
export const FLYPY_SVG_PAD = FLYPY_SVG_UNIT * 0.09
export const FLYPY_SVG_RADIUS = 6

const ROW_INDENT = [0, 0.5, 1.5] as const

export type RadicalSvgGlyph =
  | { type: 'text', char: string, kind: RadicalKind }
  | { type: 'symbol', id: GlyphCropId, kind: RadicalKind }

export type RadicalSvgGlyphPos = RadicalSvgGlyph & {
  x: number
  y: number
  w: number
  h: number
}

export type RadicalSvgKeyLayout = {
  key: string
  x: number
  y: number
  size: number
  letterX: number
  letterY: number
  letterSize: number
  corner?: {
    text: string
    kind: RadicalKind
    x: number
    y: number
    size: number
  }
  glyphs: RadicalSvgGlyphPos[]
}

export type RadicalSvgBrandLayout = {
  x: number
  y: number
  size: number
}

export type RadicalSvgSmallChar = {
  char: string
  pinyin?: string
  x: number
  y: number
  pinyinY: number
  charY: number
}

export type RadicalSvgSmallItem = {
  key: string
  keyX: number
  keyY: number
  chars: RadicalSvgSmallChar[]
}

export type RadicalSvgLayout = {
  width: number
  height: number
  viewBox: string
  keys: RadicalSvgKeyLayout[]
  brand: RadicalSvgBrandLayout
  legendY: number
  smallTitleY: number
  smallItems: RadicalSvgSmallItem[]
  font: {
    legend: number
    smallTitle: number
    smallKey: number
    smallPinyin: number
    smallHanzi: number
  }
}

function flattenLine(line: RadicalSegment[]): RadicalSvgGlyph[] {
  const out: RadicalSvgGlyph[] = []
  for (const segment of line) {
    for (const comp of segment.components) {
      if (comp.type === 'text')
        out.push({ type: 'text', char: comp.char, kind: segment.kind })
      else
        out.push({ type: 'symbol', id: comp.id, kind: segment.kind })
    }
  }
  return out
}

function cornerText(corner: RadicalSegment): string {
  return corner.components
    .map((c: RadicalComponent) => (c.type === 'text' ? c.char : ''))
    .join('')
}

function layoutKey(
  item: RadicalKeyData,
  x: number,
  y: number,
): RadicalSvgKeyLayout {
  const size = FLYPY_SVG_UNIT
  const pad = FLYPY_SVG_PAD
  const letterSize = size * 0.22
  const glyphH = size * 0.2
  const glyphGap = size * 0.045
  const lineGap = size * 0.04
  const bodyTop = y + size * 0.36

  const lines = item.lines.map(flattenLine)
  const lineCount = Math.max(lines.length, 1)
  const bodyHeight = lineCount * glyphH + (lineCount - 1) * lineGap
  let lineY = bodyTop + (size - (bodyTop - y) - pad - bodyHeight) / 2

  const glyphs: RadicalSvgGlyphPos[] = []
  for (const line of lines) {
    const widths = line.map(g =>
      g.type === 'symbol' ? glyphH * 1.35 : glyphH,
    )
    const total
      = widths.reduce((a, b) => a + b, 0) + Math.max(0, line.length - 1) * glyphGap
    let gx = x + (size - total) / 2
    for (let i = 0; i < line.length; i++) {
      const g = line[i]!
      const w = widths[i]!
      glyphs.push({
        ...g,
        x: gx,
        y: lineY,
        w,
        h: glyphH,
      })
      gx += w + glyphGap
    }
    lineY += glyphH + lineGap
  }

  const corner = item.corner
    ? {
        text: cornerText(item.corner),
        kind: item.corner.kind,
        x: x + size - pad,
        y: y + pad + size * 0.14,
        size: size * 0.13,
      }
    : undefined

  return {
    key: item.key,
    x,
    y,
    size,
    letterX: x + pad,
    letterY: y + pad + letterSize * 0.85,
    letterSize,
    corner,
    glyphs,
  }
}

function layoutSmallItems(
  startY: number,
): { items: RadicalSvgSmallItem[], endY: number } {
  const padX = 4
  const colGap = 16
  const cols = 3
  const colW = (FLYPY_SVG_WIDTH - padX * 2 - colGap * (cols - 1)) / cols
  const keyW = 18
  const charW = 20
  const pinyinH = 12
  const hanziH = 18
  const rowH = pinyinH + hanziH
  const itemGap = 8
  const colInner = colW - keyW - 4
  const perRow = Math.max(1, Math.floor(colInner / charW))

  // 上→下填满一列，再换下一列（左→右）
  const perCol = Math.ceil(FLYPY_SMALL_CHARS.length / cols)
  const cursorY = [startY, startY, startY]
  const items: RadicalSvgSmallItem[] = []

  for (let i = 0; i < FLYPY_SMALL_CHARS.length; i++) {
    const item = FLYPY_SMALL_CHARS[i]!
    const col = Math.floor(i / perCol)
    const colX = padX + col * (colW + colGap)
    const y0 = cursorY[col]!
    const chars = [...item.chars]
    const laid: RadicalSvgSmallChar[] = []

    for (let ci = 0; ci < chars.length; ci++) {
      const row = Math.floor(ci / perRow)
      const colIdx = ci % perRow
      const char = chars[ci]!
      const cx = colX + keyW + 4 + colIdx * charW
      const cy = y0 + row * rowH
      laid.push({
        char,
        pinyin: FLYPY_SMALL_CHAR_PINYIN[char],
        x: cx + charW / 2,
        y: cy,
        pinyinY: cy + pinyinH * 0.85,
        charY: cy + pinyinH + hanziH * 0.85,
      })
    }

    const rows = Math.max(1, Math.ceil(chars.length / perRow))
    items.push({
      key: item.key,
      keyX: colX,
      keyY: y0 + pinyinH + hanziH * 0.85,
      chars: laid,
    })
    cursorY[col]! += rows * rowH + itemGap
  }

  return {
    items,
    endY: Math.max(...cursorY) + 8,
  }
}

export function buildRadicalSvgLayout(): RadicalSvgLayout {
  const keys: RadicalSvgKeyLayout[] = []
  let brand: RadicalSvgBrandLayout = {
    x: 0,
    y: 0,
    size: FLYPY_SVG_UNIT,
  }

  for (let rowIndex = 0; rowIndex < FLYPY_RADICAL_ROWS.length; rowIndex++) {
    const row = FLYPY_RADICAL_ROWS[rowIndex]!
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

  const boardBottom = 3 * FLYPY_SVG_UNIT + 2 * FLYPY_SVG_GAP
  const legendFont = 17
  const smallTitleFont = 16
  // 「小字字根」标题上下留白一致（相对文字外框）
  const titleGap = 16
  const legendY = boardBottom + 32
  const smallTitleY = legendY + legendFont * 0.15 + titleGap + smallTitleFont * 0.85
  const smallStartY = smallTitleY + smallTitleFont * 0.15 + titleGap
  const { items: smallItems, endY } = layoutSmallItems(smallStartY)

  return {
    width: FLYPY_SVG_WIDTH,
    height: endY,
    viewBox: `0 0 ${FLYPY_SVG_WIDTH} ${endY}`,
    keys,
    brand,
    legendY,
    smallTitleY,
    smallItems,
    font: {
      legend: legendFont,
      smallTitle: smallTitleFont,
      smallKey: 16,
      smallPinyin: 11,
      smallHanzi: 16,
    },
  }
}
