/** 编辑弹框提交：模块 / 分组 / 书签写入 sections */
import {
  BOOKMARK_DESCRIPTION_MAX_LENGTH,
  type EditContext,
} from "@/bookmarks/admin/lib/admin-helpers";
import type { BookmarkData, BookmarkSectionData } from "@/bookmarks/shared/types";

export function applyEditFormToSections(
  editContext: EditContext,
  data: Record<string, string>,
  updateSections: (updater: (prev: BookmarkSectionData[]) => BookmarkSectionData[]) => void,
  onNewSection?: (sectionIndex: number) => void,
): boolean {
  const title = data.title?.trim();
  if (!title) return false;

  if (editContext.type === "section") {
    updateSections((prev) => {
      if (editContext.sectionIndex >= 0 && editContext.sectionIndex < prev.length) {
        prev[editContext.sectionIndex].title = title;
      } else {
        prev.push({ title, sortOrder: prev.length, stagger: true, cards: [] });
        onNewSection?.(prev.length - 1);
      }
      return prev;
    });
    return true;
  }

  if (editContext.type === "card") {
    updateSections((prev) => {
      const section = prev[editContext.sectionIndex];
      if (editContext.cardIndex != null) {
        section.cards[editContext.cardIndex].title = title;
      } else {
        section.cards.push({ title, sortOrder: section.cards.length, bookmarks: [] });
      }
      return prev;
    });
    return true;
  }

  const url = data.url?.trim();
  if (!url) return false;

  const targetCardIndex = Number(data.cardTitle ?? editContext.cardIndex ?? 0);
  updateSections((prev) => {
    const section = prev[editContext.sectionIndex];
    const targetCard = section.cards[targetCardIndex];
    if (!targetCard) return prev;

    if (editContext.bookmarkIndex != null && editContext.cardIndex != null) {
      const sourceCardIndex = editContext.cardIndex;
      const sourceBookmarkIndex = editContext.bookmarkIndex;
      const existing = section.cards[sourceCardIndex]?.bookmarks[sourceBookmarkIndex];
      if (!existing) return prev;

      const bookmark: BookmarkData = {
        title,
        url,
        description:
          data.description?.trim().slice(0, BOOKMARK_DESCRIPTION_MAX_LENGTH) || undefined,
        badgeText: data.badgeText?.trim() || undefined,
        badgeVariant: data.badgeVariant?.trim() || undefined,
        sortOrder: existing.sortOrder,
      };

      if (targetCardIndex === sourceCardIndex) {
        targetCard.bookmarks[sourceBookmarkIndex] = bookmark;
      } else {
        section.cards[sourceCardIndex].bookmarks.splice(sourceBookmarkIndex, 1);
        targetCard.bookmarks.push(bookmark);
      }
    } else {
      targetCard.bookmarks.push({
        title,
        url,
        description:
          data.description?.trim().slice(0, BOOKMARK_DESCRIPTION_MAX_LENGTH) || undefined,
        badgeText: data.badgeText?.trim() || undefined,
        badgeVariant: data.badgeVariant?.trim() || undefined,
        sortOrder: targetCard.bookmarks.length,
      });
    }
    return prev;
  });
  return true;
}
