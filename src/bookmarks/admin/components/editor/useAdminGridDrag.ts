/**
 * 功能：管理端网格拖拽 payload 状态、drop 处理与 drag 副作用。
 * 关联：AdminApp.tsx、useAdminTransferStation.ts
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type BookmarkDragTarget,
  getBookmarkInsertIndex,
  resolveDropBookmarkIndex,
} from "@/bookmarks/admin/lib/admin-grid-dnd";
import {
  cloneSections,
  computeDragPointerToCardCenterOffset,
  followTransferStationDockToCard,
  insertBookmark,
  insertTransferBookmark,
  isGridDragPayload,
  isStationDragPayload,
  normalizeSortOrders,
  parseDragPayload,
  readDragPayloadData,
  resolveTransferInsertIndex,
  resolveTransferStationSideFromPanel,
  swapBookmarks,
  type DragPayload,
  type TransferStationSide,
  writeDragPayloadData,
} from "@/bookmarks/admin/lib/admin-helpers";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import type { useAdminTransferStation } from "./useAdminTransferStation";

export interface AdminGridDragFns {
  readDragPayload: (event: React.DragEvent) => DragPayload | null;
  clearActiveDragPayload: () => void;
  clearDragUiState: () => void;
  scheduleClearActiveDragPayload: () => void;
  scheduleDragPayloadSync: (payload: DragPayload) => void;
  syncDragCardCenterOffset: (event: React.DragEvent<HTMLElement>) => void;
  cancelPendingDragPayloadFrame: () => void;
  dragOriginXRef: React.MutableRefObject<number | null>;
  dragOriginYRef: React.MutableRefObject<number | null>;
}

interface UseAdminGridDragParams {
  dragSessionPayloadRef: React.MutableRefObject<DragPayload | null>;
  dragPayloadRef: React.MutableRefObject<DragPayload | null>;
  dragEnabled: boolean;
  sectionsRef: React.MutableRefObject<BookmarkSectionData[]>;
  setSections: React.Dispatch<React.SetStateAction<BookmarkSectionData[]>>;
  updateSections: (updater: (prev: BookmarkSectionData[]) => BookmarkSectionData[]) => void;
  persistDraft: (sections: BookmarkSectionData[]) => void;
  modulePanelRef: React.RefObject<HTMLDivElement | null>;
  stationPanelRef: React.RefObject<HTMLElement | null>;
  transferStation: ReturnType<typeof useAdminTransferStation>;
  gridDragFnsRef: React.MutableRefObject<AdminGridDragFns>;
}

export function useAdminGridDrag({
  dragSessionPayloadRef,
  dragPayloadRef,
  dragEnabled,
  sectionsRef,
  setSections,
  updateSections,
  persistDraft,
  modulePanelRef,
  stationPanelRef,
  transferStation,
  gridDragFnsRef,
}: UseAdminGridDragParams) {
  const {
    transferItemsRef,
    dockRef,
    transferDropDepthRef,
    stationVisibleRef,
    stationDismissingRef,
    setDockPosition,
    wakeStationForApproach,
    beginStationDismiss,
    findTransferItem,
    removeTransferItemFromState,
    replaceTransferItems,
    commitDockPosition,
    enableStationDropPassthrough,
    disableStationDropPassthrough,
  } = transferStation;

  const [dragPayload, setDragPayload] = useState<DragPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [swapHover, setSwapHover] = useState<BookmarkDragTarget | null>(null);
  const [insertHover, setInsertHover] = useState<BookmarkDragTarget | null>(null);
  const [dragApproachSide, setDragApproachSide] = useState<TransferStationSide | null>(null);

  const dragOriginXRef = useRef<number | null>(null);
  const dragOriginYRef = useRef<number | null>(null);
  const dragCardPointerToCenterYRef = useRef<number | null>(null);
  const pendingDragPayloadFrameRef = useRef<number | null>(null);
  const transferFullToastShownRef = useRef(false);

  const gridDragPayload =
    parseDragPayload(dragSessionPayloadRef.current) ??
    (dragPayload && isGridDragPayload(dragPayload) ? dragPayload : null);
  const gridDragging = Boolean(dragEnabled && gridDragPayload && isGridDragPayload(gridDragPayload));
  const dragApproaching = Boolean(gridDragging && dragApproachSide != null);

  function cancelPendingDragPayloadFrame() {
    if (pendingDragPayloadFrameRef.current == null) return;
    cancelAnimationFrame(pendingDragPayloadFrameRef.current);
    pendingDragPayloadFrameRef.current = null;
  }

  function scheduleDragPayloadSync(payload: DragPayload) {
    cancelPendingDragPayloadFrame();
    pendingDragPayloadFrameRef.current = requestAnimationFrame(() => {
      pendingDragPayloadFrameRef.current = null;
      if (dragSessionPayloadRef.current !== payload) return;
      setDragPayload(payload);
    });
  }

  function setActiveDragPayload(payload: DragPayload | null) {
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    setDragPayload(payload);
  }

  const clearActiveDragPayload = useCallback(() => {
    cancelPendingDragPayloadFrame();
    disableStationDropPassthrough();
    dragSessionPayloadRef.current = null;
    dragPayloadRef.current = null;
    dragOriginXRef.current = null;
    dragOriginYRef.current = null;
    dragCardPointerToCenterYRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    transferStation.setTransferDropActive(false);
    setDragApproachSide(null);
    transferDropDepthRef.current = 0;
    transferFullToastShownRef.current = false;
    commitDockPosition();
  }, [commitDockPosition, disableStationDropPassthrough, dragPayloadRef, dragSessionPayloadRef, transferDropDepthRef, transferStation]);

  function clearDragUiState() {
    cancelPendingDragPayloadFrame();
    dragSessionPayloadRef.current = null;
    dragPayloadRef.current = null;
    dragCardPointerToCenterYRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    transferStation.setTransferDropActive(false);
    setDragApproachSide(null);
    transferDropDepthRef.current = 0;
    transferFullToastShownRef.current = false;
  }

  function scheduleClearActiveDragPayload() {
    cancelPendingDragPayloadFrame();
    requestAnimationFrame(() => {
      clearActiveDragPayload();
    });
  }

  function readDragPayload(event: React.DragEvent): DragPayload | null {
    return (
      parseDragPayload(dragSessionPayloadRef.current) ??
      readDragPayloadData(event.dataTransfer) ??
      parseDragPayload(dragPayloadRef.current ?? dragPayload)
    );
  }

  function syncDragCardCenterOffset(event: React.DragEvent<HTMLElement>) {
    const card =
      event.currentTarget.closest<HTMLElement>("[data-bookmark-card]") ?? event.currentTarget;
    const rect = card.getBoundingClientRect();
    dragCardPointerToCenterYRef.current = computeDragPointerToCardCenterOffset(
      event.clientY,
      rect,
    );
  }

  const applyDragApproach = useCallback(
    (side: TransferStationSide, clientY: number) => {
      setDragApproachSide(side);
      wakeStationForApproach();
      setDockPosition(
        followTransferStationDockToCard(
          dockRef.current,
          side,
          clientY,
          dragCardPointerToCenterYRef.current,
          window.innerHeight,
          { snap: false },
        ),
      );
    },
    [dockRef, setDockPosition, wakeStationForApproach],
  );

  const applyDragApproachRef = useRef(applyDragApproach);
  const beginStationDismissRef = useRef(beginStationDismiss);
  applyDragApproachRef.current = applyDragApproach;
  beginStationDismissRef.current = beginStationDismiss;

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    targetSectionIndex: number,
    targetCardIndex: number,
  ) {
    event.preventDefault();
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);

    const payload = readDragPayload(event);
    if (!payload) return;

    if (isStationDragPayload(payload)) {
      const item = findTransferItem(payload.itemId);
      if (!item) {
        clearActiveDragPayload();
        return;
      }

      const grid = event.currentTarget;
      const insertIndex = resolveTransferInsertIndex(grid, event.clientX, event.clientY);

      removeTransferItemFromState(payload.itemId);

      const next = cloneSections(sectionsRef.current);
      const moved = insertTransferBookmark(next, item.bookmark, {
        sectionIndex: targetSectionIndex,
        cardIndex: targetCardIndex,
        bookmarkIndex: insertIndex,
      });

      if (!moved) {
        replaceTransferItems([...transferItemsRef.current, item]);
        clearActiveDragPayload();
        return;
      }

      normalizeSortOrdersAndPersist(next);
      toast.success("书签已添加");
      clearActiveDragPayload();
      return;
    }

    if (!isGridDragPayload(payload)) return;

    const gridPayload = payload;
    const grid = event.currentTarget;
    const dropElement = document.elementFromPoint(event.clientX, event.clientY);
    const droppedOnCard = dropElement?.closest("[data-bookmark-card]") as HTMLElement | null;
    if (droppedOnCard && grid.contains(droppedOnCard)) {
      const droppedIndex = Number(droppedOnCard.dataset.bookmarkIndex);
      if (
        gridPayload.sectionIndex === targetSectionIndex &&
        gridPayload.cardIndex === targetCardIndex &&
        gridPayload.bookmarkIndex === droppedIndex
      ) {
        clearActiveDragPayload();
        return;
      }
    }

    const shiftInsert = event.shiftKey;
    const swapTargetIndex = shiftInsert
      ? null
      : resolveDropBookmarkIndex(
          grid,
          event.clientX,
          event.clientY,
          gridPayload,
          targetSectionIndex,
          targetCardIndex,
        );

    updateSections((prev) => {
      const insertIndex = shiftInsert
        ? resolveTransferInsertIndex(grid, event.clientX, event.clientY)
        : getBookmarkInsertIndex(
            grid,
            event.clientY,
            gridPayload,
            targetSectionIndex,
            targetCardIndex,
          );
      const changed =
        swapTargetIndex != null
          ? swapBookmarks(prev, gridPayload, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: swapTargetIndex,
            })
          : insertBookmark(prev, gridPayload, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: insertIndex,
            });

      if (changed) toast.success("排序已更新");
      return prev;
    });
    clearActiveDragPayload();
  }

  function normalizeSortOrdersAndPersist(next: BookmarkSectionData[]) {
    normalizeSortOrders(next);
    persistDraft(next);
    setSections(next);
  }

  useEffect(() => {
    if (!dragPayload) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [dragPayload]);

  useEffect(() => {
    if (!dragEnabled) return;

    function onDragOver(event: DragEvent) {
      const payload = parseDragPayload(dragSessionPayloadRef.current);
      if (!payload || !isGridDragPayload(payload)) return;

      event.preventDefault();

      const target = event.target;
      if (target instanceof Node && stationPanelRef.current?.contains(target)) return;

      const panel = modulePanelRef.current?.getBoundingClientRect();
      if (!panel) return;

      const resolvedSide = resolveTransferStationSideFromPanel(event.clientX, panel);
      if (resolvedSide) {
        applyDragApproachRef.current(resolvedSide, event.clientY);
        return;
      }

      setDragApproachSide((prev) => {
        if (prev == null) return null;
        if (
          transferItemsRef.current.length === 0 &&
          stationVisibleRef.current &&
          !stationDismissingRef.current
        ) {
          beginStationDismissRef.current();
        }
        return null;
      });
    }

    document.addEventListener("dragover", onDragOver, true);
    return () => {
      document.removeEventListener("dragover", onDragOver, true);
    };
  }, [
    dragEnabled,
    dragSessionPayloadRef,
    modulePanelRef,
    stationPanelRef,
    stationDismissingRef,
    stationVisibleRef,
    transferItemsRef,
  ]);

  gridDragFnsRef.current = {
    readDragPayload,
    clearActiveDragPayload,
    clearDragUiState,
    scheduleClearActiveDragPayload,
    scheduleDragPayloadSync,
    syncDragCardCenterOffset,
    cancelPendingDragPayloadFrame,
    dragOriginXRef,
    dragOriginYRef,
  };

  return {
    dragPayload,
    dropTarget,
    setDropTarget,
    swapHover,
    setSwapHover,
    insertHover,
    setInsertHover,
    dragApproachSide,
    gridDragging,
    dragApproaching,
    dragOriginXRef,
    dragOriginYRef,
    dragCardPointerToCenterYRef,
    transferFullToastShownRef,
    handleDrop,
    scheduleClearActiveDragPayload,
    scheduleDragPayloadSync,
    syncDragCardCenterOffset,
    readDragPayload,
    clearActiveDragPayload,
    clearDragUiState,
    cancelPendingDragPayloadFrame,
    enableStationDropPassthrough,
    writeDragPayloadData,
    dragSessionPayloadRef,
    dragPayloadRef,
  };
}
