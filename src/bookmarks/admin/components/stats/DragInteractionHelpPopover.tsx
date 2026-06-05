/** 功能：管理端统计区「?」浮层，说明拖拽 / 中转站交互；桌面 hover、触屏 click。 */
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { themeOverlaySurfaceClass } from "@/theme";
import { useHoverCapable } from "@/lib/use-hover-capable";
import { cn } from "@/lib/utils";

const dragHelpItems = [
  { title: "交换位置", body: "拖到另一卡片上松手互换" },
  { title: "Shift 插入", body: "按住 Shift 拖拽，插入目标位并后移" },
  { title: "空白插入", body: "拖到分组空白处按指针插入" },
  { title: "加入中转站", body: "拖向模块左右边缘松手暂存" },
  { title: "拖出中转站", body: "拖回分组按目标位插入" },
  { title: "中转站图标", body: "点击展开/收起；Shift+点击清空还原；拖拽移停靠" },
  { title: "切换吸附侧", body: "双击屏幕左右边缘切换吸附侧" },
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
