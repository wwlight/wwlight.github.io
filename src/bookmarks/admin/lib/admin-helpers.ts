/**
 * 功能：管理端拖拽、CRUD、编辑上下文、中转站 DnD 与 Tailwind 工具类。
 * 关联：AdminApp、DragTransferStation
 */
import type { BookmarkData, BookmarkLink, BookmarkSectionData } from "@/bookmarks/shared/types";
import { floatingBadgeClass } from "@/bookmarks/admin/components/ui-helpers";
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

export type TransferStationSide = "left" | "right";

/** 当前 dock 在左/右时，双击对侧贴边窄条则返回应对侧；否则 null */
export function resolveTransferStationEdgeFlipSide(
  currentSide: TransferStationSide,
  clientX: number,
  viewportWidth: number,
): TransferStationSide | null {
  const zone = TRANSFER_STATION_EDGE_FLIP_ZONE_PX;
  if (currentSide === "left" && clientX >= viewportWidth - zone) {
    return "right";
  }
  if (currentSide === "right" && clientX <= zone) {
    return "left";
  }
  return null;
}

/** 指针超出模块面板左右外缘时，决定中转站贴在哪一侧 */
export function resolveTransferStationSideFromPanel(
  clientX: number,
  panel: Pick<DOMRect, "left" | "right">,
): TransferStationSide | null {
  if (clientX < panel.left) return "left";
  if (clientX > panel.right) return "right";
  return null;
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

/** 中转站最多暂存的书签数量 */
export const TRANSFER_STATION_MAX_ITEMS = 9;

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

export function transferStationIsFull(items: TransferStationItem[]) {
  return items.length >= TRANSFER_STATION_MAX_ITEMS;
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

function normalizeTransferStationSide(value: unknown): TransferStationSide {
  if (value === "left") return "left";
  if (value === "right" || value === "top" || value === "bottom") return "right";
  return DEFAULT_TRANSFER_STATION_DOCK.side;
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
      side: normalizeTransferStationSide(parsed.side),
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

/** 与 admin.css `--admin-transfer-station-tab-size`（2.75rem @ 16px）对齐 */
export const TRANSFER_STATION_TAB_SIZE_PX = 44;

/** 双击屏幕贴边区域（2× tab 宽）切换到对侧 dock */
export const TRANSFER_STATION_EDGE_FLIP_ZONE_PX = TRANSFER_STATION_TAB_SIZE_PX * 2;

/** shell 上下 border 各 1px，与 admin.css `--admin-transfer-station-collapsed-outer-size` 对齐 */
export const TRANSFER_STATION_SHELL_BORDER_PX = 1;

/** 与 admin.css `--admin-transfer-station-motion` 对齐 */
export const TRANSFER_STATION_MOTION_MS = 320;

/** icon 连点防抖，略短于 motion 以免与动画拖尾叠加 */
export const TRANSFER_STATION_ICON_TOGGLE_DEBOUNCE_MS = 280;

/** 与 admin.css item / gap / scroll-padding scale 对齐（1rem = 16px） */
const TRANSFER_STATION_ITEM_HEIGHT_PX = 42;
const TRANSFER_STATION_ITEM_GAP_PX = 8;
const TRANSFER_STATION_SCROLL_PADDING_PX = 16;
const TRANSFER_STATION_VISIBLE_ITEMS = 6;

/** Nuxt DevTools NuxtDevtoolsFrame.vue — SNAP_THRESHOLD */
const TRANSFER_STATION_DOCK_SNAP_THRESHOLD = 2;

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

/** 网格拖拽离开模块面板时，沿左右边把锚点移到指针附近 */
export function projectTransferStationDockPoint(
  side: TransferStationSide,
  anchorClientY: number,
  viewportHeight: number,
  current: TransferStationDockState,
  options?: { snap?: boolean },
): TransferStationDockState {
  const rawTop = (anchorClientY / viewportHeight) * 100;
  return {
    ...current,
    side,
    top: options?.snap === false ? rawTop : snapTransferStationDockPoint(rawTop),
  };
}

export function isSameTransferStationDock(
  a: TransferStationDockState,
  b: TransferStationDockState,
): boolean {
  return a.side === b.side && a.top === b.top;
}

/** 拖拽起点：指针相对卡片垂直中心的偏移（拖拽过程中恒定） */
export function computeDragPointerToCardCenterOffset(
  clientY: number,
  elementRect: Pick<DOMRect, "top" | "height">,
) {
  return elementRect.height / 2 - (clientY - elementRect.top);
}

export function resolveDragCardCenterClientY(
  clientY: number,
  pointerToCenterOffset: number | null | undefined,
) {
  if (pointerToCenterOffset == null) return clientY;
  return clientY + pointerToCenterOffset;
}

/** 拖拽过程中让 dock 垂直锚点跟随卡片中心 */
export function followTransferStationDockToCard(
  current: TransferStationDockState,
  side: TransferStationSide,
  clientY: number,
  pointerToCenterOffset: number | null | undefined,
  viewportHeight: number,
  options?: { snap?: boolean },
): TransferStationDockState {
  const anchorClientY = resolveDragCardCenterClientY(clientY, pointerToCenterOffset);
  return projectTransferStationDockPoint(side, anchorClientY, viewportHeight, current, options);
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
  const topPx = (topPercent / 100) * viewportHeight;

  if (side === "right") {
    return {
      left: viewportWidth - margin - halfWidth,
      top: clampDockValue(
        topPx,
        halfHeight + margin,
        viewportHeight - halfHeight - margin,
      ),
    };
  }

  return {
    left: margin + halfWidth,
    top: clampDockValue(
      topPx,
      halfHeight + margin,
      viewportHeight - halfHeight - margin,
    ),
  };
}

export type TransferStationDockPosition = {
  left: number | "auto";
  top: number;
  right: number | "auto";
  bottom: "auto";
};

/** icon-row：icon 行锚定 topPercent；panel-center：拖拽跟随时面板垂直居中 */
export type TransferStationDockAnchor = "icon-row" | "panel-center";

export function getTransferStationDockPositionStyle(
  side: TransferStationSide,
  topPercent: number,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  margin = TRANSFER_STATION_VIEWPORT_INSET_PX,
  anchor: TransferStationDockAnchor = "icon-row",
): TransferStationDockPosition {
  const anchorY = (topPercent / 100) * viewportHeight;
  const panelTop =
    anchor === "panel-center"
      ? anchorY - panelHeight / 2
      : anchorY - TRANSFER_STATION_TAB_SIZE_PX / 2;
  // icon-row：展开/收起时用最大面板高度做 clamp，避免收缩瞬间 top 下沉打断高度过渡
  const clampHeight =
    anchor === "icon-row" ? estimateTransferStationPanelMaxHeight() : panelHeight;
  const top = clampDockValue(panelTop, margin, viewportHeight - clampHeight - margin);

  if (side === "right") {
    return {
      left: "auto",
      top,
      right: margin,
      bottom: "auto",
    };
  }

  return {
    left: margin,
    top,
    right: "auto",
    bottom: "auto",
  };
}

/** 与 admin.css `--admin-transfer-station-panel-max-height` 对齐（1rem = 16px） */
export function estimateTransferStationPanelMaxHeight() {
  const tabSizePx = TRANSFER_STATION_TAB_SIZE_PX;

  return (
    tabSizePx * 2 +
    TRANSFER_STATION_VISIBLE_ITEMS * TRANSFER_STATION_ITEM_HEIGHT_PX +
    (TRANSFER_STATION_VISIBLE_ITEMS - 1) * TRANSFER_STATION_ITEM_GAP_PX +
    TRANSFER_STATION_SCROLL_PADDING_PX +
    2 * TRANSFER_STATION_SHELL_BORDER_PX
  );
}

/** 展开态列表区固定高度，与 `--admin-transfer-station-body-scroll-height` 对齐 */
export function estimateTransferStationBodyScrollHeightPx() {
  return (
    TRANSFER_STATION_VISIBLE_ITEMS * TRANSFER_STATION_ITEM_HEIGHT_PX +
    (TRANSFER_STATION_VISIBLE_ITEMS - 1) * TRANSFER_STATION_ITEM_GAP_PX +
    TRANSFER_STATION_SCROLL_PADDING_PX
  );
}

/** 与 admin.css `--admin-transfer-station-*` 默认 scale 对齐（1rem = 16px） */
export function estimateTransferStationPanelHeight(itemCount: number, panelOpen: boolean) {
  const tabSizePx = TRANSFER_STATION_TAB_SIZE_PX;

  if (!panelOpen) {
    return tabSizePx + TRANSFER_STATION_SHELL_BORDER_PX * 2;
  }

  if (itemCount === 0) {
    return tabSizePx + tabSizePx + estimateTransferStationBodyScrollHeightPx();
  }

  const visibleItems = Math.min(itemCount, TRANSFER_STATION_VISIBLE_ITEMS);
  return (
    tabSizePx +
    visibleItems * TRANSFER_STATION_ITEM_HEIGHT_PX +
    Math.max(0, visibleItems - 1) * TRANSFER_STATION_ITEM_GAP_PX +
    TRANSFER_STATION_SCROLL_PADDING_PX
  );
}

export function estimateTransferStationPanelWidth(panelOpen: boolean) {
  return panelOpen ? 224 : TRANSFER_STATION_TAB_SIZE_PX + TRANSFER_STATION_SHELL_BORDER_PX * 2;
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

export { clampSelectedSection, sectionBookmarkCount } from "@/bookmarks/shared/lib/section-helpers";
