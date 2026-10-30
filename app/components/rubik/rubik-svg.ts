import type { Cube, Face } from './rubik-engine'

export interface RubikPoly {
  id: string
  points: string
  color: Face
  face: Face
}

const ISO_RIGHT: [number, number] = [22, 11]
const ISO_FRONT: [number, number] = [-22, 11]
const ISO_DOWN: [number, number] = [0, 24]
const ISO_ORIGIN: [number, number] = [118, 34]

export const ISO_VIEWBOX = '40 22 156 164'

function add(a: [number, number], b: [number, number], n = 1): [number, number] {
  return [a[0] + b[0] * n, a[1] + b[1] * n]
}

function uPt(row: number, col: number): [number, number] {
  return add(add(ISO_ORIGIN, ISO_RIGHT, col), ISO_FRONT, row)
}

function insetQuad(pts: [number, number][], amount = 0.14): string {
  const cx = pts.reduce((s, p) => s + p[0], 0) / 4
  const cy = pts.reduce((s, p) => s + p[1], 0) / 4
  return pts
    .map(([x, y]) => `${(x + (cx - x) * amount).toFixed(1)},${(y + (cy - y) * amount).toFixed(1)}`)
    .join(' ')
}

function sticker(id: string, face: Face, color: Face, pts: [number, number][]): RubikPoly {
  return { id, face, color, points: insetQuad(pts) }
}

export function isoPolys(cube: Cube): RubikPoly[] {
  const polys: RubikPoly[] = []

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c
      polys.push(sticker(`U${i}`, 'U', cube.U[i]!, [
        uPt(r, c),
        uPt(r, c + 1),
        uPt(r + 1, c + 1),
        uPt(r + 1, c),
      ]))
    }
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c
      const topLeft = add(uPt(3, c), ISO_DOWN, r)
      const topRight = add(uPt(3, c + 1), ISO_DOWN, r)
      polys.push(sticker(`F${i}`, 'F', cube.F[i]!, [
        topLeft,
        topRight,
        add(topRight, ISO_DOWN),
        add(topLeft, ISO_DOWN),
      ]))
    }
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c
      const topFront = add(uPt(3 - c, 3), ISO_DOWN, r)
      const topBack = add(uPt(2 - c, 3), ISO_DOWN, r)
      polys.push(sticker(`R${i}`, 'R', cube.R[i]!, [
        topFront,
        topBack,
        add(topBack, ISO_DOWN),
        add(topFront, ISO_DOWN),
      ]))
    }
  }

  return polys
}
