export const FACES = ['U', 'D', 'L', 'R', 'F', 'B'] as const
export type Face = (typeof FACES)[number]
export type Cube = Record<Face, Face[]>
export type Move = `${Face}` | `${Face}'` | `${Face}2`

const FACE_SET = new Set<string>(FACES)

export function solvedCube(): Cube {
  return {
    U: Array.from({ length: 9 }, () => 'U' as Face),
    D: Array.from({ length: 9 }, () => 'D' as Face),
    L: Array.from({ length: 9 }, () => 'L' as Face),
    R: Array.from({ length: 9 }, () => 'R' as Face),
    F: Array.from({ length: 9 }, () => 'F' as Face),
    B: Array.from({ length: 9 }, () => 'B' as Face),
  }
}

export function copyCube(cube: Cube): Cube {
  return {
    U: cube.U.slice() as Face[],
    D: cube.D.slice() as Face[],
    L: cube.L.slice() as Face[],
    R: cube.R.slice() as Face[],
    F: cube.F.slice() as Face[],
    B: cube.B.slice() as Face[],
  }
}

export function isSolved(cube: Cube): boolean {
  return FACES.every(face => cube[face].every(sticker => sticker === face))
}

export function cubeKey(cube: Cube): string {
  return FACES.map(face => cube[face].join('')).join('')
}

type Face9 = [Face, Face, Face, Face, Face, Face, Face, Face, Face]

function rotateFace(face: Face[], turns: number) {
  const n = ((turns % 4) + 4) % 4
  for (let i = 0; i < n; i++) {
    const [a, b, c, d, e, f, g, h, j] = face as Face9
    face.splice(0, 9, g, d, a, h, e, b, j, f, c)
  }
}

function cycle4(cube: Cube, a: [Face, number], b: [Face, number], c: [Face, number], d: [Face, number]) {
  const tmp = cube[a[0]][a[1]]!
  cube[a[0]][a[1]] = cube[d[0]][d[1]]!
  cube[d[0]][d[1]] = cube[c[0]][c[1]]!
  cube[c[0]][c[1]] = cube[b[0]][b[1]]!
  cube[b[0]][b[1]] = tmp
}

type SideCycle = [[Face, number], [Face, number], [Face, number], [Face, number]]

const MOVE_CYCLES: Record<Face, SideCycle[]> = {
  U: [
    [['F', 0], ['L', 0], ['B', 0], ['R', 0]],
    [['F', 1], ['L', 1], ['B', 1], ['R', 1]],
    [['F', 2], ['L', 2], ['B', 2], ['R', 2]],
  ],
  D: [
    [['F', 6], ['R', 6], ['B', 6], ['L', 6]],
    [['F', 7], ['R', 7], ['B', 7], ['L', 7]],
    [['F', 8], ['R', 8], ['B', 8], ['L', 8]],
  ],
  R: [
    [['U', 8], ['B', 0], ['D', 8], ['F', 8]],
    [['U', 5], ['B', 3], ['D', 5], ['F', 5]],
    [['U', 2], ['B', 6], ['D', 2], ['F', 2]],
  ],
  L: [
    [['U', 6], ['F', 6], ['D', 6], ['B', 2]],
    [['U', 3], ['F', 3], ['D', 3], ['B', 5]],
    [['U', 0], ['F', 0], ['D', 0], ['B', 8]],
  ],
  F: [
    [['U', 6], ['R', 0], ['D', 2], ['L', 8]],
    [['U', 7], ['R', 3], ['D', 1], ['L', 5]],
    [['U', 8], ['R', 6], ['D', 0], ['L', 2]],
  ],
  B: [
    [['U', 2], ['L', 0], ['D', 6], ['R', 8]],
    [['U', 1], ['L', 3], ['D', 7], ['R', 5]],
    [['U', 0], ['L', 6], ['D', 8], ['R', 2]],
  ],
}

const FACE_CW = [2, 5, 8, 1, 4, 7, 0, 3, 6] as const

function slotStep(face: Face, index: number, turnFace: Face, prime: boolean): [Face, number] {
  if (face === turnFace) {
    const dest = prime
      ? FACE_CW.indexOf(index as typeof FACE_CW[number])
      : (FACE_CW[index] ?? -1)
    return [face, dest < 0 ? index : dest]
  }
  for (const cycle of MOVE_CYCLES[turnFace]) {
    const k = cycle.findIndex(slot => slot[0] === face && slot[1] === index)
    if (k < 0)
      continue
    const next = cycle[(k + (prime ? 3 : 1)) % 4]
    if (next)
      return next
  }
  return [face, index]
}

