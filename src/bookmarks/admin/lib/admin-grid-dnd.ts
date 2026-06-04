/** 管理端书签网格拖拽：插入位置与 Shift 交换目标（不含中转站逻辑） */
import type { DragPayload, GridDragPayload } from "@/bookmarks/admin/lib/admin-helpers";
import { isGridDragPayload } from "@/bookmarks/admin/lib/admin-helpers";

export interface BookmarkDragTarget {
  sectionIndex: number;
  cardIndex: number;
  bookmarkIndex: number;
}

export function getBookmarkInsertIndex(
  grid: HTMLElement,
  clientY: number,
  dragging: DragPayload,
  targetSectionIndex: number,
  targetCardIndex: number,
) {
  const cards = [...grid.querySelectorAll<HTMLElement>("[data-bookmark-card]")];
  for (const card of cards) {
    const bookmarkIndex = Number(card.dataset.bookmarkIndex);
    if (isGridDragPayload(dragging)) {
      const isSelf =
        dragging.sectionIndex === targetSectionIndex &&
        dragging.cardIndex === targetCardIndex &&
        dragging.bookmarkIndex === bookmarkIndex;
      if (isSelf) continue;
    }

    const rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return bookmarkIndex;
  }
  return cards.length;
}

export function resolveDropBookmarkIndex(
  grid: HTMLElement,
  clientX: number,
  clientY: number,
  payload: GridDragPayload,
  targetSectionIndex: number,
  targetCardIndex: number,
) {
  const element = document.elementFromPoint(clientX, clientY);
  const cardEl = element?.closest("[data-bookmark-card]") as HTMLElement | null;
  if (!cardEl || !grid.contains(cardEl)) return null;

  const bookmarkIndex = Number(cardEl.dataset.bookmarkIndex);
  if (Number.isNaN(bookmarkIndex)) return null;

  const isSelf =
    payload.sectionIndex === targetSectionIndex &&
    payload.cardIndex === targetCardIndex &&
    payload.bookmarkIndex === bookmarkIndex;
  if (isSelf) return null;

  return bookmarkIndex;
}
