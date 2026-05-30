import type { BookmarkSectionData } from "./types";

export function sectionBookmarkCount(section: BookmarkSectionData) {
  return section.cards.reduce((n, card) => n + card.bookmarks.length, 0);
}

export function clampSelectedSection(sections: BookmarkSectionData[], selected: number) {
  if (sections.length === 0) return 0;
  return Math.max(0, Math.min(selected, sections.length - 1));
}
