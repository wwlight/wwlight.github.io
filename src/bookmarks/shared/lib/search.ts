/** 功能：导航页与管理端共用的分区 / 书签搜索过滤 */
import type { BookmarkCardData, BookmarkData, BookmarkSectionData } from "@/bookmarks/shared/types";

export interface VisibleBookmarkEntry {
  bookmark: BookmarkData;
  bookmarkIndex: number;
}

export interface VisibleCardEntry {
  card: BookmarkCardData;
  cardIndex: number;
  bookmarks: VisibleBookmarkEntry[];
}

export function bookmarkHaystack(
  bookmark: BookmarkData,
  cardTitle: string,
  sectionTitle: string,
): string {
  return [
    bookmark.title,
    bookmark.url,
    bookmark.description,
    cardTitle,
    sectionTitle,
    bookmark.badgeText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function sectionMatchesSearch(section: BookmarkSectionData, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  if (section.title.toLowerCase().includes(normalized)) return true;

  return section.cards.some((card) => {
    if (card.title.toLowerCase().includes(normalized)) return true;
    return card.bookmarks.some((bookmark) =>
      bookmarkHaystack(bookmark, card.title, section.title).includes(normalized),
    );
  });
}

export function filterSectionForSearch(
  section: BookmarkSectionData,
  query: string,
): BookmarkSectionData {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return section;

  return {
    ...section,
    cards: section.cards
      .map((card) => ({
        ...card,
        bookmarks: card.bookmarks.filter((bookmark) =>
          bookmarkHaystack(bookmark, card.title, section.title).includes(normalized),
        ),
      }))
      .filter((card) => card.bookmarks.length > 0),
  };
}

export function filterBookmarkSections(
  sections: BookmarkSectionData[],
  query: string,
): BookmarkSectionData[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return sections;

  return sections
    .map((section) => filterSectionForSearch(section, normalized))
    .filter((section) => section.cards.length > 0);
}

export function getVisibleCardsInSection(
  section: BookmarkSectionData,
  query: string,
): VisibleCardEntry[] {
  const normalized = query.trim().toLowerCase();

  return section.cards.flatMap((card, cardIndex) => {
    const bookmarks = card.bookmarks.flatMap((bookmark, bookmarkIndex) => {
      if (normalized && !bookmarkHaystack(bookmark, card.title, section.title).includes(normalized)) {
        return [];
      }
      return [{ bookmark, bookmarkIndex }];
    });
    if (bookmarks.length === 0) return [];
    return [{ card, cardIndex, bookmarks }];
  });
}
