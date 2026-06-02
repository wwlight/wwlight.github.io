import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BookmarkFavicon } from "@/bookmarks/shared/components/BookmarkFavicon";
import { TransferStationHeader } from "@/bookmarks/admin/components/TransferStationHeader";
import { useTransferStationPanelMotion } from "@/bookmarks/admin/hooks/useTransferStationPanelMotion";
import {
  setAdminDragImage,
} from "@/bookmarks/admin/components/ui-helpers";
import type {
  TransferStationDockState,
  TransferStationItem,
  TransferStationSide,
} from "@/bookmarks/admin/lib/admin-helpers";
import {
  getTransferStationDockPositionStyle,
  estimateTransferStationPanelHeight,
  estimateTransferStationPanelWidth,
  snapTransferStationDockPoint,
  TRANSFER_STATION_VIEWPORT_INSET_PX,
} from "@/bookmarks/admin/lib/admin-helpers";
import { cn } from "@/lib/utils";

const ITEM_ENTER_MS = 300;
const ITEM_LEAVE_MS = 260;
const DOCK_POINTER_DRAG_THRESHOLD_PX = 5;

interface DragTransferStationProps {
  items: TransferStationItem[];
  dock: TransferStationDockState;
  dragEnabled: boolean;
  gripEnabled: boolean;
  dropActive: boolean;
  gridDragging: boolean;
  dragApproaching: boolean;
  forceExpanded: boolean;
  panelExpanded: boolean;
  onPanelExpandedChange: (expanded: boolean) => void;
  entering?: boolean;
  dismissing?: boolean;
  sideFlipping?: boolean;
  draggingItemId: string | null;
  panelRef?: RefObject<HTMLElement | null>;
  onDockChange: (next: TransferStationDockState) => void;
  onDockCommit?: () => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onItemDragStart: (event: React.DragEvent<HTMLDivElement>, itemId: string) => void;
  onItemDragEnd: () => void;
}

type ItemPhase = "enter" | "stable" | "leave";

interface AnimatedRow {
  item: TransferStationItem;
  phase: ItemPhase;
}

function transferDropHint(side: TransferStationSide, gridDragging: boolean) {
  if (gridDragging) return "拖入此处";
  return side === "left" ? "向左拖入书签" : "向右拖入书签";
}

function useAnimatedTransferItems(items: TransferStationItem[]) {
  const [rows, setRows] = useState<AnimatedRow[]>(() =>
    items.map((item) => ({ item, phase: "stable" as const })),
  );
  const leaveTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setRows((prev) => {
      const seen = new Set<string>();
      const next: AnimatedRow[] = [];

      for (const row of prev) {
        seen.add(row.item.id);
        const fresh = items.find((item) => item.id === row.item.id);
        if (fresh) {
          next.push({
            item: fresh,
            phase: row.phase === "leave" ? "leave" : row.phase === "enter" ? "enter" : "stable",
          });
          continue;
        }
        if (row.phase !== "leave") {
          next.push({ item: row.item, phase: "leave" });
        } else {
          next.push(row);
        }
      }

      for (const item of items) {
        if (seen.has(item.id)) continue;
        next.push({ item, phase: "enter" });
      }

      return next;
    });
  }, [items]);

  useEffect(() => {
    for (const row of rows) {
      if (row.phase !== "leave") continue;
      if (leaveTimersRef.current.has(row.item.id)) continue;

      const id = row.item.id;
      leaveTimersRef.current.set(
        id,
        setTimeout(() => {
          leaveTimersRef.current.delete(id);
          setRows((prev) => prev.filter((entry) => entry.item.id !== id));
        }, ITEM_LEAVE_MS),
      );
    }
  }, [rows]);

  useEffect(() => {
    const hasEnter = rows.some((row) => row.phase === "enter");
    if (!hasEnter) return;

    const timer = setTimeout(() => {
      setRows((prev) =>
        prev.map((row) => (row.phase === "enter" ? { ...row, phase: "stable" } : row)),
      );
    }, ITEM_ENTER_MS);

    return () => clearTimeout(timer);
  }, [rows]);

  useEffect(() => {
    return () => {
      for (const timer of leaveTimersRef.current.values()) clearTimeout(timer);
      leaveTimersRef.current.clear();
    };
  }, []);

  return rows;
}

