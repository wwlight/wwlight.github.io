import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { sectionBookmarkCount } from "@/bookmarks/shared/lib/section-helpers";
import {
  sectionTabBadgeClass,
  sectionTabsListClass,
  sectionTabsTriggerClass,
} from "@/bookmarks/shared/lib/toolbar-ui";

interface NavSectionTabsNavProps {
  sections: BookmarkSectionData[];
}

export function NavSectionTabsNav({ sections }: NavSectionTabsNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [sections.length, updateScrollState]);

  function scrollTabs(direction: "left" | "right") {
    listRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  }

  if (sections.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {canScrollLeft ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0"
          title="向左滚动"
          onClick={() => scrollTabs("left")}
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : null}

      <div className="relative min-w-0 flex-1">
        {canScrollLeft ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-linear-to-r from-background to-transparent" />
        ) : null}
        {canScrollRight ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-linear-to-l from-background to-transparent" />
        ) : null}

        <div ref={listRef} className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <TabsList className={sectionTabsListClass}>
            {sections.map((section, index) => {
              const count = sectionBookmarkCount(section);
              return (
                <TabsTrigger
                  key={`${section.title}-${index}`}
                  value={String(index)}
                  data-section-tab={index}
                  className={sectionTabsTriggerClass}
                >
                  <span className="truncate">{section.title}</span>
                  <Badge variant="secondary" className={sectionTabBadgeClass}>
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>

      {canScrollRight ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0"
          title="向右滚动"
          onClick={() => scrollTabs("right")}
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
