import { Badge } from "@/components/ui/badge";
import { BookmarkFavicon } from "@/components/bookmarks/BookmarkFavicon";
import { PublicBookmarkOverflowText } from "@/components/bookmarks/public/PublicBookmarkOverflowText";
import { floatingBadgeClass, publicBookmarkCardShellClass } from "@/components/bookmarks/public/ui-helpers";
import { resolveBookmarkBadgeVariant } from "@/lib/bookmarks/badge-variants";
import type { BookmarkData } from "@/lib/bookmarks/types";
import { cn } from "@/lib/utils";

interface PublicBookmarkCardProps {
  bookmark: BookmarkData;
}

export function PublicBookmarkCard({ bookmark }: PublicBookmarkCardProps) {
  const hasDescription = Boolean(bookmark.description);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(publicBookmarkCardShellClass)}
    >
      {bookmark.badgeText ? (
        <Badge
          variant={resolveBookmarkBadgeVariant(bookmark.badgeVariant)}
          className={cn(floatingBadgeClass, "rounded-full px-1.5 py-0 text-[10px]")}
        >
          {bookmark.badgeText}
        </Badge>
      ) : null}
      <div className="flex h-16 shrink-0 items-center overflow-hidden rounded-[inherit] px-3 py-3">
        <div className="flex w-full items-center gap-3">
          <BookmarkFavicon url={bookmark.url} />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <PublicBookmarkOverflowText
              as="span"
              text={bookmark.title}
              className="text-sm font-medium leading-snug"
            />
            {hasDescription ? (
              <PublicBookmarkOverflowText
                text={bookmark.description!}
                className="text-xs leading-5 text-muted-foreground"
              />
            ) : null}
          </div>
        </div>
      </div>
    </a>
  );
}
