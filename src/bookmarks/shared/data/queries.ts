/** 功能：从 db/data/bookmarks.ts 读取并按 sortOrder 排序 Section / Card / Bookmark 树 */
import { bookmarkSections } from '../../../../db/data/bookmarks.ts'
import type { BookmarkData, BookmarkSectionData } from '@/bookmarks/shared/types'

function sortBookmarks(bookmarks: BookmarkData[]) {
  return [...bookmarks].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getBookmarkSections(): Promise<BookmarkSectionData[]> {
  return [...bookmarkSections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(section => ({
      ...section,
      cards: [...section.cards]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(card => ({
          ...card,
          bookmarks: sortBookmarks(card.bookmarks),
        })),
    }))
}
