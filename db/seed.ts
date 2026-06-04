/** 从 db/data/bookmarks.ts 灌入 Astro DB 三层表 */
import { Bookmark, BookmarkCard, BookmarkSection, db } from "astro:db";
import { bookmarkSections } from "./data/bookmarks";

export default async function seed() {
  let sectionId = 1;
  let cardId = 1;
  let bookmarkId = 1;

  for (const section of bookmarkSections) {
    await db.insert(BookmarkSection).values({
      id: sectionId,
      title: section.title,
      sortOrder: section.sortOrder,
      stagger: section.stagger,
    });

    for (const card of section.cards) {
      await db.insert(BookmarkCard).values({
        id: cardId,
        sectionId,
        title: card.title,
        sortOrder: card.sortOrder,
      });

      if (card.bookmarks.length > 0) {
        await db.insert(Bookmark).values(
          card.bookmarks.map((bookmark) => ({
            id: bookmarkId++,
            cardId,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            badgeText: bookmark.badgeText,
            badgeVariant: bookmark.badgeVariant,
            sortOrder: bookmark.sortOrder,
          })),
        );
      }

      cardId++;
    }

    sectionId++;
  }
}
