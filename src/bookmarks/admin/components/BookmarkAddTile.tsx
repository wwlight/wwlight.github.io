import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { adminBookmarkCardHeightClass, bookmarkCardShellClass } from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkAddTileProps {
  onClick: () => void;
  className?: string;
}

export function BookmarkAddTile({ onClick, className }: BookmarkAddTileProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "bookmark-card",
        bookmarkCardShellClass,
        adminBookmarkCardHeightClass,
        "h-full cursor-pointer items-center justify-center gap-1 border-dashed bg-muted/15 text-muted-foreground shadow-none hover:border-primary/35 hover:bg-accent/35 hover:text-foreground",
        className,
      )}
    >
      <Plus className="size-4 shrink-0" />
      <span className="text-xs font-medium">新增书签</span>
    </Card>
  );
}
