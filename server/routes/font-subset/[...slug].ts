import { createReadStream } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// 从构建缓存服务字体分包（分片不再进 public；URL 与模块同名 /font-subset）
const SPLIT_ROOT = join(process.cwd(), 'node_modules', '.cache', 'cn-split')

export default defineEventHandler((event) => {
  const slug = (getRouterParam(event, 'slug') || '').split('/')
  const rel = slug.join('/')
  if (!rel || rel.includes('..') || !/\.(woff2|css)$/.test(rel)) throw createError({ statusCode: 404 })
  const file = join(SPLIT_ROOT, rel)
  if (!existsSync(file)) throw createError({ statusCode: 404 })
  setHeader(event, 'content-type', rel.endsWith('.woff2') ? 'application/octet-stream' : 'text/css')
  // 分片文件名含内容 hash，可长缓存
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return sendStream(event, createReadStream(file))
})