function TransferStationItemRow({
  item,
  side,
  gripEnabled,
  dragging,
  phase,
  onRemoveItem,
  onItemDragStart,
  onItemDragEnd,
}: {
  item: TransferStationItem;
  side: TransferStationSide;
  gripEnabled: boolean;
  dragging: boolean;
  phase: ItemPhase;
  onRemoveItem: (id: string) => void;
  onItemDragStart: (event: React.DragEvent<HTMLDivElement>, itemId: string) => void;
  onItemDragEnd: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function handleRowDragStart(event: React.DragEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      event.preventDefault();
      return;
    }
    if (rowRef.current) setAdminDragImage(event, rowRef.current);
    onItemDragStart(event, item.id);
  }

  return (
    <li
      className={cn(
        "transfer-station-item min-w-0",
        phase === "enter" && "transfer-station-item--enter",
        phase === "leave" && "transfer-station-item--leave",
      )}
      data-side={side}
    >
      <div
        ref={rowRef}
        draggable={gripEnabled}
        onDragStart={gripEnabled ? handleRowDragStart : undefined}
        onDragEnd={gripEnabled ? onItemDragEnd : undefined}
        aria-label={gripEnabled ? `拖出：${item.bookmark.title}` : undefined}
        className={cn(
          "transfer-station-item-card group flex select-none items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-card-foreground shadow",
          side === "left" && "flex-row-reverse",
          gripEnabled && [
            "cursor-grab hover:cursor-grab active:cursor-grabbing",
            "[&_*:not(button)]:cursor-[inherit]",
          ],
          dragging &&
            "border-dashed opacity-45 border-[color-mix(in_oklab,var(--ring)_35%,transparent)]",
        )}
      >
        <BookmarkFavicon url={item.bookmark.url} className="size-7 shrink-0 rounded-md" />
        <p
          className={cn(
            "min-w-0 flex-1 truncate text-sm font-medium leading-snug",
            side === "left" && "text-right",
          )}
        >
          {item.bookmark.title}
        </p>
        <button
          type="button"
          aria-label="移出中转站"
          className="admin-transfer-station-item-remove inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md [&_svg]:stroke-[1.85]"
          onClick={() => onRemoveItem(item.id)}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </li>
  );
}

