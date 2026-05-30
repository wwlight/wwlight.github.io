import type { BookmarkLink, BookmarkSectionData } from "./types";
import { floatingBadgeClass } from "@/components/admin/bookmarks/ui-helpers";

export { floatingBadgeClass };

export type EntityType = "section" | "card" | "bookmark";

export interface EditContext {
  type: EntityType;
  sectionIndex: number;
  cardIndex?: number;
  bookmarkIndex?: number;
}

export interface DragPayload {
  sectionIndex: number;
  cardIndex: number;
  bookmarkIndex: number;
}

export const STORAGE_KEY = "bookmarks-admin-draft";

/** 管理端装饰性图标（列表、面板内非按钮） */
export const adminDecorIconClass = "text-foreground/72";

/** 卡片/顶栏图标按钮 */
export const cardIconClass =
  "text-foreground/78 hover:text-foreground hover:bg-accent/90 focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:stroke-[1.85]";

/** 删除类图标按钮：默认可读，悬停时红色强调 */
export const deleteIconClass =
  "text-foreground/72 hover:text-red-500 hover:bg-red-500/12 focus-visible:ring-0 focus-visible:ring-offset-0 dark:hover:text-red-400 [&_svg]:stroke-[1.85]";

export function cloneSections(sections: BookmarkSectionData[]) {
  return structuredClone(sections);
}

export function sectionsEqual(a: BookmarkSectionData[], b: BookmarkSectionData[]) {
  const left = cloneSections(a);
  const right = cloneSections(b);
  normalizeSortOrders(left);
  normalizeSortOrders(right);
  return JSON.stringify(left) === JSON.stringify(right);
}

export function normalizeSortOrders(sections: BookmarkSectionData[]) {
  sections.forEach((section, sectionIndex) => {
    section.sortOrder = sectionIndex;
    section.cards.forEach((card, cardIndex) => {
      card.sortOrder = cardIndex;
      card.bookmarks.forEach((bookmark, bookmarkIndex) => {
        bookmark.sortOrder = bookmarkIndex;
      });
    });
  });
}

export function parseExtraLinksInput(value: string): BookmarkLink[] | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.split("\n").flatMap((line) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) return [];
    return [{ title: parts[0], url: parts[1] }];
  });
}

export function formatExtraLinksInput(links?: BookmarkLink[]) {
  return links?.map((link) => `${link.title}|${link.url}`).join("\n") ?? "";
}

export function countBookmarks(sections: BookmarkSectionData[]) {
  return sections.reduce(
    (sum, section) => sum + section.cards.reduce((n, card) => n + card.bookmarks.length, 0),
    0,
  );
}

export function countSectionBookmarks(section: BookmarkSectionData) {
  return section.cards.reduce((n, card) => n + card.bookmarks.length, 0);
}

/** 仅无任何分组、书签的空模块可删除 */
export function sectionCanDelete(section: BookmarkSectionData) {
  return section.cards.length === 0;
}

/** 仅无书签的空分组可删除 */
export function cardCanDelete(card: BookmarkSectionData["cards"][number]) {
  return card.bookmarks.length === 0;
}

export function swapBookmarks(
  sections: BookmarkSectionData[],
  from: DragPayload,
  to: { sectionIndex: number; cardIndex: number; bookmarkIndex: number },
) {
  if (
    from.sectionIndex === to.sectionIndex &&
    from.cardIndex === to.cardIndex &&
    from.bookmarkIndex === to.bookmarkIndex
  ) {
    return false;
  }

  const sourceBookmarks = sections[from.sectionIndex]?.cards[from.cardIndex]?.bookmarks;
  const targetBookmarks = sections[to.sectionIndex]?.cards[to.cardIndex]?.bookmarks;
  if (!sourceBookmarks || !targetBookmarks) return false;

  const sourceItem = sourceBookmarks[from.bookmarkIndex];
  const targetItem = targetBookmarks[to.bookmarkIndex];
  if (!sourceItem || !targetItem) return false;

  sourceBookmarks[from.bookmarkIndex] = targetItem;
  targetBookmarks[to.bookmarkIndex] = sourceItem;
  normalizeSortOrders(sections);
  return true;
}

export function insertBookmark(
  sections: BookmarkSectionData[],
  from: DragPayload,
  to: { sectionIndex: number; cardIndex: number; bookmarkIndex: number },
) {
  const sourceBookmarks = sections[from.sectionIndex]?.cards[from.cardIndex]?.bookmarks;
  const targetBookmarks = sections[to.sectionIndex]?.cards[to.cardIndex]?.bookmarks;
  if (!sourceBookmarks || !targetBookmarks) return false;

  let insertIndex = Math.max(0, Math.min(to.bookmarkIndex, targetBookmarks.length));
  if (from.sectionIndex === to.sectionIndex && from.cardIndex === to.cardIndex) {
    if (from.bookmarkIndex < insertIndex) insertIndex--;
    if (from.bookmarkIndex === insertIndex) return false;
  }

  const [bookmark] = sourceBookmarks.splice(from.bookmarkIndex, 1);
  if (!bookmark) return false;

  targetBookmarks.splice(insertIndex, 0, bookmark);
  normalizeSortOrders(sections);
  return true;
}

export { clampSelectedSection, sectionBookmarkCount } from "./section-helpers";
