import { BookOpen, Bookmark, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkOverflowText } from "@/components/admin/bookmarks/BookmarkOverflowText";
import { cardIconClass } from "@/lib/bookmarks/admin-helpers";
import { cn } from "@/lib/utils";

interface AdminUserMenuProps {
  name: string;
  onReturnToFrontend: () => void;
  onReturnToBlog: () => void;
  onLogout: () => void;
}

function AdminAvatar({ name }: { name: string }) {
  const initial = (name.trim().charAt(0) || "A").toUpperCase();

  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900",
        "shadow-[0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.14)]",
        "ring-1 ring-black/10 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:ring-white/20",
      )}
      aria-hidden
    >
      <span className="relative text-[13px] font-semibold leading-none tracking-tight text-white dark:text-neutral-900">
        {initial}
      </span>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/12 to-white/0 dark:via-black/5"
        aria-hidden
      />
    </div>
  );
}

function deferMenuAction(action: () => void) {
  window.requestAnimationFrame(() => {
    action();
  });
}

const HOVER_CLOSE_DELAY_MS = 120;

export function AdminUserMenu({ name, onReturnToFrontend, onReturnToBlog, onLogout }: AdminUserMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerInsideRef = useRef(false);
  const openedByPointerRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number>();

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  };

  const handlePointerEnter = () => {
    openedByPointerRef.current = true;
    pointerInsideRef.current = true;
    clearCloseTimer();
    setOpen(true);
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (!pointerInsideRef.current) handleOpenChange(false);
    }, HOVER_CLOSE_DELAY_MS);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      clearCloseTimer();
      setOpen(true);
      return;
    }

    openedByPointerRef.current = false;
    pointerInsideRef.current = false;
    clearCloseTimer();
    setOpen(false);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useLayoutEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const updateWidth = () => setTriggerWidth(node.getBoundingClientRect().width);

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [name]);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "group flex min-w-0 cursor-pointer items-center gap-1 rounded-lg border border-border bg-card py-1 pl-1.5 pr-1 shadow-sm outline-none transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-accent/60",
            cardIconClass,
          )}
          aria-label="管理员菜单"
          aria-expanded={open}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <AdminAvatar name={name} />
          <div className="min-w-0 flex-1 px-1 text-left">
            <BookmarkOverflowText
              as="span"
              text={name}
              enableFocus={false}
              className="text-sm font-medium leading-none"
            />
            <p className="mt-1 text-[11px] leading-none text-muted-foreground">Administrator</p>
          </div>
          <ChevronDown className="size-3.5 shrink-0 text-foreground/65 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground/85" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="min-w-0 p-1.5"
        style={triggerWidth ? { width: triggerWidth } : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...({
          onOpenAutoFocus: (event: Event) => {
            if (openedByPointerRef.current) event.preventDefault();
          },
          onCloseAutoFocus: (event: Event) => {
            if (openedByPointerRef.current) event.preventDefault();
          },
        } as Record<string, unknown>)}
      >
        <DropdownMenuItem onSelect={() => deferMenuAction(onReturnToBlog)}>
          <BookOpen />
          <span>返回博客</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => deferMenuAction(onReturnToFrontend)}>
          <Bookmark />
          <span>返回书签</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
          onSelect={() => deferMenuAction(onLogout)}
        >
          <LogOut />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
