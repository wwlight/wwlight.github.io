import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PUBLISH_DIR, SPLIT_DIR } from './paths.mjs'

export interface FontSource {
  name: string
  url: string
  family: string
  dir: string
}
export interface Face {
  file: string
  range?: string
}

export const sources = JSON.parse(
  readFileSync(fileURLToPath(new URL('./sources.json', import.meta.url)), 'utf8'),
) as FontSource[]

export { PUBLISH_DIR, SPLIT_DIR }

const facesCache = new Map<string, Face[]>()

export function getFaces(dir: string): Face[] {
  let faces = facesCache.get(dir)
  if (faces) return faces
  const cssPath = join(SPLIT_DIR, dir, 'result.css')
  if (!existsSync(cssPath)) return []
  const css = readFileSync(cssPath, 'utf8')
  faces = []
  const re = /@font-face\s*\{([^}]+)\}/g
  for (const m of css.matchAll(re)) {
    const body = m[1]!
    const urlM = body.match(/url\(\s*"?\.\/([^)"?]+\.woff2)"?/)
    const rangeM = body.match(/unicode-range:\s*([^;]+)/)
    if (!urlM) continue
    faces.push({ file: urlM[1]!, ...(rangeM ? { range: rangeM[1]!.trim() } : {}) })
  }
  facesCache.set(dir, faces)
  return faces
}

export function inferWeight(family: string): number {
  if (/light/i.test(family)) return 300
  if (/\b(bld|bold)\b/i.test(family)) return 700
  if (/medium/i.test(family)) return 500
  return 400
}

export function renderFamilyCss(src: FontSource): string {
  const faces = getFaces(src.dir)
  const weight = inferWeight(src.family)
  const family = src.family.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return faces
    .map((f) => {
      const range = f.range ? `unicode-range:${f.range};` : ''
      return `@font-face{font-family:"${family}";src:url(/font-subset/${src.dir}/${f.file})format("woff2");font-display:swap;font-weight:${weight};font-style:normal;${range}}`
    })
    .join('')
}
