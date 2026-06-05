/**
 * 功能：管理端中转站状态、dock、可见性与拖放处理。
 * 关联：AdminApp.tsx、useAdminGridDrag.ts、admin-app-constants.ts
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  cloneSections,
  isGridDragPayload,
  isSameTransferStationDock,
  isStationDragPayload,
  loadTransferStationDock,
  loadTransferStationItems,
  normalizeSortOrders,
  parseDragPayload,
  persistTransferStationDock,
  persistTransferStationItems,
  restoreTransferBookmark,
  resolveTransferStationEdgeFlipSide,
  takeBookmarkForTransfer,
  TRANSFER_STATION_MAX_ITEMS,
  transferStationHasBookmark,
  transferStationIsFull,
  type StationDragPayload,
  type TransferStationDockState,
  type TransferStationItem,
  type TransferStationSide,
  writeDragPayloadData,
} from "@/bookmarks/admin/lib/admin-helpers";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { migrateAllLegacyStorageKeys } from "@/lib/site-storage";
import { STATION_DISMISS_MS, STATION_IDLE_HIDE_MS } from "./admin-app-constants";
import type { AdminGridDragFns } from "./useAdminGridDrag";

interface UseAdminTransferStationParams {
  dragSessionPayloadRef: React.MutableRefObject<import("@/bookmarks/admin/lib/admin-helpers").DragPayload | null>;
  dragPayloadRef: React.MutableRefObject<import("@/bookmarks/admin/lib/admin-helpers").DragPayload | null>;
  stationPanelRef: React.RefObject<HTMLElement | null>;
  modulePanelRef: React.RefObject<HTMLDivElement | null>;
  dragEnabled: boolean;
  dragPayload: import("@/bookmarks/admin/lib/admin-helpers").DragPayload | null;
  dragApproaching: boolean;
  sectionsRef: React.MutableRefObject<BookmarkSectionData[]>;
  setSections: React.Dispatch<React.SetStateAction<BookmarkSectionData[]>>;
  persistDraft: (sections: BookmarkSectionData[]) => void;
  updateSections: (updater: (prev: BookmarkSectionData[]) => BookmarkSectionData[]) => void;
  gridDragFnsRef: React.MutableRefObject<AdminGridDragFns>;
}

export function useAdminTransferStation({
  dragSessionPayloadRef,
  dragPayloadRef,
  stationPanelRef,
  dragEnabled,
  dragPayload,
  dragApproaching,
  sectionsRef,
  setSections,
  persistDraft,
  updateSections,
  gridDragFnsRef,
}: UseAdminTransferStationParams) {
  const [transferItems, setTransferItems] = useState<TransferStationItem[]>(() => {
    migrateAllLegacyStorageKeys();
    return loadTransferStationItems();
  });
  const [hadTransferDraft] = useState(() => loadTransferStationItems().length > 0);
  const [transferDropActive, setTransferDropActive] = useState(false);
  const [dock, setDock] = useState<TransferStationDockState>(() => loadTransferStationDock());
  const [stationVisible, setStationVisible] = useState(() => loadTransferStationItems().length > 0);
  const [stationDismissing, setStationDismissing] = useState(false);
  const [stationSideFlipping, setStationSideFlipping] = useState(false);
  const [stationEntering, setStationEntering] = useState(false);
  const [stationPanelExpanded, setStationPanelExpanded] = useState(false);
  const [stationIdleEpoch, setStationIdleEpoch] = useState(0);

  const stationDismissTimerRef = useRef<number | null>(null);
  const stationSideFlipTimerRef = useRef<number | null>(null);
  const stationSideFlippingRef = useRef(false);
  const stationVisibleRef = useRef(stationVisible);
  const stationDismissingRef = useRef(stationDismissing);
  const stationPanelExpandedRef = useRef(stationPanelExpanded);
  const transferItemsRef = useRef(transferItems);
  const dockRef = useRef(dock);
  const transferDropDepthRef = useRef(0);
  const transferFullToastShownRef = useRef(false);
  const initialPanelExpandPendingRef = useRef(hadTransferDraft);

  transferItemsRef.current = transferItems;
  dockRef.current = dock;
  stationVisibleRef.current = stationVisible;
  stationDismissingRef.current = stationDismissing;
  stationPanelExpandedRef.current = stationPanelExpanded;

  const bumpStationActivity = useCallback(() => {
    setStationIdleEpoch((epoch) => epoch + 1);
  }, []);

  const expandStationPanelAnimated = useCallback(() => {
    if (stationPanelExpandedRef.current) {
      setStationPanelExpanded(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setStationPanelExpanded(true));
      });
      return;
    }
    window.requestAnimationFrame(() => setStationPanelExpanded(true));
  }, []);

  function setDockPosition(next: TransferStationDockState) {
    if (isSameTransferStationDock(next, dockRef.current)) return;
    dockRef.current = next;
    setDock(next);
  }

  function commitDockPosition(next?: TransferStationDockState) {
    if (next && !isSameTransferStationDock(next, dockRef.current)) {
      dockRef.current = next;
      setDock(next);
    }
    persistTransferStationDock(dockRef.current);
  }

  function handleDockChange(next: TransferStationDockState) {
    bumpStationActivity();
    setDockPosition(next);
  }

  function handleDockCommit() {
    commitDockPosition();
  }

  function cancelStationSideFlip() {
    if (stationSideFlipTimerRef.current != null) {
      window.clearTimeout(stationSideFlipTimerRef.current);
      stationSideFlipTimerRef.current = null;
    }
    stationSideFlippingRef.current = false;
    setStationSideFlipping(false);
    setStationEntering(false);
  }

  function cancelStationDismiss() {
    if (stationDismissTimerRef.current != null) {
      window.clearTimeout(stationDismissTimerRef.current);
      stationDismissTimerRef.current = null;
    }
    setStationDismissing(false);
  }

  function wakeStationForApproach() {
    cancelStationDismiss();
    setStationEntering(false);
    setStationVisible(true);
  }

  function showStation() {
    cancelStationDismiss();
    if (!stationVisibleRef.current) {
      setStationPanelExpanded(false);
    }
    setStationVisible(true);
  }

  function beginStationMinimize() {
    if (!stationPanelExpanded) return;
    setStationPanelExpanded(false);
  }

  function beginStationDismiss() {
    if (!stationVisible || stationDismissing) return;
    setStationDismissing(true);
    stationDismissTimerRef.current = window.setTimeout(() => {
      stationDismissTimerRef.current = null;
      setStationVisible(false);
      setStationPanelExpanded(false);
      setStationDismissing(false);
    }, STATION_DISMISS_MS);
  }

  function flipTransferStationToSide(nextSide: TransferStationSide) {
    if (dockRef.current.side === nextSide) return;
    if (stationSideFlippingRef.current) return;

    cancelStationDismiss();
    setStationEntering(false);
    if (!stationVisibleRef.current) {
      setStationVisible(true);
    }

    stationSideFlippingRef.current = true;
    setStationSideFlipping(true);

    stationSideFlipTimerRef.current = window.setTimeout(() => {
      stationSideFlipTimerRef.current = null;
      commitDockPosition({ ...dockRef.current, side: nextSide });
      setStationSideFlipping(false);
      setStationEntering(true);
      stationSideFlippingRef.current = false;
    }, STATION_DISMISS_MS);
  }

  function replaceTransferItems(next: TransferStationItem[]) {
    persistTransferStationItems(next);
    setTransferItems(next);
  }

  function prependTransferItem(item: TransferStationItem) {
    if (transferStationHasBookmark(transferItemsRef.current, item.bookmark.url)) {
      return false;
    }
    if (transferStationIsFull(transferItemsRef.current)) {
      return false;
    }
    replaceTransferItems([item, ...transferItemsRef.current]);
    return true;
  }

  function removeTransferItemFromState(id: string) {
    replaceTransferItems(transferItemsRef.current.filter((entry) => entry.id !== id));
  }

  function findTransferItem(id: string) {
    return transferItemsRef.current.find((entry) => entry.id === id) ?? null;
  }

  function handleStationPanelExpandedChange(expanded: boolean) {
    setStationPanelExpanded(expanded);
    bumpStationActivity();
    if (expanded) showStation();
  }

  function maybeToastTransferStationFull() {
    if (!transferStationIsFull(transferItemsRef.current)) return;
    if (transferFullToastShownRef.current) return;
    transferFullToastShownRef.current = true;
    toast.message(`中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`);
  }

  const draggingStationItemId =
    dragPayload && isStationDragPayload(dragPayload) ? dragPayload.itemId : null;
  const forceStationExpanded = transferDropActive || dragApproaching;

  function restoreAllTransferItemsToSections() {
    const items = transferItemsRef.current;
    if (items.length === 0) return;

    updateSections((prev) => {
      for (const item of items) {
        restoreTransferBookmark(prev, item.bookmark, item.from);
      }
      return prev;
    });
    replaceTransferItems([]);
  }

  /** 保存前把中转站书签还原到原分组，再写入项目 */
  function buildSectionsForSave() {
    const next = cloneSections(sectionsRef.current);
    for (const item of transferItemsRef.current) {
      restoreTransferBookmark(next, item.bookmark, item.from);
    }
    normalizeSortOrders(next);
    return next;
  }

  function enableStationDropPassthrough() {
    requestAnimationFrame(() => {
      stationPanelRef.current?.style.setProperty("pointer-events", "none");
    });
  }

  function disableStationDropPassthrough() {
    stationPanelRef.current?.style.removeProperty("pointer-events");
  }

  function handleTransferStationDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    transferDropDepthRef.current = 0;
    setTransferDropActive(false);

    try {
      const payload = gridDragFnsRef.current.readDragPayload(event);
      if (!payload || !isGridDragPayload(payload)) return;

      const sourceBookmark =
        sectionsRef.current[payload.sectionIndex]?.cards[payload.cardIndex]?.bookmarks[
          payload.bookmarkIndex
        ];
      if (!sourceBookmark) return;

      if (transferStationIsFull(transferItemsRef.current)) {
        toast.message(`中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`);
        return;
      }

      if (transferStationHasBookmark(transferItemsRef.current, sourceBookmark.url)) {
        toast.message("该书签已在中转站中");
        return;
      }

      const next = cloneSections(sectionsRef.current);
      const bookmark = takeBookmarkForTransfer(next, payload);
      if (!bookmark) return;

      const item: TransferStationItem = {
        id: crypto.randomUUID(),
        bookmark,
        from: payload,
      };

      normalizeSortOrders(next);
      persistDraft(next);
      setSections(next);

      if (!prependTransferItem(item)) {
        restoreTransferBookmark(next, bookmark, payload);
        normalizeSortOrders(next);
        persistDraft(next);
        setSections(next);
        toast.message(
          transferStationIsFull(transferItemsRef.current)
            ? `中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`
            : "该书签已在中转站中",
        );
        return;
      }

      showStation();
      if (stationPanelExpandedRef.current) {
        setStationPanelExpanded(true);
      } else {
        expandStationPanelAnimated();
      }
      toast.success("已加入中转站");
    } finally {
      gridDragFnsRef.current.clearActiveDragPayload();
    }
  }

  function removeTransferItem(id: string) {
    const item = transferItemsRef.current.find((entry) => entry.id === id);
    if (!item) return;

    updateSections((prev) => {
      restoreTransferBookmark(prev, item.bookmark, item.from);
      return prev;
    });
    removeTransferItemFromState(id);
    toast.message("已移出中转站");
  }

  function clearAllTransferItems() {
    if (transferItemsRef.current.length === 0) return;
    restoreAllTransferItemsToSections();
    cancelStationDismiss();
    setStationVisible(true);
    toast.message("已清空中转站");
  }

  function handleStationDragStart(event: React.DragEvent<HTMLDivElement>, itemId: string) {
    const active = parseDragPayload(dragSessionPayloadRef.current ?? dragPayloadRef.current);
    if (active && isStationDragPayload(active) && active.itemId !== itemId) {
      event.preventDefault();
      return;
    }

    const item = findTransferItem(itemId);
    if (!item) {
      event.preventDefault();
      return;
    }

    gridDragFnsRef.current.syncDragCardCenterOffset(event);
    gridDragFnsRef.current.dragOriginXRef.current = event.clientX;
    gridDragFnsRef.current.dragOriginYRef.current = event.clientY;
    const payload: StationDragPayload = { source: "station", itemId };
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    event.dataTransfer.effectAllowed = "move";
    writeDragPayloadData(event.dataTransfer, payload);
    gridDragFnsRef.current.scheduleDragPayloadSync(payload);
    requestAnimationFrame(() => {
      enableStationDropPassthrough();
    });
  }

  function handleStationDragEnd() {
    disableStationDropPassthrough();
    gridDragFnsRef.current.cancelPendingDragPayloadFrame();
    requestAnimationFrame(() => {
      // drop 先于 dragend；session 仍在表示未成功放入分组
      if (dragSessionPayloadRef.current && isStationDragPayload(dragSessionPayloadRef.current)) {
        gridDragFnsRef.current.clearActiveDragPayload();
      } else {
        gridDragFnsRef.current.clearDragUiState();
      }
    });
  }

  function handleTransferStationDragEnter(event: React.DragEvent<HTMLDivElement>) {
    const payload = parseDragPayload(dragSessionPayloadRef.current);
    if (payload && isStationDragPayload(payload)) return;

    event.preventDefault();
    event.stopPropagation();
    transferDropDepthRef.current += 1;
    setTransferDropActive(true);
    bumpStationActivity();
    showStation();
  }

  function handleTransferStationDragOver(event: React.DragEvent<HTMLDivElement>) {
    const payload = parseDragPayload(dragSessionPayloadRef.current);
    if (payload && isStationDragPayload(payload)) {
      event.dataTransfer.dropEffect = "none";
      return;
    }

    if (transferStationIsFull(transferItemsRef.current)) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "none";
      maybeToastTransferStationFull();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    if (transferDropDepthRef.current === 0) {
      transferDropDepthRef.current = 1;
    }
    setTransferDropActive(true);
    bumpStationActivity();
    showStation();
  }

  function handleTransferStationDragLeave(event: React.DragEvent<HTMLDivElement>) {
    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) return;

    event.stopPropagation();
    transferDropDepthRef.current = Math.max(0, transferDropDepthRef.current - 1);
    if (transferDropDepthRef.current === 0) {
      setTransferDropActive(false);
    }
  }

  useEffect(() => {
    if (hadTransferDraft) toast.message("已恢复中转站暂存");
  }, [hadTransferDraft]);

  useLayoutEffect(() => {
    if (!initialPanelExpandPendingRef.current || !stationVisible) return;
    initialPanelExpandPendingRef.current = false;
    expandStationPanelAnimated();
  }, [stationVisible, expandStationPanelAnimated]);

  useEffect(() => {
    if (transferDropActive || draggingStationItemId || dragApproaching) {
      wakeStationForApproach();
      return;
    }

    if (stationDismissing) return;

    const hasItems = transferItems.length > 0;

    if (hasItems) {
      if (!stationVisible) {
        showStation();
      }
      if (!stationPanelExpanded) return;

      const timer = window.setTimeout(() => beginStationMinimize(), STATION_IDLE_HIDE_MS);
      return () => window.clearTimeout(timer);
    }

    if (!stationVisible) return;

    const timer = window.setTimeout(() => beginStationDismiss(), STATION_IDLE_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [
    transferItems.length,
    transferDropActive,
    draggingStationItemId,
    dragApproaching,
    stationVisible,
    stationDismissing,
    stationPanelExpanded,
    stationIdleEpoch,
  ]);

  useEffect(() => {
    if (!stationEntering) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setStationEntering(false));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stationEntering]);

  useEffect(() => {
    return () => {
      cancelStationDismiss();
      cancelStationSideFlip();
    };
  }, []);

  useEffect(() => {
    if (!dragEnabled) return;

    function onDoubleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("input, textarea, select, button, a, [contenteditable='true']")) return;

      const nextSide = resolveTransferStationEdgeFlipSide(
        dockRef.current.side,
        event.clientX,
        window.innerWidth,
      );
      if (!nextSide) return;

      event.preventDefault();
      flipTransferStationToSide(nextSide);
    }

    document.addEventListener("dblclick", onDoubleClick, true);
    return () => {
      document.removeEventListener("dblclick", onDoubleClick, true);
    };
  }, [dragEnabled]);

  return {
    transferItems,
    hadTransferDraft,
    transferDropActive,
    setTransferDropActive,
    dock,
    stationVisible,
    stationDismissing,
    stationSideFlipping,
    stationEntering,
    stationPanelExpanded,
    transferItemsRef,
    dockRef,
    transferDropDepthRef,
    stationVisibleRef,
    stationDismissingRef,
    bumpStationActivity,
    handleDockChange,
    handleDockCommit,
    handleStationPanelExpandedChange,
    handleTransferStationDrop,
    handleTransferStationDragEnter,
    handleTransferStationDragOver,
    handleTransferStationDragLeave,
    removeTransferItem,
    clearAllTransferItems,
    handleStationDragStart,
    handleStationDragEnd,
    replaceTransferItems,
    buildSectionsForSave,
    restoreAllTransferItemsToSections,
    findTransferItem,
    removeTransferItemFromState,
    prependTransferItem,
    showStation,
    commitDockPosition,
    enableStationDropPassthrough,
    disableStationDropPassthrough,
    setDockPosition,
    wakeStationForApproach,
    beginStationDismiss,
    draggingStationItemId,
    forceStationExpanded,
  };
}
