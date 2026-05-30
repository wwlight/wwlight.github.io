import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";
import { cn } from "@/lib/utils";

interface BookmarkSectionPanelProps {
  section: BookmarkSectionData;
  showTitle?: boolean;
  headerActions?: ReactNode;
  children: ReactNode;
}

export function BookmarkSectionPanel({
  section,
  showTitle = true,
  headerActions,
  children,
}: BookmarkSectionPanelProps) {
  const showHeader = showTitle || headerActions;

  return (
    <Card>
      {showHeader ? (
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          {showTitle ? <CardTitle className="text-base">{section.title}</CardTitle> : <div />}
          {headerActions ? <div className="flex items-center gap-1">{headerActions}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn("space-y-5", !showHeader && "pt-6")}>{children}</CardContent>
    </Card>
  );
}
