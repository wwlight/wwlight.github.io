// cn 精细分包 worker（纯 JS，Node 直接运行；cn FFI 同步阻塞，放子进程避免卡 dev 主循环）
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getBinName, matchPlatform } from 'cn-font-split/dist/load.mjs'
import { isMusl } from 'cn-font-split/dist/node/isMusl.mjs'
import { SPLIT_DIR, TTF_CACHE_DIR } from './paths.mjs'

const fonts = JSON.parse(
  readFileSync(fileURLToPath(new URL('./sources.json', import.meta.url)), 'utf8'),
)

// 单分片目标大小：调大→每片更多字符、片数更少（体积驱动，适配不同字重）
const CHUNK_SIZE = 400 * 1024

async function ensureOne(f) {
  const cached = join(TTF_CACHE_DIR, f.name)
  if (existsSync(cached)) {
    console.log('[font-split-worker] ttf cache hit', f.name)
    return
  }
  console.log('[font-split-worker] download', f.name)
  const res = await fetch(f.url)
  if (!res.ok) throw new Error(`download ${f.name}: ${res.status}`)
  writeFileSync(cached, Buffer.from(await res.arrayBuffer()))
}

function nativeBinPath() {
  const require = createRequire(import.meta.url)
  const nodeEntry = require.resolve('cn-font-split/dist/node/index.mjs')
  const name = getBinName(matchPlatform(process.platform, process.arch, isMusl))
  return resolve(dirname(nodeEntry), '..', name)
}

function installNativeBin() {
  const require = createRequire(import.meta.url)
  const cli = join(dirname(require.resolve('cn-font-split/package.json')), 'dist/cli.js')
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cli, 'i', 'default'], { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`cn-font-split install exited ${code}`))
    })
  })
}

async function ensureNativeBin() {
  const path = nativeBinPath()
  if (existsSync(path)) return path
  console.log('[font-split-worker] native library missing, running cn-font-split install')
  await installNativeBin()
  if (!existsSync(path)) throw new Error(`cn-font-split native library missing: ${path}`)
  return path
}

let fontSplitPromise
function loadFontSplit() {
  fontSplitPromise ??= (async () => {
    process.env.CN_FONT_SPLIT_BIN = await ensureNativeBin()
    const mod = await import('cn-font-split/dist/auto.mjs')
    return mod.default
  })()
  return fontSplitPromise
}

async function splitOne(f) {
  const cacheDir = join(SPLIT_DIR, f.dir)
  if (!existsSync(join(TTF_CACHE_DIR, f.name))) return
  if (existsSync(join(cacheDir, 'result.css'))) {
    console.log('[font-split-worker] cache hit', f.dir)
    return
  }
  console.log('[font-split-worker] split', f.dir)
  mkdirSync(cacheDir, { recursive: true })
  const fontSplit = await loadFontSplit()
  await fontSplit({
    input: new Uint8Array(readFileSync(join(TTF_CACHE_DIR, f.name))),
    outDir: cacheDir,
    silent: true,
    reporter: false,
    chunkSize: CHUNK_SIZE,
  })
}

try {
  mkdirSync(TTF_CACHE_DIR, { recursive: true })
  let idx = 0
  const w = async () => {
    while (idx < fonts.length) await ensureOne(fonts[idx++])
  }
  await Promise.all(Array.from({ length: Math.min(4, fonts.length) }, w))
  mkdirSync(SPLIT_DIR, { recursive: true })
  // 切分并行（限流 3 族同时），首次冷构建更快
  let splitIdx = 0
  const sp = async () => {
    while (splitIdx < fonts.length) await splitOne(fonts[splitIdx++])
  }
  await Promise.all(Array.from({ length: Math.min(3, fonts.length) }, sp))
  console.log('[font-split-worker] done', fonts.length)
  process.send?.({ kind: 'done', count: fonts.length })
} catch (e) {
  console.error('[font-split-worker]', e)
  process.exit(1)
}
