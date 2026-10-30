import type { Cube, Face } from './rubik-engine'
import { moveSpin } from './rubik-engine'
import { RUBIK_FACE_RGB } from './rubik-colors'

type Vec = [number, number, number]
type Pt2 = [number, number, number]

export interface CubeTurn {
  move: string
  t: number
}

const FACE_RGB: Record<Face, Vec> = {
  U: [...RUBIK_FACE_RGB.U],
  D: [...RUBIK_FACE_RGB.D],
  F: [...RUBIK_FACE_RGB.F],
  B: [...RUBIK_FACE_RGB.B],
  R: [...RUBIK_FACE_RGB.R],
  L: [...RUBIK_FACE_RGB.L],
}

const PLASTIC: Vec = [28, 28, 32]

const DIRS: { face: Face, n: Vec }[] = [
  { face: 'R', n: [1, 0, 0] },
  { face: 'L', n: [-1, 0, 0] },
  { face: 'U', n: [0, 1, 0] },
  { face: 'D', n: [0, -1, 0] },
  { face: 'F', n: [0, 0, 1] },
  { face: 'B', n: [0, 0, -1] },
]

const AXIS: Record<Face, 'x' | 'y' | 'z'> = {
  U: 'y',
  D: 'y',
  R: 'x',
  L: 'x',
  F: 'z',
  B: 'z',
}

const CW_SIGN: Record<Face, number> = {
  U: -1,
  D: 1,
  R: -1,
  L: 1,
  F: -1,
  B: 1,
}

const HALF = 0.5
/** Sticker half-extent on a face; closer to HALF = thinner black rim. */
const STICKER = 0.445
const LIGHT = norm([0.45, 0.92, 0.28])
const FILL = norm([-0.35, 0.15, 0.55])

function add(a: Vec, b: Vec, s = 1): Vec {
  return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
}

