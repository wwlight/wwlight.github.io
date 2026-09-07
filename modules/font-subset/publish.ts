import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PUBLISH_DIR, SPLIT_DIR, renderFamilyCss, sources } from './faces'

export function publishFontAssets(): void {
  if (existsSync(PUBLISH_DIR)) rmSync(PUBLISH_DIR, { recursive: true })
  mkdirSync(PUBLISH_DIR, { recursive: true })
  const missing: string[] = []
  for (const src of sources) {
    const fromDir = join(SPLIT_DIR, src.dir)
    if (!existsSync(join(fromDir, 'result.css'))) {
      missing.push(src.family)
      continue
    }
    const toDir = join(PUBLISH_DIR, src.dir)
    mkdirSync(toDir, { recursive: true })
    for (const name of readdirSync(fromDir)) {
      if (!name.endsWith('.woff2')) continue
      copyFileSync(join(fromDir, name), join(toDir, name))
    }
    writeFileSync(join(toDir, 'family.css'), renderFamilyCss(src))
  }
  if (missing.length) {
    throw new Error(`[font-subset] missing split output: ${missing.join(', ')}`)
  }
}
