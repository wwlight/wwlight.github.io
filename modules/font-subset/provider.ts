import { defineFontProvider } from 'unifont'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

interface FontSource { name: string, url: string, family: string, dir: string }
const sources = JSON.parse(readFileSync(fileURLToPath(new URL('./sources.json', import.meta.url)), 'utf8')) as FontSource[]

// 分片只存在于构建缓存（node_modules/.cache/cn-split），经 server route /font-subset 提供
const SPLIT_DIR = join(process.cwd(), 'node_modules', '.cache', 'cn-split')
interface Face { file: string, range?: string }

const facesCache = new Map<string, Face[]>()

function getFaces(dir: string): Face[] {
  let faces = facesCache.get(dir)
  if (faces) return faces
  const css = readFileSync(join(SPLIT_DIR, dir, 'result.css'), 'utf8')
  faces = []
  const re = /@font-face\{([^}]+)\}/g
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

// cn 产物 weight 值较单一，按 family 校准真实字重
function inferWeight(family: string): number {
  if (/light/i.test(family)) return 300
  if (/\b(bld|bold)\b/i.test(family)) return 700
  if (/medium/i.test(family)) return 500
  return 400
}

export default defineFontProvider('local-split', async () => {
  const familySrc = new Map(sources.map(f => [f.family, f]))
  return {
    async resolveFont(family) {
      const src = familySrc.get(family)
      if (!src) return
      const ready = (globalThis as Record<string, unknown>)['__FONTSPLIT_READY__'] as Promise<void> | undefined
      if (ready) await ready
      if (!existsSync(join(SPLIT_DIR, src.dir, 'result.css'))) return
      const faces = getFaces(src.dir)
      if (!faces.length) return
      const weight = String(inferWeight(family))
      return {
        fonts: faces.map(f => ({
          src: [{ url: `/font-subset/${src.dir}/${f.file}`, format: 'woff2' }],
          weight,
          style: 'normal',
          ...(f.range ? { unicodeRange: [f.range] } : {})
        }))
      }
    }
  }
})