function sub(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function dot(a: Vec, b: Vec) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function cross(a: Vec, b: Vec): Vec {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function norm(a: Vec): Vec {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

function rotate(p: Vec, axis: 'x' | 'y' | 'z', a: number): Vec {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const [x, y, z] = p
  if (axis === 'x')
    return [x, y * c - z * s, y * s + z * c]
  if (axis === 'y')
    return [x * c + z * s, y, -x * s + z * c]
  return [x * c - y * s, x * s + y * c, z]
}

function inLayer(x: number, y: number, z: number, face: Face) {
  if (face === 'U')
    return y === 1
  if (face === 'D')
    return y === -1
  if (face === 'R')
    return x === 1
  if (face === 'L')
    return x === -1
  if (face === 'F')
    return z === 1
  return z === -1
}

function stickerIndex(x: number, y: number, z: number, face: Face) {
  if (face === 'U')
    return (z + 1) * 3 + (x + 1)
  if (face === 'D')
    return (1 - z) * 3 + (x + 1)
  if (face === 'F')
    return (1 - y) * 3 + (x + 1)
  if (face === 'B')
    return (1 - y) * 3 + (1 - x)
  if (face === 'R')
    return (1 - y) * 3 + (1 - z)
  return (1 - y) * 3 + (z + 1)
}

function isOuter(x: number, y: number, z: number, face: Face) {
  if (face === 'U')
    return y === 1
  if (face === 'D')
    return y === -1
  if (face === 'R')
    return x === 1
  if (face === 'L')
    return x === -1
  if (face === 'F')
    return z === 1
  return z === -1
}

function shade(c: Vec, k: number, spec = 0): string {
  const r = Math.min(255, Math.round(c[0] * k + spec * 255))
  const g = Math.min(255, Math.round(c[1] * k + spec * 255))
  const b = Math.min(255, Math.round(c[2] * k + spec * 255))
  return `rgb(${r} ${g} ${b})`
}

interface Quad {
  pts: Vec[]
  color: Vec
  n: Vec
  sticker: boolean
}

function cubieQuads(cube: Cube, x: number, y: number, z: number): Quad[] {
  const center: Vec = [x, y, z]
  const quads: Quad[] = []
  for (const dir of DIRS) {
    if (!isOuter(x, y, z, dir.face))
      continue
    const n = dir.n
    const u: Vec = n[0] === 0 ? [1, 0, 0] : [0, 1, 0]
    const v = cross(n, u)
    const c = add(center, n, HALF)
    quads.push({
      pts: [
        add(add(c, u, -HALF), v, -HALF),
        add(add(c, u, HALF), v, -HALF),
        add(add(c, u, HALF), v, HALF),
        add(add(c, u, -HALF), v, HALF),
      ],
      color: PLASTIC,
      n,
      sticker: false,
    })
    const lift = add(c, n, 0.03)
    quads.push({
      pts: [
        add(add(lift, u, -STICKER), v, -STICKER),
        add(add(lift, u, STICKER), v, -STICKER),
        add(add(lift, u, STICKER), v, STICKER),
        add(add(lift, u, -STICKER), v, STICKER),
      ],
      color: FACE_RGB[cube[dir.face][stickerIndex(x, y, z, dir.face)]!],
      n,
      sticker: true,
    })
  }
  return quads
}

interface DrawQuad {
  proj: [Pt2, Pt2, Pt2, Pt2]
  fill: string
  z: number
}

export function drawCubeScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cube: Cube,
  turn: CubeTurn | null,
) {
  const w = width
  const h = height
  const yaw = 0.62
  const pitch = 0.38
  const dist = 6.2
  const cam: Vec = [
    Math.sin(yaw) * Math.cos(pitch) * dist,
    Math.sin(pitch) * dist,
    Math.cos(yaw) * Math.cos(pitch) * dist,
  ]
  const forward = norm(sub([0, 0, 0], cam))
  const right = norm(cross(forward, [0, 1, 0]))
  const up = cross(right, forward)
  // Fill the square viewport; isometric cube footprint is wider than tall in this view.
  const scale = Math.min(w, h) * 1.12

  function project(p: Vec): Pt2 {
    const rel = sub(p, cam)
    const cz = dot(rel, forward)
    const cx = dot(rel, right)
    const cy = dot(rel, up)
    const inv = scale / Math.max(0.35, cz)
    return [w * 0.5 + cx * inv, h * 0.5 - cy * inv, cz]
  }

  ctx.clearRect(0, 0, w, h)

  const spin = turn ? moveSpin(turn.move) : null
  const angle = spin && turn ? turn.t * spin.quarters * CW_SIGN[spin.face] * Math.PI / 2 : 0
  const axis = spin ? AXIS[spin.face] : 'y'
  const face = spin?.face

  function xf(p: Vec, x: number, y: number, z: number): Vec {
    if (face && inLayer(x, y, z, face))
      return rotate(p, axis, angle)
    return p
  }

  const draws: DrawQuad[] = []

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0)
          continue
        for (const q of cubieQuads(cube, x, y, z)) {
          const n = xf(q.n, x, y, z)
          const pts = q.pts.map(p => xf(p, x, y, z))
          const p0 = pts[0]!
          const p2 = pts[2]!
          const mid: Vec = [
            (p0[0] + p2[0]) / 2,
            (p0[1] + p2[1]) / 2,
            (p0[2] + p2[2]) / 2,
          ]
          if (dot(n, sub(cam, mid)) <= 0.02)
            continue
          const proj = pts.map(project) as [Pt2, Pt2, Pt2, Pt2]
          const lit = Math.max(0, dot(n, LIGHT))
          const fillLit = Math.max(0, dot(n, FILL))
          const diff = 0.48 + 0.42 * lit + 0.12 * fillLit
          const spec = q.sticker ? 0.1 * lit ** 10 : 0.03 * lit ** 6
          const depth = (proj[0][2] + proj[1][2] + proj[2][2] + proj[3][2]) / 4
            - (q.sticker ? 0.05 : 0)
          draws.push({
            proj,
            fill: shade(q.color, diff, spec),
            z: depth,
          })
        }
      }
    }
  }

  draws.sort((a, b) => b.z - a.z)

  for (const q of draws) {
    const [a, b, c, d] = q.proj
    ctx.beginPath()
    ctx.moveTo(a[0], a[1])
    ctx.lineTo(b[0], b[1])
    ctx.lineTo(c[0], c[1])
    ctx.lineTo(d[0], d[1])
    ctx.closePath()
    ctx.fillStyle = q.fill
    ctx.fill()
  }
}
