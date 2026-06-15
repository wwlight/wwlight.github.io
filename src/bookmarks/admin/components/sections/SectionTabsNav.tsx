import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionJumpSelect } from "@/bookmarks/admin/components/sections/SectionJumpSelect";
import { BookmarkSearchInput } from "@/bookmarks/shared/components/BookmarkSearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { sectionMatchesSearch } from "@/bookmarks/shared/lib/search";
import { sectionBookmarkCount } from "@/bookmarks/shared/lib/section-helpers";
import {
  adminSectionTabsTriggerClass,
  sectionTabBadgeClass,
  sectionTabsListClass,
} from "@/bookmarks/shared/lib/toolbar-ui";
import { cn } from "@/lib/utils";

export interface SectionTabsNavProps {
  sections: BookmarkSectionData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onOpenSectionManage?: () => void;
  moduleSearch?: boolean;
  jumpSelect?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
}

export function SectionTabsNav({
  sections,
  selectedIndex,
  onSelect,
  onOpenSectionManage,
  moduleSearch = true,
  jumpSelect = false,
  query: queryProp,
  onQueryChange,
}: SectionTabsNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const skipInitialTabScrollRef = useRef(true);
  const [localQuery, setLocalQuery] = useState("");
  const query = queryProp ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const showSearch = moduleSearch && sections.length > 0;
  const showJumpSelect = jumpSelect && sections.length >= 10;
  const showTopRow = showSearch || onOpenSectionManage;

  const filteredSections = useMemo(() => {
    return sections
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => sectionMatchesSearch(section, query));
  }, [query, sections]);

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [filteredSections.length, updateScrollState]);

  useEffect(() => {
    if (skipInitialTabScrollRef.current) {
      skipInitialTabScrollRef.current = false;
      return;
    }

    const el = listRef.current;
    const active = el?.querySelector<HTMLElement>(`[data-section-tab="${selectedIndex}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [selectedIndex, filteredSections.length]);

  function scrollTabs(direction: "left" | "right") {
    listRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {showTopRow ? (
        <div className="flex items-center gap-2">
          {showSearch ? (
            <BookmarkSearchInput
              className="min-w-0 max-w-md flex-1"
              value={query}
              onChange={setQuery}
            />
          ) : null}
          {onOpenSectionManage ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1.5 px-2.5"
              title="模块与分组管理"
              onClick={onOpenSectionManage}
            >
              <Layers data-icon="inline-start" />
              结构管理
            </Button>
          ) : null}
        </div>
      ) : null}

      {sections.length > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            {canScrollLeft ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-0 z-20 shrink-0 -translate-y-1/2"
                  title="向左滚动"
                  onClick={() => scrollTabs("left")}
                >
                  <ChevronLeft />
                </Button>
              </>
            ) : null}
            {canScrollRight ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-0 z-20 shrink-0 -translate-y-1/2"
                  title="向右滚动"
                  onClick={() => scrollTabs("right")}
                >
                  <ChevronRight />
                </Button>
              </>
            ) : null}

            <div
              ref={listRef}
              className={cn(
                "overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden",
                canScrollLeft && "pl-9",
                canScrollRight && "pr-9",
              )}
            >
              <TabsList className={sectionTabsListClass}>
                {filteredSections.length === 0 ? (
                  <span className="px-2.5 text-xs text-muted-foreground">无匹配结果</span>
                ) : (
                  filteredSections.map(({ section, index }) => {
                    const count = sectionBookmarkCount(section);
                    return (
                      <TabsTrigger
                        key={section.title + index}
                        value={String(index)}
                        data-section-tab={index}
                        className={adminSectionTabsTriggerClass}
                      >
                        <span className="truncate">{section.title}</span>
                        <Badge variant="secondary" className={sectionTabBadgeClass}>
                          {count}
                        </Badge>
                      </TabsTrigger>
                    );
                  })
                )}
              </TabsList>
            </div>
          </div>

          {showJumpSelect ? (
            <SectionJumpSelect
              sections={sections}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
