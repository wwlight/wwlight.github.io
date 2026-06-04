import { Badge } from "@/components/ui/badge";
import { BookmarkFavicon } from "@/bookmarks/shared/components/BookmarkFavicon";
import { BookmarkOverflowText } from "@/bookmarks/shared/components/BookmarkOverflowText";
import { floatingBadgeClass, navBookmarkCardShellClass } from "@/bookmarks/nav/components/chrome/ui-helpers";
import { resolveBookmarkBadgeVariant } from "@/bookmarks/shared/lib/badge-variants";
import type { BookmarkData } from "@/bookmarks/shared/types";
import { cn } from "@/lib/utils";

interface NavBookmarkCardProps {
  bookmark: BookmarkData;
}

export function NavBookmarkCard({ bookmark }: NavBookmarkCardProps) {
  const hasDescription = Boolean(bookmark.description);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(navBookmarkCardShellClass)}
    >
      {bookmark.badgeText ? (
        <Badge
          variant={resolveBookmarkBadgeVariant(bookmark.badgeVariant)}
          className={cn(floatingBadgeClass, "rounded-full px-1.5 py-0 text-badge")}
        >
          {bookmark.badgeText}
        </Badge>
      ) : null}
      <BookmarkFavicon url={bookmark.url} />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <BookmarkOverflowText
          as="span"
          text={bookmark.title}
          className="text-sm font-medium leading-snug"
        />
        {hasDescription ? (
          <BookmarkOverflowText
            text={bookmark.description!}
            className="text-xs leading-5 text-muted-foreground"
          />
        ) : null}
      </div>
    </a>
  );
}
