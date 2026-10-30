import type { Cube, Face } from './rubik-engine'
import { parseMove, slotStepMove } from './rubik-engine'

type Pt = [number, number]
type Axis = 'x' | 'y' | 'z'
type Side = 'inner' | 'outer'

export interface RingCircle {
  id: string
  cx: number
  cy: number
  r: number
  mid: boolean
}

export interface RingDot {
  id: string
  x: number
  y: number
  face: Face
  index: number
  color: Face
}

const S = 100
const P = 22
const RADII = [S - P, S, S + P] as const
const DOT = 6.4
const PAD = 14

const C: Record<Axis, Pt> = {
  y: [0, -S / Math.sqrt(3)],
  x: [S / 2, S / (2 * Math.sqrt(3))],
  z: [-S / 2, S / (2 * Math.sqrt(3))],
}

function fmt(n: number) {
  return n.toFixed(2)
}

function dist(a: Pt, b: Pt) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function intersections(c1: Pt, r1: number, c2: Pt, r2: number): [Pt, Pt] {
  const dx = c2[0] - c1[0]
  const dy = c2[1] - c1[1]
  const d = Math.hypot(dx, dy)
  const t = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, r1 * r1 - t * t))
  const nx = dx / d
  const ny = dy / d
  const mx = c1[0] + t * nx
  const my = c1[1] + t * ny
  return [
    [mx - ny * h, my + nx * h],
    [mx + ny * h, my - nx * h],
  ]
}

function pick(pts: [Pt, Pt], third: Pt, side: Side): Pt {
  const d0 = dist(pts[0], third)
  const d1 = dist(pts[1], third)
  const inner = d0 <= d1 ? pts[0] : pts[1]
  const outer = d0 <= d1 ? pts[1] : pts[0]
  return side === 'inner' ? inner : outer
}

function meet(a: Axis, ia: number, b: Axis, ib: number, side: Side): Pt {
  const ra = RADII[ia]
  const rb = RADII[ib]
  const third: Axis = a === 'x' ? (b === 'y' ? 'z' : 'y') : a === 'y' ? (b === 'x' ? 'z' : 'x') : (b === 'x' ? 'y' : 'x')
  return pick(intersections(C[a], ra ?? S, C[b], rb ?? S), C[third], side)
}

const FACE_SLOTS: Array<{
  face: Face
  a: Axis
  b: Axis
  side: Side
  ia: (row: number, col: number) => number
  ib: (row: number, col: number) => number
}> = [
  { face: 'U', a: 'x', b: 'z', side: 'inner', ia: (_r, c) => 2 - c, ib: r => 2 - r },
  { face: 'D', a: 'x', b: 'z', side: 'outer', ia: (_r, c) => 2 - c, ib: r => r },
  { face: 'F', a: 'y', b: 'x', side: 'inner', ia: r => r, ib: (_r, c) => 2 - c },
  { face: 'B', a: 'y', b: 'x', side: 'outer', ia: r => r, ib: (_r, c) => c },
  { face: 'R', a: 'y', b: 'z', side: 'inner', ia: r => r, ib: (_r, c) => c },
  { face: 'L', a: 'y', b: 'z', side: 'outer', ia: r => r, ib: (_r, c) => 2 - c },
]

const SLOTS = FACE_SLOTS.flatMap((spec) => {
  const cells = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col
      const [x, y] = meet(spec.a, spec.ia(row, col), spec.b, spec.ib(row, col), spec.side)
      cells.push({
        id: `${spec.face}${index}`,
        x,
        y,
        face: spec.face,
        index,
      })
    }
  }
  return cells
})

export const RING_CIRCLES: RingCircle[] = (['y', 'x', 'z'] as const).flatMap(axis =>
  RADII.map((r, layer) => ({
    id: `${axis}${layer}`,
    cx: C[axis][0],
    cy: C[axis][1],
    r,
    mid: layer === 1,
  })),
)

export const RING_REULEAUX = (() => {
  const a = C.y
  const b = C.x
  const c = C.z
  const r = fmt(S)
  const arc = (to: Pt) => `A${r},${r} 0 0 1 ${fmt(to[0])} ${fmt(to[1])}`
  return `M${fmt(b[0])} ${fmt(b[1])} ${arc(c)} ${arc(a)} ${arc(b)} Z`
})()

export const RING_DOT_R = DOT

export const RING_VIEWBOX = (() => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const ring of RING_CIRCLES) {
    minX = Math.min(minX, ring.cx - ring.r)
    minY = Math.min(minY, ring.cy - ring.r)
    maxX = Math.max(maxX, ring.cx + ring.r)
    maxY = Math.max(maxY, ring.cy + ring.r)
  }
  for (const slot of SLOTS) {
    minX = Math.min(minX, slot.x - DOT)
    minY = Math.min(minY, slot.y - DOT)
    maxX = Math.max(maxX, slot.x + DOT)
    maxY = Math.max(maxY, slot.y + DOT)
  }
  return `${fmt(minX - PAD)} ${fmt(minY - PAD)} ${fmt(maxX - minX + PAD * 2)} ${fmt(maxY - minY + PAD * 2)}`
})()

const POS: Record<Face, Pt[]> = {
  U: [],
  D: [],
  L: [],
  R: [],
  F: [],
  B: [],
}

