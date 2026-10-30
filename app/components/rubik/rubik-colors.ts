import type { Face } from './rubik-engine'

/** Shared sticker palette for canvas + SVG. */
export const RUBIK_FACE_RGB = {
  U: [245, 208, 20],
  D: [238, 238, 234],
  F: [36, 99, 214],
  B: [34, 166, 78],
  R: [196, 40, 36],
  L: [230, 118, 22],
} as const satisfies Record<Face, readonly [number, number, number]>

export const RUBIK_FACE_HEX = {
  U: '#f5d014',
  D: '#eeeee9',
  F: '#2463d6',
  B: '#22a64e',
  R: '#c42824',
  L: '#e67616',
} as const satisfies Record<Face, string>
