import type { HTMLAttributes, ReactNode } from "react";
import { BookmarkCardGrid } from "@/bookmarks/admin/components/BookmarkCardGrid";
import { bookmarkGroupTitleClass } from "./ui-helpers";

interface BookmarkCardGroupProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  showTitle?: boolean;
  gridClassName?: string;
  dropZoneClassName?: string;
  children: ReactNode;
}

export function BookmarkCardGroup({
  title,
  showTitle = true,
  gridClassName,
  dropZoneClassName,
  children,
  className,
  ...gridProps
}: BookmarkCardGroupProps) {
  return (
    <div className={className}>
      {showTitle ? (
        <div className="mb-2 min-h-7">
          <h3 className={bookmarkGroupTitleClass}>{title}</h3>
        </div>
      ) : null}
      <div className={dropZoneClassName} {...gridProps}>
        <BookmarkCardGrid className={gridClassName}>{children}</BookmarkCardGrid>
      </div>
    </div>
  );
}