for (const slot of SLOTS) {
  POS[slot.face][slot.index] = [slot.x, slot.y]
}

const FACE_CENTER: Record<Face, Pt> = {
  U: POS.U[4] ?? C.y,
  D: POS.D[4] ?? C.y,
  L: POS.L[4] ?? C.x,
  R: POS.R[4] ?? C.x,
  F: POS.F[4] ?? C.z,
  B: POS.B[4] ?? C.z,
}

const LAYER_CENTER: Record<Face, Pt> = {
  U: C.y,
  D: C.y,
  L: C.x,
  R: C.x,
  F: C.z,
  B: C.z,
}

function posOf(face: Face, index: number): Pt {
  return POS[face][index] ?? [0, 0]
}

function atan(center: Pt, p: Pt) {
  return Math.atan2(p[1] - center[1], p[0] - center[0])
}

/** Shortest signed delta in (-π, π]. */
function shortDelta(a0: number, a1: number) {
  let delta = a1 - a0
  while (delta > Math.PI)
    delta -= Math.PI * 2
  while (delta <= -Math.PI)
    delta += Math.PI * 2
  return delta
}

/**
 * Arc delta with a forced turn direction so a whole layer spins together.
 * Shortest-arc alone mixes CW/CCW hops and reads as opposite swaps.
 */
function directedDelta(a0: number, a1: number, sign: number) {
  let delta = a1 - a0
  if (sign >= 0) {
    while (delta < 0)
      delta += Math.PI * 2
    while (delta >= Math.PI * 2)
      delta -= Math.PI * 2
  }
  else {
    while (delta > 0)
      delta -= Math.PI * 2
    while (delta <= -Math.PI * 2)
      delta += Math.PI * 2
  }
  return delta
}

function hopSign(center: Pt, hops: Array<{ from: Pt, to: Pt }>) {
  let best = 0
  let bestAbs = Infinity
  for (const hop of hops) {
    const delta = shortDelta(atan(center, hop.from), atan(center, hop.to))
    const abs = Math.abs(delta)
    if (abs < 1e-6 || abs >= bestAbs)
      continue
    bestAbs = abs
    best = Math.sign(delta)
  }
  return best || 1
}

function lerpArc(center: Pt, from: Pt, to: Pt, t: number, sign: number): Pt {
  const a0 = atan(center, from)
  const a1 = atan(center, to)
  const delta = directedDelta(a0, a1, sign)
  const a = a0 + delta * t
  const r0 = dist(center, from)
  const r1 = dist(center, to)
  const r = r0 + (r1 - r0) * t
  return [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)]
}

function colorOf(cube: Cube, face: Face, index: number): Face {
  return cube[face]?.[index] ?? face
}

export function ringDots(cube: Cube, turn?: { move: string, t: number } | null): RingDot[] {
  const move = turn?.move
  const parsed = move ? parseMove(move) : null
  const t = turn?.t ?? 0
  if (!parsed || t <= 0) {
    return SLOTS.map(slot => ({
      ...slot,
      color: colorOf(cube, slot.face, slot.index),
    }))
  }

  const steps = parsed.turns === 2 ? 2 : 1
  const u = steps === 2 ? t * 2 : t
  const hop = Math.min(steps - 1, Math.floor(u + 1e-9))
  const localT = Math.min(1, u - hop)
  const layerCenter = LAYER_CENTER[parsed.face] ?? C.x
  const faceCenter = FACE_CENTER[parsed.face] ?? layerCenter

  type Motion
    = { slot: typeof SLOTS[number], color: Face, moving: false, x: number, y: number }
      | { slot: typeof SLOTS[number], color: Face, moving: true, from: Pt, to: Pt, onFace: boolean, center: Pt }

  const motions: Motion[] = SLOTS.map((slot): Motion => {
    let face = slot.face
    let index = slot.index
    for (let s = 0; s < hop; s++) {
      const next = slotStepMove(move!, face, index)
      face = next[0]
      index = next[1]
    }
    const from = posOf(face, index)
    const [nextFace, nextIndex] = slotStepMove(move!, face, index)
    const color = colorOf(cube, slot.face, slot.index)
    if (nextFace === face && nextIndex === index) {
      return { slot, x: from[0], y: from[1], color, moving: false }
    }
    const to = posOf(nextFace, nextIndex)
    const onFace = face === parsed.face
    return {
      slot,
      from,
      to,
      color,
      onFace,
      center: onFace ? faceCenter : layerCenter,
      moving: true,
    }
  })

  const beltHops: Array<{ from: Pt, to: Pt }> = []
  const faceHops: Array<{ from: Pt, to: Pt }> = []
  for (const m of motions) {
    if (!m.moving)
      continue
    const pair = { from: m.from, to: m.to }
    if (m.onFace)
      faceHops.push(pair)
    else
      beltHops.push(pair)
  }
  const beltSign = hopSign(layerCenter, beltHops)
  const faceSign = hopSign(faceCenter, faceHops)

  return motions.map((m) => {
    if (!m.moving) {
      return { ...m.slot, x: m.x, y: m.y, color: m.color }
    }
    const sign = m.onFace ? faceSign : beltSign
    const [x, y] = lerpArc(m.center, m.from, m.to, localT, sign)
    return { ...m.slot, x, y, color: m.color }
  })
}
