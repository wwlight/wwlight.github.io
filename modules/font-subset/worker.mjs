// cn 精细分包 worker（纯 JS，Node 直接运行；cn FFI 同步阻塞，放子进程避免卡 dev 主循环）
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fontSplit from 'cn-font-split/dist/auto.mjs'

const fonts = JSON.parse(readFileSync(fileURLToPath(new URL('./sources.json', import.meta.url)), 'utf8'))

const TTF_CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'font-ttf')
const CACHE_SPLIT = join(process.cwd(), 'node_modules', '.cache', 'cn-split')

// 单分片目标大小：调大→每片更多字符、片数更少（体积驱动，适配不同字重）
const CHUNK_SIZE = 400 * 1024

async function ensureOne(f) {
  const cached = join(TTF_CACHE_DIR, f.name)
  if (existsSync(cached)) return
  const res = await fetch(f.url)
  if (!res.ok) throw new Error(`download ${f.name}: ${res.status}`)
  writeFileSync(cached, Buffer.from(await res.arrayBuffer()))
}

async function splitOne(f) {
  const cacheDir = join(CACHE_SPLIT, f.dir)
  if (!existsSync(join(TTF_CACHE_DIR, f.name))) return
  if (existsSync(join(cacheDir, 'result.css'))) return
  mkdirSync(cacheDir, { recursive: true })
  await fontSplit({
    input: new Uint8Array(readFileSync(join(TTF_CACHE_DIR, f.name))),
    outDir: cacheDir,
    silent: true,
    reporter: false,
    chunkSize: CHUNK_SIZE
  })
}

try {
  mkdirSync(TTF_CACHE_DIR, { recursive: true })
  let idx = 0
  const w = async () => { while (idx < fonts.length) await ensureOne(fonts[idx++]) }
  await Promise.all(Array.from({ length: Math.min(4, fonts.length) }, w))
  mkdirSync(CACHE_SPLIT, { recursive: true })
  // 切分并行（限流 3 族同时），首次冷构建更快
  let splitIdx = 0
  const sp = async () => { while (splitIdx < fonts.length) await splitOne(fonts[splitIdx++]) }
  await Promise.all(Array.from({ length: Math.min(3, fonts.length) }, sp))
  console.log('[font-split-worker] done', fonts.length)
  process.send?.({ kind: 'done', count: fonts.length })
} catch (e) {
  console.error('[font-split-worker]', e)
  process.exit(1)
}