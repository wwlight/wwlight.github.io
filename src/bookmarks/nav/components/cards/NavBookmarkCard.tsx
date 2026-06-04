import { Badge } from "@/components/ui/badge";
import { BookmarkFavicon } from "@/bookmarks/shared/components/BookmarkFavicon";
import { BookmarkOverflowText } from "@/bookmarks/shared/components/BookmarkOverflowText";
import {
  bookmarkCardPreviewRowClass,
  floatingBadgeClass,
  navBookmarkCardShellClass,
} from "@/bookmarks/shared/lib/card-ui";
import { resolveBookmarkBadgeVariant } from "@/bookmarks/shared/lib/badge-variants";
import type { BookmarkData } from "@/bookmarks/shared/types";
import { cn } from "@/lib/utils";

interface NavBookmarkCardProps {
  bookmark: BookmarkData;
}

export function NavBookmarkCard({ bookmark }: NavBookmarkCardProps) {
  return (
    <div className={navBookmarkCardShellClass}>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 rounded-[inherit]"
        aria-hidden
        tabIndex={-1}
      />
      {bookmark.badgeText ? (
        <Badge
          variant={resolveBookmarkBadgeVariant(bookmark.badgeVariant)}
          className={cn(floatingBadgeClass, "rounded-full px-1.5 py-0 text-badge")}
        >
          {bookmark.badgeText}
        </Badge>
      ) : null}
      <div className={bookmarkCardPreviewRowClass}>
        <BookmarkFavicon url={bookmark.url} className="pointer-events-none shrink-0" />
        <div className="min-w-0 flex-1 space-y-0.5">
          <BookmarkOverflowText
            href={bookmark.url}
            text={bookmark.title}
            className="text-sm font-medium leading-snug"
          />
          {bookmark.description ? (
            <BookmarkOverflowText
              href={bookmark.url}
              text={bookmark.description}
              className="text-xs leading-5 text-muted-foreground"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
