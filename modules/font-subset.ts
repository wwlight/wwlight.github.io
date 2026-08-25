import { defineNuxtModule, addVitePlugin } from '@nuxt/kit'
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import font from 'vite-plugin-font'
import { fontSources } from '../font-sources'

// 原始 ttf 的下载缓存目录（node_modules 会被 CI 保留，避免每次构建重新下载）
const TTF_CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'font-ttf')

// 分包只保留站点实际用字，首屏体积大幅下降
const SCAN_FILES = [
  'content/**/*.md',
  'app/**/*.{vue,ts,js,css,html}'
]

export interface FontSource {
  name: string
  url: string
  // @font-face 字体名；多字重需用不同名（同名会被 vite-plugin-font 合并）
  family: string
  // 输出目录，可含字重子目录：如 lxgw/regular
  dir: string
}

export interface ModuleOptions {
  // 原始 ttf 列表，由调用方（nuxt.config.ts）提供，避免硬编码
  fonts?: FontSource[]
}

async function ensureFonts(fonts: FontSource[], outDir: string): Promise<void> {
  mkdirSync(TTF_CACHE_DIR, { recursive: true })
  mkdirSync(outDir, { recursive: true })
  for (const f of fonts) {
    const cached = join(TTF_CACHE_DIR, f.name)
    const dest = join(outDir, f.name)
    if (existsSync(cached)) {
      console.log(`[font-subset] use cached ${f.name}`)
    } else {
      console.log(`[font-subset] downloading ${f.name} <- ${f.url}`)
      const res = await fetch(f.url)
      if (!res.ok) {
        throw new Error(`Failed to download ${f.name}: ${res.status} ${res.statusText}`)
      }
      const buf = Buffer.from(await res.arrayBuffer())
      writeFileSync(cached, buf)
      console.log(`[font-subset] cached ${f.name} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`)
    }
    copyFileSync(cached, dest)
  }
}

// 构建期把分包 woff2 直接输出到 _nuxt/fonts/<dir>/（dir 可含字重子目录），并重写 CSS url（零文件移动）
function fontGroupPlugin(fonts: FontSource[]) {
  const famDir = new Map<string, string>()
  for (const f of fonts) {
    // 同名 family 多个字重：family 名不同，直接一一映射；同 family 取第一个
    if (!famDir.has(f.family)) famDir.set(f.family, f.dir)
  }

  function matchDir(family: string): string | undefined {
    if (famDir.has(family)) return famDir.get(family)
    // 兼容 variable 字体产生的变体 family（如 "Fira Code Light" 归入 "Fira Code"）
    for (const [fam, dir] of famDir) {
      if (family.startsWith(fam + ' ')) return dir
    }
    return undefined
  }

  return {
    name: 'font-subset-group',
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      const fileDir = new Map<string, string>() // woff2 文件名 -> dir
      for (const out of Object.values(bundle)) {
        if (out?.type !== 'asset' || typeof out.source !== 'string' || !out.source.includes('@font-face')) continue
        let css: string = out.source
        css.replace(/@font-face\{([^}]*)\}/g, (blk: string) => {
          const famMatch = blk.match(/font-family:\s*"?([^";}]+)"?/)
          if (!famMatch) return blk
          const dir = matchDir(famMatch[1]!.trim())
          if (!dir) return blk
          blk.replace(/url\(\.\/(?!fonts\/)([^)]+\.woff2)\)/g, (m: string, wf: string) => {
            fileDir.set(wf, dir!)
            return m
          })
          return blk
        })
        if (fileDir.size) {
          let next = css
          for (const [wf, dir] of fileDir) {
            next = next.split(`url(./${wf})`).join(`url(./fonts/${dir}/${wf})`)
          }
          if (next !== css) out.source = next
        }
      }
      for (const out of Object.values(bundle)) {
        if (out?.type !== 'asset' || typeof out.fileName !== 'string') continue
        if (!out.fileName.endsWith('.woff2')) continue
        const base = out.fileName.split('/').pop()!
        const dir = fileDir.get(base)
        if (dir) {
          out.fileName = `_nuxt/fonts/${dir}/${base}`
        }
      }
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'font-subset' },
  defaults: {
    fonts: fontSources
  },
  setup(options, nuxt) {
    const fonts = options.fonts || []
    if (!fonts.length) {
      console.warn('[font-subset] no fonts configured, skipping download & subset')
      return
    }
    const outDir = join(nuxt.options.srcDir, 'assets', 'fonts')
    addVitePlugin(() => ({
      name: 'ensure-font-subset',
      async config() {
        await ensureFonts(fonts, outDir)
      }
    }))
    addVitePlugin(font.vite({
      scanFiles: SCAN_FILES
    }))
    addVitePlugin(fontGroupPlugin(fonts))
  }
})
