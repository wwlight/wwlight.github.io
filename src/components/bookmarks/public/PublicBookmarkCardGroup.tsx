import type { ReactNode } from "react";
import { bookmarkGroupTitleClass } from "@/components/bookmarks/public/ui-helpers";

interface PublicBookmarkCardGroupProps {
  title: string;
  showTitle?: boolean;
  children: ReactNode;
}

export function PublicBookmarkCardGroup({
  title,
  showTitle = true,
  children,
}: PublicBookmarkCardGroupProps) {
  return (
    <div>
      {showTitle ? (
        <div className="mb-2 min-h-7">
          <h3 className={bookmarkGroupTitleClass}>{title}</h3>
        </div>
      ) : null}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] items-stretch gap-3">
        {children}
      </div>
    </div>
  );
}
