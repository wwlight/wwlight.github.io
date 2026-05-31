import type { BookmarkData, BookmarkLink, BookmarkSectionData } from "./types";
import { floatingBadgeClass } from "@/components/admin/bookmarks/ui-helpers";
import { SITE_STORAGE_KEYS } from "@/lib/site-storage";

export { floatingBadgeClass };

export type EntityType = "section" | "card" | "bookmark";

export interface EditContext {
  type: EntityType;
  sectionIndex: number;
  cardIndex?: number;
  bookmarkIndex?: number;
}

export interface GridDragPayload {
  source: "grid";
  sectionIndex: number;
  cardIndex: number;
  bookmarkIndex: number;
}

export interface StationDragPayload {
  source: "station";
  itemId: string;
}

export type DragPayload = GridDragPayload | StationDragPayload;

export interface TransferStationItem {
  id: string;
  bookmark: BookmarkData;
  from: GridDragPayload;
}

export type TransferStationSide = "left" | "right" | "top" | "bottom";

const STATION_EDGE_THRESHOLD = 80;
const STATION_DIRECTION_DELTA = 40;

/** 根据拖拽起点与当前指针位置，决定中转站应吸在哪条边 */
export function resolveTransferStationSide(
  clientX: number,
  clientY: number,
  dragOriginX: number,
  dragOriginY: number,
  viewportWidth: number,
  viewportHeight: number,
): TransferStationSide | null {
  const deltaX = clientX - dragOriginX;
  const deltaY = clientY - dragOriginY;
  const nearLeft = clientX <= STATION_EDGE_THRESHOLD;
  const nearRight = clientX >= viewportWidth - STATION_EDGE_THRESHOLD;
  const nearTop = clientY <= STATION_EDGE_THRESHOLD;
  const nearBottom = clientY >= viewportHeight - STATION_EDGE_THRESHOLD;

  if (nearLeft || nearRight || nearTop || nearBottom) {
    const candidates: { edge: TransferStationSide; distance: number }[] = [
      { edge: "left", distance: clientX },
      { edge: "right", distance: viewportWidth - clientX },
      { edge: "top", distance: clientY },
      { edge: "bottom", distance: viewportHeight - clientY },
    ];
    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0]?.edge ?? null;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX >= STATION_DIRECTION_DELTA || absY >= STATION_DIRECTION_DELTA) {
    if (absX >= absY) {
      if (deltaX <= -STATION_DIRECTION_DELTA && clientX < viewportWidth * 0.45) return "left";
      if (deltaX >= STATION_DIRECTION_DELTA && clientX > viewportWidth * 0.55) return "right";
    } else {
      if (deltaY <= -STATION_DIRECTION_DELTA && clientY < viewportHeight * 0.45) return "top";
      if (deltaY >= STATION_DIRECTION_DELTA && clientY > viewportHeight * 0.55) return "bottom";
    }
  }

  return null;
}

export function isTransferStationVerticalSide(
  side: TransferStationSide,
): side is "left" | "right" {
  return side === "left" || side === "right";
}

export function isGridDragPayload(payload: DragPayload): payload is GridDragPayload {
  return payload.source === "grid";
}

export function isStationDragPayload(payload: DragPayload): payload is StationDragPayload {
  return payload.source === "station" && typeof payload.itemId === "string" && payload.itemId.length > 0;
}

/** 解析 drag dataTransfer / 状态中的 payload，兼容旧版无 source 字段 */
export function parseDragPayload(raw: unknown): DragPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  if (record.source === "station") {
    const itemId = typeof record.itemId === "string" ? record.itemId : "";
    if (!itemId) return null;
    return { source: "station", itemId };
  }

  const sectionIndex = Number(record.sectionIndex);
  const cardIndex = Number(record.cardIndex);
  const bookmarkIndex = Number(record.bookmarkIndex);
  if ([sectionIndex, cardIndex, bookmarkIndex].some(Number.isNaN)) return null;

  return { source: "grid", sectionIndex, cardIndex, bookmarkIndex };
}

export const BOOKMARK_DRAG_MIME = "application/x-wwlight-bookmark-drag";

export function writeDragPayloadData(dataTransfer: DataTransfer, payload: DragPayload) {
  const data = JSON.stringify(payload);
  dataTransfer.setData("text/plain", data);
  dataTransfer.setData(BOOKMARK_DRAG_MIME, data);
}

export function readDragPayloadData(dataTransfer: DataTransfer): DragPayload | null {
  for (const type of [BOOKMARK_DRAG_MIME, "text/plain"]) {
    try {
      const raw = dataTransfer.getData(type);
      if (!raw) continue;
      const parsed = parseDragPayload(JSON.parse(raw));
      if (parsed) return parsed;
    } catch {
      // try next type
    }
  }
  return null;
}

export const STORAGE_KEY = SITE_STORAGE_KEYS.bookmarksAdminDraft;
export const TRANSFER_STATION_STORAGE_KEY = SITE_STORAGE_KEYS.bookmarksAdminTransfer;

