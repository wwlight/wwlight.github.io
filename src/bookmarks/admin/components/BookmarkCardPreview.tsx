import { Badge } from "@/components/ui/badge";
import { BookmarkFavicon } from "@/bookmarks/shared/components/BookmarkFavicon";
import { BookmarkOverflowText } from "@/bookmarks/admin/components/BookmarkOverflowText";
import { resolveBookmarkBadgeVariant } from "@/bookmarks/shared/lib/badge-variants";
import type { BookmarkData } from "@/bookmarks/shared/types";
import { adminBookmarkCardPreviewClass, floatingBadgeClass } from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkCardPreviewProps {
  bookmark: BookmarkData;
}

export function BookmarkCardPreview({ bookmark }: BookmarkCardPreviewProps) {
  const hasDescription = Boolean(bookmark.description);

  return (
    <>
      {bookmark.badgeText && (
        <Badge
          variant={resolveBookmarkBadgeVariant(bookmark.badgeVariant)}
          className={cn(floatingBadgeClass, "rounded-full px-1.5 py-0 text-[10px]")}
        >
          {bookmark.badgeText}
        </Badge>
      )}
      <div className={adminBookmarkCardPreviewClass}>
        <BookmarkFavicon url={bookmark.url} data-bookmark-card-icon />
        <div
          data-bookmark-card-content
          className="flex min-w-0 flex-1 flex-col justify-center gap-0.5"
        >
          <BookmarkOverflowText
            as="span"
            text={bookmark.title}
            className="text-sm font-medium leading-snug"
          />
          {hasDescription && (
            <BookmarkOverflowText
              text={bookmark.description!}
              className="text-xs leading-5 text-muted-foreground"
            />
          )}
        </div>
      </div>
    </>
  );
}
