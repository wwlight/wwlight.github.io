import { useRef } from "react";
import { BookmarkCardFooter } from "@/components/admin/bookmarks/BookmarkCardFooter";
import { BookmarkCardPreview } from "@/components/admin/bookmarks/BookmarkCardPreview";
import { Card } from "@/components/ui/card";
import type { BookmarkData } from "@/lib/bookmarks/types";
import { adminBookmarkCardHeightClass, bookmarkCardShellClass } from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkCardProps {
  bookmark: BookmarkData;
  dragging?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
}

function setCardDragImage(event: React.DragEvent, card: HTMLElement) {
  const rect = card.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const clone = card.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  clone.style.left = "0";
  clone.style.width = `${rect.width}px`;
  clone.style.opacity = "1";
  clone.style.transform = "none";
  clone.style.height = "auto";
  clone.style.minHeight = "0";
  clone.style.pointerEvents = "none";
  clone.style.margin = "0";
  document.body.appendChild(clone);
  event.dataTransfer.setDragImage(clone, offsetX, offsetY);
  requestAnimationFrame(() => clone.remove());
}

function openBookmarkLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function BookmarkCard({
  bookmark,
  dragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: BookmarkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleDragStart(event: React.DragEvent<HTMLButtonElement>) {
    if (cardRef.current) setCardDragImage(event, cardRef.current);
    onDragStart(event);
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        bookmarkCardShellClass,
        adminBookmarkCardHeightClass,
        "h-full",
        dragging && [
          "h-auto self-start",
          "border-dashed shadow-none transition-none",
          "opacity-45 bg-muted/60",
          "dark:opacity-25 dark:bg-muted/20",
        ],
      )}
    >
      <BookmarkCardPreview bookmark={bookmark} />
      <BookmarkCardFooter
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenLink={() => openBookmarkLink(bookmark.url)}
      />
    </Card>
  );
}