export function loadTransferStationItems(): TransferStationItem[] {
  if (typeof localStorage === "undefined") return [];

  try {
    const raw = localStorage.getItem(TRANSFER_STATION_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const bookmark = record.bookmark as BookmarkData | undefined;
      const from = record.from as GridDragPayload | undefined;
      if (!id || !bookmark?.title || !bookmark.url || !from || from.source !== "grid") return [];
      return [{ id, bookmark, from }];
    });
  } catch {
    localStorage.removeItem(TRANSFER_STATION_STORAGE_KEY);
    return [];
  }
}

export function persistTransferStationItems(items: TransferStationItem[]) {
  if (typeof localStorage === "undefined") return;

  if (items.length === 0) {
    localStorage.removeItem(TRANSFER_STATION_STORAGE_KEY);
    return;
  }

  localStorage.setItem(TRANSFER_STATION_STORAGE_KEY, JSON.stringify(items));
}

export function clearTransferStationStorage() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(TRANSFER_STATION_STORAGE_KEY);
}

export function transferStationHasBookmark(items: TransferStationItem[], url: string) {
  return items.some((entry) => entry.bookmark.url === url);
}

export const TRANSFER_STATION_DOCK_STORAGE_KEY = SITE_STORAGE_KEYS.bookmarksAdminTransferDock;

/** 沿边位置，0–100 视口百分比（对齐 Nuxt DevTools frame state） */
export type TransferStationDockPoint = {
  left: number;
  top: number;
};

export type TransferStationDockState = {
  side: TransferStationSide;
  left: number;
  top: number;
};

const DEFAULT_TRANSFER_STATION_DOCK: TransferStationDockState = {
  side: "right",
  left: 50,
  top: 50,
};

function isTransferStationSide(value: unknown): value is TransferStationSide {
  return value === "left" || value === "right" || value === "top" || value === "bottom";
}

function normalizeDockPoint(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : fallback;
}

export function loadTransferStationDock(): TransferStationDockState {
  if (typeof localStorage === "undefined") {
    return { ...DEFAULT_TRANSFER_STATION_DOCK };
  }

  try {
    const raw = localStorage.getItem(TRANSFER_STATION_DOCK_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRANSFER_STATION_DOCK };

    const parsed = JSON.parse(raw) as Partial<TransferStationDockState> & { slides?: unknown };
    return {
      side: isTransferStationSide(parsed.side) ? parsed.side : DEFAULT_TRANSFER_STATION_DOCK.side,
      left: normalizeDockPoint(parsed.left, DEFAULT_TRANSFER_STATION_DOCK.left),
      top: normalizeDockPoint(parsed.top, DEFAULT_TRANSFER_STATION_DOCK.top),
    };
  } catch {
    localStorage.removeItem(TRANSFER_STATION_DOCK_STORAGE_KEY);
    return { ...DEFAULT_TRANSFER_STATION_DOCK };
  }
}

export function persistTransferStationDock(state: TransferStationDockState) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(TRANSFER_STATION_DOCK_STORAGE_KEY, JSON.stringify(state));
}

export const TRANSFER_STATION_VIEWPORT_INSET_PX = 16;

/** Nuxt DevTools NuxtDevtoolsFrame.vue — SNAP_THRESHOLD */
const TRANSFER_STATION_DOCK_SNAP_THRESHOLD = 2;

/** Nuxt DevTools NuxtDevtoolsFrame.vue — HORIZONTAL_MARGIN */
const TRANSFER_STATION_DOCK_ANGLE_MARGIN = 70;

function clampDockValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Nuxt DevTools snapToPoints */
export function snapTransferStationDockPoint(value: number) {
  if (value < 5) return 0;
  if (value > 95) return 100;
  if (Math.abs(value - 50) < TRANSFER_STATION_DOCK_SNAP_THRESHOLD) return 50;
  return value;
}

/** Nuxt DevTools pointermove — atan2 四象限换边 */
export function resolveTransferStationDockSideFromAngle(
  anchorX: number,
  anchorY: number,
  viewportWidth: number,
  viewportHeight: number,
  currentSide?: TransferStationSide,
): TransferStationSide {
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  const margin = TRANSFER_STATION_DOCK_ANGLE_MARGIN;
  const deg = Math.atan2(anchorY - centerY, anchorX - centerX);
  const tl = Math.atan2(0 - centerY + margin, 0 - centerX);
  const tr = Math.atan2(0 - centerY + margin, viewportWidth - centerX);
  const bl = Math.atan2(viewportHeight - margin - centerY, 0 - centerX);
  const br = Math.atan2(viewportHeight - margin - centerY, viewportWidth - centerX);

  const hysteresis = 0.12;
  const inSector = (side: TransferStationSide) => {
    switch (side) {
      case "top":
        return deg >= tl - hysteresis && deg <= tr + hysteresis;
      case "right":
        return deg >= tr - hysteresis && deg <= br + hysteresis;
      case "bottom":
        return deg >= br - hysteresis && deg <= bl + hysteresis;
      case "left":
        return deg >= bl - hysteresis || deg <= tl + hysteresis;
    }
  };

  if (currentSide && inSector(currentSide)) return currentSide;

  if (deg >= tl && deg <= tr) return "top";
  if (deg >= tr && deg <= br) return "right";
  if (deg >= br && deg <= bl) return "bottom";
  return "left";
}

