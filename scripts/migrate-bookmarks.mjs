import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputArg = process.argv[2]
if (!inputArg) {
  console.error('Usage: node scripts/migrate-bookmarks.mjs <path-to.mdx>')
  process.exit(1)
}
const mdxPath = path.resolve(inputArg)
const outputPath = path.join(__dirname, '../db/data/bookmarks.ts')

const content = fs.readFileSync(mdxPath, 'utf-8')

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
const badgeRegex = /<Badge\s+text="([^"]+)"(?:\s+variant=['"](\w+)['"])?\s*\/?>/g

function parseLine(line) {
  const trimmed = line.replace(/^\s*-\s*/, '').trim()
  if (!trimmed)
    return null

  let badgeText
  let badgeVariant
  let rest = trimmed

  rest = rest
    .replace(badgeRegex, (_, text, variant) => {
      badgeText = text
      badgeVariant = variant || undefined
      return ''
    })
    .trim()

  const links = []
  const linkPattern = new RegExp(linkRegex.source, 'g')
  let match = linkPattern.exec(rest)
  while (match !== null) {
    links.push({ title: match[1], url: match[2] })
    match = linkPattern.exec(rest)
  }

  if (links.length === 0)
    return null

  rest = rest.replace(linkRegex, '').trim()
  rest = rest.replace(/^[-–—|｜、,，\s]+/, '').trim()
  rest = rest.replace(/^[-–—]\s*/, '').trim()
  rest = rest.replace(/\s*[|｜]\s*$/, '').trim()

  const [primary, ...extras] = links

  return {
    title: primary.title,
    url: primary.url,
    description: rest || undefined,
    badgeText,
    badgeVariant,
    extraLinks: extras.length > 0 ? extras : undefined,
  }
}

const sections = []
let currentSection = null
let currentCard = null
let inCard = false
let cardGridStagger = true

for (const line of content.split('\n')) {
  const sectionMatch = line.match(/^## (.+)$/)
  if (sectionMatch) {
    currentSection = {
      title: sectionMatch[1],
      stagger: true,
      cards: [],
    }
    sections.push(currentSection)
    currentCard = null
    inCard = false
    continue
  }

  const cardGridMatch = line.match(/<CardGrid(\s+stagger)?>/)
  if (cardGridMatch && currentSection) {
    cardGridStagger = Boolean(cardGridMatch[1])
    currentSection.stagger = cardGridStagger
    continue
  }

  const cardOpenMatch = line.match(/<Card title=['"]([^'"]+)['"]>/)
  if (cardOpenMatch && currentSection) {
    currentCard = { title: cardOpenMatch[1], items: [] }
    currentSection.cards.push(currentCard)
    inCard = true
    continue
  }

  if (line.includes('</Card>')) {
    inCard = false
    currentCard = null
    continue
  }

  if (inCard && currentCard && line.trim().startsWith('- ')) {
    const item = parseLine(line)
    if (item)
      currentCard.items.push(item)
  }
}

const seedSections = sections.map((section, sectionIndex) => ({
  title: section.title,
  sortOrder: sectionIndex,
  stagger: section.stagger,
  cards: section.cards.map((card, cardIndex) => ({
    title: card.title,
    sortOrder: cardIndex,
    bookmarks: card.items.map((item, itemIndex) => ({
      title: item.title,
      url: item.url,
      description: item.description,
      badgeText: item.badgeText,
      badgeVariant: item.badgeVariant,
      extraLinks: item.extraLinks,
      sortOrder: itemIndex,
    })),
  })),
}))

const output = `// 书签数据源 — 在此文件维护书签，保存后 dev 会自动重新 seed
// 从旧 MDX 批量导入: node scripts/migrate-bookmarks.mjs <path-to.mdx>

export interface BookmarkLink {
  title: string
  url: string
}

export interface BookmarkData {
  title: string
  url: string
  description?: string
  badgeText?: string
  badgeVariant?: string
  extraLinks?: BookmarkLink[]
  sortOrder: number
}

export interface BookmarkCardData {
  title: string
  sortOrder: number
  bookmarks: BookmarkData[]
}

export interface BookmarkSectionData {
  title: string
  sortOrder: number
  stagger: boolean
  cards: BookmarkCardData[]
}

export const bookmarkSections: BookmarkSectionData[] = ${JSON.stringify(seedSections, null, 2)}
`

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, output)

console.log(
  `Generated ${seedSections.length} sections, ${seedSections.reduce((n, s) => n + s.cards.length, 0)} cards, ${seedSections.reduce((n, s) => n + s.cards.reduce((m, c) => m + c.bookmarks.length, 0), 0)} bookmarks`,
)
