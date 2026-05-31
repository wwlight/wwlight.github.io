import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { ArrowLeftRight, X } from "lucide-react";
import { BookmarkFavicon } from "@/components/bookmarks/BookmarkFavicon";
import { TransferStationHeader } from "@/components/admin/bookmarks/TransferStationHeader";
import {
  adminDropZoneHoverClass,
  setAdminDragImage,
} from "@/components/admin/bookmarks/ui-helpers";
import type { TransferStationItem, TransferStationSide } from "@/lib/bookmarks/admin-helpers";
import {
  getTransferStationDockMorphTargetStyle,
  getTransferStationDockPositionStyle,
  isTransferStationVerticalSide,
  loadTransferStationDock,
  persistTransferStationDock,
  resolveTransferStationDockSideFromAngle,
  snapTransferStationDockPoint,
} from "@/lib/bookmarks/admin-helpers";
import { cn } from "@/lib/utils";

const ITEM_ENTER_MS = 300;
const ITEM_LEAVE_MS = 260;
const HOVER_COLLAPSE_DELAY_MS = 30_000;
const EDGE_MORPH_MS = 400;
const DOCK_SIDE_CONFIRM_FRAMES = 2;

interface DragTransferStationProps {
  items: TransferStationItem[];
  side: TransferStationSide;
  dragEnabled: boolean;
  gripEnabled: boolean;
  dropActive: boolean;
  gridDragging: boolean;
  forceExpanded: boolean;
  draggingItemId: string | null;
  panelRef?: RefObject<HTMLElement | null>;
  onSideChange: (side: TransferStationSide) => void;
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

const tabEmphasis = {
  border: "border-primary/35",
  panel: "from-primary/28 via-primary/14 to-primary/6",
  watermark: "text-primary/22",
} as const;

function transferDropHint(side: TransferStationSide, gridDragging: boolean) {
  if (gridDragging) return "拖入此处";
  switch (side) {
    case "left":
      return "向左拖入书签";
    case "right":
      return "向右拖入书签";
    case "top":
      return "向上拖入书签";
    case "bottom":
      return "向下拖入书签";
  }
}

function measureDockNaturalSize(element: HTMLElement) {
  const prevWidth = element.style.width;
  const prevHeight = element.style.height;
  element.style.removeProperty("width");
  element.style.removeProperty("height");
  const size = { width: element.offsetWidth, height: element.offsetHeight };
  if (prevWidth) element.style.width = prevWidth;
  else element.style.removeProperty("width");
  if (prevHeight) element.style.height = prevHeight;
  else element.style.removeProperty("height");
  return size;
}

function useAnimatedTransferItems(items: TransferStationItem[]) {
  const [rows, setRows] = useState<AnimatedRow[]>(() =>
    items.map((item) => ({ item, phase: "stable" as const })),
  );
  const leaveTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const nextIds = new Set(items.map((item) => item.id));

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
          gripEnabled && [
            "cursor-grab hover:cursor-grab active:cursor-grabbing",
            "[&_*:not(button)]:cursor-[inherit]",
          ],
          dragging &&
            "border-dashed opacity-45 border-[color-mix(in_oklab,var(--ring)_35%,transparent)]",
        )}
      >
        <BookmarkFavicon url={item.bookmark.url} className="size-7 shrink-0 rounded-md" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium leading-snug">{item.bookmark.title}</p>
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
  side,
  dragEnabled,
  gripEnabled,
  dropActive,
  gridDragging,
  forceExpanded,
  draggingItemId,
  panelRef,
  onSideChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveItem,
  onClearAll,
  onItemDragStart,
  onItemDragEnd,
}: DragTransferStationProps) {
  const animatedRows = useAnimatedTransferItems(items);
  const vertical = isTransferStationVerticalSide(side);
  const showDropHint = dragEnabled && gridDragging && dropActive;
  const emptyDropTarget = dragEnabled && gridDragging && items.length === 0;
  const showEmpty = animatedRows.length === 0;

  const asideRef = useRef<HTMLElement>(null);
  const dockRef = useRef(loadTransferStationDock());
  const draggingOffsetRef = useRef({ x: 0, y: 0 });
  const sideRef = useRef(side);
  const onSideChangeRef = useRef(onSideChange);
  const edgeMorphLockRef = useRef(false);
  const edgeMorphTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphFromRectRef = useRef<DOMRect | null>(null);
  const pendingSideRef = useRef<TransferStationSide | null>(null);
  const pendingSideFramesRef = useRef(0);
  const prevSideRef = useRef(side);
  const [dockPoint, setDockPoint] = useState(() => ({
    left: dockRef.current.left,
    top: dockRef.current.top,
  }));
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const [hovered, setHovered] = useState(false);
  const [dockDragging, setDockDragging] = useState(false);
  const [edgeMorph, setEdgeMorph] = useState(false);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasItems = items.length > 0;
  const expanded = hovered || dockDragging || forceExpanded || hasItems;
  const tabStyle = tabEmphasis;

  sideRef.current = side;
  onSideChangeRef.current = onSideChange;

  const refreshDockPosition = useCallback(() => {
    if (edgeMorphLockRef.current) return;
    const element = asideRef.current;
    if (!element) return;
    setPositionStyle({
      ...getTransferStationDockPositionStyle(
        side,
        dockPoint.left,
        dockPoint.top,
        element.offsetWidth,
        element.offsetHeight,
        window.innerWidth,
        window.innerHeight,
      ),
      width: undefined,
      height: undefined,
    });
  }, [side, dockPoint.left, dockPoint.top]);

  const finishEdgeMorph = useCallback(() => {
    edgeMorphLockRef.current = false;
    setEdgeMorph(false);
    refreshDockPosition();
  }, [refreshDockPosition]);

  const startEdgeMorph = useCallback(
    (fromRect: DOMRect) => {
      edgeMorphLockRef.current = true;
      setEdgeMorph(true);
      if (edgeMorphTimerRef.current) clearTimeout(edgeMorphTimerRef.current);

      setPositionStyle({
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        right: "auto",
        bottom: "auto",
      });

      requestAnimationFrame(() => {
        const element = asideRef.current;
        if (!element) return;
        const { width, height } = measureDockNaturalSize(element);
        setPositionStyle(
          getTransferStationDockMorphTargetStyle(
            side,
            dockPoint.left,
            dockPoint.top,
            width,
            height,
            window.innerWidth,
            window.innerHeight,
          ),
        );
      });

      edgeMorphTimerRef.current = setTimeout(() => {
        edgeMorphTimerRef.current = null;
        finishEdgeMorph();
      }, EDGE_MORPH_MS);
    },
    [side, dockPoint.left, dockPoint.top, finishEdgeMorph],
  );

  const commitDockSideChange = useCallback((nextSide: TransferStationSide) => {
    if (nextSide === sideRef.current) return;
    const element = asideRef.current;
    if (element) {
      morphFromRectRef.current = element.getBoundingClientRect();
    }
    sideRef.current = nextSide;
    dockRef.current = { ...dockRef.current, side: nextSide };
    onSideChangeRef.current(nextSide);
  }, []);

  const assignAsideRef = useCallback(
    (node: HTMLElement | null) => {
      asideRef.current = node;
      if (panelRef) panelRef.current = node;
    },
    [panelRef],
  );

  useLayoutEffect(() => {
    dockRef.current = { ...dockRef.current, side };
  }, [side]);

  useLayoutEffect(() => {
    if (prevSideRef.current === side) return;

    const fromRect = morphFromRectRef.current;
    morphFromRectRef.current = null;
    if (fromRect) {
      startEdgeMorph(fromRect);
    }

    prevSideRef.current = side;
  }, [side, startEdgeMorph]);

  useLayoutEffect(() => {
    refreshDockPosition();
  }, [side, dockPoint.left, dockPoint.top, expanded, items.length, refreshDockPosition]);

  useEffect(() => {
    return () => {
      if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
      if (edgeMorphTimerRef.current) clearTimeout(edgeMorphTimerRef.current);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      refreshDockPosition();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [refreshDockPosition]);

  useEffect(() => {
    if (!dockDragging) return;

    function handlePointerMove(event: PointerEvent) {
      if (edgeMorphLockRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const anchorX = event.clientX - draggingOffsetRef.current.x;
      const anchorY = event.clientY - draggingOffsetRef.current.y;
      const nextSide = resolveTransferStationDockSideFromAngle(
        anchorX,
        anchorY,
        viewportWidth,
        viewportHeight,
        sideRef.current,
      );
      const nextLeft = snapTransferStationDockPoint((anchorX / viewportWidth) * 100);
      const nextTop = snapTransferStationDockPoint((anchorY / viewportHeight) * 100);

      if (nextSide !== sideRef.current) {
        if (pendingSideRef.current === nextSide) {
          pendingSideFramesRef.current += 1;
        } else {
          pendingSideRef.current = nextSide;
          pendingSideFramesRef.current = 1;
        }
        if (pendingSideFramesRef.current >= DOCK_SIDE_CONFIRM_FRAMES) {
          commitDockSideChange(nextSide);
          pendingSideRef.current = null;
          pendingSideFramesRef.current = 0;
          dockRef.current = { side: nextSide, left: nextLeft, top: nextTop };
          setDockPoint({ left: nextLeft, top: nextTop });
          return;
        }
      } else {
        pendingSideRef.current = null;
        pendingSideFramesRef.current = 0;
      }

      dockRef.current = { side: sideRef.current, left: nextLeft, top: nextTop };
      setDockPoint({ left: nextLeft, top: nextTop });

      const element = asideRef.current;
      if (!element) return;

      setPositionStyle({
        ...getTransferStationDockPositionStyle(
          sideRef.current,
          nextLeft,
          nextTop,
          element.offsetWidth,
          element.offsetHeight,
          viewportWidth,
          viewportHeight,
        ),
        width: undefined,
        height: undefined,
      });
    }

    function finishDockDrag() {
      setDockDragging(false);
      pendingSideRef.current = null;
      pendingSideFramesRef.current = 0;
      persistTransferStationDock(dockRef.current);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDockDrag);
    window.addEventListener("pointercancel", finishDockDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDockDrag);
      window.removeEventListener("pointercancel", finishDockDrag);
    };
  }, [dockDragging, commitDockSideChange]);

  function handleAsideMouseEnter() {
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
    setHovered(true);
  }

  function handleAsideMouseLeave() {
    if (hasItems) return;
    if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
    hoverLeaveTimerRef.current = setTimeout(() => {
      hoverLeaveTimerRef.current = null;
      setHovered(false);
    }, HOVER_COLLAPSE_DELAY_MS);
  }

  function handleDockPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!dragEnabled) return;
    if ((event.target as HTMLElement).closest("button")) return;

    const element = asideRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    draggingOffsetRef.current = {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    };
    setDockDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDockPointerUp(event: React.PointerEvent<HTMLElement>) {
    if (!dockDragging) return;
    setDockDragging(false);
    persistTransferStationDock(dockRef.current);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const panel = (
    <aside
      ref={assignAsideRef}
      className={cn(
        "admin-transfer-station select-none",
        expanded ? "admin-transfer-station--expanded" : "admin-transfer-station--collapsed",
      )}
      data-edge={side}
      data-dock-dragging={dockDragging || undefined}
      data-edge-morph={edgeMorph || undefined}
      style={positionStyle}
      onMouseEnter={handleAsideMouseEnter}
      onMouseLeave={handleAsideMouseLeave}
      onDragOver={dragEnabled ? onDragOver : undefined}
      onDragLeave={dragEnabled ? onDragLeave : undefined}
      onDrop={dragEnabled ? onDrop : undefined}
    >
      <div
        className={cn(
          "admin-transfer-station-tab relative touch-none overflow-hidden border bg-gradient-to-br",
          tabStyle.border,
          tabStyle.panel,
          dragEnabled && "cursor-grab",
          dockDragging && "cursor-grabbing",
        )}
        aria-label="中转站"
        onPointerDown={handleDockPointerDown}
        onPointerUp={handleDockPointerUp}
        onPointerCancel={handleDockPointerUp}
      >
        <ArrowLeftRight
          className={cn("pointer-events-none absolute -right-2 size-14 -rotate-12", tabStyle.watermark)}
          strokeWidth={1.25}
          aria-hidden
        />
        <ArrowLeftRight className="relative size-4 text-primary drop-shadow-sm" strokeWidth={1.75} />
        {items.length > 0 ? (
          <span className="admin-transfer-station-tab-badge" aria-hidden>
            {items.length}
          </span>
        ) : null}
      </div>

      <div className="admin-transfer-station-panel-wrap">
        <div
          className={cn(
            "admin-transfer-station-panel",
            (showDropHint || emptyDropTarget) && adminDropZoneHoverClass,
          )}
        >
          <TransferStationHeader
            itemCount={items.length}
            dragEnabled={dragEnabled}
            dockDragging={dockDragging}
            onClearAll={onClearAll}
            onDockPointerDown={handleDockPointerDown}
            onDockPointerUp={handleDockPointerUp}
          />

          <div className="admin-transfer-station-body">
            <div
              className={cn(
                "app-scrollbar",
                vertical
                  ? "admin-transfer-station-scroll--vertical"
                  : "admin-transfer-station-scroll--horizontal",
              )}
            >
              {showEmpty ? (
                <div
                  className={cn(
                    "transfer-station-empty admin-transfer-station-empty",
                    emptyDropTarget && "admin-transfer-station-empty--active",
                  )}
                >
                  <p className="text-xs text-muted-foreground">
                    {transferDropHint(side, gridDragging)}
                  </p>
                </div>
              ) : (
                <ul
                  className={
                    vertical
                      ? "admin-transfer-station-list--vertical"
                      : "admin-transfer-station-list--grid"
                  }
                >
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
