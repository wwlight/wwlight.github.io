import { useRef } from "react";
import { BookmarkCardFooter } from "@/bookmarks/admin/components/BookmarkCardFooter";
import { BookmarkCardPreview } from "@/bookmarks/admin/components/BookmarkCardPreview";
import { Card } from "@/components/ui/card";
import type { BookmarkData } from "@/bookmarks/shared/types";
import {
  adminBookmarkCardHeightClass,
  bookmarkCardShellClass,
  setAdminDragImage,
} from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkCardProps {
  bookmark: BookmarkData;
  dragging?: boolean;
  dragEnabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

function openBookmarkLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function BookmarkCard({
  bookmark,
  dragging,
  dragEnabled = true,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: BookmarkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      event.preventDefault();
      return;
    }
    if (cardRef.current) setAdminDragImage(event, cardRef.current);
    onDragStart(event);
  }

  return (
    <Card
      ref={cardRef}
      draggable={dragEnabled}
      onDragStart={dragEnabled ? handleDragStart : undefined}
      onDragEnd={dragEnabled ? onDragEnd : undefined}
      aria-label={dragEnabled ? `拖拽：${bookmark.title}` : undefined}
      className={cn(
        "bookmark-card admin-bookmark-card",
        bookmarkCardShellClass,
        adminBookmarkCardHeightClass,
        "h-full",
        dragEnabled && [
          "cursor-grab active:cursor-grabbing",
          "[&_*:not(button)]:cursor-[inherit]",
        ],
        dragging && "admin-bookmark-card--dragging",
      )}
    >
      <BookmarkCardPreview bookmark={bookmark} />
      <BookmarkCardFooter
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenLink={() => openBookmarkLink(bookmark.url)}
      />
    </Card>
  );
}
