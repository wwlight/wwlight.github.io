/** 功能：分区书签计数与 Tab 选中索引钳制 */
import type { BookmarkSectionData } from "@/bookmarks/shared/types";

export function sectionBookmarkCount(section: BookmarkSectionData) {
  return section.cards.reduce((n, card) => n + card.bookmarks.length, 0);
}

export function clampSelectedSection(sections: BookmarkSectionData[], selected: number) {
  if (sections.length === 0) return 0;
  return Math.max(0, Math.min(selected, sections.length - 1));
}