export function DragTransferStation({
  items,
  dock,
  dragEnabled,
  gripEnabled,
  dropActive,
  gridDragging,
  dragApproaching,
  forceExpanded,
  panelExpanded,
  onPanelExpandedChange,
  entering = false,
  dismissing = false,
  sideFlipping = false,
  draggingItemId,
  panelRef,
  onDockChange,
  onDockCommit,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveItem,
  onClearAll,
  onItemDragStart,
  onItemDragEnd,
}: DragTransferStationProps) {
  const { side } = dock;
  const animatedRows = useAnimatedTransferItems(items);
  const emptyDropTarget = dragEnabled && gridDragging && items.length === 0;
  const showEmpty = animatedRows.length === 0;

  const asideRef = useRef<HTMLElement>(null);
  const dockRef = useRef(dock);
  const onDockChangeRef = useRef(onDockChange);
  const onDockCommitRef = useRef(onDockCommit);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const [dockDragging, setDockDragging] = useState(false);
  const [dockPointerActive, setDockPointerActive] = useState(false);
  const [approachSnap, setApproachSnap] = useState(false);
  const [approachFollowReady, setApproachFollowReady] = useState(false);
  const dockPointerSessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    dragging: boolean;
  } | null>(null);

  const panelOpen = panelExpanded || forceExpanded;
  const panelLocked = forceExpanded;
  const dockFollowing = dragApproaching && panelOpen && !dockDragging && approachFollowReady;
  const panelOpenRef = useRef(panelOpen);
  const itemsLengthRef = useRef(items.length);

  const { bodyWrapRef, bodyWrapHeight, panelInstant } = useTransferStationPanelMotion({
    panelOpen,
    forceExpanded,
    dragApproaching,
    contentRevision: showEmpty ? items.length : items.length + 1000,
  });

  dockRef.current = dock;
  onDockChangeRef.current = onDockChange;
  onDockCommitRef.current = onDockCommit;
  panelOpenRef.current = panelOpen;
  itemsLengthRef.current = items.length;

  useLayoutEffect(() => {
    if (!dragApproaching) {
      setApproachSnap(false);
      setApproachFollowReady(false);
      return;
    }

    setApproachSnap(true);
    setApproachFollowReady(false);

    const frame = window.requestAnimationFrame(() => {
      setApproachSnap(false);
      setApproachFollowReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [dragApproaching, dock.side]);

  const refreshDockPosition = useCallback(() => {
    const panelHeight = estimateTransferStationPanelHeight(items.length, panelOpen);
    const panelWidth = estimateTransferStationPanelWidth(panelOpen);
    const anchor = gridDragging && (dropActive || dragApproaching) ? "panel-center" : "icon-row";

    setPositionStyle({
      ...getTransferStationDockPositionStyle(
        dock.side,
        dock.top,
        panelWidth,
        panelHeight,
        window.innerWidth,
        window.innerHeight,
        TRANSFER_STATION_VIEWPORT_INSET_PX,
        anchor,
      ),
      width: undefined,
      height: undefined,
    });
  }, [dock.side, dock.top, items.length, panelOpen, gridDragging, dropActive, dragApproaching]);

  const assignAsideRef = useCallback(
    (node: HTMLElement | null) => {
      asideRef.current = node;
      if (panelRef) panelRef.current = node;
    },
    [panelRef],
  );

  useLayoutEffect(() => {
    if (dockPointerActive) return;
    refreshDockPosition();
  }, [dock.side, dock.top, panelOpen, items.length, dragApproaching, dockPointerActive, refreshDockPosition]);

  useEffect(() => {
    function handleResize() {
      refreshDockPosition();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [refreshDockPosition]);

  useEffect(() => {
    if (!dockPointerActive) return;

    function handlePointerMove(event: PointerEvent) {
      const session = dockPointerSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;

      if (!session.dragging) {
        const deltaX = event.clientX - session.startX;
        const deltaY = event.clientY - session.startY;
        if (Math.hypot(deltaX, deltaY) < DOCK_POINTER_DRAG_THRESHOLD_PX) return;
        session.dragging = true;
        setDockDragging(true);
      }

      const viewportHeight = window.innerHeight;
      const nextTop = snapTransferStationDockPoint((event.clientY / viewportHeight) * 100);
      const next = { ...dockRef.current, top: nextTop };
      onDockChangeRef.current(next);

      const panelHeight = estimateTransferStationPanelHeight(
        itemsLengthRef.current,
        panelOpenRef.current,
      );
      const panelWidth = estimateTransferStationPanelWidth(panelOpenRef.current);

      setPositionStyle({
        ...getTransferStationDockPositionStyle(
          next.side,
          next.top,
          panelWidth,
          panelHeight,
          window.innerWidth,
          viewportHeight,
          TRANSFER_STATION_VIEWPORT_INSET_PX,
          "icon-row",
        ),
        width: undefined,
        height: undefined,
      });
    }

    function finishDockPointer(event: PointerEvent) {
      const session = dockPointerSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;
      const wasDragging = session.dragging;
      dockPointerSessionRef.current = null;
      setDockDragging(false);
      setDockPointerActive(false);
      if (wasDragging) {
        onDockCommitRef.current?.();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDockPointer);
    window.addEventListener("pointercancel", finishDockPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDockPointer);
      window.removeEventListener("pointercancel", finishDockPointer);
    };
  }, [dockPointerActive]);

  function handleDockPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!dragEnabled) return;

    dockPointerSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };
    setDockPointerActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDockPointerUp(event: React.PointerEvent<HTMLElement>) {
    const session = dockPointerSessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;
    dockPointerSessionRef.current = null;
    setDockDragging(false);
    setDockPointerActive(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const panel = (
    <aside
      ref={assignAsideRef}
      className={cn(
        "admin-transfer-station select-none",
        panelOpen
          ? "admin-transfer-station--shell-expanded"
          : "admin-transfer-station--shell-collapsed",
        panelOpen ? "admin-transfer-station--panel-open" : "admin-transfer-station--panel-closed",
        entering && "admin-transfer-station--entering",
        dismissing && "admin-transfer-station--dismissing",
        sideFlipping && "admin-transfer-station--side-flipping",
        dragApproaching && panelOpen && "admin-transfer-station--drag-approach",
      )}
      data-edge={side}
      data-approach-snap={approachSnap || undefined}
      data-panel-instant={panelInstant || undefined}
      data-dock-dragging={dockDragging || undefined}
      data-dock-follow={dockFollowing || undefined}
      style={positionStyle}
      onDragEnter={dragEnabled ? onDragEnter : undefined}
      onDragOver={dragEnabled ? onDragOver : undefined}
      onDragLeave={dragEnabled ? onDragLeave : undefined}
      onDrop={dragEnabled ? onDrop : undefined}
    >
      <div className={cn("admin-transfer-station-shell", !panelOpen && "admin-transfer-station-shell--icon-only")}>
        <TransferStationHeader
          side={side}
          itemCount={items.length}
          panelOpen={panelOpen}
          panelLocked={panelLocked}
          dragEnabled={dragEnabled}
          dockDragging={dockDragging}
          onClearAll={onClearAll}
          onToggleExpanded={onPanelExpandedChange}
          onDockPointerDown={handleDockPointerDown}
          onDockPointerUp={handleDockPointerUp}
        />

        <div
          ref={bodyWrapRef}
          className="admin-transfer-station-body-wrap"
          style={{ height: bodyWrapHeight, boxSizing: "border-box" }}
        >
          <div className="admin-transfer-station-body">
            <div className="app-scrollbar admin-transfer-station-scroll--vertical">
              {showEmpty ? (
                <div
                  className={cn(
                    "transfer-station-empty admin-transfer-station-empty",
                    emptyDropTarget && dropActive && "admin-transfer-station-empty--active",
                  )}
                >
                  <p className="text-xs text-primary/50">
                    {transferDropHint(side, gridDragging)}
                  </p>
                </div>
              ) : (
                <ul className="admin-transfer-station-list--vertical">
                  {animatedRows.map(({ item, phase }) => (
                    <TransferStationItemRow
                      key={item.id}
                      item={item}
                      side={side}
                      gripEnabled={gripEnabled}
                      dragging={draggingItemId === item.id}
                      phase={phase}
                      onRemoveItem={onRemoveItem}
                      onItemDragStart={onItemDragStart}
                      onItemDragEnd={onItemDragEnd}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
}
