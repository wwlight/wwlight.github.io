import { BookOpen, Bookmark, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/bookmarks/shared/components/UserAvatar";
import { cardIconClass } from "@/bookmarks/admin/lib/admin-helpers";
import { cn } from "@/lib/utils";

interface AdminUserMenuProps {
  name: string;
  onReturnToFrontend: () => void;
  onReturnToBlog: () => void;
  onLogout: () => void;
}

function deferMenuAction(action: () => void) {
  window.requestAnimationFrame(() => {
    action();
  });
}

const HOVER_CLOSE_DELAY_MS = 120;

export function AdminUserMenu({ name, onReturnToFrontend, onReturnToBlog, onLogout }: AdminUserMenuProps) {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerInsideRef = useRef(false);
  const openedByPointerRef = useRef(false);
  const [open, setOpen] = useState(false);

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

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-9 max-w-42 min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card py-0.5 pl-0.5 pr-1.5 shadow-sm outline-none transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-accent/60",
            cardIconClass,
          )}
          aria-label={`${name}，管理员菜单`}
          aria-expanded={open}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <UserAvatar name={name} size="sm" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium leading-none">{name}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="min-w-36 p-1"
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
