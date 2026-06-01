import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const headerEmphasis = {
  border: "border-primary/35",
  bg: "from-primary/14 via-primary/6 to-primary/10",
  panel: "from-primary/28 via-primary/14 to-primary/6",
  watermark: "text-primary/22",
  hint: "text-primary/50",
} as const;

interface TransferStationHeaderProps {
  itemCount: number;
  dragEnabled: boolean;
  dockDragging: boolean;
  onClearAll: () => void;
  onDockPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onDockPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
}

function transferHeaderHint(itemCount: number, dragEnabled: boolean) {
  if (itemCount > 0) {
    return dragEnabled ? "拖出到目标分组" : "请在桌面端拖出到目标分组";
  }
  return "松手暂存书签";
}

export function TransferStationHeader({
  itemCount,
  dragEnabled,
  dockDragging,
  onClearAll,
  onDockPointerDown,
  onDockPointerUp,
}: TransferStationHeaderProps) {
  const style = headerEmphasis;

  return (
    <div
      className={cn(
        "admin-transfer-station-header relative touch-none overflow-hidden border-b",
        style.border,
        dragEnabled && "cursor-grab",
        dockDragging && "cursor-grabbing",
      )}
      onPointerDown={onDockPointerDown}
      onPointerUp={onDockPointerUp}
      onPointerCancel={onDockPointerUp}
    >
      <div
        className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", style.bg)}
        aria-hidden
      />

      <div className="relative flex items-stretch">
        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium tracking-wide text-primary">中转站</p>
            {itemCount > 0 ? (
              <span className="admin-transfer-station-badge-inline" aria-label={`${itemCount} 个书签`}>
                {itemCount}
              </span>
            ) : null}
          </div>
          <p className={cn("mt-1 text-[11px] leading-snug", style.hint)}>
            {transferHeaderHint(itemCount, dragEnabled)}
          </p>
        </div>

        {itemCount > 0 ? (
          <button
            type="button"
            aria-label="清空中转站"
            className={cn(
              "admin-transfer-station-header-clear relative flex w-14 shrink-0 items-center justify-center overflow-hidden border-l bg-gradient-to-br",
              style.border,
              style.panel,
            )}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onClearAll();
            }}
          >
            <ArrowLeftRight
              className={cn("pointer-events-none absolute -right-2 size-20 -rotate-12", style.watermark)}
              strokeWidth={1.25}
              aria-hidden
            />
            <ArrowLeftRight
              className="admin-transfer-station-header-clear-icon relative size-6 text-primary drop-shadow-sm"
              strokeWidth={1.75}
            />
          </button>
        ) : (
          <div
            className={cn(
              "relative flex w-14 shrink-0 items-center justify-center overflow-hidden border-l bg-gradient-to-br",
              style.border,
              style.panel,
            )}
            aria-hidden
          >
            <ArrowLeftRight
              className={cn("absolute -right-2 size-20 -rotate-12", style.watermark)}
              strokeWidth={1.25}
            />
            <ArrowLeftRight className="relative size-6 text-primary drop-shadow-sm" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
