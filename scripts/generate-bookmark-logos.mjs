/**
 * 根据 db/data/bookmarks.ts 生成 bookmark-logos.json。
 * sourceFingerprint 未变则跳过；仅新增/变更 URL 写入 domain，未变的 URL 复用缓存。
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bookmarksPath = join(root, 'db/data/bookmarks.ts')
const cachePath = join(root, 'src/bookmarks/shared/data/bookmark-logos.json')

/** @param {string} hostname */
function logoDevDomainFromHostname(hostname) {
  return hostname.replace(/^www\./i, '')
}

/** @param {string} url */
function domainFromUrl(url) {
  try {
    return logoDevDomainFromHostname(new URL(url).hostname)
  }
  catch {
    return null
  }
}

/** @param {string} content */
function extractBookmarkUrls(content) {
  const urls = []
  const re = /"url"\s*:\s*"((?:\\.|[^"\\])*)"/g
  let match = re.exec(content)
  while (match) {
    urls.push(match[1].replace(/\\"/g, '"'))
    match = re.exec(content)
  }
  return urls
}

/** @param {string[]} urls */
function sourceFingerprint(urls) {
  const unique = [...new Set(urls)].sort()
  return createHash('sha256').update(unique.join('\n')).digest('hex')
}

/** @param {string} path */
function readCache(path) {
  if (!existsSync(path)) {
    return { version: 1, sourceFingerprint: '', byUrl: {} }
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

function main() {
  if (!existsSync(bookmarksPath)) {
    console.warn('[generate-bookmark-logos] 跳过：未找到 db/data/bookmarks.ts')
    return
  }

  const bookmarksContent = readFileSync(bookmarksPath, 'utf8')
  const urls = extractBookmarkUrls(bookmarksContent)
  const fingerprint = sourceFingerprint(urls)
  const previous = readCache(cachePath)

  if (fingerprint === previous.sourceFingerprint) {
    console.log('[generate-bookmark-logos] 书签数据未变，沿用缓存')
    return
  }

  /** @type {Record<string, { domain: string }>} */
  const byUrl = {}
  let reused = 0
  let added = 0

  for (const url of urls) {
    const domain = domainFromUrl(url)
    if (!domain)
      continue

    const prior = previous.byUrl?.[url]
    if (prior?.domain === domain) {
      byUrl[url] = { domain }
      reused += 1
    }
    else {
      byUrl[url] = { domain }
      added += 1
    }
  }

  const next = {
    version: 1,
    sourceFingerprint: fingerprint,
    byUrl,
  }

  writeFileSync(cachePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  console.log(
    `[generate-bookmark-logos] 已更新 ${Object.keys(byUrl).length} 条（复用 ${reused}，新建/变更 ${added}）`,
  )
}

main()
