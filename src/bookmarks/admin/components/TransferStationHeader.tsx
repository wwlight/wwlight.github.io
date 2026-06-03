/** 功能：中转站顶栏（icon 槽、标题、计数、dock 拖拽手柄）。 */
import { useEffect, useRef } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  TRANSFER_STATION_ICON_TOGGLE_DEBOUNCE_MS,
  type TransferStationSide,
} from "@/bookmarks/admin/lib/admin-helpers";
import { cn } from "@/lib/utils";

const ICON_POINTER_DRAG_THRESHOLD_PX = 5;

interface TransferStationHeaderProps {
  side: TransferStationSide;
  itemCount: number;
  panelOpen: boolean;
  panelLocked: boolean;
  dragEnabled: boolean;
  dockDragging: boolean;
  onClearAll: () => void;
  onToggleExpanded: (expanded: boolean) => void;
  onDockPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onDockPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
}

function TransferStationIconCell({
  side,
  itemCount,
  panelOpen,
  panelLocked,
  dragEnabled,
  dockDragging,
  onClearAll,
  onToggleExpanded,
  onDockPointerDown,
  onDockPointerUp,
}: Pick<
  TransferStationHeaderProps,
  | "side"
  | "itemCount"
  | "panelOpen"
  | "panelLocked"
  | "dragEnabled"
  | "dockDragging"
  | "onClearAll"
  | "onToggleExpanded"
  | "onDockPointerDown"
  | "onDockPointerUp"
>) {
  const iconSessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    shiftKey: boolean;
    dragging: boolean;
  } | null>(null);
  const pendingExpandedRef = useRef<boolean | null>(null);
  const toggleDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toggleDebounceRef.current != null) {
        window.clearTimeout(toggleDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!panelLocked) return;
    if (toggleDebounceRef.current == null) return;
    window.clearTimeout(toggleDebounceRef.current);
    toggleDebounceRef.current = null;
    pendingExpandedRef.current = null;
  }, [panelLocked]);

  function queueToggleExpanded() {
    const base = pendingExpandedRef.current ?? panelOpen;
    pendingExpandedRef.current = !base;

    if (toggleDebounceRef.current != null) {
      window.clearTimeout(toggleDebounceRef.current);
    }

    toggleDebounceRef.current = window.setTimeout(() => {
      toggleDebounceRef.current = null;
      const target = pendingExpandedRef.current;
      pendingExpandedRef.current = null;
      if (target == null) return;
      onToggleExpanded(target);
    }, TRANSFER_STATION_ICON_TOGGLE_DEBOUNCE_MS);
  }

  function handleIconPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!dragEnabled) return;

    if (event.shiftKey) {
      event.preventDefault();
    }

    iconSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      shiftKey: event.shiftKey,
      dragging: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleIconPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const session = iconSessionRef.current;
    if (!session || event.pointerId !== session.pointerId || session.dragging) return;

    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;
    if (Math.hypot(deltaX, deltaY) < ICON_POINTER_DRAG_THRESHOLD_PX) return;

    session.dragging = true;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onDockPointerDown(event);
  }

  function handleIconPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const session = iconSessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;

    iconSessionRef.current = null;

    if (session.dragging) {
      onDockPointerUp(event);
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (itemCount > 0 && (session.shiftKey || event.shiftKey)) {
      event.preventDefault();
      event.stopPropagation();
      onClearAll();
      event.currentTarget.blur();
      return;
    }

    if (panelLocked) return;
    queueToggleExpanded();
  }

  const ariaLabel =
    itemCount > 0
      ? panelOpen
        ? "收起中转站，Shift 点击清空"
        : "展开中转站，Shift 点击清空"
      : panelOpen
        ? "收起中转站"
        : "展开中转站";

  return (
    <div
      className={cn(
        "admin-transfer-station-icon-cell",
        itemCount > 0 && "admin-transfer-station-icon-cell--has-count",
      )}
      data-side={side}
    >
      <ArrowLeftRight
        className="admin-transfer-station-icon-watermark"
        strokeWidth={1.25}
        aria-hidden
      />

      <ArrowLeftRight
        className="admin-transfer-station-icon-glyph"
        strokeWidth={1.75}
        aria-hidden
      />

      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "admin-transfer-station-icon-tab",
          dragEnabled && "cursor-grab",
          dockDragging && "cursor-grabbing",
        )}
        onPointerDown={handleIconPointerDown}
        onPointerMove={handleIconPointerMove}
        onPointerUp={handleIconPointerUp}
        onPointerCancel={handleIconPointerUp}
      />

      {itemCount > 0 ? (
        <span
          className="admin-transfer-station-count-badge admin-transfer-station-count-badge--tab"
          aria-hidden={panelOpen}
        >
          {itemCount}
        </span>
      ) : null}
    </div>
  );
}

export function TransferStationHeader({
  side,
  itemCount,
  panelOpen,
  panelLocked,
  dragEnabled,
  dockDragging,
  onClearAll,
  onToggleExpanded,
  onDockPointerDown,
  onDockPointerUp,
}: TransferStationHeaderProps) {
  const showMeta = panelOpen;

  const title = (
    <p
      className={cn(
        "shrink-0 text-sm font-medium tracking-wide text-primary",
        side === "left" && "text-right",
      )}
    >
      中转站
    </p>
  );

  const inlineBadge =
    itemCount > 0 ? (
      <span
        className="admin-transfer-station-badge-inline shrink-0"
        aria-label={`${itemCount} 个书签`}
        aria-hidden={!panelOpen}
      >
        {itemCount}
      </span>
    ) : null;

  const headerMeta =
    side === "left" ? (
      <>
        {inlineBadge}
        {title}
      </>
    ) : (
      <>
        {title}
        {inlineBadge}
      </>
    );

  function handleHeaderPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(".admin-transfer-station-icon-slot")) return;
    onDockPointerDown(event);
  }

  return (
    <div
      className={cn(
        "admin-transfer-station-header relative shrink-0 touch-none overflow-visible",
        dragEnabled && "cursor-grab",
        dockDragging && "cursor-grabbing",
      )}
      data-side={side}
      onPointerDown={handleHeaderPointerDown}
      onPointerUp={onDockPointerUp}
      onPointerCancel={onDockPointerUp}
    >
      <div className="relative flex h-full min-w-0 items-stretch">
        <div className="admin-transfer-station-icon-slot" data-side={side}>
          <TransferStationIconCell
            side={side}
            itemCount={itemCount}
            panelOpen={panelOpen}
            panelLocked={panelLocked}
            dragEnabled={dragEnabled}
            dockDragging={dockDragging}
            onClearAll={onClearAll}
            onToggleExpanded={onToggleExpanded}
            onDockPointerDown={onDockPointerDown}
            onDockPointerUp={onDockPointerUp}
          />
        </div>

        <div
          className={cn(
            "admin-transfer-station-header-meta flex min-w-0 flex-1 items-center gap-2 px-3",
            side === "left" ? "justify-end" : "justify-start",
            !showMeta && "admin-transfer-station-header-meta--hidden",
          )}
        >
          {headerMeta}
        </div>
      </div>
    </div>
  );
}
