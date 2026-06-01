/** 功能：统计分区 / 卡片 / 书签数量，供顶栏 Stats 卡片 */
import type { BookmarkSectionData } from "@/bookmarks/shared/types";

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
