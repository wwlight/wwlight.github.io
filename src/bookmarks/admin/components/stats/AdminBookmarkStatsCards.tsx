/** 功能：管理端统计卡片第四格（中转站计数 + 拖拽说明）。 */
import { ArrowLeftRight } from "lucide-react";
import {
  BookmarkStatCard,
  BookmarkStatsCards,
  bookmarkStatEmphasisStyles,
} from "@/bookmarks/shared/components/BookmarkStatsCards";
import { DragInteractionHelpPopover } from "@/bookmarks/admin/components/stats/DragInteractionHelpPopover";
import { cn } from "@/lib/utils";

interface AdminBookmarkStatsCardsProps {
  sections: number;
  cards: number;
  bookmarks: number;
  transferStationCount: number;
  transferStationMax: number;
}

export function AdminBookmarkStatsCards({
  sections,
  cards,
  bookmarks,
  transferStationCount,
  transferStationMax,
}: AdminBookmarkStatsCardsProps) {
  const hintClass = bookmarkStatEmphasisStyles.base.hint;

  return (
    <BookmarkStatsCards
      sections={sections}
      cards={cards}
      bookmarks={bookmarks}
      gridClassName="sm:grid-cols-2 lg:grid-cols-4"
    >
      <BookmarkStatCard
        label="中转站"
        unit="个"
        hint="暂存队列"
        value={transferStationCount}
        icon={ArrowLeftRight}
        emphasis="base"
        headerAction={<DragInteractionHelpPopover maxItems={transferStationMax} />}
        valueSuffix={
          <span className={cn("text-base font-normal tabular-nums", hintClass)}>
            <span className="mx-1">/</span>
            {transferStationMax}
          </span>
        }
      />
    </BookmarkStatsCards>
  );
}