export function slotAfter(move: string, face: Face, index: number): [Face, number] {
  const parsed = parseMove(move)
  if (!parsed)
    return [face, index]
  const steps = parsed.turns === 2 ? 2 : 1
  const prime = parsed.turns === 2 ? false : parsed.prime
  let f = face
  let i = index
  for (let s = 0; s < steps; s++) {
    const next = slotStep(f, i, parsed.face, prime)
    f = next[0]
    i = next[1]
  }
  return [f, i]
}

export function slotStepMove(move: string, face: Face, index: number): [Face, number] {
  const parsed = parseMove(move)
  if (!parsed)
    return [face, index]
  const prime = parsed.turns === 2 ? false : parsed.prime
  return slotStep(face, index, parsed.face, prime)
}

export function applyMove(cube: Cube, move: string): Cube {
  const parsed = parseMove(move)
  if (!parsed)
    return cube

  const turns = parsed.turns === 2 ? 2 : parsed.prime ? 3 : 1
  rotateFace(cube[parsed.face], turns)
  for (let i = 0; i < turns; i++) {
    for (const cycle of MOVE_CYCLES[parsed.face])
      cycle4(cube, cycle[0], cycle[1], cycle[2], cycle[3])
  }
  return cube
}

export function parseMove(move: string): { face: Face, prime: boolean, turns: 1 | 2 } | null {
  const match = move.trim().match(/^([UDLRFB])(2)?'?$/)
  const face = match?.[1]
  if (!match || !face || !FACE_SET.has(face))
    return null
  return {
    face: face as Face,
    prime: move.includes("'") && !move.includes('2'),
    turns: match[2] ? 2 : 1,
  }
}

export function parseAlg(alg: string): string[] {
  return alg
    .replace(/[()[\]]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (token.endsWith("2'"))
        return `${token[0]}2`
      return token
    })
}

export function invertMove(move: string): string {
  const parsed = parseMove(move)
  if (!parsed)
    return move
  if (parsed.turns === 2)
    return `${parsed.face}2`
  return parsed.prime ? parsed.face : `${parsed.face}'`
}

export function invertAlg(alg: string): string {
  return parseAlg(alg).reverse().map(invertMove).join(' ')
}

export function applyAlg(cube: Cube, alg: string): Cube {
  for (const move of parseAlg(alg))
    applyMove(cube, move)
  return cube
}

export function cubeFromAlg(alg: string): Cube {
  return applyAlg(solvedCube(), alg)
}

export function cubeAfter(setup: string, alg: string, n: number): Cube {
  const cube = cubeFromAlg(setup)
  const moves = parseAlg(alg)
  const end = Math.max(0, Math.min(n, moves.length))
  for (let i = 0; i < end; i++)
    applyMove(cube, moves[i]!)
  return cube
}

export function moveFace(move: string): Face | null {
  return parseMove(move)?.face ?? null
}

export function moveSpin(move: string): { face: Face, quarters: number } | null {
  const parsed = parseMove(move)
  if (!parsed)
    return null
  return {
    face: parsed.face,
    quarters: parsed.turns === 2 ? 2 : parsed.prime ? -1 : 1,
  }
}

const FACE_ZH: Record<Face, string> = {
  U: '上面',
  D: '下面',
  F: '前面',
  B: '后面',
  R: '右面',
  L: '左面',
}

/** Human-readable gloss for one WCA move token, e.g. R' → 右面逆时针 */
export function moveZh(move: string): string {
  const parsed = parseMove(move)
  if (!parsed)
    return move
  const face = FACE_ZH[parsed.face]
  if (parsed.turns === 2)
    return `${face} 180°`
  return parsed.prime ? `${face}逆时针` : `${face}顺时针`
}

export function firstTwoLayersSolved(cube: Cube): boolean {
  const d = cube.D.every(sticker => sticker === 'D')
  const f2l = [3, 4, 5, 6, 7, 8]
  const sides = (['F', 'R', 'B', 'L'] as const).every(face =>
    f2l.every(i => cube[face][i] === face),
  )
  return d && sides
}

export function sideTop(cube: Cube, face: Face): string {
  return cube[face].slice(0, 3).join('')
}

export function lastLayerEdgesOriented(cube: Cube): boolean {
  return [1, 3, 5, 7].every(i => cube.U[i] === 'U')
}

export function lastLayerFaceSolved(cube: Cube): boolean {
  return cube.U.every(sticker => sticker === 'U')
}
