import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { BookmarkStatsCards } from "@/components/bookmarks/shared/BookmarkStatsCards";
import { BookmarkPageHeader } from "@/components/bookmarks/shared/BookmarkPageHeader";
import { PublicBookmarkCard } from "@/components/bookmarks/public/PublicBookmarkCard";
import { countBookmarkStats } from "@/lib/bookmarks/stats";
import { PublicBookmarkCardGroup } from "@/components/bookmarks/public/PublicBookmarkCardGroup";
import { PublicSectionPanel } from "@/components/bookmarks/public/PublicSectionPanel";
import { PublicSectionTabsNav } from "@/components/bookmarks/public/PublicSectionTabsNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { clampSelectedSection } from "@/lib/bookmarks/section-helpers";
import { filterBookmarkSections } from "@/lib/bookmarks/search";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";
import { bookmarkSearchPlaceholder, toolbarSearchInputClass } from "@/lib/bookmarks/toolbar-ui";
import { cn } from "@/lib/utils";

interface BookmarksPublicProps {
  sections: BookmarkSectionData[];
  actions?: ReactNode;
}

export function BookmarksPublic({ sections, actions }: BookmarksPublicProps) {
  const [query, setQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);
  const normalizedQuery = query.trim().toLowerCase();
  const stats = useMemo(() => countBookmarkStats(sections), [sections]);

  const visibleSections = useMemo(
    () => filterBookmarkSections(sections, normalizedQuery),
    [sections, normalizedQuery],
  );

  const sectionIndex = clampSelectedSection(visibleSections, selectedSection);
  const hasResults = visibleSections.length > 0;

  useEffect(() => {
    setSelectedSection((prev) => clampSelectedSection(visibleSections, prev));
  }, [visibleSections]);

  return (
    <div className="space-y-4">
      <BookmarkPageHeader
        title="书签导航"
        description="按模块分类整理，方便浏览与查找。"
        actions={actions}
      />

      <BookmarkStatsCards
        sections={stats.sections}
        cards={stats.cards}
        bookmarks={stats.bookmarks}
      />

      <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={bookmarkSearchPlaceholder}
            autoComplete="off"
            className={toolbarSearchInputClass}
          />
        </div>

      {hasResults ? (
        <Tabs
          value={String(sectionIndex)}
          onValueChange={(value) => setSelectedSection(Number(value))}
        >
          <PublicSectionTabsNav sections={visibleSections} />

          {visibleSections.map((section, sIndex) => (
            <TabsContent key={`${section.title}-${sIndex}`} value={String(sIndex)} className="mt-4">
              <PublicSectionPanel title={section.title}>
                {section.cards.map((card, cardIndex) => (
                  <PublicBookmarkCardGroup
                    key={`${card.title}-${cardIndex}`}
                    title={card.title}
                    showTitle={section.cards.length > 1}
                  >
                    {card.bookmarks.map((bookmark, bookmarkIndex) => (
                      <PublicBookmarkCard
                        key={`${bookmark.url}-${bookmarkIndex}`}
                        bookmark={bookmark}
                      />
                    ))}
                  </PublicBookmarkCardGroup>
                ))}
              </PublicSectionPanel>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div
          className={cn(
            "rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground",
          )}
        >
          没有匹配的书签
        </div>
      )}
    </div>
  );
}
