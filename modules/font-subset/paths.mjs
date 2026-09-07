import { join } from 'node:path'

// 切分产物不进 git；放在仓库根 .cache，避免 pnpm 重装清掉 node_modules/.cache
export const FONT_CACHE_ROOT = join(process.cwd(), '.cache', 'font-subset')
export const TTF_CACHE_DIR = join(FONT_CACHE_ROOT, 'ttf')
export const SPLIT_DIR = join(FONT_CACHE_ROOT, 'split')
export const PUBLISH_DIR = join(FONT_CACHE_ROOT, 'public')
