/** 书签卡片标题/描述截断；溢出时 Tooltip（参考 web-flow EPTooltip：mouseenter 测宽） */
import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BookmarkOverflowTextProps {
  text: string;
  className?: string;
  /** 导航页：文本本身为外链，避免 Tooltip 嵌套在整卡 `<a>` 内 */
  href?: string;
  /** 管理端预览等可聚焦触发 */
  enableFocus?: boolean;
}

function isTruncated(el: HTMLElement) {
  return el.scrollWidth > el.offsetWidth;
}

export function BookmarkOverflowText({
  text,
  className,
  href,
  enableFocus = false,
}: BookmarkOverflowTextProps) {
  const ref = useRef<HTMLAnchorElement | HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  function updateOpen(next: boolean) {
    const el = ref.current;
    if (!el) {
      setOpen(false);
      return;
    }
    setOpen(next && isTruncated(el));
  }

  function handleMouseEnter() {
    updateOpen(true);
  }

  function handleMouseLeave() {
    setOpen(false);
  }

  function handleFocus() {
    if (enableFocus) updateOpen(true);
  }

  function handleBlur() {
    setOpen(false);
  }

  const sharedClass = cn("block min-w-0 w-full truncate", className);
  const interactionProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...(enableFocus ? { tabIndex: 0 as const } : {}),
  };

  const trigger = href ? (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={sharedClass}
      {...interactionProps}
    >
      {text}
    </a>
  ) : (
    <span ref={ref} className={sharedClass} {...interactionProps}>
      {text}
    </span>
  );

  return (
    <Tooltip open={open} onOpenChange={updateOpen} delayDuration={300}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6} className="max-w-xs text-xs leading-5">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
