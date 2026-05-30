import type { ReactNode } from "react";
import { bookmarkGroupTitleClass } from "@/components/bookmarks/public/ui-helpers";
import { cn } from "@/lib/utils";

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
      <div className="mb-2 flex min-h-7 items-center gap-2">
        <h3 className={cn(bookmarkGroupTitleClass, !showTitle && "invisible")}>{title}</h3>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] items-stretch gap-3">
        {children}
      </div>
    </div>
  );
}
