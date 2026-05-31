import type { BookmarkSectionData } from "@/lib/bookmarks/types";

export function countBookmarkStats(sections: BookmarkSectionData[]) {
  return {
    sections: sections.length,
    cards: sections.reduce((count, section) => count + section.cards.length, 0),
    bookmarks: sections.reduce(
      (sum, section) =>
        sum + section.cards.reduce((cardSum, card) => cardSum + card.bookmarks.length, 0),
      0,
    ),
  };
}