/** Nuxt DevTools anchorPos — 由 side + 百分比锚点换算像素中心 */
export function computeTransferStationAnchorPos(
  side: TransferStationSide,
  leftPercent: number,
  topPercent: number,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  margin = TRANSFER_STATION_VIEWPORT_INSET_PX,
): TransferStationDockPoint {
  const halfWidth = panelWidth / 2;
  const halfHeight = panelHeight / 2;
  const leftPx = (leftPercent / 100) * viewportWidth;
  const topPx = (topPercent / 100) * viewportHeight;

  switch (side) {
    case "top":
      return {
        left: clampDockValue(
          leftPx,
          halfWidth + margin,
          viewportWidth - halfWidth - margin,
        ),
        top: margin + halfHeight,
      };
    case "right":
      return {
        left: viewportWidth - margin - halfWidth,
        top: clampDockValue(
          topPx,
          halfHeight + margin,
          viewportHeight - halfHeight - margin,
        ),
      };
    case "left":
      return {
        left: margin + halfWidth,
        top: clampDockValue(
          topPx,
          halfHeight + margin,
          viewportHeight - halfHeight - margin,
        ),
      };
    case "bottom":
      return {
        left: clampDockValue(
          leftPx,
          halfWidth + margin,
          viewportWidth - halfWidth - margin,
        ),
        top: viewportHeight - margin - halfHeight,
      };
  }
}

export type TransferStationDockPosition = {
  left: number;
  top: number;
  right: "auto";
  bottom: "auto";
};

export function getTransferStationDockPositionStyle(
  side: TransferStationSide,
  leftPercent: number,
  topPercent: number,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): TransferStationDockPosition {
  const anchor = computeTransferStationAnchorPos(
    side,
    leftPercent,
    topPercent,
    panelWidth,
    panelHeight,
    viewportWidth,
    viewportHeight,
  );

  return {
    left: anchor.left - panelWidth / 2,
    top: anchor.top - panelHeight / 2,
    right: "auto",
    bottom: "auto",
  };
}

export function getTransferStationDockMorphTargetStyle(
  side: TransferStationSide,
  leftPercent: number,
  topPercent: number,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): TransferStationDockPosition & { width: number; height: number } {
  return {
    ...getTransferStationDockPositionStyle(
      side,
      leftPercent,
      topPercent,
      panelWidth,
      panelHeight,
      viewportWidth,
      viewportHeight,
    ),
    width: panelWidth,
    height: panelHeight,
  };
}

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
  from: GridDragPayload,
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
  from: GridDragPayload,
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

export function takeBookmarkForTransfer(
  sections: BookmarkSectionData[],
  from: GridDragPayload,
): BookmarkData | null {
  const bookmarks = sections[from.sectionIndex]?.cards[from.cardIndex]?.bookmarks;
  if (!bookmarks) return null;

  const [bookmark] = bookmarks.splice(from.bookmarkIndex, 1);
  if (!bookmark) return null;

  normalizeSortOrders(sections);
  return bookmark;
}

export function restoreTransferBookmark(
  sections: BookmarkSectionData[],
  bookmark: BookmarkData,
  from: GridDragPayload,
): boolean {
  const bookmarks = sections[from.sectionIndex]?.cards[from.cardIndex]?.bookmarks;
  if (!bookmarks) return false;

  const index = Math.min(from.bookmarkIndex, bookmarks.length);
  bookmarks.splice(index, 0, bookmark);
  normalizeSortOrders(sections);
  return true;
}

export function insertTransferBookmark(
  sections: BookmarkSectionData[],
  bookmark: BookmarkData,
  to: { sectionIndex: number; cardIndex: number; bookmarkIndex: number },
): boolean {
  const targetBookmarks = sections[to.sectionIndex]?.cards[to.cardIndex]?.bookmarks;
  if (!targetBookmarks) return false;

  const insertIndex = Math.max(0, Math.min(to.bookmarkIndex, targetBookmarks.length));
  targetBookmarks.splice(insertIndex, 0, bookmark);
  normalizeSortOrders(sections);
  return true;
}

/** 中转站拖出：在目标卡片位置插入，不交换 */
export function resolveTransferInsertIndex(
  grid: HTMLElement,
  clientX: number,
  clientY: number,
): number {
  const element = document.elementFromPoint(clientX, clientY);
  const cardEl = element?.closest("[data-bookmark-card]") as HTMLElement | null;
  if (cardEl && grid.contains(cardEl)) {
    const bookmarkIndex = Number(cardEl.dataset.bookmarkIndex);
    if (!Number.isNaN(bookmarkIndex)) return bookmarkIndex;
  }

  const cards = [...grid.querySelectorAll<HTMLElement>("[data-bookmark-card]")];
  for (const card of cards) {
    const bookmarkIndex = Number(card.dataset.bookmarkIndex);
    if (Number.isNaN(bookmarkIndex)) continue;
    const rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return bookmarkIndex;
  }
  return cards.length;
}

export { clampSelectedSection, sectionBookmarkCount } from "./section-helpers";
