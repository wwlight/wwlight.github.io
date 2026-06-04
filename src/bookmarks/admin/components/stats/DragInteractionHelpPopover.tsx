/** 功能：管理端统计区「?」浮层，说明拖拽 / 中转站交互；桌面 hover、触屏 click。 */
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { themeOverlaySurfaceClass } from "@/theme";
import { useHoverCapable } from "@/lib/use-hover-capable";
import { cn } from "@/lib/utils";

const dragHelpItems = [
  {
    title: "交换位置",
    body: "拖拽卡片到另一张卡片上，松手后两者交换位置。",
  },
  {
    title: "Shift 插入",
    body: "按住 Shift 再拖拽，将卡片插入目标位置，后续书签依次后移。",
  },
  {
    title: "空白插入",
    body: "拖到分组内空白区域，按指针位置插入排序。",
  },
  {
    title: "加入中转站",
    body: "拖向模块面板左右边缘，松手后暂存至中转站。",
  },
  {
    title: "拖出中转站",
    body: "从中转站拖回分组，按目标位置插入。",
  },
  {
    title: "中转站图标",
    body: "点击展开/收起；Shift + 点击清空并还原；拖拽图标可移动停靠位置。",
  },
  {
    title: "切换吸附侧",
    body: "双击屏幕左右边缘，可切换中转站吸附到左侧或右侧。",
  },
] as const;

const HOVER_CLOSE_DELAY_MS = 120;

export function DragInteractionHelpPopover({ maxItems }: { maxItems: number }) {
  const hoverCapable = useHoverCapable();
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function cancelClose() {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  }

  function handleOpen() {
    cancelClose();
    setOpen(true);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className="inline-flex"
        onMouseEnter={hoverCapable ? handleOpen : undefined}
        onMouseLeave={hoverCapable ? scheduleClose : undefined}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            tabIndex={hoverCapable ? -1 : 0}
            className={cn(
              "inline-flex size-5 items-center justify-center rounded-sm text-primary/55",
              "transition-colors hover:text-primary",
              "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "data-state-open:text-primary",
            )}
            aria-label="拖拽交互说明"
          >
            <CircleHelp className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="end"
          sideOffset={8}
          data-theme-surface="bookmarks"
          className={cn(
            themeOverlaySurfaceClass(),
            "app-scrollbar w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] select-none overflow-y-auto p-0 shadow-lg",
          )}
          onMouseEnter={hoverCapable ? cancelClose : undefined}
          onMouseLeave={hoverCapable ? scheduleClose : undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="border-b border-(--theme-ui-popover-border) px-3 py-2.5">
            <p className="text-sm font-medium">拖拽交互</p>
            <p className="mt-0.5 text-xs opacity-70">中转站最多 {maxItems} 个书签</p>
          </div>
          <ul className="space-y-2.5 px-3 py-2.5">
            {dragHelpItems.map(({ title, body }) => (
              <li key={title} className="space-y-0.5">
                <p className="text-xs font-medium">{title}</p>
                <p className="text-xs leading-5 opacity-70">{body}</p>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </div>
    </Popover>
  );
}
