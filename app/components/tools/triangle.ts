export type TriangleDirection =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

export type BorderSide = 'top' | 'right' | 'bottom' | 'left'

export interface BorderPart {
  side: BorderSide
  label: string
  width: number
  color: string
  colored: boolean
}

export const DIRECTION_GRID: Array<TriangleDirection | null> = [
  'top-left',
  'top',
  'top-right',
  'left',
  null,
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
]

export const DIRECTION_LABEL: Record<TriangleDirection, string> = {
  'top-left': '左上',
  top: '上',
  'top-right': '右上',
  left: '左',
  right: '右',
  'bottom-left': '左下',
  bottom: '下',
  'bottom-right': '右下',
}

export const SIDE_LABEL: Record<BorderSide, string> = {
  top: '上',
  right: '右',
  bottom: '下',
  left: '左',
}

const COLORED_SIDE: Record<TriangleDirection, BorderSide> = {
  top: 'bottom',
  'top-right': 'right',
  right: 'left',
  'bottom-right': 'bottom',
  bottom: 'top',
  'bottom-left': 'left',
  left: 'right',
  'top-left': 'top',
}

export function formatPx(value: number) {
  if (value === 0) return '0'
  const rounded = Math.round(value * 100) / 100
  return `${rounded}px`
}

export function borderParts(
  direction: TriangleDirection,
  width: number,
  height: number,
  color: string,
): BorderPart[] {
  const halfWidth = width / 2
  const halfHeight = height / 2
  // 上、右、下、左
  const widths: Record<TriangleDirection, [number, number, number, number]> = {
    top: [0, halfWidth, height, halfWidth],
    'top-right': [0, width, height, 0],
    right: [halfHeight, 0, halfHeight, width],
    'bottom-right': [0, 0, height, width],
    bottom: [height, halfWidth, 0, halfWidth],
    'bottom-left': [height, 0, 0, width],
    left: [halfHeight, width, halfHeight, 0],
    'top-left': [height, width, 0, 0],
  }

  const [top, right, bottom, left] = widths[direction]
  const bySide: Record<BorderSide, number> = { top, right, bottom, left }
  const colored = COLORED_SIDE[direction]
  return (Object.keys(SIDE_LABEL) as BorderSide[]).map((side) => ({
    side,
    label: SIDE_LABEL[side],
    width: bySide[side],
    color: side === colored ? color : 'transparent',
    colored: side === colored,
  }))
}

export function borderDeclaration(parts: BorderPart[]) {
  return {
    width: parts.map((part) => formatPx(part.width)).join(' '),
    color: parts.map((part) => part.color).join(' '),
  }
}

export function triangleCss(parts: BorderPart[], host: 'element' | 'pseudo') {
  const { width, color } = borderDeclaration(parts)
  const body = [
    'width: 0;',
    'height: 0;',
    'border-style: solid;',
    `border-width: ${width};`,
    `border-color: ${color};`,
  ]
  if (host === 'pseudo') {
    return [
      '.element::after {',
      "  content: '';",
      '  display: block;',
      ...body.map((line) => `  ${line}`),
      '}',
    ].join('\n')
  }
  return ['.element {', ...body.map((line) => `  ${line}`), '}'].join('\n')
}

export interface LayerPoint {
  x: number
  y: number
}

export interface TriangleLayers {
  polygons: Array<BorderPart & { points: string }>
  frame: { x: number; y: number; width: number; height: number }
  content: LayerPoint
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

export function triangleLayers(
  parts: BorderPart[],
  frameSize = { width: 320, height: 320, pad: 16 },
): TriangleLayers {
  const bySide = Object.fromEntries(parts.map((part) => [part.side, part])) as Record<
    BorderSide,
    BorderPart
  >
  const boxWidth = bySide.left.width + bySide.right.width
  const boxHeight = bySide.top.width + bySide.bottom.width
  const scale = Math.min(
    (frameSize.width - frameSize.pad * 2) / boxWidth,
    (frameSize.height - frameSize.pad * 2) / boxHeight,
  )
  const drawnWidth = boxWidth * scale
  const drawnHeight = boxHeight * scale
  const x0 = (frameSize.width - drawnWidth) / 2
  const y0 = (frameSize.height - drawnHeight) / 2
  const x1 = x0 + drawnWidth
  const y1 = y0 + drawnHeight
  const content = {
    x: round(x0 + bySide.left.width * scale),
    y: round(y0 + bySide.top.width * scale),
  }
  const corners: Record<BorderSide, LayerPoint[]> = {
    top: [{ x: x0, y: y0 }, { x: x1, y: y0 }, content],
    right: [{ x: x1, y: y0 }, { x: x1, y: y1 }, content],
    bottom: [{ x: x0, y: y1 }, { x: x1, y: y1 }, content],
    left: [{ x: x0, y: y0 }, { x: x0, y: y1 }, content],
  }
  return {
    polygons: parts
      .filter((part) => part.width > 0)
      .sort((left, right) => Number(left.colored) - Number(right.colored))
      .map((part) => ({
        ...part,
        points: corners[part.side].map((point) => `${round(point.x)},${round(point.y)}`).join(' '),
      })),
    frame: { x: round(x0), y: round(y0), width: round(drawnWidth), height: round(drawnHeight) },
    content,
  }
}
