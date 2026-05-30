import { asc } from "astro:db";
import { Bookmark, BookmarkCard, BookmarkSection, db } from "astro:db";
import type { BookmarkData, BookmarkLink, BookmarkSectionData } from "./types";

function parseExtraLinks(value?: string | null): BookmarkLink[] | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export async function getBookmarkSections(): Promise<BookmarkSectionData[]> {
  const sections = await db.select().from(BookmarkSection).orderBy(asc(BookmarkSection.sortOrder));

  const cards = await db.select().from(BookmarkCard).orderBy(asc(BookmarkCard.sortOrder));

  const bookmarks = await db.select().from(Bookmark).orderBy(asc(Bookmark.sortOrder));

  const cardsBySection = new Map<number, typeof cards>();
  for (const card of cards) {
    const group = cardsBySection.get(card.sectionId) ?? [];
    group.push(card);
    cardsBySection.set(card.sectionId, group);
  }

  const bookmarksByCard = new Map<number, BookmarkData[]>();
  for (const bookmark of bookmarks) {
    const group = bookmarksByCard.get(bookmark.cardId) ?? [];
    group.push({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description ?? undefined,
      badgeText: bookmark.badgeText ?? undefined,
      badgeVariant: bookmark.badgeVariant ?? undefined,
      extraLinks: parseExtraLinks(bookmark.extraLinks),
      sortOrder: bookmark.sortOrder,
    });
    bookmarksByCard.set(bookmark.cardId, group);
  }

  return sections.map((section) => ({
    title: section.title,
    sortOrder: section.sortOrder,
    stagger: section.stagger,
    cards: (cardsBySection.get(section.id) ?? []).map((card) => ({
      title: card.title,
      sortOrder: card.sortOrder,
      bookmarks: bookmarksByCard.get(card.id) ?? [],
    })),
  }));
}
