import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { BookmarkFavicon } from "@/components/bookmarks/BookmarkFavicon";
import { BookmarkOverflowText } from "@/components/admin/bookmarks/BookmarkOverflowText";
import { resolveBookmarkBadgeVariant } from "@/lib/bookmarks/badge-variants";
import type { BookmarkData } from "@/lib/bookmarks/types";
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
      <CardContent className={adminBookmarkCardPreviewClass}>
        <div className="flex w-full items-center gap-3">
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
      </CardContent>
    </>
  );
}
