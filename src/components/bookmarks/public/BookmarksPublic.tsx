import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { PublicBookmarkCard } from "@/components/bookmarks/public/PublicBookmarkCard";
import { PublicBookmarkCardGroup } from "@/components/bookmarks/public/PublicBookmarkCardGroup";
import { PublicSectionPanel } from "@/components/bookmarks/public/PublicSectionPanel";
import { PublicSectionTabsNav } from "@/components/bookmarks/public/PublicSectionTabsNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { clampSelectedSection } from "@/lib/bookmarks/section-helpers";
import { filterBookmarkSections } from "@/lib/bookmarks/search";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";
import { toolbarSearchInputClass } from "@/lib/bookmarks/toolbar-ui";
import { cn } from "@/lib/utils";

interface BookmarksPublicProps {
  sections: BookmarkSectionData[];
  actions?: ReactNode;
}

function countBookmarks(sections: BookmarkSectionData[]) {
  return sections.reduce(
    (sum, section) => sum + section.cards.reduce((n, card) => n + card.bookmarks.length, 0),
    0,
  );
}

export function BookmarksPublic({ sections, actions }: BookmarksPublicProps) {
  const [query, setQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);
  const normalizedQuery = query.trim().toLowerCase();
  const totalCount = useMemo(() => countBookmarks(sections), [sections]);

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
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">书签导航</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              共 {totalCount} 个链接 · {sections.length} 个模块
            </p>
          </div>
          {actions}
        </div>

        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、描述或模块…"
            autoComplete="off"
            className={toolbarSearchInputClass}
          />
        </div>
      </header>

      {hasResults ? (
        <Tabs
          value={String(sectionIndex)}
          onValueChange={(value) => setSelectedSection(Number(value))}
        >
          <PublicSectionTabsNav sections={visibleSections} />

          {visibleSections.map((section, sIndex) => (
            <TabsContent key={`${section.title}-${sIndex}`} value={String(sIndex)} className="mt-4">
              <PublicSectionPanel>
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
