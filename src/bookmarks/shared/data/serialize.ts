/**
 * 功能：将 Section 树序列化为完整 `db/data/bookmarks.ts` 文件内容。
 * 保存时重算 sortOrder、strip 空 optional 字段。
 */
import type { BookmarkSectionData } from "@/bookmarks/shared/types";

export function serializeBookmarkSections(sections: BookmarkSectionData[]): string {
  const normalized = sections.map((section, sectionIndex) => ({
    title: section.title,
    sortOrder: sectionIndex,
    stagger: section.stagger,
    cards: section.cards.map((card, cardIndex) => ({
      title: card.title,
      sortOrder: cardIndex,
      bookmarks: card.bookmarks.map((bookmark, bookmarkIndex) => {
        const item: Record<string, unknown> = {
          title: bookmark.title,
          url: bookmark.url,
          sortOrder: bookmarkIndex,
        };
        if (bookmark.description) item.description = bookmark.description;
        if (bookmark.badgeText) item.badgeText = bookmark.badgeText;
        if (bookmark.badgeVariant) item.badgeVariant = bookmark.badgeVariant;
        return item;
      }),
    })),
  }));

  return `// 书签数据源 — 在此文件维护书签，保存后 dev 会自动重新 seed
// 从旧 MDX 批量导入: node scripts/migrate-bookmarks.mjs <path-to.mdx>

export interface BookmarkData {
  title: string
  url: string
  description?: string
  badgeText?: string
  badgeVariant?: string
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

export const bookmarkSections: BookmarkSectionData[] = ${JSON.stringify(normalized, null, 2)}
`;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
